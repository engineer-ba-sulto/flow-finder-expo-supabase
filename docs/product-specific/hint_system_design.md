# ヒント集システム詳細設計

## 概要

無料プランでのヒント集は、**Step 2 の原因入力**を分析して適切なカテゴリを優先表示するシステムです。AI 機能がなくても、ユーザーの状況に応じた適切なヒントを提供します。

## 💡 システム設計

### Phase 1: 基本実装（静的分析）

#### 1. キーワードマッピング

| カテゴリ              | キーワード例                           | 表示される解決策                                         |
| --------------------- | -------------------------------------- | -------------------------------------------------------- |
| **📅 時間管理**       | 時間がない、忙しい、締切、スケジュール | 15 分だけ取り組む、朝の 30 分を確保、通勤時間を活用      |
| **🏠 環境設定**       | 場所がない、集中できない、道具がない   | 専用の場所を作る、必要な道具を準備、集中環境を作る       |
| **👥 仲間・サポート** | 一人で難しい、孤独、相談相手がいない   | 友人に宣言する、コミュニティに参加、家族に協力依頼       |
| **🎯 モチベーション** | やる気がない、飽きる、続かない         | 小さなご褒美、達成感を記録、進捗を可視化                 |
| **📚 スキル・知識**   | 分からない、難しい、方法が不明         | 基本から学ぶ、簡単なものから始める、チュートリアルを見る |
| **😰 心理的障壁**     | 恐い、不安、完璧主義                   | 小さく始める、失敗を許可、プロセスを重視                 |

#### 2. 判断ロジック

```typescript
interface HintCategory {
  id: string;
  name: string;
  icon: string;
  keywords: string[];
  hints: Hint[];
}

interface Hint {
  id: string;
  title: string;
  description: string;
  priority: number;
  tags: string[];
}

// 原因分析とカテゴリ判定
function analyzeBottleneck(cause: string): HintCategory[] {
  const categories: HintCategory[] = [
    {
      id: "time_management",
      name: "時間管理",
      icon: "📅",
      keywords: ["時間", "忙しい", "締切", "スケジュール", "遅い"],
      hints: [
        {
          id: "time_1",
          title: "朝の15分だけ取り組む",
          description: "朝起きてすぐの15分を確保",
          priority: 1,
          tags: ["時間", "朝"],
        },
        {
          id: "time_2",
          title: "通勤時間を活用する",
          description: "電車やバスでの移動時間を学習時間に",
          priority: 2,
          tags: ["時間", "通勤"],
        },
        {
          id: "time_3",
          title: "昼休みの5分だけ",
          description: "休憩時間の最初の5分だけ取り組む",
          priority: 3,
          tags: ["時間", "昼休み"],
        },
      ],
    },
    {
      id: "environment",
      name: "環境設定",
      icon: "🏠",
      keywords: ["場所", "集中", "道具", "環境", "設備"],
      hints: [
        {
          id: "env_1",
          title: "専用の場所を作る",
          description: "学習や作業専用のスペースを確保",
          priority: 1,
          tags: ["場所", "環境"],
        },
        {
          id: "env_2",
          title: "必要な道具を準備",
          description: "必要なものを事前に準備しておく",
          priority: 2,
          tags: ["道具", "準備"],
        },
        {
          id: "env_3",
          title: "集中できる環境を作る",
          description: "通知をオフにして集中環境を作る",
          priority: 3,
          tags: ["集中", "環境"],
        },
      ],
    },
    {
      id: "motivation",
      name: "モチベーション",
      icon: "🎯",
      keywords: ["やる気", "飽きる", "続かない", "モチベーション", "気分"],
      hints: [
        {
          id: "mot_1",
          title: "小さなご褒美を設定",
          description: "目標達成時の小さなご褒美を決める",
          priority: 1,
          tags: ["ご褒美", "モチベーション"],
        },
        {
          id: "mot_2",
          title: "達成感を記録する",
          description: "小さな達成を記録して可視化",
          priority: 2,
          tags: ["達成", "記録"],
        },
        {
          id: "mot_3",
          title: "進捗を可視化する",
          description: "カレンダーやグラフで進捗を見える化",
          priority: 3,
          tags: ["進捗", "可視化"],
        },
      ],
    },
    {
      id: "skill",
      name: "スキル・知識",
      icon: "📚",
      keywords: ["分からない", "難しい", "方法", "知識", "スキル"],
      hints: [
        {
          id: "skill_1",
          title: "基本から学ぶ",
          description: "基礎的な内容から順番に学習",
          priority: 1,
          tags: ["基本", "学習"],
        },
        {
          id: "skill_2",
          title: "簡単なものから始める",
          description: "最も簡単な部分から開始",
          priority: 2,
          tags: ["簡単", "開始"],
        },
        {
          id: "skill_3",
          title: "チュートリアルを見る",
          description: "動画やガイドを活用",
          priority: 3,
          tags: ["チュートリアル", "ガイド"],
        },
      ],
    },
    {
      id: "psychological",
      name: "心理的障壁",
      icon: "😰",
      keywords: ["恐い", "不安", "完璧", "心配", "緊張"],
      hints: [
        {
          id: "psy_1",
          title: "小さく始める",
          description: "完璧を目指さず小さく始める",
          priority: 1,
          tags: ["小さく", "開始"],
        },
        {
          id: "psy_2",
          title: "失敗を許可する",
          description: "失敗してもOKという気持ちで取り組む",
          priority: 2,
          tags: ["失敗", "許可"],
        },
        {
          id: "psy_3",
          title: "プロセスを重視",
          description: "結果よりもプロセスを大切にする",
          priority: 3,
          tags: ["プロセス", "重視"],
        },
      ],
    },
    {
      id: "support",
      name: "仲間・サポート",
      icon: "👥",
      keywords: ["一人", "孤独", "相談", "協力", "サポート"],
      hints: [
        {
          id: "sup_1",
          title: "友人に宣言する",
          description: "目標を友人に宣言してサポートを得る",
          priority: 1,
          tags: ["友人", "宣言"],
        },
        {
          id: "sup_2",
          title: "コミュニティに参加",
          description: "オンラインコミュニティに参加",
          priority: 2,
          tags: ["コミュニティ", "参加"],
        },
        {
          id: "sup_3",
          title: "家族に協力依頼",
          description: "家族にサポートを依頼",
          priority: 3,
          tags: ["家族", "協力"],
        },
      ],
    },
  ];

  const matchedCategories: string[] = [];

  categories.forEach((category) => {
    if (category.keywords.some((keyword) => cause.includes(keyword))) {
      matchedCategories.push(category.id);
    }
  });

  // マッチしたカテゴリを優先返却、その他は後続
  const prioritizedCategories = categories.filter((cat) =>
    matchedCategories.includes(cat.id)
  );
  const otherCategories = categories.filter(
    (cat) => !matchedCategories.includes(cat.id)
  );

  return [...prioritizedCategories, ...otherCategories];
}
```

#### 3. 実際の表示例

**入力例**: 「時間がなくて英語学習が進まない」

```
📊 Step 4: 小さな一歩の決定
┌─────────────────────────────────────┐
│ 解消するための「小さな一歩」は？    │
│                                     │
│ 🎯 あなたの状況に最適なヒント:      │
│ ├ 📅 時間管理 (最適)                │
│ │  └ ✨ 朝の15分だけ英語アプリを開く │
│ │  └ ✨ 通勤時間にポッドキャストを聞く │
│ │  └ ✨ 昼休みの5分だけ単語を覚える  │
│ │                                  │
│ └ 📋 その他のヒント:                │
│   ├ 🏠 環境設定                    │
│   │  └ スマホに英語アプリを配置     │
│   │  └ 英語学習専用の時間を作る     │
│   │                                │
│   └ 🎯 モチベーション              │
│     └ 1日1単語覚えたらご褒美       │
│     └ 進捗をカレンダーに記録       │
│                                     │
│ ✏️ 自分で小さな一歩を入力:          │
│ ┌─────────────────────────────────┐ │
│ │ 朝の通勤時間に英語を5分だけ聞く │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## 🗄️ データベース設計

### ヒント集テーブル

```sql
-- ヒント集テーブル
CREATE TABLE hints (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL, -- 'time_management', 'environment', etc.
  title VARCHAR(100) NOT NULL,
  description TEXT,
  keywords TEXT[], -- 関連キーワード配列
  priority INTEGER DEFAULT 0, -- 表示優先度
  tags TEXT[], -- タグ配列
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ヒント使用履歴テーブル
CREATE TABLE hint_usage (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  hint_id INTEGER REFERENCES hints(id),
  session_id UUID, -- 点検セッションID
  is_helpful BOOLEAN, -- 役に立ったかのフィードバック
  created_at TIMESTAMP DEFAULT NOW()
);

-- 初期データ投入
INSERT INTO hints (category, title, description, keywords, priority, tags) VALUES
-- 時間管理
('time_management', '朝の15分だけ取り組む', '朝起きてすぐの15分を確保して取り組む', ARRAY['時間', '忙しい', '朝'], 1, ARRAY['時間', '朝']),
('time_management', '通勤時間を活用する', '電車やバスでの移動時間を学習時間に変える', ARRAY['時間', '通勤', '移動'], 2, ARRAY['時間', '通勤']),
('time_management', '昼休みの5分だけ', '休憩時間の最初の5分だけ取り組む', ARRAY['時間', '昼休み'], 3, ARRAY['時間', '休憩']),

-- 環境設定
('environment', '専用の場所を作る', '学習や作業専用のスペースを確保する', ARRAY['場所', '集中', '環境'], 1, ARRAY['場所', '環境']),
('environment', '必要な道具を準備', '必要なものを事前に準備しておく', ARRAY['道具', '準備'], 2, ARRAY['道具', '準備']),
('environment', '集中できる環境を作る', '通知をオフにして集中環境を作る', ARRAY['集中', '環境'], 3, ARRAY['集中', '環境']),

-- モチベーション
('motivation', '小さなご褒美を設定', '目標達成時の小さなご褒美を決める', ARRAY['やる気', 'モチベーション', '続かない'], 1, ARRAY['ご褒美', 'モチベーション']),
('motivation', '達成感を記録する', '小さな達成を記録して可視化', ARRAY['達成', '記録'], 2, ARRAY['達成', '記録']),
('motivation', '進捗を可視化する', 'カレンダーやグラフで進捗を見える化', ARRAY['進捗', '可視化'], 3, ARRAY['進捗', '可視化']),

-- スキル・知識
('skill', '基本から学ぶ', '基礎的な内容から順番に学習', ARRAY['分からない', '難しい', '方法'], 1, ARRAY['基本', '学習']),
('skill', '簡単なものから始める', '最も簡単な部分から開始', ARRAY['簡単', '開始'], 2, ARRAY['簡単', '開始']),
('skill', 'チュートリアルを見る', '動画やガイドを活用', ARRAY['チュートリアル', 'ガイド'], 3, ARRAY['チュートリアル', 'ガイド']),

-- 心理的障壁
('psychological', '小さく始める', '完璧を目指さず小さく始める', ARRAY['恐い', '不安', '完璧'], 1, ARRAY['小さく', '開始']),
('psychological', '失敗を許可する', '失敗してもOKという気持ちで取り組む', ARRAY['失敗', '許可'], 2, ARRAY['失敗', '許可']),
('psychological', 'プロセスを重視', '結果よりもプロセスを大切にする', ARRAY['プロセス', '重視'], 3, ARRAY['プロセス', '重視']),

-- 仲間・サポート
('support', '友人に宣言する', '目標を友人に宣言してサポートを得る', ARRAY['一人', '孤独', '相談'], 1, ARRAY['友人', '宣言']),
('support', 'コミュニティに参加', 'オンラインコミュニティに参加', ARRAY['コミュニティ', '参加'], 2, ARRAY['コミュニティ', '参加']),
('support', '家族に協力依頼', '家族にサポートを依頼', ARRAY['家族', '協力'], 3, ARRAY['家族', '協力']);
```

## 🔄 フォールバック機能

### キーワードマッチしない場合

```typescript
interface HintDisplay {
  type: "prioritized" | "all_categories";
  message: string;
  primaryCategories?: HintCategory[];
  secondaryCategories?: HintCategory[];
  categories?: HintCategory[];
}

// マッチしない場合は全カテゴリを表示
function getHintsForUser(cause: string): HintDisplay {
  const matchedCategories = analyzeBottleneck(cause);

  if (matchedCategories.length === 0) {
    return {
      type: "all_categories",
      message: "以下のカテゴリから選んでください：",
      categories: getAllCategories(),
    };
  }

  return {
    type: "prioritized",
    message: "あなたの状況に最適なヒント：",
    primaryCategories: matchedCategories.slice(0, 1), // 最も関連性の高い1つ
    secondaryCategories: matchedCategories.slice(1), // その他
  };
}
```

**フォールバック時の表示**：

```
📊 Step 4: 小さな一歩の決定
┌─────────────────────────────────────┐
│ 解消するための「小さな一歩」は？    │
│                                     │
│ 💡 以下のカテゴリから選んでください：│
│ ┌─────────────────────────────────┐ │
│ │ 📅 時間管理                     │ │
│ │ └ 15分だけ取り組む              │ │
│ │ └ 通勤時間を活用                │ │
│ │                                 │ │
│ │ 🏠 環境設定                     │ │
│ │ └ 専用の場所を作る              │ │
│ │ └ 必要な道具を準備              │ │
│ │                                 │ │
│ │ 🎯 モチベーション               │ │
│ │ └ 小さなご褒美を設定            │ │
│ │ └ 達成感を記録                  │ │
│ │                                 │ │
│ │ 📚 スキル・知識                 │ │
│ │ └ 基本から学ぶ                  │ │
│ │ └ 簡単なものから始める          │ │
│ │                                 │ │
│ │ 😰 心理的障壁                   │ │
│ │ └ 小さく始める                  │ │
│ │ └ 失敗を許可する                │ │
│ │                                 │ │
│ │ 👥 仲間・サポート               │ │
│ │ └ 友人に宣言する                │ │
│ │ └ コミュニティに参加            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ✏️ 自分で小さな一歩を入力:          │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## 📊 品質向上機能

### 1. ユーザーフィードバック

```typescript
interface HintFeedback {
  hint_id: number;
  user_id: string;
  session_id: string;
  is_helpful: boolean;
  comment?: string;
}

// フィードバック収集
const collectHintFeedback = async (feedback: HintFeedback) => {
  await supabase.from("hint_usage").insert({
    user_id: feedback.user_id,
    hint_id: feedback.hint_id,
    session_id: feedback.session_id,
    is_helpful: feedback.is_helpful,
    created_at: new Date().toISOString(),
  });
};
```

### 2. A/B テスト

```typescript
// ヒント表示の A/B テスト
const getHintDisplayMode = (user_id: string): "concise" | "detailed" => {
  const hash = hashString(user_id);
  return hash % 2 === 0 ? "concise" : "detailed";
};

// 表示モードに応じてヒントを調整
const formatHintForDisplay = (hint: Hint, mode: "concise" | "detailed") => {
  if (mode === "concise") {
    return {
      title: hint.title,
      description: hint.description.substring(0, 30) + "...",
    };
  }
  return hint;
};
```

### 3. 継続的改善

```sql
-- ヒント効果分析クエリ
SELECT
  h.category,
  h.title,
  COUNT(hu.id) as usage_count,
  AVG(CASE WHEN hu.is_helpful THEN 1 ELSE 0 END) as helpfulness_rate
FROM hints h
LEFT JOIN hint_usage hu ON h.id = hu.hint_id
GROUP BY h.id, h.category, h.title
ORDER BY helpfulness_rate DESC, usage_count DESC;
```

## 🚀 実装の段階的アプローチ

### Week 1-2 (Phase 1)

1. **基本的なキーワードマッピング実装**

   - 6 つのカテゴリ定義
   - 各カテゴリに 3-5 個のヒント作成
   - 基本的なマッチング機能

2. **静的ヒント集の作成・表示**

   - データベーステーブル作成
   - 初期データ投入
   - 表示 UI 実装

3. **カテゴリ別の整理表示**
   - 優先表示機能
   - フォールバック機能
   - レスポンシブ対応

### Week 3-4 (Phase 2)

1. **より高度なテキスト分析**

   - 複数キーワードの重み付け
   - 文脈理解の向上
   - 同義語対応

2. **ユーザーフィードバック機能**

   - フィードバック収集 UI
   - データベース記録
   - 改善サイクル

3. **動的なヒント生成準備**
   - Premium 機能の基盤準備
   - API 連携の準備

## 🎯 期待される効果

1. **ユーザー満足度向上**

   - 適切なヒントによる問題解決率向上
   - 自力での解決能力向上

2. **Premium 誘導効果**

   - AI 機能との差別化
   - 個別最適化への期待醸成

3. **継続利用促進**
   - 毎回異なるヒントの発見
   - 学習・成長の実感

---

このヒント集システムにより、**無料プランでも高い価値を提供**しながら、**Premium プランへの自然な誘導**を実現できます。
