import { useRouter } from "expo-router";
import React from "react";
import AuthenticatedHomeScreen from "../../components/home/AuthenticatedHomeScreen";
import ErrorScreen from "../../components/home/ErrorScreen";
import LoadingScreen from "../../components/home/LoadingScreen";
import UnauthenticatedHomeScreen from "../../components/home/UnauthenticatedHomeScreen";
import { useAuth } from "../../hooks/useAuth";
import { useHomeData } from "../../hooks/useHomeData";

export default function HomeScreen() {
  const router = useRouter();
  const { user, loading, error, isAuthenticated } = useAuth();
  const { goalData, refreshing, onRefresh, fetchGoalCount } = useHomeData();

  if (loading) {
    return <LoadingScreen />;
  }
  if (error) {
    return <ErrorScreen error={error} onRetry={fetchGoalCount} />;
  }
  if (isAuthenticated && user) {
    return (
      <AuthenticatedHomeScreen
        goalData={goalData}
        refreshing={refreshing}
        onRefresh={onRefresh}
        fetchGoalCount={fetchGoalCount}
        router={router}
        user={user}
      />
    );
  }
  return <UnauthenticatedHomeScreen router={router} />;
}
