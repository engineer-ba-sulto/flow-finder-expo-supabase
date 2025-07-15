import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import GoalList from "../GoalList";
import { Goal, GoalPriority, GoalStatus } from "../../../types/goal.types";

// expo-routerのモック
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  router: {
    push: mockPush,
  },
}));

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
              data: mockGoalList,
              error: null,
            })
          ),
        })),
      })),
    })),
  })),
}));

const mockGoalList: Goal[] = [
  {
    id: "goal-1",
    title: "英語学習マスター",
    description: "TOEIC900点を目指して学習を継続する",
    priority: GoalPriority.HIGH,
    status: GoalStatus.ACTIVE,
    created_at: new Date("2024-01-01T00:00:00.000Z"),
    updated_at: new Date("2024-01-01T00:00:00.000Z"),
    user_id: "mock-user-id",
  },
  {
    id: "goal-2",
    title: "健康的な生活習慣",
    description: "毎日の運動と規則正しい食事を実践する",
    priority: GoalPriority.MEDIUM,
    status: GoalStatus.ACTIVE,
    created_at: new Date("2024-01-02T00:00:00.000Z"),
    updated_at: new Date("2024-01-02T00:00:00.000Z"),
    user_id: "mock-user-id",
  },
  {
    id: "goal-3",
    title: "資格試験合格",
    description: "プロジェクトマネジメント資格の取得",
    priority: GoalPriority.HIGH,
    status: GoalStatus.COMPLETED,
    created_at: new Date("2023-12-01T00:00:00.000Z"),
    updated_at: new Date("2024-03-15T00:00:00.000Z"),
    user_id: "mock-user-id",
  },
];

// GoalListコンポーネントのテスト（Red Phase）
describe("<GoalList />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("ゴール一覧が正しく表示されること", async () => {
    const { getByText } = render(<GoalList />);

    await waitFor(() => {
      // 各ゴールのタイトルが表示されることを確認
      expect(getByText("💼 英語学習マスター")).toBeTruthy();
      expect(getByText("🏃 健康的な生活習慣")).toBeTruthy();
      expect(getByText("✅ 資格試験合格")).toBeTruthy();
    });
  });

  test("タブナビゲーションが表示されること", async () => {
    const { getByText } = render(<GoalList />);

    await waitFor(() => {
      // 未達成・達成済みタブが表示されることを確認
      expect(getByText("未達成")).toBeTruthy();
      expect(getByText("達成済み")).toBeTruthy();
    });
  });

  test("デフォルトで未達成タブがアクティブになること", async () => {
    const { getByTestId } = render(<GoalList />);

    await waitFor(() => {
      // 未達成タブがアクティブ状態であることを確認
      const activeTab = getByTestId("active-goals-tab");
      expect(activeTab).toHaveStyle({ backgroundColor: "#FFC400" }); // bg-primary

      // 達成済みタブがインアクティブ状態であることを確認
      const completedTab = getByTestId("completed-goals-tab");
      expect(completedTab).toHaveStyle({ backgroundColor: "#e5e7eb" }); // bg-gray-200
    });
  });

  test("達成済みタブをタップすると表示が切り替わること", async () => {
    const { getByTestId, getByText } = render(<GoalList />);

    await waitFor(() => {
      expect(getByTestId("completed-goals-tab")).toBeTruthy();
    });

    // 達成済みタブをタップ
    const completedTab = getByTestId("completed-goals-tab");
    fireEvent.press(completedTab);

    await waitFor(() => {
      // 達成済みゴールのみが表示されることを確認
      expect(getByText("✅ 資格試験合格")).toBeTruthy();
      
      // 達成済みタブがアクティブになることを確認
      expect(completedTab).toHaveStyle({ backgroundColor: "#FFC400" });
    });
  });

  test("未達成タブをタップすると表示が切り替わること", async () => {
    const { getByTestId, getByText } = render(<GoalList />);

    // 最初に達成済みタブをタップ
    const completedTab = getByTestId("completed-goals-tab");
    fireEvent.press(completedTab);

    await waitFor(() => {
      expect(getByTestId("active-goals-tab")).toBeTruthy();
    });

    // 未達成タブをタップ
    const activeTab = getByTestId("active-goals-tab");
    fireEvent.press(activeTab);

    await waitFor(() => {
      // 未達成ゴールが表示されることを確認
      expect(getByText("💼 英語学習マスター")).toBeTruthy();
      expect(getByText("🏃 健康的な生活習慣")).toBeTruthy();
      
      // 未達成タブがアクティブになることを確認
      expect(activeTab).toHaveStyle({ backgroundColor: "#FFC400" });
    });
  });

  test("空状態が正しく表示されること", async () => {
    // 空のゴールリストでテスト
    const emptyGoalList: Goal[] = [];
    jest.mocked(require("../../../lib/supabase").getSupabaseClient).mockImplementation(() => ({
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () => Promise.resolve({
              data: emptyGoalList,
              error: null,
            }),
          }),
        }),
      }),
    }));

    const { getByText, getByTestId } = render(<GoalList />);

    await waitFor(() => {
      // 空状態メッセージが表示されることを確認
      expect(getByText("まだゴールが設定されていません")).toBeTruthy();
      expect(getByText("最初のゴールを作成してみましょう！")).toBeTruthy();
      
      // 空状態画像が表示されることを確認
      const emptyStateImage = getByTestId("empty-state-icon");
      expect(emptyStateImage).toBeTruthy();
    });
  });

  test("ロード中状態が表示されること", async () => {
    const { getByTestId } = render(<GoalList loading={true} />);

    await waitFor(() => {
      // ローディングインジケーターが表示されることを確認
      expect(getByTestId("loading-indicator")).toBeTruthy();
    });
  });

  test("エラー状態が表示されること", async () => {
    const errorMessage = "ゴールの取得に失敗しました";
    const { getByText } = render(<GoalList error={errorMessage} />);

    await waitFor(() => {
      // エラーメッセージが表示されることを確認
      expect(getByText(errorMessage)).toBeTruthy();
    });
  });

  test("優先度順でソートされること", async () => {
    const { getAllByTestId } = render(<GoalList />);

    await waitFor(() => {
      // ゴールカードの順序を確認
      const goalCards = getAllByTestId(/goal-card-/);
      
      // 高優先度のゴールが最初に表示されることを確認
      expect(goalCards[0]).toHaveAttribute("testID", "goal-card-goal-1"); // 英語学習マスター（高優先度）
      expect(goalCards[1]).toHaveAttribute("testID", "goal-card-goal-2"); // 健康的な生活習慣（中優先度）
    });
  });

  test("作成日順でソートできること", async () => {
    const { getByTestId } = render(<GoalList />);

    await waitFor(() => {
      expect(getByTestId("sort-by-created-button")).toBeTruthy();
    });

    // 作成日順ソートボタンをタップ
    const sortButton = getByTestId("sort-by-created-button");
    fireEvent.press(sortButton);

    await waitFor(() => {
      // 作成日順でソートされることを確認
      const goalCards = getAllByTestId(/goal-card-/);
      expect(goalCards[0]).toHaveAttribute("testID", "goal-card-goal-2"); // 2024-01-02（新しい）
      expect(goalCards[1]).toHaveAttribute("testID", "goal-card-goal-1"); // 2024-01-01（古い）
    });
  });

  test("ステータスでフィルタリングできること", async () => {
    const { getByText, queryByText } = render(<GoalList />);

    // 未達成タブの状態で確認
    await waitFor(() => {
      // アクティブなゴールのみ表示されることを確認
      expect(getByText("💼 英語学習マスター")).toBeTruthy();
      expect(getByText("🏃 健康的な生活習慣")).toBeTruthy();
      
      // 完了済みゴールは表示されないことを確認
      expect(queryByText("✅ 資格試験合格")).toBeFalsy();
    });
  });

  test("ゴール作成ボタンが表示されること", async () => {
    const { getByTestId } = render(<GoalList />);

    await waitFor(() => {
      expect(getByTestId("create-goal-button")).toBeTruthy();
    });
  });

  test("ゴール作成ボタンをタップすると作成画面に遷移すること", async () => {
    const { getByTestId } = render(<GoalList />);

    await waitFor(() => {
      expect(getByTestId("create-goal-button")).toBeTruthy();
    });

    // ゴール作成ボタンをタップ
    const createButton = getByTestId("create-goal-button");
    fireEvent.press(createButton);

    // ゴール作成画面への遷移を確認
    expect(mockPush).toHaveBeenCalledWith("/modal/create-goal");
  });

  test("Flow Finderブランドカラーが正確に適用されること", async () => {
    const { getByTestId } = render(<GoalList />);

    await waitFor(() => {
      // アクティブタブのprimary色（#FFC400）適用を確認
      const activeTab = getByTestId("active-goals-tab");
      expect(activeTab).toHaveStyle({ backgroundColor: "#FFC400" });
      
      // ゴール作成ボタンのprimary色適用を確認
      const createButton = getByTestId("create-goal-button");
      expect(createButton).toHaveStyle({ backgroundColor: "#FFC400" });
      
      // ゴール作成ボタンのテキスト色（secondary: #212121）を確認
      const createButtonText = getByTestId("create-goal-button-text");
      expect(createButtonText).toHaveStyle({ color: "#212121" });
    });
  });

  test("アクセシビリティラベルが適切に設定されていること", async () => {
    const { getByTestId } = render(<GoalList />);

    await waitFor(() => {
      // タブのアクセシビリティ
      const activeTab = getByTestId("active-goals-tab");
      expect(activeTab.props.accessibilityRole).toBe("tab");
      expect(activeTab.props.accessibilityLabel).toBe("未達成のゴール一覧");
      
      const completedTab = getByTestId("completed-goals-tab");
      expect(completedTab.props.accessibilityRole).toBe("tab");
      expect(completedTab.props.accessibilityLabel).toBe("達成済みのゴール一覧");
      
      // ゴール作成ボタンのアクセシビリティ
      const createButton = getByTestId("create-goal-button");
      expect(createButton.props.accessibilityRole).toBe("button");
      expect(createButton.props.accessibilityLabel).toBe("新しいゴールを作成する");
    });
  });

  test("リフレッシュ機能が動作すること", async () => {
    const mockOnRefresh = jest.fn();
    const { getByTestId } = render(<GoalList onRefresh={mockOnRefresh} />);

    await waitFor(() => {
      expect(getByTestId("refresh-control")).toBeTruthy();
    });

    // プルトゥリフレッシュをシミュレート
    const scrollView = getByTestId("goal-list-scroll");
    fireEvent(scrollView, "refresh");

    // リフレッシュ関数が呼び出されることを確認
    expect(mockOnRefresh).toHaveBeenCalled();
  });

  test("MVP1段階の機能制限表示があること", async () => {
    const { getByText } = render(<GoalList />);

    await waitFor(() => {
      // MVP1段階の機能制限に関する表示を確認
      expect(getByText("💡 MVP1: 基本CRUD機能のみ実装済み")).toBeTruthy();
    });
  });
});