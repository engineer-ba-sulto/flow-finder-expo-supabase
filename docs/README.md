# ドキュメント構成

このディレクトリは、Flow Finder プロジェクトのドキュメントをプロダクト依存度によって分類・整理しています。

## 📁 ディレクトリ構造

```
docs/
├── README.md                    # このファイル
├── product-specific/            # Flow Finder 固有のドキュメント
│   ├── monetization_model.md    # 収益化モデル詳細
│   ├── session_flow_details.md  # 点検セッション詳細フロー
│   ├── hint_system_design.md    # ヒント集システム設計
│   ├── file_structure.md        # ファイル構成詳細
│   ├── tdd_implementation_plan.md # TDD 実装計画
│   ├── screen_design.md         # 画面設計詳細
│   └── structure.md             # アプリ構造
└── generic/                     # 汎用開発ガイド
    ├── tdd_generic_guide.md     # TDD 実装ガイド
    ├── component_design_rules.md # 開発ルール
    └── file_naming_rules.md     # ファイル命名規則
```

## 🎯 プロダクト特化ドキュメント（`product-specific/`）

**Flow Finder 固有の仕様・設計・実装に関するドキュメント**

| ファイル                     | 内容                         | 用途                     |
| ---------------------------- | ---------------------------- | ------------------------ |
| `monetization_model.md`      | フリーミアム型収益化モデル   | ビジネスモデル・料金設定 |
| `session_flow_details.md`    | 5 ステップウィザード詳細     | 点検セッション機能設計   |
| `hint_system_design.md`      | 無料プラン向けヒント集       | ユーザー体験設計         |
| `file_structure.md`          | プロジェクト固有ファイル構成 | 開発環境構築             |
| `tdd_implementation_plan.md` | Flow Finder TDD 実装計画     | 開発スケジュール         |
| `screen_design.md`           | UI/UX デザイン仕様           | デザイン・実装ガイド     |
| `structure.md`               | アーキテクチャ・システム構成 | システム設計             |

**特徴**:

- Flow Finder の具体的な機能・仕様に特化
- プロダクト仕様変更時に更新が必要
- 他プロダクトへの直接的な適用は困難

## 🔧 汎用開発ガイド（`generic/`）

**どのプロダクトにも適用可能な開発手法・ルール・ガイドライン**

| ファイル                    | 内容                             | 用途           |
| --------------------------- | -------------------------------- | -------------- |
| `tdd_generic_guide.md`      | TDD 実装の体系的ガイド           | 開発手法標準化 |
| `component_design_rules.md` | React/Next.js コンポーネント設計 | コード品質向上 |
| `file_naming_rules.md`      | ファイル命名規則                 | 開発規約統一   |

**特徴**:

- プロダクト・技術スタックに依存しない汎用的な内容
- 他プロジェクトのテンプレートとして活用可能
- 開発チームのスタンダードとして継続利用

## 🔗 参照関係

### 内部参照

- `product-specific/tdd_implementation_plan.md` → `generic/tdd_generic_guide.md`
- `PRD.md` → 各ドキュメント

### 外部参照

- Flow Finder 開発時: `product-specific/` を主に参照
- 新規プロジェクト開始時: `generic/` をベースとして活用
- 他プロダクト展開時: `generic/` をコピー・カスタマイズ

## 📝 ドキュメント更新ガイドライン

### プロダクト特化ドキュメント

- Flow Finder の仕様変更時に更新
- 新機能追加時は関連ドキュメントを更新
- 具体的な実装例・数値を含む

### 汎用開発ガイド

- 開発手法の改善時に更新
- 新しいベストプラクティス採用時に更新
- 技術スタックに依存しない内容を維持

## 🚀 活用方法

### 1. Flow Finder 開発チーム

```bash
# プロダクト特化ドキュメントを参照
docs/product-specific/tdd_implementation_plan.md  # 実装計画
docs/product-specific/screen_design.md            # 画面設計
```

### 2. 新規プロジェクト開始

```bash
# 汎用ガイドをベースに開発環境構築
docs/generic/tdd_generic_guide.md         # TDD手法
docs/generic/component_design_rules.md    # 設計原則
docs/generic/file_naming_rules.md         # 命名規則
```

### 3. 他プロダクトへの適用

```bash
# 汎用ガイドをコピー・カスタマイズ
cp -r docs/generic/ ../new-project/docs/
# プロダクト特化ドキュメントを新規作成
mkdir ../new-project/docs/product-specific/
```

---

この分類により、**開発効率の向上**と**知識の再利用性**を両立できます。
