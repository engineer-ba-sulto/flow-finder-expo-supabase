import React from "react";
import { Text, View } from "react-native";

const LoadingScreen = () => (
  <View
    className="flex-1 justify-center items-center bg-white"
    accessibilityLabel="アプリを読み込み中です"
    accessibilityRole="text"
  >
    <Text className="text-lg" accessibilityLabel="読み込み中です">
      読み込み中...
    </Text>
  </View>
);

export default LoadingScreen;
