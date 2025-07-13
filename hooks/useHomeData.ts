import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { getSupabaseClient } from "../lib/supabase";
import { useAuth } from "./useAuth";

// 型定義
interface GoalCountData {
  count: number;
  loading: boolean;
  error: string | null;
}

export function useHomeData() {
  const { user, isAuthenticated } = useAuth();

  // ゴールデータの状態を統合管理
  const [goalData, setGoalData] = useState<GoalCountData>({
    count: 0,
    loading: false,
    error: null,
  });
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // ゴール数を取得する関数をメモ化
  const fetchGoalCount = useCallback(
    async (showRefreshIndicator = false) => {
      if (!isAuthenticated || !user) return;

      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setGoalData((prev) => ({ ...prev, loading: true, error: null }));
      }

      try {
        const supabase = getSupabaseClient();
        const { count, error } = await supabase
          .from("goals")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        if (error) {
          const errorMessage = "ゴール数の取得に失敗しました";
          console.error("ゴール数取得エラー:", error);
          setGoalData((prev) => ({ ...prev, error: errorMessage }));
        } else {
          setGoalData((prev) => ({ ...prev, count: count || 0, error: null }));
        }
      } catch (err) {
        const errorMessage = "通信エラーが発生しました";
        console.error("ゴール数取得エラー:", err);
        setGoalData((prev) => ({ ...prev, error: errorMessage }));
      } finally {
        setGoalData((prev) => ({ ...prev, loading: false }));
        setRefreshing(false);
      }
    },
    [isAuthenticated, user]
  );

  // 初回データ取得
  useEffect(() => {
    fetchGoalCount();
  }, [fetchGoalCount]);

  // 画面がフォーカスされた時にゴール数を再取得（タブ切り替え時の同期）
  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated && user) {
        fetchGoalCount();
      }
    }, [fetchGoalCount, isAuthenticated, user])
  );

  // プルツーリフレッシュハンドラー
  const onRefresh = useCallback(() => {
    fetchGoalCount(true);
  }, [fetchGoalCount]);

  return {
    // ゴールデータ関連
    goalData,
    refreshing,
    onRefresh,
    fetchGoalCount,
  };
}