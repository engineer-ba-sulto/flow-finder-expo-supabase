# プロジェクトファイル構成詳細

## 概要

Flow Finder プロジェクトのファイル構成について詳細に説明します。**テストファイルは分散型**で、各ソースコードと同じディレクトリに `__tests__` フォルダを作成して配置します。

## 🏗️ 全体構成

```
flow-finder-expo-supabase/
├── app/                          # Expo Router (App Router)
├── components/                   # 再利用可能コンポーネント
├── lib/                         # ライブラリ・ユーティリティ
├── hooks/                       # カスタムフック
├── types/                       # TypeScript型定義
├── constants/                   # 定数
├── assets/                      # 画像・フォントなど
├── docs/                        # ドキュメント
├── __tests__/                   # グローバルテストファイル
├── .expo/                       # Expo設定
├── .vscode/                     # VS Code設定
└── 設定ファイル                # package.json, tsconfig.json等
```

## 📱 app/ ディレクトリ（Expo Router）

```
app/
├── _layout.tsx                  # ルートレイアウト
├── (tabs)/                      # タブナビゲーション
│   ├── _layout.tsx              # タブレイアウト
│   ├── index.tsx                # ホーム画面
│   ├── __tests__/
│   │   └── index.test.tsx       # ホーム画面テスト
│   ├── goals.tsx                # ゴール管理
│   ├── __tests__/
│   │   └── goals.test.tsx       # ゴール管理テスト
│   ├── dashboard.tsx            # ダッシュボード
│   ├── __tests__/
│   │   └── dashboard.test.tsx   # ダッシュボードテスト
│   └── settings.tsx             # 設定画面
│       └── __tests__/
│           └── settings.test.tsx # 設定画面テスト
├── session/                     # 点検セッション
│   ├── _layout.tsx
│   ├── index.tsx                # セッション開始
│   ├── __tests__/
│   │   └── index.test.tsx
│   └── [step].tsx               # 5ステップウィザード
│       └── __tests__/
│           └── [step].test.tsx
├── onboarding/                  # オンボーディング（MVP2段目で実装）
│   ├── _layout.tsx
│   └── index.tsx
│       └── __tests__/
│           └── index.test.tsx
├── modal/                       # モーダル画面
│   ├── goal-create.tsx          # ゴール作成
│   ├── __tests__/
│   │   └── goal-create.test.tsx
│   └── action-detail.tsx        # アクション詳細
│       └── __tests__/
│           └── action-detail.test.tsx
└── auth/                        # 認証関連
    ├── login.tsx
    ├── __tests__/
    │   └── login.test.tsx
    └── register.tsx
        └── __tests__/
            └── register.test.tsx
```

## 🧩 components/ ディレクトリ

```
components/
├── ui/                          # 基本UIコンポーネント
│   ├── Button.tsx
│   ├── __tests__/
│   │   └── Button.test.tsx
│   ├── Input.tsx
│   ├── __tests__/
│   │   └── Input.test.tsx
│   ├── Card.tsx
│   ├── __tests__/
│   │   └── Card.test.tsx
│   ├── Modal.tsx
│   ├── __tests__/
│   │   └── Modal.test.tsx
│   ├── ProgressBar.tsx
│   ├── __tests__/
│   │   └── ProgressBar.test.tsx
│   └── Typography.tsx
│       └── __tests__/
│           └── Typography.test.tsx
├── forms/                       # フォーム関連
│   ├── GoalForm.tsx
│   ├── __tests__/
│   │   └── GoalForm.test.tsx
│   ├── SessionForm.tsx
│   ├── __tests__/
│   │   └── SessionForm.test.tsx
│   └── LoginForm.tsx
│       └── __tests__/
│           └── LoginForm.test.tsx
├── charts/                      # グラフ・可視化
│   ├── ProgressChart.tsx
│   ├── __tests__/
│   │   └── ProgressChart.test.tsx
│   ├── HistoryChart.tsx
│   ├── __tests__/
│   │   └── HistoryChart.test.tsx
│   └── DashboardChart.tsx
│       └── __tests__/
│           └── DashboardChart.test.tsx
├── features/                    # 機能別コンポーネント
│   ├── onboarding/             # オンボーディング（MVP2段目で実装）
│   │   ├── OnboardingSlider.tsx
│   │   ├── __tests__/
│   │   │   └── OnboardingSlider.test.tsx
│   │   ├── AppIntroSlide.tsx
│   │   ├── __tests__/
│   │   │   └── AppIntroSlide.test.tsx
│   │   ├── GoalValueSlide.tsx
│   │   ├── __tests__/
│   │   │   └── GoalValueSlide.test.tsx
│   │   ├── SessionIntroSlide.tsx
│   │   ├── __tests__/
│   │   │   └── SessionIntroSlide.test.tsx
│   │   └── PlanComparisonSlide.tsx
│   │       └── __tests__/
│   │           └── PlanComparisonSlide.test.tsx
│   ├── session/
│   │   ├── SessionWizard.tsx
│   │   ├── __tests__/
│   │   │   └── SessionWizard.test.tsx
│   │   ├── StepIndicator.tsx
│   │   ├── __tests__/
│   │   │   └── StepIndicator.test.tsx
│   │   └── HintDisplay.tsx
│   │       └── __tests__/
│   │           └── HintDisplay.test.tsx
│   ├── goals/
│   │   ├── GoalList.tsx
│   │   ├── __tests__/
│   │   │   └── GoalList.test.tsx
│   │   ├── GoalCard.tsx
│   │   ├── __tests__/
│   │   │   └── GoalCard.test.tsx
│   │   └── GoalPriorityPicker.tsx
│   │       └── __tests__/
│   │           └── GoalPriorityPicker.test.tsx
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── __tests__/
│   │   │   └── StatsCard.test.tsx
│   │   ├── RecentActivity.tsx
│   │   ├── __tests__/
│   │   │   └── RecentActivity.test.tsx
│   │   └── AchievementBadge.tsx
│   │       └── __tests__/
│   │           └── AchievementBadge.test.tsx
│   └── actions/
│       ├── ActionList.tsx
│       ├── __tests__/
│       │   └── ActionList.test.tsx
│       ├── ActionItem.tsx
│       ├── __tests__/
│       │   └── ActionItem.test.tsx
│       └── ActionCompletedModal.tsx
│           └── __tests__/
│               └── ActionCompletedModal.test.tsx
└── layout/                      # レイアウト関連
    ├── AppHeader.tsx
    ├── __tests__/
    │   └── AppHeader.test.tsx
    ├── TabNavigation.tsx
    ├── __tests__/
    │   └── TabNavigation.test.tsx
    └── SafeAreaWrapper.tsx
        └── __tests__/
            └── SafeAreaWrapper.test.tsx
```

## 📚 lib/ ディレクトリ

```
lib/
├── supabase.ts                  # Supabase クライアント
├── __tests__/
│   └── supabase.test.ts
├── store/                       # Zustand ストア
│   ├── auth.ts
│   ├── __tests__/
│   │   └── auth.test.ts
│   ├── goals.ts
│   ├── __tests__/
│   │   └── goals.test.ts
│   ├── session.ts
│   ├── __tests__/
│   │   └── session.test.ts
│   └── ui.ts
│       └── __tests__/
│           └── ui.test.ts
├── api/                         # API クライアント
│   ├── goals.ts
│   ├── __tests__/
│   │   └── goals.test.ts
│   ├── sessions.ts
│   ├── __tests__/
│   │   └── sessions.test.ts
│   ├── actions.ts
│   ├── __tests__/
│   │   └── actions.test.ts
│   └── hints.ts
│       └── __tests__/
│           └── hints.test.ts
├── utils/                       # ユーティリティ関数
│   ├── date.ts
│   ├── __tests__/
│   │   └── date.test.ts
│   ├── validation.ts
│   ├── __tests__/
│   │   └── validation.test.ts
│   ├── formatting.ts
│   ├── __tests__/
│   │   └── formatting.test.ts
│   └── analytics.ts
│       └── __tests__/
│           └── analytics.test.ts
├── notifications.ts             # 通知管理
├── __tests__/
│   └── notifications.test.ts
├── purchases.ts                 # アプリ内課金
├── __tests__/
│   └── purchases.test.ts
└── constants.ts                 # 定数定義
    └── __tests__/
        └── constants.test.ts
```

## 🎣 hooks/ ディレクトリ

```
hooks/
├── useAuth.ts                   # 認証関連
├── __tests__/
│   └── useAuth.test.ts
├── useGoals.ts                  # ゴール管理
├── __tests__/
│   └── useGoals.test.ts
├── useSession.ts                # セッション管理
├── __tests__/
│   └── useSession.test.ts
├── useActions.ts                # アクション管理
├── __tests__/
│   └── useActions.test.ts
├── useHints.ts                  # ヒント表示
├── __tests__/
│   └── useHints.test.ts
├── useNotifications.ts          # 通知管理
├── __tests__/
│   └── useNotifications.test.ts
├── useOnboarding.ts             # オンボーディング管理（MVP2段目で実装）
├── __tests__/
│   └── useOnboarding.test.ts
└── useAnalytics.ts              # 分析データ
    └── __tests__/
        └── useAnalytics.test.ts
```

## 🔧 types/ ディレクトリ

```
types/
├── database.ts                  # Supabase型定義
├── __tests__/
│   └── database.test.ts
├── api.ts                       # API レスポンス型
├── __tests__/
│   └── api.test.ts
├── components.ts                # コンポーネント型
├── __tests__/
│   └── components.test.ts
├── navigation.ts                # ナビゲーション型
├── __tests__/
│   └── navigation.test.ts
└── global.ts                    # グローバル型
    └── __tests__/
        └── global.test.ts
```

## 🎨 constants/ ディレクトリ

```
constants/
├── colors.ts                    # カラー定義
├── __tests__/
│   └── colors.test.ts
├── fonts.ts                     # フォント定義
├── __tests__/
│   └── fonts.test.ts
├── sizes.ts                     # サイズ定義
├── __tests__/
│   └── sizes.test.ts
└── strings.ts                   # 文字列定義
    └── __tests__/
        └── strings.test.ts
```

## 🧪 **tests**/ ディレクトリ（グローバル）

```
__tests__/
├── setup.ts                     # テストセットアップ
├── mocks/                       # モックデータ・関数
│   ├── api.ts
│   ├── supabase.ts
│   ├── notifications.ts
│   └── storage.ts
├── helpers/                     # テストヘルパー
│   ├── render.tsx               # カスタムレンダー
│   ├── store.ts                 # ストアテストヘルパー
│   └── navigation.ts            # ナビゲーションテストヘルパー
├── fixtures/                    # テストデータ
│   ├── users.ts
│   ├── goals.ts
│   ├── sessions.ts
│   └── actions.ts
└── utils/                       # テストユーティリティ
    ├── matchers.ts              # カスタムマッチャー
    └── generators.ts            # データ生成器
```

## 📄 docs/ ディレクトリ

```
docs/
├── prd.md                       # 製品要求仕様書
├── tdd_implementation_plan.md   # TDD実装計画
├── monetization_model.md        # 収益化モデル詳細
├── session_flow_details.md      # 点検セッション詳細
├── hint_system_design.md        # ヒント集システム設計
├── file_structure.md            # ファイル構成詳細
├── api_documentation.md         # API仕様書
├── deployment_guide.md          # デプロイガイド
└── testing_strategy.md          # テスト戦略
```

## ⚙️ 設定ファイル

```
# パッケージ管理
package.json
bun.lock

# TypeScript
tsconfig.json
types/                            # 型定義

# Expo
app.json
expo.json
.expo/

# テスト
jest.config.js
jest.setup.js

# スタイル
tailwind.config.js
global.css
nativewind-env.d.ts

# ビルド
metro.config.js
babel.config.js

# 開発環境
.env
.env.example
.gitignore
README.md
```

## 📏 命名規則

### ファイル名

- **コンポーネント**: `PascalCase.tsx` (例: `Button.tsx`)
- **フック**: `camelCase.ts` (例: `useAuth.ts`)
- **ユーティリティ**: `camelCase.ts` (例: `dateUtils.ts`)
- **型定義**: `camelCase.ts` (例: `database.ts`)
- **定数**: `camelCase.ts` (例: `colors.ts`)

### テストファイル名

- **コンポーネント**: `ComponentName.test.tsx`
- **フック**: `hookName.test.ts`
- **ユーティリティ**: `utilName.test.ts`

### ディレクトリ名

- **小文字 + ハイフン**: `kebab-case` (例: `user-profile`)
- **機能別**: 機能名で整理 (例: `session`, `goals`)

## 🔍 インポート規則

### インポート順序

```typescript
// 1. React関連
import React from "react";
import { useState, useEffect } from "react";

// 2. React Native関連
import { View, Text, TouchableOpacity } from "react-native";

// 3. サードパーティライブラリ
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

// 4. 内部ライブラリ
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

// 5. 相対インポート
import { Button } from "../ui/Button";
import { validateGoal } from "./utils";
```

### パスエイリアス

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/types/*": ["./types/*"],
      "@/constants/*": ["./constants/*"]
    }
  }
}
```

## 🎯 ベストプラクティス

### 1. 分散型テストファイル配置

- **メリット**: 関連するコードとテストが近くにある
- **メンテナンス**: 修正時にテストファイルを見つけやすい
- **可読性**: ディレクトリ構造が直感的

### 2. 機能別コンポーネント整理

- **features/**: 機能別にコンポーネントを整理
- **ui/**: 再利用可能な基本 UI コンポーネント
- **forms/**: フォーム関連コンポーネント

### 3. 型安全性の確保

- **TypeScript**: 全ファイルで TypeScript を使用
- **Zod**: フォームバリデーションと API 型検証
- **型定義**: 明示的な型定義

### 4. テスト戦略

- **単体テスト**: 各コンポーネント・フックの動作確認
- **統合テスト**: 複数コンポーネントの連携確認
- **E2E テスト**: ユーザーフローの確認

---

このファイル構成により、**保守性が高く、拡張しやすいプロジェクト**を実現できます。
