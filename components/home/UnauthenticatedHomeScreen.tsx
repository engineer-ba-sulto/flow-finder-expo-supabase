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
          accessibilityLabel={APP_DESCRIPTION}
        >
          {APP_DESCRIPTION}
        </Text>
        {/* 特徴紹介 */}
        <View className="bg-blue-50 rounded-lg p-4">
          <Text
            className="text-center text-blue-700 font-medium"
            accessibilityLabel="成長の障壁を特定し、具体的な解決策を提案するパーソナルコーチングアプリです"
          >
            成長の障壁を特定し、具体的な解決策を提案する{`\n`}
            パーソナルコーチングアプリです
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

export default UnauthenticatedHomeScreen;
