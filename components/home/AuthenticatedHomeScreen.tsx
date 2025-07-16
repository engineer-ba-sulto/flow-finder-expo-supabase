import React from "react";
import { Pressable, RefreshControl, ScrollView, Text, View, ActivityIndicator } from "react-native";
import { SimpleGoalCompletion } from "../ui/SimpleGoalCompletion";
import { Goal, GoalStatus, GoalPriority } from "../../types/goal.types";

interface AuthenticatedHomeScreenProps {
  goals: Goal[];
  isLoadingGoals: boolean;
  goalsError: string | null;
  refreshing: boolean;
  onRefresh: () => void;
  fetchGoals: () => void;
  router: any;
  user: any;
  onCreateGoal?: () => void;
}

const AuthenticatedHomeScreen: React.FC<AuthenticatedHomeScreenProps> = ({
  goals,
  isLoadingGoals,
  goalsError,
  refreshing,
  onRefresh,
  fetchGoals,
  router,
  user,
  onCreateGoal,
}) => {
  // ユーザー名を取得（メールアドレスから名前部分を抽出、またはデフォルト）
  const getUserDisplayName = () => {
    if (user?.email) {
      const name = user.email.split('@')[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return "田中さん";
  };

  // 時間に応じた挨拶
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "おはよう";
    if (hour < 18) return "こんにちは";
    return "こんばんは";
  };

  return (
    <View className="flex-1 bg-white">
      {/* ヘッダー */}
      <View className="bg-[#FFC400] p-4">
        <Text className="text-xl font-bold text-[#212121]">🏠 ホーム</Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        accessibilityLabel="ホーム画面"
      >
        <View className="flex-1 p-6">
          {/* ユーザー挨拶セクション */}
          <View className="mb-4">
            <Text
              className="text-lg font-bold text-[#212121]"
              accessibilityRole="header"
              accessibilityLabel={`${getGreeting()}、${getUserDisplayName()}`}
            >
              👋 {getGreeting()}、{getUserDisplayName()}
            </Text>
          </View>

          {/* 未達成のゴールセクション */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text
                className="text-sm font-semibold text-[#212121]"
                accessibilityRole="header"
              >
                🎯 未達成のゴール
              </Text>
              {onCreateGoal && (
                <Pressable
                  onPress={onCreateGoal}
                  className="bg-[#FFC400] text-[#212121] font-semibold py-2 px-3 rounded-lg ml-2"
                  accessibilityRole="button"
                  accessibilityLabel="ゴールを作成する"
                  testID="create-goal-button"
                >
                  <Text className="text-[#212121] text-sm font-semibold">＋ ゴール作成</Text>
                </Pressable>
              )}
            </View>

            {/* ローディング状態 */}
            {isLoadingGoals && (
              <View className="flex-1 justify-center items-center py-8">
                <ActivityIndicator size="small" color="#FFC400" />
                <Text className="text-sm text-gray-600 mt-2">ゴールを読み込み中...</Text>
              </View>
            )}

            {/* エラー状態 */}
            {goalsError && !isLoadingGoals && (
              <View className="bg-red-50 rounded-xl p-4 mb-2">
                <Text className="text-sm text-red-800 font-medium mb-2">
                  エラーが発生しました
                </Text>
                <Text className="text-xs text-red-600 mb-3">
                  {goalsError}
                </Text>
                <Pressable
                  onPress={fetchGoals}
                  className="bg-[#F44336] text-white py-2 px-3 rounded-lg self-start"
                  accessibilityRole="button"
                  accessibilityLabel="再試行"
                >
                  <Text className="text-white text-xs font-semibold">再試行</Text>
                </Pressable>
              </View>
            )}

            {/* 実際のゴールデータを表示 */}
            {!isLoadingGoals && !goalsError && (
              <View className="gap-3">
                {/* 未達成ゴールが存在しない場合 */}
                {goals.length === 0 ? (
                  <View className="bg-gray-50 rounded-xl p-6 items-center">
                    <Text className="text-4xl mb-2">🎯</Text>
                    <Text className="text-sm font-medium text-gray-700 mb-1">
                      まだゴールがありません
                    </Text>
                    <Text className="text-xs text-gray-500 text-center">
                      「＋ ゴール作成」ボタンから{"\n"}最初のゴールを設定してみましょう
                    </Text>
                  </View>
                ) : (
                  /* 実際のゴールリストを表示 */
                  goals
                    .filter(goal => goal.status === GoalStatus.ACTIVE) // アクティブなゴールのみ表示
                    .map((goal) => (
                      <View
                        key={goal.id}
                        className="bg-gray-50 rounded-xl p-4 flex-row items-center justify-between mb-2"
                      >
                        <View className="flex-1">
                          <Text className="text-sm font-medium">
                            {goal.title}
                          </Text>
                          {goal.description && (
                            <Text className="text-xs text-gray-500 mt-1">
                              {goal.description}
                            </Text>
                          )}
                          <Text className="text-xs text-gray-600 mt-1">
                            優先度: {goal.priority === GoalPriority.HIGH ? '高' : goal.priority === GoalPriority.MEDIUM ? '中' : '低'}
                          </Text>
                        </View>
                        <Pressable 
                          className="bg-[#4CAF50] py-1 px-3 rounded-lg ml-2"
                          onPress={() => {
                            // MVP2段目でゴール完了機能を実装予定
                            console.log('ゴール完了:', goal.id);
                          }}
                          accessibilityRole="button"
                          accessibilityLabel={`${goal.title}を達成済みにマーク`}
                        >
                          <Text className="text-white text-xs font-bold">達成</Text>
                        </Pressable>
                      </View>
                    ))
                )}
              </View>
            )}
          </View>

          {/* 簡易ゴール完了機能セクション */}
          <SimpleGoalCompletion
            goalId="current-goal"
            isCompleted={false}
            onToggle={(goalId) => {
              console.log('ゴール完了切り替え:', goalId);
              // MVP2段目で実際の完了機能を実装予定
            }}
          />

          {/* MVP2段目予告エリア */}
          <View className="bg-blue-50 p-4 rounded-xl">
            <Text className="text-xs text-blue-800 font-medium mb-1">
              🚀 MVP 2段目で追加予定
            </Text>
            <Text className="text-xs text-blue-600 leading-4">
              • 点検セッション機能{"\n"}
              • アクションリスト管理{"\n"}
              • 進捗ダッシュボード
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AuthenticatedHomeScreen;
