import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator, Alert } from "react-native";
import { router } from "expo-router";
import { Goal, GoalPriority, GoalStatus } from "../../types/goal.types";
import ActionButton, { BRAND_COLORS } from "../../components/ui/ActionButton";

/**
 * ゴール詳細表示モーダルコンポーネントのProps型定義
 */
interface GoalDetailProps {
  /** 表示するゴールのデータ */
  goal: Goal | null;
  /** ローディング状態（任意） */
  isLoading?: boolean;
}

/**
 * ゴール詳細表示モーダルコンポーネント
 * 
 * @fileoverview ゴールの詳細情報を表示するモーダル。
 * 編集・削除・達成のアクション、ゴール情報の閲覧を提供する。
 * Flow Finderブランドカラーとアクセシビリティに対応。
 * 
 * @param props - GoalDetailProps
 * @returns ゴール詳細表示モーダルUI
 */
export default function GoalDetail({ goal, isLoading = false }: GoalDetailProps) {
  const [isDeleting, setIsDeleting] = useState(false);

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
   * ステータスのenumを日本語に変換
   */
  const getStatusText = (status: GoalStatus): string => {
    switch (status) {
      case GoalStatus.ACTIVE:
        return "進行中";
      case GoalStatus.COMPLETED:
        return "完了";
      case GoalStatus.PAUSED:
        return "一時停止";
      default:
        return "進行中";
    }
  };

  /**
   * 日付を日本語形式でフォーマット
   */
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).format(new Date(date));
  };

  /**
   * 編集ボタンのハンドラー
   */
  const handleEdit = () => {
    if (goal) {
      router.push(`/modal/edit-goal?id=${goal.id}`);
    }
  };

  /**
   * 達成ボタンのハンドラー
   */
  const handleComplete = () => {
    if (goal) {
      router.push(`/modal/goal-completion?id=${goal.id}`);
    }
  };

  /**
   * 削除ボタンのハンドラー（確認ダイアログ表示）
   */
  const handleDelete = () => {
    if (!goal) return;

    Alert.alert(
      "ゴールを削除しますか？",
      "この操作は取り消せません。",
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "削除",
          style: "destructive",
          onPress: confirmDelete,
        },
      ]
    );
  };

  /**
   * 削除の確認処理
   */
  const confirmDelete = async () => {
    if (!goal) return;

    setIsDeleting(true);
    try {
      // TODO: 実際の削除API呼び出し
      // await deleteGoal(goal.id);
      router.back();
    } catch (error) {
      console.error("ゴール削除エラー:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * モーダルを閉じる
   */
  const handleClose = () => {
    router.back();
  };

  // ローディング中の表示
  if (isLoading) {
    return (
      <View 
        className="flex-1 justify-center items-center bg-black/50"
        testID="modal-overlay"
      >
        <View className="bg-white rounded-xl p-6 mx-4 min-w-[300px]">
          <ActivityIndicator size="large" color={BRAND_COLORS.PRIMARY} testID="loading-indicator" />
          <Text className="text-center mt-4 text-gray-600">読み込み中...</Text>
        </View>
      </View>
    );
  }

  // ゴールデータが見つからない場合のエラー表示
  if (!goal) {
    return (
      <View 
        className="flex-1 justify-center items-center bg-black/50"
        testID="modal-overlay"
      >
        <View className="bg-white rounded-xl p-6 mx-4 min-w-[300px]">
          <Text className="text-center text-red-500 text-lg font-semibold">
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
      className="flex-1 justify-center items-center bg-black/50"
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
        testID="goal-detail-modal"
        accessibilityRole="dialog"
        accessibilityLabel="ゴール詳細"
      >
        {/* ヘッダー */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <Text 
            className="text-lg font-bold"
            style={{ color: BRAND_COLORS.SECONDARY }}
          >
            ゴール詳細
          </Text>
          <Pressable
            onPress={handleClose}
            className="p-2"
            testID="close-modal-button"
            accessibilityRole="button"
            accessibilityLabel="モーダルを閉じる"
          >
            <Text className="text-xl text-gray-500">✕</Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-6">
            {/* ゴールタイトル */}
            <View className="mb-4">
              <Text 
                className="text-xl font-bold mb-2"
                style={{ color: BRAND_COLORS.SECONDARY }}
                testID="goal-title-text"
              >
                {goal.title}
              </Text>
              
              {/* ゴールの詳細説明 */}
              {goal.description && (
                <Text 
                  className="text-base text-gray-700 leading-6"
                  testID="goal-description-text"
                >
                  {goal.description}
                </Text>
              )}
            </View>

            {/* ゴール情報 */}
            <View className="space-y-3 mb-6">
              {/* 優先度 */}
              <View className="flex-row justify-between items-center">
                <Text 
                  className="text-sm font-medium text-gray-600"
                  testID="priority-label"
                >
                  優先度
                </Text>
                <Text 
                  className="text-sm font-semibold"
                  style={{ color: BRAND_COLORS.SECONDARY }}
                  testID="priority-value"
                >
                  {getPriorityText(goal.priority)}
                </Text>
              </View>

              {/* ステータス */}
              <View className="flex-row justify-between items-center">
                <Text 
                  className="text-sm font-medium text-gray-600"
                  testID="status-label"
                >
                  ステータス
                </Text>
                <Text 
                  className="text-sm font-semibold"
                  style={{ color: BRAND_COLORS.SECONDARY }}
                  testID="status-value"
                >
                  {getStatusText(goal.status)}
                </Text>
              </View>

              {/* 作成日 */}
              <View className="flex-row justify-between items-center">
                <Text 
                  className="text-sm font-medium text-gray-600"
                  testID="created-date-label"
                >
                  作成日
                </Text>
                <Text 
                  className="text-sm font-semibold"
                  style={{ color: BRAND_COLORS.SECONDARY }}
                  testID="created-date-value"
                >
                  {formatDate(goal.created_at)}
                </Text>
              </View>
            </View>

            {/* アクションボタン */}
            <View className="space-y-3">
              {/* 編集・達成ボタン行 */}
              <View className="flex-row gap-3">
                <ActionButton
                  title="編集"
                  theme="primary"
                  onPress={handleEdit}
                  testID="edit-goal-button"
                  accessibilityLabel="ゴールを編集"
                  fullWidth
                />
                
                {/* 未完了の場合のみ達成ボタンを表示 */}
                {goal.status !== GoalStatus.COMPLETED && (
                  <ActionButton
                    title="達成"
                    theme="success"
                    onPress={handleComplete}
                    testID="complete-goal-button"
                    accessibilityLabel="ゴールを達成"
                    fullWidth
                  />
                )}
              </View>

              {/* 削除ボタン */}
              <Pressable
                onPress={handleDelete}
                disabled={isDeleting}
                className={`py-3 px-4 rounded-xl ${isDeleting ? "opacity-50" : ""}`}
                style={{ backgroundColor: "#f87171" }}
                testID="delete-goal-button"
                accessibilityRole="button"
                accessibilityLabel="ゴールを削除"
                accessibilityState={{ disabled: isDeleting }}
              >
                <Text className="font-semibold text-sm text-center text-white">
                  {isDeleting ? "削除中..." : "削除"}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}