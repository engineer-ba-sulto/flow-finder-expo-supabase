import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

/**
 * タブレイアウトコンポーネント
 * 
 * Flow Finderアプリのメインナビゲーションを提供します。
 * Refactor Phase: ブランドカラー・アクセシビリティ対応完了 + 認証ガード追加
 */
export default function TabLayout() {
  // 認証チェックを削除し、各画面で個別に認証状態をハンドルするように変更
  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: "#FFC400", // Flow Finder ブランドカラー
        tabBarInactiveTintColor: "#666666", // 非アクティブ時の色
        tabBarStyle: {
          backgroundColor: "#FFFFFF", // タブバー背景色
          borderTopColor: "#E5E5E5", // 上部ボーダー色
          paddingBottom: 8, // アイコンとラベルの間隔調整
          height: 65, // タブバーの高さ
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "ホーム",
          tabBarIcon: ({ color }) => (
            <FontAwesome 
              size={24} 
              name="home" 
              color={color}
              accessibilityLabel="ホームタブ"
            />
          ),
          tabBarAccessibilityLabel: "ホーム画面",
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: "ゴール",
          tabBarIcon: ({ color }) => (
            <FontAwesome 
              size={24} 
              name="bullseye" 
              color={color}
              accessibilityLabel="ゴールタブ"
            />
          ),
          tabBarAccessibilityLabel: "ゴール管理画面",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "設定",
          tabBarIcon: ({ color }) => (
            <FontAwesome 
              size={24} 
              name="cog" 
              color={color}
              accessibilityLabel="設定タブ"
            />
          ),
          tabBarAccessibilityLabel: "設定画面",
        }}
      />
    </Tabs>
  );
}
