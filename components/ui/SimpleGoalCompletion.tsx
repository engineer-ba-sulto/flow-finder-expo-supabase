import React, { useCallback } from 'react';
import { Pressable, Text, View, ViewStyle } from 'react-native';

/**
 * 簡易ゴール完了機能コンポーネント
 * MVP1段目: 基本的な完了状態切り替え機能を提供
 * MVP2段目でアクション機能を追加予定
 */

interface SimpleGoalCompletionProps {
  /** ゴールのユニークID */
  goalId: string;
  /** ゴールの完了状態 */
  isCompleted: boolean;
  /** 完了状態切り替えハンドラー */
  onToggle: (goalId: string) => void;
  /** 追加のスタイル（任意） */
  style?: ViewStyle;
}

/**
 * SimpleGoalCompletionコンポーネント
 * 
 * @param props - コンポーネントのプロパティ
 * @returns 簡易ゴール完了機能のJSX要素
 */
export const SimpleGoalCompletion: React.FC<SimpleGoalCompletionProps> = React.memo(({
  goalId,
  isCompleted,
  onToggle,
  style,
}) => {
  // パフォーマンス最適化: useCallbackでハンドラーをメモ化
  const handlePress = useCallback(() => {
    onToggle(goalId);
  }, [goalId, onToggle]);

  // Flow Finderブランドカラーを使用した動的スタイル
  const buttonBackgroundClass = isCompleted 
    ? 'bg-gray-400' // 完了済み: グレー
    : 'bg-[#4CAF50]'; // 未完了: Success色（緑）

  const buttonTextClass = isCompleted
    ? 'text-white' // 完了済み: 白文字
    : 'text-white'; // 未完了: 白文字（緑背景に対して）

  // より詳細なアクセシビリティ情報
  const accessibilityLabel = `ゴール完了マーク。現在の状態: ${isCompleted ? '完了済み' : '未完了'}`;
  const accessibilityHint = isCompleted 
    ? 'タップしてゴールを未完了状態に戻します'
    : 'タップしてゴールを完了状態にマークします';

  return (
    <View className="mb-6" style={style}>
      {/* セクションタイトル */}
      <Text className="text-sm font-semibold text-[#212121] mb-2">
        ✅ ゴール管理
      </Text>
      
      {/* 完了切り替えボタン */}
      <Pressable
        testID="goal-completion-button"
        className={`w-full ${buttonBackgroundClass} py-3 px-4 rounded-xl mb-2 shadow-sm`}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ selected: isCompleted }}
        onPress={handlePress}
        // ボタンのフィードバック効果を向上
        android_ripple={{ 
          color: isCompleted ? '#ffffff40' : '#21212140',
          borderless: false 
        }}
      >
        <Text className={`${buttonTextClass} font-semibold text-sm text-center`}>
          {isCompleted ? '✓ 完了済み' : 'ゴール完了マーク'}
        </Text>
      </Pressable>
      
      {/* MVP2段目予告メッセージ */}
      <Text className="text-xs text-gray-600 text-center leading-4">
        ※ MVP2段目でアクション機能追加予定
      </Text>
    </View>
  );
});

// デバッグ用のdisplayName設定
SimpleGoalCompletion.displayName = 'SimpleGoalCompletion';