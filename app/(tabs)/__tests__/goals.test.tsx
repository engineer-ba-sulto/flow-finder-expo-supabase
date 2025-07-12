import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Goals from "../goals";

// ゴール管理画面のテスト（Red Phase）
describe("<Goals />", () => {
  test("ゴール管理画面のタイトルが表示されること", () => {
    const { getByText } = render(<Goals />);
    
    // ゴール管理画面のタイトルが表示されることを確認
    expect(getByText("ゴール管理")).toBeTruthy();
  });

  test("新規ゴール作成ボタンが表示されること", () => {
    const { getByText } = render(<Goals />);
    
    // 新規ゴール作成ボタンが表示されることを確認
    expect(getByText("新しいゴールを作成")).toBeTruthy();
  });

  test("ゴール一覧が表示されること", () => {
    const { getByTestId } = render(<Goals />);
    
    // ゴール一覧のコンテナが表示されることを確認
    expect(getByTestId("goals-list")).toBeTruthy();
  });

  test("新規ゴール作成ボタンをタップするとゴール作成フォームが表示されること", () => {
    const { getByText, getByTestId } = render(<Goals />);
    
    // 新規ゴール作成ボタンをタップ
    const createButton = getByText("新しいゴールを作成");
    fireEvent.press(createButton);
    
    // ゴール作成フォームが表示されることを確認
    expect(getByTestId("goal-form")).toBeTruthy();
  });

  test("ゴール作成フォームにタイトル入力フィールドが表示されること", () => {
    const { getByText, getByTestId } = render(<Goals />);
    
    // 新規ゴール作成ボタンをタップしてフォームを表示
    const createButton = getByText("新しいゴールを作成");
    fireEvent.press(createButton);
    
    // タイトル入力フィールドが表示されることを確認
    expect(getByTestId("goal-title-input")).toBeTruthy();
  });

  test("ゴール作成フォームに優先度選択フィールドが表示されること", () => {
    const { getByText, getByTestId } = render(<Goals />);
    
    // 新規ゴール作成ボタンをタップしてフォームを表示
    const createButton = getByText("新しいゴールを作成");
    fireEvent.press(createButton);
    
    // 優先度選択フィールドが表示されることを確認
    expect(getByTestId("goal-priority-select")).toBeTruthy();
  });

  test("ゴール作成フォームに保存ボタンが表示されること", () => {
    const { getByText } = render(<Goals />);
    
    // 新規ゴール作成ボタンをタップしてフォームを表示
    const createButton = getByText("新しいゴールを作成");
    fireEvent.press(createButton);
    
    // 保存ボタンが表示されることを確認
    expect(getByText("保存")).toBeTruthy();
  });

  test("ゴール作成フォームにキャンセルボタンが表示されること", () => {
    const { getByText } = render(<Goals />);
    
    // 新規ゴール作成ボタンをタップしてフォームを表示
    const createButton = getByText("新しいゴールを作成");
    fireEvent.press(createButton);
    
    // キャンセルボタンが表示されることを確認
    expect(getByText("キャンセル")).toBeTruthy();
  });

  test("キャンセルボタンをタップするとゴール作成フォームが非表示になること", () => {
    const { getByText, queryByTestId } = render(<Goals />);
    
    // 新規ゴール作成ボタンをタップしてフォームを表示
    const createButton = getByText("新しいゴールを作成");
    fireEvent.press(createButton);
    
    // キャンセルボタンをタップ
    const cancelButton = getByText("キャンセル");
    fireEvent.press(cancelButton);
    
    // ゴール作成フォームが非表示になることを確認
    expect(queryByTestId("goal-form")).toBeNull();
  });

  test("既存のゴールアイテムに編集ボタンが表示されること", async () => {
    const { getByTestId } = render(<Goals />);
    
    // ゴール一覧を取得（モックデータが存在する前提）
    await waitFor(() => {
      const goalItem = getByTestId("goal-item-0");
      expect(goalItem).toBeTruthy();
    });
    
    // 編集ボタンが表示されることを確認
    expect(getByTestId("edit-goal-button-0")).toBeTruthy();
  });

  test("既存のゴールアイテムに削除ボタンが表示されること", async () => {
    const { getByTestId } = render(<Goals />);
    
    // ゴール一覧を取得（モックデータが存在する前提）
    await waitFor(() => {
      const goalItem = getByTestId("goal-item-0");
      expect(goalItem).toBeTruthy();
    });
    
    // 削除ボタンが表示されることを確認
    expect(getByTestId("delete-goal-button-0")).toBeTruthy();
  });

  test("削除ボタンをタップすると確認ダイアログが表示されること", async () => {
    const { getByTestId } = render(<Goals />);
    
    // ゴール一覧を取得（モックデータが存在する前提）
    await waitFor(() => {
      const goalItem = getByTestId("goal-item-0");
      expect(goalItem).toBeTruthy();
    });
    
    // 削除ボタンをタップ
    const deleteButton = getByTestId("delete-goal-button-0");
    fireEvent.press(deleteButton);
    
    // 確認ダイアログが表示されることを確認
    expect(getByTestId("delete-confirmation-dialog")).toBeTruthy();
  });

  test("編集ボタンをタップするとゴール編集フォームが表示されること", async () => {
    const { getByTestId } = render(<Goals />);
    
    // ゴール一覧を取得（モックデータが存在する前提）
    await waitFor(() => {
      const goalItem = getByTestId("goal-item-0");
      expect(goalItem).toBeTruthy();
    });
    
    // 編集ボタンをタップ
    const editButton = getByTestId("edit-goal-button-0");
    fireEvent.press(editButton);
    
    // ゴール編集フォームが表示されることを確認
    expect(getByTestId("goal-edit-form")).toBeTruthy();
  });

  test("ゴールが存在しない場合に空状態メッセージが表示されること", () => {
    const { getByText } = render(<Goals />);
    
    // 空状態メッセージが表示されることを確認
    expect(getByText("まだゴールがありません")).toBeTruthy();
    expect(getByText("最初のゴールを作成してみましょう")).toBeTruthy();
  });
});