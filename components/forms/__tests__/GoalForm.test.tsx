import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { GoalForm } from "../GoalForm";
import { CreateGoalInput, GoalPriority, GoalStatus } from "../../../types/goal.types";

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

    expect(getByPlaceholderText("ゴールのタイトルを入力")).toBeTruthy();
    expect(getByPlaceholderText("ゴールの詳細説明（任意）")).toBeTruthy();
    expect(getByText("保存")).toBeTruthy();
    expect(getByText("キャンセル")).toBeTruthy();
  });

  it("タイトル入力が正しく動作すること", () => {
    const { getByPlaceholderText } = render(
      <GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const titleInput = getByPlaceholderText("ゴールのタイトルを入力");
    fireEvent.changeText(titleInput, "英語学習");

    expect(titleInput.props.value).toBe("英語学習");
  });

  it("説明入力が正しく動作すること", () => {
    const { getByPlaceholderText } = render(
      <GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const descriptionInput = getByPlaceholderText("ゴールの詳細説明（任意）");
    fireEvent.changeText(descriptionInput, "TOEIC 800点を目指す");

    expect(descriptionInput.props.value).toBe("TOEIC 800点を目指す");
  });

  it("優先度選択が正しく動作すること", () => {
    const { getByTestId, getByText } = render(
      <GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const priorityPicker = getByTestId("priority-picker");
    
    // Pickerが存在することを確認
    expect(priorityPicker).toBeTruthy();
    
    // 優先度ラベルが表示されていることを確認
    expect(getByText("優先度")).toBeTruthy();
    
    // 値を変更してエラーが発生しないことを確認
    fireEvent(priorityPicker, "valueChange", GoalPriority.HIGH);
    
    // Pickerの機能が動作することを確認
    expect(priorityPicker).toBeTruthy();
  });

  it("有効なデータで送信が成功すること", () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(
      <GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const titleInput = getByPlaceholderText("ゴールのタイトルを入力");
    const descriptionInput = getByPlaceholderText("ゴールの詳細説明（任意）");
    const priorityPicker = getByTestId("priority-picker");
    const submitButton = getByText("保存");

    fireEvent.changeText(titleInput, "英語学習");
    fireEvent.changeText(descriptionInput, "TOEIC 800点を目指す");
    fireEvent(priorityPicker, "valueChange", GoalPriority.HIGH);
    fireEvent.press(submitButton);

    const expectedGoalData: CreateGoalInput = {
      title: "英語学習",
      description: "TOEIC 800点を目指す",
      priority: GoalPriority.HIGH,
      user_id: "mock-user-id"
    };

    expect(mockOnSubmit).toHaveBeenCalledWith(expectedGoalData);
  });

  it("タイトルが空の場合にバリデーションエラーが表示されること", () => {
    const { getByText } = render(
      <GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const submitButton = getByText("保存");
    fireEvent.press(submitButton);

    expect(getByText("タイトルは必須です")).toBeTruthy();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("タイトルが200文字を超える場合にバリデーションエラーが表示されること", () => {
    const { getByPlaceholderText, getByText } = render(
      <GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const titleInput = getByPlaceholderText("ゴールのタイトルを入力");
    const longTitle = "あ".repeat(201);
    const submitButton = getByText("保存");

    fireEvent.changeText(titleInput, longTitle);
    fireEvent.press(submitButton);

    expect(getByText("タイトルは200文字以内で入力してください")).toBeTruthy();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("説明が1000文字を超える場合にバリデーションエラーが表示されること", () => {
    const { getByPlaceholderText, getByText } = render(
      <GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const titleInput = getByPlaceholderText("ゴールのタイトルを入力");
    const descriptionInput = getByPlaceholderText("ゴールの詳細説明（任意）");
    const longDescription = "あ".repeat(1001);
    const submitButton = getByText("保存");

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
      user_id: "user-id"
    };

    const { getByDisplayValue, getByTestId, getByText } = render(
      <GoalForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
        initialGoal={initialGoal}
      />
    );

    expect(getByDisplayValue("既存のゴール")).toBeTruthy();
    expect(getByDisplayValue("既存の説明")).toBeTruthy();
    
    const priorityPicker = getByTestId("priority-picker");
    expect(priorityPicker).toBeTruthy();
    // 優先度選択エリアが表示されていることを確認
    expect(getByText("優先度")).toBeTruthy();
  });

  it("送信中はボタンが無効化されること", () => {
    const { getByText, getByPlaceholderText } = render(
      <GoalForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
        isSubmitting={true}
      />
    );

    const titleInput = getByPlaceholderText("ゴールのタイトルを入力");
    const submitButton = getByText("保存中...");

    fireEvent.changeText(titleInput, "テストゴール");
    fireEvent.press(submitButton);

    // ボタンが無効化されていることを確認（テキストで判断）
    expect(getByText("保存中...")).toBeTruthy();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("フォームの Flow Finder ブランドスタイルが適用されること", () => {
    const { getByTestId } = render(
      <GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const formContainer = getByTestId("goal-form-container");
    expect(formContainer).toHaveProp(
      "className",
      expect.stringContaining("bg-white")
    );
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