import React from "react";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { SimpleGoalCompletion } from "../ui/SimpleGoalCompletion";

interface AuthenticatedHomeScreenProps {
  goalData: any;
  refreshing: boolean;
  onRefresh: () => void;
  fetchGoalCount: () => void;
  router: any;
  user: any;
  onCreateGoal?: () => void;
}

const AuthenticatedHomeScreen: React.FC<AuthenticatedHomeScreenProps> = ({
  goalData,
  refreshing,
  onRefresh,
  fetchGoalCount,
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
                  className="bg-primary text-secondary font-semibold py-2 px-3 rounded-lg ml-2"
                  accessibilityRole="button"
                  accessibilityLabel="ゴールを作成する"
                  testID="create-goal-button"
                >
                  <Text className="text-secondary text-sm font-semibold">＋ ゴール作成</Text>
                </Pressable>
              )}
            </View>
            <View className="gap-3">
              {/* 未完了ゴール1 */}
              <View className="bg-gray-50 rounded-xl p-4 flex-row items-center justify-between mb-2">
                <View className="flex-1">
                  <Text className="text-sm font-medium">
                    💼 英語学習マスター
                  </Text>
                  <Text className="text-xs text-gray-600 mt-1">
                    優先度: 高
                  </Text>
                </View>
                <Pressable className="bg-success text-white text-xs font-bold py-1 px-3 rounded-lg ml-2">
                  <Text className="text-white text-xs font-bold">達成</Text>
                </Pressable>
              </View>
              {/* 未完了ゴール2 */}
              <View className="bg-gray-50 rounded-xl p-4 flex-row items-center justify-between mb-2">
                <View className="flex-1">
                  <Text className="text-sm font-medium">
                    🏃 健康的な生活習慣
                  </Text>
                  <Text className="text-xs text-gray-600 mt-1">
                    優先度: 中
                  </Text>
                </View>
                <Pressable className="bg-success text-white text-xs font-bold py-1 px-3 rounded-lg ml-2">
                  <Text className="text-white text-xs font-bold">達成</Text>
                </Pressable>
              </View>
            </View>
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
