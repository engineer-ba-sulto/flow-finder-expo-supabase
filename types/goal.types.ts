/**
 * Goal データ型定義
 * Flow Finder アプリケーションのゴール管理で使用される型定義
 * 
 * @fileoverview パーソナルコーチングアプリ「Flow Finder」のゴール管理機能で使用される
 * 型定義を提供します。TDDアプローチに基づいて設計されており、
 * フリーミアム型アプリの要件に対応しています。
 */

/**
 * ゴールの優先度を表すEnum
 * 
 * Flow Finderでは1-5の数値で優先度を管理し、
 * 点検セッションでの優先度判定に使用されます。
 */
export enum GoalPriority {
  /** 低優先度 - 将来的な目標 */
  LOW = 1,
  /** 中優先度 - 通常の目標 */
  MEDIUM = 2,
  /** 高優先度 - 重要な目標 */
  HIGH = 3,
  /** 緊急 - 近日中に対応が必要 */
  URGENT = 4,
  /** 最重要 - 即座に対応が必要 */
  CRITICAL = 5
}

/**
 * ゴールのステータスを表すEnum
 * 
 * Flow Finderでは3つのステータスでゴールの状態を管理します。
 * 点検セッションでの進捗確認に使用されます。
 */
export enum GoalStatus {
  /** アクティブ - 現在進行中 */
  ACTIVE = 'active',
  /** 完了 - 目標達成済み */
  COMPLETED = 'completed',
  /** 一時停止 - 現在は取り組んでいない */
  PAUSED = 'paused'
}

/**
 * ゴールのメインインターフェース
 * 
 * Flow Finderアプリケーションにおけるゴールの完全な型定義です。
 * Supabaseのgoalsテーブルと対応しており、フリーミアム型アプリの
 * 制限（無料プランでは1件まで）に対応しています。
 */
export interface Goal {
  /** ゴールのユニークID（UUID v4形式、Supabaseで自動生成） */
  id: string;
  
  /** ゴールのタイトル（必須、最大200文字） */
  title: string;
  
  /** ゴールの詳細説明（任意、最大1000文字） */
  description?: string;
  
  /** ゴールの優先度（1-5の数値、デフォルト: MEDIUM） */
  priority: GoalPriority;
  
  /** ゴールのステータス（デフォルト: ACTIVE） */
  status: GoalStatus;
  
  /** 作成日時（Supabaseで自動設定、ISO 8601形式） */
  created_at: Date;
  
  /** 更新日時（Supabaseで自動更新、ISO 8601形式） */
  updated_at: Date;
  
  /** ユーザーID（Supabase Authのuser.id、UUID形式） */
  user_id: string;
}

/**
 * ゴール作成時の入力データ型
 * 
 * 新しいゴールを作成する際に使用される型です。
 * id、created_at、updated_atはSupabaseで自動生成されるため除外されています。
 */
export interface CreateGoalInput {
  /** ゴールのタイトル（必須） */
  title: string;
  
  /** ゴールの詳細説明（任意） */
  description?: string;
  
  /** ゴールの優先度（デフォルト: MEDIUM） */
  priority?: GoalPriority;
  
  /** ユーザーID（Supabase Authから取得） */
  user_id: string;
}

/**
 * ゴール更新時の入力データ型
 * 
 * 既存のゴールを更新する際に使用される型です。
 * 全てのフィールドが任意になっており、部分更新が可能です。
 */
export interface UpdateGoalInput {
  /** ゴールのタイトル（任意） */
  title?: string;
  
  /** ゴールの詳細説明（任意） */
  description?: string;
  
  /** ゴールの優先度（任意） */
  priority?: GoalPriority;
  
  /** ゴールのステータス（任意） */
  status?: GoalStatus;
}

/**
 * ゴール一覧取得時のフィルタ条件
 * 
 * ゴール一覧を取得する際のフィルタリング条件を定義します。
 * Flow Finderでは優先度やステータスによる絞り込みが可能です。
 */
export interface GoalFilter {
  /** ステータスによる絞り込み（任意） */
  status?: GoalStatus;
  
  /** 優先度による絞り込み（任意） */
  priority?: GoalPriority;
  
  /** 作成日時の範囲指定（開始日、任意） */
  created_after?: Date;
  
  /** 作成日時の範囲指定（終了日、任意） */
  created_before?: Date;
}