import { Redirect } from "expo-router";
import React, { useEffect } from "react";
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

/**
 * ゴール管理画面コンポーネント（段階的復旧中）
 *
 * 安全にゴール管理機能を段階的に復旧しています。
 */
export default function Goals() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();

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
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-[#212121]">ゴール管理</Text>
          <Pressable
            onPress={() => setShowCreateForm(true)}
            className="bg-[#FFC400] text-[#212121] text-sm font-semibold py-2 px-3 rounded-lg"
            accessibilityRole="button"
            testID="add-goal-button"
          >
            <Text className="text-[#212121] font-semibold">+ 追加</Text>
          </Pressable>
        </View>

        {/* ゴール一覧 */}
        {!isLoading && !error && goals.length > 0 && (
          <GoalList
            goals={goals}
            onOptionsPress={showGoalOptions}
            getGoalIcon={getGoalIcon}
            getPriorityText={getPriorityText}
          />
        )}

        {/* データなしの場合 */}
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
