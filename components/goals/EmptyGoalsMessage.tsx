import React from "react";
import { Text, View } from "react-native";

export const EmptyGoalsMessage: React.FC = () => (
  <View className="bg-gray-50 rounded-xl p-4">
    <Text className="text-center text-gray-600">
      まだゴールがありません。最初のゴールを作成しましょう！
    </Text>
  </View>
);
