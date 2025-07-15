import React from "react";
import { Text, View } from "react-native";

/**
 * 星評価コンポーネントのProps型定義
 */
export interface StarRatingProps {
  /** 評価項目のラベル */
  label: string;
  /** 現在の評価値（1-5） */
  rating: number;
  /** テストID（テスト時の識別用） */
  testID?: string;
  /** アクセシビリティラベル */
  accessibilityLabel?: string;
}

/**
 * 星評価表示コンポーネント
 *
 * @fileoverview ゴール完了時の評価（難しさ・満足度）表示に使用される
 * 再利用可能な星評価コンポーネント
 *
 * @param props - StarRatingProps
 * @returns 星評価UI
 *
 * @example
 * ```tsx
 * <StarRating
 *   label="難しさ:"
 *   rating={4}
 *   testID="difficulty-stars"
 *   accessibilityLabel="難しさ評価: 5段階中4"
 * />
 * ```
 */
export default function StarRating({
  label,
  rating,
  testID,
  accessibilityLabel,
}: StarRatingProps) {
  /**
   * 評価値に基づいて星文字列を生成する
   *
   * @param rating - 評価値（1-5）
   * @returns 星文字列（例: "⭐⭐⭐⭐⭐"）
   */
  const generateStars = (rating: number): string => {
    const maxRating = 5;
    const validRating = Math.max(1, Math.min(maxRating, Math.floor(rating)));
    return "⭐".repeat(validRating);
  };

  const stars = generateStars(rating);

  return (
    <View className="flex-row items-center gap-2">
      <Text className="text-xs">{label}</Text>
      <Text
        testID={testID}
        accessibilityLabel={
          accessibilityLabel || `${label} ${rating}段階中${rating}`
        }
        accessibilityRole="text"
      >
        {stars}
      </Text>
    </View>
  );
}
