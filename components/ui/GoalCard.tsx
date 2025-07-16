import React, { useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Goal, GoalPriority, GoalStatus } from "../../types/goal.types";

interface GoalCardProps {
  goal: Goal;
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = React.memo(({ goal, onComplete, onDelete }) => {
  // 優先度の文字列表示を取得（メモ化）
  const priorityText = useMemo(() => {
    switch (goal.priority) {
      case GoalPriority.HIGH:
        return "高";
      case GoalPriority.MEDIUM:
        return "中";
      case GoalPriority.LOW:
        return "低";
      default:
        return "中";
    }
  }, [goal.priority]);

  // 優先度による色を取得（メモ化）
  const priorityColor = useMemo(() => {
    switch (goal.priority) {
      case GoalPriority.HIGH:
        return "#ef4444"; // text-red-500
      case GoalPriority.MEDIUM:
        return "#f59e0b"; // text-amber-500
      case GoalPriority.LOW:
        return "#6b7280"; // text-gray-500
      default:
        return "#6b7280";
    }
  }, [goal.priority]);

  // ゴールアイコンの取得（メモ化）
  const goalIcon = useMemo(() => {
    if (goal.status === GoalStatus.COMPLETED) {
      return "✅";
    }
    // カテゴリベースのアイコン（シンプルな実装）
    const firstChar = goal.title.charAt(0);
    if (firstChar.match(/[a-zA-Z]/)) {
      return "💼"; // 英語の場合
    }
    return goal.title.includes("健康") || goal.title.includes("運動") 
      ? "🏃" 
      : "💼"; // デフォルト
  }, [goal.status, goal.title]);

  // 作成日のフォーマット（メモ化）
  const formattedDate = useMemo(() => {
    try {
      return new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }).format(new Date(goal.created_at));
    } catch (error) {
      console.warn("Date formatting error:", error);
      return "日付不明";
    }
  }, [goal.created_at]);

  // 背景色の取得（メモ化）
  const backgroundColor = useMemo(() => {
    return goal.status === GoalStatus.COMPLETED ? "#e8f5e8" : "#f9fafb"; // bg-[#4CAF50]/10 or bg-gray-50
  }, [goal.status]);

  // ゴールカードのタップハンドラ（最適化）
  const handleCardPress = useCallback(() => {
    try {
      router.push({
        pathname: "/modal/goal-detail",
        params: { id: goal.id },
      });
    } catch (error) {
      console.warn("Navigation error:", error);
    }
  }, [goal.id]);

  // 編集ボタンのタップハンドラ（最適化）
  const handleEditPress = useCallback(() => {
    try {
      router.push({
        pathname: "/modal/edit-goal",
        params: { id: goal.id },
      });
    } catch (error) {
      console.warn("Navigation error:", error);
    }
  }, [goal.id]);

  // 達成ボタンのタップハンドラ（最適化）
  const handleCompletePress = useCallback(() => {
    if (onComplete) {
      try {
        onComplete(goal.id);
      } catch (error) {
        console.warn("Complete action error:", error);
      }
    }
  }, [goal.id, onComplete]);

  // 削除ボタンのタップハンドラ（最適化）
  const handleDeletePress = useCallback(() => {
    if (onDelete) {
      try {
        onDelete(goal.id);
      } catch (error) {
        console.warn("Delete action error:", error);
      }
    }
  }, [goal.id, onDelete]);

  return (
    <Pressable
      onPress={handleCardPress}
      style={{ backgroundColor }}
      className="rounded-xl p-4 mb-2"
      accessibilityRole="button"
      accessibilityLabel={`ゴール: ${goal.title}`}
      testID="goal-card"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          {/* ゴールタイトル */}
          <Text className="text-sm font-semibold" numberOfLines={1}>
            {goalIcon} {goal.title}
          </Text>
          
          {/* 説明 */}
          {goal.description && (
            <Text className="text-xs text-gray-600 mt-1" numberOfLines={2}>
              {goal.description}
            </Text>
          )}
          
          {/* 優先度表示 */}
          <Text 
            className="text-xs mt-1"
            style={{ color: priorityColor }}
            testID="priority-indicator"
          >
            優先度: {priorityText}
          </Text>
          
          {/* 作成日 */}
          <Text className="text-xs text-gray-500 mt-1">
            {formattedDate}
          </Text>
        </View>

        {/* 右側のボタンエリア */}
        <View className="flex-row gap-2 ml-2">
          {/* 達成ボタン（完了済みでない場合のみ表示） */}
          {goal.status !== GoalStatus.COMPLETED && (
            <Pressable
              onPress={handleCompletePress}
              className="bg-[#4CAF50] py-1 px-3 rounded-lg ml-2"
              accessibilityRole="button"
              accessibilityLabel="ゴールを達成済みにする"
              testID="complete-goal-button"
            >
              <Text className="text-white text-xs font-bold">達成</Text>
            </Pressable>
          )}

          {/* 編集ボタン */}
          <Pressable
            onPress={handleEditPress}
            className="p-1"
            accessibilityRole="button"
            accessibilityLabel="ゴールを編集する"
            testID="edit-goal-button"
          >
            <Text className="text-gray-400">✏️</Text>
          </Pressable>

          {/* 削除ボタン */}
          <Pressable
            onPress={handleDeletePress}
            className="p-1"
            accessibilityRole="button"
            accessibilityLabel="ゴールを削除する"
            testID="delete-goal-button"
          >
            <Text className="text-gray-400">🗑️</Text>
          </Pressable>

          {/* 完了済みの場合のトロフィーアイコン */}
          {goal.status === GoalStatus.COMPLETED && (
            <Text className="text-lg">🏆</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
});

// コンポーネントの表示名を設定（デバッグ用）
GoalCard.displayName = 'GoalCard';

export default GoalCard;