import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Button } from "../../components/ui/Button";
import { APP_DESCRIPTION } from "../../constants/app";

interface UnauthenticatedHomeScreenProps {
  router: any;
}

const UnauthenticatedHomeScreen: React.FC<UnauthenticatedHomeScreenProps> = ({
  router,
}) => (
  <ScrollView
    className="flex-1 bg-white"
    showsVerticalScrollIndicator={false}
    accessibilityLabel="ログイン前ホーム画面"
  >
    <View className="flex-1 p-6 justify-between">
      <View className="items-center">
        {/* メインアイコン */}
        <Text className="text-6xl mb-4" accessibilityLabel="Flow Finderアイコン">
          🎯
        </Text>
        
        {/* アプリタイトル */}
        <Text
          className="text-2xl font-bold text-center mb-4 text-gray-800"
          accessibilityRole="header"
          accessibilityLabel="Flow Finder"
        >
          Flow Finder
        </Text>
        
        {/* アプリ説明 */}
        <Text
          className="text-center text-gray-800 text-sm leading-relaxed mb-6"
          accessibilityLabel={APP_DESCRIPTION}
        >
          {APP_DESCRIPTION}
        </Text>

        {/* 機能紹介セクション */}
        <View className="bg-gray-50 rounded-xl p-6 mb-6 w-full">
          <Text
            className="text-sm font-medium text-gray-800 mb-3 text-center"
            accessibilityLabel="Flow Finderができること"
          >
            Flow Finderができること
          </Text>
          <View className="gap-3">
            <View className="flex-row items-center">
              <Text className="text-lg mr-3">🎯</Text>
              <View className="flex-1">
                <Text className="text-xs font-medium">ゴール設定</Text>
                <Text className="text-xs text-gray-600">目標を明確にする</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Text className="text-lg mr-3">📊</Text>
              <View className="flex-1">
                <Text className="text-xs font-medium">ゴール管理</Text>
                <Text className="text-xs text-gray-600">目標を整理・管理</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Text className="text-lg mr-3">✅</Text>
              <View className="flex-1">
                <Text className="text-xs font-medium">簡単管理</Text>
                <Text className="text-xs text-gray-600">シンプルな操作で継続</Text>
              </View>
            </View>
          </View>
        </View>

        {/* MVP1段階での機能説明 */}
        <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 w-full">
          <Text
            className="text-xs text-blue-800 font-medium mb-2"
            accessibilityLabel="MVP1段目：基本機能"
          >
            🚀 MVP1段目：基本機能
          </Text>
          <Text className="text-xs text-blue-600">
            • ゴール設定・管理{`\n`}
            • シンプルな管理{`\n`}
            • 簡単な完了機能
          </Text>
        </View>
      </View>

      {/* ボタンセクション */}
      <View className="w-full gap-3">
        <Button
          variant="primary"
          onPress={() => router.push("/auth/signup")}
          accessibilityLabel="今すぐ始める"
          accessibilityHint="新しいアカウントを作成して始めます"
        >
          今すぐ始める
        </Button>
        <Button
          variant="secondary"
          onPress={() => router.push("/auth/login")}
          accessibilityLabel="ログイン"
          accessibilityHint="既存のアカウントでログインします"
        >
          ログイン
        </Button>
      </View>
    </View>
  </ScrollView>
);

export default UnauthenticatedHomeScreen;
