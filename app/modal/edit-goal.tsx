import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator, Alert, TextInput } from "react-native";
import { router } from "expo-router";
import { Goal, GoalPriority, GoalStatus } from "../../types/goal.types";
import ActionButton, { BRAND_COLORS } from "../../components/ui/ActionButton";

/**
 * ゴール編集モーダルコンポーネントのProps型定義
 */
interface EditGoalProps {
  /** 編集するゴールのデータ */
  goal: Goal | null;
  /** ローディング状態（任意） */
  isLoading?: boolean;
}

/**
 * ゴール編集モーダルコンポーネント
 * 
 * @fileoverview ゴールの編集を行うモーダル。
 * タイトル、説明、優先度の編集機能を提供する。
 * Flow Finderブランドカラーとアクセシビリティに対応。
 * 
 * @param props - EditGoalProps
 * @returns ゴール編集モーダルUI
 */
export default function EditGoal({ goal, isLoading = false }: EditGoalProps) {
  const [title, setTitle] = useState(goal?.title || "");
  const [description, setDescription] = useState(goal?.description || "");
  const [priority, setPriority] = useState(goal?.priority || GoalPriority.MEDIUM);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [titleError, setTitleError] = useState("");

  /**
   * 優先度の数値を日本語に変換
   */
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

  /**
   * モーダルを閉じる
   */
  const handleClose = () => {
    router.back();
  };

  /**
   * バリデーション
   */
  const validateForm = (): boolean => {
    if (!title.trim()) {
      setTitleError("タイトルは必須です");
      return false;
    }
    setTitleError("");
    return true;
  };

  /**
   * 保存処理
   */
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      // TODO: 実際の保存API呼び出し
      // await updateGoal(goal.id, { title, description, priority });
      setShowSuccessMessage(true);
      
      // 成功メッセージを表示後、モーダルを閉じる
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

  /**
   * キャンセル処理
   */
  const handleCancel = () => {
    router.back();
  };

  // ローディング中の表示
  if (isLoading) {
    return (
      <View 
        className="flex-1 justify-center items-center"
        testID="modal-overlay"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <View className="bg-white rounded-xl p-6 mx-4 min-w-[300px] items-center">
          <ActivityIndicator size="large" color={BRAND_COLORS.PRIMARY} testID="loading-indicator" />
          <Text 
            className="text-center mt-4 text-sm font-medium"
            style={{ color: BRAND_COLORS.SECONDARY }}
          >
            読み込み中...
          </Text>
        </View>
      </View>
    );
  }

  // ゴールデータが見つからない場合のエラー表示
  if (!goal) {
    return (
      <View 
        className="flex-1 justify-center items-center"
        testID="modal-overlay"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <View className="bg-white rounded-xl p-6 mx-4 min-w-[300px] items-center">
          <View className="text-4xl mb-3">❌</View>
          <Text className="text-center text-red-500 text-lg font-semibold mb-4">
            ゴールが見つかりません
          </Text>
          <ActionButton
            title="閉じる"
            theme="secondary"
            onPress={handleClose}
            testID="close-error-button"
            fullWidth
          />
        </View>
      </View>
    );
  }

  return (
    <View 
      className="flex-1 justify-center items-center"
      testID="modal-overlay"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <View 
        className="bg-white rounded-xl mx-4 max-w-md w-full max-h-[80%]"
        testID="edit-goal-modal"
        accessibilityRole="dialog"
        accessibilityLabel="ゴール編集"
      >
        {/* ヘッダー */}
        <View 
          className="p-4 border-b border-gray-200"
          style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
        >
          <View className="flex-row justify-between items-center">
            <Text 
              className="text-xl font-bold"
              style={{ color: BRAND_COLORS.SECONDARY }}
              testID="modal-title"
            >
              ✏️ ゴール編集
            </Text>
            <Pressable
              onPress={handleClose}
              className="p-2"
              testID="close-modal-button"
              accessibilityRole="button"
              accessibilityLabel="モーダルを閉じる"
            >
              <Text className="text-xl" style={{ color: BRAND_COLORS.SECONDARY }}>✕</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-6">
            {/* タイトル入力 */}
            <View className="mb-4">
              <Text 
                className="text-sm font-medium mb-2"
                style={{ color: BRAND_COLORS.SECONDARY }}
              >
                タイトル
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                placeholder="例: 英語学習マスター"
                value={title}
                onChangeText={setTitle}
                testID="goal-title-input"
                accessibilityLabel="ゴールタイトル"
                editable={true}
                style={{ color: BRAND_COLORS.SECONDARY }}
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

            {/* 説明入力 */}
            <View className="mb-4">
              <Text 
                className="text-sm font-medium mb-2"
                style={{ color: BRAND_COLORS.SECONDARY }}
              >
                説明（任意）
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                placeholder="このゴールについて詳しく..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                testID="goal-description-input"
                accessibilityLabel="ゴール説明"
                editable={true}
                style={{ 
                  color: BRAND_COLORS.SECONDARY,
                  height: 80,
                  textAlignVertical: "top"
                }}
              />
            </View>

            {/* 優先度選択 */}
            <View className="mb-6">
              <Text 
                className="text-sm font-medium mb-2"
                style={{ color: BRAND_COLORS.SECONDARY }}
              >
                優先度
              </Text>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => setPriority(GoalPriority.HIGH)}
                  className={`flex-1 py-2 px-3 rounded-lg ${
                    priority === GoalPriority.HIGH 
                      ? 'bg-[#FFC400]' 
                      : 'bg-gray-200'
                  }`}
                  testID="priority-high-button"
                  accessibilityRole="button"
                  accessibilityLabel="優先度高"
                  accessibilityState={{ selected: priority === GoalPriority.HIGH }}
                >
                  <Text 
                    className="text-sm font-medium text-center"
                    style={{ color: BRAND_COLORS.SECONDARY }}
                  >
                    高
                  </Text>
                </Pressable>
                
                <Pressable
                  onPress={() => setPriority(GoalPriority.MEDIUM)}
                  className={`flex-1 py-2 px-3 rounded-lg ${
                    priority === GoalPriority.MEDIUM 
                      ? 'bg-[#FFC400]' 
                      : 'bg-gray-200'
                  }`}
                  testID="priority-medium-button"
                  accessibilityRole="button"
                  accessibilityLabel="優先度中"
                  accessibilityState={{ selected: priority === GoalPriority.MEDIUM }}
                >
                  <Text 
                    className="text-sm font-medium text-center"
                    style={{ color: BRAND_COLORS.SECONDARY }}
                  >
                    中
                  </Text>
                </Pressable>
                
                <Pressable
                  onPress={() => setPriority(GoalPriority.LOW)}
                  className={`flex-1 py-2 px-3 rounded-lg ${
                    priority === GoalPriority.LOW 
                      ? 'bg-[#FFC400]' 
                      : 'bg-gray-200'
                  }`}
                  testID="priority-low-button"
                  accessibilityRole="button"
                  accessibilityLabel="優先度低"
                  accessibilityState={{ selected: priority === GoalPriority.LOW }}
                >
                  <Text 
                    className="text-sm font-medium text-center"
                    style={{ color: BRAND_COLORS.SECONDARY }}
                  >
                    低
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* アクションボタン */}
            <View className="flex-row gap-3 mt-6">
              <Pressable
                onPress={handleCancel}
                className="flex-1 border border-gray-300 py-3 px-4 rounded-xl"
                testID="cancel-button"
                accessibilityRole="button"
                accessibilityLabel="キャンセル"
              >
                <Text 
                  className="text-sm text-center font-medium"
                  style={{ color: BRAND_COLORS.SECONDARY }}
                >
                  キャンセル
                </Text>
              </Pressable>
              
              <Pressable
                onPress={handleSave}
                disabled={isSaving}
                className={`flex-1 py-3 px-4 rounded-xl ${isSaving ? "opacity-50" : ""}`}
                style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
                testID="save-goal-button"
                accessibilityRole="button"
                accessibilityLabel="ゴールを保存"
                accessibilityState={{ busy: isSaving }}
              >
                <Text 
                  className="text-sm text-center font-semibold"
                  style={{ color: BRAND_COLORS.SECONDARY }}
                >
                  {isSaving ? "保存中..." : "保存"}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
      
      {/* 成功メッセージ */}
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