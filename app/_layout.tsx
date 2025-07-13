import { Stack } from "expo-router";
import { ActivityIndicator, View, Text } from "react-native";
import { useAuth } from "../hooks/useAuth";
import "../global.css";
import React, { useMemo } from "react";
import { AuthError } from "@supabase/supabase-js";

interface LayoutState {
  loading: boolean;
  isAuthenticated: boolean;
  error: AuthError | Error | null;
  user: any;
}

interface LoadingScreenProps {
  testID?: string;
}

interface ErrorScreenProps {
  error: AuthError | Error | null;
  onRetry?: () => void;
  testID?: string;
}

// 認証ローディング画面コンポーネント
const AuthLoadingScreen: React.FC<LoadingScreenProps> = React.memo(({ testID = "auth-loading" }) => {
  return (
    <View 
      className="flex-1 justify-center items-center bg-white" 
      testID={testID}
      accessibilityRole="none"
      accessibilityLabel="認証状態を確認中です"
    >
      <ActivityIndicator 
        size="large" 
        color="#FFC400" 
        accessibilityLabel="読み込み中"
      />
      <Text 
        className="mt-4 text-gray-600 text-center"
        accessibilityRole="text"
      >
        認証状態を確認中...
      </Text>
    </View>
  );
});

// エラー画面コンポーネント（将来的な拡張用）
const AuthErrorScreen: React.FC<ErrorScreenProps> = React.memo(({ error, onRetry, testID = "auth-error" }) => {
  const errorMessage = useMemo(() => {
    if (!error) return "不明なエラーが発生しました";
    return error.message || "認証エラーが発生しました";
  }, [error]);

  return (
    <View 
      className="flex-1 justify-center items-center bg-white px-4" 
      testID={testID}
      accessibilityRole="none"
    >
      <Text 
        className="text-red-500 text-center mb-4"
        accessibilityRole="text"
        accessibilityLabel={`エラー: ${errorMessage}`}
      >
        エラー: {errorMessage}
      </Text>
      {onRetry && (
        <Text 
          className="text-blue-500 text-center"
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="再試行"
        >
          再試行
        </Text>
      )}
    </View>
  );
});

AuthLoadingScreen.displayName = 'AuthLoadingScreen';
AuthErrorScreen.displayName = 'AuthErrorScreen';

export default function Layout(): JSX.Element {
  const authState = useAuth() as LayoutState;
  const { loading, isAuthenticated, error } = authState;

  // メモ化されたナビゲーションスタック設定
  const stackScreenOptions = useMemo(() => ({
    headerShown: false,
    animation: 'slide_from_right' as const,
  }), []);

  // デバッグ: 認証状態をコンソールに出力
  if (__DEV__) {
    console.log('[Layout Debug] 認証状態:', { loading, isAuthenticated, error: error?.message });
  }

  // 常にStackを返し、画面レベルで認証チェックを行う
  return (
    <Stack 
      screenOptions={stackScreenOptions}
      initialRouteName={!isAuthenticated ? "auth/login" : "(tabs)"}
    >
      <Stack.Screen 
        name="(tabs)" 
        options={{
          ...stackScreenOptions,
          title: 'Flow Finder',
        }} 
      />
      <Stack.Screen 
        name="auth/login" 
        options={{
          ...stackScreenOptions,
          title: 'ログイン',
        }} 
      />
      <Stack.Screen 
        name="auth/signup" 
        options={{
          ...stackScreenOptions,
          title: 'サインアップ',
        }} 
      />
    </Stack>
  );
}
