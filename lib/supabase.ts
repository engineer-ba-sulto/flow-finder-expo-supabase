import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase設定の型定義
 */
interface SupabaseConfig {
  /** Supabase プロジェクトのURL */
  url: string;
  /** 匿名認証キー */
  anonKey: string;
}

/**
 * 環境変数の定数定義
 */
const ENV_KEYS = {
  SUPABASE_URL: "EXPO_PUBLIC_SUPABASE_URL",
  SUPABASE_ANON_KEY: "EXPO_PUBLIC_SUPABASE_ANON_KEY",
} as const;

/**
 * 開発環境かどうかを判定
 */
const isDevelopment = (): boolean => {
  return (
    process.env.NODE_ENV === "development" ||
    (typeof __DEV__ !== "undefined" && __DEV__)
  );
};

/**
 * 設定値のバリデーション
 * @param url - Supabase URL
 * @param anonKey - 匿名認証キー
 * @throws {Error} バリデーションエラー
 */
const validateConfig = (url: string, anonKey: string): void => {
  if (!url.startsWith("https://")) {
    throw new Error("Supabase URLはhttpsで始まる必要があります");
  }

  if (!url.includes(".supabase.co")) {
    throw new Error("有効なSupabase URLではありません");
  }

  if (anonKey.length < 100) {
    throw new Error("Supabase匿名キーの形式が正しくありません");
  }
};

/**
 * 環境変数からSupabase設定を取得・バリデーション
 * @returns {SupabaseConfig} 検証済みの設定オブジェクト
 * @throws {Error} 環境変数が未設定またはバリデーションエラー
 */
const getSupabaseConfig = (): SupabaseConfig => {
  const url = process.env[ENV_KEYS.SUPABASE_URL];
  const anonKey = process.env[ENV_KEYS.SUPABASE_ANON_KEY];

  if (!url) {
    throw new Error(`${ENV_KEYS.SUPABASE_URL}環境変数が設定されていません`);
  }

  if (!anonKey) {
    throw new Error(
      `${ENV_KEYS.SUPABASE_ANON_KEY}環境変数が設定されていません`
    );
  }

  // 本番環境でのみバリデーションを実行（テスト環境での柔軟性を保持）
  if (!isDevelopment()) {
    validateConfig(url, anonKey);
  }

  if (isDevelopment()) {
    console.log("[Supabase Debug] 設定を読み込みました:", { url });
  }

  return { url, anonKey };
};

// シングルトンパターンでクライアントインスタンスを管理
let supabaseClient: SupabaseClient | null = null;
let cachedConfig: SupabaseConfig | null = null;

/**
 * 設定をキャッシュ付きで取得（パフォーマンス最適化）
 * @returns {SupabaseConfig} キャッシュされた設定オブジェクト
 */
const getCachedConfig = (): SupabaseConfig => {
  if (!cachedConfig) {
    cachedConfig = getSupabaseConfig();
  }
  return cachedConfig;
};

/**
 * Supabase URL を取得
 * @returns {string} Supabase プロジェクトのURL
 */
export const getSupabaseUrl = (): string => {
  const { url } = getCachedConfig();
  return url;
};

/**
 * Supabase 匿名認証キーを取得
 * @returns {string} 匿名認証キー
 */
export const getSupabaseAnonKey = (): string => {
  const { anonKey } = getCachedConfig();
  return anonKey;
};

/**
 * Supabase クライアントを取得（シングルトンパターン）
 * @returns {SupabaseClient} Supabaseクライアントインスタンス
 * @throws {Error} 環境変数が未設定の場合
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseClient) {
    const { url, anonKey } = getCachedConfig();

    if (isDevelopment()) {
      console.log("[Supabase Debug] 新しいクライアントを作成します");
    }

    supabaseClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return supabaseClient;
};

/**
 * Supabaseクライアントのリセット（テスト用）
 * 注意: 本番環境では使用しないでください
 */
export const resetSupabaseClient = (): void => {
  if (isDevelopment()) {
    supabaseClient = null;
    cachedConfig = null;
    console.log("[Supabase Debug] クライアントをリセットしました");
  }
};

// デフォルトエクスポート（遅延初期化）
let defaultClient: SupabaseClient | null = null;

/**
 * デフォルトのSupabaseクライアントを取得
 * @returns {SupabaseClient} デフォルトクライアントインスタンス
 */
const getDefaultClient = (): SupabaseClient => {
  if (!defaultClient) {
    defaultClient = getSupabaseClient();
  }
  return defaultClient;
};

export default getDefaultClient();
