import React from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/Button";

export default function SettingsScreen() {
  const { user, loading, error, isAuthenticated, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      Alert.alert("エラー", "ログアウトに失敗しました");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600">読み込み中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500">エラーが発生しました</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600">ログインが必要です</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold text-center mb-6">設定</Text>
        
        {/* プロフィールセクション */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">プロフィール</Text>
          <View className="bg-gray-50 p-4 rounded-lg">
            <Text className="text-base font-medium mb-2">
              {user?.user_metadata?.name || "ユーザー"}
            </Text>
            <Text className="text-gray-600 mb-4">{user?.email}</Text>
            <Button variant="secondary">
              プロフィール編集
            </Button>
          </View>
        </View>

        {/* アプリ設定セクション */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">アプリ設定</Text>
          <View className="bg-gray-50 p-4 rounded-lg">
            <Text className="text-base mb-2">通知</Text>
            <Text className="text-base mb-2">プライバシー</Text>
          </View>
        </View>

        {/* サポートセクション */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">サポート</Text>
          <View className="bg-gray-50 p-4 rounded-lg">
            <Text className="text-base mb-2">バージョン</Text>
          </View>
        </View>

        {/* ログアウトボタン */}
        <View className="mt-6">
          <Button variant="secondary" onPress={handleLogout}>
            ログアウト
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
