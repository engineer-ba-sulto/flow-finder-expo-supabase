import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import EditGoal from "../edit-goal";
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
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() =>
              Promise.resolve({
                data: {
                  id: "mock-goal-id",
                  title: "更新されたゴール",
                  description: "更新された説明",
                  priority: 2,
                  status: "active",
                  updated_at: new Date().toISOString(),
                  user_id: "mock-user-id",
                },
                error: null,
              })
            ),
          })),
        })),
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

// ゴール編集モーダルのテスト（Red Phase）
describe("<EditGoal />", () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockPush.mockClear();
  });

  test("モーダルが正しく表示されること", async () => {
    const { getByTestId } = render(<EditGoal goal={mockGoalData} />);

    // モーダルコンテナが表示されることを確認
    await waitFor(() => {
      const modal = getByTestId("edit-goal-modal");
      expect(modal).toBeTruthy();
      expect(modal.props.accessibilityRole).toBe("dialog");
    });
  });

  test("既存のゴール情報が初期値として表示されること", async () => {
    const { getByDisplayValue } = render(<EditGoal goal={mockGoalData} />);

    // 既存のゴール情報が初期値として表示されることを確認
    await waitFor(() => {
      expect(getByDisplayValue("英語学習マスター")).toBeTruthy();
      expect(getByDisplayValue("TOEIC900点を目指して学習を継続する")).toBeTruthy();
    });
  });

  test("タイトル入力フィールドが表示され、編集可能であること", async () => {
    const { getByTestId } = render(<EditGoal goal={mockGoalData} />);

    // タイトル入力フィールドが表示され、編集可能であることを確認
    await waitFor(() => {
      const titleInput = getByTestId("goal-title-input");
      expect(titleInput).toBeTruthy();
      expect(titleInput.props.editable).toBe(true);
      expect(titleInput.props.value).toBe("英語学習マスター");
    });
  });

  test("説明入力フィールドが表示され、編集可能であること", async () => {
    const { getByTestId } = render(<EditGoal goal={mockGoalData} />);

    // 説明入力フィールドが表示され、編集可能であることを確認
    await waitFor(() => {
      const descriptionInput = getByTestId("goal-description-input");
      expect(descriptionInput).toBeTruthy();
      expect(descriptionInput.props.editable).toBe(true);
      expect(descriptionInput.props.value).toBe("TOEIC900点を目指して学習を継続する");
    });
  });

  test("優先度セレクターが表示され、現在の優先度が選択されていること", async () => {
    const { getByTestId } = render(<EditGoal goal={mockGoalData} />);

    // 優先度セレクターが表示され、現在の優先度が選択されていることを確認
    await waitFor(() => {
      const priorityHigh = getByTestId("priority-high-button");
      const priorityMedium = getByTestId("priority-medium-button");
      const priorityLow = getByTestId("priority-low-button");

      expect(priorityHigh).toBeTruthy();
      expect(priorityMedium).toBeTruthy();
      expect(priorityLow).toBeTruthy();

      // 高優先度が選択されていることを確認
      expect(priorityHigh.props.accessibilityState.selected).toBe(true);
      expect(priorityMedium.props.accessibilityState.selected).toBe(false);
      expect(priorityLow.props.accessibilityState.selected).toBe(false);
    });
  });

  test("優先度を変更できること", async () => {
    const { getByTestId } = render(<EditGoal goal={mockGoalData} />);

    await waitFor(() => {
      expect(getByTestId("priority-medium-button")).toBeTruthy();
    });

    // 中優先度ボタンをタップ
    const priorityMediumButton = getByTestId("priority-medium-button");
    await act(async () => {
      fireEvent.press(priorityMediumButton);
    });

    // 中優先度が選択されることを確認
    await waitFor(() => {
      expect(priorityMediumButton.props.accessibilityState.selected).toBe(true);
    });
  });

  test("保存ボタンが表示され、タップできること", async () => {
    const { getByTestId } = render(<EditGoal goal={mockGoalData} />);

    // 保存ボタンが表示され、タップできることを確認
    await waitFor(() => {
      const saveButton = getByTestId("save-goal-button");
      expect(saveButton).toBeTruthy();
      expect(saveButton.props.accessibilityRole).toBe("button");
      expect(saveButton.props.accessibilityLabel).toBe("ゴールを保存");
    });
  });

  test("キャンセルボタンが表示され、タップできること", async () => {
    const { getByTestId } = render(<EditGoal goal={mockGoalData} />);

    // キャンセルボタンが表示され、タップできることを確認
    await waitFor(() => {
      const cancelButton = getByTestId("cancel-button");
      expect(cancelButton).toBeTruthy();
      expect(cancelButton.props.accessibilityRole).toBe("button");
      expect(cancelButton.props.accessibilityLabel).toBe("キャンセル");
    });
  });

  test("閉じるボタンが表示され、タップできること", async () => {
    const { getByTestId } = render(<EditGoal goal={mockGoalData} />);

    // 閉じるボタンが表示され、タップできることを確認
    await waitFor(() => {
      const closeButton = getByTestId("close-modal-button");
      expect(closeButton).toBeTruthy();
      expect(closeButton.props.accessibilityRole).toBe("button");
      expect(closeButton.props.accessibilityLabel).toBe("モーダルを閉じる");
    });
  });

  test("タイトル入力フィールドの値を変更できること", async () => {
    const { getByTestId } = render(<EditGoal goal={mockGoalData} />);

    await waitFor(() => {
      expect(getByTestId("goal-title-input")).toBeTruthy();
    });

    // タイトルを変更
    const titleInput = getByTestId("goal-title-input");
    await act(async () => {
      fireEvent.changeText(titleInput, "新しいゴールタイトル");
    });

    // 変更されたタイトルが表示されることを確認
    await waitFor(() => {
      expect(titleInput.props.value).toBe("新しいゴールタイトル");
    });
  });

  test("説明入力フィールドの値を変更できること", async () => {
    const { getByTestId } = render(<EditGoal goal={mockGoalData} />);

    await waitFor(() => {
      expect(getByTestId("goal-description-input")).toBeTruthy();
    });

    // 説明を変更
    const descriptionInput = getByTestId("goal-description-input");
    await act(async () => {
      fireEvent.changeText(descriptionInput, "新しい説明");
    });

    // 変更された説明が表示されることを確認
    await waitFor(() => {
      expect(descriptionInput.props.value).toBe("新しい説明");
    });
  });

  test("バリデーションエラーが表示されること（タイトル必須）", async () => {
    const { getByTestId } = render(<EditGoal goal={mockGoalData} />);

    await waitFor(() => {
      expect(getByTestId("goal-title-input")).toBeTruthy();
      expect(getByTestId("save-goal-button")).toBeTruthy();
    });

    // タイトルを空にして保存ボタンをタップ
    const titleInput = getByTestId("goal-title-input");
    await act(async () => {
      fireEvent.changeText(titleInput, "");
    });

    const saveButton = getByTestId("save-goal-button");
    await act(async () => {
      fireEvent.press(saveButton);
    });

    // バリデーションエラーが表示されることを確認
    await waitFor(() => {
      const errorMessage = getByTestId("title-error-message");
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.props.children).toBe("タイトルは必須です");
    });
  });

  test("保存ボタンをタップするとゴールが更新されること", async () => {
    const { getByTestId } = render(<EditGoal goal={mockGoalData} />);

    await waitFor(() => {
      expect(getByTestId("goal-title-input")).toBeTruthy();
      expect(getByTestId("save-goal-button")).toBeTruthy();
    });

    // タイトルを変更
    const titleInput = getByTestId("goal-title-input");
    await act(async () => {
      fireEvent.changeText(titleInput, "更新されたゴール");
    });

    // 保存ボタンをタップ
    const saveButton = getByTestId("save-goal-button");
    await act(async () => {
      fireEvent.press(saveButton);
    });

    // 成功メッセージが表示されることを確認
    await waitFor(() => {
      const successMessage = getByTestId("success-message");
      expect(successMessage).toBeTruthy();
      expect(successMessage.props.children).toBe("ゴールを更新しました");
    });
  });

  test("キャンセルボタンをタップするとモーダルが閉じること", async () => {
    const { getByTestId } = render(<EditGoal goal={mockGoalData} />);

    await waitFor(() => {
      expect(getByTestId("cancel-button")).toBeTruthy();
    });

    // キャンセルボタンをタップ
    const cancelButton = getByTestId("cancel-button");
    await act(async () => {
      fireEvent.press(cancelButton);
    });

    // モーダルが閉じることを確認
    expect(mockBack).toHaveBeenCalled();
  });

  test("閉じるボタンをタップするとモーダルが閉じること", async () => {
    const { getByTestId } = render(<EditGoal goal={mockGoalData} />);

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

  test("Flow Finderブランドカラーが適用されること", async () => {
    const { getByTestId } = render(<EditGoal goal={mockGoalData} />);

    await waitFor(() => {
      // primary色（#FFC400）のボタンが存在することを確認
      const saveButton = getByTestId("save-goal-button");
      expect(saveButton).toHaveStyle({ backgroundColor: "#FFC400" });

      // secondary色（#212121）のテキストが存在することを確認
      const modalTitle = getByTestId("modal-title");
      expect(modalTitle).toHaveStyle({ color: "#212121" });
    });
  });

  test("アクセシビリティラベルが適切に設定されていること", async () => {
    const { getByTestId } = render(<EditGoal goal={mockGoalData} />);

    await waitFor(() => {
      // モーダル自体のアクセシビリティ
      const modal = getByTestId("edit-goal-modal");
      expect(modal.props.accessibilityRole).toBe("dialog");
      expect(modal.props.accessibilityLabel).toBe("ゴール編集");

      // 各要素のアクセシビリティラベル
      const titleInput = getByTestId("goal-title-input");
      expect(titleInput.props.accessibilityLabel).toBe("ゴールタイトル");

      const descriptionInput = getByTestId("goal-description-input");
      expect(descriptionInput.props.accessibilityLabel).toBe("ゴール説明");

      const saveButton = getByTestId("save-goal-button");
      expect(saveButton.props.accessibilityLabel).toBe("ゴールを保存");

      const cancelButton = getByTestId("cancel-button");
      expect(cancelButton.props.accessibilityLabel).toBe("キャンセル");
    });
  });

  test("ゴールデータが見つからない場合のエラー表示", async () => {
    const { getByText } = render(<EditGoal goal={null} />);

    // エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(getByText("ゴールが見つかりません")).toBeTruthy();
    });
  });

  test("ローディング中の表示", async () => {
    const { getByTestId } = render(<EditGoal goal={mockGoalData} isLoading={true} />);

    // ローディングインジケーターが表示されることを確認
    await waitFor(() => {
      expect(getByTestId("loading-indicator")).toBeTruthy();
    });
  });

  test("モーダルオーバーレイのスタイルが適切に適用されること", async () => {
    const { getByTestId } = render(<EditGoal goal={mockGoalData} />);

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

  test("優先度の表示が正しいこと", async () => {
    // 高優先度
    const { getByTestId: getByTestIdHigh } = render(<EditGoal goal={mockGoalData} />);
    await waitFor(() => {
      const priorityHigh = getByTestIdHigh("priority-high-button");
      expect(priorityHigh.props.accessibilityState.selected).toBe(true);
    });

    // 中優先度
    const mediumGoal = { ...mockGoalData, priority: GoalPriority.MEDIUM };
    const { getByTestId: getByTestIdMedium } = render(<EditGoal goal={mediumGoal} />);
    await waitFor(() => {
      const priorityMedium = getByTestIdMedium("priority-medium-button");
      expect(priorityMedium.props.accessibilityState.selected).toBe(true);
    });

    // 低優先度
    const lowGoal = { ...mockGoalData, priority: GoalPriority.LOW };
    const { getByTestId: getByTestIdLow } = render(<EditGoal goal={lowGoal} />);
    await waitFor(() => {
      const priorityLow = getByTestIdLow("priority-low-button");
      expect(priorityLow.props.accessibilityState.selected).toBe(true);
    });
  });

  test("保存処理中の状態表示", async () => {
    const { getByTestId } = render(<EditGoal goal={mockGoalData} />);

    await waitFor(() => {
      expect(getByTestId("save-goal-button")).toBeTruthy();
    });

    // 保存ボタンをタップ
    const saveButton = getByTestId("save-goal-button");
    await act(async () => {
      fireEvent.press(saveButton);
    });

    // 保存中の状態が表示されることを確認
    await waitFor(() => {
      expect(saveButton.props.accessibilityState.busy).toBe(true);
      expect(saveButton.props.children).toBe("保存中...");
    });
  });
});