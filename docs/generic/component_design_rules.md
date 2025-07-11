# コンポーネント設計ルール

このドキュメントは、React/Next.js プロジェクトにおけるコンポーネント設計の統一ルールを定義します。すべてのプロジェクトで共通して適用される設計原則です。

> **注意**: ファイル命名規則については `file_naming_rules.mdc` を参照してください。

## 1. ディレクトリ構造ルール

### 基本原則

- コンポーネントは `_components` ディレクトリ内に保存する
- `_components` ディレクトリは、使用するファイルのルートに作成する
- 複数のページで共有する場合は、使用するファイルの中で 1 番上のルートに作成する

### 具体例

#### 1.1 単一ページでのみ使用する場合

```
app/
├── page.tsx                    # ランディングページ
├── _components/               # ランディングページ専用コンポーネント
│   ├── hero.tsx
│   ├── features.tsx
│   └── cta.tsx
├── about/
│   ├── page.tsx               # Aboutページ
│   └── _components/           # Aboutページ専用コンポーネント
│       ├── team-section.tsx
│       └── history-timeline.tsx
└── contact/
    ├── page.tsx               # Contactページ
    └── _components/           # Contactページ専用コンポーネント
        ├── contact-form.tsx
        └── map-section.tsx
```

#### 1.2 複数ページで共有する場合

```
app/
├── _components/               # 全ページで共有
│   ├── header.tsx            # 全ページで使用
│   ├── footer.tsx            # 全ページで使用
│   ├── navigation.tsx        # 全ページで使用
│   └── loading-spinner.tsx   # 複数ページで使用
├── page.tsx                  # ランディング
├── dashboard/
│   ├── _components/          # ダッシュボード系ページで共有
│   │   ├── sidebar.tsx       # dashboard配下のページで共有
│   │   └── stats-card.tsx    # dashboard配下のページで共有
│   ├── page.tsx              # ダッシュボードトップ
│   ├── analytics/
│   │   ├── page.tsx          # 分析ページ
│   │   └── _components/      # 分析ページ専用
│   │       └── chart-panel.tsx
│   └── settings/
│       ├── page.tsx          # 設定ページ
│       └── _components/      # 設定ページ専用
│           └── settings-form.tsx
```

#### 1.3 ネストした共有コンポーネント

```
app/
├── _components/               # 最上位共有
│   ├── header.tsx
│   └── footer.tsx
├── admin/
│   ├── _components/          # admin配下で共有
│   │   ├── admin-header.tsx
│   │   └── admin-sidebar.tsx
│   ├── page.tsx
│   ├── users/
│   │   ├── _components/      # users配下で共有
│   │   │   └── user-table.tsx
│   │   ├── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── _components/  # 個別ユーザーページ専用
│   │           └── user-detail.tsx
│   └── products/
│       ├── page.tsx
│       └── _components/      # products配下で共有
│           └── product-grid.tsx
```

## 2. コンポーネント分割の指針

### 2.1 分割すべきケース

1. **再利用性がある場合**

   ```typescript
   // button.tsx - 複数箇所で使用
   export default function Button({ children, variant = "primary" }) {
     return <button className={`btn btn-${variant}`}>{children}</button>;
   }
   ```

2. **責任が明確に分かれる場合**

   ```typescript
   // header.tsx
   export default function Header() {
     return (
       <header>
         <Logo />
         <Navigation />
         <UserMenu />
       </header>
     );
   }
   ```

3. **複雑なロジックを持つ場合**
   ```typescript
   // search-form.tsx
   export default function SearchForm() {
     const [query, setQuery] = useState("");
     const [filters, setFilters] = useState({});
     // 複雑な検索ロジック...
     return <form>...</form>;
   }
   ```

### 2.2 分割しないケース

1. **単純すぎる場合**

   ```typescript
   // ❌ 不要な分割
   // simple-text.tsx
   export default function SimpleText({ text }) {
     return <p>{text}</p>;
   }

   // ✅ 直接記述
   <p>{text}</p>;
   ```

2. **一箇所でしか使わない単純な要素**

   ```typescript
   // ❌ 不要な分割
   // page-title.tsx (一箇所でしか使わない)
   export default function PageTitle() {
     return <h1>About Us</h1>;
   }

   // ✅ 直接記述
   <h1>About Us</h1>;
   ```

## 3. コンポーネント設計パターン

### 3.1 セクションコンポーネント

ページの大きなセクションを表すコンポーネント

```typescript
// hero.tsx
export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <h1>Welcome to Our Site</h1>
        <p>This is the hero section</p>
        <Button>Get Started</Button>
      </div>
    </section>
  );
}
```

### 3.2 レイアウトコンポーネント

ページ全体の構造を定義するコンポーネント

```typescript
// header.tsx
export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <Logo />
        <Navigation />
        <UserActions />
      </div>
    </header>
  );
}
```

### 3.3 UI コンポーネント

再利用可能な小さな UI パーツ

```typescript
// card.tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div className={`card ${className}`}>
      <h3 className="card-title">{title}</h3>
      <div className="card-content">{children}</div>
    </div>
  );
}
```

## 4. インポート規則

### 4.1 相対パス vs 絶対パス

```typescript
// ✅ 同じディレクトリ内
import Hero from "./hero";
import Features from "./features";

// ✅ 上位ディレクトリの共有コンポーネント
import Header from "../_components/header";
import Footer from "../_components/footer";

// ✅ 最上位の共有コンポーネント（エイリアス使用）
import Button from "@/components/ui/button";
```

### 4.2 インポート順序

```typescript
// 1. React関連
import React from "react";
import { useState, useEffect } from "react";

// 2. 外部ライブラリ
import { clsx } from "clsx";
import { motion } from "framer-motion";

// 3. 内部コンポーネント（絶対パス）
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 4. 相対パス
import Hero from "./hero";
import Features from "./features";

// 5. 型定義
import type { ComponentProps } from "./types";
```

## 5. 実装時の注意点

### 5.1 コンポーネントの責任分離

```typescript
// ❌ 責任が混在
export default function UserDashboard() {
  // API呼び出し
  // データ変換
  // UI描画
  // 全部混在している
}

// ✅ 責任を分離
export default function UserDashboard() {
  return (
    <div>
      <UserStats /> {/* 統計表示専用 */}
      <UserActivity /> {/* アクティビティ表示専用 */}
      <UserSettings /> {/* 設定専用 */}
    </div>
  );
}
```

### 5.2 Props の設計

```typescript
// ✅ 明確なProps定義
interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaAction: () => void;
  backgroundImage?: string;
}

export default function Hero({
  title,
  subtitle,
  ctaText,
  ctaAction,
  backgroundImage,
}: HeroProps) {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
      }}
    >
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
      <button onClick={ctaAction}>{ctaText}</button>
    </section>
  );
}
```

## 6. チェックリスト

### 新しいコンポーネントを作成する前に確認すること

- [ ] このコンポーネントは再利用される可能性があるか？
- [ ] 適切な場所の `_components` ディレクトリに配置するか？
- [ ] ファイル名はケバブケースになっているか？
- [ ] コンポーネント名はパスカルケースになっているか？
- [ ] 責任が明確に分かれているか？
- [ ] Props の型定義は適切か？

### コンポーネント配置の判断フロー

1. 複数のページで使用する？ → 最上位の `app/_components/` に配置
2. 特定のセクション配下で共有する？ → そのセクションの `_components/` に配置
3. 単一ページでのみ使用する？ → そのページの `_components/` に配置

---

> このルールは全プロジェクトで共通して適用されます。変更が必要な場合は、このドキュメントを更新してください。
> description:
> globs:

## alwaysApply: false
# コンポーネント設計ルール

このドキュメントは、React/Next.js プロジェクトにおけるコンポーネント設計の統一ルールを定義します。すべてのプロジェクトで共通して適用される設計原則です。

> **注意**: ファイル命名規則については `file_naming_rules.mdc` を参照してください。

## 1. ディレクトリ構造ルール

### 基本原則

- コンポーネントは `_components` ディレクトリ内に保存する
- `_components` ディレクトリは、使用するファイルのルートに作成する
- 複数のページで共有する場合は、使用するファイルの中で 1 番上のルートに作成する

### 具体例

#### 1.1 単一ページでのみ使用する場合

```
app/
├── page.tsx                    # ランディングページ
├── _components/               # ランディングページ専用コンポーネント
│   ├── hero.tsx
│   ├── features.tsx
│   └── cta.tsx
├── about/
│   ├── page.tsx               # Aboutページ
│   └── _components/           # Aboutページ専用コンポーネント
│       ├── team-section.tsx
│       └── history-timeline.tsx
└── contact/
    ├── page.tsx               # Contactページ
    └── _components/           # Contactページ専用コンポーネント
        ├── contact-form.tsx
        └── map-section.tsx
```

#### 1.2 複数ページで共有する場合

```
app/
├── _components/               # 全ページで共有
│   ├── header.tsx            # 全ページで使用
│   ├── footer.tsx            # 全ページで使用
│   ├── navigation.tsx        # 全ページで使用
│   └── loading-spinner.tsx   # 複数ページで使用
├── page.tsx                  # ランディング
├── dashboard/
│   ├── _components/          # ダッシュボード系ページで共有
│   │   ├── sidebar.tsx       # dashboard配下のページで共有
│   │   └── stats-card.tsx    # dashboard配下のページで共有
│   ├── page.tsx              # ダッシュボードトップ
│   ├── analytics/
│   │   ├── page.tsx          # 分析ページ
│   │   └── _components/      # 分析ページ専用
│   │       └── chart-panel.tsx
│   └── settings/
│       ├── page.tsx          # 設定ページ
│       └── _components/      # 設定ページ専用
│           └── settings-form.tsx
```

#### 1.3 ネストした共有コンポーネント

```
app/
├── _components/               # 最上位共有
│   ├── header.tsx
│   └── footer.tsx
├── admin/
│   ├── _components/          # admin配下で共有
│   │   ├── admin-header.tsx
│   │   └── admin-sidebar.tsx
│   ├── page.tsx
│   ├── users/
│   │   ├── _components/      # users配下で共有
│   │   │   └── user-table.tsx
│   │   ├── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── _components/  # 個別ユーザーページ専用
│   │           └── user-detail.tsx
│   └── products/
│       ├── page.tsx
│       └── _components/      # products配下で共有
│           └── product-grid.tsx
```

## 2. コンポーネント分割の指針

### 2.1 分割すべきケース

1. **再利用性がある場合**

   ```typescript
   // button.tsx - 複数箇所で使用
   export default function Button({ children, variant = "primary" }) {
     return <button className={`btn btn-${variant}`}>{children}</button>;
   }
   ```

2. **責任が明確に分かれる場合**

   ```typescript
   // header.tsx
   export default function Header() {
     return (
       <header>
         <Logo />
         <Navigation />
         <UserMenu />
       </header>
     );
   }
   ```

3. **複雑なロジックを持つ場合**
   ```typescript
   // search-form.tsx
   export default function SearchForm() {
     const [query, setQuery] = useState("");
     const [filters, setFilters] = useState({});
     // 複雑な検索ロジック...
     return <form>...</form>;
   }
   ```

### 2.2 分割しないケース

1. **単純すぎる場合**

   ```typescript
   // ❌ 不要な分割
   // simple-text.tsx
   export default function SimpleText({ text }) {
     return <p>{text}</p>;
   }

   // ✅ 直接記述
   <p>{text}</p>;
   ```

2. **一箇所でしか使わない単純な要素**

   ```typescript
   // ❌ 不要な分割
   // page-title.tsx (一箇所でしか使わない)
   export default function PageTitle() {
     return <h1>About Us</h1>;
   }

   // ✅ 直接記述
   <h1>About Us</h1>;
   ```

## 3. コンポーネント設計パターン

### 3.1 セクションコンポーネント

ページの大きなセクションを表すコンポーネント

```typescript
// hero.tsx
export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <h1>Welcome to Our Site</h1>
        <p>This is the hero section</p>
        <Button>Get Started</Button>
      </div>
    </section>
  );
}
```

### 3.2 レイアウトコンポーネント

ページ全体の構造を定義するコンポーネント

```typescript
// header.tsx
export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <Logo />
        <Navigation />
        <UserActions />
      </div>
    </header>
  );
}
```

### 3.3 UI コンポーネント

再利用可能な小さな UI パーツ

```typescript
// card.tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div className={`card ${className}`}>
      <h3 className="card-title">{title}</h3>
      <div className="card-content">{children}</div>
    </div>
  );
}
```

## 4. インポート規則

### 4.1 相対パス vs 絶対パス

```typescript
// ✅ 同じディレクトリ内
import Hero from "./hero";
import Features from "./features";

// ✅ 上位ディレクトリの共有コンポーネント
import Header from "../_components/header";
import Footer from "../_components/footer";

// ✅ 最上位の共有コンポーネント（エイリアス使用）
import Button from "@/components/ui/button";
```

### 4.2 インポート順序

```typescript
// 1. React関連
import React from "react";
import { useState, useEffect } from "react";

// 2. 外部ライブラリ
import { clsx } from "clsx";
import { motion } from "framer-motion";

// 3. 内部コンポーネント（絶対パス）
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 4. 相対パス
import Hero from "./hero";
import Features from "./features";

// 5. 型定義
import type { ComponentProps } from "./types";
```

## 5. 実装時の注意点

### 5.1 コンポーネントの責任分離

```typescript
// ❌ 責任が混在
export default function UserDashboard() {
  // API呼び出し
  // データ変換
  // UI描画
  // 全部混在している
}

// ✅ 責任を分離
export default function UserDashboard() {
  return (
    <div>
      <UserStats /> {/* 統計表示専用 */}
      <UserActivity /> {/* アクティビティ表示専用 */}
      <UserSettings /> {/* 設定専用 */}
    </div>
  );
}
```

### 5.2 Props の設計

```typescript
// ✅ 明確なProps定義
interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaAction: () => void;
  backgroundImage?: string;
}

export default function Hero({
  title,
  subtitle,
  ctaText,
  ctaAction,
  backgroundImage,
}: HeroProps) {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
      }}
    >
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
      <button onClick={ctaAction}>{ctaText}</button>
    </section>
  );
}
```

## 6. チェックリスト

### 新しいコンポーネントを作成する前に確認すること

- [ ] このコンポーネントは再利用される可能性があるか？
- [ ] 適切な場所の `_components` ディレクトリに配置するか？
- [ ] ファイル名はケバブケースになっているか？
- [ ] コンポーネント名はパスカルケースになっているか？
- [ ] 責任が明確に分かれているか？
- [ ] Props の型定義は適切か？

### コンポーネント配置の判断フロー

1. 複数のページで使用する？ → 最上位の `app/_components/` に配置
2. 特定のセクション配下で共有する？ → そのセクションの `_components/` に配置
3. 単一ページでのみ使用する？ → そのページの `_components/` に配置

---

> このルールは全プロジェクトで共通して適用されます。変更が必要な場合は、このドキュメントを更新してください。
> description:
> globs:

## alwaysApply: false
