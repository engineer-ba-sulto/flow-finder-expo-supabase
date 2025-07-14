import React from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { Button } from "../../components/ui/Button";
import { SimpleGoalCompletion } from "../ui/SimpleGoalCompletion";
import { APP_DESCRIPTION } from "../../constants/app";

interface AuthenticatedHomeScreenProps {
  goalData: any;
  refreshing: boolean;
  onRefresh: () => void;
  fetchGoalCount: () => void;
  router: any;
  user: any;
}

const AuthenticatedHomeScreen: React.FC<AuthenticatedHomeScreenProps> = ({
  goalData,
  refreshing,
  onRefresh,
  fetchGoalCount,
  router,
  user,
}) => (
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
          accessibilityLabel={APP_DESCRIPTION}
        >
          {APP_DESCRIPTION}
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
              onPress={fetchGoalCount}
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
      {/* 簡易ゴール完了機能セクション */}
      <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <SimpleGoalCompletion
          goalId="current-goal"
          isCompleted={false}
          onToggle={(goalId) => {
            console.log('ゴール完了切り替え:', goalId);
            // MVP2段目で実際の完了機能を実装予定
          }}
        />
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

export default AuthenticatedHomeScreen;
