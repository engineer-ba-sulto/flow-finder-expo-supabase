import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/Button";
import { getSupabaseClient } from "../../lib/supabase";

export default function HomeScreen() {
  const { user, loading, error, isAuthenticated } = useAuth();
  const router = useRouter();
  const [goalCount, setGoalCount] = useState<number>(0);
  const [goalsLoading, setGoalsLoading] = useState<boolean>(false);

  // ゴール数を取得
  useEffect(() => {
    if (isAuthenticated && user) {
      setGoalsLoading(true);
      const fetchGoalCount = async () => {
        try {
          const supabase = getSupabaseClient();
          const { count, error } = await supabase
            .from("goals")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id);

          if (error) {
            console.error("ゴール数取得エラー:", error);
          } else {
            setGoalCount(count || 0);
          }
        } catch (err) {
          console.error("ゴール数取得エラー:", err);
        } finally {
          setGoalsLoading(false);
        }
      };

      fetchGoalCount();
    }
  }, [isAuthenticated, user]);

  // ローディング中
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg">読み込み中...</Text>
      </View>
    );
  }

  // エラー状態
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-4">
        <Text className="text-lg text-red-500 mb-4">エラーが発生しました</Text>
        <Text className="text-center text-gray-600">{error.message}</Text>
      </View>
    );
  }

  // 認証済みユーザー向け画面
  if (isAuthenticated && user) {
    return (
      <View className="flex-1 bg-white">
        <View className="flex-1 px-4 pt-12">
          {/* ウェルカムメッセージ */}
          <Text className="text-3xl font-bold text-center mb-2">Flow Finderへようこそ</Text>
          <Text className="text-xl text-center mb-4">おかえりなさい</Text>
          
          {/* アプリ説明 */}
          <Text className="text-center text-gray-600 mb-8">
            あなたの成長を妨げる「見えない壁」を見つけ、壊すためのパーソナルコーチング アプリ
          </Text>

          {/* ゴール数表示 */}
          <View className="bg-blue-50 rounded-lg p-4 mb-4">
            <Text className="text-lg font-semibold text-center">
              {goalsLoading ? "読み込み中..." : `登録ゴール数: ${goalCount}件`}
            </Text>
          </View>

          {/* クイックアクション */}
          <View className="bg-gray-50 rounded-lg p-4 mb-6">
            <Text className="text-lg font-semibold mb-4">クイックアクション</Text>
            <Button
              variant="primary"
              onPress={() => router.push("/(tabs)/goals")}
              className="mb-2"
            >
              ゴールを確認
            </Button>
          </View>
        </View>
      </View>
    );
  }

  // 未認証ユーザー向け画面
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-12">
        {/* ウェルカムメッセージ */}
        <Text className="text-3xl font-bold text-center mb-4">Flow Finderへようこそ</Text>
        
        {/* アプリ説明 */}
        <Text className="text-center text-gray-600 mb-8">
          あなたの成長を妨げる「見えない壁」を見つけ、壊すためのパーソナルコーチング アプリ
        </Text>

        {/* ログイン案内 */}
        <View className="bg-gray-50 rounded-lg p-4 mb-6">
          <Text className="text-lg text-center mb-4">ログインして始めましょう</Text>
          
          <Button
            variant="primary"
            onPress={() => router.push("/auth/login")}
            className="mb-3"
          >
            ログイン
          </Button>
          
          <Button
            variant="secondary"
            onPress={() => router.push("/auth/signup")}
          >
            新規登録
          </Button>
        </View>
      </View>
    </View>
  );
}
