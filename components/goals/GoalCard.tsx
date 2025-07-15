import React from "react";
import { Pressable, Text, View } from "react-native";

interface GoalCardProps {
  goal: any;
  onOptionsPress: (goal: any) => void;
  getGoalIcon: (category: string) => string;
  getPriorityText: (priority: number) => string;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onOptionsPress,
  getGoalIcon,
  getPriorityText,
}) => (
  <View className="bg-gray-50 rounded-xl p-4">
    <View className="flex-row justify-between items-start">
      <View className="flex-1">
        <Text className="text-sm font-semibold" numberOfLines={1}>
          {getGoalIcon(goal.category)} {goal.title || "無題のゴール"}
        </Text>
        <Text className="text-xs text-gray-600 mt-1">
          優先度: {getPriorityText(goal.priority)}
        </Text>
      </View>
      <Pressable
        onPress={() => onOptionsPress(goal)}
        className="text-gray-400"
        testID={`goal-options-${goal.id}`}
        accessibilityRole="button"
        accessibilityLabel="ゴールオプション"
      >
        <Text className="text-gray-400">⋮</Text>
      </Pressable>
    </View>
  </View>
);
