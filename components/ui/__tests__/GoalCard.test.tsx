import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import GoalCard from "../GoalCard";
import { Goal, GoalPriority, GoalStatus } from "../../../types/goal.types";

// expo-routerのモック
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  router: {
    push: mockPush,
  },
}));

// Supabaseクライアントのモック
jest.mock("../../../lib/supabase", () => ({
  getSupabaseClient: jest.fn(() => ({
    from: jest.fn(() => ({
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() =>
              Promise.resolve({
                data: { id: "mock-goal-id", status: "completed" },
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

const mockCompletedGoal: Goal = {
  ...mockGoalData,
  id: "completed-goal-id",
  title: "資格試験合格",
  status: GoalStatus.COMPLETED,
};

// GoalCardコンポーネントのテスト（Red Phase）
describe("<GoalCard />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("アクティブなゴールの基本情報が表示されること", async () => {
    const { getByText } = render(<GoalCard goal={mockGoalData} />);

    // ゴールタイトルと説明が表示されることを確認
    await waitFor(() => {
      expect(getByText("💼 英語学習マスター")).toBeTruthy();
      expect(getByText("TOEIC900点を目指して学習を継続する")).toBeTruthy();
    });
  });

  test("優先度が正しく表示されること", async () => {
    const { getByText } = render(<GoalCard goal={mockGoalData} />);

    // 高優先度が表示されることを確認
    await waitFor(() => {
      expect(getByText("優先度: 高")).toBeTruthy();
    });
  });

  test("中優先度のゴールが正しく表示されること", async () => {
    const mediumPriorityGoal = { ...mockGoalData, priority: GoalPriority.MEDIUM };
    const { getByText } = render(<GoalCard goal={mediumPriorityGoal} />);

    await waitFor(() => {
      expect(getByText("優先度: 中")).toBeTruthy();
    });
  });

  test("低優先度のゴールが正しく表示されること", async () => {
    const lowPriorityGoal = { ...mockGoalData, priority: GoalPriority.LOW };
    const { getByText } = render(<GoalCard goal={lowPriorityGoal} />);

    await waitFor(() => {
      expect(getByText("優先度: 低")).toBeTruthy();
    });
  });

  test("Flow Finderブランドカラーが正確に適用されること", async () => {
    const { getByTestId } = render(<GoalCard goal={mockGoalData} />);

    await waitFor(() => {
      // ゴールカードの背景色が適用されていることを確認
      const goalCard = getByTestId("goal-card");
      expect(goalCard).toHaveStyle({ backgroundColor: "#f9fafb" }); // bg-gray-50

      // 達成ボタンのsuccess色（#4CAF50）が適用されていることを確認
      const completeButton = getByTestId("complete-goal-button");
      expect(completeButton).toHaveStyle({ backgroundColor: "#4CAF50" });
    });
  });

  test("達成ボタンが表示されること", async () => {
    const { getByText } = render(<GoalCard goal={mockGoalData} />);

    await waitFor(() => {
      expect(getByText("達成")).toBeTruthy();
    });
  });

  test("編集ボタンが表示されること", async () => {
    const { getByTestId } = render(<GoalCard goal={mockGoalData} />);

    await waitFor(() => {
      expect(getByTestId("edit-goal-button")).toBeTruthy();
    });
  });

  test("削除ボタンが表示されること", async () => {
    const { getByTestId } = render(<GoalCard goal={mockGoalData} />);

    await waitFor(() => {
      expect(getByTestId("delete-goal-button")).toBeTruthy();
    });
  });

  test("達成ボタンをタップするとゴール完了処理が実行されること", async () => {
    const mockOnComplete = jest.fn();
    const { getByTestId } = render(
      <GoalCard goal={mockGoalData} onComplete={mockOnComplete} />
    );

    await waitFor(() => {
      expect(getByTestId("complete-goal-button")).toBeTruthy();
    });

    // 達成ボタンをタップ
    const completeButton = getByTestId("complete-goal-button");
    fireEvent.press(completeButton);

    // 完了処理が呼び出されることを確認
    expect(mockOnComplete).toHaveBeenCalledWith(mockGoalData.id);
  });

  test("編集ボタンをタップするとゴール編集画面に遷移すること", async () => {
    const { getByTestId } = render(<GoalCard goal={mockGoalData} />);

    await waitFor(() => {
      expect(getByTestId("edit-goal-button")).toBeTruthy();
    });

    // 編集ボタンをタップ
    const editButton = getByTestId("edit-goal-button");
    fireEvent.press(editButton);

    // ゴール編集画面への遷移を確認
    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/modal/edit-goal",
      params: { id: mockGoalData.id },
    });
  });

  test("削除ボタンをタップすると削除処理が実行されること", async () => {
    const mockOnDelete = jest.fn();
    const { getByTestId } = render(
      <GoalCard goal={mockGoalData} onDelete={mockOnDelete} />
    );

    await waitFor(() => {
      expect(getByTestId("delete-goal-button")).toBeTruthy();
    });

    // 削除ボタンをタップ
    const deleteButton = getByTestId("delete-goal-button");
    fireEvent.press(deleteButton);

    // 削除処理が呼び出されることを確認
    expect(mockOnDelete).toHaveBeenCalledWith(mockGoalData.id);
  });

  test("完了済みゴールが正しく表示されること", async () => {
    const { getByText, getByTestId } = render(<GoalCard goal={mockCompletedGoal} />);

    await waitFor(() => {
      // 完了済みゴールのタイトルとスタイルを確認
      expect(getByText("✅ 資格試験合格")).toBeTruthy();
      
      // 完了済みゴールの背景色を確認
      const goalCard = getByTestId("goal-card");
      expect(goalCard).toHaveStyle({ backgroundColor: "#f0fdf4" }); // bg-success/10

      // 完了アイコンが表示されることを確認
      expect(getByText("🏆")).toBeTruthy();
    });
  });

  test("完了済みゴールには達成ボタンが表示されないこと", async () => {
    const { queryByTestId } = render(<GoalCard goal={mockCompletedGoal} />);

    await waitFor(() => {
      // 達成ボタンが存在しないことを確認
      expect(queryByTestId("complete-goal-button")).toBeFalsy();
    });
  });

  test("作成日が表示されること", async () => {
    const { getByText } = render(<GoalCard goal={mockGoalData} />);

    await waitFor(() => {
      // 作成日の表示を確認（日本語形式）
      expect(getByText(/2024\/1\/1/)).toBeTruthy();
    });
  });

  test("アクセシビリティラベルが適切に設定されていること", async () => {
    const { getByTestId } = render(<GoalCard goal={mockGoalData} />);

    await waitFor(() => {
      // ゴールカードのアクセシビリティ
      const goalCard = getByTestId("goal-card");
      expect(goalCard.props.accessibilityRole).toBe("button");
      expect(goalCard.props.accessibilityLabel).toContain("英語学習マスター");

      // 達成ボタンのアクセシビリティ
      const completeButton = getByTestId("complete-goal-button");
      expect(completeButton.props.accessibilityRole).toBe("button");
      expect(completeButton.props.accessibilityLabel).toBe("ゴールを達成済みにする");

      // 編集ボタンのアクセシビリティ
      const editButton = getByTestId("edit-goal-button");
      expect(editButton.props.accessibilityRole).toBe("button");
      expect(editButton.props.accessibilityLabel).toBe("ゴールを編集する");

      // 削除ボタンのアクセシビリティ
      const deleteButton = getByTestId("delete-goal-button");
      expect(deleteButton.props.accessibilityRole).toBe("button");
      expect(deleteButton.props.accessibilityLabel).toBe("ゴールを削除する");
    });
  });

  test("優先度による視覚的な表示変化があること", async () => {
    const highPriorityGoal = { ...mockGoalData, priority: GoalPriority.HIGH };
    const { getByTestId, rerender } = render(<GoalCard goal={highPriorityGoal} />);

    await waitFor(() => {
      // 高優先度の場合の特別なスタイル
      const priorityIndicator = getByTestId("priority-indicator");
      expect(priorityIndicator).toHaveStyle({ color: "#ef4444" }); // text-red-500
    });

    // 中優先度でテスト
    const mediumPriorityGoal = { ...mockGoalData, priority: GoalPriority.MEDIUM };
    rerender(<GoalCard goal={mediumPriorityGoal} />);

    await waitFor(() => {
      const priorityIndicator = getByTestId("priority-indicator");
      expect(priorityIndicator).toHaveStyle({ color: "#f59e0b" }); // text-amber-500
    });

    // 低優先度でテスト
    const lowPriorityGoal = { ...mockGoalData, priority: GoalPriority.LOW };
    rerender(<GoalCard goal={lowPriorityGoal} />);

    await waitFor(() => {
      const priorityIndicator = getByTestId("priority-indicator");
      expect(priorityIndicator).toHaveStyle({ color: "#6b7280" }); // text-gray-500
    });
  });

  test("ゴールカードをタップすると詳細画面に遷移すること", async () => {
    const { getByTestId } = render(<GoalCard goal={mockGoalData} />);

    await waitFor(() => {
      expect(getByTestId("goal-card")).toBeTruthy();
    });

    // ゴールカードをタップ
    const goalCard = getByTestId("goal-card");
    fireEvent.press(goalCard);

    // ゴール詳細画面への遷移を確認
    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/modal/goal-detail",
      params: { id: mockGoalData.id },
    });
  });
});