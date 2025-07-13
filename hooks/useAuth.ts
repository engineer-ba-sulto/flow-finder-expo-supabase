import { AuthChangeEvent, AuthError, User } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "../lib/supabase";

/**
 * 認証結果の型定義
 *
 * 認証操作（サインイン、サインアップ、サインアウト）の結果を表します。
 */
interface AuthResult {
  /** エラー情報（成功時はnull） */
  error: AuthError | null;
}

/**
 * 認証状態の型定義
 *
 * アプリケーション全体の認証状態を管理するための型です。
 */
interface AuthState {
  /** 現在のユーザー情報 */
  user: User | null;
  /** ローディング状態（初期化中やAPI通信中） */
  loading: boolean;
  /** エラー情報（認証エラーまたはネットワークエラー） */
  error: AuthError | Error | null;
}

/**
 * useAuthフックの戻り値の型定義
 *
 * 認証状態と認証操作関数を含むオブジェクトの型です。
 */
interface UseAuthReturn extends AuthState {
  /**
   * メールアドレスとパスワードでサインイン
   * @param email - ユーザーのメールアドレス
   * @param password - ユーザーのパスワード
   * @returns 認証結果
   */
  signIn: (email: string, password: string) => Promise<AuthResult>;
  /**
   * メールアドレスとパスワードでユーザー登録
   * @param email - 新規ユーザーのメールアドレス
   * @param password - 新規ユーザーのパスワード
   * @returns 認証結果
   */
  signUp: (email: string, password: string) => Promise<AuthResult>;
  /**
   * サインアウト
   * @returns 認証結果
   */
  signOut: () => Promise<AuthResult>;
  /**
   * 認証済みかどうかの判定フラグ
   */
  readonly isAuthenticated: boolean;
}

/**
 * 認証機能を提供するカスタムフック
 *
 * Supabase Auth を使用してユーザーの認証状態を管理し、
 * サインイン、サインアップ、サインアウト機能を提供します。
 *
 * ## 機能
 * - セッション状態の自動監視と更新
 * - 認証エラーの適切なハンドリング
 * - TypeScript による型安全性の確保
 * - パフォーマンス最適化（useCallback、useMemo）
 *
 * ## 使用例
 * ```typescript
 * const { user, loading, signIn, signOut, isAuthenticated } = useAuth();
 *
 * if (loading) return <LoadingSpinner />;
 * if (!isAuthenticated) return <LoginForm onLogin={signIn} />;
 * return <Dashboard user={user} onLogout={signOut} />;
 * ```
 *
 * @returns {UseAuthReturn} 認証状態と認証操作関数
 */
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | Error | null>(null);

  // Supabaseクライアントをメモ化してパフォーマンス向上
  const supabase = useMemo(() => getSupabaseClient(), []);

  // 認証状態の更新を処理する共通関数
  const updateAuthState = useCallback(
    (user: User | null, error: AuthError | Error | null = null) => {
      setUser(user);
      setError(error);
      setLoading(false);
    },
    []
  );

  // 認証状態変更イベントのハンドラー
  const handleAuthStateChange = useCallback(
    (event: AuthChangeEvent, session: any) => {
      const newUser = session?.user ?? null;

      // 認証状態変更時はエラーをクリア
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        updateAuthState(newUser, null);
      } else {
        updateAuthState(newUser);
      }
    },
    [updateAuthState]
  );

  useEffect(() => {
    let isMounted = true; // メモリリーク防止のためのフラグ

    /**
     * 初期セッションを取得し、認証状態を初期化
     *
     * アプリケーション起動時にSupabaseから既存のセッション情報を取得し、
     * ユーザーがログイン済みかどうかを判定します。
     */
    const getInitialSession = async (): Promise<void> => {
      try {
        const { data, error } = await supabase.auth.getSession();

        // コンポーネントがアンマウントされていたら状態更新をスキップ
        if (!isMounted) return;

        if (error) {
          updateAuthState(null, error);
        } else {
          updateAuthState(data.session?.user ?? null);
        }
      } catch (err) {
        if (!isMounted) return;
        updateAuthState(null, err as Error);
      }
    };

    getInitialSession();

    // 認証状態変更の監視
    const authListener = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // クリーンアップ関数
    return () => {
      isMounted = false;
      if (authListener?.data?.subscription?.unsubscribe) {
        authListener.data.subscription.unsubscribe();
      }
    };
  }, [supabase, handleAuthStateChange, updateAuthState]);

  /**
   * メールアドレスとパスワードでサインイン
   * 
   * ユーザーの認証情報を使用してSupabaseにサインインを試行します。
   * 成功した場合は認証状態が自動的に更新されます。
   *
   * @param email - ユーザーのメールアドレス（必須）
   * @param password - ユーザーのパスワード（必須）
   * @returns 認証結果。成功時はerror: null、失敗時はerrorに詳細を含む
   */
  const signIn = useCallback(async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error };
      }

      // 成功時にユーザー状態を即座に更新
      if (data.user) {
        updateAuthState(data.user, null);
      }

      return { error: null };
    } catch (err) {
      return { error: err as AuthError };
    }
  }, [supabase, updateAuthState]);

  /**
   * メールアドレスとパスワードでユーザー登録
   * 
   * 新規ユーザーのアカウントを作成します。
   * Supabaseの設定によっては、メール確認が必要な場合があります。
   *
   * @param email - 新規ユーザーのメールアドレス（必須）
   * @param password - 新規ユーザーのパスワード（必須、8文字以上推奨）
   * @returns 認証結果。成功時はerror: null、失敗時はerrorに詳細を含む
   */
  const signUp = useCallback(async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error };
      }

      // 成功時にユーザー状態を即座に更新
      if (data.user) {
        updateAuthState(data.user, null);
      }

      return { error: null };
    } catch (err) {
      return { error: err as AuthError };
    }
  }, [supabase, updateAuthState]);

  /**
   * サインアウト
   * 
   * 現在のユーザーセッションを終了し、認証状態をクリアします。
   * ローカルストレージからもセッション情報が削除されます。
   *
   * @returns 認証結果。成功時はerror: null、失敗時はerrorに詳細を含む
   */
  const signOut = useCallback(async (): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error };
      }

      // 成功時にユーザー状態を即座にクリア
      updateAuthState(null, null);

      return { error: null };
    } catch (err) {
      return { error: err as AuthError };
    }
  }, [supabase, updateAuthState]);

  // 認証済み状態の判定をメモ化
  const isAuthenticated = useMemo(() => user !== null, [user]);

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    isAuthenticated,
  };
};
