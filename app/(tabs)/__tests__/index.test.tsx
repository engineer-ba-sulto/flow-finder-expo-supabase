import { render, waitFor } from "@testing-library/react-native";
import HomeScreen from "../index";

// React Navigationのモック
jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  useFocusEffect: jest.fn(),
}));

// Supabaseクライアントのモック
jest.mock("../../../lib/supabase", () => ({
  getSupabaseClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ count: 0, error: null })),
      })),
    })),
  })),
}));

// useAuthフックのモック
jest.mock("../../../hooks/useAuth", () => ({
  useAuth: jest.fn(() => ({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  })),
}));

// ホーム画面のテスト（Red Phase）
describe("<HomeScreen />", () => {
  test("ホーム画面のウェルカムメッセージが表示されること", async () => {
    const { getByText } = render(<HomeScreen />);
    
    await waitFor(() => {
      expect(getByText("Flow Finderへようこそ")).toBeTruthy();
    });
  });

  test("認証されていないユーザーに対してログイン案内が表示されること", async () => {
    const { getByText } = render(<HomeScreen />);
    
    await waitFor(() => {
      expect(getByText("ログインして始めましょう")).toBeTruthy();
    });
  });

  test("認証されていないユーザーに対してログインボタンが表示されること", async () => {
    const { getByText } = render(<HomeScreen />);
    
    await waitFor(() => {
      expect(getByText("ログイン")).toBeTruthy();
    });
  });

  test("認証されていないユーザーに対してサインアップボタンが表示されること", async () => {
    const { getByText } = render(<HomeScreen />);
    
    await waitFor(() => {
      expect(getByText("新規登録")).toBeTruthy();
    });
  });

  test("認証済みユーザーに対してパーソナライズされた挨拶が表示されること", async () => {
    // 認証済みユーザーのモック
    const mockUseAuth = require("../../../hooks/useAuth").useAuth;
    mockUseAuth.mockReturnValue({
      user: { email: "test@example.com" },
      loading: false,
      error: null,
      isAuthenticated: true,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    });

    const { getByText } = render(<HomeScreen />);
    
    await waitFor(() => {
      expect(getByText("おかえりなさい")).toBeTruthy();
    });
  });

  test("認証済みユーザーに対してクイックアクションセクションが表示されること", async () => {
    // 認証済みユーザーのモック
    const mockUseAuth = require("../../../hooks/useAuth").useAuth;
    mockUseAuth.mockReturnValue({
      user: { email: "test@example.com" },
      loading: false,
      error: null,
      isAuthenticated: true,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    });

    const { getByText } = render(<HomeScreen />);
    
    await waitFor(() => {
      expect(getByText("クイックアクション")).toBeTruthy();
    });
  });

  test("認証済みユーザーに対してゴール一覧へのリンクが表示されること", async () => {
    // 認証済みユーザーのモック
    const mockUseAuth = require("../../../hooks/useAuth").useAuth;
    mockUseAuth.mockReturnValue({
      user: { email: "test@example.com" },
      loading: false,
      error: null,
      isAuthenticated: true,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    });

    const { getByText } = render(<HomeScreen />);
    
    await waitFor(() => {
      expect(getByText("ゴールを確認")).toBeTruthy();
    });
  });

  test("ローディング中にローディングインジケータが表示されること", async () => {
    // ローディング状態のモック
    const mockUseAuth = require("../../../hooks/useAuth").useAuth;
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      error: null,
      isAuthenticated: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    });

    const { getByText } = render(<HomeScreen />);
    
    await waitFor(() => {
      expect(getByText("読み込み中...")).toBeTruthy();
    });
  });

  test("エラー状態でエラーメッセージが表示されること", async () => {
    // エラー状態のモック
    const mockUseAuth = require("../../../hooks/useAuth").useAuth;
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      error: new Error("認証エラー"),
      isAuthenticated: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    });

    const { getByText } = render(<HomeScreen />);
    
    await waitFor(() => {
      expect(getByText("エラーが発生しました")).toBeTruthy();
    });
  });

  test("アプリの基本説明が表示されること", async () => {
    // 正常状態のモック（未認証ユーザー）
    const mockUseAuth = require("../../../hooks/useAuth").useAuth;
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    });

    const { getByText } = render(<HomeScreen />);
    
    await waitFor(() => {
      expect(getByText("あなたの成長を妨げる「見えない壁」を見つけ、壊すためのパーソナルコーチング アプリ")).toBeTruthy();
    });
  });
});