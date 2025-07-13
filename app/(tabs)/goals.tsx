import React, { useState, useEffect, useCallback } from "react";
import { ActivityIndicator, Text, View, ScrollView, Pressable, TextInput, Alert } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { getSupabaseClient } from "../../lib/supabase";

/**
 * ゴール管理画面コンポーネント（段階的復旧中）
 *
 * 安全にゴール管理機能を段階的に復旧しています。
 */
const Goals: React.FC = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  
  // ローカル状態管理
  const [isLoading, setIsLoading] = useState(false);
  const [goalCount, setGoalCount] = useState(0);
  const [goals, setGoals] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // ゴール作成フォーム関連
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");

  // 実際のSupabaseからのゴール取得
  const fetchGoals = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseClient();
      const { data, error: fetchError, count } = await supabase
        .from("goals")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("ゴール取得エラー:", fetchError);
        setError("ゴールの取得に失敗しました");
        setGoalCount(0);
        setGoals([]);
      } else {
        setGoals(data || []);
        setGoalCount(count || 0);
      }
    } catch (err) {
      console.error("ネットワークエラー:", err);
      setError("通信エラーが発生しました");
      setGoalCount(0);
      setGoals([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // 認証済みユーザーのゴール取得
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // ゴール作成機能
  const createGoal = useCallback(async () => {
    if (!isAuthenticated || !user || !newGoalTitle.trim()) {
      Alert.alert("エラー", "タイトルを入力してください");
      return;
    }

    setIsCreating(true);

    try {
      const supabase = getSupabaseClient();
      
      // まずgoalsテーブルの存在確認
      console.log("goalsテーブルの存在確認...");
      const { data: tableCheck, error: tableError } = await supabase
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

      // より安全なデータ構造で試行
      const goalData = {
        user_id: user.id,
        title: newGoalTitle.trim(),
        description: newGoalDescription.trim() || null,
      };

      console.log("作成するゴールデータ:", goalData);

      const { data, error: createError } = await supabase
        .from("goals")
        .insert([goalData])
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
        setNewGoalTitle("");
        setNewGoalDescription("");
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
  }, [isAuthenticated, user, newGoalTitle, newGoalDescription, fetchGoals]);

  // フォームリセット
  const resetForm = useCallback(() => {
    setNewGoalTitle("");
    setNewGoalDescription("");
    setShowCreateForm(false);
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

        {/* 進捗表示 */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-center mb-3 text-gray-800">
            あなたの進捗
          </Text>
          {isLoading ? (
            <View className="flex-row justify-center items-center">
              <ActivityIndicator size="small" color="#FFC400" />
              <Text className="ml-2 text-gray-600">読み込み中...</Text>
            </View>
          ) : error ? (
            <View className="bg-red-50 rounded-lg p-4 items-center">
              <Text className="text-red-600 text-center mb-2">{error}</Text>
              <Text className="text-red-500 text-sm">タップして再試行</Text>
            </View>
          ) : (
            <View className="bg-blue-50 rounded-lg p-4 items-center">
              <Text className="text-2xl font-bold text-blue-600 mb-1">
                {goalCount}
              </Text>
              <Text className="text-blue-600 font-medium">
                登録ゴール
              </Text>
            </View>
          )}
        </View>

        {/* ゴール一覧プレビュー */}
        {!isLoading && !error && goals.length > 0 && (
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text className="text-lg font-semibold mb-3 text-gray-800">
              最近のゴール
            </Text>
            {goals.slice(0, 3).map((goal, index) => (
              <View key={goal.id || index} className="bg-gray-50 rounded-lg p-3 mb-2">
                <Text className="font-medium text-gray-800" numberOfLines={1}>
                  {goal.title || "無題のゴール"}
                </Text>
                <Text className="text-sm text-gray-600 mt-1" numberOfLines={2}>
                  {goal.description || "説明なし"}
                </Text>
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
                ゴールを作成する
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
            <Text className="text-lg font-semibold mb-4 text-gray-800">
              新しいゴールを作成
            </Text>
            
            {/* タイトル入力 */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                タイトル *
              </Text>
              <TextInput
                value={newGoalTitle}
                onChangeText={setNewGoalTitle}
                placeholder="例：英語を流暢に話せるようになる"
                className="border border-gray-300 rounded-lg px-3 py-2 text-base"
                maxLength={100}
              />
            </View>

            {/* 説明入力 */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                説明（任意）
              </Text>
              <TextInput
                value={newGoalDescription}
                onChangeText={setNewGoalDescription}
                placeholder="ゴールの詳細説明を入力してください"
                className="border border-gray-300 rounded-lg px-3 py-2 text-base"
                multiline
                numberOfLines={3}
                maxLength={500}
              />
            </View>

            {/* ボタン */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={resetForm}
                className="flex-1 bg-gray-200 px-4 py-3 rounded-lg"
                disabled={isCreating}
              >
                <Text className="text-gray-700 font-medium text-center">
                  キャンセル
                </Text>
              </Pressable>
              
              <Pressable
                onPress={createGoal}
                className={`flex-1 px-4 py-3 rounded-lg ${isCreating ? 'bg-gray-400' : 'bg-[#FFC400]'}`}
                disabled={isCreating || !newGoalTitle.trim()}
              >
                <View className="flex-row justify-center items-center">
                  {isCreating && (
                    <ActivityIndicator size="small" color="#000000" className="mr-2" />
                  )}
                  <Text className="text-black font-medium">
                    {isCreating ? "作成中..." : "作成"}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        )}

        {/* 機能状況 */}
        <View className="bg-white rounded-xl p-6 shadow-sm">
          <Text className="text-lg font-semibold text-center mb-3 text-gray-800">
            段階的復旧中
          </Text>
          <Text className="text-center text-gray-600 leading-6 mb-4">
            ゴール管理機能を安全に復旧しています。{'\n'}
            現在：ゴール作成機能を実装済み
          </Text>
          <View className="bg-green-50 rounded-lg p-3">
            <Text className="text-green-700 text-sm text-center">
              ✅ 認証ガード　✅ 基本UI　✅ データ取得　✅ 作成機能　🔄 編集・削除
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Goals;