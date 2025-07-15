import React from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { Goal } from "../../types/goal.types";
import { useGoalCompletion } from "../../hooks/useGoalCompletion";
import StarRating from "../../components/ui/StarRating";
import ActionButton, { BRAND_COLORS } from "../../components/ui/ActionButton";

/**
 * ゴール完了モーダルコンポーネントのProps型定義
 */
interface GoalCompletionProps {
  /** 完了したゴールのデータ */
  goal: Goal;
}

/**
 * ゴール完了モーダルコンポーネント
 * 
 * @fileoverview ゴール達成時に表示されるお祝いモーダル。
 * 達成情報の表示、振り返り入力、次のアクション選択を提供する。
 * Flow Finderブランドカラーとアクセシビリティに対応。
 * 
 * @param props - GoalCompletionProps
 * @returns ゴール完了モーダルUI
 */
export default function GoalCompletion({ goal }: GoalCompletionProps) {
  const {
    reflection,
    setReflection,
    duration,
    startDate,
    completionDate,
    handleShareAchievement,
    handleNextGoal,
    handleLater,
  } = useGoalCompletion(goal);

  return (
    <View className="flex-1 bg-white">
      {/* ヘッダー */}
      <View 
        className="p-4"
        style={{ backgroundColor: BRAND_COLORS.SUCCESS }}
        testID="goal-completion-header"
      >
        <Text className="text-xl font-bold text-white">🎉 ゴール達成！</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          {/* 達成情報 */}
          <View className="items-center mb-4">
            <Text className="text-4xl mb-2">🏆</Text>
            <Text 
              className="text-lg font-bold mb-2"
              style={{ color: BRAND_COLORS.SUCCESS }}
            >
              「{goal.title}」達成！
            </Text>
            <Text className="text-xs text-gray-600 mb-2">
              開始日: {startDate} 達成日: {completionDate}
            </Text>
            <Text className="text-xs text-gray-600 mb-2">
              期間: {duration}日間 解決ボトルネック: 5個
            </Text>
          </View>

          {/* 振り返り */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-1" style={{ color: BRAND_COLORS.SECONDARY }}>
              振り返り（任意）
            </Text>
            <TextInput
              value={reflection}
              onChangeText={setReflection}
              placeholder="このゴールで学んだことや次に活かせる経験を記録..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="border border-gray-300 rounded-lg p-3 text-sm h-16"
              accessibilityLabel="振り返り"
              accessibilityHint="ゴール達成の振り返りを入力してください"
            />
          </View>

          {/* 評価 */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-1" style={{ color: BRAND_COLORS.SECONDARY }}>
              評価
            </Text>
            <View className="flex-row items-center gap-4">
              <StarRating
                label="難しさ:"
                rating={5}
                testID="difficulty-stars"
                accessibilityLabel="難しさ評価: 5段階中5"
              />
              <StarRating
                label="満足度:"
                rating={5}
                testID="satisfaction-stars"
                accessibilityLabel="満足度評価: 5段階中5"
              />
            </View>
          </View>

          {/* アクションボタン */}
          <View className="flex-row gap-3 mt-6">
            <ActionButton
              title="成果をシェア"
              theme="primary"
              onPress={handleShareAchievement}
              testID="share-achievement-button"
              fullWidth
            />
            <ActionButton
              title="次のゴールを設定"
              theme="success"
              onPress={handleNextGoal}
              testID="next-goal-button"
              fullWidth
            />
          </View>

          <View className="items-center mt-4">
            <Pressable 
              onPress={handleLater}
              accessibilityRole="button"
              accessibilityLabel="後で設定"
            >
              <Text className="underline text-xs" style={{ color: BRAND_COLORS.SECONDARY }}>
                後で設定
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}