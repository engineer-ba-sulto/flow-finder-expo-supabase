# 標準実装ワークフロー — GitHub Issue + TDD + PR 管理

## 1. 🚨 プロジェクト固有のカスタマイズ（まず最初に設定）

このワークフローは汎用的な基盤です。各プロジェクトでは**運用開始前に**以下をカスタマイズしてください：

### カスタマイズ要素
- **ブランチ名**: メインブランチ名（main/develop）
- **PRベースブランチ**: PR作成時のマージ先ブランチ（--base オプション）
- **ラベル名**: プロジェクト固有のラベル
- **テストコマンド**: プロジェクトのテスト実行方法
- **ドキュメント更新**: プロジェクト固有のドキュメント
- **コミットメッセージ**: プロジェクト固有の形式
- **CI/CD自動化**: GitHub Actions移行対象フロー（下記参照）

### GitHub Actions移行可能フロー

以下のステップはGitHub Actionsで自動化できます：

**PR作成時トリガー**:
- ✅ **ステップ4**: テスト実行・確認（自動テスト実行）
- ✅ **ステップ5**: ドキュメント更新（自動生成・更新）
- ✅ **ステップ6**: Issue クローズ（PR マージ時に自動）

**PR マージ時トリガー**:
- ✅ **ステップ8**: PR マージ（自動マージ条件設定）
- ✅ **ステップ9**: ブランチ切替・プル（不要化）
- ✅ **ステップ10**: 次タスク準備（ブランチクリーンアップ自動化）

**手動維持推奨**:
- 🔸 **ステップ1**: Issue 作成（人的判断が必要）
- 🔸 **ステップ2**: ブランチ作成（開発者の作業）
- 🔸 **ステップ3**: 実装（コーディング作業）
- 🔸 **ステップ7**: コミット・プッシュ（開発者の作業）

### 実装例参照
プロジェクト固有の実装例については、各プロジェクトの `docs/product-specific/` ディレクトリを参照してください。

---

## 2. 概要

このドキュメントは、GitHub Issue と TDD（Test-Driven Development）を組み合わせた標準的な実装ワークフローを定義します。どのプロジェクトでも適用可能な汎用的なガイドラインです。

## 3. 適用対象

- **開発手法**: TDD（Red-Green-Refactor サイクル）
- **バージョン管理**: Git + GitHub
- **ブランチ戦略**: Feature Branch Workflow
- **イシュー管理**: GitHub Issues
- **CI/CD**: Pull Request ベースのレビュー・マージ

## 4. 標準実装ワークフロー（10ステップ）

### 完全版ワークフロー

1. **Issue 作成**: GitHub Issue を立てる
2. **ブランチ作成**: タスク用ブランチを切る
3. **実装**: TDD（Red-Green-Refactor）で実装
4. **テスト実行・確認**: 関連テストの実行と Issue 完了条件チェック
5. **ドキュメント更新**: プロジェクト固有のドキュメント更新
6. **クローズ**: Issue をクローズ
7. **コミット・プッシュ**: 変更をコミット・プッシュ
8. **PR 作成・マージ**: Pull Request 作成後、メインブランチにマージ
9. **ブランチ切替・プル**: メインブランチに戻って最新状態をプル
10. **次タスク準備**: 次のタスクの確認とブランチクリーンアップ

## 5. 各ステップの詳細

### ステップ 1: Issue 作成

#### Issue タイトル規則
```
[Task X.Y] タスク名 (TDD Phase)
```

**例**:
- `[Task 2.1] User データ型のテスト作成 (Red Phase)`
- `[Task 2.2] User データ型の実装 (Green Phase)`
- `[Task 2.3] User データ型の改善 (Refactor Phase)`

#### Issue 内容テンプレート
```markdown
## 概要
[タスクの簡潔な説明]

## 実装内容
- [具体的な実装項目1]
- [具体的な実装項目2]
- [具体的な実装項目3]

## 配置場所
- [ファイルパス1]
- [ファイルパス2]

## 完了条件
- [ ] [完了条件1]
- [ ] [完了条件2]
- [ ] [完了条件3]
- [ ] テストが期待通りに動作する
- [ ] ファイルの配置場所が正しい

## TDD Phase
[Red/Green/Refactor] Phase - [フェーズの説明]

## 関連タスク
Task X.Y (Week N)
```

#### ラベル付与
- `red-phase`: テスト作成（Red Phase）
- `green-phase`: 最小実装（Green Phase）
- `refactor-phase`: 改善（Refactor Phase）

### ステップ 2: ブランチ作成

#### ブランチ命名規則
```bash
git checkout -b feat/X.Y-feature-name
```

**例**:
- `feat/2.1-user-data-types`
- `feat/3.5-payment-integration`
- `feat/1.2-button-component`

#### ブランチ作成前の確認
```bash
# メインブランチが最新であることを確認
git checkout main  # または develop
git pull origin main  # または develop
```

### ステップ 3: 実装（TDD サイクル）

#### Red Phase（テスト作成）
1. **失敗するテストを作成**
   ```bash
   # テストファイル作成
   touch src/components/__tests__/Button.test.tsx
   ```

2. **テスト実行して失敗を確認**
   ```bash
   npm test Button.test.tsx
   # または
   yarn test Button.test.tsx
   ```

#### Green Phase（最小実装）
1. **テストを通す最小限のコードを実装**
2. **テスト実行して成功を確認**
   ```bash
   npm test Button.test.tsx
   ```

#### Refactor Phase（改善）
1. **コード品質の改善**
   - 重複コードの削除
   - 可読性の向上
   - パフォーマンス最適化
2. **テスト実行して回帰がないことを確認**

### ステップ 4: テスト実行・確認

#### 全体テスト実行
```bash
# 全テスト実行
npm test
# または
yarn test

# 特定のテストファイル実行
npm test -- --testPathPattern="Button"
```

#### 完了条件チェック
1. **Issue の完了条件を全て確認**
2. **関連するテストが全て成功することを確認**
3. **エラーログやワーニングがないことを確認**

### ステップ 5: ドキュメント更新

#### プロジェクト固有のドキュメント更新例
- 実装計画の進捗表更新（`[ ]` → `[x]`）
- 進捗管理セクションの「次の実装」更新
- API ドキュメントの更新
- README の機能一覧更新

### ステップ 6: Issue クローズ

```bash
gh issue close <issue-number> --comment "完了条件をすべて達成:
✅ [完了条件1]
✅ [完了条件2]
✅ [完了条件3]

[TDD Phase]が完了しました。"
```

### ステップ 7: コミット・プッシュ

#### コミットメッセージ規則
```bash
git add .
git commit -m "$(cat <<'EOF'
feat: [Task X.Y] 実装内容の簡潔な説明 (TDD Phase) (close #<issue-number>)

📝 [実装内容の詳細]
- ✅ [実装項目1]
- ✅ [実装項目2]
- ✅ [実装項目3]

📍 [ファイル配置情報]
📋 [ドキュメント更新情報]

🚨 [TDD Phase] 完了 - [テスト結果など]
次: [次のタスク概要]

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

git push -u origin feat/X.Y-feature-name
```

### ステップ 8: PR 作成・マージ

#### PR 作成
```bash
# ベースブランチ（マージ先）を明示的に指定してPR作成
gh pr create --base develop --title "feat: [Task X.Y] 実装内容 (TDD Phase) (#<issue-number>)" --body "$(cat <<'EOF'
## 概要
[PR の概要]

## 実装内容
[実装内容のリスト]

## 変更ファイル
[変更されたファイルのリスト]

## テスト結果
[テスト実行結果]

## TDD進捗
- ✅ **[Current Phase]完了**: [フェーズの説明]
- ⏳ **[Next Phase]**: [次フェーズの予定]

## 関連Issue
- Closes #<issue-number>

🤖 Generated with [Claude Code](https://claude.ai/code)
EOF
)"
```

#### PR マージ
```bash
gh pr merge <pr-number> --merge --delete-branch
```

### ステップ 9: ブランチ切替・プル

```bash
git checkout main  # または develop
git pull origin main  # または develop
```

### ステップ 10: 次タスク準備

#### ローカルブランチクリーンアップ（オプション）
```bash
# マージ済みブランチの確認
git branch --merged

# 不要なローカルブランチの削除
git branch -d feat/X.Y-feature-name
```

#### 次のタスクの確認
1. **プロジェクト実装計画の確認**
2. **次に着手すべきタスクの特定**
3. **依存関係やブロッカーの確認**

## 6. ブランチ戦略

### 推奨ブランチ構成
```
main (または master)
├── develop (開発統合ブランチ)
│   ├── feat/1.1-feature-a
│   ├── feat/1.2-feature-b
│   └── feat/2.1-feature-c
└── hotfix/critical-bug-fix
```

### ブランチ運用ルール
- **main/master**: 本番リリース用（安定版）
- **develop**: 開発統合用（次期リリース候補）
- **feat/X.Y-*****: 機能開発用（個別タスク）
- **hotfix/*****: 緊急修正用

## 7. 品質保証チェックリスト

### コード品質
- [ ] テストカバレッジが適切である
- [ ] コードスタイルが統一されている
- [ ] コメントや JSDoc が適切に記載されている
- [ ] エラーハンドリングが適切である

### TDD 品質
- [ ] Red Phase: テストが失敗することを確認済み
- [ ] Green Phase: テストが成功することを確認済み
- [ ] Refactor Phase: リファクタリング後もテストが成功する

### Git 管理品質
- [ ] コミットメッセージが規則に従っている
- [ ] ブランチ名が規則に従っている
- [ ] Issue とコミットが適切に関連付けられている

## 8. トラブルシューティング

### よくある問題と解決方法

#### Issue 作成時
**問題**: ラベルが存在しないエラー
```bash
could not add label: 'red-phase' not found
```
**解決**: ラベルなしで Issue を作成し、後から Web UI でラベルを追加

#### テスト実行時
**問題**: テストが見つからない
```bash
No tests found, exiting with code 1
```
**解決**: テストファイルのパスやファイル名を確認

#### PR マージ時
**問題**: マージコンフリクト発生
**解決**: 
```bash
git checkout feat/X.Y-feature-name
git rebase develop
# コンフリクト解決後
git push --force-with-lease
```


---

このワークフローを遵守することで、一貫性のある高品質な開発プロセスを維持できます。