import React from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { Button } from "../../components/ui/Button";
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
}) => (
  <View className="flex-1 bg-white">
    {/* ヘッダー */}
    <View className="bg-[#FFC400] p-4">
      <Text
        className="text-xl font-bold text-[#212121]"
        accessibilityRole="header"
        accessibilityLabel="ホーム"
      >
        🏠 ホーム
      </Text>
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
        {/* 挨拶セクション */}
        <View className="mb-4">
          <Text
            className="text-lg font-bold text-[#212121]"
            accessibilityLabel="挨拶メッセージ"
          >
            👋 おはよう、{user?.email?.split('@')[0] || 'ユーザー'}さん
          </Text>
        </View>

        {/* 今日のゴール */}
        <View className="mb-6">
          <Text
            className="text-sm font-semibold text-[#212121] mb-2"
            accessibilityRole="header"
          >
            🎯 今日のゴール
          </Text>
          <View className="bg-gray-50 rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text
                className="text-sm font-medium"
                accessibilityLabel="ゴールタイトル"
              >
                💼 英語学習マスター
              </Text>
            </View>
            <Text
              className="text-xs text-gray-600 mb-2"
              accessibilityLabel="優先度"
            >
              優先度: 高
            </Text>
            <View className="w-full bg-gray-200 rounded-full h-2">
              <View
                className="bg-[#4CAF50] h-2 rounded-full"
                style={{ width: '60%' }}
                accessibilityLabel="進捗60%"
              />
            </View>
            <Text className="text-xs text-gray-600 mt-1">60%</Text>
          </View>
        </View>

        {/* MVP1段目: 簡易完了機能ボタン */}
        <View className="mb-6">
          <Text
            className="text-sm font-semibold text-[#212121] mb-2"
            accessibilityRole="header"
          >
            ✅ ゴール管理
          </Text>
          <Button
            variant="success"
            onPress={() => {
              console.log('ゴール完了マーク');
              // MVP2段目でアクション機能追加予定
            }}
            accessibilityLabel="ゴール完了マーク"
            accessibilityHint="ゴールの完了をマークします"
            className="mb-2"
          >
            ゴール完了マーク
          </Button>
          <Text className="text-xs text-gray-600 text-center">
            ※ MVP2段目でアクション機能追加予定
          </Text>
        </View>

        {/* MVP2段目予告エリア */}
        <View className="bg-blue-50 p-4 rounded-xl">
          <Text
            className="text-xs text-blue-800 font-medium mb-1"
            accessibilityLabel="今後の機能予告"
          >
            🚀 MVP 2段目で追加予定
          </Text>
          <Text className="text-xs text-blue-600">
            • 点検セッション機能{'\n'}
            • アクションリスト管理{'\n'}
            • 進捗ダッシュボード
          </Text>
        </View>
      </View>
    </ScrollView>
  </View>
);

export default AuthenticatedHomeScreen;
