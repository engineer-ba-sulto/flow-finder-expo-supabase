import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Alert } from "react-native";
import { router } from "expo-router";

export default function CreateGoalModal() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("📚 学習・スキルアップ");
  const [priority, setPriority] = useState("高");
  const [description, setDescription] = useState("");

  const categories = [
    "📚 学習・スキルアップ",
    "🏃 健康・フィットネス", 
    "💼 仕事・キャリア",
    "💰 お金・投資"
  ];

  const priorities = ["高", "中", "低"];

  const handleCancel = () => {
    router.back();
  };

  const handleCreate = () => {
    if (!title.trim()) {
      Alert.alert("エラー", "タイトルを入力してください");
      return;
    }
    
    // TODO: ゴール作成ロジックを実装
    console.log("新しいゴール作成:", { title, category, priority, description });
    Alert.alert("成功", "ゴールが作成されました", [
      { text: "OK", onPress: () => router.back() }
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      {/* ヘッダー */}
      <View className="bg-[#FFC400] p-4">
        <Text className="text-xl font-bold text-[#212121]">➕ ゴール作成</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          <Text
            className="text-lg font-bold text-[#212121] mb-4 text-center"
            accessibilityRole="header"
          >
            新しいゴール
          </Text>

          {/* タイトル入力 */}
          <View className="mb-4">
            <Text className="text-sm text-[#212121] font-medium mb-1">
              タイトル
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="例: 英語学習マスター"
              className="border border-gray-300 rounded-lg p-3 text-sm"
              accessibilityLabel="ゴールのタイトル"
              accessibilityHint="ゴールの名前を入力してください"
            />
          </View>

          {/* カテゴリ選択 */}
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

          {/* 優先度選択 */}
          <View className="mb-4">
            <Text className="text-sm text-[#212121] font-medium mb-2">
              優先度
            </Text>
            <View className="flex-row gap-2">
              {priorities.map((prio) => (
                <Pressable
                  key={prio}
                  onPress={() => setPriority(prio)}
                  className={`flex-1 py-2 px-3 rounded-lg ${
                    priority === prio ? 'bg-[#FFC400]' : 'bg-gray-200'
                  }`}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: priority === prio }}
                >
                  <Text className={`text-sm font-medium text-center ${
                    priority === prio ? 'text-[#212121]' : 'text-gray-600'
                  }`}>
                    {prio}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* 説明入力 */}
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
              accessibilityLabel="ゴールの説明"
              accessibilityHint="ゴールの詳細を入力してください（任意）"
            />
          </View>

          {/* アクションボタン */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={handleCancel}
              className="flex-1 border border-gray-300 py-3 px-4 rounded-xl"
              accessibilityRole="button"
              accessibilityLabel="キャンセル"
              accessibilityHint="ゴール作成をキャンセルします"
            >
              <Text className="text-[#212121] text-sm text-center">
                キャンセル
              </Text>
            </Pressable>
            <Pressable
              onPress={handleCreate}
              className="flex-1 bg-[#FFC400] py-3 px-4 rounded-xl"
              accessibilityRole="button"
              accessibilityLabel="作成"
              accessibilityHint="新しいゴールを作成します"
            >
              <Text className="text-[#212121] font-semibold text-sm text-center">
                作成
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}