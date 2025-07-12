// 環境変数をモック（importの前に設定）
process.env.EXPO_PUBLIC_SUPABASE_URL = "https://test-project.supabase.co";
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY =
  "test-anon-key-mock-100-characters-long-string-for-proper-validation-check-testing";

import { AuthError, Session, User } from "@supabase/supabase-js";
import { act, renderHook } from "@testing-library/react-native";

// Supabaseクライアントのモック
const mockSupabaseClient = {
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
};

// Supabaseモジュールのモック
jest.mock("../../lib/supabase", () => ({
  getSupabaseClient: jest.fn(() => mockSupabaseClient),
  __esModule: true,
  default: mockSupabaseClient,
}));

// useAuthフックのインポート（実装前なのでエラーになる想定）
import { useAuth } from "../useAuth";

// テスト用のモックデータ
const mockUser: User = {
  id: "test-user-id",
  aud: "authenticated",
  role: "authenticated",
  email: "test@example.com",
  app_metadata: {},
  user_metadata: {},
  created_at: "2025-01-01T00:00:00.000Z",
  updated_at: "2025-01-01T00:00:00.000Z",
} as User;

const mockSession: Session = {
  access_token: "test-access-token",
  refresh_token: "test-refresh-token",
  expires_in: 3600,
  token_type: "bearer",
  user: mockUser,
  expires_at: Date.now() + 3600000,
} as Session;

const mockAuthError: AuthError = {
  name: "AuthError",
  message: "Invalid login credentials",
  status: 400,
} as AuthError;

// useAuth カスタムフックのテスト
describe("useAuth カスタムフック", () => {
  beforeEach(() => {
    // 各テスト前にモックをリセット
    jest.clearAllMocks();
  });

  describe("初期状態", () => {
    it("初期状態でユーザーはnull、ローディングはtrueであること", () => {
      // getSessionが未解決のPromiseを返すモック
      mockSupabaseClient.auth.getSession.mockImplementation(
        () => new Promise(() => {}) // 未解決のPromise
      );

      const { result } = renderHook(() => useAuth());

      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it("初期化時にSupabaseからセッション情報を取得すること", () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      renderHook(() => useAuth());

      expect(mockSupabaseClient.auth.getSession).toHaveBeenCalledTimes(1);
    });
  });

  describe("認証状態の管理", () => {
    it("セッションが存在する場合、ユーザー情報が設定されること", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      // セッション取得の完了を待つ
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("セッションが存在しない場合、ユーザーはnullのままであること", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("セッション取得時にエラーが発生した場合、適切にエラーが設定されること", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: mockAuthError,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toEqual(mockAuthError);
    });
  });

  describe("認証状態変更の監視", () => {
    it("認証状態変更のリスナーが設定されること", () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      // onAuthStateChangeのモック設定
      const mockUnsubscribe = jest.fn();
      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: mockUnsubscribe } },
      });

      renderHook(() => useAuth());

      expect(mockSupabaseClient.auth.onAuthStateChange).toHaveBeenCalledTimes(
        1
      );
      expect(mockSupabaseClient.auth.onAuthStateChange).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    it("コンポーネントアンマウント時にリスナーが解除されること", () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const mockUnsubscribe = jest.fn();
      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: mockUnsubscribe } },
      });

      const { unmount } = renderHook(() => useAuth());

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe("ログイン機能", () => {
    it("signInWithPasswordが正しい引数で呼び出されること", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    it("ログイン成功時にユーザー情報が更新されること", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const result_signIn = await result.current.signIn(
          "test@example.com",
          "password123"
        );
        expect(result_signIn.error).toBeNull();
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.error).toBeNull();
    });

    it("ログイン失敗時にエラーが返されること", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: mockAuthError,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const result_signIn = await result.current.signIn(
          "wrong@example.com",
          "wrongpassword"
        );
        expect(result_signIn.error).toEqual(mockAuthError);
      });

      expect(result.current.user).toBeNull();
    });
  });

  describe("ユーザー登録機能", () => {
    it("signUpが正しい引数で呼び出されること", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("newuser@example.com", "password123");
      });

      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: "newuser@example.com",
        password: "password123",
      });
    });

    it("ユーザー登録成功時にユーザー情報が更新されること", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const result_signUp = await result.current.signUp(
          "newuser@example.com",
          "password123"
        );
        expect(result_signUp.error).toBeNull();
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.error).toBeNull();
    });

    it("ユーザー登録失敗時にエラーが返されること", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: mockAuthError,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const result_signUp = await result.current.signUp(
          "invalid@example.com",
          "weak"
        );
        expect(result_signUp.error).toEqual(mockAuthError);
      });

      expect(result.current.user).toBeNull();
    });
  });

  describe("ログアウト機能", () => {
    it("signOutが呼び出されること", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      mockSupabaseClient.auth.signOut.mockResolvedValue({
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockSupabaseClient.auth.signOut).toHaveBeenCalledTimes(1);
    });

    it("ログアウト成功時にユーザー情報がクリアされること", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      mockSupabaseClient.auth.signOut.mockResolvedValue({
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      // 初期状態でユーザーが存在することを確認
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(result.current.user).toEqual(mockUser);

      // ログアウト実行
      await act(async () => {
        const result_signOut = await result.current.signOut();
        expect(result_signOut.error).toBeNull();
      });

      expect(result.current.user).toBeNull();
    });

    it("ログアウト失敗時にエラーが返されること", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      mockSupabaseClient.auth.signOut.mockResolvedValue({
        error: mockAuthError,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const result_signOut = await result.current.signOut();
        expect(result_signOut.error).toEqual(mockAuthError);
      });

      // エラーが発生してもユーザー情報は維持されている
      expect(result.current.user).toEqual(mockUser);
    });
  });

  describe("型安全性とエラーハンドリング", () => {
    it("returnされる値が正しい型を持っていること", () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      // 型安全性の確認
      expect(typeof result.current.loading).toBe("boolean");
      expect(
        result.current.user === null || typeof result.current.user === "object"
      ).toBe(true);
      expect(
        result.current.error === null ||
          typeof result.current.error === "object"
      ).toBe(true);
      expect(typeof result.current.signIn).toBe("function");
      expect(typeof result.current.signUp).toBe("function");
      expect(typeof result.current.signOut).toBe("function");
    });

    it("非同期エラーが適切にキャッチされること", async () => {
      mockSupabaseClient.auth.getSession.mockRejectedValue(
        new Error("Network error")
      );

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeDefined();
    });
  });
});
