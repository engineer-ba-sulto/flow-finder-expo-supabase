import React, { useState, useEffect, useCallback } from "react";
import { ActivityIndicator, Text, View, ScrollView, Pressable, TextInput, Alert } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { getSupabaseClient } from "../../lib/supabase";
import { GoalForm } from "../../components/forms/GoalForm";
import { CreateGoalInput } from "../../types/goal.types";

/**
 * ゴール管理画面コンポーネント（段階的復旧中）
 *
 * 安全にゴール管理機能を段階的に復旧しています。
 */
const Goals: React.FC = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  
  // ローカル状態管理
  const [isLoading, setIsLoading] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // ゴール作成フォーム関連
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // ゴール編集フォーム関連
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // 実際のSupabaseからのゴール取得
  const fetchGoals = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseClient();
      const { data, error: fetchError } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("ゴール取得エラー:", fetchError);
        setError("ゴールの取得に失敗しました");
        setGoals([]);
      } else {
        setGoals(data || []);
      }
    } catch (err) {
      console.error("ネットワークエラー:", err);
      setError("通信エラーが発生しました");
      setGoals([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // 認証済みユーザーのゴール取得
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // ゴール作成機能（GoalFormコンポーネント用）
  const createGoal = useCallback(async (goalData: CreateGoalInput) => {
    if (!isAuthenticated || !user) {
      Alert.alert("エラー", "認証が必要です");
      return;
    }

    setIsCreating(true);

    try {
      const supabase = getSupabaseClient();
      
      // まずgoalsテーブルの存在確認
      console.log("goalsテーブルの存在確認...");
      const { error: tableError } = await supabase
        .from("goals")
        .select("count", { count: "exact", head: true });

      if (tableError) {
        console.error("テーブル確認エラー:", tableError);
        if (tableError.code === "42P01") {
          Alert.alert(
            "テーブルが存在しません", 
            "goalsテーブルが作成されていません。\n\nSupabaseダッシュボードで以下のSQLを実行してください：\n\nCREATE TABLE goals (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id UUID REFERENCES users(id),\n  title TEXT NOT NULL,\n  description TEXT,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);"
          );
          return;
        }
      }

      // ユーザー情報をログ出力（デバッグ用）
      console.log("認証ユーザー情報:", {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      });

      // usersテーブルでユーザー存在確認、存在しない場合は自動作成
      console.log("usersテーブルでユーザー確認・作成中...");
      const { data: existingUser, error: userCheckError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (userCheckError && userCheckError.code !== "PGRST116") {
        // PGRST116以外のエラー（PGRST116は「見つからない」エラー）
        console.error("ユーザー確認エラー:", userCheckError);
        Alert.alert("エラー", `ユーザー確認に失敗しました: ${userCheckError.message}`);
        return;
      }

      if (!existingUser) {
        // ユーザーが存在しない場合、usersテーブルに追加
        console.log("ユーザーが存在しないため、usersテーブルに追加中...");
        const { error: createUserError } = await supabase
          .from("users")
          .insert([
            {
              id: user.id,
              email: user.email,
            }
          ]);

        if (createUserError) {
          console.error("ユーザー作成エラー:", createUserError);
          Alert.alert("エラー", `ユーザーの作成に失敗しました: ${createUserError.message}`);
          return;
        }
        
        console.log("ユーザーをusersテーブルに追加しました");
      } else {
        console.log("ユーザーは既にusersテーブルに存在します");
      }

      // GoalFormから受け取ったデータを使用（user_idを現在のユーザーで上書き）
      const finalGoalData = {
        ...goalData,
        user_id: user.id,
      };

      console.log("作成するゴールデータ:", finalGoalData);

      const { error: createError } = await supabase
        .from("goals")
        .insert([finalGoalData])
        .select();

      if (createError) {
        console.error("ゴール作成エラー:", createError);
        console.error("エラー詳細:", JSON.stringify(createError, null, 2));
        
        let errorMessage = `ゴールの作成に失敗しました\n\n詳細: ${createError.message || createError.toString()}`;
        
        // 外部キー制約エラーの場合、具体的な解決策を提示
        if (createError.code === "23503") {
          errorMessage += `\n\n🔧 解決策：\n1. Supabaseダッシュボードで以下のSQLを実行：\n   ALTER TABLE goals DROP CONSTRAINT goals_user_id_fkey;\n\n2. または外部キー参照を変更：\n   ALTER TABLE goals ADD CONSTRAINT goals_user_id_fkey \n   FOREIGN KEY (user_id) REFERENCES users(id);`;
        }
        
        Alert.alert("エラー", errorMessage);
      } else {
        // 成功時の処理
        setShowCreateForm(false);
        Alert.alert("成功", "ゴールを作成しました");
        
        // リストを再取得
        await fetchGoals();
      }
    } catch (err) {
      console.error("ネットワークエラー:", err);
      Alert.alert("エラー", "通信エラーが発生しました");
    } finally {
      setIsCreating(false);
    }
  }, [isAuthenticated, user, fetchGoals]);

  // ゴール更新機能（GoalFormコンポーネント用）
  const updateGoal = useCallback(async (goalData: CreateGoalInput) => {
    if (!isAuthenticated || !user || !editingGoal) {
      Alert.alert("エラー", "更新対象のゴールが見つかりません");
      return;
    }

    setIsUpdating(true);

    try {
      const supabase = getSupabaseClient();
      
      const updateData = {
        title: goalData.title,
        description: goalData.description || null,
        priority: goalData.priority,
        updated_at: new Date().toISOString(),
      };

      console.log("更新するゴールデータ:", updateData);

      const { error: updateError } = await supabase
        .from("goals")
        .update(updateData)
        .eq("id", editingGoal.id)
        .eq("user_id", user.id)
        .select();

      if (updateError) {
        console.error("ゴール更新エラー:", updateError);
        Alert.alert("エラー", `ゴールの更新に失敗しました: ${updateError.message}`);
      } else {
        // 成功時の処理
        resetEditForm();
        Alert.alert("成功", "ゴールを更新しました");
        
        // リストを再取得
        await fetchGoals();
      }
    } catch (err) {
      console.error("ネットワークエラー:", err);
      Alert.alert("エラー", "通信エラーが発生しました");
    } finally {
      setIsUpdating(false);
    }
  }, [isAuthenticated, user, editingGoal, fetchGoals]);

  // ゴール削除機能
  const deleteGoal = useCallback(async (goal: any) => {
    if (!isAuthenticated || !user || !goal) return;

    Alert.alert(
      "ゴールを削除",
      `本当に「${goal.title}」を削除しますか？この操作は取り消せません。`,
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "削除",
          style: "destructive",
          onPress: async () => {
            try {
              const supabase = getSupabaseClient();
              
              const { error: deleteError } = await supabase
                .from("goals")
                .delete()
                .eq("id", goal.id)
                .eq("user_id", user.id);

              if (deleteError) {
                console.error("ゴール削除エラー:", deleteError);
                Alert.alert("エラー", `ゴールの削除に失敗しました: ${deleteError.message}`);
              } else {
                Alert.alert("成功", "ゴールを削除しました");
                // リストを再取得
                await fetchGoals();
              }
            } catch (err) {
              console.error("ネットワークエラー:", err);
              Alert.alert("エラー", "通信エラーが発生しました");
            }
          },
        },
      ]
    );
  }, [isAuthenticated, user, fetchGoals]);

  // 編集開始
  const startEditGoal = useCallback((goal: any) => {
    setEditingGoal(goal);
    setShowEditForm(true);
    setShowCreateForm(false); // 作成フォームが開いている場合は閉じる
  }, []);

  // フォームリセット
  const resetForm = useCallback(() => {
    setShowCreateForm(false);
  }, []);

  // 編集フォームリセット
  const resetEditForm = useCallback(() => {
    setEditingGoal(null);
    setShowEditForm(false);
  }, []);

  // 認証状態の初期化中はローディング表示
  if (authLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FFC400" />
        <Text className="mt-4 text-gray-600">認証状態を確認中...</Text>
      </View>
    );
  }

  // 未認証時はログイン画面にリダイレクト
  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  // 認証済みユーザー向けの画面
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="flex-1 px-4 pt-8 pb-6">
        {/* ヘッダー */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-2xl font-bold text-center mb-2 text-gray-800">
            ゴール管理
          </Text>
          <Text className="text-center text-gray-600">
            あなたの目標を管理しましょう
          </Text>
        </View>

        {/* ゴール一覧プレビュー */}
        {!isLoading && !error && goals.length > 0 && (
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text className="text-lg font-semibold mb-3 text-gray-800">
              最近のゴール
            </Text>
            {goals.slice(0, 3).map((goal, index) => (
              <View key={goal.id || index} className="bg-gray-50 rounded-lg p-3 mb-2">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 mr-3">
                    <Text className="font-medium text-gray-800" numberOfLines={1}>
                      {goal.title || "無題のゴール"}
                    </Text>
                    <Text className="text-sm text-gray-600 mt-1" numberOfLines={2}>
                      {goal.description || "説明なし"}
                    </Text>
                  </View>
                  
                  {/* 編集・削除ボタン */}
                  <View className="flex-row gap-2">
                    <Pressable
                      testID={`goal-edit-button-${goal.id}`}
                      onPress={() => startEditGoal(goal)}
                      className="bg-blue-500 px-2 py-1 rounded"
                    >
                      <Text className="text-white text-xs font-medium">編集</Text>
                    </Pressable>
                    <Pressable
                      testID={`goal-delete-button-${goal.id}`}
                      onPress={() => deleteGoal(goal)}
                      className="bg-red-500 px-2 py-1 rounded"
                    >
                      <Text className="text-white text-xs font-medium">削除</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
            {goals.length > 3 && (
              <Text className="text-center text-gray-500 text-sm mt-2">
                他 {goals.length - 3} 件のゴール
              </Text>
            )}
          </View>
        )}

        {/* データなしの場合 */}
        {!isLoading && !error && goals.length === 0 && (
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-center mb-3 text-gray-800">
              ゴールがありません
            </Text>
            <Text className="text-center text-gray-600 leading-6 mb-4">
              最初のゴールを作成して{'\n'}成長の旅を始めましょう！
            </Text>
            <Pressable
              onPress={() => setShowCreateForm(true)}
              className="bg-[#FFC400] px-4 py-3 rounded-lg"
            >
              <Text className="text-black font-medium text-center">
                新しいゴールを作成
              </Text>
            </Pressable>
          </View>
        )}

        {/* ゴール作成ボタン（データがある場合） */}
        {!isLoading && !error && goals.length > 0 && (
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Pressable
              onPress={() => setShowCreateForm(true)}
              className="bg-[#FFC400] px-4 py-3 rounded-lg"
            >
              <Text className="text-black font-medium text-center">
                新しいゴールを作成
              </Text>
            </Pressable>
          </View>
        )}

        {/* ゴール作成フォーム */}
        {showCreateForm && (
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <GoalForm
              onSubmit={createGoal}
              onCancel={resetForm}
              isSubmitting={isCreating}
            />
          </View>
        )}

        {/* ゴール編集フォーム */}
        {showEditForm && editingGoal && (
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <GoalForm
              onSubmit={updateGoal}
              onCancel={resetEditForm}
              initialGoal={editingGoal}
              isSubmitting={isUpdating}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Goals;