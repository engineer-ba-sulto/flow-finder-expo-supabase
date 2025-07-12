import React, { useCallback, useEffect } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { GoalForm } from "../../components/forms/GoalForm";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useGoals } from "../../hooks/useGoals";
import { useGoalsUIState } from "../../hooks/useGoalsUIState";
import { CreateGoalInput } from "../../types/goal.types";
import { getPriorityLabel } from "../../utils/goalHelpers";

/**
 * ゴール管理画面コンポーネント
 *
 * ゴールのCRUD操作を提供する画面です。
 * Refactor Phase: リファクタリング完了 - カスタムフックとサービスに分離
 */
const Goals: React.FC = () => {
  // カスタムフックの使用
  const { goals, loadGoals, createGoal, updateGoal, deleteGoal } = useGoals();

  const {
    uiState,
    editingGoal,
    deletingGoalId,
    updateUIState,
    startEditing,
    startDeleting,
    cancelForm,
    cancelDelete,
    startCreating,
  } = useGoalsUIState();

  // 初回データ取得
  useEffect(() => {
    const loadData = async () => {
      updateUIState({ isLoading: true });
      await loadGoals();
      updateUIState({ isLoading: false });
    };
    loadData();
  }, [loadGoals, updateUIState]);

  /**
   * ゴール作成処理
   */
  const handleCreateGoal = useCallback(
    async (goalData: CreateGoalInput) => {
      updateUIState({ isSubmitting: true });
      const success = await createGoal(goalData);
      updateUIState({ isSubmitting: false });
      if (success) {
        updateUIState({ showCreateForm: false });
      }
    },
    [createGoal, updateUIState]
  );

  /**
   * ゴール更新処理
   */
  const handleUpdateGoal = useCallback(
    async (goalData: CreateGoalInput) => {
      if (!editingGoal) return;

      updateUIState({ isSubmitting: true });
      const success = await updateGoal(editingGoal.id, goalData);
      updateUIState({ isSubmitting: false });
      if (success) {
        updateUIState({ showEditForm: false });
      }
    },
    [editingGoal, updateGoal, updateUIState]
  );

  /**
   * 削除確認処理
   */
  const confirmDelete = useCallback(async () => {
    if (!deletingGoalId) return;

    const success = await deleteGoal(deletingGoalId);
    if (success) {
      cancelDelete();
    }
  }, [deletingGoalId, deleteGoal, cancelDelete]);

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
            onPress={startCreating}
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
              onCancel={cancelForm}
              isSubmitting={uiState.isSubmitting}
            />
          </View>
        )}

        {/* ゴール編集フォーム */}
        {uiState.showEditForm && editingGoal && (
          <View className="mb-6">
            <GoalForm
              onSubmit={handleUpdateGoal}
              onCancel={cancelForm}
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
                        onPress={() => startEditing(goal)}
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
                        onPress={() => startDeleting(goal.id)}
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
                  onPress={cancelDelete}
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

export default Goals;
