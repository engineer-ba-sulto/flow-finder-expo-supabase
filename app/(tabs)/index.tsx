import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Text, View, ScrollView, RefreshControl } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/Button";
import { getSupabaseClient } from "../../lib/supabase";

// 型定義の強化
interface GoalCountData {
  count: number;
  loading: boolean;
  error: string | null;
}

export default function HomeScreen() {
  const { user, loading, error, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // ゴールデータの状態を統合管理
  const [goalData, setGoalData] = useState<GoalCountData>({
    count: 0,
    loading: false,
    error: null,
  });
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // ゴール数を取得する関数をメモ化
  const fetchGoalCount = useCallback(async (showRefreshIndicator = false) => {
    if (!isAuthenticated || !user) return;

    if (showRefreshIndicator) {
      setRefreshing(true);
    } else {
      setGoalData(prev => ({ ...prev, loading: true, error: null }));
    }

    try {
      const supabase = getSupabaseClient();
      const { count, error } = await supabase
        .from("goals")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (error) {
        const errorMessage = "ゴール数の取得に失敗しました";
        console.error("ゴール数取得エラー:", error);
        setGoalData(prev => ({ ...prev, error: errorMessage }));
      } else {
        setGoalData(prev => ({ ...prev, count: count || 0, error: null }));
      }
    } catch (err) {
      const errorMessage = "通信エラーが発生しました";
      console.error("ゴール数取得エラー:", err);
      setGoalData(prev => ({ ...prev, error: errorMessage }));
    } finally {
      setGoalData(prev => ({ ...prev, loading: false }));
      setRefreshing(false);
    }
  }, [isAuthenticated, user]);

  // 初回データ取得
  useEffect(() => {
    fetchGoalCount();
  }, [fetchGoalCount]);

  // 画面がフォーカスされた時にゴール数を再取得（タブ切り替え時の同期）
  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated && user) {
        fetchGoalCount();
      }
    }, [fetchGoalCount, isAuthenticated, user])
  );

  // プルツーリフレッシュハンドラー
  const onRefresh = useCallback(() => {
    fetchGoalCount(true);
  }, [fetchGoalCount]);

  // メモ化されたコンポーネント要素
  const appDescription = useMemo(() => (
    "あなたの成長を妨げる「見えない壁」を見つけ、壊すためのパーソナルコーチング アプリ"
  ), []);

  // ローディング中（アクセシビリティ対応）
  if (loading) {
    return (
      <View 
        className="flex-1 justify-center items-center bg-white"
        accessibilityLabel="アプリを読み込み中です"
        accessibilityRole="text"
      >
        <Text className="text-lg" accessibilityLabel="読み込み中です">
          読み込み中...
        </Text>
      </View>
    );
  }

  // エラー状態（改善されたエラー表示）
  if (error) {
    return (
      <ScrollView 
        className="flex-1 bg-white"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}
        accessibilityLabel="エラー画面"
      >
        <View className="items-center">
          <Text 
            className="text-xl font-semibold text-red-500 mb-4 text-center"
            accessibilityRole="header"
            accessibilityLabel="エラーが発生しました"
          >
            エラーが発生しました
          </Text>
          <Text 
            className="text-center text-gray-600 mb-6 leading-6"
            accessibilityLabel={`エラー詳細: ${error.message}`}
          >
            {error.message}
          </Text>
          <Button
            variant="primary"
            onPress={() => fetchGoalCount()}
            accessibilityLabel="再読み込みを実行"
            accessibilityHint="エラーを解決するために再度読み込みを試行します"
          >
            再読み込み
          </Button>
        </View>
      </ScrollView>
    );
  }

  // 認証済みユーザー向け画面（改善版）
  if (isAuthenticated && user) {
    return (
      <ScrollView 
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        accessibilityLabel="ホーム画面"
      >
        <View className="flex-1 px-4 pt-8 pb-6">
          {/* ウェルカムセクション */}
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text 
              className="text-2xl font-bold text-center mb-2 text-gray-800"
              accessibilityRole="header"
              accessibilityLabel="Flow Finderへようこそ"
            >
              Flow Finderへようこそ
            </Text>
            <Text 
              className="text-lg text-center mb-4 text-[#FFC400] font-medium"
              accessibilityLabel="おかえりなさい"
            >
              おかえりなさい
            </Text>
            
            {/* アプリ説明 */}
            <Text 
              className="text-center text-gray-600 leading-6"
              accessibilityLabel={appDescription}
            >
              {appDescription}
            </Text>
          </View>

          {/* ゴール数表示セクション */}
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text 
              className="text-lg font-semibold text-center mb-3 text-gray-800"
              accessibilityRole="header"
            >
              あなたの進捗
            </Text>
            
            {goalData.error ? (
              <View className="items-center">
                <Text 
                  className="text-red-500 text-center mb-3"
                  accessibilityLabel={`ゴール数取得エラー: ${goalData.error}`}
                >
                  {goalData.error}
                </Text>
                <Button
                  variant="secondary"
                  onPress={() => fetchGoalCount()}
                  accessibilityLabel="ゴール数を再取得"
                  accessibilityHint="ゴール数の取得を再試行します"
                >
                  再取得
                </Button>
              </View>
            ) : (
              <View className="bg-blue-50 rounded-lg p-4 items-center">
                <Text 
                  className="text-2xl font-bold text-blue-600 mb-1"
                  accessibilityLabel={`登録ゴール数: ${goalData.count}件`}
                >
                  {goalData.loading ? "..." : goalData.count}
                </Text>
                <Text 
                  className="text-blue-600 font-medium"
                  accessibilityLabel="ゴール数の単位"
                >
                  {goalData.loading ? "読み込み中" : "登録ゴール"}
                </Text>
              </View>
            )}
          </View>

          {/* クイックアクションセクション */}
          <View className="bg-white rounded-xl p-6 shadow-sm">
            <Text 
              className="text-lg font-semibold mb-4 text-gray-800"
              accessibilityRole="header"
            >
              クイックアクション
            </Text>
            <Button
              variant="primary"
              onPress={() => router.push("/(tabs)/goals")}
              accessibilityLabel="ゴール一覧に移動"
              accessibilityHint="登録されているゴールの一覧を確認できます"
              className="mb-3"
            >
              ゴールを確認
            </Button>
            <Button
              variant="secondary"
              onPress={() => router.push("/(tabs)/goals")}
              accessibilityLabel="新しいゴールを追加"
              accessibilityHint="新しいゴールの登録を開始します"
            >
              新しいゴールを追加
            </Button>
          </View>
        </View>
      </ScrollView>
    );
  }

  // 未認証ユーザー向け画面（改善版）
  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      showsVerticalScrollIndicator={false}
      accessibilityLabel="ログイン案内画面"
    >
      <View className="flex-1 px-4 pt-12 pb-6">
        {/* メインウェルカムセクション */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text 
            className="text-3xl font-bold text-center mb-4 text-gray-800"
            accessibilityRole="header"
            accessibilityLabel="Flow Finderへようこそ"
          >
            Flow Finderへようこそ
          </Text>
          
          {/* アプリ説明 */}
          <Text 
            className="text-center text-gray-600 mb-6 leading-6 text-base"
            accessibilityLabel={appDescription}
          >
            {appDescription}
          </Text>

          {/* 特徴紹介 */}
          <View className="bg-blue-50 rounded-lg p-4">
            <Text 
              className="text-center text-blue-700 font-medium"
              accessibilityLabel="成長の障壁を特定し、具体的な解決策を提案するパーソナルコーチングアプリです"
            >
              成長の障壁を特定し、具体的な解決策を提案する{'\n'}パーソナルコーチングアプリです
            </Text>
          </View>
        </View>

        {/* ログイン案内セクション */}
        <View className="bg-white rounded-xl p-6 shadow-sm">
          <Text 
            className="text-xl font-semibold text-center mb-6 text-gray-800"
            accessibilityRole="header"
          >
            ログインして始めましょう
          </Text>
          
          <Button
            variant="primary"
            onPress={() => router.push("/auth/login")}
            accessibilityLabel="ログイン画面に移動"
            accessibilityHint="既存のアカウントでログインします"
            className="mb-4"
          >
            ログイン
          </Button>
          
          <Button
            variant="secondary"
            onPress={() => router.push("/auth/signup")}
            accessibilityLabel="新規登録画面に移動"
            accessibilityHint="新しいアカウントを作成します"
          >
            新規登録
          </Button>

          {/* 追加情報 */}
          <Text 
            className="text-center text-gray-500 text-sm mt-4"
            accessibilityLabel="無料で始められます"
          >
            無料で始められます
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
