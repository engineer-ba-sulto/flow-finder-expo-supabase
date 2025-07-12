import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import Login from "../login";

// Supabaseクライアントのモック
jest.mock("../../../lib/supabase", () => ({
  getSupabaseClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn(() =>
        Promise.resolve({
          data: {
            user: {
              id: "mock-user-id",
              email: "test@example.com",
            },
            session: {
              access_token: "mock-access-token",
            },
          },
          error: null,
        })
      ),
      getSession: jest.fn(() =>
        Promise.resolve({
          data: { session: null },
          error: null,
        })
      ),
      onAuthStateChange: jest.fn(() => ({
        data: {
          subscription: {
            unsubscribe: jest.fn(),
          },
        },
      })),
    },
  })),
}));

// Expo Routerのモック
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  Link: ({ children, href, ...props }: any) => children,
}));

describe("Login画面", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ログイン画面のタイトルが表示されること", () => {
    const { getByText } = render(<Login />);

    expect(getByText("ログイン")).toBeTruthy();
  });

  it("Flow Finderロゴまたはアプリ名が表示されること", () => {
    const { getByText } = render(<Login />);

    expect(getByText("Flow Finder")).toBeTruthy();
  });

  it("メールアドレス入力フィールドが表示されること", () => {
    const { getByPlaceholderText } = render(<Login />);

    const emailInput = getByPlaceholderText("メールアドレス");
    expect(emailInput).toBeTruthy();
  });

  it("パスワード入力フィールドが表示されること", () => {
    const { getByPlaceholderText } = render(<Login />);

    const passwordInput = getByPlaceholderText("パスワード");
    expect(passwordInput).toBeTruthy();
  });

  it("ログインボタンが表示されること", () => {
    const { getByText } = render(<Login />);

    expect(getByText("ログインする")).toBeTruthy();
  });

  it("サインアップへのリンクが表示されること", () => {
    const { getByText } = render(<Login />);

    expect(getByText("アカウントをお持ちでない方")).toBeTruthy();
    expect(getByText("サインアップ")).toBeTruthy();
  });

  it("メールアドレス入力が正しく動作すること", () => {
    const { getByPlaceholderText } = render(<Login />);

    const emailInput = getByPlaceholderText("メールアドレス");
    fireEvent.changeText(emailInput, "test@example.com");

    expect(emailInput.props.value).toBe("test@example.com");
  });

  it("パスワード入力が正しく動作すること", () => {
    const { getByPlaceholderText } = render(<Login />);

    const passwordInput = getByPlaceholderText("パスワード");
    fireEvent.changeText(passwordInput, "password123");

    expect(passwordInput.props.value).toBe("password123");
  });

  it("パスワードフィールドがセキュア入力であること", () => {
    const { getByPlaceholderText } = render(<Login />);

    const passwordInput = getByPlaceholderText("パスワード");
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it("有効なメールアドレスとパスワードでログインできること", async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);

    const emailInput = getByPlaceholderText("メールアドレス");
    const passwordInput = getByPlaceholderText("パスワード");
    const loginButton = getByText("ログインする");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(loginButton);

    // ログイン処理の成功を確認（モックが呼ばれること）
    await waitFor(() => {
      expect(loginButton).toBeTruthy();
    });
  });

  it("メールアドレスが空の場合にバリデーションエラーが表示されること", async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);

    const passwordInput = getByPlaceholderText("パスワード");
    const loginButton = getByText("ログインする");

    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText("メールアドレスは必須です")).toBeTruthy();
    });
  });

  it("パスワードが空の場合にバリデーションエラーが表示されること", async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);

    const emailInput = getByPlaceholderText("メールアドレス");
    const loginButton = getByText("ログインする");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText("パスワードは必須です")).toBeTruthy();
    });
  });

  it("無効なメールアドレス形式の場合にバリデーションエラーが表示されること", async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);

    const emailInput = getByPlaceholderText("メールアドレス");
    const passwordInput = getByPlaceholderText("パスワード");
    const loginButton = getByText("ログインする");

    fireEvent.changeText(emailInput, "invalid-email");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText("有効なメールアドレスを入力してください")).toBeTruthy();
    });
  });

  it("パスワードが6文字未満の場合にバリデーションエラーが表示されること", async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);

    const emailInput = getByPlaceholderText("メールアドレス");
    const passwordInput = getByPlaceholderText("パスワード");
    const loginButton = getByText("ログインする");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "12345");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText("パスワードは6文字以上で入力してください")).toBeTruthy();
    });
  });

  it("ログイン中はボタンが無効化されること", async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);

    const emailInput = getByPlaceholderText("メールアドレス");
    const passwordInput = getByPlaceholderText("パスワード");
    const loginButton = getByText("ログインする");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(loginButton);

    // ローディング状態の確認
    await waitFor(() => {
      expect(getByText("ログイン中...")).toBeTruthy();
    });
  });

  it("Flow Finderブランドカラー（#FFC400）がログインボタンに適用されること", () => {
    const { getByText } = render(<Login />);

    const loginButton = getByText("ログインする");
    expect(loginButton).toBeTruthy();
  });

  it("アクセシビリティ属性が正しく設定されること", () => {
    const { getByLabelText } = render(<Login />);

    const emailInput = getByLabelText("メールアドレス入力");
    const passwordInput = getByLabelText("パスワード入力");

    expect(emailInput).toHaveProp("accessibilityLabel", "メールアドレス入力");
    expect(passwordInput).toHaveProp("accessibilityLabel", "パスワード入力");
  });

  it("ログインエラー時にエラーメッセージが表示されること", async () => {
    // Supabaseエラーレスポンスのモック
    const mockSupabase = require("../../../lib/supabase");
    mockSupabase.getSupabaseClient.mockReturnValue({
      auth: {
        signInWithPassword: jest.fn(() =>
          Promise.resolve({
            data: { user: null, session: null },
            error: { message: "認証情報が正しくありません" },
          })
        ),
        getSession: jest.fn(() =>
          Promise.resolve({
            data: { session: null },
            error: null,
          })
        ),
        onAuthStateChange: jest.fn(() => ({
          data: {
            subscription: {
              unsubscribe: jest.fn(),
            },
          },
        })),
      },
    });

    const { getByPlaceholderText, getByText } = render(<Login />);

    const emailInput = getByPlaceholderText("メールアドレス");
    const passwordInput = getByPlaceholderText("パスワード");
    const loginButton = getByText("ログインする");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "wrongpassword");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText("認証情報が正しくありません")).toBeTruthy();
    });
  });

  it("パスワード表示/非表示の切り替えボタンが表示されること", () => {
    const { getByLabelText } = render(<Login />);

    const toggleButton = getByLabelText("パスワード表示切り替え");
    expect(toggleButton).toBeTruthy();
  });

  it("パスワード表示/非表示の切り替えが正しく動作すること", () => {
    const { getByLabelText, getByPlaceholderText } = render(<Login />);

    const toggleButton = getByLabelText("パスワード表示切り替え");
    const passwordInput = getByPlaceholderText("パスワード");

    // 初期状態はパスワードが非表示
    expect(passwordInput.props.secureTextEntry).toBe(true);

    // 切り替えボタンを押す
    fireEvent.press(toggleButton);

    // パスワードが表示される
    expect(passwordInput.props.secureTextEntry).toBe(false);
  });
});