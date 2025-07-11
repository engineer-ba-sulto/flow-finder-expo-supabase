# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 重要事項

**このプロジェクトでは日本語で回答してください。** コードコメント、説明、エラーメッセージの記述はすべて日本語でお願いします。

## 🚨 超重要：実装開始前の必須チェックリスト

**実装開始前に必ず以下を確認してください（見逃し防止）**：

### ステップ1：現在のタスク確認
1. **Readツールで `docs/product-specific/tdd_implementation_plan.md` を読む**
2. **現在のタスク番号を確認**（例：Task 2.3）
3. **Week番号を確認**（Week 1 or Week 2以降）

### ステップ2：ワークフロー選択
- **Week 1**: 直接実装開始
- **Week 2以降**: **必ずGitHub Issue作成から開始**

### ステップ3：Week 2以降の必須手順（5ステップ）
1. **Issue作成**: `gh issue create`
2. **ブランチ作成**: `git checkout -b feat/X.Y-feature-name`
3. **実装**: TDD（Red-Green-Refactor）
4. **確認**: Issue完了条件チェック
5. **クローズ**: `gh issue close` + コミット

### ステップ4：完了時の必須手順
1. **Editツールで実装計画更新**（`[ ]` → `[x]`）
2. **進捗管理セクション更新**（7.3の「次の実装」）
3. **例外なし**：この手順を省略することは絶対に禁止

**🚨 重要**：「進めてください」と言われても、必ずこのチェックリストを実行してから実装開始。

## 🚨 必須ルール：タスク完了時のドキュメント更新

**重要**: 任意のタスクが完了したら、**必ず**以下の手順を実行してください：

1. **Editツールで `docs/product-specific/tdd_implementation_plan.md` を更新**
   - 完了したタスクの `[ ]` を `[x]` に変更
   - 進捗管理セクション（7.3）の「次の実装」も更新

2. **例外なし**: この手順を省略することは絶対に禁止

**実行例**:
```
タスク完了 → Editツールで実装計画更新 → 次のタスクに進む
```

## プロジェクト概要

Flow Finder（フローファインダー）は、React Native + Expo で構築するパーソナルコーチング モバイルアプリです。「あなたの成長を妨げる『見えない壁』を見つけ、壊すためのパーソナルコーチング アプリ」をコンセプトに開発されています。

### 主要技術スタック
- **フレームワーク**: Expo v52 + React Native 0.76.7
- **ルーティング**: Expo Router v4 (ファイルベースルーティング)
- **スタイリング**: NativeWind v4 (React Native向けTailwind CSS)
- **言語**: TypeScript (strict mode)
- **パッケージマネージャー**: Bun
- **アーキテクチャ**: New Architecture有効化

## 開発コマンド

### 基本コマンド
```bash
# 依存関係のインストール
bun install

# 開発サーバー起動
bun run start

# プラットフォーム別開発
bun run android    # Android開発
bun run ios        # iOS開発  

# テスト実行
bun run test       # Jest（watchモード）
```

### その他のコマンド
```bash
# プラットフォーム指定で起動
expo start --android
expo start --ios

# キャッシュクリア
expo start --clear
```

## アーキテクチャ概要

### ルーティングシステム
- Expo Router v4のファイルベースルーティングを使用
- タブナビゲーションは `app/(tabs)/_layout.tsx` で設定
- ルートレイアウトは `app/_layout.tsx` でグローバルCSS読み込み

### スタイリングアーキテクチャ
- NativeWind v4によるTailwind CSSサポート
- グローバルスタイルは `global.css`
- Tailwind設定は `tailwind.config.js`
- コンテンツパスは `app/**` と `components/**`

### 設定ファイル
- `app.json`: New Architecture有効化されたExpo設定
- `babel.config.js`: NativeWind用のjsxImportSource設定
- `tailwind.config.js`: NativeWindプリセット設定
- `tsconfig.json`: 厳密なTypeScript設定

## 開発ガイドライン

### ファイル命名規則
プロジェクトドキュメント (`docs/generic/file_naming_rules.md`) に基づく：
- **ファイル**: kebab-case使用 (例: `user-profile.tsx`)
- **コンポーネント**: PascalCase関数名 (例: `UserProfile`)
- **ディレクトリ**: kebab-case（Expo Router慣例は除く）

### コンポーネント構造
コンポーネント設計ルール (`docs/generic/component_design_rules.md`) に従う：
- コンポーネントは `_components` ディレクトリに配置
- 使用スコープに応じた適切なレベルに配置
- TypeScriptインターフェースをpropsに使用
- 責任分離の原則に従う

### タスク管理・イシュー運用ルール
Week 2以降の実装では、TDD実装計画の各タスクごとにGitHub Issueを立てて管理する：

#### イシュー作成ルール
1. **タスク単位**: TDD実装計画の各タスク（Task 2.1, 2.2, 2.3...）ごとにIssueを作成
2. **命名規則**: `[Task X.Y] タスク名 (TDD Phase)` 形式
   - 例: `[Task 2.1] Goal データ型のテスト作成 (Red Phase)`
3. **ラベル**: 対応するPhaseのラベルを付与
   - `red-phase`: テスト作成（Red Phase）
   - `green-phase`: 最小実装（Green Phase）
   - `refactor-phase`: 改善（Refactor Phase）
4. **説明**: 実装内容・配置場所・完了条件を明記

#### ブランチ・PR運用
1. **ブランチ名**: `task/X.Y-feature-name` 形式
   - 例: `task/2.1-goal-data-types`
2. **PRタイトル**: Issue番号とタスク名を含める
   - 例: `[Task 2.1] Goal データ型のテスト作成 (Red Phase) (#5)`
3. **PR説明**: 実装内容・テスト結果・TDDサイクルの進捗を記載

## 技術統合パターン

### NativeWind設定
- NativeWind用Babelプリセット設定済み
- ルートレイアウトでグローバルCSS読み込み
- React NativeコンポーネントでTailwindクラス直接使用可能

### Expo Router
- ファイルベースルーティングシステム
- FontAwesomeアイコン付きタブナビゲーション
- 適切な階層でのレイアウトネスト

### TypeScript
- 厳密モード有効
- `nativewind-env.d.ts` での型定義
- Expoベースのtsconfig使用

## 既知のパターン

### レイアウトパターン
```typescript
// ルートレイアウトでグローバルCSS読み込み
import "../global.css";

// タブレイアウトでExpo RouterのTabsコンポーネント使用
import { Tabs } from "expo-router";
```

### コンポーネントパターン
```typescript
// NativeWindクラスの使用
<View className="bg-red-500 flex-1 justify-center items-center">
  <Text>Content</Text>
</View>
```

## 開発環境

- **プラットフォーム**: macOS (Darwin 24.5.0)
- **パッケージマネージャー**: Bun（推奨）
- **メインブランチ**: main
- **New Architecture**: Expo設定で有効化

## 開発時の重要な参照先

### プロダクト特化ドキュメント（`docs/product-specific/`）
Flow Finder固有の仕様・設計・実装に関するドキュメント：
- `tdd_implementation_plan.md`: TDD実装計画（開発スケジュール）
- `screen_design.md`: UI/UX設計仕様
- `structure.md`: アーキテクチャ・システム構成
- `session_flow_details.md`: 5ステップウィザード詳細
- `monetization_model.md`: フリーミアム型収益化モデル

### 汎用開発ガイド（`docs/generic/`）
どのプロダクトにも適用可能な開発手法・ルール：
- `tdd_generic_guide.md`: TDD実装の体系的ガイド
- `component_design_rules.md`: React/Next.jsコンポーネント設計
- `file_naming_rules.md`: ファイル命名規則

### 主要な参照順序
1. **開発開始時**: `PRD.md` → `docs/product-specific/tdd_implementation_plan.md`
2. **実装時**: `docs/generic/component_design_rules.md` + `docs/generic/file_naming_rules.md`
3. **機能設計時**: `docs/product-specific/screen_design.md` + `docs/product-specific/structure.md`

## フリーミアム型収益化モデル

- **無料プラン**: ゴール登録1件・点検セッション月2回
- **プレミアム（月額600円）**: ゴール数無制限・点検セッション無制限・AI提案機能

## 現在の開発フェーズ

**Phase 1（実装中）**: 基本機能
- ユーザー認証（Supabase Auth）
- ゴール管理（CRUD）
- 基本ナビゲーション
- 基本UIコンポーネント

**Phase 2以降（予定）**: 高度な機能
- ガイド付き点検セッション（5ステップウィザード）
- アクションリスト（ToDo化）
- 履歴・ダッシュボード
- プッシュ通知
- AI提案機能（プレミアム）