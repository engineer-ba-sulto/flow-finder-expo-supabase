import React from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Goal, GoalPriority, GoalStatus } from "../../types/goal.types";

interface GoalCardProps {
  goal: Goal;
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onComplete, onDelete }) => {
  // 優先度の文字列表示を取得
  const getPriorityText = (priority: GoalPriority): string => {
    switch (priority) {
      case GoalPriority.HIGH:
        return "高";
      case GoalPriority.MEDIUM:
        return "中";
      case GoalPriority.LOW:
        return "低";
      default:
        return "中";
    }
  };

  // 優先度による色を取得
  const getPriorityColor = (priority: GoalPriority): string => {
    switch (priority) {
      case GoalPriority.HIGH:
        return "#ef4444"; // text-red-500
      case GoalPriority.MEDIUM:
        return "#f59e0b"; // text-amber-500
      case GoalPriority.LOW:
        return "#6b7280"; // text-gray-500
      default:
        return "#6b7280";
    }
  };

  // ゴールアイコンの取得
  const getGoalIcon = (): string => {
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
  };

  // 作成日のフォーマット
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).format(new Date(date));
  };

  // 背景色の取得
  const getBackgroundColor = (): string => {
    return goal.status === GoalStatus.COMPLETED ? "#f0fdf4" : "#f9fafb"; // bg-success/10 or bg-gray-50
  };

  // ゴールカードのタップハンドラ
  const handleCardPress = () => {
    router.push({
      pathname: "/modal/goal-detail",
      params: { id: goal.id },
    });
  };

  // 編集ボタンのタップハンドラ
  const handleEditPress = () => {
    router.push({
      pathname: "/modal/edit-goal",
      params: { id: goal.id },
    });
  };

  // 達成ボタンのタップハンドラ
  const handleCompletePress = () => {
    if (onComplete) {
      onComplete(goal.id);
    }
  };

  // 削除ボタンのタップハンドラ
  const handleDeletePress = () => {
    if (onDelete) {
      onDelete(goal.id);
    }
  };

  return (
    <Pressable
      onPress={handleCardPress}
      style={{ backgroundColor: getBackgroundColor() }}
      className="rounded-xl p-4 mb-2"
      accessibilityRole="button"
      accessibilityLabel={`ゴール: ${goal.title}`}
      testID="goal-card"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          {/* ゴールタイトル */}
          <Text className="text-sm font-semibold" numberOfLines={1}>
            {getGoalIcon()} {goal.title}
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
            style={{ color: getPriorityColor(goal.priority) }}
            testID="priority-indicator"
          >
            優先度: {getPriorityText(goal.priority)}
          </Text>
          
          {/* 作成日 */}
          <Text className="text-xs text-gray-500 mt-1">
            {formatDate(goal.created_at)}
          </Text>
        </View>

        {/* 右側のボタンエリア */}
        <View className="flex-row gap-2 ml-2">
          {/* 達成ボタン（完了済みでない場合のみ表示） */}
          {goal.status !== GoalStatus.COMPLETED && (
            <Pressable
              onPress={handleCompletePress}
              style={{ backgroundColor: "#4CAF50" }}
              className="py-1 px-3 rounded-lg"
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
};

export default GoalCard;