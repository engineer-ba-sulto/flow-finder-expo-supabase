import { useCallback, useState } from "react";
import { Goal } from "../types/goal.types";

/**
 * UI状態管理用の型定義
 */
export interface UIState {
  showCreateForm: boolean;
  showEditForm: boolean;
  showDeleteDialog: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
}

/**
 * UI状態管理を担当するカスタムフック
 */
export const useGoalsUIState = () => {
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);
  const [uiState, setUIState] = useState<UIState>({
    showCreateForm: false,
    showEditForm: false,
    showDeleteDialog: false,
    isLoading: true,
    isSubmitting: false,
  });

  /**
   * UI状態を更新するヘルパー関数
   */
  const updateUIState = useCallback((updates: Partial<UIState>) => {
    setUIState((prev) => ({ ...prev, ...updates }));
  }, []);

  /**
   * 編集処理を開始
   */
  const startEditing = useCallback(
    (goal: Goal) => {
      setEditingGoal(goal);
      updateUIState({ showEditForm: true });
    },
    [updateUIState]
  );

  /**
   * 削除処理を開始
   */
  const startDeleting = useCallback(
    (goalId: string) => {
      setDeletingGoalId(goalId);
      updateUIState({ showDeleteDialog: true });
    },
    [updateUIState]
  );

  /**
   * フォームをキャンセル
   */
  const cancelForm = useCallback(() => {
    updateUIState({
      showCreateForm: false,
      showEditForm: false,
    });
    setEditingGoal(null);
  }, [updateUIState]);

  /**
   * 削除をキャンセル
   */
  const cancelDelete = useCallback(() => {
    updateUIState({ showDeleteDialog: false });
    setDeletingGoalId(null);
  }, [updateUIState]);

  /**
   * 新規作成を開始
   */
  const startCreating = useCallback(() => {
    updateUIState({ showCreateForm: true });
  }, [updateUIState]);

  return {
    uiState,
    editingGoal,
    deletingGoalId,
    updateUIState,
    startEditing,
    startDeleting,
    cancelForm,
    cancelDelete,
    startCreating,
  };
};
