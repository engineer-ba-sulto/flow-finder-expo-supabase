# TDD 実装計画 — Flow Finder プロジェクト

## 1. 概要

Flow Finder の **TDD 実装計画** です。基本的な TDD 手法については **[TDD 実装ガイド](../generic/tdd_generic_guide.md)** を参照してください。このドキュメントは Flow Finder 特有の実装例と具体的なスケジュールを記載します。

## 2. プロジェクト目標

- **MVP リリース**: 6 週間で β 版リリース
- **品質保証**: TDD アプローチによる高品質コード
- **早期フィードバック**: Phase 1 完了時点でデプロイ・検証

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

## 4. Flow Finder 実装ロードマップ

**Phase 1（2 週間）**: ゴール設定機能のみを実装し、早期デプロイとフィードバック獲得を目指します。  
**Phase 2（3 週間）**: 点検セッション機能を追加  
**Phase 3（1 週間）**: App Store リリース

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

### Phase 1（Week 1–2）: ゴール設定機能 - 最初のデプロイ

**Phase 1 の目標**:

- ゴール設定機能のみを実装（CRUD + 認証）
- 早期デプロイによるユーザーフィードバック獲得
- 基盤技術の検証（React Native + Supabase + EAS）

**Phase 1 完了後の成果物**:

- ユーザー認証機能（Supabase Auth）
- ゴール作成・編集・削除・一覧表示
- 基本 UI コンポーネント（Button, Input, Card）
- Expo アプリとしてデプロイ完了

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

| Task | TDD Phase    | 説明                                | 配置場所                | 完了 |
| ---- | ------------ | ----------------------------------- | ----------------------- | ---- |
| 2.1  | **Red**      | Goal データ型のテスト作成           | `types/`                | [x]  |
| 2.2  | **Green**    | Goal データ型の実装                 | `types/goal.types.ts`   | [x]  |
| 2.3  | **Refactor** | Goal データ型の改善                 | `types/goal.types.ts`   | [x]  |
| 2.4  | **Red**      | Supabase クライアントのテスト作成   | `lib/`                  | [x]  |
| 2.5  | **Green**    | Supabase クライアントの実装         | `lib/supabase.ts`       | [x]  |
| 2.6  | **Refactor** | Supabase クライアントの改善         | `lib/supabase.ts`       | [x]  |
| 2.7  | **Red**      | GoalForm コンポーネントのテスト作成 | `components/forms/`     | [x]  |
| 2.8  | **Green**    | GoalForm コンポーネントの実装       | `components/forms/`     | [x]  |
| 2.9  | **Refactor** | GoalForm コンポーネントの改善       | `components/forms/`     | [x]  |
| 2.10 | **Red**      | ゴール管理画面のテスト作成          | `app/(tabs)/__tests__/` | [ ]  |
| 2.11 | **Green**    | ゴール管理画面の実装                | `app/(tabs)/goals.tsx`  | [ ]  |
| 2.12 | **Refactor** | ゴール管理画面の改善                | `app/(tabs)/goals.tsx`  | [ ]  |
| 2.13 | **Red**      | 認証機能のテスト作成                | `hooks/`                | [ ]  |
| 2.14 | **Green**    | 認証機能の実装                      | `hooks/useAuth.ts`      | [ ]  |
| 2.15 | **Refactor** | 認証機能の改善                      | `hooks/useAuth.ts`      | [ ]  |
| 2.16 | **Deploy**   | Phase 1 デプロイ設定・実行          | `eas.json`設定          | [ ]  |

---

## Phase 1 完了後の追加機能（Phase 2 以降）

### Phase 2（Week 3–5）: 点検セッション機能

#### Week 3: セッションステップ 1-3

| Task | TDD Phase    | 説明                                    | 配置場所                       | 完了 |
| ---- | ------------ | --------------------------------------- | ------------------------------ | ---- |
| 3.1  | **Red**      | ProgressBar コンポーネントのテスト作成  | `components/ui/`               | [ ]  |
| 3.2  | **Green**    | ProgressBar コンポーネントの実装        | `components/ui/`               | [ ]  |
| 3.3  | **Refactor** | ProgressBar コンポーネントの改善        | `components/ui/`               | [ ]  |
| 3.4  | **Red**      | SessionStep1 コンポーネントのテスト作成 | `components/features/session/` | [ ]  |
| 3.5  | **Green**    | SessionStep1 コンポーネントの実装       | `components/features/session/` | [ ]  |
| 3.6  | **Refactor** | SessionStep1 コンポーネントの改善       | `components/features/session/` | [ ]  |
| 3.7  | **Red**      | SessionStep2 コンポーネントのテスト作成 | `components/features/session/` | [ ]  |
| 3.8  | **Green**    | SessionStep2 コンポーネントの実装       | `components/features/session/` | [ ]  |
| 3.9  | **Refactor** | SessionStep2 コンポーネントの改善       | `components/features/session/` | [ ]  |
| 3.10 | **Red**      | SessionStep3 コンポーネントのテスト作成 | `components/features/session/` | [ ]  |
| 3.11 | **Green**    | SessionStep3 コンポーネントの実装       | `components/features/session/` | [ ]  |
| 3.12 | **Refactor** | SessionStep3 コンポーネントの改善       | `components/features/session/` | [ ]  |

#### Week 4: セッションステップ 4-5 とまとめ

| Task | TDD Phase    | 説明                                    | 配置場所                       | 完了 |
| ---- | ------------ | --------------------------------------- | ------------------------------ | ---- |
| 4.1  | **Red**      | AI 提案機能のテスト作成                 | `lib/api/ai.ts`                | [ ]  |
| 4.2  | **Green**    | AI 提案機能の実装                       | `lib/api/ai.ts`                | [ ]  |
| 4.3  | **Refactor** | AI 提案機能の改善                       | `lib/api/ai.ts`                | [ ]  |
| 4.4  | **Red**      | SessionStep4 コンポーネントのテスト作成 | `components/features/session/` | [ ]  |
| 4.5  | **Green**    | SessionStep4 コンポーネントの実装       | `components/features/session/` | [ ]  |
| 4.6  | **Refactor** | SessionStep4 コンポーネントの改善       | `components/features/session/` | [ ]  |
| 4.7  | **Red**      | SessionStep5 コンポーネントのテスト作成 | `components/features/session/` | [ ]  |
| 4.8  | **Green**    | SessionStep5 コンポーネントの実装       | `components/features/session/` | [ ]  |
| 4.9  | **Refactor** | SessionStep5 コンポーネントの改善       | `components/features/session/` | [ ]  |
| 4.10 | **Red**      | SessionWizard 統合テスト作成            | `components/features/session/` | [ ]  |
| 4.11 | **Green**    | SessionWizard 統合実装                  | `components/features/session/` | [ ]  |
| 4.12 | **Refactor** | SessionWizard 統合改善                  | `components/features/session/` | [ ]  |

#### Week 5: ダッシュボードとアクション管理

| Task | TDD Phase    | 説明                                  | 配置場所                     | 完了 |
| ---- | ------------ | ------------------------------------- | ---------------------------- | ---- |
| 5.1  | **Red**      | ActionList コンポーネントのテスト作成 | `components/features/goals/` | [ ]  |
| 5.2  | **Green**    | ActionList コンポーネントの実装       | `components/features/goals/` | [ ]  |
| 5.3  | **Refactor** | ActionList コンポーネントの改善       | `components/features/goals/` | [ ]  |
| 5.4  | **Red**      | Chart コンポーネントのテスト作成      | `components/charts/`         | [ ]  |
| 5.5  | **Green**    | Chart コンポーネントの実装            | `components/charts/`         | [ ]  |
| 5.6  | **Refactor** | Chart コンポーネントの改善            | `components/charts/`         | [ ]  |
| 5.7  | **Red**      | Dashboard 画面のテスト作成            | `app/(tabs)/__tests__/`      | [ ]  |
| 5.8  | **Green**    | Dashboard 画面の実装                  | `app/(tabs)/dashboard.tsx`   | [ ]  |
| 5.9  | **Refactor** | Dashboard 画面の改善                  | `app/(tabs)/dashboard.tsx`   | [ ]  |

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
- **タスク実装後は必ずEditツールでこのドキュメントを更新する**
- **進捗管理セクション（7.3）も同時に更新する**
- **更新を忘れた場合は、次のタスクに進む前に必ず更新する**

#### 完了基準
- **Red Phase**: テストファイルが作成され、失敗することを確認
- **Green Phase**: テストが成功する最小実装が完了
- **Refactor Phase**: コード品質の改善が完了（テストは引き続き成功）

### 7.2 標準実装ワークフロー

**重要**: Week 2以降の実装では、以下の標準ワークフローを必須とします。

#### 実装ワークフロー（5ステップ）
1. **Issue作成**: GitHub Issueを立てる
2. **ブランチ作成**: タスク用ブランチを切る  
3. **実装**: TDD（Red-Green-Refactor）で実装
4. **確認**: Issueの完了条件をチェック
5. **クローズ**: Issueをクローズ
6. **コミット**: 変更をコミット

#### イシュー作成ルール
- **タイトル**: `[Task X.Y] タスク名 (TDD Phase)` 形式
- **例**: `[Task 2.2] Goal データ型の実装 (Green Phase)`
- **説明**: 実装内容・配置場所・完了条件を明記
- **ラベル**: 対応するPhaseのラベルを付与
  - `red-phase`: テスト作成（Red Phase）
  - `green-phase`: 最小実装（Green Phase）
  - `refactor-phase`: 改善（Refactor Phase）

#### ブランチ・コミット運用
- **ブランチ名**: `feat/X.Y-feature-name` 形式
  - 例: `feat/2.2-goal-data-types`
- **コミットメッセージ**: `feat: [Task X.Y] 実装内容の簡潔な説明 (TDD Phase) (close #<issue-number>)`
  - 例: `feat: [Task 2.2] Goal データ型の実装 (Green Phase) (close #11)`
- **プッシュ**: 実装完了後に即座にプッシュ

#### Issue クローズ手順
1. **完了条件チェック**: Issueに記載された完了条件を全て確認
2. **テスト実行**: 関連するテストが全て成功することを確認
3. **Issue更新**: 完了条件にチェックマーク（`[x]`）を付与
4. **Issue クローズ**: `gh issue close <issue-number>` でクローズ

### 7.3 進捗管理

- **Week 1完了**: Task 1.1〜1.9（全て[x]）
- **Week 2進行中**: Task 2.1〜2.16（2.1〜2.9まで[x]、2.10以降は[ ]）
- **次の実装**: Task 2.10（ゴール管理画面のテスト作成 - Red Phase）が最優先

**🚨 Claude Code 使用時の必須ルール**:
1. **タスク完了時**: 必ずEditツールでこのドキュメントの完了チェック（`[ ]` → `[x]`）を更新
2. **進捗管理更新**: 7.3セクションの「次の実装」も同時に更新
3. **確認手順**: 更新後は必ずReadツールでドキュメントを確認
4. **例外なし**: この手順を省略することは絶対に禁止

**⚠️ 重要**: タスク実装後にドキュメント更新を忘れた場合、次のタスクに進む前に必ず更新すること。
