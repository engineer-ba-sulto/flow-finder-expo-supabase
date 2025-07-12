import { GoalPriority } from "../types/goal.types";

/**
 * 優先度ラベルを取得するヘルパー関数
 */
export const getPriorityLabel = (priority: GoalPriority): string => {
  switch (priority) {
    case GoalPriority.LOW:
      return "低優先度";
    case GoalPriority.MEDIUM:
      return "中優先度";
    case GoalPriority.HIGH:
      return "高優先度";
    default:
      return "中優先度";
  }
};
