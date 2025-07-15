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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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
      showToastMessage("ゴールを削除しました");
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error) {
      console.error("ゴール削除エラー:", error);
      showToastMessage("削除に失敗しました");
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

  /**
   * トースト表示のヘルパー関数
   */
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // ローディング中の表示 - 画面カタログ準拠
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

  // ゴールデータが見つからない場合のエラー表示 - 画面カタログ準拠
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
          <Text 
            className="text-center text-red-500 text-lg font-semibold mb-4"
            testID="error-message"
          >
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
        testID="goal-detail-modal"
        accessibilityRole="dialog"
        accessibilityLabel="ゴール詳細"
      >
        {/* ヘッダー - 画面カタログ準拠 */}
        <View 
          className="p-4 border-b border-gray-200"
          style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
        >
          <View className="flex-row justify-between items-center">
            <Text 
              className="text-xl font-bold"
              style={{ color: BRAND_COLORS.SECONDARY }}
            >
              🎯 ゴール詳細
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
            {/* ゴールタイトル - 画面カタログ準拠 */}
            <View className="mb-6 items-center">
              <View className="text-4xl mb-3">🎯</View>
              <Text 
                className="text-xl font-bold mb-2 text-center"
                style={{ color: BRAND_COLORS.SECONDARY }}
                testID="goal-title-text"
              >
                {goal.title}
              </Text>
              
              {/* ゴールの詳細説明 */}
              {goal.description && (
                <Text 
                  className="text-base text-gray-700 leading-6 text-center"
                  testID="goal-description-text"
                >
                  {goal.description}
                </Text>
              )}
            </View>

            {/* ゴール情報 - 画面カタログ準拠のカード形式 */}
            <View className="bg-gray-50 rounded-xl p-4 mb-6">
              {/* 優先度 */}
              <View className="flex-row justify-between items-center mb-3">
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
              <View className="flex-row justify-between items-center mb-3">
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

            {/* アクションボタン - 画面カタログ準拠 */}
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

              {/* 削除ボタン - 画面カタログ準拠 */}
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
            
            {/* 閉じるボタン - 画面カタログ準拠 */}
            <View className="items-center mt-4">
              <Pressable
                onPress={handleClose}
                className="px-4 py-2"
                testID="close-secondary-button"
                accessibilityRole="button"
                accessibilityLabel="モーダルを閉じる"
              >
                <Text 
                  className="text-sm underline"
                  style={{ color: BRAND_COLORS.SECONDARY }}
                >
                  閉じる
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
      
      {/* トースト表示 */}
      {showToast && (
        <View 
          className="absolute bottom-20 left-6 right-6 bg-gray-800 rounded-lg p-4 z-50"
          testID="toast-message"
        >
          <Text className="text-white text-sm font-medium text-center">
            {toastMessage}
          </Text>
        </View>
      )}
    </View>
  );
}