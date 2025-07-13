import React, { useState } from "react";
import { Text, View, SafeAreaView, Pressable, ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth } from "../../hooks/useAuth";
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
          errorMessage = "メールアドレスが確認されていません。メールを確認してください";
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
      {/* 戻るボタン */}
      <View className="px-6 pt-4">
        <Pressable
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/");
            }
          }}
          className="flex-row items-center"
          accessibilityRole="button"
          accessibilityLabel="前の画面に戻る"
          accessibilityHint="ホーム画面に戻ります"
        >
          <FontAwesome name="arrow-left" size={20} color="#666666" />
          <Text className="ml-2 text-gray-600 text-base">戻る</Text>
        </Pressable>
      </View>
      
      <View className="flex-1 px-6 py-8 justify-center">
        {/* ロゴ・アプリ名エリア */}
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-[#FFC400] mb-2" accessibilityRole="text" accessibilityLabel="Flow Finder ロゴ">
            Flow Finder
          </Text>
          <Text className="text-lg text-gray-600" accessibilityRole="text">
            ログイン
          </Text>
        </View>

        {/* フォームエリア */}
        <View className="mb-6" accessibilityLabel="ログインフォーム">
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
            accessibilityHint="登録済みのメールアドレスを入力してください"
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
              accessibilityHint="アカウントのパスワードを入力してください"
            />
            
            {/* パスワード表示切り替えボタン */}
            <Pressable
              className="absolute right-3 top-3 p-1 rounded-md"
              onPress={() => setShowPassword(!showPassword)}
              accessibilityLabel="パスワード表示切り替え"
              accessibilityRole="button"
              accessibilityHint={showPassword ? "パスワードを隠します" : "パスワードを表示します"}
              accessibilityState={{
                expanded: showPassword
              }}
            >
              <Text className="text-[#FFC400] font-medium text-sm">
                {showPassword ? "隠す" : "表示"}
              </Text>
            </Pressable>
          </View>

          {/* 一般的なエラーメッセージ */}
          {errors.general && (
            <View className="bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
              <Text className="text-red-600 text-sm text-center" accessibilityRole="alert" accessibilityLiveRegion="assertive">
                {errors.general}
              </Text>
            </View>
          )}

          {/* ログインボタン */}
          <Pressable
            onPress={handleLogin}
            disabled={isLoading}
            className={`bg-[#FFC400] px-4 py-3 rounded-lg mb-4 ${isLoading ? 'opacity-50' : ''}`}
            accessibilityRole="button"
            accessibilityLabel={isLoading ? "ログイン処理中" : "ログインボタン"}
            accessibilityHint={isLoading ? "ログイン処理を実行中です" : "タップしてログインします"}
            accessibilityState={{
              disabled: isLoading,
              busy: isLoading
            }}
          >
            <View className="flex-row items-center justify-center">
              {isLoading && (
                <ActivityIndicator 
                  size="small" 
                  color="#000000" 
                  className="mr-2" 
                  accessibilityLabel="ローディング中"
                />
              )}
              <Text className="text-black font-medium text-center">
                {isLoading ? "ログイン中..." : "ログインする"}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* サインアップリンク */}
        <View className="items-center" accessibilityLabel="アカウント作成">
          <Text className="text-gray-600 mb-2 text-center" accessibilityRole="text">
            アカウントをお持ちでない方
          </Text>
          <Link href="/auth/signup" asChild>
            <Pressable 
              accessibilityRole="link"
              accessibilityLabel="サインアップページに移動"
              accessibilityHint="新しいアカウントを作成するページに移動します"
              className="px-4 py-2 rounded-md"
            >
              <Text className="text-[#FFC400] font-medium underline text-center">
                サインアップ
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}