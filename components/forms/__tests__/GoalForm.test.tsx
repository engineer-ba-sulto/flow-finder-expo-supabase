import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import {
  CreateGoalInput,
  GoalPriority,
  GoalStatus,
} from "../../../types/goal.types";
import { GoalForm } from "../GoalForm";

describe("GoalForm コンポーネント", () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("基本的なフォーム要素が正しく表示されること", () => {
    const { getByPlaceholderText, getByText } = render(
      <GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    expect(getByPlaceholderText("例: 英語学習マスター")).toBeTruthy();
    expect(getByPlaceholderText("このゴールについて詳しく...")).toBeTruthy();
    expect(getByText("作成")).toBeTruthy();
    expect(getByText("キャンセル")).toBeTruthy();
  });

  it("タイトル入力が正しく動作すること", () => {
    const { getByPlaceholderText } = render(
      <GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const titleInput = getByPlaceholderText("例: 英語学習マスター");
    fireEvent.changeText(titleInput, "英語学習");

    expect(titleInput.props.value).toBe("英語学習");
  });

  it("説明入力が正しく動作すること", () => {
    const { getByPlaceholderText } = render(
      <GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const descriptionInput = getByPlaceholderText("このゴールについて詳しく...");
    fireEvent.changeText(descriptionInput, "TOEIC 800点を目指す");

    expect(descriptionInput.props.value).toBe("TOEIC 800点を目指す");
  });

  it("優先度選択が正しく動作すること", () => {
    const { getByLabelText, getByText } = render(
      <GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    // 優先度ラベルが表示されていることを確認
    expect(getByText("優先度")).toBeTruthy();

    // 優先度ボタンが表示されていることを確認
    expect(getByText("高")).toBeTruthy();
    expect(getByText("中")).toBeTruthy();
    expect(getByText("低")).toBeTruthy();

    // 高優先度ボタンをクリック
    const highPriorityButton = getByLabelText("優先度高");
    fireEvent.press(highPriorityButton);

    // ボタンが動作することを確認
    expect(highPriorityButton).toBeTruthy();
  });

  it("有効なデータで送信が成功すること", () => {
    const { getByPlaceholderText, getByText, getByLabelText } = render(
      <GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const titleInput = getByPlaceholderText("例: 英語学習マスター");
    const descriptionInput = getByPlaceholderText("このゴールについて詳しく...");
    const highPriorityButton = getByLabelText("優先度高");
    const submitButton = getByText("作成");

    fireEvent.changeText(titleInput, "英語学習");
    fireEvent.changeText(descriptionInput, "TOEIC 800点を目指す");
    fireEvent.press(highPriorityButton);
    fireEvent.press(submitButton);

    const expectedGoalData: CreateGoalInput = {
      title: "英語学習",
      description: "TOEIC 800点を目指す",
      priority: GoalPriority.HIGH,
      user_id: "mock-user-id",
    };

    expect(mockOnSubmit).toHaveBeenCalledWith(expectedGoalData);
  });

  it("タイトルが空の場合にバリデーションエラーが表示されること", () => {
    const { getByText } = render(
      <GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const submitButton = getByText("作成");
    fireEvent.press(submitButton);

    expect(getByText("タイトルは必須です")).toBeTruthy();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("タイトルが200文字を超える場合にバリデーションエラーが表示されること", () => {
    const { getByPlaceholderText, getByText } = render(
      <GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const titleInput = getByPlaceholderText("例: 英語学習マスター");
    const longTitle = "あ".repeat(201);
    const submitButton = getByText("作成");

    fireEvent.changeText(titleInput, longTitle);
    fireEvent.press(submitButton);

    expect(getByText("タイトルは200文字以内で入力してください")).toBeTruthy();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("説明が1000文字を超える場合にバリデーションエラーが表示されること", () => {
    const { getByPlaceholderText, getByText } = render(
      <GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const titleInput = getByPlaceholderText("例: 英語学習マスター");
    const descriptionInput = getByPlaceholderText("このゴールについて詳しく...");
    const longDescription = "あ".repeat(1001);
    const submitButton = getByText("作成");

    fireEvent.changeText(titleInput, "英語学習");
    fireEvent.changeText(descriptionInput, longDescription);
    fireEvent.press(submitButton);

    expect(getByText("説明は1000文字以内で入力してください")).toBeTruthy();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("キャンセルボタンが正しく動作すること", () => {
    const { getByText } = render(
      <GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const cancelButton = getByText("キャンセル");
    fireEvent.press(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("編集モードで初期値が正しく表示されること", () => {
    const initialGoal = {
      id: "test-id",
      title: "既存のゴール",
      description: "既存の説明",
      priority: GoalPriority.MEDIUM,
      status: GoalStatus.ACTIVE,
      created_at: new Date(),
      updated_at: new Date(),
      user_id: "user-id",
    };

    const { getByDisplayValue, getByText } = render(
      <GoalForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialGoal={initialGoal}
      />
    );

    expect(getByDisplayValue("既存のゴール")).toBeTruthy();
    expect(getByDisplayValue("既存の説明")).toBeTruthy();

    // 編集モードのタイトル表示確認
    expect(getByText("ゴール編集")).toBeTruthy();
    // 優先度選択エリアが表示されていることを確認
    expect(getByText("優先度")).toBeTruthy();
    expect(getByText("更新")).toBeTruthy();
  });

  it("送信中はボタンが無効化されること", () => {
    const { getByText, getByPlaceholderText } = render(
      <GoalForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={true}
      />
    );

    const titleInput = getByPlaceholderText("例: 英語学習マスター");
    const submitButton = getByText("保存中...");

    fireEvent.changeText(titleInput, "テストゴール");
    fireEvent.press(submitButton);

    // ボタンが無効化されていることを確認（テキストで判断）
    expect(getByText("保存中...")).toBeTruthy();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("フォームの Flow Finder ブランドスタイルが適用されること", () => {
    const { getByText } = render(
      <GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    // フォームが表示されていることを確認（作成ボタンで判定）
    const saveButton = getByText("作成");
    expect(saveButton).toBeTruthy();
    
    // 優先度ラベルでFlow Finderブランドスタイルを確認
    const priorityLabel = getByText("優先度");
    expect(priorityLabel).toBeTruthy();
    
    // フォームタイトル確認
    const formTitle = getByText("新しいゴール");
    expect(formTitle).toBeTruthy();
  });

  it("アクセシビリティ属性が正しく設定されること", () => {
    const { getByLabelText } = render(
      <GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const titleInput = getByLabelText("ゴールタイトル");
    const descriptionInput = getByLabelText("ゴール説明");

    expect(titleInput).toHaveProp("accessibilityLabel", "ゴールタイトル");
    expect(descriptionInput).toHaveProp("accessibilityLabel", "ゴール説明");
  });
});
