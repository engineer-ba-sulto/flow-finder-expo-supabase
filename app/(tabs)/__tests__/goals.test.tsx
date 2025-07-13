import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import Goals from "../goals";

// useAuthフックのモック
jest.mock("../../../hooks/useAuth", () => ({
  useAuth: jest.fn(() => ({
    isAuthenticated: true,
    loading: false,
    user: {
      id: "mock-user-id",
      email: "test@example.com",
      created_at: new Date().toISOString(),
    },
    error: null,
  })),
}));

// Supabaseクライアントのモック
jest.mock("../../../lib/supabase", () => ({
  getSupabaseClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() =>
            Promise.resolve({
              data: [],
              count: 0,
              error: null,
            })
          ),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() =>
            Promise.resolve({
              data: {
                id: "mock-id",
                title: "テストゴール",
                description: "テスト説明",
                priority: 2,
                status: "active",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                user_id: "mock-user-id",
              },
              error: null,
            })
          ),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() =>
              Promise.resolve({
                data: null,
                error: null,
              })
            ),
          })),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() =>
          Promise.resolve({
            data: null,
            error: null,
          })
        ),
      })),
    })),
  })),
}));

// ゴール管理画面のテスト（Red Phase）
describe("<Goals />", () => {
  test("ゴール管理画面のタイトルが表示されること", async () => {
    const { getByText } = render(<Goals />);

    // ローディング完了を待つ
    await waitFor(() => {
      expect(getByText("ゴール管理")).toBeTruthy();
    });
  });

  test("新規ゴール作成ボタンが表示されること", async () => {
    const { getByText } = render(<Goals />);

    // ローディング完了を待つ
    await waitFor(() => {
      expect(getByText("新しいゴールを作成")).toBeTruthy();
    });
  });

  test("ゴール一覧が表示されること", async () => {
    const { getByText } = render(<Goals />);

    // ローディング完了を待つ
    await waitFor(() => {
      expect(getByText("まだゴールがありません")).toBeTruthy();
    });
  });

  test("新規ゴール作成ボタンをタップするとゴール作成フォームが表示されること", async () => {
    const { getByText } = render(<Goals />);

    // ローディング完了を待つ
    await waitFor(() => {
      expect(getByText("新しいゴールを作成")).toBeTruthy();
    });

    // 新規ゴール作成ボタンをタップ
    const createButton = getByText("新しいゴールを作成");
    await act(async () => {
      fireEvent.press(createButton);
    });

    // ゴール作成フォームが表示されることを確認（作成ボタンの存在で判定）
    expect(getByText("作成")).toBeTruthy();
  });

  test("ゴール作成フォームにタイトル入力フィールドが表示されること", async () => {
    const { getByText, getByPlaceholderText } = render(<Goals />);

    // ローディング完了を待つ
    await waitFor(() => {
      expect(getByText("新しいゴールを作成")).toBeTruthy();
    });

    // 新規ゴール作成ボタンをタップしてフォームを表示
    const createButton = getByText("新しいゴールを作成");
    await act(async () => {
      fireEvent.press(createButton);
    });

    // タイトル入力フィールドが表示されることを確認
    expect(getByPlaceholderText("例：英語を流暢に話せるようになる")).toBeTruthy();
  });

  test("ゴール作成フォームに説明入力フィールドが表示されること", async () => {
    const { getByText, getByPlaceholderText } = render(<Goals />);

    // ローディング完了を待つ
    await waitFor(() => {
      expect(getByText("新しいゴールを作成")).toBeTruthy();
    });

    // 新規ゴール作成ボタンをタップしてフォームを表示
    const createButton = getByText("新しいゴールを作成");
    await act(async () => {
      fireEvent.press(createButton);
    });

    // 説明入力フィールドが表示されることを確認
    expect(getByPlaceholderText("ゴールの詳細説明を入力してください")).toBeTruthy();
  });

  test("ゴール作成フォームに保存ボタンが表示されること", async () => {
    const { getByText } = render(<Goals />);

    // ローディング完了を待つ
    await waitFor(() => {
      expect(getByText("新しいゴールを作成")).toBeTruthy();
    });

    // 新規ゴール作成ボタンをタップしてフォームを表示
    const createButton = getByText("新しいゴールを作成");
    await act(async () => {
      fireEvent.press(createButton);
    });

    // 作成ボタンが表示されることを確認
    expect(getByText("作成")).toBeTruthy();
  });

  test("ゴール作成フォームにキャンセルボタンが表示されること", async () => {
    const { getByText } = render(<Goals />);

    // ローディング完了を待つ
    await waitFor(() => {
      expect(getByText("新しいゴールを作成")).toBeTruthy();
    });

    // 新規ゴール作成ボタンをタップしてフォームを表示
    const createButton = getByText("新しいゴールを作成");
    await act(async () => {
      fireEvent.press(createButton);
    });

    // キャンセルボタンが表示されることを確認
    expect(getByText("キャンセル")).toBeTruthy();
  });

  test("キャンセルボタンをタップするとゴール作成フォームが非表示になること", async () => {
    const { getByText, queryByText } = render(<Goals />);

    // ローディング完了を待つ
    await waitFor(() => {
      expect(getByText("新しいゴールを作成")).toBeTruthy();
    });

    // 新規ゴール作成ボタンをタップしてフォームを表示
    const createButton = getByText("新しいゴールを作成");
    await act(async () => {
      fireEvent.press(createButton);
    });

    // キャンセルボタンをタップ
    const cancelButton = getByText("キャンセル");
    await act(async () => {
      fireEvent.press(cancelButton);
    });

    // ゴール作成フォームが非表示になることを確認（作成ボタンがなくなる）
    expect(queryByText("作成")).toBeNull();
  });

  test("既存のゴールアイテムに編集ボタンが表示されること", async () => {
    // モックデータでゴールが存在する状態を作成
    const mockGoalData = [
      {
        id: "test-goal-1",
        title: "テストゴール1",
        description: "テスト説明1",
        user_id: "mock-user-id",
        created_at: new Date().toISOString(),
      }
    ];

    // Supabaseクライアントのモックを更新
    const mockSupabase = require("../../../lib/supabase").getSupabaseClient();
    mockSupabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() =>
            Promise.resolve({
              data: mockGoalData,
              count: 1,
              error: null,
            })
          ),
        })),
      })),
    });

    const { getByTestId } = render(<Goals />);

    // ゴールが読み込まれるまで待つ
    await waitFor(() => {
      expect(getByTestId("goal-edit-button-test-goal-1")).toBeTruthy();
    });
  });

  test("既存のゴールアイテムに削除ボタンが表示されること", async () => {
    // モックデータでゴールが存在する状態を作成
    const mockGoalData = [
      {
        id: "test-goal-1",
        title: "テストゴール1",
        description: "テスト説明1",
        user_id: "mock-user-id",
        created_at: new Date().toISOString(),
      }
    ];

    // Supabaseクライアントのモックを更新
    const mockSupabase = require("../../../lib/supabase").getSupabaseClient();
    mockSupabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() =>
            Promise.resolve({
              data: mockGoalData,
              count: 1,
              error: null,
            })
          ),
        })),
      })),
    });

    const { getByTestId } = render(<Goals />);

    // ゴールが読み込まれるまで待つ
    await waitFor(() => {
      expect(getByTestId("goal-delete-button-test-goal-1")).toBeTruthy();
    });
  });

  test("削除ボタンをタップすると確認ダイアログが表示されること", async () => {
    // モックデータでゴールが存在する状態を作成
    const mockGoalData = [
      {
        id: "test-goal-1",
        title: "テストゴール1",
        description: "テスト説明1",
        user_id: "mock-user-id",
        created_at: new Date().toISOString(),
      }
    ];

    // Supabaseクライアントのモックを更新
    const mockSupabase = require("../../../lib/supabase").getSupabaseClient();
    mockSupabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() =>
            Promise.resolve({
              data: mockGoalData,
              count: 1,
              error: null,
            })
          ),
        })),
      })),
    });

    // React Native Alertのモック
    const mockAlert = jest.spyOn(require("react-native").Alert, "alert");

    const { getByTestId } = render(<Goals />);

    // ゴールが読み込まれるまで待つ
    await waitFor(() => {
      expect(getByTestId("goal-delete-button-test-goal-1")).toBeTruthy();
    });

    // 削除ボタンをタップ
    const deleteButton = getByTestId("goal-delete-button-test-goal-1");
    await act(async () => {
      fireEvent.press(deleteButton);
    });

    // 確認ダイアログが表示されることを確認
    expect(mockAlert).toHaveBeenCalledWith(
      "ゴールを削除",
      "本当に「テストゴール1」を削除しますか？この操作は取り消せません。",
      expect.any(Array)
    );

    mockAlert.mockRestore();
  });

  test("編集ボタンをタップするとゴール編集フォームが表示されること", async () => {
    // モックデータでゴールが存在する状態を作成
    const mockGoalData = [
      {
        id: "test-goal-1",
        title: "テストゴール1",
        description: "テスト説明1",
        user_id: "mock-user-id",
        created_at: new Date().toISOString(),
      }
    ];

    // Supabaseクライアントのモックを更新
    const mockSupabase = require("../../../lib/supabase").getSupabaseClient();
    mockSupabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() =>
            Promise.resolve({
              data: mockGoalData,
              count: 1,
              error: null,
            })
          ),
        })),
      })),
    });

    const { getByTestId, getByText } = render(<Goals />);

    // ゴールが読み込まれるまで待つ
    await waitFor(() => {
      expect(getByTestId("goal-edit-button-test-goal-1")).toBeTruthy();
    });

    // 編集ボタンをタップ
    const editButton = getByTestId("goal-edit-button-test-goal-1");
    await act(async () => {
      fireEvent.press(editButton);
    });

    // 編集フォームが表示されることを確認
    expect(getByText("ゴールを編集")).toBeTruthy();
    expect(getByText("更新")).toBeTruthy();
  });

  test("ゴールが存在しない場合に空状態メッセージが表示されること", async () => {
    const { getByText } = render(<Goals />);

    // ローディング完了を待つ
    await waitFor(() => {
      expect(getByText("ゴールがありません")).toBeTruthy();
      expect(getByText("最初のゴールを作成して")).toBeTruthy();
    });
  });
});
