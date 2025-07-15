import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator, Alert, TextInput } from "react-native";
import { router } from "expo-router";
import { Goal, GoalPriority, GoalStatus } from "../../types/goal.types";

interface EditGoalProps {
  goal: Goal | null;
  isLoading?: boolean;
}

export default function EditGoal({ goal, isLoading = false }: EditGoalProps) {
  const [title, setTitle] = useState(goal?.title || "");
  const [category, setCategory] = useState(goal?.category || "📚 学習・スキルアップ");
  const [description, setDescription] = useState(goal?.description || "");
  const [priority, setPriority] = useState(goal?.priority || GoalPriority.MEDIUM);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [titleError, setTitleError] = useState("");

  const categories = [
    "📚 学習・スキルアップ",
    "🏃 健康・フィットネス", 
    "💼 仕事・キャリア",
    "💰 お金・投資"
  ];

  const priorities = ["高", "中", "低"];

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

  const getPriorityFromText = (text: string): GoalPriority => {
    switch (text) {
      case "高":
        return GoalPriority.HIGH;
      case "中":
        return GoalPriority.MEDIUM;
      case "低":
        return GoalPriority.LOW;
      default:
        return GoalPriority.MEDIUM;
    }
  };

  const handleClose = () => {
    router.back();
  };

  const validateForm = (): boolean => {
    if (!title.trim()) {
      setTitleError("タイトルは必須です");
      return false;
    }
    setTitleError("");
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      setShowSuccessMessage(true);
      
      setTimeout(() => {
        setShowSuccessMessage(false);
        router.back();
      }, 2000);
    } catch (error) {
      console.error("ゴール保存エラー:", error);
      Alert.alert("エラー", "ゴールの保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FFC400" testID="loading-indicator" />
        <Text className="text-center mt-4 text-sm font-medium text-[#212121]">
          読み込み中...
        </Text>
      </View>
    );
  }

  if (!goal) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <View className="text-4xl mb-3">❌</View>
        <Text className="text-center text-red-500 text-lg font-semibold mb-4">
          ゴールが見つかりません
        </Text>
        <Pressable
          onPress={handleClose}
          className="bg-gray-200 py-3 px-4 rounded-xl"
          testID="close-error-button"
          accessibilityRole="button"
          accessibilityLabel="閉じる"
        >
          <Text className="text-[#212121] text-sm font-medium">閉じる</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="bg-[#FFC400] p-4">
        <Text className="text-xl font-bold text-[#212121]">✏️ ゴール編集</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          <Text
            className="text-lg font-bold text-[#212121] mb-4 text-center"
            accessibilityRole="header"
          >
            ゴールを編集
          </Text>

          <View className="mb-4">
            <Text className="text-sm text-[#212121] font-medium mb-1">
              タイトル
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="例: 英語学習マスター"
              className="border border-gray-300 rounded-lg p-3 text-sm"
              testID="goal-title-input"
              accessibilityLabel="ゴールのタイトル"
              accessibilityHint="ゴールの名前を入力してください"
            />
            {titleError && (
              <Text 
                className="text-red-500 text-xs mt-1"
                testID="title-error-message"
              >
                {titleError}
              </Text>
            )}
          </View>

          <View className="mb-4">
            <Text className="text-sm text-[#212121] font-medium mb-1">
              カテゴリ
            </Text>
            <View className="border border-gray-300 rounded-lg">
              {categories.map((cat, index) => (
                <Pressable
                  key={cat}
                  onPress={() => setCategory(cat)}
                  className={`p-3 ${index !== categories.length - 1 ? 'border-b border-gray-200' : ''} ${
                    category === cat ? 'bg-[#FFC400]' : 'bg-white'
                  }`}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: category === cat }}
                >
                  <Text className={`text-sm ${category === cat ? 'text-[#212121] font-medium' : 'text-gray-700'}`}>
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm text-[#212121] font-medium mb-2">
              優先度
            </Text>
            <View className="flex-row gap-2">
              {priorities.map((prio) => (
                <Pressable
                  key={prio}
                  onPress={() => setPriority(getPriorityFromText(prio))}
                  className={`flex-1 py-2 px-3 rounded-lg ${
                    getPriorityText(priority) === prio ? 'bg-[#FFC400]' : 'bg-gray-200'
                  }`}
                  testID={`priority-${prio}-button`}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: getPriorityText(priority) === prio }}
                >
                  <Text className={`text-sm font-medium text-center ${
                    getPriorityText(priority) === prio ? 'text-[#212121]' : 'text-gray-600'
                  }`}>
                    {prio}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-sm text-[#212121] font-medium mb-1">
              説明（任意）
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="このゴールについて詳しく..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="border border-gray-300 rounded-lg p-3 text-sm h-16"
              testID="goal-description-input"
              accessibilityLabel="ゴールの説明"
              accessibilityHint="ゴールの詳細を入力してください（任意）"
            />
          </View>

          <View className="flex-row gap-3">
            <Pressable
              onPress={handleCancel}
              className="flex-1 border border-gray-300 py-3 px-4 rounded-xl"
              testID="cancel-button"
              accessibilityRole="button"
              accessibilityLabel="キャンセル"
              accessibilityHint="ゴール編集をキャンセルします"
            >
              <Text className="text-[#212121] text-sm text-center">
                キャンセル
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={isSaving}
              className={`flex-1 bg-[#FFC400] py-3 px-4 rounded-xl ${isSaving ? "opacity-50" : ""}`}
              testID="save-goal-button"
              accessibilityRole="button"
              accessibilityLabel="保存"
              accessibilityHint="ゴールの変更を保存します"
            >
              <Text className="text-[#212121] font-semibold text-sm text-center">
                {isSaving ? "保存中..." : "保存"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      
      {showSuccessMessage && (
        <View 
          className="absolute bottom-20 left-6 right-6 bg-gray-800 rounded-lg p-4 z-50"
          testID="success-message"
        >
          <Text className="text-white text-sm font-medium text-center">
            ゴールを更新しました
          </Text>
        </View>
      )}
    </View>
  );
}