import React, { useState } from "react";
import { Text, View, SafeAreaView, Pressable } from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

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
    if (!email.trim()) {
      newErrors.email = "メールアドレスは必須です";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "有効なメールアドレスを入力してください";
    }

    // パスワードチェック
    if (!password) {
      newErrors.password = "パスワードは必須です";
    } else if (password.length < 6) {
      newErrors.password = "パスワードは6文字以上で入力してください";
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
      const result = await signIn(email, password);
      
      if (result.error) {
        setErrors({ general: result.error.message || "ログインに失敗しました" });
      } else {
        // ログイン成功時はメイン画面に遷移
        router.replace("/(tabs)");
      }
    } catch (error) {
      setErrors({ general: "ネットワークエラーが発生しました" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-8 justify-center">
        {/* ロゴ・アプリ名エリア */}
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-[#FFC400] mb-2">
            Flow Finder
          </Text>
          <Text className="text-lg text-gray-600">
            ログイン
          </Text>
        </View>

        {/* フォームエリア */}
        <View className="mb-6">
          {/* メールアドレス入力 */}
          <Input
            placeholder="メールアドレス"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={!!errors.email}
            errorMessage={errors.email}
            accessibilityLabel="メールアドレス入力"
          />

          {/* パスワード入力 */}
          <View className="relative">
            <Input
              placeholder="パスワード"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="current-password"
              error={!!errors.password}
              errorMessage={errors.password}
              accessibilityLabel="パスワード入力"
            />
            
            {/* パスワード表示切り替えボタン */}
            <Pressable
              className="absolute right-3 top-3"
              onPress={() => setShowPassword(!showPassword)}
              accessibilityLabel="パスワード表示切り替え"
              accessibilityRole="button"
            >
              <Text className="text-[#FFC400] font-medium">
                {showPassword ? "隠す" : "表示"}
              </Text>
            </Pressable>
          </View>

          {/* 一般的なエラーメッセージ */}
          {errors.general && (
            <Text className="text-red-500 text-sm mb-4 text-center">
              {errors.general}
            </Text>
          )}

          {/* ログインボタン */}
          <Button
            variant="primary"
            onPress={handleLogin}
            disabled={isLoading}
            className="mb-4"
          >
            {isLoading ? "ログイン中..." : "ログインする"}
          </Button>
        </View>

        {/* サインアップリンク */}
        <View className="items-center">
          <Text className="text-gray-600 mb-2">
            アカウントをお持ちでない方
          </Text>
          <Link href="/auth/signup" asChild>
            <Pressable accessibilityRole="link">
              <Text className="text-[#FFC400] font-medium underline">
                サインアップ
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}