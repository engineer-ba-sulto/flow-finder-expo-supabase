import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Button } from "../../components/ui/Button";

interface ErrorScreenProps {
  error: any;
  onRetry: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, onRetry }) => (
  <ScrollView
    className="flex-1 bg-white"
    contentContainerStyle={{
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 16,
    }}
    accessibilityLabel="エラー画面"
  >
    <View className="items-center">
      <Text
        className="text-xl font-semibold text-red-500 mb-4 text-center"
        accessibilityRole="header"
        accessibilityLabel="エラーが発生しました"
      >
        エラーが発生しました
      </Text>
      <Text
        className="text-center text-gray-600 mb-6 leading-6"
        accessibilityLabel={`エラー詳細: ${error.message}`}
      >
        {error.message}
      </Text>
      <Button
        variant="primary"
        onPress={onRetry}
        accessibilityLabel="再読み込みを実行"
        accessibilityHint="エラーを解決するために再度読み込みを試行します"
      >
        再読み込み
      </Button>
    </View>
  </ScrollView>
);

export default ErrorScreen;
