import { SupabaseClient } from "@supabase/supabase-js";
import {
  CreateGoalInput,
  Goal,
  GoalPriority,
  GoalStatus,
} from "../types/goal.types";

/**
 * ゴールサービス
 * Supabaseとの通信処理を担当
 */
export class GoalService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * ゴール一覧を取得
   */
  async getGoals(): Promise<Goal[]> {
    const { data, error } = await this.supabase
      .from("goals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (
      data?.map((goal) => ({
        ...goal,
        created_at: new Date(goal.created_at),
        updated_at: new Date(goal.updated_at),
      })) || []
    );
  }

  /**
   * ゴールを作成
   */
  async createGoal(goalData: CreateGoalInput): Promise<Goal> {
    const { data, error } = await this.supabase
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
      throw error;
    }

    return {
      ...data,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
    };
  }

  /**
   * ゴールを更新
   */
  async updateGoal(goalId: string, goalData: CreateGoalInput): Promise<Goal> {
    const { data, error } = await this.supabase
      .from("goals")
      .update({
        title: goalData.title,
        description: goalData.description,
        priority: goalData.priority,
      })
      .eq("id", goalId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      ...data,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
    };
  }

  /**
   * ゴールを削除
   */
  async deleteGoal(goalId: string): Promise<void> {
    const { error } = await this.supabase
      .from("goals")
      .delete()
      .eq("id", goalId);

    if (error) {
      throw error;
    }
  }
}
