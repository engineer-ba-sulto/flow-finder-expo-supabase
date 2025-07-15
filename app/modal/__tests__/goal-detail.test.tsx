import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import GoalDetail from "../goal-detail";
import { Goal, GoalPriority, GoalStatus } from "../../../types/goal.types";

// React Native Alert のモック
jest.spyOn(Alert, 'alert');

// expo-routerのモック
const mockBack = jest.fn();
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  router: {
    back: mockBack,
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
          single: jest.fn(() =>
            Promise.resolve({
              data: {
                id: "mock-goal-id",
                title: "英語学習マスター",
                description: "TOEIC900点を目指して学習を継続する",
                priority: 3,
                status: "active",
                created_at: "2024-01-01T00:00:00.000Z",
                updated_at: "2024-01-01T00:00:00.000Z",
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
                data: {
                  id: "mock-goal-id",
                  status: "completed",
                  completed_at: new Date().toISOString(),
                },
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

const mockGoalData: Goal = {
  id: "mock-goal-id", 
  title: "英語学習マスター",
  description: "TOEIC900点を目指して学習を継続する",
  priority: GoalPriority.HIGH,
  status: GoalStatus.ACTIVE,
  created_at: new Date("2024-01-01T00:00:00.000Z"),
  updated_at: new Date("2024-01-01T00:00:00.000Z"),
  user_id: "mock-user-id",
};

// ゴール詳細表示モーダルのテスト（Red Phase）
describe("<GoalDetail />", () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockPush.mockClear();
  });

  test("モーダルが正しく表示されること", async () => {
    const { getByTestId } = render(<GoalDetail goal={mockGoalData} />);

    // モーダルコンテナが表示されることを確認
    await waitFor(() => {
      const modal = getByTestId("goal-detail-modal");
      expect(modal).toBeTruthy();
      expect(modal.props.accessibilityRole).toBe("dialog");
    });
  });

  test("ゴールタイトルが表示されること", async () => {
    const { getByText } = render(<GoalDetail goal={mockGoalData} />);

    // ゴールタイトルが表示されることを確認
    await waitFor(() => {
      expect(getByText("英語学習マスター")).toBeTruthy();
    });
  });

  test("ゴールの詳細説明が表示されること", async () => {
    const { getByText } = render(<GoalDetail goal={mockGoalData} />);

    // ゴールの詳細説明が表示されることを確認
    await waitFor(() => {
      expect(getByText("TOEIC900点を目指して学習を継続する")).toBeTruthy();
    });
  });

  test("ゴール優先度が表示されること", async () => {
    const { getByText } = render(<GoalDetail goal={mockGoalData} />);

    // 優先度が表示されることを確認
    await waitFor(() => {
      expect(getByText("優先度")).toBeTruthy();
      expect(getByText("高")).toBeTruthy();
    });
  });

  test("ゴールステータスが表示されること", async () => {
    const { getByText } = render(<GoalDetail goal={mockGoalData} />);

    // ステータスが表示されることを確認
    await waitFor(() => {
      expect(getByText("ステータス")).toBeTruthy();
      expect(getByText("進行中")).toBeTruthy();
    });
  });

  test("作成日が表示されること", async () => {
    const { getByText } = render(<GoalDetail goal={mockGoalData} />);

    // 作成日が表示されることを確認
    await waitFor(() => {
      expect(getByText("作成日")).toBeTruthy();
      expect(getByText(/2024\/1\/1/)).toBeTruthy();
    });
  });

  test("編集ボタンが表示され、タップできること", async () => {
    const { getByTestId } = render(<GoalDetail goal={mockGoalData} />);

    // 編集ボタンが表示されることを確認
    await waitFor(() => {
      const editButton = getByTestId("edit-goal-button");
      expect(editButton).toBeTruthy();
      expect(editButton.props.accessibilityRole).toBe("button");
      expect(editButton.props.accessibilityLabel).toBe("ゴールを編集");
    });
  });

  test("削除ボタンが表示され、タップできること", async () => {
    const { getByTestId } = render(<GoalDetail goal={mockGoalData} />);

    // 削除ボタンが表示されることを確認
    await waitFor(() => {
      const deleteButton = getByTestId("delete-goal-button");
      expect(deleteButton).toBeTruthy();
      expect(deleteButton.props.accessibilityRole).toBe("button");
      expect(deleteButton.props.accessibilityLabel).toBe("ゴールを削除");
    });
  });

  test("達成ボタンが表示され、タップできること（未完了の場合）", async () => {
    const { getByTestId } = render(<GoalDetail goal={mockGoalData} />);

    // 達成ボタンが表示されることを確認（statusがactiveの場合）
    await waitFor(() => {
      const completeButton = getByTestId("complete-goal-button");
      expect(completeButton).toBeTruthy();
      expect(completeButton.props.accessibilityRole).toBe("button");
      expect(completeButton.props.accessibilityLabel).toBe("ゴールを達成");
    });
  });

  test("閉じるボタンが表示され、タップできること", async () => {
    const { getByTestId } = render(<GoalDetail goal={mockGoalData} />);

    // 閉じるボタンが表示されることを確認
    await waitFor(() => {
      const closeButton = getByTestId("close-modal-button");
      expect(closeButton).toBeTruthy();
      expect(closeButton.props.accessibilityRole).toBe("button");
      expect(closeButton.props.accessibilityLabel).toBe("モーダルを閉じる");
    });
  });

  test("完了済みゴールでは達成ボタンが表示されないこと", async () => {
    const completedGoal = { ...mockGoalData, status: GoalStatus.COMPLETED };
    const { queryByTestId } = render(<GoalDetail goal={completedGoal} />);

    // 完了済みの場合、達成ボタンは表示されない
    await waitFor(() => {
      const completeButton = queryByTestId("complete-goal-button");
      expect(completeButton).toBeNull();
    });
  });

  test("Flow Finderブランドカラーが適用されること", async () => {
    const { getByTestId } = render(<GoalDetail goal={mockGoalData} />);

    await waitFor(() => {
      // primary色（#FFC400）のボタンが存在することを確認
      const editButton = getByTestId("edit-goal-button");
      expect(editButton).toHaveStyle({ backgroundColor: "#FFC400" });

      // success色（#4CAF50）の達成ボタンを確認
      const completeButton = getByTestId("complete-goal-button");
      expect(completeButton).toHaveStyle({ backgroundColor: "#4CAF50" });
    });
  });

  test("編集ボタンをタップするとゴール編集モーダルに遷移すること", async () => {
    const { getByTestId } = render(<GoalDetail goal={mockGoalData} />);

    await waitFor(() => {
      expect(getByTestId("edit-goal-button")).toBeTruthy();
    });

    // 編集ボタンをタップ
    const editButton = getByTestId("edit-goal-button");
    await act(async () => {
      fireEvent.press(editButton);
    });

    // ゴール編集画面への遷移を確認
    expect(mockPush).toHaveBeenCalledWith("/modal/edit-goal?id=mock-goal-id");
  });

  test("達成ボタンをタップするとゴール完了モーダルに遷移すること", async () => {
    const { getByTestId } = render(<GoalDetail goal={mockGoalData} />);

    await waitFor(() => {
      expect(getByTestId("complete-goal-button")).toBeTruthy();
    });

    // 達成ボタンをタップ
    const completeButton = getByTestId("complete-goal-button");
    await act(async () => {
      fireEvent.press(completeButton);
    });

    // ゴール完了画面への遷移を確認
    expect(mockPush).toHaveBeenCalledWith("/modal/goal-completion?id=mock-goal-id");
  });

  test("閉じるボタンをタップするとモーダルが閉じること", async () => {
    const { getByTestId } = render(<GoalDetail goal={mockGoalData} />);

    await waitFor(() => {
      expect(getByTestId("close-modal-button")).toBeTruthy();
    });

    // 閉じるボタンをタップ
    const closeButton = getByTestId("close-modal-button");
    await act(async () => {
      fireEvent.press(closeButton);
    });

    // モーダルが閉じることを確認
    expect(mockBack).toHaveBeenCalled();
  });

  test("削除ボタンをタップすると確認ダイアログが表示されること", async () => {
    const { getByTestId, getByText } = render(<GoalDetail goal={mockGoalData} />);

    await waitFor(() => {
      expect(getByTestId("delete-goal-button")).toBeTruthy();
    });

    // 削除ボタンをタップ
    const deleteButton = getByTestId("delete-goal-button");
    await act(async () => {
      fireEvent.press(deleteButton);
    });

    // 確認ダイアログが表示されることを確認
    await waitFor(() => {
      expect(getByText("ゴールを削除しますか？")).toBeTruthy();
      expect(getByText("この操作は取り消せません。")).toBeTruthy();
    });
  });

  test("優先度の表示が正しいこと", async () => {
    // 高優先度
    const { getByText: getByTextHigh } = render(<GoalDetail goal={mockGoalData} />);
    await waitFor(() => {
      expect(getByTextHigh("高")).toBeTruthy();
    });

    // 中優先度
    const mediumGoal = { ...mockGoalData, priority: GoalPriority.MEDIUM };
    const { getByText: getByTextMedium } = render(<GoalDetail goal={mediumGoal} />);
    await waitFor(() => {
      expect(getByTextMedium("中")).toBeTruthy();
    });

    // 低優先度
    const lowGoal = { ...mockGoalData, priority: GoalPriority.LOW };
    const { getByText: getByTextLow } = render(<GoalDetail goal={lowGoal} />);
    await waitFor(() => {
      expect(getByTextLow("低")).toBeTruthy();
    });
  });

  test("アクセシビリティラベルが適切に設定されていること", async () => {
    const { getByTestId } = render(<GoalDetail goal={mockGoalData} />);

    await waitFor(() => {
      // モーダル自体のアクセシビリティ
      const modal = getByTestId("goal-detail-modal");
      expect(modal.props.accessibilityRole).toBe("dialog");
      expect(modal.props.accessibilityLabel).toBe("ゴール詳細");

      // 各ボタンのアクセシビリティラベル
      const editButton = getByTestId("edit-goal-button");
      expect(editButton.props.accessibilityLabel).toBe("ゴールを編集");

      const deleteButton = getByTestId("delete-goal-button");
      expect(deleteButton.props.accessibilityLabel).toBe("ゴールを削除");

      const completeButton = getByTestId("complete-goal-button");
      expect(completeButton.props.accessibilityLabel).toBe("ゴールを達成");

      const closeButton = getByTestId("close-modal-button");
      expect(closeButton.props.accessibilityLabel).toBe("モーダルを閉じる");
    });
  });

  test("ゴールデータが見つからない場合のエラー表示", async () => {
    const { getByText } = render(<GoalDetail goal={null} />);

    // エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(getByText("ゴールが見つかりません")).toBeTruthy();
    });
  });

  test("ローディング中の表示", async () => {
    const { getByTestId } = render(<GoalDetail goal={mockGoalData} isLoading={true} />);

    // ローディングインジケーターが表示されることを確認
    await waitFor(() => {
      expect(getByTestId("loading-indicator")).toBeTruthy();
    });
  });

  test("モーダルオーバーレイのスタイルが適切に適用されること", async () => {
    const { getByTestId } = render(<GoalDetail goal={mockGoalData} />);

    await waitFor(() => {
      const modalOverlay = getByTestId("modal-overlay");
      expect(modalOverlay).toHaveStyle({
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      });
    });
  });

  test("Flow Finderブランドカラーが正確に適用されていること", async () => {
    const { getByTestId } = render(<GoalDetail goal={mockGoalData} />);

    await waitFor(() => {
      // primary色: #FFC400
      const editButton = getByTestId("edit-goal-button");
      expect(editButton).toHaveStyle({ backgroundColor: "#FFC400" });

      // success色: #4CAF50
      const completeButton = getByTestId("complete-goal-button");
      expect(completeButton).toHaveStyle({ backgroundColor: "#4CAF50" });

      // danger色: #f87171 (削除ボタン)
      const deleteButton = getByTestId("delete-goal-button");
      expect(deleteButton).toHaveStyle({ backgroundColor: "#f87171" });

      // secondary色: #212121 (テキスト)
      const titleText = getByTestId("goal-title-text");
      expect(titleText).toHaveStyle({ color: "#212121" });
    });
  });
});