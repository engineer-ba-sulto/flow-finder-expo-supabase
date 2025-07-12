import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { GoalForm } from '../../components/forms/GoalForm';
import { Goal, CreateGoalInput, GoalStatus, GoalPriority } from '../../types/goal.types';
import { getSupabaseClient } from '../../lib/supabase';

/**
 * ゴール管理画面コンポーネント
 * 
 * ゴールのCRUD操作を提供する画面です。
 * Green Phase: テストを通す最小実装
 */
export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);

  const supabase = getSupabaseClient();

  // ゴール一覧を取得
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('ゴール取得エラー:', error);
        return;
      }

      const formattedGoals: Goal[] = data?.map(goal => ({
        ...goal,
        created_at: new Date(goal.created_at),
        updated_at: new Date(goal.updated_at)
      })) || [];

      setGoals(formattedGoals);
    } catch (error) {
      console.error('ゴール読み込みエラー:', error);
    }
  };

  // ゴール作成処理
  const handleCreateGoal = async (goalData: CreateGoalInput) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert([{
          ...goalData,
          status: GoalStatus.ACTIVE,
          priority: goalData.priority || GoalPriority.MEDIUM
        }])
        .select()
        .single();

      if (error) {
        console.error('ゴール作成エラー:', error);
        return;
      }

      if (data) {
        const newGoal: Goal = {
          ...data,
          created_at: new Date(data.created_at),
          updated_at: new Date(data.updated_at)
        };
        setGoals(prev => [newGoal, ...prev]);
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('ゴール作成エラー:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ゴール更新処理
  const handleUpdateGoal = async (goalData: CreateGoalInput) => {
    if (!editingGoal) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('goals')
        .update({
          title: goalData.title,
          description: goalData.description,
          priority: goalData.priority
        })
        .eq('id', editingGoal.id)
        .select()
        .single();

      if (error) {
        console.error('ゴール更新エラー:', error);
        return;
      }

      if (data) {
        const updatedGoal: Goal = {
          ...data,
          created_at: new Date(data.created_at),
          updated_at: new Date(data.updated_at)
        };
        setGoals(prev => prev.map(goal => 
          goal.id === editingGoal.id ? updatedGoal : goal
        ));
        setShowEditForm(false);
        setEditingGoal(null);
      }
    } catch (error) {
      console.error('ゴール更新エラー:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ゴール削除処理
  const handleDeleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId);

      if (error) {
        console.error('ゴール削除エラー:', error);
        return;
      }

      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      setShowDeleteDialog(false);
      setDeletingGoalId(null);
    } catch (error) {
      console.error('ゴール削除エラー:', error);
    }
  };

  // 編集ボタン押下時
  const handleEditPress = (goal: Goal) => {
    setEditingGoal(goal);
    setShowEditForm(true);
  };

  // 削除ボタン押下時
  const handleDeletePress = (goalId: string) => {
    setDeletingGoalId(goalId);
    setShowDeleteDialog(true);
  };

  // 削除確認ダイアログの処理
  const confirmDelete = () => {
    if (deletingGoalId) {
      handleDeleteGoal(deletingGoalId);
    }
  };

  // フォームキャンセル処理
  const handleCancelForm = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setEditingGoal(null);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* ヘッダー */}
        <Text className="text-2xl font-bold mb-6 text-gray-800">ゴール管理</Text>

        {/* 新規作成ボタン */}
        <View className="mb-6">
          <Button
            variant="primary"
            onPress={() => setShowCreateForm(true)}
            disabled={showCreateForm || showEditForm}
          >
            新しいゴールを作成
          </Button>
        </View>

        {/* ゴール作成フォーム */}
        {showCreateForm && (
          <View className="mb-6">
            <GoalForm
              onSubmit={handleCreateGoal}
              onCancel={handleCancelForm}
              isSubmitting={isSubmitting}
            />
          </View>
        )}

        {/* ゴール編集フォーム */}
        {showEditForm && editingGoal && (
          <View className="mb-6">
            <GoalForm
              onSubmit={handleUpdateGoal}
              onCancel={handleCancelForm}
              initialGoal={editingGoal}
              isSubmitting={isSubmitting}
            />
          </View>
        )}

        {/* ゴール一覧 */}
        <View>
          {goals.length === 0 ? (
            <View className="text-center py-8">
              <Text className="text-lg text-gray-600 mb-2">まだゴールがありません</Text>
              <Text className="text-gray-500">最初のゴールを作成してみましょう</Text>
            </View>
          ) : (
            goals.map((goal, index) => (
              <View key={goal.id} className="mb-4">
                <Card>
                  <View className="p-4">
                    <Text className="text-lg font-semibold mb-2">{goal.title}</Text>
                    {goal.description && (
                      <Text className="text-gray-600 mb-3">{goal.description}</Text>
                    )}
                    <Text className="text-sm text-gray-500 mb-3">
                      優先度: {getPriorityLabel(goal.priority)}
                    </Text>
                    <View className="flex-row gap-2">
                      <Button
                        variant="secondary"
                        onPress={() => handleEditPress(goal)}
                        disabled={showCreateForm || showEditForm}
                      >
                        編集
                      </Button>
                      <Button
                        variant="secondary"
                        onPress={() => handleDeletePress(goal.id)}
                        disabled={showCreateForm || showEditForm}
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
        {showDeleteDialog && (
          <View className="absolute inset-0 bg-black/50 justify-center items-center">
            <View className="bg-white p-6 rounded-lg mx-4 w-full max-w-sm">
              <Text className="text-lg font-semibold mb-4">確認</Text>
              <Text className="text-gray-600 mb-6">
                このゴールを削除してもよろしいですか？
              </Text>
              <View className="flex-row gap-4">
                <Button
                  variant="secondary"
                  onPress={() => {
                    setShowDeleteDialog(false);
                    setDeletingGoalId(null);
                  }}
                  className="flex-1"
                >
                  キャンセル
                </Button>
                <Button
                  variant="primary"
                  onPress={confirmDelete}
                  className="flex-1"
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
}

// 優先度ラベルを取得するヘルパー関数
function getPriorityLabel(priority: GoalPriority): string {
  switch (priority) {
    case GoalPriority.LOW:
      return '低優先度';
    case GoalPriority.MEDIUM:
      return '中優先度';
    case GoalPriority.HIGH:
      return '高優先度';
    case GoalPriority.URGENT:
      return '緊急';
    case GoalPriority.CRITICAL:
      return '最重要';
    default:
      return '中優先度';
  }
}