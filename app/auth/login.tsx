import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { Input } from "../../components/ui/Input";
import { BRAND_COLOR } from "../../constants/app";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const { signIn } = useAuth();
  const router = useRouter();

  // バリデーション関数
  const validateForm = () => {
    const newErrors: typeof errors = {};

    // メールアドレスチェック
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = "メールアドレスは必須です";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "有効なメールアドレスを入力してください";
    } else if (trimmedEmail.length > 255) {
      newErrors.email = "メールアドレスが長すぎます";
    }

    // パスワードチェック
    if (!password) {
      newErrors.password = "パスワードは必須です";
    } else if (password.length < 6) {
      newErrors.password = "パスワードは6文字以上で入力してください";
    } else if (password.length > 128) {
      newErrors.password = "パスワードが長すぎます";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ログイン処理
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({}); // エラーをクリア

    try {
      const trimmedEmail = email.trim();
      const result = await signIn(trimmedEmail, password);

      if (result.error) {
        // Supabaseエラーメッセージの改善
        let errorMessage = "ログインに失敗しました";
        if (result.error.message.includes("Invalid login credentials")) {
          errorMessage = "メールアドレスまたはパスワードが正しくありません";
        } else if (result.error.message.includes("Email not confirmed")) {
          errorMessage =
            "メールアドレスが確認されていません。メールを確認してください";
        } else if (result.error.message.includes("Too many requests")) {
          errorMessage = "しばらく時間をおいてから再度お試しください";
        }
        setErrors({ general: errorMessage });
      } else {
        // ログイン成功時はメイン画面に遷移
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "ネットワークエラーが発生しました";
      if (error instanceof Error) {
        if (error.message.includes("Network request failed")) {
          errorMessage = "インターネット接続を確認してください";
        } else if (error.message.includes("timeout")) {
          errorMessage = "リクエストがタイムアウトしました。再度お試しください";
        }
      }
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" accessibilityLabel="ログイン画面">
      {/* ヘッダー部分 - 画面カタログに従ったデザイン */}
      <View className={`bg-[${BRAND_COLOR}] p-4`}>
        <Text
          className="text-xl font-bold text-[#212121]"
          accessibilityRole="text"
        >
          🔐 認証
        </Text>
      </View>

      <View className="flex-1 p-6 justify-between">
        <View>
          {/* ロゴ・アプリ名エリア */}
          <View className="items-center mb-6">
            <Text
              className="text-xl font-bold text-[#212121] mb-6 text-center"
              accessibilityRole="text"
            >
              ログイン
            </Text>
          </View>

          {/* フォームエリア */}
          <View className="gap-4" accessibilityLabel="ログインフォーム">
            {/* メールアドレス入力 */}
            <View>
              <Text className="text-sm text-[#212121] font-medium mb-1">
                Email
              </Text>
              <Input
                placeholder="example@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={!!errors.email}
                errorMessage={errors.email}
                accessibilityLabel="メールアドレス入力"
                accessibilityHint="登録済みのメールアドレスを入力してください"
              />
            </View>

            {/* パスワード入力 */}
            <View className="relative">
              <Text className="text-sm text-[#212121] font-medium mb-1">
                パスワード
              </Text>
              <Input
                placeholder="••••••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="current-password"
                error={!!errors.password}
                errorMessage={errors.password}
                accessibilityLabel="パスワード入力"
                accessibilityHint="アカウントのパスワードを入力してください"
              />

              {/* パスワード表示切り替えボタン */}
              <Pressable
                className="absolute right-3 top-8 p-1"
                onPress={() => setShowPassword(!showPassword)}
                accessibilityLabel="パスワード表示切り替え"
                accessibilityRole="button"
                accessibilityHint={
                  showPassword
                    ? "パスワードを隠します"
                    : "パスワードを表示します"
                }
                accessibilityState={{
                  expanded: showPassword,
                }}
              >
                <Text className={`text-xs text-[${BRAND_COLOR}] font-medium`}>
                  {showPassword ? "隠す" : "表示"}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* 一般的なエラーメッセージ */}
          {errors.general && (
            <View className="bg-red-50 border border-red-200 rounded-md px-3 py-2">
              <Text
                className="text-red-600 text-sm text-center"
                accessibilityRole="alert"
                accessibilityLiveRegion="assertive"
              >
                {errors.general}
              </Text>
            </View>
          )}
        </View>
        {/* ボタンエリア */}
        <View className="gap-3 mt-6">
          {/* ログインボタン */}
          <Pressable
            onPress={handleLogin}
            disabled={isLoading}
            className={`w-full bg-[${BRAND_COLOR}] text-[#212121] font-semibold py-3 px-4 rounded-xl ${
              isLoading ? "opacity-50" : ""
            }`}
            accessibilityRole="button"
            accessibilityLabel={isLoading ? "ログイン処理中" : "ログインボタン"}
            accessibilityHint={
              isLoading
                ? "ログイン処理を実行中です"
                : "タップしてログインします"
            }
            accessibilityState={{
              disabled: isLoading,
              busy: isLoading,
            }}
          >
            <View className="flex-row items-center justify-center">
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color="#212121"
                  className="mr-2"
                  accessibilityLabel="ローディング中"
                />
              )}
              <Text className="text-[#212121] font-semibold text-sm text-center">
                {isLoading ? "ログイン中..." : "ログイン"}
              </Text>
            </View>
          </Pressable>

          {/* サインアップボタン */}
          <Link href="/auth/signup" asChild>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="サインアップページに移動"
              accessibilityHint="新しいアカウントを作成するページに移動します"
              className="w-full border border-gray-300 text-[#212121] font-semibold py-3 px-4 rounded-xl"
            >
              <Text className="text-[#212121] font-semibold text-sm text-center">
                新規登録
              </Text>
            </Pressable>
          </Link>

          {/* パスワードを忘れた */}
          {/* <View className="items-center">
            <Pressable className="text-[#212121] underline text-xs">
              <Text className="text-[#212121] underline text-xs">
                パスワードをお忘れですか？
              </Text>
            </Pressable>
          </View> */}
        </View>
      </View>
    </SafeAreaView>
  );
}
