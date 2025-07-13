import React from "react";
import { View, Text, ScrollView, Alert, Pressable } from "react-native";
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

  // セクションアイテムコンポーネント
  const SettingItem = ({ 
    title, 
    onPress, 
    accessibilityHint 
  }: { 
    title: string; 
    onPress?: () => void;
    accessibilityHint?: string;
  }) => (
    <Pressable
      className="py-3 px-1 border-b border-gray-100 active:bg-gray-50"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      disabled={!onPress}
    >
      <Text className="text-base text-gray-800">{title}</Text>
    </Pressable>
  );

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      accessibilityLabel="設定画面"
      showsVerticalScrollIndicator={false}
    >
      <View className="p-4 pb-8">
        {/* ヘッダー - ブランドカラーを使用 */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm border-t-4 border-[#FFC400]">
          <Text 
            className="text-2xl font-bold text-center text-gray-800"
            accessibilityRole="header"
          >
            設定
          </Text>
        </View>
        
        {/* プロフィールセクション - 改善されたデザイン */}
        <View className="mb-6">
          <Text 
            className="text-lg font-semibold mb-3 text-gray-800 px-2"
            accessibilityRole="header"
          >
            プロフィール
          </Text>
          <View className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-[#FFC400] rounded-full justify-center items-center mr-4">
                <Text className="text-white font-bold text-lg">
                  {(user?.user_metadata?.name || "ユーザー").charAt(0).toUpperCase()}
                </Text>
              </View>
              <View className="flex-1">
                <Text 
                  className="text-base font-semibold text-gray-800 mb-1"
                  accessibilityLabel={`ユーザー名: ${user?.user_metadata?.name || "ユーザー"}`}
                >
                  {user?.user_metadata?.name || "ユーザー"}
                </Text>
                <Text 
                  className="text-gray-600 text-sm"
                  accessibilityLabel={`メールアドレス: ${user?.email}`}
                >
                  {user?.email}
                </Text>
              </View>
            </View>
            <Button 
              variant="secondary"
              accessibilityHint="プロフィール編集画面に移動します"
            >
              プロフィール編集
            </Button>
          </View>
        </View>

        {/* アプリ設定セクション - アクセシビリティ改善 */}
        <View className="mb-6">
          <Text 
            className="text-lg font-semibold mb-3 text-gray-800 px-2"
            accessibilityRole="header"
          >
            アプリ設定
          </Text>
          <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <SettingItem 
              title="通知" 
              accessibilityHint="通知設定を変更できます"
            />
            <SettingItem 
              title="プライバシー" 
              accessibilityHint="プライバシー設定を確認できます"
            />
          </View>
        </View>

        {/* サポートセクション - デザイン改善 */}
        <View className="mb-6">
          <Text 
            className="text-lg font-semibold mb-3 text-gray-800 px-2"
            accessibilityRole="header"
          >
            サポート
          </Text>
          <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <SettingItem 
              title="バージョン" 
              accessibilityHint="アプリのバージョン情報を確認できます"
            />
          </View>
        </View>

        {/* ログアウトボタン - より目立つデザイン */}
        <View className="mt-8">
          <Button 
            variant="secondary" 
            onPress={handleLogout}
            className="border-2 border-red-200 bg-red-50 active:bg-red-100"
            accessibilityHint="アプリからログアウトします"
            accessibilityRole="button"
          >
            <Text className="text-red-600 font-medium">ログアウト</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
