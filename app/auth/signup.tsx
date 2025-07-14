import { Link, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { Input } from "../../components/ui/Input";
import { BRAND_COLOR } from "../../constants/app";
import { useAuth } from "../../hooks/useAuth";

// 定数定義
const EMAIL_MAX_LENGTH = 255;
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 128;

// バリデーションメッセージ
const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: "メールアドレスは必須です",
  EMAIL_INVALID: "有効なメールアドレスを入力してください",
  EMAIL_TOO_LONG: "メールアドレスが長すぎます",
  PASSWORD_REQUIRED: "パスワードは必須です",
  PASSWORD_TOO_SHORT: "パスワードは6文字以上で入力してください",
  PASSWORD_TOO_LONG: "パスワードが長すぎます",
  CONFIRM_PASSWORD_REQUIRED: "パスワード確認は必須です",
  PASSWORDS_NOT_MATCH: "パスワードが一致しません",
  TERMS_REQUIRED: "利用規約とプライバシーポリシーに同意してください",
} as const;

// エラーメッセージ
const ERROR_MESSAGES = {
  SIGNUP_FAILED: "アカウント作成に失敗しました",
  USER_EXISTS: "このメールアドレスは既に登録されています",
  SIGNUP_DISABLED: "現在新規登録を停止しています",
  NETWORK_ERROR: "ネットワークエラーが発生しました",
  CONNECTION_ERROR: "インターネット接続を確認してください",
  TIMEOUT_ERROR: "リクエストがタイムアウトしました。再度お試しください",
} as const;

// 成功メッセージ
const SUCCESS_MESSAGES = {
  EMAIL_SENT: "確認メールを送信しました",
  ACTIVATION_INSTRUCTION:
    "メールに記載されたリンクをクリックして、アカウントを有効化してください",
} as const;

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
  const router = useRouter();

  // Supabaseエラーメッセージの変換
  const getSignupErrorMessage = useCallback((errorMessage: string) => {
    if (errorMessage.includes("User already registered")) {
      return ERROR_MESSAGES.USER_EXISTS;
    }
    if (errorMessage.includes("Password should be at least")) {
      return VALIDATION_MESSAGES.PASSWORD_TOO_SHORT;
    }
    if (errorMessage.includes("Signup is disabled")) {
      return ERROR_MESSAGES.SIGNUP_DISABLED;
    }
    return ERROR_MESSAGES.SIGNUP_FAILED;
  }, []);

  // ネットワークエラーメッセージの変換
  const getNetworkErrorMessage = useCallback((error: unknown) => {
    if (error instanceof Error) {
      if (error.message.includes("Network request failed")) {
        return ERROR_MESSAGES.CONNECTION_ERROR;
      }
      if (error.message.includes("timeout")) {
        return ERROR_MESSAGES.TIMEOUT_ERROR;
      }
    }
    return ERROR_MESSAGES.NETWORK_ERROR;
  }, []);

  // フォームリセット
  const resetForm = useCallback(() => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAgreedToTerms(false);
  }, []);

  // パスワード表示切り替えボタンコンポーネントは直接インラインで実装

  // メールアドレスバリデーション
  const validateEmail = useCallback((emailValue: string) => {
    const trimmed = emailValue.trim();
    if (!trimmed) return VALIDATION_MESSAGES.EMAIL_REQUIRED;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed))
      return VALIDATION_MESSAGES.EMAIL_INVALID;
    if (trimmed.length > EMAIL_MAX_LENGTH)
      return VALIDATION_MESSAGES.EMAIL_TOO_LONG;
    return null;
  }, []);

  // パスワードバリデーション
  const validatePassword = useCallback((passwordValue: string) => {
    if (!passwordValue) return VALIDATION_MESSAGES.PASSWORD_REQUIRED;
    if (passwordValue.length < PASSWORD_MIN_LENGTH)
      return VALIDATION_MESSAGES.PASSWORD_TOO_SHORT;
    if (passwordValue.length > PASSWORD_MAX_LENGTH)
      return VALIDATION_MESSAGES.PASSWORD_TOO_LONG;
    return null;
  }, []);

  // パスワード確認バリデーション
  const validateConfirmPassword = useCallback(
    (confirmValue: string, originalPassword: string) => {
      if (!confirmValue) return VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED;
      if (originalPassword !== confirmValue)
        return VALIDATION_MESSAGES.PASSWORDS_NOT_MATCH;
      return null;
    },
    []
  );

  // フォーム全体のバリデーション
  const validateForm = useCallback(() => {
    const newErrors: typeof errors = {};

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(
      confirmPassword,
      password
    );
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    if (!agreedToTerms) {
      newErrors.terms = VALIDATION_MESSAGES.TERMS_REQUIRED;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [
    email,
    password,
    confirmPassword,
    agreedToTerms,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
  ]);

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
        const errorMessage = getSignupErrorMessage(result.error.message);
        setErrors({ general: errorMessage });
      } else {
        // サインアップ成功時は確認メッセージを表示
        setShowSuccessMessage(true);
        resetForm();
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage = getNetworkErrorMessage(error);
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      accessibilityLabel="アカウント作成画面"
    >
      {/* ヘッダー部分 - 画面カタログに従ったデザイン */}
      <View className={`bg-[${BRAND_COLOR}] p-4`}>
        <Text
          className="text-xl font-bold text-[#212121]"
          accessibilityRole="text"
        >
          📝 新規登録
        </Text>
      </View>

      <View className="flex-1 p-6 justify-between">
        <View>
          {/* 成功メッセージ */}
          {showSuccessMessage && (
            <View className="bg-green-50 border border-green-200 rounded-md px-4 py-3 mb-6">
              <Text
                className="text-green-700 text-sm font-medium text-center mb-1"
                accessibilityRole="alert"
                accessibilityLiveRegion="assertive"
              >
                {SUCCESS_MESSAGES.EMAIL_SENT}
              </Text>
              <Text className="text-green-600 text-sm text-center">
                {SUCCESS_MESSAGES.ACTIVATION_INSTRUCTION}
              </Text>
            </View>
          )}

          {/* フォームエリア */}
          <View className="gap-4" accessibilityLabel="アカウント作成フォーム">
            {/* メールアドレス入力 */}
            <View>
              <Text className="text-sm text-[#212121] font-medium mb-1">
                メールアドレス
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
                accessibilityHint="使用するメールアドレスを入力してください"
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
                autoComplete="new-password"
                error={!!errors.password}
                errorMessage={errors.password}
                accessibilityLabel="パスワード入力"
                accessibilityHint="6文字以上のパスワードを入力してください"
              />
              <View className="absolute right-3 top-8 p-1">
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  accessibilityLabel="パスワード表示切り替え"
                  accessibilityRole="button"
                  accessibilityHint={
                    showPassword
                      ? "パスワードを隠します"
                      : "パスワードを表示します"
                  }
                  accessibilityState={{ expanded: showPassword }}
                >
                  <Text className={`text-xs text-[${BRAND_COLOR}] font-medium`}>
                    {showPassword ? "隠す" : "表示"}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* パスワード確認入力 */}
            <View className="relative">
              <Text className="text-sm text-[#212121] font-medium mb-1">
                パスワード確認
              </Text>
              <Input
                placeholder="••••••••••••"
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
              <View className="absolute right-3 top-8 p-1">
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  accessibilityLabel="パスワード確認表示切り替え"
                  accessibilityRole="button"
                  accessibilityHint={
                    showConfirmPassword
                      ? "パスワードを隠します"
                      : "パスワードを表示します"
                  }
                  accessibilityState={{ expanded: showConfirmPassword }}
                >
                  <Text className={`text-xs text-[${BRAND_COLOR}] font-medium`}>
                    {showConfirmPassword ? "隠す" : "表示"}
                  </Text>
                </Pressable>
              </View>
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
                <View
                  className={`w-5 h-5 rounded border-2 mr-3 mt-0.5 ${
                    agreedToTerms
                      ? `bg-[${BRAND_COLOR}] border-[${BRAND_COLOR}]`
                      : "bg-white border-gray-300"
                  } items-center justify-center`}
                >
                  {agreedToTerms && (
                    <Text className="text-white text-xs font-bold">✓</Text>
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-gray-700 text-sm leading-5">
                    <Text
                      className={`text-[${BRAND_COLOR}] underline`}
                      onPress={() =>
                        Linking.openURL("https://jpstockminimemo.arafipro.com/")
                      }
                      accessibilityRole="link"
                      accessibilityLabel="利用規約を開く"
                    >
                      利用規約
                    </Text>
                    <Text>と</Text>
                    <Text
                      className={`text-[${BRAND_COLOR}] underline`}
                      onPress={() =>
                        Linking.openURL("https://jpstockminimemo.arafipro.com/")
                      }
                      accessibilityRole="link"
                      accessibilityLabel="プライバシーポリシーを開く"
                    >
                      プライバシーポリシー
                    </Text>
                    <Text>に同意する</Text>
                  </Text>
                </View>
              </Pressable>
              {errors.terms && (
                <Text
                  className="text-red-500 text-sm mt-1"
                  accessibilityRole="alert"
                >
                  {errors.terms}
                </Text>
              )}
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
        </View>

        {/* ボタンエリア */}
        <View className="gap-3 mt-6">
          {/* サインアップボタン */}
          <Pressable
            onPress={handleSignup}
            disabled={isLoading}
            className={`w-full bg-[${BRAND_COLOR}] text-[#212121] font-semibold py-3 px-4 rounded-xl ${
              isLoading ? "opacity-50" : ""
            }`}
            accessibilityRole="button"
            accessibilityLabel={
              isLoading ? "アカウント作成処理中" : "アカウント作成ボタン"
            }
            accessibilityHint={
              isLoading
                ? "アカウント作成処理を実行中です"
                : "タップしてアカウントを作成します"
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
                {isLoading ? "アカウント作成中..." : "アカウントを作成する"}
              </Text>
            </View>
          </Pressable>

          {/* ログインボタン */}
          <Link href="/auth/login" asChild>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="ログインページに移動"
              accessibilityHint="既存のアカウントでログインするページに移動します"
              className="w-full border border-gray-300 text-[#212121] font-semibold py-3 px-4 rounded-xl"
            >
              <Text className="text-[#212121] font-semibold text-sm text-center">
                ログイン
              </Text>
            </Pressable>
          </Link>

          {/* パスワードを忘れた */}
          {/* <View className="items-center">
            <Pressable className="text-[#212121] underline text-xs">
              <Text className="text-[#212121] underline text-xs">パスワードをお忘れですか？</Text>
            </Pressable>
          </View> */}
        </View>
      </View>
    </SafeAreaView>
  );
}
