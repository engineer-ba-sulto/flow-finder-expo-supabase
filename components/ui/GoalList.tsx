import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  ActivityIndicator, 
  Pressable, 
  RefreshControl, 
  ScrollView, 
  Text, 
  View 
} from "react-native";
import { router } from "expo-router";
import { Goal, GoalStatus, GoalPriority } from "../../types/goal.types";
import GoalCard from "./GoalCard";
import { useAuth } from "../../hooks/useAuth";
import { getSupabaseClient } from "../../lib/supabase";

interface GoalListProps {
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
}

const GoalList: React.FC<GoalListProps> = React.memo(({ 
  loading = false, 
  error,
  onRefresh 
}) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [sortBy, setSortBy] = useState<'priority' | 'created'>('priority');
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  // ゴールデータの取得（最適化）
  const fetchGoals = useCallback(async () => {
    if (!user?.id) return;

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Date型に変換（エラーハンドリング強化）
      const goalsWithDates = data?.map(goal => {
        try {
          return {
            ...goal,
            created_at: new Date(goal.created_at),
            updated_at: new Date(goal.updated_at),
          };
        } catch (dateError) {
          console.warn("Date conversion error for goal:", goal.id, dateError);
          return {
            ...goal,
            created_at: new Date(),
            updated_at: new Date(),
          };
        }
      }) || [];

      setGoals(goalsWithDates);
    } catch (err) {
      console.error('Failed to fetch goals:', err);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // プルトゥリフレッシュハンドラ（最適化）
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchGoals();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.warn("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchGoals, onRefresh]);

  // ゴールのフィルタリングとソート（メモ化）
  const sortedGoals = useMemo(() => {
    // フィルタリング
    const filteredGoals = goals.filter(goal => {
      if (activeTab === 'active') {
        return goal.status === GoalStatus.ACTIVE;
      } else {
        return goal.status === GoalStatus.COMPLETED;
      }
    });

    // ソート
    return [...filteredGoals].sort((a, b) => {
      if (sortBy === 'priority') {
        // 優先度順（高→中→低）
        return b.priority - a.priority;
      } else {
        // 作成日順（新しい→古い）
        try {
          return b.created_at.getTime() - a.created_at.getTime();
        } catch (error) {
          console.warn("Date comparison error:", error);
          return 0;
        }
      }
    });
  }, [goals, activeTab, sortBy]);

  // ゴール作成ボタンのハンドラ（最適化）
  const handleCreateGoal = useCallback(() => {
    try {
      router.push("/modal/create-goal");
    } catch (error) {
      console.warn("Navigation error:", error);
    }
  }, []);

  // タブ切り替えハンドラ（最適化）
  const handleTabPress = useCallback((tab: 'active' | 'completed') => {
    setActiveTab(tab);
  }, []);

  // ソート切り替えハンドラ（最適化）
  const handleSortPress = useCallback(() => {
    setSortBy(prev => prev === 'priority' ? 'created' : 'priority');
  }, []);

  // ローディング表示
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <ActivityIndicator 
          size="large" 
          color="#FFC400" 
          testID="loading-indicator"
        />
        <Text className="mt-2 text-gray-600">ゴールを読み込み中...</Text>
      </View>
    );
  }

  // エラー表示
  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* タブナビゲーション */}
      <View className="flex-row gap-2 mb-4">
        <Pressable
          onPress={() => handleTabPress('active')}
          style={{ 
            backgroundColor: activeTab === 'active' ? '#FFC400' : '#e5e7eb' 
          }}
          className="flex-1 py-2 px-3 rounded-lg"
          accessibilityRole="tab"
          accessibilityLabel="未達成のゴール一覧"
          testID="active-goals-tab"
        >
          <Text 
            className={`text-sm font-semibold text-center ${
              activeTab === 'active' ? 'text-[#212121]' : 'text-gray-600'
            }`}
          >
            未達成
          </Text>
        </Pressable>
        
        <Pressable
          onPress={() => handleTabPress('completed')}
          style={{ 
            backgroundColor: activeTab === 'completed' ? '#FFC400' : '#e5e7eb' 
          }}
          className="flex-1 py-2 px-3 rounded-lg"
          accessibilityRole="tab"
          accessibilityLabel="達成済みのゴール一覧"
          testID="completed-goals-tab"
        >
          <Text 
            className={`text-sm font-semibold text-center ${
              activeTab === 'completed' ? 'text-[#212121]' : 'text-gray-600'
            }`}
          >
            達成済み
          </Text>
        </Pressable>
      </View>

      {/* ソートボタン */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-sm text-gray-600">
          {sortedGoals.length}件のゴール
        </Text>
        <Pressable
          onPress={handleSortPress}
          className="bg-gray-100 py-1 px-3 rounded-lg"
          testID="sort-by-created-button"
        >
          <Text className="text-xs text-gray-600">
            {sortBy === 'priority' ? '📅 作成日順' : '⭐ 優先度順'}
          </Text>
        </Pressable>
      </View>

      {/* ゴールリスト */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#FFC400"
            testID="refresh-control"
          />
        }
        testID="goal-list-scroll"
      >
        {sortedGoals.length > 0 ? (
          <View className="gap-3">
            {sortedGoals.map((goal, index) => (
              <View key={goal.id} testID={`goal-card-${goal.id}`}>
                <GoalCard goal={goal} />
              </View>
            ))}
          </View>
        ) : (
          // 空状態の表示
          <View className="flex-1 justify-center items-center py-12">
            <Text className="text-6xl mb-4" testID="empty-state-icon">📝</Text>
            <Text className="text-lg font-semibold text-gray-600 mb-2">
              まだゴールが設定されていません
            </Text>
            <Text className="text-sm text-gray-500 text-center">
              最初のゴールを作成してみましょう！
            </Text>
          </View>
        )}

        {/* MVP1段階の表示 */}
        <View className="mt-6 p-3 bg-blue-50 rounded-xl">
          <Text className="text-xs text-blue-600">
            💡 MVP1: 基本CRUD機能のみ実装済み
          </Text>
        </View>
      </ScrollView>

      {/* ゴール作成ボタン */}
      <Pressable
        onPress={handleCreateGoal}
        style={{ backgroundColor: '#FFC400' }}
        className="mt-4 py-3 px-4 rounded-xl"
        accessibilityRole="button"
        accessibilityLabel="新しいゴールを作成する"
        testID="create-goal-button"
      >
        <Text 
          className="text-center font-semibold"
          style={{ color: '#212121' }}
          testID="create-goal-button-text"
        >
          + 新しいゴールを作成
        </Text>
      </Pressable>
    </View>
  );
});

// コンポーネントの表示名を設定（デバッグ用）
GoalList.displayName = 'GoalList';

export default GoalList;