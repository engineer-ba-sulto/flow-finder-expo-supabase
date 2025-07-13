import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SettingsScreen from "../settings";

// React Navigationのモック
jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  useFocusEffect: jest.fn(),
}));

// useAuthフックのモック
jest.mock("../../../hooks/useAuth", () => ({
  useAuth: jest.fn(() => ({
    user: { 
      email: "test@example.com",
      user_metadata: { 
        name: "テストユーザー" 
      }
    },
    loading: false,
    error: null,
    isAuthenticated: true,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  })),
}));

// 設定画面のテスト（Red Phase）
describe("<SettingsScreen />", () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    jest.clearAllMocks();
  });

  test("設定画面のタイトルが表示されること", async () => {
    const { getByText } = render(<SettingsScreen />);
    
    await waitFor(() => {
      expect(getByText("設定")).toBeTruthy();
    });
  });

  test("認証済みユーザーのプロフィール情報が表示されること", async () => {
    const { getByText } = render(<SettingsScreen />);
    
    await waitFor(() => {
      expect(getByText("プロフィール")).toBeTruthy();
      expect(getByText("テストユーザー")).toBeTruthy();
      expect(getByText("test@example.com")).toBeTruthy();
    });
  });

  test("ログアウトボタンが表示されること", async () => {
    const { getByText } = render(<SettingsScreen />);
    
    await waitFor(() => {
      expect(getByText("ログアウト")).toBeTruthy();
    });
  });

  test("ログアウトボタンをタップするとログアウト処理が実行されること", async () => {
    const mockSignOut = jest.fn();
    const mockUseAuth = require("../../../hooks/useAuth").useAuth;
    mockUseAuth.mockReturnValue({
      user: { 
        email: "test@example.com",
        user_metadata: { 
          name: "テストユーザー" 
        }
      },
      loading: false,
      error: null,
      isAuthenticated: true,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: mockSignOut,
    });

    const { getByText } = render(<SettingsScreen />);
    
    const logoutButton = getByText("ログアウト");
    fireEvent.press(logoutButton);
    
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
  });

  test("アプリ設定セクションが表示されること", async () => {
    const { getByText } = render(<SettingsScreen />);
    
    await waitFor(() => {
      expect(getByText("アプリ設定")).toBeTruthy();
    });
  });

  test("通知設定が表示されること", async () => {
    const { getByText } = render(<SettingsScreen />);
    
    await waitFor(() => {
      expect(getByText("通知")).toBeTruthy();
    });
  });

  test("プライバシー設定が表示されること", async () => {
    const { getByText } = render(<SettingsScreen />);
    
    await waitFor(() => {
      expect(getByText("プライバシー")).toBeTruthy();
    });
  });

  test("サポート・ヘルプセクションが表示されること", async () => {
    const { getByText } = render(<SettingsScreen />);
    
    await waitFor(() => {
      expect(getByText("サポート")).toBeTruthy();
    });
  });

  test("未認証ユーザーの場合にログイン案内が表示されること", async () => {
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

    const { getByText } = render(<SettingsScreen />);
    
    await waitFor(() => {
      expect(getByText("ログインが必要です")).toBeTruthy();
    });
  });

  test("ローディング中にローディングインジケータが表示されること", async () => {
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

    const { getByText } = render(<SettingsScreen />);
    
    await waitFor(() => {
      expect(getByText("読み込み中...")).toBeTruthy();
    });
  });

  test("エラー状態でエラーメッセージが表示されること", async () => {
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

    const { getByText } = render(<SettingsScreen />);
    
    await waitFor(() => {
      expect(getByText("エラーが発生しました")).toBeTruthy();
    });
  });

  test("プロフィール編集ボタンが表示されること", async () => {
    const { getByText } = render(<SettingsScreen />);
    
    await waitFor(() => {
      expect(getByText("プロフィール編集")).toBeTruthy();
    });
  });

  test("アプリバージョン情報が表示されること", async () => {
    const { getByText } = render(<SettingsScreen />);
    
    await waitFor(() => {
      expect(getByText("バージョン")).toBeTruthy();
    });
  });
});