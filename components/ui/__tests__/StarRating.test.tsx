import React from "react";
import { render } from "@testing-library/react-native";
import StarRating from "../StarRating";

describe("<StarRating />", () => {
  test("ラベルと星評価が正しく表示されること", () => {
    const { getByText } = render(
      <StarRating label="難しさ:" rating={3} />
    );

    expect(getByText("難しさ:")).toBeTruthy();
    expect(getByText("⭐⭐⭐")).toBeTruthy();
  });

  test("最大評価値（5）が正しく表示されること", () => {
    const { getByText } = render(
      <StarRating label="満足度:" rating={5} />
    );

    expect(getByText("⭐⭐⭐⭐⭐")).toBeTruthy();
  });

  test("最小評価値（1）が正しく表示されること", () => {
    const { getByText } = render(
      <StarRating label="評価:" rating={1} />
    );

    expect(getByText("⭐")).toBeTruthy();
  });

  test("0以下の値が1に補正されること", () => {
    const { getByText } = render(
      <StarRating label="評価:" rating={0} />
    );

    expect(getByText("⭐")).toBeTruthy();
  });

  test("6以上の値が5に補正されること", () => {
    const { getByText } = render(
      <StarRating label="評価:" rating={10} />
    );

    expect(getByText("⭐⭐⭐⭐⭐")).toBeTruthy();
  });

  test("小数点以下が切り捨てられること", () => {
    const { getByText } = render(
      <StarRating label="評価:" rating={3.7} />
    );

    expect(getByText("⭐⭐⭐")).toBeTruthy();
  });

  test("testIDが正しく設定されること", () => {
    const { getByTestId } = render(
      <StarRating 
        label="難しさ:" 
        rating={4} 
        testID="difficulty-stars"
      />
    );

    expect(getByTestId("difficulty-stars")).toBeTruthy();
  });

  test("デフォルトのアクセシビリティラベルが設定されること", () => {
    const { getByTestId } = render(
      <StarRating 
        label="難しさ:" 
        rating={4} 
        testID="difficulty-stars"
      />
    );

    const starElement = getByTestId("difficulty-stars");
    expect(starElement.props.accessibilityLabel).toBe("難しさ: 4段階中4");
    expect(starElement.props.accessibilityRole).toBe("text");
  });

  test("カスタムアクセシビリティラベルが設定されること", () => {
    const customLabel = "難易度評価: 5段階中4";
    const { getByTestId } = render(
      <StarRating 
        label="難しさ:" 
        rating={4} 
        testID="difficulty-stars"
        accessibilityLabel={customLabel}
      />
    );

    const starElement = getByTestId("difficulty-stars");
    expect(starElement.props.accessibilityLabel).toBe(customLabel);
  });

  test("異なる評価値での星表示テスト", () => {
    const ratings = [
      { rating: 1, expected: "⭐" },
      { rating: 2, expected: "⭐⭐" },
      { rating: 3, expected: "⭐⭐⭐" },
      { rating: 4, expected: "⭐⭐⭐⭐" },
      { rating: 5, expected: "⭐⭐⭐⭐⭐" },
    ];

    ratings.forEach(({ rating, expected }) => {
      const { getByText } = render(
        <StarRating label="評価:" rating={rating} />
      );
      expect(getByText(expected)).toBeTruthy();
    });
  });
});