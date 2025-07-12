import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { getSupabaseClient } from "../lib/supabase";
import { GoalService } from "../services/goalService";
import { CreateGoalInput, Goal } from "../types/goal.types";

/**
 * エラー処理用の型定義
 */
interface ErrorState {
  message: string;
  action?: string;
}

/**
 * ゴール管理の業務ロジックを担当するカスタムフック
 */
export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [error, setError] = useState<ErrorState | null>(null);

  // Supabaseクライアントとサービスの初期化（メモ化）
  const supabase = useMemo(() => getSupabaseClient(), []);
  const goalService = useMemo(() => new GoalService(supabase), [supabase]);

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
  const loadGoals = useCallback(async (): Promise<boolean> => {
    try {
      clearError();
      const goalList = await goalService.getGoals();
      setGoals(goalList);
      return true;
    } catch (error) {
      handleError(error, "ゴールの読み込み");
      return false;
    }
  }, [goalService, clearError, handleError]);

  /**
   * ゴール作成処理
   */
  const createGoal = useCallback(
    async (goalData: CreateGoalInput): Promise<boolean> => {
      try {
        clearError();
        const newGoal = await goalService.createGoal(goalData);
        setGoals((prev) => [newGoal, ...prev]);
        Alert.alert("成功", "ゴールが作成されました。");
        return true;
      } catch (error) {
        handleError(error, "ゴールの作成");
        return false;
      }
    },
    [goalService, clearError, handleError]
  );

  /**
   * ゴール更新処理
   */
  const updateGoal = useCallback(
    async (goalId: string, goalData: CreateGoalInput): Promise<boolean> => {
      try {
        clearError();
        const updatedGoal = await goalService.updateGoal(goalId, goalData);
        setGoals((prev) =>
          prev.map((goal) => (goal.id === goalId ? updatedGoal : goal))
        );
        Alert.alert("成功", "ゴールが更新されました。");
        return true;
      } catch (error) {
        handleError(error, "ゴールの更新");
        return false;
      }
    },
    [goalService, clearError, handleError]
  );

  /**
   * ゴール削除処理
   */
  const deleteGoal = useCallback(
    async (goalId: string): Promise<boolean> => {
      try {
        clearError();
        await goalService.deleteGoal(goalId);
        setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
        Alert.alert("成功", "ゴールが削除されました。");
        return true;
      } catch (error) {
        handleError(error, "ゴールの削除");
        return false;
      }
    },
    [goalService, clearError, handleError]
  );

  return {
    goals,
    error,
    loadGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    clearError,
  };
};
