import React from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SimpleGoalCompletion } from "../ui/SimpleGoalCompletion";

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

          {/* 今日のゴールセクション */}
          <View className="mb-6">
            <Text
              className="text-sm font-semibold text-[#212121] mb-2"
              accessibilityRole="header"
            >
              🎯 今日のゴール
            </Text>
            <View className="bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-medium">
                  💼 英語学習マスター
                </Text>
              </View>
              <Text className="text-xs text-gray-600">
                優先度: 高
              </Text>
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
