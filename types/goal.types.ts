/**
 * Goal データ型定義
 * Flow Finder アプリケーションのゴール管理で使用される型定義
 */

/**
 * ゴールの優先度
 */
export enum GoalPriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  URGENT = 4,
  CRITICAL = 5
}

/**
 * ゴールのステータス
 */
export enum GoalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  PAUSED = 'paused'
}

/**
 * ゴールのメインインターフェース
 */
export interface Goal {
  /** ゴールのユニークID（UUID形式） */
  id: string;
  
  /** ゴールのタイトル（必須） */
  title: string;
  
  /** ゴールの詳細説明（任意） */
  description?: string;
  
  /** ゴールの優先度 */
  priority: GoalPriority;
  
  /** ゴールのステータス */
  status: GoalStatus;
  
  /** 作成日時 */
  created_at: Date;
  
  /** 更新日時 */
  updated_at: Date;
  
  /** ユーザーID */
  user_id: string;
}