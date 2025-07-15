import React from "react";
import { View } from "react-native";
import { GoalCard } from "./GoalCard";

interface GoalListProps {
  goals: any[];
  onOptionsPress: (goal: any) => void;
  getGoalIcon: (category: string) => string;
  getPriorityText: (priority: number) => string;
}

export const GoalList: React.FC<GoalListProps> = ({
  goals,
  onOptionsPress,
  getGoalIcon,
  getPriorityText,
}) => (
  <View className="gap-3">
    {goals.map((goal, index) => (
      <GoalCard
        key={goal.id || index}
        goal={goal}
        onOptionsPress={onOptionsPress}
        getGoalIcon={getGoalIcon}
        getPriorityText={getPriorityText}
      />
    ))}
  </View>
);
