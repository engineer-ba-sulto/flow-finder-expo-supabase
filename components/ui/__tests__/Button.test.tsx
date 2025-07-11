import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Button } from "../Button";

describe("Button コンポーネント", () => {
  it("Flow Finderブランドカラー（#FFC400）が適用されること", () => {
    const { getByRole } = render(
      <Button variant="primary">
        テスト
      </Button>
    );

    const button = getByRole("button");
    expect(button).toHaveProp(
      "className",
      expect.stringContaining("bg-[#FFC400]")
    );
  });

  it("セカンダリボタンはダークカラー（#212121）が適用されること", () => {
    const { getByRole } = render(
      <Button variant="secondary">
        テスト
      </Button>
    );

    const button = getByRole("button");
    expect(button).toHaveProp(
      "className",
      expect.stringContaining("bg-[#212121]")
    );
  });

  it("ボタンテキストが正しく表示されること", () => {
    const { getByText } = render(
      <Button variant="primary">テストボタン</Button>
    );

    expect(getByText("テストボタン")).toBeTruthy();
  });

  it("onPress が正しく実行されること", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button variant="primary" onPress={mockOnPress}>
        クリックボタン
      </Button>
    );

    fireEvent.press(getByText("クリックボタン"));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("disabled 状態では onPress が実行されないこと", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button variant="primary" onPress={mockOnPress} disabled>
        無効ボタン
      </Button>
    );

    fireEvent.press(getByText("無効ボタン"));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it("アクセシビリティ属性が正しく設定されること", () => {
    const { getByRole } = render(
      <Button variant="primary">
        テスト
      </Button>
    );

    const button = getByRole("button");
    expect(button).toHaveProp("accessibilityRole", "button");
  });
});
