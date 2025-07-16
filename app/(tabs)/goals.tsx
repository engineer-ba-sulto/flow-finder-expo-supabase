import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { GoalForm } from "../../components/forms/GoalForm";
import { EmptyGoalsMessage } from "../../components/goals/EmptyGoalsMessage";
import { ErrorMessage } from "../../components/goals/ErrorMessage";
import { GoalList } from "../../components/goals/GoalList";
import { GoalsHeader } from "../../components/goals/GoalsHeader";
import { LoadingIndicator } from "../../components/goals/LoadingIndicator";
import { MvpNote } from "../../components/goals/MvpNote";
import { useAuth } from "../../hooks/useAuth";
import { useGoals } from "../../hooks/useGoals";
import { getGoalIcon, getPriorityText } from "../../utils/goalHelpers";
import { GoalStatus } from "../../types/goal.types";

/**
 * ゴール管理画面コンポーネント（段階的復旧中）
 *
 * 安全にゴール管理機能を段階的に復旧しています。
 */
// タブの種類を定義
type TabType = 'uncompleted' | 'completed';

export default function Goals() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  
  // タブ状態管理
  const [activeTab, setActiveTab] = useState<TabType>('uncompleted');

  // useGoalsフックでゴール管理ロジックを取得
  const {
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
  } = useGoals(user, isAuthenticated);

  // ゴール取得（認証済みユーザー）
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);
  
  // タブに応じてゴールをフィルタリング
  const filteredGoals = goals.filter(goal => {
    if (activeTab === 'uncompleted') {
      return goal.status !== GoalStatus.COMPLETED;
    } else {
      return goal.status === GoalStatus.COMPLETED;
    }
  });

  // 認証状態の初期化中はローディング表示
  if (authLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FFC400" />
        <Text className="mt-4 text-gray-600">認証状態を確認中...</Text>
      </View>
    );
  }

  // 未認証時はログイン画面にリダイレクト
  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  // 認証済みユーザー向けの画面
  return (
    <View className="flex-1 bg-white">
      {/* ヘッダー */}
      <GoalsHeader />

      <ScrollView className="flex-1 p-6">
        <View className="mb-4">
          <Text 
            className="text-lg font-bold text-[#212121]"
            accessibilityRole="header"
          >
            ゴール管理
          </Text>
        </View>

        {/* タブ切り替え */}
        <View className="flex-row gap-2 mb-4">
          <Pressable
            onPress={() => setActiveTab('uncompleted')}
            className={`flex-1 py-2 px-3 rounded-lg ${
              activeTab === 'uncompleted' 
                ? 'bg-primary' 
                : 'bg-gray-200'
            }`}
            accessibilityRole="button"
            accessibilityLabel="未達成のゴールを表示"
            accessibilityState={{ selected: activeTab === 'uncompleted' }}
            testID="uncompleted-tab"
          >
            <Text className={`text-sm font-semibold text-center ${
              activeTab === 'uncompleted'
                ? 'text-secondary'
                : 'text-secondary'
            }`}>
              未達成
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('completed')}
            className={`flex-1 py-2 px-3 rounded-lg ${
              activeTab === 'completed' 
                ? 'bg-primary' 
                : 'bg-gray-200'
            }`}
            accessibilityRole="button"
            accessibilityLabel="達成済みのゴールを表示"
            accessibilityState={{ selected: activeTab === 'completed' }}
            testID="completed-tab"
          >
            <Text className={`text-sm font-semibold text-center ${
              activeTab === 'completed'
                ? 'text-secondary'
                : 'text-secondary'
            }`}>
              達成済み
            </Text>
          </Pressable>
        </View>

        {/* ゴール一覧 */}
        {!isLoading && !error && filteredGoals.length > 0 && (
          <GoalList
            goals={filteredGoals}
            onOptionsPress={showGoalOptions}
            getGoalIcon={getGoalIcon}
            getPriorityText={getPriorityText}
          />
        )}

        {/* データなしの場合 */}
        {!isLoading && !error && filteredGoals.length === 0 && goals.length > 0 && (
          <View className="flex-1 justify-center items-center py-12">
            <Text className="text-6xl mb-4">
              {activeTab === 'uncompleted' ? '🎯' : '🏆'}
            </Text>
            <Text className="text-lg font-semibold text-gray-700 mb-2">
              {activeTab === 'uncompleted' ? '未達成のゴールがありません' : '達成済みのゴールがありません'}
            </Text>
            <Text className="text-sm text-gray-500 text-center">
              {activeTab === 'uncompleted' 
                ? '新しいゴールを追加して目標を設定しましょう！' 
                : 'ゴールを達成してここに表示させましょう！'
              }
            </Text>
          </View>
        )}

        {/* 全体でデータなしの場合 */}
        {!isLoading && !error && goals.length === 0 && <EmptyGoalsMessage />}

        {/* MVP1段目注記エリア */}
        <MvpNote />

        {/* ゴール作成フォーム */}
        {showCreateForm && (
          <View className="mt-6 bg-white rounded-xl p-6 shadow-sm">
            <Text className="text-lg font-bold text-[#212121] mb-4 text-center">
              新しいゴール
            </Text>
            <GoalForm
              onSubmit={createGoal}
              onCancel={resetForm}
              isSubmitting={isCreating}
            />
          </View>
        )}

        {/* ゴール編集フォーム */}
        {showEditForm && editingGoal && (
          <View className="mt-6 bg-white rounded-xl p-6 shadow-sm">
            <Text className="text-lg font-bold text-[#212121] mb-4 text-center">
              ゴール編集
            </Text>
            <GoalForm
              onSubmit={updateGoal}
              onCancel={resetEditForm}
              initialGoal={editingGoal}
              isSubmitting={isUpdating}
            />
          </View>
        )}

        {/* エラー表示 */}
        {error && <ErrorMessage message={error} />}

        {/* ローディング表示 */}
        {isLoading && <LoadingIndicator />}
      </ScrollView>
    </View>
  );
}
