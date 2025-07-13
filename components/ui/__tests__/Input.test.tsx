import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Input } from "../Input";

describe("Input コンポーネント", () => {
  it("テキスト入力が正しく動作すること", () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input
        placeholder="テスト入力"
        onChangeText={mockOnChangeText}
      />
    );

    const input = getByPlaceholderText("テスト入力");
    fireEvent.changeText(input, "テスト文字列");

    expect(mockOnChangeText).toHaveBeenCalledWith("テスト文字列");
  });

  it("プレースホルダーが正しく表示されること", () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="テストプレースホルダー" />
    );

    expect(getByPlaceholderText("テストプレースホルダー")).toBeTruthy();
  });

  it("Flow Finderブランドカラーのボーダーが適用されること", () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="テストフィールド" />
    );

    const input = getByPlaceholderText("テストフィールド");
    expect(input).toHaveProp(
      "className",
      expect.stringContaining("border-[#FFC400]")
    );
  });

  it("エラー状態では赤色のボーダーが適用されること", () => {
    const { getByPlaceholderText } = render(
      <Input error placeholder="エラーフィールド" />
    );

    const input = getByPlaceholderText("エラーフィールド");
    expect(input).toHaveProp(
      "className",
      expect.stringContaining("border-red-500")
    );
  });

  it("disabled 状態では入力が無効化されること", () => {
    const { getByPlaceholderText } = render(
      <Input disabled placeholder="無効フィールド" />
    );

    const input = getByPlaceholderText("無効フィールド");
    expect(input).toHaveProp("editable", false);
  });

  it("パスワード入力で secureTextEntry が適用されること", () => {
    const { getByPlaceholderText } = render(
      <Input secureTextEntry placeholder="パスワード" />
    );

    const input = getByPlaceholderText("パスワード");
    expect(input).toHaveProp("secureTextEntry", true);
  });

  it("ラベルが正しく表示されること", () => {
    const { getByText } = render(<Input label="テストラベル" />);

    expect(getByText("テストラベル")).toBeTruthy();
  });

  it("エラーメッセージが正しく表示されること", () => {
    const { getByText } = render(
      <Input error errorMessage="エラーメッセージ" />
    );

    expect(getByText("エラーメッセージ")).toBeTruthy();
  });

  it("アクセシビリティ属性が正しく設定されること", () => {
    const { getByLabelText } = render(
      <Input 
        label="テスト入力フィールド" 
        accessibilityLabel="テスト入力フィールド"
      />
    );

    const input = getByLabelText("テスト入力フィールド");
    expect(input).toHaveProp("accessibilityLabel", "テスト入力フィールド");
  });
});
