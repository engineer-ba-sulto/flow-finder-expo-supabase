import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { GoalForm } from "../../components/forms/GoalForm";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { getSupabaseClient } from "../../lib/supabase";
import {
  CreateGoalInput,
  Goal,
  GoalPriority,
  GoalStatus,
} from "../../types/goal.types";

/**
 * エラー処理用の型定義
 */
interface ErrorState {
  message: string;
  action?: string;
}

/**
 * UI状態管理用の型定義
 */
interface UIState {
  showCreateForm: boolean;
  showEditForm: boolean;
  showDeleteDialog: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
}

/**
 * ゴール管理画面コンポーネント
 *
 * ゴールのCRUD操作を提供する画面です。
 * Refactor Phase: パフォーマンス最適化とコード品質向上
 */
const Goals: React.FC = () => {
  // 状態管理
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);
  const [, setError] = useState<ErrorState | null>(null);
  const [uiState, setUIState] = useState<UIState>({
    showCreateForm: false,
    showEditForm: false,
    showDeleteDialog: false,
    isLoading: true,
    isSubmitting: false,
  });

  // Supabaseクライアント（メモ化）
  const supabase = useMemo(() => getSupabaseClient(), []);

  /**
   * UI状態を更新するヘルパー関数
   */
  const updateUIState = useCallback((updates: Partial<UIState>) => {
    setUIState((prev) => ({ ...prev, ...updates }));
  }, []);

  /**
   * エラー状態をクリアする関数
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * エラーハンドリング関数
   */
  const handleError = useCallback(
    (error: any, action: string) => {
      console.error(`${action}エラー:`, error);
      setError({
        message: `${action}に失敗しました。もう一度お試しください。`,
        action,
      });
      // ユーザーにエラーを通知
      Alert.alert(
        "エラーが発生しました",
        `${action}に失敗しました。もう一度お試しください。`,
        [{ text: "OK", onPress: clearError }]
      );
    },
    [clearError]
  );

  /**
   * ゴール一覧を取得
   */
  const loadGoals = useCallback(async () => {
    try {
      updateUIState({ isLoading: true });
      clearError();

      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        handleError(error, "ゴールの読み込み");
        return;
      }

      const formattedGoals: Goal[] =
        data?.map((goal) => ({
          ...goal,
          created_at: new Date(goal.created_at),
          updated_at: new Date(goal.updated_at),
        })) || [];

      setGoals(formattedGoals);
    } catch (error) {
      handleError(error, "ゴールの読み込み");
    } finally {
      updateUIState({ isLoading: false });
    }
  }, [supabase, updateUIState, clearError, handleError]);

  // 初回データ取得
  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  /**
   * ゴール作成処理
   */
  const handleCreateGoal = useCallback(
    async (goalData: CreateGoalInput) => {
      try {
        updateUIState({ isSubmitting: true });
        clearError();

        const { data, error } = await supabase
          .from("goals")
          .insert([
            {
              ...goalData,
              status: GoalStatus.ACTIVE,
              priority: goalData.priority || GoalPriority.MEDIUM,
            },
          ])
          .select()
          .single();

        if (error) {
          handleError(error, "ゴールの作成");
          return;
        }

        if (data) {
          const newGoal: Goal = {
            ...data,
            created_at: new Date(data.created_at),
            updated_at: new Date(data.updated_at),
          };
          setGoals((prev) => [newGoal, ...prev]);
          updateUIState({ showCreateForm: false });

          // 成功通知
          Alert.alert("成功", "ゴールが作成されました。");
        }
      } catch (error) {
        handleError(error, "ゴールの作成");
      } finally {
        updateUIState({ isSubmitting: false });
      }
    },
    [supabase, updateUIState, clearError, handleError]
  );

  /**
   * ゴール更新処理
   */
  const handleUpdateGoal = useCallback(
    async (goalData: CreateGoalInput) => {
      if (!editingGoal) return;

      try {
        updateUIState({ isSubmitting: true });
        clearError();

        const { data, error } = await supabase
          .from("goals")
          .update({
            title: goalData.title,
            description: goalData.description,
            priority: goalData.priority,
          })
          .eq("id", editingGoal.id)
          .select()
          .single();

        if (error) {
          handleError(error, "ゴールの更新");
          return;
        }

        if (data) {
          const updatedGoal: Goal = {
            ...data,
            created_at: new Date(data.created_at),
            updated_at: new Date(data.updated_at),
          };
          setGoals((prev) =>
            prev.map((goal) =>
              goal.id === editingGoal.id ? updatedGoal : goal
            )
          );
          updateUIState({ showEditForm: false });
          setEditingGoal(null);

          // 成功通知
          Alert.alert("成功", "ゴールが更新されました。");
        }
      } catch (error) {
        handleError(error, "ゴールの更新");
      } finally {
        updateUIState({ isSubmitting: false });
      }
    },
    [editingGoal, supabase, updateUIState, clearError, handleError]
  );

  /**
   * ゴール削除処理
   */
  const handleDeleteGoal = useCallback(
    async (goalId: string) => {
      try {
        clearError();

        const { error } = await supabase
          .from("goals")
          .delete()
          .eq("id", goalId);

        if (error) {
          handleError(error, "ゴールの削除");
          return;
        }

        setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
        updateUIState({ showDeleteDialog: false });
        setDeletingGoalId(null);

        // 成功通知
        Alert.alert("成功", "ゴールが削除されました。");
      } catch (error) {
        handleError(error, "ゴールの削除");
      }
    },
    [supabase, updateUIState, clearError, handleError]
  );

  /**
   * 編集ボタン押下時
   */
  const handleEditPress = useCallback(
    (goal: Goal) => {
      setEditingGoal(goal);
      updateUIState({ showEditForm: true });
    },
    [updateUIState]
  );

  /**
   * 削除ボタン押下時
   */
  const handleDeletePress = useCallback(
    (goalId: string) => {
      setDeletingGoalId(goalId);
      updateUIState({ showDeleteDialog: true });
    },
    [updateUIState]
  );

  /**
   * 削除確認処理
   */
  const confirmDelete = useCallback(() => {
    if (deletingGoalId) {
      handleDeleteGoal(deletingGoalId);
    }
  }, [deletingGoalId, handleDeleteGoal]);

  /**
   * フォームキャンセル処理
   */
  const handleCancelForm = useCallback(() => {
    updateUIState({
      showCreateForm: false,
      showEditForm: false,
    });
    setEditingGoal(null);
  }, [updateUIState]);

  /**
   * メモ化された削除ダイアログのキャンセル処理
   */
  const handleDeleteCancel = useCallback(() => {
    updateUIState({ showDeleteDialog: false });
    setDeletingGoalId(null);
  }, [updateUIState]);

  /**
   * 新規作成ボタンの押下処理
   */
  const handleCreatePress = useCallback(() => {
    updateUIState({ showCreateForm: true });
  }, [updateUIState]);

  // ローディング中の表示
  if (uiState.isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#FFC400" />
        <Text className="mt-4 text-gray-600">ゴールを読み込み中...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      accessibilityLabel="ゴール管理画面"
      accessibilityHint="ゴールの作成、編集、削除ができます"
    >
      <View className="p-4">
        {/* ヘッダー */}
        <Text
          className="text-2xl font-bold mb-6 text-gray-800"
          accessibilityRole="header"
        >
          ゴール管理
        </Text>

        {/* 新規作成ボタン */}
        <View className="mb-6">
          <Button
            variant="primary"
            onPress={handleCreatePress}
            disabled={
              uiState.showCreateForm ||
              uiState.showEditForm ||
              uiState.isSubmitting
            }
            accessibilityLabel="新しいゴールを作成"
            accessibilityHint="ゴール作成フォームを開きます"
          >
            新しいゴールを作成
          </Button>
        </View>

        {/* ゴール作成フォーム */}
        {uiState.showCreateForm && (
          <View className="mb-6">
            <GoalForm
              onSubmit={handleCreateGoal}
              onCancel={handleCancelForm}
              isSubmitting={uiState.isSubmitting}
            />
          </View>
        )}

        {/* ゴール編集フォーム */}
        {uiState.showEditForm && editingGoal && (
          <View className="mb-6">
            <GoalForm
              onSubmit={handleUpdateGoal}
              onCancel={handleCancelForm}
              initialGoal={editingGoal}
              isSubmitting={uiState.isSubmitting}
            />
          </View>
        )}

        {/* ゴール一覧 */}
        <View>
          {goals.length === 0 ? (
            <View className="text-center py-8">
              <Text
                className="text-lg text-gray-600 mb-2"
                accessibilityRole="text"
              >
                まだゴールがありません
              </Text>
              <Text className="text-gray-500" accessibilityRole="text">
                最初のゴールを作成してみましょう
              </Text>
            </View>
          ) : (
            goals.map((goal) => (
              <View key={goal.id} className="mb-4">
                <Card>
                  <View className="p-4">
                    <Text
                      className="text-lg font-semibold mb-2"
                      accessibilityRole="header"
                    >
                      {goal.title}
                    </Text>
                    {goal.description && (
                      <Text
                        className="text-gray-600 mb-3"
                        accessibilityRole="text"
                      >
                        {goal.description}
                      </Text>
                    )}
                    <Text
                      className="text-sm text-gray-500 mb-3"
                      accessibilityRole="text"
                    >
                      優先度: {getPriorityLabel(goal.priority)}
                    </Text>
                    <View className="flex-row gap-2">
                      <Button
                        variant="secondary"
                        onPress={() => handleEditPress(goal)}
                        disabled={
                          uiState.showCreateForm ||
                          uiState.showEditForm ||
                          uiState.isSubmitting
                        }
                        accessibilityLabel={`${goal.title}を編集`}
                        accessibilityHint="ゴールの編集フォームを開きます"
                      >
                        編集
                      </Button>
                      <Button
                        variant="secondary"
                        onPress={() => handleDeletePress(goal.id)}
                        disabled={
                          uiState.showCreateForm ||
                          uiState.showEditForm ||
                          uiState.isSubmitting
                        }
                        accessibilityLabel={`${goal.title}を削除`}
                        accessibilityHint="ゴールの削除確認ダイアログを開きます"
                      >
                        削除
                      </Button>
                    </View>
                  </View>
                </Card>
              </View>
            ))
          )}
        </View>

        {/* 削除確認ダイアログ */}
        {uiState.showDeleteDialog && (
          <View
            className="absolute inset-0 bg-black/50 justify-center items-center"
            accessibilityLabel="削除確認ダイアログ"
          >
            <View className="bg-white p-6 rounded-lg mx-4 w-full max-w-sm">
              <Text
                className="text-lg font-semibold mb-4"
                accessibilityRole="header"
              >
                確認
              </Text>
              <Text className="text-gray-600 mb-6" accessibilityRole="text">
                このゴールを削除してもよろしいですか？
              </Text>
              <View className="flex-row gap-4">
                <Button
                  variant="secondary"
                  onPress={handleDeleteCancel}
                  className="flex-1"
                  accessibilityLabel="削除をキャンセル"
                  accessibilityHint="削除をキャンセルしてダイアログを閉じます"
                >
                  キャンセル
                </Button>
                <Button
                  variant="primary"
                  onPress={confirmDelete}
                  className="flex-1"
                  accessibilityLabel="ゴールを削除"
                  accessibilityHint="ゴールを完全に削除します"
                >
                  削除
                </Button>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

/**
 * 優先度ラベルを取得するヘルパー関数（メモ化）
 */
const getPriorityLabel = (priority: GoalPriority): string => {
  switch (priority) {
    case GoalPriority.LOW:
      return "低優先度";
    case GoalPriority.MEDIUM:
      return "中優先度";
    case GoalPriority.HIGH:
      return "高優先度";
    case GoalPriority.URGENT:
      return "緊急";
    case GoalPriority.CRITICAL:
      return "最重要";
    default:
      return "中優先度";
  }
};

export default Goals;
