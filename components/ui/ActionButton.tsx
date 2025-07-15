import React from "react";
import { Pressable, PressableProps, Text } from "react-native";

/**
 * Flow Finderブランドカラー定数
 */
export const BRAND_COLORS = {
  /** プライマリーカラー（黄色） */
  PRIMARY: "#FFC400",
  /** セカンダリーカラー（ダークグレー） */
  SECONDARY: "#212121",
  /** サクセスカラー（緑） */
  SUCCESS: "#4CAF50",
  /** ホワイト */
  WHITE: "#FFFFFF",
} as const;

/**
 * ボタンの色テーマ型定義
 */
export type ButtonTheme = "primary" | "success" | "secondary";

/**
 * アクションボタンコンポーネントのProps型定義
 */
export interface ActionButtonProps extends Omit<PressableProps, "style"> {
  /** ボタンのテキスト */
  title: string;
  /** ボタンの色テーマ */
  theme: ButtonTheme;
  /** テストID（テスト時の識別用） */
  testID?: string;
  /** ボタンが無効かどうか */
  disabled?: boolean;
  /** フルワイズ表示かどうか（デフォルト: false） */
  fullWidth?: boolean;
}

/**
 * Flow Finderブランドに対応したアクションボタンコンポーネント
 *
 * @fileoverview 統一されたブランドカラーとスタイルを適用した
 * 再利用可能なボタンコンポーネント
 *
 * @param props - ActionButtonProps
 * @returns アクションボタンUI
 *
 * @example
 * ```tsx
 * <ActionButton
 *   title="成果をシェア"
 *   theme="primary"
 *   onPress={handleShareAchievement}
 *   testID="share-achievement-button"
 *   fullWidth
 * />
 * ```
 */
export default function ActionButton({
  title,
  theme,
  testID,
  disabled = false,
  fullWidth = false,
  ...pressableProps
}: ActionButtonProps) {
  /**
   * テーマに基づいて背景色を取得する
   *
   * @param theme - ボタンテーマ
   * @returns 背景色
   */
  const getBackgroundColor = (theme: ButtonTheme): string => {
    switch (theme) {
      case "primary":
        return BRAND_COLORS.PRIMARY;
      case "success":
        return BRAND_COLORS.SUCCESS;
      case "secondary":
        return BRAND_COLORS.SECONDARY;
      default:
        return BRAND_COLORS.PRIMARY;
    }
  };

  /**
   * テーマに基づいてテキスト色を取得する
   *
   * @param theme - ボタンテーマ
   * @returns テキスト色
   */
  const getTextColor = (theme: ButtonTheme): string => {
    switch (theme) {
      case "primary":
        return BRAND_COLORS.SECONDARY; // 黄色背景には黒文字
      case "success":
        return BRAND_COLORS.WHITE; // 緑背景には白文字
      case "secondary":
        return BRAND_COLORS.WHITE; // グレー背景には白文字
      default:
        return BRAND_COLORS.SECONDARY;
    }
  };

  const backgroundColor = getBackgroundColor(theme);
  const textColor = getTextColor(theme);

  return (
    <Pressable
      {...pressableProps}
      testID={testID}
      disabled={disabled}
      className={`py-3 px-4 rounded-xl ${fullWidth ? "flex-1" : ""} ${
        disabled ? "opacity-50" : ""
      }`}
      style={{ backgroundColor }}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
    >
      <Text
        className="font-semibold text-sm text-center"
        style={{ color: textColor }}
        testID={`${testID}-text`}
      >
        {title}
      </Text>
    </Pressable>
  );
}
