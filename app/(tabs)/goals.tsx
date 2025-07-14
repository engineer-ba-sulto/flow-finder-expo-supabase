import React, { useState, useEffect, useCallback } from "react";
import { ActivityIndicator, Text, View, ScrollView, Pressable, TextInput, Alert } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { getSupabaseClient } from "../../lib/supabase";
import { GoalForm } from "../../components/forms/GoalForm";
import { CreateGoalInput } from "../../types/goal.types";

/**
 * ヘルパー関数
 */
const getGoalIcon = (category: string) => {
  const iconMap: { [key: string]: string } = {
    "学習・スキルアップ": "💼",
    "健康・フィットネス": "🏃",
    "仕事・キャリア": "💼",
    "お金・投資": "💰",
  };
  return iconMap[category] || "🎯";
};

const getPriorityText = (priority: number) => {
  const priorityMap: { [key: number]: string } = {
    1: "高",
    2: "中", 
    3: "低",
  };
  return priorityMap[priority] || "中";
};

const getProgressPercentage = (goal: any) => {
  // MVP1段目では固定値を返す（MVP2段目以降で実装）
  const progressMap: { [key: string]: number } = {
    "英語学習マスター": 60,
    "健康的な生活習慣": 30,
    "副業収入月10万円": 10,
  };
  return progressMap[goal.title] || 0;
};

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

  // ゴールオプション表示
  const showGoalOptions = useCallback((goal: any) => {
    Alert.alert(
      goal.title,
      "ゴールの操作を選択してください",
      [
        {
          text: "編集",
          onPress: () => startEditGoal(goal),
        },
        {
          text: "削除",
          style: "destructive",
          onPress: () => deleteGoal(goal),
        },
        {
          text: "キャンセル",
          style: "cancel",
        },
      ]
    );
  }, [startEditGoal, deleteGoal]);

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
    <View className="flex-1 bg-white">
      {/* ヘッダー */}
      <View className="bg-[#FFC400] p-4">
        <Text className="text-xl font-bold text-[#212121]">🎯 ゴール管理</Text>
      </View>

      <ScrollView className="flex-1 p-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-[#212121]">ゴール管理</Text>
          <Pressable
            onPress={() => setShowCreateForm(true)}
            className="bg-[#FFC400] text-[#212121] text-sm font-semibold py-2 px-3 rounded-lg"
            accessibilityRole="button"
            testID="add-goal-button"
          >
            <Text className="text-[#212121] font-semibold">+ 追加</Text>
          </Pressable>
        </View>

        {/* ゴール一覧 */}
        {!isLoading && !error && goals.length > 0 && (
          <View className="gap-3">
            {goals.map((goal, index) => (
              <View key={goal.id || index} className="bg-gray-50 rounded-xl p-4">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-sm font-semibold" numberOfLines={1}>
                      {getGoalIcon(goal.category)} {goal.title || "無題のゴール"}
                    </Text>
                    <Text className="text-xs text-gray-600 mt-1">
                      優先度: {getPriorityText(goal.priority)} 📊 {getProgressPercentage(goal)}%
                    </Text>
                  </View>
                  <Pressable 
                    onPress={() => showGoalOptions(goal)}
                    className="text-gray-400"
                    testID={`goal-options-${goal.id}`}
                    accessibilityRole="button"
                    accessibilityLabel="ゴールオプション"
                  >
                    <Text className="text-gray-400">⋮</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* データなしの場合 */}
        {!isLoading && !error && goals.length === 0 && (
          <View className="bg-gray-50 rounded-xl p-4">
            <Text className="text-center text-gray-600">
              まだゴールがありません。最初のゴールを作成しましょう！
            </Text>
          </View>
        )}

        {/* MVP1段目注記エリア */}
        <View className="mt-6 p-3 bg-blue-50 rounded-xl">
          <Text className="text-xs text-blue-600">
            💡 MVP1: 基本CRUD機能のみ実装済み
          </Text>
        </View>

        {/* ゴール作成フォーム */}
        {showCreateForm && (
          <View className="mt-6 bg-white rounded-xl p-6 shadow-sm">
            <Text className="text-lg font-bold text-[#212121] mb-4 text-center">
              新しいゴール
            </Text>
            <GoalForm
              onSubmit={createGoal}
              onCancel={resetForm}
              isSubmitting={isCreating}
            />
          </View>
        )}

        {/* ゴール編集フォーム */}
        {showEditForm && editingGoal && (
          <View className="mt-6 bg-white rounded-xl p-6 shadow-sm">
            <Text className="text-lg font-bold text-[#212121] mb-4 text-center">
              ゴール編集
            </Text>
            <GoalForm
              onSubmit={updateGoal}
              onCancel={resetEditForm}
              initialGoal={editingGoal}
              isSubmitting={isUpdating}
            />
          </View>
        )}

        {/* エラー表示 */}
        {error && (
          <View className="mt-6 p-4 bg-red-50 rounded-xl">
            <Text className="text-red-600 text-center">{error}</Text>
          </View>
        )}

        {/* ローディング表示 */}
        {isLoading && (
          <View className="mt-6 items-center">
            <ActivityIndicator size="large" color="#FFC400" />
            <Text className="mt-2 text-gray-600">読み込み中...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Goals;