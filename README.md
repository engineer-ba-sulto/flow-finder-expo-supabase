# Flow Finder - パーソナルコーチング モバイルアプリ

## プロジェクト概要

**Flow Finder（フローファインダー）**は、React Native + Expo で構築するパーソナルコーチング モバイルアプリです。
「あなたの成長を妨げる『見えない壁』を見つけ、壊すためのパーソナルコーチング アプリ」をコンセプトに、ボトルネック点検フレームを誰でも簡単かつ継続的に実践できるようデザインされています。

2025 年最新の React Native 開発環境とベストプラクティスを使用して、効率的な開発を実現します。

## 技術選定

### フロントエンド

- **React Native with Expo SDK**: クロスプラットフォームモバイルアプリ開発
- **TypeScript**: 型安全性を提供する JavaScript の上位互換言語
- **Expo Router**: ファイルベースのルーティングシステム
- **NativeWind**: React Native 用の Tailwind CSS ライブラリ
- **React Hook Form + Zod**: フォーム管理・バリデーション

### バックエンド・データベース

- **Supabase**: PostgreSQL データベース + 認証システム
- **Supabase Auth**: ユーザー認証・セッション管理

### 開発環境・テスト

- **Bun**: 高速な JavaScript ランタイム・パッケージマネージャー
- **Jest**: JavaScript テストフレームワーク
- **React Native Testing Library**: React Native コンポーネントのテストユーティリティ
- **TDD**: Test-Driven Development による品質保証

### 将来実装予定

- **Expo Notifications**: プッシュ通知
- **RevenueCat**: アプリ内課金管理
- **OpenAI API**: AI 提案機能（Premium 機能）

## プロジェクト構造

```
flow-finder-expo-supabase/
├── app/                         # Expo Router (メイン画面)
│   ├── _layout.tsx              # ルートレイアウト
│   ├── (tabs)/                  # タブナビゲーション
│   │   ├── _layout.tsx          # タブレイアウト
│   │   ├── index.tsx            # ホーム画面
│   │   ├── goals.tsx            # ゴール管理画面
│   │   ├── dashboard.tsx        # ダッシュボード画面
│   │   ├── settings.tsx         # 設定画面
│   │   └── __tests__/           # 画面テストファイル
│   ├── session/                 # 点検セッション機能
│   ├── modal/                   # モーダル画面
│   └── auth/                    # 認証画面
├── components/                  # 再利用可能コンポーネント
│   ├── ui/                      # 基本UIコンポーネント
│   ├── forms/                   # フォーム関連
│   ├── charts/                  # グラフ・可視化
│   ├── features/                # 機能別コンポーネント
│   └── layout/                  # レイアウト関連
├── lib/                         # ライブラリ・ユーティリティ
│   ├── supabase.ts              # Supabase クライアント
│   ├── api/                     # API クライアント
│   └── utils.ts                 # ユーティリティ関数
├── hooks/                       # カスタムフック
├── types/                       # TypeScript型定義
├── constants/                   # 定数
├── assets/                      # 画像・アイコン
├── docs/                        # プロジェクトドキュメント
│   ├── README.md                # ドキュメント構成説明
│   ├── product-specific/        # Flow Finder固有のドキュメント
│   └── generic/                 # 汎用的な開発ガイド
├── PRD.md                       # Product Requirements Document
├── global.css                   # グローバルスタイル
├── tailwind.config.js          # Tailwind設定
├── tsconfig.json               # TypeScript設定
└── package.json                # パッケージ設定
```

## 機能

### Phase 1（現在実装中）

- **ユーザー認証**: Supabase Auth による認証機能
- **ゴール管理**: 目標の作成・編集・削除・一覧表示
- **基本ナビゲーション**: タブナビゲーション（ホーム・ゴール・設定）
- **基本 UI**: Button, Input, Card などの基本コンポーネント

### Phase 2 以降（実装予定）

- **ガイド付き点検セッション**: 5 ステップ質問をウィザード形式で実施
- **アクションリスト**: 「小さな一歩」を自動 ToDo 化
- **履歴 & ダッシュボード**: 解消したボトルネック数・達成タスク数をグラフ表示
- **プッシュ通知**: 週次／月次のセッションリマインダー
- **Premium 機能**: AI 提案機能・無制限利用など

### 収益化モデル

- **フリーミアム型**: 基本機能無料 + Premium（月額 600 円）
- **Free**: ゴール登録 1 件・点検セッション月 2 回
- **Premium**: ゴール数無制限・点検セッション無制限・AI 提案機能

## ドキュメント構成

このプロジェクトには豊富なドキュメントが用意されています：

### 📋 プロダクト要件書

- **[PRD.md](./PRD.md)**: Product Requirements Document（製品要件定義書）
- プロダクトの全体像・機能要件・技術要件・リリース計画などを記載

### 📁 docs ディレクトリ

- **[docs/README.md](./docs/README.md)**: ドキュメント構成の説明

#### 🎯 プロダクト特化ドキュメント（Flow Finder 固有）

- **[収益化モデル](./docs/product-specific/monetization_model.md)**: フリーミアム型の詳細設計
- **[点検セッション詳細](./docs/product-specific/session_flow_details.md)**: 5 ステップウィザードの詳細フロー
- **[ヒント集システム](./docs/product-specific/hint_system_design.md)**: 無料ユーザー向けヒント機能
- **[ファイル構成](./docs/product-specific/file_structure.md)**: プロジェクトのファイル構成詳細
- **[TDD 実装計画](./docs/product-specific/tdd_implementation_plan.md)**: Flow Finder 特有の実装計画
- **[画面設計](./docs/product-specific/screen_design.md)**: UI/UX 設計仕様
- **[アプリ構造](./docs/product-specific/structure.md)**: システム全体のアーキテクチャ

#### 🔧 汎用開発ガイド（他プロダクトにも適用可能）

- **[TDD 実装ガイド](./docs/generic/tdd_generic_guide.md)**: Test-Driven Development の実践方法
- **[開発ルール](./docs/generic/component_design_rules.md)**: コンポーネント設計のベストプラクティス
- **[ファイル命名規則](./docs/generic/file_naming_rules.md)**: 統一されたファイル命名ルール

## 初期設定

### 1. 依存関係をインストール

```bash
bun install
```

### 2. 開発サーバーを起動

```bash
# 開発サーバーを起動
bun start

# iOS シミュレータで起動
bun run ios

# Android エミュレータで起動
bun run android

# Web ブラウザで起動
bun run web
```

### 3. テスト実行

```bash
# テストを実行（watch モード）
bun run test
```

## 開発のポイント

### NativeWind の使用

このプロジェクトでは、NativeWind を使用して Tailwind CSS のクラスでスタイリングを行います。

```tsx
// 例: ホーム画面のスタイリング
<View className="bg-red-500 flex-1 justify-center items-center">
  <Text>Home</Text>
</View>
```

### Expo Router の使用

ファイルベースのルーティングシステムを使用しています。

- `app/(tabs)/index.tsx` → ホーム画面
- `app/(tabs)/settings.tsx` → 設定画面

### テストの書き方

React Native Testing Library を使用してコンポーネントのテストを行います。

```tsx
import { render } from "@testing-library/react-native";
import Tab from "../index";

test("テキストが正しくレンダリングされること", () => {
  const { getByText } = render(<Tab />);
  expect(getByText("Home")).toBeTruthy();
});
```

## 開発の進め方

### 1. ドキュメントの確認

開発を始める前に、以下のドキュメントを確認してください：

- **[PRD.md](./PRD.md)**: 製品要件・機能仕様・技術要件
- **[TDD 実装計画](./docs/product-specific/tdd_implementation_plan.md)**: 実装手順・テスト戦略
- **[アプリ構造](./docs/product-specific/structure.md)**: システムアーキテクチャ

### 2. Phase 1 の実装

現在は Phase 1（ゴール設定機能）の実装中です。
[TDD 実装計画](./docs/product-specific/tdd_implementation_plan.md)に従って、テストファーストで開発を進めてください。

### 3. 品質保証

- **TDD**: Red-Green-Refactor サイクルで実装
- **テスト配置**: 各ディレクトリに `__tests__` フォルダを作成
- **コード品質**: [開発ルール](./docs/generic/component_design_rules.md)に準拠

## 参考リンク

### 技術ドキュメント

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Bun Documentation](https://bun.sh/)

### バックエンド・認証

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)

### 将来実装予定の技術

- [Expo Notifications](https://docs.expo.dev/push-notifications/overview/)
- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
