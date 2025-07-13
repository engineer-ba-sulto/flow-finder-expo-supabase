import React from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../../components/ui/Button";

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
    className="flex-1 bg-white"
    showsVerticalScrollIndicator={false}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
    accessibilityLabel="ホーム画面"
  >
    <View className="flex-1 px-6 pt-4 pb-6">
      {/* グリーティングセクション */}
      <View className="mb-4">
        <Text
          className="text-lg font-bold text-gray-800"
          accessibilityRole="header"
          accessibilityLabel={`おはよう、${user?.email || "ユーザー"}さん`}
        >
          👋 おはよう、{user?.email?.split("@")[0] || "ユーザー"}さん
        </Text>
      </View>

      {/* 今日のゴールセクション */}
      <View className="mb-6">
        <Text
          className="text-sm font-semibold text-gray-800 mb-2"
          accessibilityRole="header"
        >
          🎯 今日のゴール
        </Text>
        <View className="bg-gray-50 rounded-xl p-4">
          {goalData.loading ? (
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-medium">読み込み中...</Text>
            </View>
          ) : goalData.error ? (
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-medium text-red-500">
                エラーが発生しました
              </Text>
            </View>
          ) : goalData.count > 0 ? (
            <>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-medium">💼 目標達成に向けて</Text>
              </View>
              <Text className="text-xs text-gray-600 mb-2">
                登録ゴール数: {goalData.count}件
              </Text>
              <View className="w-full bg-gray-200 rounded-full h-2">
                <View
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${Math.min((goalData.count / 5) * 100, 100)}%`,
                  }}
                />
              </View>
              <Text className="text-xs text-gray-600 mt-1">
                {Math.min((goalData.count / 5) * 100, 100).toFixed(0)}%
              </Text>
            </>
          ) : (
            <View className="items-center py-4">
              <Text className="text-sm font-medium text-gray-600 mb-2">
                まだゴールが設定されていません
              </Text>
              <Text className="text-xs text-gray-500">
                最初のゴールを作成しましょう
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* 今日のアクションセクション */}
      <View className="mb-6">
        <Text
          className="text-sm font-semibold text-gray-800 mb-2"
          accessibilityRole="header"
        >
          ✅ 今日のアクション
        </Text>
        <View className="gap-2">
          <View className="bg-gray-50 rounded-xl p-3">
            <View className="flex-row items-center">
              <View className="w-4 h-4 border border-gray-300 rounded mr-2" />
              <View className="flex-1">
                <Text className="text-xs font-medium">
                  ゴール管理画面でゴールをチェック
                </Text>
                <Text className="text-xs text-gray-600">5分</Text>
              </View>
            </View>
          </View>
          {goalData.count > 0 && (
            <View className="bg-green-50 rounded-xl p-3">
              <View className="flex-row items-center">
                <View className="w-4 h-4 bg-green-500 rounded mr-2" />
                <View className="flex-1">
                  <Text className="text-xs font-medium">ゴールを設定済み</Text>
                  <Text className="text-xs text-gray-600">完了済み</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* クイックアクションボタン */}
      <TouchableOpacity
        className="w-full bg-[#FFC400] py-3 px-4 rounded-xl mb-6"
        onPress={() => router.push("/(tabs)/goals")}
        accessibilityLabel="点検セッション開始"
        accessibilityHint="ゴール管理画面に移動します"
      >
        <Text className="text-[#212121] font-semibold text-sm text-center">
          + 点検セッション開始
        </Text>
      </TouchableOpacity>

      {/* エラー表示 */}
      {goalData.error && (
        <View className="bg-red-50 rounded-xl p-4 mt-4">
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
      )}
    </View>
  </ScrollView>
);

export default AuthenticatedHomeScreen;
