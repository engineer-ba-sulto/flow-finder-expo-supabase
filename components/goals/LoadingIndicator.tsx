import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export const LoadingIndicator: React.FC = () => (
  <View className="mt-6 items-center">
    <ActivityIndicator size="large" color="#FFC400" />
    <Text className="mt-2 text-gray-600">読み込み中...</Text>
  </View>
);
