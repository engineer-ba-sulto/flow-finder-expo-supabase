import { AuthError, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { getSupabaseClient } from "../lib/supabase";

/**
 * 認証結果の型定義
 */
interface AuthResult {
  /** エラー情報（成功時はnull） */
  error: AuthError | null;
}

/**
 * useAuthフックの戻り値の型定義
 */
interface UseAuthReturn {
  /** 現在のユーザー情報 */
  user: User | null;
  /** ローディング状態 */
  loading: boolean;
  /** エラー情報 */
  error: AuthError | Error | null;
  /** サインイン関数 */
  signIn: (email: string, password: string) => Promise<AuthResult>;
  /** サインアップ関数 */
  signUp: (email: string, password: string) => Promise<AuthResult>;
  /** サインアウト関数 */
  signOut: () => Promise<AuthResult>;
}

/**
 * 認証機能を提供するカスタムフック
 *
 * Supabase Auth を使用してユーザーの認証状態を管理し、
 * ログイン、ログアウト、ユーザー登録機能を提供します。
 *
 * @returns {UseAuthReturn} 認証状態と認証関数
 */
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | Error | null>(null);

  const supabase = getSupabaseClient();

  useEffect(() => {
    // 初期セッション取得
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          setError(error);
          setUser(null);
        } else {
          setUser(data.session?.user ?? null);
          setError(null);
        }
      } catch (err) {
        setError(err as Error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // 認証状態変更の監視
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // 認証状態変更時はエラーをクリア
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        setError(null);
      }
    });

    // クリーンアップ関数でリスナーを削除
    return () => {
      if (authListener?.data?.subscription?.unsubscribe) {
        authListener.data.subscription.unsubscribe();
      }
    };
  }, [supabase]);

  /**
   * メールアドレスとパスワードでサインイン
   *
   * @param email - メールアドレス
   * @param password - パスワード
   * @returns {Promise<AuthResult>} 認証結果
   */
  const signIn = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      // 成功時にユーザー状態を即座に更新
      if (data.user) {
        setUser(data.user);
        setError(null);
      }

      return { error: null };
    } catch (err) {
      return { error: err as AuthError };
    }
  };

  /**
   * メールアドレスとパスワードでサインアップ
   *
   * @param email - メールアドレス
   * @param password - パスワード
   * @returns {Promise<AuthResult>} 認証結果
   */
  const signUp = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      // 成功時にユーザー状態を即座に更新
      if (data.user) {
        setUser(data.user);
        setError(null);
      }

      return { error: null };
    } catch (err) {
      return { error: err as AuthError };
    }
  };

  /**
   * サインアウト
   *
   * @returns {Promise<AuthResult>} 認証結果
   */
  const signOut = async (): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error };
      }

      // 成功時にユーザー状態を即座にクリア
      setUser(null);
      setError(null);

      return { error: null };
    } catch (err) {
      return { error: err as AuthError };
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
  };
};
