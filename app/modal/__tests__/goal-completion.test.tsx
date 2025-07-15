import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import GoalCompletion from "../goal-completion";

// expo-routerのモック
jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
    push: jest.fn(),
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
                  title: "英語学習マスター",
                  status: "completed",
                  completed_at: new Date().toISOString(),
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

const mockGoalData = {
  id: "mock-goal-id", 
  title: "英語学習マスター",
  description: "TOEIC900点を目指す",
  priority: 2,
  status: "active",
  created_at: "2024-01-01T00:00:00.000Z",
  user_id: "mock-user-id",
};

// ゴール完了モーダルのテスト（Red Phase）
describe("<GoalCompletion />", () => {
  test("ゴール達成タイトルが表示されること", async () => {
    const { getByText } = render(<GoalCompletion goal={mockGoalData} />);

    // 🎉 ゴール達成！タイトルが表示されることを確認
    await waitFor(() => {
      expect(getByText("🎉 ゴール達成！")).toBeTruthy();
    });
  });

  test("success色の背景が適用されること", async () => {
    const { getByTestId } = render(<GoalCompletion goal={mockGoalData} />);

    // success色（#4CAF50）の背景が適用されることを確認
    await waitFor(() => {
      const header = getByTestId("goal-completion-header");
      expect(header).toHaveStyle({ backgroundColor: "#4CAF50" });
    });
  });

  test("達成ゴール名とアイコンが表示されること", async () => {
    const { getByText } = render(<GoalCompletion goal={mockGoalData} />);

    // 🏆 達成アイコンと「英語学習マスター」達成！が表示されることを確認
    await waitFor(() => {
      expect(getByText("🏆")).toBeTruthy();
      expect(getByText("「英語学習マスター」達成！")).toBeTruthy();
    });
  });

  test("開始日・達成日・期間が表示されること", async () => {
    const { getByText } = render(<GoalCompletion goal={mockGoalData} />);

    // 開始日・達成日の表示を確認
    await waitFor(() => {
      expect(getByText(/開始日:.*達成日:.*/)).toBeTruthy();
    });
  });

  test("期間と解決ボトルネック数が表示されること", async () => {
    const { getByText } = render(<GoalCompletion goal={mockGoalData} />);

    // 期間とボトルネック数の表示を確認
    await waitFor(() => {
      expect(getByText(/期間:.*日間.*解決ボトルネック:.*個/)).toBeTruthy();
    });
  });

  test("振り返りテキストエリアが表示されること", async () => {
    const { getByPlaceholderText } = render(<GoalCompletion goal={mockGoalData} />);

    // 振り返りテキストエリアが表示されることを確認
    await waitFor(() => {
      expect(getByPlaceholderText("このゴールで学んだことや次に活かせる経験を記録...")).toBeTruthy();
    });
  });

  test("評価（難しさ・満足度）の星評価が表示されること", async () => {
    const { getByText, getByTestId } = render(<GoalCompletion goal={mockGoalData} />);

    // 評価ラベルと星評価が表示されることを確認
    await waitFor(() => {
      expect(getByText("評価")).toBeTruthy();
      expect(getByText("難しさ:")).toBeTruthy();
      expect(getByText("満足度:")).toBeTruthy();
      expect(getByTestId("difficulty-stars")).toBeTruthy();
      expect(getByTestId("satisfaction-stars")).toBeTruthy();
    });
  });

  test("成果をシェアボタンが表示されること", async () => {
    const { getByText } = render(<GoalCompletion goal={mockGoalData} />);

    // 成果をシェアボタンが表示されることを確認
    await waitFor(() => {
      expect(getByText("成果をシェア")).toBeTruthy();
    });
  });

  test("成果をシェアボタンにprimary色（#FFC400）が適用されること", async () => {
    const { getByTestId } = render(<GoalCompletion goal={mockGoalData} />);

    // primary色（#FFC400）の背景が適用されることを確認
    await waitFor(() => {
      const shareButton = getByTestId("share-achievement-button");
      expect(shareButton).toHaveStyle({ backgroundColor: "#FFC400" });
    });
  });

  test("次のゴール設定ボタンが表示されること", async () => {
    const { getByText } = render(<GoalCompletion goal={mockGoalData} />);

    // 次のゴール設定ボタンが表示されることを確認  
    await waitFor(() => {
      expect(getByText("次のゴールを設定")).toBeTruthy();
    });
  });

  test("次のゴール設定ボタンにsuccess色（#4CAF50）が適用されること", async () => {
    const { getByTestId } = render(<GoalCompletion goal={mockGoalData} />);

    // success色（#4CAF50）の背景が適用されることを確認
    await waitFor(() => {
      const nextGoalButton = getByTestId("next-goal-button");
      expect(nextGoalButton).toHaveStyle({ backgroundColor: "#4CAF50" });
    });
  });

  test("後で設定リンクが表示されること", async () => {
    const { getByText } = render(<GoalCompletion goal={mockGoalData} />);

    // 後で設定リンクが表示されることを確認
    await waitFor(() => {
      expect(getByText("後で設定")).toBeTruthy();
    });
  });

  test("成果をシェアボタンをタップすると共有機能が呼び出されること", async () => {
    const { getByTestId } = render(<GoalCompletion goal={mockGoalData} />);

    await waitFor(() => {
      expect(getByTestId("share-achievement-button")).toBeTruthy();
    });

    // 成果をシェアボタンをタップ
    const shareButton = getByTestId("share-achievement-button");
    await act(async () => {
      fireEvent.press(shareButton);
    });

    // 共有機能が呼び出されることを確認（実装後に詳細をテスト）
    // TODO: 共有機能のモックとテストを追加
  });

  test("次のゴールを設定ボタンをタップするとゴール作成画面に遷移すること", async () => {
    const mockRouter = require("expo-router").router;
    const { getByTestId } = render(<GoalCompletion goal={mockGoalData} />);

    await waitFor(() => {
      expect(getByTestId("next-goal-button")).toBeTruthy();
    });

    // 次のゴールを設定ボタンをタップ
    const nextGoalButton = getByTestId("next-goal-button");
    await act(async () => {
      fireEvent.press(nextGoalButton);
    });

    // ゴール作成画面への遷移を確認
    expect(mockRouter.push).toHaveBeenCalledWith("/modal/create-goal");
  });

  test("後で設定リンクをタップするとモーダルが閉じること", async () => {
    const mockRouter = require("expo-router").router;
    const { getByText } = render(<GoalCompletion goal={mockGoalData} />);

    await waitFor(() => {
      expect(getByText("後で設定")).toBeTruthy();
    });

    // 後で設定リンクをタップ
    const laterButton = getByText("後で設定");
    await act(async () => {
      fireEvent.press(laterButton);
    });

    // モーダルが閉じることを確認
    expect(mockRouter.back).toHaveBeenCalled();
  });

  test("振り返りテキストエリアに入力できること", async () => {
    const { getByPlaceholderText } = render(<GoalCompletion goal={mockGoalData} />);

    await waitFor(() => {
      expect(getByPlaceholderText("このゴールで学んだことや次に活かせる経験を記録...")).toBeTruthy();
    });

    // 振り返りテキストエリアに入力
    const reflectionInput = getByPlaceholderText("このゴールで学んだことや次に活かせる経験を記録...");
    await act(async () => {
      fireEvent.changeText(reflectionInput, "英語学習を通じて継続の大切さを学びました");
    });

    // 入力された値が反映されることを確認
    expect(reflectionInput.props.value).toBe("英語学習を通じて継続の大切さを学びました");
  });

  test("アクセシビリティラベルが適切に設定されていること", async () => {
    const { getByTestId } = render(<GoalCompletion goal={mockGoalData} />);

    // 各ボタンのアクセシビリティラベルを確認
    await waitFor(() => {
      const shareButton = getByTestId("share-achievement-button");
      expect(shareButton.props.accessibilityLabel).toBe("成果をシェア");
      expect(shareButton.props.accessibilityRole).toBe("button");

      const nextGoalButton = getByTestId("next-goal-button");
      expect(nextGoalButton.props.accessibilityLabel).toBe("次のゴールを設定");
      expect(nextGoalButton.props.accessibilityRole).toBe("button");
    });
  });

  test("Flow Finderブランドカラーが正確に適用されていること", async () => {
    const { getByTestId } = render(<GoalCompletion goal={mockGoalData} />);

    await waitFor(() => {
      // primary色: #FFC400
      const shareButton = getByTestId("share-achievement-button");
      expect(shareButton).toHaveStyle({ backgroundColor: "#FFC400" });

      // secondary色: #212121 (テキスト)
      const shareButtonText = getByTestId("share-achievement-button-text");
      expect(shareButtonText).toHaveStyle({ color: "#212121" });

      // success色: #4CAF50
      const header = getByTestId("goal-completion-header");
      expect(header).toHaveStyle({ backgroundColor: "#4CAF50" });

      const nextGoalButton = getByTestId("next-goal-button");
      expect(nextGoalButton).toHaveStyle({ backgroundColor: "#4CAF50" });
    });
  });
});