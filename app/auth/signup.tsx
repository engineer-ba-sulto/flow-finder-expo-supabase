import React, { useState } from "react";
import { Text, View, SafeAreaView, Pressable, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    general?: string;
  }>({});

  const { signUp } = useAuth();

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

    // パスワード確認チェック
    if (!confirmPassword) {
      newErrors.confirmPassword = "パスワード確認は必須です";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "パスワードが一致しません";
    }

    // 利用規約チェック
    if (!agreedToTerms) {
      newErrors.terms = "利用規約とプライバシーポリシーに同意してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // サインアップ処理
  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({}); // エラーをクリア
    setShowSuccessMessage(false);

    try {
      const trimmedEmail = email.trim();
      const result = await signUp(trimmedEmail, password);
      
      if (result.error) {
        // Supabaseエラーメッセージの改善
        let errorMessage = "アカウント作成に失敗しました";
        if (result.error.message.includes("User already registered")) {
          errorMessage = "このメールアドレスは既に登録されています";
        } else if (result.error.message.includes("Password should be at least")) {
          errorMessage = "パスワードは6文字以上で入力してください";
        } else if (result.error.message.includes("Signup is disabled")) {
          errorMessage = "現在新規登録を停止しています";
        }
        setErrors({ general: errorMessage });
      } else {
        // サインアップ成功時は確認メッセージを表示
        // error がnullまたはundefinedの場合は成功と判断
        setShowSuccessMessage(true);
        // フォームをクリア
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setAgreedToTerms(false);
      }
    } catch (error) {
      console.error("Signup error:", error);
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
    <SafeAreaView className="flex-1 bg-white" accessibilityLabel="アカウント作成画面">
      <View className="flex-1 px-6 py-8 justify-center">
        {/* ロゴ・アプリ名エリア */}
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-[#FFC400] mb-2" accessibilityRole="text" accessibilityLabel="Flow Finder ロゴ">
            Flow Finder
          </Text>
          <Text className="text-lg text-gray-600" accessibilityRole="text">
            アカウント作成
          </Text>
        </View>

        {/* 成功メッセージ */}
        {showSuccessMessage && (
          <View className="bg-green-50 border border-green-200 rounded-md px-4 py-3 mb-6">
            <Text className="text-green-700 text-sm font-medium text-center mb-1" accessibilityRole="alert" accessibilityLiveRegion="assertive">
              確認メールを送信しました
            </Text>
            <Text className="text-green-600 text-sm text-center">
              メールに記載されたリンクをクリックして、アカウントを有効化してください
            </Text>
          </View>
        )}

        {/* フォームエリア */}
        <View className="mb-6" accessibilityLabel="アカウント作成フォーム">
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
            accessibilityHint="使用するメールアドレスを入力してください"
          />

          {/* パスワード入力 */}
          <View className="relative">
            <Input
              placeholder="パスワード"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="new-password"
              error={!!errors.password}
              errorMessage={errors.password}
              accessibilityLabel="パスワード入力"
              accessibilityHint="6文字以上のパスワードを入力してください"
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

          {/* パスワード確認入力 */}
          <View className="relative">
            <Input
              placeholder="パスワード確認"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoComplete="new-password"
              error={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
              accessibilityLabel="パスワード確認入力"
              accessibilityHint="同じパスワードをもう一度入力してください"
            />
            
            {/* パスワード確認表示切り替えボタン */}
            <Pressable
              className="absolute right-3 top-3 p-1 rounded-md"
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              accessibilityLabel="パスワード確認表示切り替え"
              accessibilityRole="button"
              accessibilityHint={showConfirmPassword ? "パスワードを隠します" : "パスワードを表示します"}
              accessibilityState={{
                expanded: showConfirmPassword
              }}
            >
              <Text className="text-[#FFC400] font-medium text-sm">
                {showConfirmPassword ? "隠す" : "表示"}
              </Text>
            </Pressable>
          </View>

          {/* 利用規約同意チェックボックス */}
          <View className="mb-4">
            <Pressable
              className="flex-row items-start py-3"
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              accessibilityLabel="利用規約とプライバシーポリシーに同意"
              accessibilityRole="checkbox"
              accessibilityState={{ checked: agreedToTerms }}
              accessibilityHint="タップして利用規約とプライバシーポリシーへの同意を切り替えます"
            >
              <View className={`w-5 h-5 rounded border-2 mr-3 mt-0.5 ${
                agreedToTerms 
                  ? "bg-[#FFC400] border-[#FFC400]" 
                  : "bg-white border-gray-300"
              } items-center justify-center`}>
                {agreedToTerms && (
                  <Text className="text-white text-xs font-bold">✓</Text>
                )}
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 text-sm leading-5">
                  <Link href="/terms" asChild>
                    <Pressable accessibilityRole="link">
                      <Text className="text-[#FFC400] underline">利用規約</Text>
                    </Pressable>
                  </Link>
                  <Text>と</Text>
                  <Link href="/privacy" asChild>
                    <Pressable accessibilityRole="link">
                      <Text className="text-[#FFC400] underline">プライバシーポリシー</Text>
                    </Pressable>
                  </Link>
                  <Text>に同意する</Text>
                </Text>
              </View>
            </Pressable>
            {errors.terms && (
              <Text className="text-red-500 text-sm mt-1" accessibilityRole="alert">
                {errors.terms}
              </Text>
            )}
          </View>

          {/* 一般的なエラーメッセージ */}
          {errors.general && (
            <View className="bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
              <Text className="text-red-600 text-sm text-center" accessibilityRole="alert" accessibilityLiveRegion="assertive">
                {errors.general}
              </Text>
            </View>
          )}

          {/* サインアップボタン */}
          <Button
            variant="primary"
            onPress={handleSignup}
            disabled={isLoading}
            className="mb-4"
            accessibilityRole="button"
            accessibilityLabel={isLoading ? "アカウント作成処理中" : "アカウント作成ボタン"}
            accessibilityHint={isLoading ? "アカウント作成処理を実行中です" : "タップしてアカウントを作成します"}
            accessibilityState={{
              disabled: isLoading,
              busy: isLoading
            }}
          >
            <View className="flex-row items-center justify-center">
              {isLoading && (
                <ActivityIndicator 
                  size="small" 
                  color="#FFFFFF" 
                  className="mr-2" 
                  accessibilityLabel="ローディング中"
                />
              )}
              <Text className="text-white font-medium">
                {isLoading ? "アカウント作成中..." : "アカウントを作成する"}
              </Text>
            </View>
          </Button>
        </View>

        {/* ログインリンク */}
        <View className="items-center" accessibilityLabel="ログイン">
          <Text className="text-gray-600 mb-2 text-center" accessibilityRole="text">
            すでにアカウントをお持ちの方
          </Text>
          <Link href="/auth/login" asChild>
            <Pressable 
              accessibilityRole="link"
              accessibilityLabel="ログインページに移動"
              accessibilityHint="既存のアカウントでログインするページに移動します"
              className="px-4 py-2 rounded-md"
            >
              <Text className="text-[#FFC400] font-medium underline text-center">
                ログイン
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}