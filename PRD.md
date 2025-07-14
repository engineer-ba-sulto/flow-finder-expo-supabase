# 『Flow Finder（フローファインダー）』PRD（Product Requirements Document）

## 1. 製品概要

### コンセプト

**「あなたの成長を妨げる『見えない壁』を見つけ、壊すためのパーソナルコーチング モバイルアプリ」**

ボトルネック点検フレームを誰でも簡単かつ継続的に実践できるようデザインし、思考整理と行動促進、そして成長の可視化を同時に実現します。

### プロダクトビジョン

成長したいと願う全ての人が、自分の行動を妨げる真の原因を発見し、継続的な改善を通じて目標を達成できる世界を実現する。

## 2. 目的とペルソナ

- **ターゲット**
  - 20〜40 代のビジネスパーソン／学生で "成長したいが行動が続かない" と悩む層
  - タスク管理アプリは使ったことがあるが「なぜ進まないか」までは分析できていないユーザー
- **ペイン**
  - 目標は立てても継続できず、結果が可視化されない
  - ボトルネック発見フレームワークを紙やメモで実践するのは煩雑
- **ゴール**
  - 週次／月次の「点検セッション」で "隠れたボトルネック" を発見
  - 解決のための "小さな一歩" をタスク化し、達成プロセスを可視化

## 3. 機能要件

### 3 段階 MVP リリース戦略に基づく機能整理

#### 【MVP 1 段目】ゴール機能（1〜3 週目）

- ゴール設定（CRUD）
- ゴール完了（達成マーク付与・完了リスト表示）
- ユーザー認証（Supabase Auth）
- 基本 UI（Button, Input, Card）
- タブナビゲーション
- Expo デプロイ

#### 【MVP 2 段目】無料プラン完全版（4〜6 週目）

- 点検セッション（5 ステップウィザード、AI なし）
- 制限機能（ゴール 1 件、点検月 2 回、履歴 3 回分）
- プレミアム誘導 UI

#### 【MVP 3 段目】プレミアム機能（7〜8 週目）

- AI 提案機能（OpenAI GPT-4）
- 課金システム（RevenueCat）
- プレミアム限定機能・分析ダッシュボード

> 詳細は [TDD 実装計画](docs/product-specific/tdd_implementation_plan.md) を参照

### 収益化モデル

**フリーミアム型**：基本機能無料 + Premium（月額 600 円）で高度機能を提供

| プラン      | 価格    | 機能内容                                                         |
| ----------- | ------- | ---------------------------------------------------------------- |
| **Free**    | ¥0      | ゴール登録 1 件・点検セッション月 2 回・履歴 3 回分・AI 機能なし |
| **Premium** | ¥600/月 | ゴール数無制限・点検セッション無制限・全期間履歴・AI 提案機能    |

> 📄 **詳細**: [収益化モデル詳細](docs/product-specific/monetization_model.md) を参照

### ユーザーストーリー

**新規ユーザー**

- ユーザーとして、アプリの使い方を理解するためのオンボーディングを受けたい
- ユーザーとして、自分の最初のゴールを設定したい

**既存ユーザー**

- ユーザーとして、今日取り組むべきアクションを一目で確認したい
- ユーザーとして、週次の点検セッションでボトルネックを発見したい
- ユーザーとして、自分の成長を可視化したい

**Premium ユーザー**

- ユーザーとして、複数のゴールを同時に管理したい
- ユーザーとして、過去の全履歴を振り返りたい

## 4. 非機能要件

### パフォーマンス

- アプリ起動時間：3 秒以内
- 画面遷移時間：1 秒以内
- データ同期：リアルタイム（5 秒以内）

### セキュリティ

- ユーザーデータの暗号化
- HTTPS 通信の徹底
- 定期的なセキュリティ監査

### 可用性

- アプリ稼働率：99.9%
- オフライン機能：基本的なデータ閲覧・入力

### 使いやすさ

- 直感的な UI/UX
- アクセシビリティ対応（VoiceOver、TalkBack）
- 多言語対応（将来的に英語対応）

## 5. データモデル

| エンティティ | 主なフィールド                                | 用途                     |
| ------------ | --------------------------------------------- | ------------------------ |
| User         | id / email / plan (free, premium)             | 認証・課金区分           |
| Goal         | id / user_id / title / priority               | 目標管理                 |
| Bottleneck   | id / goal_id / title / cause / created_at     | 点検セッションの入力内容 |
| Action       | id / bottleneck_id / description / done(bool) | "小さな一歩"タスク       |
| History      | id / user_id / session_date / summary         | セッション概要           |
| Notification | id / user_id / schedule / type                | リマインダー設定         |

## 6. 主要画面 & ナビゲーション

| 画面             | ナビゲーション     | 主な内容                       | 対応 MVP 段階 |
| ---------------- | ------------------ | ------------------------------ | ------------- |
| ホーム           | タブナビゲーション | 今日のゴール／アクションカード | 1,2,3         |
| 点検セッション   | スタック/モーダル  | 5 ステップウィザード           | 2,3           |
| ゴール管理       | タブナビゲーション | ゴール CRUD ＋ 並び替え        | 1,2,3         |
| ダッシュボード   | タブナビゲーション | グラフ表示・履歴タイムライン   | 3             |
| 設定             | タブナビゲーション | 通知設定・課金管理             | 1,2,3         |
| オンボーディング | 初回起動時         | アプリ紹介・使い方説明         | 2,3           |

> 📄 **詳細**: [画面設計詳細](docs/product-specific/screen_design.md) を参照

## 7. 技術要件

### 技術スタック

| 層             | 技術 & サービス                                               |
| -------------- | ------------------------------------------------------------- |
| フレームワーク | **React Native with Expo SDK**                                |
| 言語           | TypeScript                                                    |
| UI/スタイル    | NativeWind (Tailwind CSS for React Native)                    |
| ナビゲーション | Expo Router (file-based routing)                              |
| フォーム       | React Hook Form + Zod                                         |
| 状態管理       | React useState + useContext (Phase 1) → 将来的に Zustand 検討 |
| グラフ         | react-native-chart-kit / Victory Native                       |
| DB & Auth      | Supabase（PostgreSQL, Supabase Auth）                         |
| 通知           | Expo Notifications                                            |
| 課金           | Expo In-App Purchases (RevenueCat)                            |
| デプロイ       | Expo Application Services (EAS)                               |

### システム構成

- **フロントエンド**: React Native/Expo アプリ
- **バックエンド**: Supabase (PostgreSQL + Auth + Edge Functions)
- **課金**: RevenueCat + App Store/Google Play Store
- **通知**: Expo Push Notifications
- **デプロイ**: EAS Build & Submit

> 📄 **詳細**: [ファイル構成詳細](docs/product-specific/file_structure.md) を参照

## 8. 開発・テスト戦略

### TDD 実践

**Red-Green-Refactor サイクル**を実践し、テストファーストで開発を進めます。

- **テストファイル配置**: 分散型（各ソースコードと同じディレクトリに `__tests__` フォルダ）
- **テストレベル**: Unit Test → Integration Test → E2E Test
- **命名規則**: `ComponentName.test.tsx` 形式

> 📄 **詳細**: [TDD 実装計画](docs/product-specific/tdd_implementation_plan.md) を参照

## 9. 成功指標・KPI

### 各 MVP 段階ごとの KPI

| 段階  | 主な KPI 例                                   |
| ----- | --------------------------------------------- |
| MVP 1 | 100 ユーザー獲得、週 1 回以上のアクティブ利用 |
| MVP 2 | MAU500、点検セッション完了率 80%以上          |
| MVP 3 | 有料転換率 5%以上、MRR3 万円以上              |

- 各段階での市場検証・ユーザーフィードバックを重視
- 詳細な品質・開発効率指標は [TDD 実装計画](docs/product-specific/tdd_implementation_plan.md) 参照

## 10. 段階的リリース計画

本プロダクトは**3 段階の MVP リリース戦略**で段階的に市場検証・収益化を進めます。

| 段階      | 期間      | 主な実装範囲・目的                   | 成功指標例                   |
| --------- | --------- | ------------------------------------ | ---------------------------- |
| **MVP 1** | 1〜3 週目 | ゴール CRUD・認証・基本 UI・デプロイ | 100 ユーザー獲得             |
| **MVP 2** | 4〜6 週目 | 点検セッション・制限・プレミアム誘導 | MAU500・セッション完了率 80% |
| **MVP 3** | 7〜8 週目 | AI 提案・課金・分析ダッシュボード    | 転換率 5%・MRR3 万円         |

- **MVP 1 段目**：ゴール管理機能のみで最小限の市場検証
- **MVP 2 段目**：点検セッション・制限・プレミアム誘導で無料プラン完成
- **MVP 3 段目**：AI・課金・分析で本格収益化

> 詳細は [TDD 実装計画](docs/product-specific/tdd_implementation_plan.md) を参照

## 11. リスク & 対策

| リスク           | 影響度 | 対策                                    |
| ---------------- | ------ | --------------------------------------- |
| 入力フロー離脱   | 高     | ステップ保存・自動下書き／進捗バー表示  |
| 通知許可拒否     | 中     | アプリ内通知・再許可リマインド          |
| アプリ内課金障害 | 中     | RevenueCat による課金状態管理・復旧処理 |
| アプリストア審査 | 高     | ガイドライン遵守・事前テスト            |
| 競合参入         | 中     | 独自性強化・ユーザー体験向上            |

## 12. 運用・保守要件

### 監視

- アプリケーション性能監視（APM）
- エラー監視・レポート
- ユーザー行動分析

### 保守

- 定期的なセキュリティアップデート
- OS 対応・新機能対応
- ユーザーサポート体制

## 13. 法的要件・コンプライアンス

### プライバシー

- プライバシーポリシーの策定・表示
- 利用規約の策定・表示
- GDPR 対応（将来的なグローバル展開に備えて）

### アプリストア要件

- App Store Review Guidelines 準拠
- Google Play Policy 準拠
- 年齢制限設定（13 歳以上推奨）

## 14. 次のステップ

1. 基本 UI コンポーネント（Button, Input, Card 等）の実装
2. Supabase 認証とデータベース設定
3. タブナビゲーションと Expo Router の設定
4. 点検セッションウィザードの実装
5. プッシュ通知とアプリ内課金の設定

---

> 本 PRD は「思考フローの可視化」と「行動促進」をモバイルアプリで高速に検証し、6 週間で MVP リリースする想定です。

## 関連ドキュメント

### 🎯 プロダクト特化ドキュメント（Flow Finder 固有）

- 📄 [収益化モデル詳細](docs/product-specific/monetization_model.md)
- 📄 [点検セッション詳細フロー](docs/product-specific/session_flow_details.md)
- 📄 [ヒント集システム設計](docs/product-specific/hint_system_design.md)
- 📄 [ファイル構成詳細](docs/product-specific/file_structure.md)
- 📄 [TDD 実装計画](docs/product-specific/tdd_implementation_plan.md)
- 📄 [画面設計詳細](docs/product-specific/screen_design.md)
- 📄 [アプリ構造](docs/product-specific/structure.md)

### 🔧 汎用開発ガイド（他プロダクトにも適用可能）

- 📄 [TDD 実装ガイド](docs/generic/tdd_generic_guide.md)
- 📄 [開発ルール](docs/generic/component_design_rules.md)
- 📄 [ファイル命名規則](docs/generic/file_naming_rules.md)
