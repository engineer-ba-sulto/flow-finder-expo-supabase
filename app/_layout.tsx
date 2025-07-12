import { Stack, Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../hooks/useAuth";
import "../global.css";

export default function Layout() {
  const { loading, isAuthenticated } = useAuth();

  // 認証状態の初期化中はローディング表示
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FFC400" />
      </View>
    );
  }

  // 未認証時はログイン画面にリダイレクト
  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  // 認証済み時はタブナビゲーションを表示
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
    </Stack>
  );
}
