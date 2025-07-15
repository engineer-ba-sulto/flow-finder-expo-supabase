import { useState, useCallback } from "react";
import { router } from "expo-router";
import { Goal } from "../types/goal.types";

/**
 * ゴール完了モーダルのビジネスロジックを管理するカスタムフック
 * 
 * @fileoverview ゴール達成時の振り返り入力、期間計算、
 * ナビゲーション処理を管理するカスタムフック
 */

export interface UseGoalCompletionReturn {
  /** 振り返りテキストの状態 */
  reflection: string;
  /** 振り返りテキストの更新関数 */
  setReflection: (text: string) => void;
  /** ゴール期間（日数）の計算結果 */
  duration: number;
  /** ゴール開始日（ローカライズ済み） */
  startDate: string;
  /** ゴール完了日（ローカライズ済み） */
  completionDate: string;
  /** 成果共有のハンドラー */
  handleShareAchievement: () => void;
  /** 次のゴール設定のハンドラー */
  handleNextGoal: () => void;
  /** 後で設定のハンドラー */
  handleLater: () => void;
}

/**
 * ゴール完了モーダルのビジネスロジックを提供するカスタムフック
 * 
 * @param goal - 完了したゴールのデータ
 * @returns ゴール完了モーダルで使用する状態と関数
 * 
 * @example
 * ```tsx
 * const goalCompletionLogic = useGoalCompletion(goal);
 * 
 * return (
 *   <GoalCompletionModal
 *     reflection={goalCompletionLogic.reflection}
 *     onReflectionChange={goalCompletionLogic.setReflection}
 *     // ... その他のprops
 *   />
 * );
 * ```
 */
export function useGoalCompletion(goal: Goal): UseGoalCompletionReturn {
  const [reflection, setReflection] = useState("");

  /**
   * ゴール開始から完了までの期間を計算する
   * 
   * @returns 期間（日数）
   */
  const calculateDuration = useCallback((): number => {
    const createdAt = new Date(goal.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [goal.created_at]);

  /**
   * 日付を日本語形式でフォーマットする
   * 
   * @param date - フォーマットする日付
   * @returns 日本語形式の日付文字列
   */
  const formatDateJa = useCallback((date: Date): string => {
    return date.toLocaleDateString("ja-JP");
  }, []);

  const duration = calculateDuration();
  const startDate = formatDateJa(new Date(goal.created_at));
  const completionDate = formatDateJa(new Date());

  /**
   * 成果共有ボタンのハンドラー
   * TODO: 将来的にシェア機能を実装
   */
  const handleShareAchievement = useCallback(() => {
    console.log("成果をシェア");
    // TODO: 共有機能の実装
    // - ゴールタイトル、期間、振り返りをシェア
    // - SNSシェア機能の統合
  }, []);

  /**
   * 次のゴール設定ボタンのハンドラー
   * ゴール作成モーダルに遷移する
   */
  const handleNextGoal = useCallback(() => {
    router.push("/modal/create-goal");
  }, []);

  /**
   * 後で設定リンクのハンドラー
   * モーダルを閉じる
   */
  const handleLater = useCallback(() => {
    router.back();
  }, []);

  return {
    reflection,
    setReflection,
    duration,
    startDate,
    completionDate,
    handleShareAchievement,
    handleNextGoal,
    handleLater,
  };
}