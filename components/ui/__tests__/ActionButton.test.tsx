import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ActionButton, { BRAND_COLORS } from "../ActionButton";

describe("<ActionButton />", () => {
  test("primaryテーマのボタンが正しく表示されること", () => {
    const { getByText, getByTestId } = render(
      <ActionButton
        title="成果をシェア"
        theme="primary"
        testID="primary-button"
      />
    );

    expect(getByText("成果をシェア")).toBeTruthy();
    
    const button = getByTestId("primary-button");
    expect(button).toHaveStyle({ backgroundColor: BRAND_COLORS.PRIMARY });
    
    const text = getByTestId("primary-button-text");
    expect(text).toHaveStyle({ color: BRAND_COLORS.SECONDARY });
  });

  test("successテーマのボタンが正しく表示されること", () => {
    const { getByText, getByTestId } = render(
      <ActionButton
        title="次のゴールを設定"
        theme="success"
        testID="success-button"
      />
    );

    expect(getByText("次のゴールを設定")).toBeTruthy();
    
    const button = getByTestId("success-button");
    expect(button).toHaveStyle({ backgroundColor: BRAND_COLORS.SUCCESS });
    
    const text = getByTestId("success-button-text");
    expect(text).toHaveStyle({ color: BRAND_COLORS.WHITE });
  });

  test("secondaryテーマのボタンが正しく表示されること", () => {
    const { getByText, getByTestId } = render(
      <ActionButton
        title="キャンセル"
        theme="secondary"
        testID="secondary-button"
      />
    );

    expect(getByText("キャンセル")).toBeTruthy();
    
    const button = getByTestId("secondary-button");
    expect(button).toHaveStyle({ backgroundColor: BRAND_COLORS.SECONDARY });
    
    const text = getByTestId("secondary-button-text");
    expect(text).toHaveStyle({ color: BRAND_COLORS.WHITE });
  });

  test("onPressイベントが正しく呼び出されること", () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <ActionButton
        title="テストボタン"
        theme="primary"
        onPress={mockOnPress}
        testID="test-button"
      />
    );

    const button = getByTestId("test-button");
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  test("disabledが正しく動作すること", () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <ActionButton
        title="無効ボタン"
        theme="primary"
        disabled={true}
        onPress={mockOnPress}
        testID="disabled-button"
      />
    );

    const button = getByTestId("disabled-button");
    
    // disabledボタンは押せないため、onPressは呼ばれない
    fireEvent.press(button);
    expect(mockOnPress).not.toHaveBeenCalled();
    
    // アクセシビリティ状態が正しく設定されている
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  test("fullWidthが正しく適用されること", () => {
    const { getByTestId } = render(
      <ActionButton
        title="フルワイドボタン"
        theme="primary"
        fullWidth={true}
        testID="fullwidth-button"
      />
    );

    const button = getByTestId("fullwidth-button");
    // flex-1クラスが適用されていることを確認
    expect(button.props.className).toContain("flex-1");
  });

  test("fullWidth={false}の場合flex-1が適用されないこと", () => {
    const { getByTestId } = render(
      <ActionButton
        title="通常ボタン"
        theme="primary"
        fullWidth={false}
        testID="normal-button"
      />
    );

    const button = getByTestId("normal-button");
    // flex-1クラスが適用されていないことを確認
    expect(button.props.className).not.toContain("flex-1");
  });

  test("アクセシビリティ属性が正しく設定されること", () => {
    const { getByTestId } = render(
      <ActionButton
        title="アクセシビリティテスト"
        theme="primary"
        testID="accessibility-button"
      />
    );

    const button = getByTestId("accessibility-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("アクセシビリティテスト");
    expect(button.props.accessibilityState.disabled).toBe(false);
  });

  test("BRAND_COLORSが正しく定義されていること", () => {
    expect(BRAND_COLORS.PRIMARY).toBe("#FFC400");
    expect(BRAND_COLORS.SECONDARY).toBe("#212121");
    expect(BRAND_COLORS.SUCCESS).toBe("#4CAF50");
    expect(BRAND_COLORS.WHITE).toBe("#FFFFFF");
  });

  test("不明なテーマの場合はprimaryが適用されること", () => {
    const { getByTestId } = render(
      <ActionButton
        title="不明テーマ"
        // @ts-ignore - テスト用途で意図的に不正な値を渡す
        theme="unknown"
        testID="unknown-theme-button"
      />
    );

    const button = getByTestId("unknown-theme-button");
    expect(button).toHaveStyle({ backgroundColor: BRAND_COLORS.PRIMARY });
    
    const text = getByTestId("unknown-theme-button-text");
    expect(text).toHaveStyle({ color: BRAND_COLORS.SECONDARY });
  });
});