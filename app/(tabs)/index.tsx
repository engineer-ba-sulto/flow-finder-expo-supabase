import { useRouter } from "expo-router";
import React, { useState } from "react";
import AuthenticatedHomeScreen from "../../components/home/AuthenticatedHomeScreen";
import ErrorScreen from "../../components/home/ErrorScreen";
import LoadingScreen from "../../components/home/LoadingScreen";
import UnauthenticatedHomeScreen from "../../components/home/UnauthenticatedHomeScreen";
import { GoalForm } from "../../components/forms/GoalForm";
import { useAuth } from "../../hooks/useAuth";
import { useHomeData } from "../../hooks/useHomeData";
import { useGoals } from "../../hooks/useGoals";
import { View, Text, Modal } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { user, loading, error, isAuthenticated } = useAuth();
  const { goalData, refreshing, onRefresh, fetchGoalCount } = useHomeData();
  
  // ゴール作成フォーム表示状態
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // useGoalsフックでゴール作成機能を取得
  const { isCreating, createGoal } = useGoals(user, isAuthenticated);
  
  // ゴール作成ボタンのハンドラ
  const handleCreateGoal = () => {
    setShowCreateForm(true);
  };
  
  // ゴール作成完了・キャンセル時のハンドラ
  const handleFormClose = () => {
    setShowCreateForm(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }
  if (error) {
    return <ErrorScreen error={error} onRetry={fetchGoalCount} />;
  }
  if (isAuthenticated && user) {
    return (
      <>
        <AuthenticatedHomeScreen
          goalData={goalData}
          refreshing={refreshing}
          onRefresh={onRefresh}
          fetchGoalCount={fetchGoalCount}
          router={router}
          user={user}
          onCreateGoal={handleCreateGoal}
        />
        
        {/* ゴール作成モーダル */}
        <Modal
          visible={showCreateForm}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={handleFormClose}
        >
          <View className="flex-1 bg-white">
            <View className="bg-primary p-4">
              <Text className="text-xl font-bold text-secondary">➕ ゴール作成</Text>
            </View>
            <View className="flex-1 p-6">
              <Text className="text-lg font-bold text-[#212121] mb-4 text-center">
                新しいゴール
              </Text>
              <GoalForm
                onSubmit={async (goalData) => {
                  await createGoal(goalData);
                  handleFormClose();
                  onRefresh(); // ホーム画面を更新
                }}
                onCancel={handleFormClose}
                isSubmitting={isCreating}
              />
            </View>
          </View>
        </Modal>
      </>
    );
  }
  return <UnauthenticatedHomeScreen router={router} />;
}
