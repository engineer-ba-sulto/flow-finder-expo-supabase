import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface SimpleGoalCompletionProps {
  goalId: string;
  isCompleted: boolean;
  onToggle: (goalId: string) => void;
}

export const SimpleGoalCompletion: React.FC<SimpleGoalCompletionProps> = ({
  goalId,
  isCompleted,
  onToggle,
}) => {
  const handlePress = () => {
    onToggle(goalId);
  };

  return (
    <View className="mb-6">
      <Text className="text-sm font-semibold text-secondary mb-2">
        ✅ ゴール管理
      </Text>
      <Pressable
        testID="goal-completion-button"
        className={`w-full ${
          isCompleted ? 'bg-gray-400' : 'bg-green-500'
        } py-3 px-4 rounded-xl mb-2`}
        accessibilityRole="button"
        accessibilityLabel="ゴール完了マーク"
        onPress={handlePress}
      >
        <Text className="text-white font-semibold text-sm text-center">
          ゴール完了マーク
        </Text>
      </Pressable>
      <Text className="text-xs text-gray-600 text-center">
        ※ MVP2段目でアクション機能追加予定
      </Text>
    </View>
  );
};