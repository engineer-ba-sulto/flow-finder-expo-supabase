# TDD 実装計画 — Flow Finder プロジェクト

## 1. 概要

Flow Finder の **TDD 実装計画** です。基本的な TDD 手法については **[TDD 実装ガイド](../generic/tdd_generic_guide.md)** を参照してください。このドキュメントは Flow Finder 特有の実装例と具体的なスケジュールを記載します。

## 2. プロジェクト目標

- **MVP 3段階リリース**: 段階的な市場検証と収益化
- **品質保証**: TDD アプローチによる高品質コード
- **早期フィードバック**: 各段階でのデプロイ・検証・改善

## 3. Flow Finder 特有の技術スタック

| レイヤ         | 採用技術                              | TDD での活用                   |
| -------------- | ------------------------------------- | ------------------------------ |
| フレームワーク | React Native + Expo SDK               | Jest + React Native Test Utils |
| UI             | NativeWind + カスタムコンポーネント   | 各コンポーネントの単体テスト   |
| 状態管理       | React useState + useContext (Phase 1) | カスタムフックのテスト         |
| DB・認証       | Supabase                              | API クライアントのモックテスト |
| AI             | OpenAI GPT-4o                         | Function Calling のテスト      |
| 課金           | RevenueCat                            | 課金フローのテスト             |

> 重要なプロンプトは `prompts/<日付>-<機能>.md` に保存し、ナレッジベースとして再利用します。

## 4. MVP 3段階リリース戦略

### 🎯 リリース戦略概要

**MVP 1段目：ゴール機能**（3週間目リリース）
- ゴールのCRUD機能のみ
- 最小限のMVPで市場検証

**MVP 2段目：無料プラン完全版**（6週間目リリース）  
- 点検セッション機能追加（AI機能なし）
- 無料プランの制限機能実装

**MVP 3段目：プレミアム機能**（8週間目リリース）
- AI機能・課金システム
- 本格的な収益化開始

### 📱 各段階の詳細

#### 🚀 MVP 1段目：ゴール機能（Week 3完了目標）

**実装範囲**：
- ✅ 完了済み機能：認証・ゴールCRUD・基本UI
- 🔄 追加必要機能：デプロイ設定・簡易ゴール完了機能

**成功指標**：ユーザー獲得100名以上、週1回以上のアクティブ利用

#### 📊 MVP 2段目：無料プラン完全版（Week 6完了目標）

**新規実装**：
- 点検セッション機能（5ステップウィザード、AI機能なし）
- 制限機能（ゴール1件、点検月2回、履歴3回分）
- プレミアム誘導UI

**成功指標**：MAU 500名以上、点検セッション完了率80%以上

#### 💎 MVP 3段目：プレミアム機能（Week 8完了目標）

**新規実装**：
- AI提案機能（OpenAI GPT-4）
- 課金システム（RevenueCat、月額¥600）
- プレミアム限定機能・分析ダッシュボード

**成功指標**：転換率5%以上、MRR ¥30,000以上

各機能を Red-Green-Refactor サイクルで実装し、テストファーストで品質を保証します。

### テストファイル配置戦略

アプリ構造定義書のディレクトリレイアウトに従い、以下の配置ルールを採用します：

```text
/components/ui/
  Button.tsx
  __tests__/
    Button.test.tsx
/components/forms/
  GoalForm.tsx
  __tests__/
    GoalForm.test.tsx
/hooks/
  useAuth.ts
  __tests__/
    useAuth.test.ts
/app/(tabs)/
  __tests__/
    index.test.tsx
    goals.test.tsx
```

**テスト配置ルール**：

- 各ディレクトリに `__tests__` フォルダを作成
- テストファイル名は `ComponentName.test.tsx` 形式
- 画面テストは `app/(tabs)/__tests__/` に配置

### MVP 1段目（Week 1–3）: ゴール機能 - 最初のリリース

**MVP 1段目の目標**:

- ゴール設定機能のみを実装（CRUD + 認証）
- 最小限のMVPで市場検証とユーザーフィードバック獲得
- 基盤技術の検証（React Native + Supabase + EAS）

**MVP 1段目完了後の成果物**:

- ユーザー認証機能（Supabase Auth）
- ゴール作成・編集・削除・一覧表示
- 基本 UI コンポーネント（Button, Input, Card）
- 簡易ゴール完了機能
- Expo アプリとしてデプロイ完了（App Store/Google Play）

#### Week 1: テスト環境構築と UI コンポーネント

| Task | TDD Phase    | 説明                              | 配置場所         | 完了 |
| ---- | ------------ | --------------------------------- | ---------------- | ---- |
| 1.1  | **Red**      | Button コンポーネントのテスト作成 | `components/ui/` | [x]  |
| 1.2  | **Green**    | Button コンポーネントの最小実装   | `components/ui/` | [x]  |
| 1.3  | **Refactor** | Button コンポーネントの改善       | `components/ui/` | [x]  |
| 1.4  | **Red**      | Input コンポーネントのテスト作成  | `components/ui/` | [x]  |
| 1.5  | **Green**    | Input コンポーネントの最小実装    | `components/ui/` | [x]  |
| 1.6  | **Refactor** | Input コンポーネントの改善        | `components/ui/` | [x]  |
| 1.7  | **Red**      | Card コンポーネントのテスト作成   | `components/ui/` | [x]  |
| 1.8  | **Green**    | Card コンポーネントの最小実装     | `components/ui/` | [x]  |
| 1.9  | **Refactor** | Card コンポーネントの改善         | `components/ui/` | [x]  |

#### Week 2: データレイヤーとゴール管理・デプロイ

| Task | TDD Phase    | 説明                                | 配置場所                 | 完了 |
| ---- | ------------ | ----------------------------------- | ------------------------ | ---- |
| 2.1  | **Red**      | Goal データ型のテスト作成           | `types/`                 | [x]  |
| 2.2  | **Green**    | Goal データ型の実装                 | `types/goal.types.ts`    | [x]  |
| 2.3  | **Refactor** | Goal データ型の改善                 | `types/goal.types.ts`    | [x]  |
| 2.4  | **Red**      | Supabase クライアントのテスト作成   | `lib/`                   | [x]  |
| 2.5  | **Green**    | Supabase クライアントの実装         | `lib/supabase.ts`        | [x]  |
| 2.6  | **Refactor** | Supabase クライアントの改善         | `lib/supabase.ts`        | [x]  |
| 2.7  | **Red**      | GoalForm コンポーネントのテスト作成 | `components/forms/`      | [x]  |
| 2.8  | **Green**    | GoalForm コンポーネントの実装       | `components/forms/`      | [x]  |
| 2.9  | **Refactor** | GoalForm コンポーネントの改善       | `components/forms/`      | [x]  |
| 2.10 | **Red**      | ゴール管理画面のテスト作成          | `app/(tabs)/__tests__/`  | [x]  |
| 2.11 | **Green**    | ゴール管理画面の実装                | `app/(tabs)/goals.tsx`   | [x]  |
| 2.12 | **Refactor** | ゴール管理画面の改善                | `app/(tabs)/goals.tsx`   | [x]  |
| 2.13 | **Red**      | 認証機能のテスト作成                | `hooks/`                 | [x]  |
| 2.14 | **Green**    | 認証機能の実装                      | `hooks/useAuth.ts`       | [x]  |
| 2.15 | **Refactor** | 認証機能の改善                      | `hooks/useAuth.ts`       | [x]  |
| 2.16 | **Red**      | goals タブ追加のテスト作成          | `app/(tabs)/__tests__/`  | [x]  |
| 2.17 | **Green**    | \_layout.tsx に goals タブを追加    | `app/(tabs)/_layout.tsx` | [x]  |
| 2.18 | **Refactor** | タブ UI・アクセシビリティ改善       | `app/(tabs)/_layout.tsx` | [x]  |
| 2.19 | **Red**      | ログイン画面のテスト作成            | `app/auth/__tests__/`    | [x]  |
| 2.20 | **Green**    | ログイン画面の実装                  | `app/auth/login.tsx`     | [x]  |
| 2.21 | **Refactor** | ログイン画面の改善                  | `app/auth/login.tsx`     | [x]  |
| 2.22 | **Red**      | サインアップ画面のテスト作成        | `app/auth/__tests__/`    | [x]  |
| 2.23 | **Green**    | サインアップ画面の実装              | `app/auth/signup.tsx`    | [x]  |
| 2.24 | **Refactor** | サインアップ画面の改善              | `app/auth/signup.tsx`    | [x]  |
| 2.25 | **Red**      | 認証ガードのテスト作成              | `app/__tests__/`         | [x]  |
| 2.26 | **Green**    | 認証ガードの実装                    | `app/_layout.tsx`        | [x]  |
| 2.27 | **Refactor** | 認証ガードの改善                    | `app/_layout.tsx`        | [x]  |
| 2.28 | **Red**      | ホーム画面のテスト作成              | `app/(tabs)/__tests__/`  | [x]  |
| 2.29 | **Green**    | ホーム画面の最小実装                | `app/(tabs)/index.tsx`   | [x]  |
| 2.30 | **Refactor** | ホーム画面の改善                    | `app/(tabs)/index.tsx`   | [x]  |
| 2.31 | **Red**      | 設定画面のテスト作成                | `app/(tabs)/__tests__/`  | [x]  |
| 2.32 | **Green**    | 設定画面の実装                      | `app/(tabs)/settings.tsx`| [x]  |
| 2.33 | **Refactor** | 設定画面の改善                      | `app/(tabs)/settings.tsx`| [x]  |

#### Week 3: MVP 1段目完成・リリース

| Task | TDD Phase    | 説明                                | 配置場所                 | 完了 |
| ---- | ------------ | ----------------------------------- | ------------------------ | ---- |
| 3.1  | **Red**      | 簡易ゴール完了機能のテスト作成      | `components/ui/`         | [x]  |
| 3.2  | **Green**    | 簡易ゴール完了機能の実装            | `components/ui/`         | [x]  |
| 3.3  | **Refactor** | 簡易ゴール完了機能の改善            | `components/ui/`         | [x]  |
| 3.4  | **UI/UX**    | 認証画面の画面カタログ適用          | `app/auth/`              | [x]  |
| 3.5  | **UI/UX**    | ホーム画面の画面カタログ適用        | `app/(tabs)/index.tsx`   | [x]  |
| 3.6  | **UI/UX**    | ゴール管理画面の画面カタログ適用    | `app/(tabs)/goals.tsx`   | [x]  |
| 3.7  | **UI/UX**    | 設定画面の画面カタログ適用          | `app/(tabs)/settings.tsx`| [x]  |
| 3.8  | **UI/UX**    | ゴール作成モーダルの画面カタログ適用| `app/modal/`             | [ ]  |
| 3.9  | **Release**  | App Store/Google Play 登録準備      | `app.json`, `eas.json`   | [ ]  |
| 3.10 | **Release**  | MVP 1段目リリース実行               | EAS Build & Submit       | [ ]  |

#### 画面カタログ適用タスクの詳細

**Task 3.4-3.8 の目的**：
- MVP1段目画面カタログ（`html/mvp1-screen-catalog.html`）に従った統一されたUI/UXの実装
- Flow Finderブランドカラー（#FFC400, #212121）の正確な適用
- NativeWind + React Native互換スタイルの統一
- アクセシビリティ対応とユーザビリティ向上

**適用する主要デザイン要素**：
- **ブランドカラー**: primary="#FFC400", secondary="#212121"
- **タイポグラフィ**: Font weight, size, color の統一
- **レイアウト**: Padding, margin, border-radius の統一
- **フォーム要素**: Input, Button スタイルの統一
- **ナビゲーション**: Tab bar デザインの統一

**実装アプローチ**：
1. 画面カタログの該当セクションを参照
2. 現在の実装と比較してスタイルギャップを特定
3. NativeWind クラスで統一されたスタイルに更新
4. アクセシビリティ要素の追加・改善

---

## MVP 2段目以降の追加機能

### MVP 2段目（Week 4–6）: 無料プラン完全版（点検セッション機能）

#### Week 4: オンボーディング・セッションステップ 1-3

| Task | TDD Phase    | 説明                                    | 配置場所                       | 完了 |
| ---- | ------------ | --------------------------------------- | ------------------------------ | ---- |
| 4.1  | **Red**      | ProgressBar コンポーネントのテスト作成  | `components/ui/`               | [ ]  |
| 4.2  | **Green**    | ProgressBar コンポーネントの実装        | `components/ui/`               | [ ]  |
| 4.3  | **Refactor** | ProgressBar コンポーネントの改善        | `components/ui/`               | [ ]  |
| 4.4  | **Red**      | SessionStep1 コンポーネントのテスト作成 | `components/features/session/` | [ ]  |
| 4.5  | **Green**    | SessionStep1 コンポーネントの実装       | `components/features/session/` | [ ]  |
| 4.6  | **Refactor** | SessionStep1 コンポーネントの改善       | `components/features/session/` | [ ]  |
| 4.7  | **Red**      | SessionStep2 コンポーネントのテスト作成 | `components/features/session/` | [ ]  |
| 4.8  | **Green**    | SessionStep2 コンポーネントの実装       | `components/features/session/` | [ ]  |
| 4.9  | **Refactor** | SessionStep2 コンポーネントの改善       | `components/features/session/` | [ ]  |
| 4.10 | **Red**      | SessionStep3 コンポーネントのテスト作成 | `components/features/session/` | [ ]  |
| 4.11 | **Green**    | SessionStep3 コンポーネントの実装       | `components/features/session/` | [ ]  |
| 4.12 | **Refactor** | SessionStep3 コンポーネントの改善       | `components/features/session/` | [ ]  |
| 4.13 | **Red**      | Onboarding コンポーネントのテスト作成   | `components/features/onboarding/` | [ ]  |
| 4.14 | **Green**    | Onboarding コンポーネントの実装         | `components/features/onboarding/` | [ ]  |
| 4.15 | **Refactor** | Onboarding コンポーネントの改善         | `components/features/onboarding/` | [ ]  |
| 4.16 | **Red**      | Onboarding フロー管理のテスト作成       | `hooks/`                       | [ ]  |
| 4.17 | **Green**    | useOnboarding カスタムフックの実装      | `hooks/useOnboarding.ts`       | [ ]  |
| 4.18 | **Refactor** | useOnboarding カスタムフックの改善      | `hooks/useOnboarding.ts`       | [ ]  |

#### Week 5: セッションステップ 4-5（AI機能なし）とまとめ

| Task | TDD Phase    | 説明                                    | 配置場所                       | 完了 |
| ---- | ------------ | --------------------------------------- | ------------------------------ | ---- |
| 5.1  | **Red**      | 解決策テンプレート機能のテスト作成      | `lib/templates/`               | [ ]  |
| 5.2  | **Green**    | 解決策テンプレート機能の実装            | `lib/templates/solutions.ts`   | [ ]  |
| 5.3  | **Refactor** | 解決策テンプレート機能の改善            | `lib/templates/solutions.ts`   | [ ]  |
| 5.4  | **Red**      | SessionStep4 コンポーネントのテスト作成 | `components/features/session/` | [ ]  |
| 5.5  | **Green**    | SessionStep4 コンポーネントの実装       | `components/features/session/` | [ ]  |
| 5.6  | **Refactor** | SessionStep4 コンポーネントの改善       | `components/features/session/` | [ ]  |
| 5.7  | **Red**      | SessionStep5 コンポーネントのテスト作成 | `components/features/session/` | [ ]  |
| 5.8  | **Green**    | SessionStep5 コンポーネントの実装       | `components/features/session/` | [ ]  |
| 5.9  | **Refactor** | SessionStep5 コンポーネントの改善       | `components/features/session/` | [ ]  |
| 5.10 | **Red**      | SessionWizard 統合テスト作成            | `components/features/session/` | [ ]  |
| 5.11 | **Green**    | SessionWizard 統合実装                  | `components/features/session/` | [ ]  |
| 5.12 | **Refactor** | SessionWizard 統合改善                  | `components/features/session/` | [ ]  |

#### Week 6: 制限機能・プレミアム誘導UI・MVP 2段目リリース

| Task | TDD Phase    | 説明                                  | 配置場所                     | 完了 |
| ---- | ------------ | ------------------------------------- | ---------------------------- | ---- |
| 6.1  | **Red**      | 制限管理システムのテスト作成          | `lib/subscription/`          | [ ]  |
| 6.2  | **Green**    | 制限管理システムの実装                | `lib/subscription/limits.ts` | [ ]  |
| 6.3  | **Refactor** | 制限管理システムの改善                | `lib/subscription/limits.ts` | [ ]  |
| 6.4  | **Red**      | プレミアム誘導UIのテスト作成          | `components/ui/`             | [ ]  |
| 6.5  | **Green**    | プレミアム誘導UIの実装                | `components/ui/UpgradePrompt.tsx` | [ ]  |
| 6.6  | **Refactor** | プレミアム誘導UIの改善                | `components/ui/UpgradePrompt.tsx` | [ ]  |
| 6.7  | **Red**      | 基本ダッシュボードのテスト作成        | `app/(tabs)/__tests__/`      | [ ]  |
| 6.8  | **Green**    | 基本ダッシュボード画面の実装          | `app/(tabs)/dashboard.tsx`   | [ ]  |
| 6.9  | **Refactor** | 基本ダッシュボード画面の改善          | `app/(tabs)/dashboard.tsx`   | [ ]  |
| 6.10 | **Release**  | MVP 2段目リリース実行                 | EAS Build & Submit           | [ ]  |

---

### MVP 3段目（Week 7–8）: プレミアム機能（AI・課金システム）

#### Week 7: AI機能実装

| Task | TDD Phase    | 説明                                    | 配置場所                       | 完了 |
| ---- | ------------ | --------------------------------------- | ------------------------------ | ---- |
| 7.1  | **Red**      | AI 提案機能のテスト作成                 | `lib/api/ai.ts`                | [ ]  |
| 7.2  | **Green**    | AI 提案機能の実装                       | `lib/api/ai.ts`                | [ ]  |
| 7.3  | **Refactor** | AI 提案機能の改善                       | `lib/api/ai.ts`                | [ ]  |
| 7.4  | **Red**      | AI次のゴール提案機能のテスト作成        | `lib/api/__tests__/`           | [ ]  |
| 7.5  | **Green**    | AI次のゴール提案機能の実装              | `lib/api/ai.ts`                | [ ]  |
| 7.6  | **Refactor** | AI次のゴール提案機能の改善              | `lib/api/ai.ts`                | [ ]  |

#### Week 8: 課金システム・プレミアム機能・MVP 3段目リリース

| Task | TDD Phase    | 説明                                  | 配置場所                     | 完了 |
| ---- | ------------ | ------------------------------------- | ---------------------------- | ---- |
| 8.1  | **Red**      | 課金機能のテスト作成                  | `lib/revenue-cat.ts`         | [ ]  |
| 8.2  | **Green**    | 課金機能の実装                        | `lib/revenue-cat.ts`         | [ ]  |
| 8.3  | **Refactor** | 課金機能の改善                        | `lib/revenue-cat.ts`         | [ ]  |
| 8.4  | **Red**      | プレミアム機能統合のテスト作成        | `hooks/`                     | [ ]  |
| 8.5  | **Green**    | プレミアム機能統合の実装              | `hooks/usePremium.ts`        | [ ]  |
| 8.6  | **Refactor** | プレミアム機能統合の改善              | `hooks/usePremium.ts`        | [ ]  |
| 8.7  | **Red**      | 詳細分析ダッシュボードのテスト作成    | `components/charts/`         | [ ]  |
| 8.8  | **Green**    | 詳細分析ダッシュボードの実装          | `components/charts/`         | [ ]  |
| 8.9  | **Refactor** | 詳細分析ダッシュボードの改善          | `components/charts/`         | [ ]  |
| 8.10 | **Release**  | MVP 3段目リリース実行                 | EAS Build & Submit           | [ ]  |

---

## 🗑️ 旧実装計画（参考）

以下は3段階MVPに再編前の旧実装計画です。参考として残しています。

#### 旧 Week 5: ダッシュボードとアクション管理

| Task | TDD Phase    | 説明                                  | 配置場所                     | 完了 |
| ---- | ------------ | ------------------------------------- | ---------------------------- | ---- |
| OLD5.1  | **Red**      | ActionList コンポーネントのテスト作成 | `components/features/goals/` | [ ]  |
| 5.2  | **Green**    | ActionList コンポーネントの実装       | `components/features/goals/` | [ ]  |
| 5.3  | **Refactor** | ActionList コンポーネントの改善       | `components/features/goals/` | [ ]  |
| 5.4  | **Red**      | Chart コンポーネントのテスト作成      | `components/charts/`         | [ ]  |
| 5.5  | **Green**    | Chart コンポーネントの実装            | `components/charts/`         | [ ]  |
| 5.6  | **Refactor** | Chart コンポーネントの改善            | `components/charts/`         | [ ]  |
| 5.7  | **Red**      | Dashboard 画面のテスト作成            | `app/(tabs)/__tests__/`      | [ ]  |
| 5.8  | **Green**    | Dashboard 画面の実装                  | `app/(tabs)/dashboard.tsx`   | [ ]  |
| 5.9  | **Refactor** | Dashboard 画面の改善                  | `app/(tabs)/dashboard.tsx`   | [ ]  |

#### Week 5.5: ゴール完了機能（Phase 2.5）

| Task | TDD Phase    | 説明                                      | 配置場所                         | 完了 |
| ---- | ------------ | ----------------------------------------- | -------------------------------- | ---- |
| 5.10 | **Red**      | ゴール完了APIクライアントのテスト作成     | `lib/api/__tests__/`             | [ ]  |
| 5.11 | **Green**    | ゴール完了APIクライアントの実装           | `lib/api/goals.ts`               | [ ]  |
| 5.12 | **Refactor** | ゴール完了APIクライアントの改善           | `lib/api/goals.ts`               | [ ]  |
| 5.13 | **Red**      | Achievement記録機能のテスト作成           | `lib/api/__tests__/`             | [ ]  |
| 5.14 | **Green**    | Achievement記録機能の実装                 | `lib/api/achievements.ts`        | [ ]  |
| 5.15 | **Refactor** | Achievement記録機能の改善                 | `lib/api/achievements.ts`        | [ ]  |
| 5.16 | **Red**      | ゴール完了モーダルのテスト作成            | `app/modal/__tests__/`           | [ ]  |
| 5.17 | **Green**    | ゴール完了モーダルの実装                  | `app/modal/goal-completion.tsx`  | [ ]  |
| 5.18 | **Refactor** | ゴール完了モーダルの改善                  | `app/modal/goal-completion.tsx`  | [ ]  |
| 5.19 | **Red**      | RatingStarsコンポーネントのテスト作成     | `components/ui/__tests__/`       | [ ]  |
| 5.20 | **Green**    | RatingStarsコンポーネントの実装           | `components/ui/RatingStars.tsx`  | [ ]  |
| 5.21 | **Refactor** | RatingStarsコンポーネントの改善           | `components/ui/RatingStars.tsx`  | [ ]  |
| 5.22 | **Red**      | 達成済みゴール表示のテスト作成            | `components/features/goals/__tests__/` | [ ]  |
| 5.23 | **Green**    | AchievedGoalsListコンポーネントの実装     | `components/features/goals/`     | [ ]  |
| 5.24 | **Refactor** | AchievedGoalsListコンポーネントの改善     | `components/features/goals/`     | [ ]  |
| 5.25 | **Red**      | 成長レベルシステムのテスト作成            | `lib/__tests__/`                 | [ ]  |
| 5.26 | **Green**    | 成長レベルシステムの実装                  | `lib/growth-level.ts`            | [ ]  |
| 5.27 | **Refactor** | 成長レベルシステムの改善                  | `lib/growth-level.ts`            | [ ]  |
| 5.28 | **Red**      | AI次のゴール提案機能のテスト作成（Premium）| `lib/api/__tests__/`             | [ ]  |
| 5.29 | **Green**    | AI次のゴール提案機能の実装（Premium）     | `lib/api/ai.ts`                  | [ ]  |
| 5.30 | **Refactor** | AI次のゴール提案機能の改善（Premium）     | `lib/api/ai.ts`                  | [ ]  |

### Phase 3（Week 6）: App Store リリース準備

#### Week 6: 通知機能とリリース準備

| Task | TDD Phase       | 説明                   | 配置場所                   | 完了 |
| ---- | --------------- | ---------------------- | -------------------------- | ---- |
| 6.1  | **Red**         | 通知機能のテスト作成   | `lib/notifications.ts`     | [ ]  |
| 6.2  | **Green**       | 通知機能の実装         | `lib/notifications.ts`     | [ ]  |
| 6.3  | **Refactor**    | 通知機能の改善         | `lib/notifications.ts`     | [ ]  |
| 6.4  | **Red**         | 課金機能のテスト作成   | `lib/revenue-cat.ts`       | [ ]  |
| 6.5  | **Green**       | 課金機能の実装         | `lib/revenue-cat.ts`       | [ ]  |
| 6.6  | **Refactor**    | 課金機能の改善         | `lib/revenue-cat.ts`       | [ ]  |
| 6.7  | **Integration** | E2E テストの実行と修正 | `__tests__/e2e/`           | [ ]  |
| 6.8  | **Release**     | アプリストア審査準備   | `app.json`, `eas.json`設定 | [ ]  |

## 5. Flow Finder 特有の実装例

### 5.1 コンポーネント実装例

#### Button コンポーネント（Flow Finder ブランド対応）

```typescript
// Red Phase: テスト作成
// ファイル配置: components/ui/__tests__/Button.test.tsx
describe("Button コンポーネント", () => {
  it("Flow Finderブランドカラー（#FFC400）が適用されること", () => {
    const { getByText } = render(<Button variant="primary">テスト</Button>);
    const button = getByText("テスト").parent;
    expect(button).toHaveStyle({ backgroundColor: "#FFC400" });
  });
});

// Green Phase: 最小実装
// ファイル配置: components/ui/Button.tsx
const Button: React.FC<ButtonProps> = ({ variant = "primary", children }) => (
  <Pressable
    style={{ backgroundColor: variant === "primary" ? "#FFC400" : "#212121" }}
  >
    <Text>{children}</Text>
  </Pressable>
);

// Refactor Phase: NativeWind + アクセシビリティ対応
// ファイル配置: components/ui/Button.tsx
const Button: React.FC<ButtonProps> = ({ variant = "primary", children }) => (
  <Pressable
    className={`px-4 py-2 rounded-lg ${
      variant === "primary" ? "bg-[#FFC400]" : "bg-[#212121]"
    }`}
    accessibilityRole="button"
  >
    <Text className="text-center font-medium">{children}</Text>
  </Pressable>
);
```

### 5.2 セッション機能実装例

#### 5 ステップウィザード

```typescript
// Red Phase: セッション進捗テスト
// ファイル配置: components/features/session/__tests__/SessionWizard.test.tsx
describe("SessionWizard", () => {
  it("5ステップ全てを完了できること", async () => {
    const { getByText, getByTestId } = render(<SessionWizard />);

    // Step 1: 現状特定
    fireEvent.changeText(getByTestId("current-task-input"), "資格試験の勉強");
    fireEvent.press(getByText("次へ"));

    // Step 2: 原因分析
    fireEvent.changeText(getByTestId("cause-input"), "時間がない");
    fireEvent.press(getByText("次へ"));

    // ... Step 3-5 のテスト

    expect(getByText("セッション完了")).toBeInTheDocument();
  });
});

// Green Phase: 最小実装
// ファイル配置: components/features/session/SessionWizard.tsx
```

### 5.3 Supabase 連携実装例

#### ゴールデータの CRUD

```typescript
// Red Phase: API テスト
// ファイル配置: lib/api/__tests__/goals.test.ts
describe("Goal API", () => {
  it("ゴール作成時にSupabaseに保存されること", async () => {
    const mockInsert = jest.spyOn(supabase.from("goals"), "insert");

    await createGoal({ title: "英語学習", priority: 1 });

    expect(mockInsert).toHaveBeenCalledWith({
      title: "英語学習",
      priority: 1,
      user_id: "mock-user-id",
    });
  });
});

// Green Phase: 最小実装
// ファイル配置: lib/api/goals.ts
```

## 6. Flow Finder 固有の成功指標

### 6.1 Phase 1 成功指標（ゴール設定機能）

#### 機能要件達成度

- **ゴール CRUD**: 作成・読み取り・更新・削除すべて動作
- **Supabase Auth**: ログイン・ログアウト・セッション管理
- **ブランド UI**: #FFC400 ブランドカラーの適用
- **Expo Router**: タブナビゲーション動作

#### TDD 品質指標

- **テストカバレッジ**: Button, Input, Card, GoalForm で 80%以上
- **テスト実行時間**: 3 分以内
- **モック活用**: Supabase、Navigation の適切なモック

### 6.2 Phase 2 以降の指標

#### 点検セッション機能

- **5 ステップウィザード**: 全ステップの完了率 90%以上
- **AI 提案機能**: OpenAI API 応答時間 3 秒以内
- **自動保存**: セッション中断・再開機能の動作確認

#### 実装効率指標

- **開発速度**: 1 週間で 5 機能以上完了
- **バグ修正時間**: 平均 2 時間以内
- **デプロイ成功率**: EAS Build で 100%

---

基本的な TDD 手法・品質保証・ブランチ戦略については **[TDD 実装ガイド](../generic/tdd_generic_guide.md)** を参照してください。このドキュメントは Flow Finder 特有の実装例とスケジュールに焦点を当てています。

## 7. タスク完了管理ルール

### 7.1 完了チェック更新ルール

**🚨 必須ルール**: 各タスクが完了したら、**必ずこのドキュメントの完了チェックを更新してください**。

#### 🔥 強制実行手順（例外なし）

1. **タスク完了時**: `[ ]` を `[x]` に変更（**必須**）
2. **実装確認**: テストが通ることを確認
3. **品質確認**: コードレビュー・リファクタリング完了
4. **ドキュメント更新**: 即座に完了ステータスを更新（**必須**）

#### ⚠️ 重要な注意点

- **タスク実装後は必ず Edit ツールでこのドキュメントを更新する**
- **進捗管理セクション（7.3）も同時に更新する**
- **更新を忘れた場合は、次のタスクに進む前に必ず更新する**

#### 完了基準

- **Red Phase**: テストファイルが作成され、失敗することを確認
- **Green Phase**: テストが成功する最小実装が完了
- **Refactor Phase**: コード品質の改善が完了（テストは引き続き成功）

### 7.2 標準実装ワークフロー

**重要**: Week 2 以降の実装では、以下の標準ワークフローを必須とします。

#### 実装ワークフロー（11 ステップ）

1. **Issue 作成**: GitHub Issue を立てる
2. **ブランチ作成**: タスク用ブランチを切る
3. **実装**: TDD（Red-Green-Refactor）で実装
4. **確認**: Issue の完了条件をチェック
5. **ドキュメント更新**: 実装計画の進捗表と進捗管理セクション更新
6. **コミット・プッシュ**: 変更をコミット・プッシュ
7. **Issue クローズ**: GitHub Issue をクローズ
8. **PR 作成**: Pull Request を作成
9. **PR マージ**: develop ブランチにマージ・フィーチャーブランチ削除
10. **ブランチ切替**: develop ブランチに戻る
11. **最新状態取得**: `git pull origin develop` で最新状態を取得

#### イシュー作成ルール

- **タイトル**: `[Task X.Y] タスク名 (TDD Phase)` 形式
- **例**: `[Task 2.2] Goal データ型の実装 (Green Phase)`
- **説明**: 実装内容・配置場所・完了条件を明記
- **ラベル**: 対応する Phase のラベルを付与
  - `red-phase`: テスト作成（Red Phase）
  - `green-phase`: 最小実装（Green Phase）
  - `refactor-phase`: 改善（Refactor Phase）

#### ブランチ・コミット・PR 運用

- **ブランチ名**: `feat/X.Y-feature-name` 形式
  - 例: `feat/2.2-goal-data-types`
- **コミットメッセージ**: `feat: [Task X.Y] 実装内容の簡潔な説明 (TDD Phase) (close #<issue-number>)`
  - 例: `feat: [Task 2.2] Goal データ型の実装 (Green Phase) (close #11)`
- **プッシュ**: 実装完了後に即座にプッシュ
- **PR 作成**: `gh pr create` でプルリクエスト作成
- **PR マージ**: `gh pr merge --merge --delete-branch` で develop ブランチにマージ
- **ブランチ管理**: マージ後は develop ブランチに戻り `git pull origin develop` で最新状態を取得

#### Issue クローズ手順

1. **完了条件チェック**: Issue に記載された完了条件を全て確認
2. **テスト実行**: 関連するテストが全て成功することを確認
3. **Issue 更新**: 完了条件にチェックマーク（`[x]`）を付与
4. **Issue クローズ**: `gh issue close <issue-number>` でクローズ

### 7.3 進捗管理

#### 🎯 MVP 3段階リリース進捗

- **MVP 1段目（Week 1-3）**: Task 1.1〜3.4
  - Week 1 完了: Task 1.1〜1.9（全て[x]）
  - Week 2 完了: Task 2.1〜2.33（全て[x]）
  - Week 3 残り: Task 3.5,3.7〜3.10（[ ]）
  - **次の実装**: Task 3.8（ゴール作成モーダルの画面カタログ適用 - UI/UX Phase）が最優先

- **MVP 2段目（Week 4-6）**: Task 4.1〜6.10
  - 点検セッション機能（AI機能なし）、制限機能、プレミアム誘導UI
  - **目標**: Week 6でMVP 2段目リリース

- **MVP 3段目（Week 7-8）**: Task 7.1〜8.10
  - AI機能、課金システム、プレミアム機能
  - **目標**: Week 8でMVP 3段目リリース（本格収益化）

#### 🔄 3段階MVP再編による変更点

**変更前**：6週間で β版リリース（単一リリース）
**変更後**：8週間で3段階MVPリリース（段階的リリース）

**利点**：
- リスク分散：段階的な市場検証
- 早期フィードバック：MVP1段目（3週間目）で初回検証
- 収益化検証：MVP2段目で無料プラン、MVP3段目でプレミアム機能

**旧ゴール完了機能の再配置**:
- MVP1段目：簡易ゴール完了機能（Task 3.0-3.2）
- MVP3段目：高度なゴール完了機能（AI提案、成長レベル）

**🚨 Claude Code 使用時の必須ルール**:

1. **タスク完了時**: 必ず Edit ツールでこのドキュメントの完了チェック（`[ ]` → `[x]`）を更新
2. **進捗管理更新**: 7.3 セクションの「次の実装」も同時に更新
3. **確認手順**: 更新後は必ず Read ツールでドキュメントを確認
4. **例外なし**: この手順を省略することは絶対に禁止

**⚠️ 重要**: タスク実装後にドキュメント更新を忘れた場合、次のタスクに進む前に必ず更新すること。

#### 🚨 必須TODOリスト項目（Claude Code用）

**Week 2以降のタスク実行時は、必ず以下のTODO項目をすべて含めてください**：

```
1. GitHub Issue 作成: [Task X.Y] タスク名 (TDD Phase)
2. ブランチ作成: feat/X.Y-feature-name
3. TDD実装: Red/Green/Refactor Phase実装
4. Issue 完了条件チェック
5. 実装計画更新：Task X.Y の [ ] → [x] + 進捗管理セクション更新
6. コミット・プッシュ: feat形式メッセージでブランチにコミット
7. GitHub Issue クローズ
8. PR 作成: developブランチベースでPull Request作成
9. PR マージ: developブランチにマージ・フィーチャーブランチ削除
10. ブランチ切替: developブランチに戻る
11. 最新状態取得: git pull origin develop実行
```

**⚠️ 重要**: これらのTODO項目を省略することは絶対に禁止です。すべてのステップを完了してからタスク完了とみなします。
