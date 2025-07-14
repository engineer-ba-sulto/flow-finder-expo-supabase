import React, { useState } from "react";
import { View, Text, ScrollView, Alert, Pressable } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/Button";

export default function SettingsScreen() {
  const { user, loading, error, isAuthenticated, signOut } = useAuth();
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      Alert.alert("エラー", "ログアウトに失敗しました");
    }
  };

  // 通知設定トグル
  const toggleNotification = () => {
    setIsNotificationEnabled(!isNotificationEnabled);
  };

  // ユーザー名を取得
  const getUserDisplayName = () => {
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    if (user?.email) {
      const name = user.email.split('@')[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return "田中太郎";
  };

  // ローディング状態のUI改善
  if (loading) {
    return (
      <View 
        className="flex-1 justify-center items-center bg-gray-50"
        accessibilityLabel="設定画面を読み込み中"
        accessibilityRole="text"
      >
        <View className="bg-white p-6 rounded-xl shadow-sm">
          <Text className="text-gray-600 text-center text-base">読み込み中...</Text>
        </View>
      </View>
    );
  }

  // 未認証時はログイン画面にリダイレクト
  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  // エラー状態のUI改善
  if (error) {
    return (
      <View 
        className="flex-1 justify-center items-center bg-gray-50 p-4"
        accessibilityLabel="エラーが発生しました"
        accessibilityRole="alert"
      >
        <View className="bg-white p-6 rounded-xl shadow-sm border-2 border-red-200">
          <Text className="text-red-600 text-center text-base font-medium">
            エラーが発生しました
          </Text>
          <Text className="text-gray-600 text-center text-sm mt-2">
            しばらく時間をおいて再度お試しください
          </Text>
        </View>
      </View>
    );
  }

  // 未認証状態のUI改善
  if (!isAuthenticated) {
    return (
      <View 
        className="flex-1 justify-center items-center bg-gray-50 p-4"
        accessibilityLabel="ログインが必要です"
        accessibilityRole="text"
      >
        <View className="bg-white p-6 rounded-xl shadow-sm border-2 border-[#FFC400]">
          <Text className="text-gray-700 text-center text-base font-medium">
            ログインが必要です
          </Text>
          <Text className="text-gray-600 text-center text-sm mt-2">
            設定を表示するにはログインしてください
          </Text>
        </View>
      </View>
    );
  }


  return (
    <View className="flex-1 bg-white">
      {/* ヘッダー */}
      <View className="bg-[#FFC400] p-4">
        <Text className="text-xl font-bold text-[#212121]">⚙️ 設定</Text>
      </View>

      <ScrollView
        className="flex-1"
        accessibilityLabel="設定画面"
        showsVerticalScrollIndicator={false}
      >
        <View className="p-6">
          <Text
            className="text-lg font-bold text-[#212121] mb-4"
            accessibilityRole="header"
          >
            設定
          </Text>

          {/* プロフィールセクション */}
          <View className="mb-4">
            <Text
              className="text-sm font-semibold text-[#212121] mb-2"
              accessibilityRole="header"
            >
              👤 プロフィール
            </Text>
            <View className="bg-gray-50 rounded-xl p-4">
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-sm font-medium">{getUserDisplayName()}</Text>
                  <Text className="text-xs text-gray-600">{user?.email}</Text>
                </View>
                <Text className="text-gray-400">></Text>
              </View>
            </View>
          </View>

          {/* 通知設定セクション */}
          <View className="mb-4">
            <Text
              className="text-sm font-semibold text-[#212121] mb-2"
              accessibilityRole="header"
            >
              🔔 通知設定
            </Text>
            <View className="bg-gray-50 rounded-xl p-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm">基本通知</Text>
                <Pressable
                  onPress={toggleNotification}
                  className={`w-8 h-4 rounded-full ${
                    isNotificationEnabled ? 'bg-[#FFC400]' : 'bg-gray-300'
                  }`}
                  accessibilityRole="switch"
                  accessibilityState={{ checked: isNotificationEnabled }}
                  accessibilityLabel="基本通知の設定"
                >
                  <View
                    className={`w-3 h-3 rounded-full bg-white mt-0.5 ${
                      isNotificationEnabled ? 'ml-4' : 'ml-0.5'
                    }`}
                  />
                </Pressable>
              </View>
            </View>
          </View>

          {/* MVP機能予告セクション */}
          <View className="mb-6">
            <Text
              className="text-sm font-semibold text-[#212121] mb-2"
              accessibilityRole="header"
            >
              💎 今後の機能
            </Text>
            <View className="bg-gray-100 rounded-xl p-4">
              <Text className="text-sm text-gray-500 mb-2">
                MVP 2段目で追加予定：
              </Text>
              <Text className="text-xs text-gray-500 leading-4 mb-2">
                • 点検セッション機能{"\n"}
                • 制限機能（無料プラン）{"\n"}
                • プレミアム誘導UI
              </Text>
              <Text className="text-sm text-gray-500 mb-2">
                MVP 3段目で追加予定：
              </Text>
              <Text className="text-xs text-gray-500 leading-4">
                • AI提案機能{"\n"}
                • 課金システム{"\n"}
                • プレミアム機能
              </Text>
            </View>
          </View>

          {/* ログアウトボタン */}
          <Pressable
            onPress={handleLogout}
            className="w-full py-3 px-4 rounded-xl text-sm border border-[#F44336] text-center active:bg-red-50"
            accessibilityRole="button"
            accessibilityLabel="ログアウト"
            accessibilityHint="アプリからログアウトします"
          >
            <Text className="text-[#F44336] font-semibold text-center">
              ログアウト
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
