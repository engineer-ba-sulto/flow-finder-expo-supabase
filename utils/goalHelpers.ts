// カテゴリごとのアイコン
const iconMap: { [key: string]: string } = {
  "学習・スキルアップ": "💼",
  "健康・フィットネス": "🏃",
  "仕事・キャリア": "💼",
  "お金・投資": "💰",
};

// 優先度数値→日本語ラベル
const priorityMap: { [key: number]: string } = {
  1: "高",
  2: "中",
  3: "低",
};

/** カテゴリに応じたアイコンを返す */
export const getGoalIcon = (category: string): string =>
  iconMap[category] || "🎯";

/** 優先度数値から日本語ラベルを返す */
export const getPriorityText = (priority: number): string =>
  priorityMap[priority] || "中";
