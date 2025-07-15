import React from "react";
import { Text, View } from "react-native";

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <View className="mt-6 p-4 bg-red-50 rounded-xl">
    <Text className="text-red-600 text-center">{message}</Text>
  </View>
);
