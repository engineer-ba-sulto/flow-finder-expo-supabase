import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { getSupabaseClient } from "../lib/supabase";
import { CreateGoalInput } from "../types/goal.types";

export const useGoals = (user: any, isAuthenticated: boolean) => {
  // ローカル状態管理
  const [isLoading, setIsLoading] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ゴール作成フォーム関連
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // ゴール編集フォーム関連
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // ゴール取得
  const fetchGoals = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    setIsLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseClient();
      const { data, error: fetchError } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (fetchError) {
        setError("ゴールの取得に失敗しました");
        setGoals([]);
      } else {
        setGoals(data || []);
      }
    } catch (err) {
      setError("通信エラーが発生しました");
      setGoals([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // ゴール作成
  const createGoal = useCallback(
    async (goalData: CreateGoalInput) => {
      if (!isAuthenticated || !user) {
        Alert.alert("エラー", "認証が必要です");
        return;
      }
      setIsCreating(true);
      try {
        const supabase = getSupabaseClient();
        const { error: tableError } = await supabase
          .from("goals")
          .select("count", { count: "exact", head: true });
        if (tableError) {
          if (tableError.code === "42P01") {
            Alert.alert(
              "テーブルが存在しません",
              "goalsテーブルが作成されていません。\n\nSupabaseダッシュボードで以下のSQLを実行してください：\n\nCREATE TABLE goals (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id UUID REFERENCES users(id),\n  title TEXT NOT NULL,\n  description TEXT,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);"
            );
            return;
          }
        }
        const { data: existingUser, error: userCheckError } = await supabase
          .from("users")
          .select("id")
          .eq("id", user.id)
          .single();
        if (userCheckError && userCheckError.code !== "PGRST116") {
          Alert.alert(
            "エラー",
            `ユーザー確認に失敗しました: ${userCheckError.message}`
          );
          return;
        }
        if (!existingUser) {
          const { error: createUserError } = await supabase
            .from("users")
            .insert([
              {
                id: user.id,
                email: user.email,
              },
            ]);
          if (createUserError) {
            Alert.alert(
              "エラー",
              `ユーザーの作成に失敗しました: ${createUserError.message}`
            );
            return;
          }
        }
        const finalGoalData = {
          ...goalData,
          user_id: user.id,
        };
        const { error: createError } = await supabase
          .from("goals")
          .insert([finalGoalData])
          .select();
        if (createError) {
          let errorMessage = `ゴールの作成に失敗しました\n\n詳細: ${
            createError.message || createError.toString()
          }`;
          if (createError.code === "23503") {
            errorMessage += `\n\n🔧 解決策：\n1. Supabaseダッシュボードで以下のSQLを実行：\n   ALTER TABLE goals DROP CONSTRAINT goals_user_id_fkey;\n\n2. または外部キー参照を変更：\n   ALTER TABLE goals ADD CONSTRAINT goals_user_id_fkey \n   FOREIGN KEY (user_id) REFERENCES users(id);`;
          }
          Alert.alert("エラー", errorMessage);
        } else {
          setShowCreateForm(false);
          Alert.alert("成功", "ゴールを作成しました");
          await fetchGoals();
        }
      } catch (err) {
        Alert.alert("エラー", "通信エラーが発生しました");
      } finally {
        setIsCreating(false);
      }
    },
    [isAuthenticated, user, fetchGoals]
  );

  // ゴール更新
  const updateGoal = useCallback(
    async (goalData: CreateGoalInput) => {
      if (!isAuthenticated || !user || !editingGoal) {
        Alert.alert("エラー", "更新対象のゴールが見つかりません");
        return;
      }
      setIsUpdating(true);
      try {
        const supabase = getSupabaseClient();
        const updateData = {
          title: goalData.title,
          description: goalData.description || null,
          priority: goalData.priority,
          updated_at: new Date().toISOString(),
        };
        const { error: updateError } = await supabase
          .from("goals")
          .update(updateData)
          .eq("id", editingGoal.id)
          .eq("user_id", user.id)
          .select();
        if (updateError) {
          Alert.alert(
            "エラー",
            `ゴールの更新に失敗しました: ${updateError.message}`
          );
        } else {
          resetEditForm();
          Alert.alert("成功", "ゴールを更新しました");
          await fetchGoals();
        }
      } catch (err) {
        Alert.alert("エラー", "通信エラーが発生しました");
      } finally {
        setIsUpdating(false);
      }
    },
    [isAuthenticated, user, editingGoal, fetchGoals]
  );

  // ゴール削除
  const deleteGoal = useCallback(
    async (goal: any) => {
      if (!isAuthenticated || !user || !goal) return;
      Alert.alert(
        "ゴールを削除",
        `本当に「${goal.title}」を削除しますか？この操作は取り消せません。`,
        [
          {
            text: "キャンセル",
            style: "cancel",
          },
          {
            text: "削除",
            style: "destructive",
            onPress: async () => {
              try {
                const supabase = getSupabaseClient();
                const { error: deleteError } = await supabase
                  .from("goals")
                  .delete()
                  .eq("id", goal.id)
                  .eq("user_id", user.id);
                if (deleteError) {
                  Alert.alert(
                    "エラー",
                    `ゴールの削除に失敗しました: ${deleteError.message}`
                  );
                } else {
                  Alert.alert("成功", "ゴールを削除しました");
                  await fetchGoals();
                }
              } catch (err) {
                Alert.alert("エラー", "通信エラーが発生しました");
              }
            },
          },
        ]
      );
    },
    [isAuthenticated, user, fetchGoals]
  );

  // 編集開始
  const startEditGoal = useCallback((goal: any) => {
    setEditingGoal(goal);
    setShowEditForm(true);
    setShowCreateForm(false);
  }, []);

  // ゴールオプション表示
  const showGoalOptions = useCallback(
    (goal: any) => {
      Alert.alert(goal.title, "ゴールの操作を選択してください", [
        {
          text: "編集",
          onPress: () => startEditGoal(goal),
        },
        {
          text: "削除",
          style: "destructive",
          onPress: () => deleteGoal(goal),
        },
        {
          text: "キャンセル",
          style: "cancel",
        },
      ]);
    },
    [startEditGoal, deleteGoal]
  );

  // フォームリセット
  const resetForm = useCallback(() => {
    setShowCreateForm(false);
  }, []);

  // 編集フォームリセット
  const resetEditForm = useCallback(() => {
    setEditingGoal(null);
    setShowEditForm(false);
  }, []);

  return {
    isLoading,
    goals,
    error,
    showCreateForm,
    setShowCreateForm,
    isCreating,
    createGoal,
    showEditForm,
    editingGoal,
    startEditGoal,
    resetEditForm,
    isUpdating,
    updateGoal,
    deleteGoal,
    showGoalOptions,
    fetchGoals,
    resetForm,
  };
};
