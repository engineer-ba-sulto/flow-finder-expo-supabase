# ファイル命名規則

このドキュメントは、JavaScript/TypeScript エコシステムのプロジェクト内のすべてのファイルに適用される命名規則を定義します。一貫性のあるファイル構造を維持するための統一ルールです。

## 対応フレームワーク・プラットフォーム

| カテゴリ             | フレームワーク・プラットフォーム                  |
| -------------------- | ------------------------------------------------- |
| **言語・ランタイム** | JavaScript, TypeScript, Node.js, Deno, Bun        |
| **フロントエンド**   | React, Vue.js, Svelte, Angular                    |
| **フルスタック**     | Next.js, Nuxt.js, SvelteKit, Remix, Gatsby, Astro |
| **モバイル**         | React Native, Expo, Ionic                         |
| **デスクトップ**     | Electron, Tauri                                   |
| **バックエンド**     | Express.js, Fastify, NestJS, Hono                 |
| **ビルドツール**     | Vite                                              |

## 1. 基本原則

### 1.1 ケバブケース（kebab-case）を使用

- すべてのファイル名は**ケバブケース**で命名する
- 複数単語は `-` で区切る
- 大文字は使用しない

```
✅ 正しい例：
- user-profile.tsx
- api-client.ts
- auth-middleware.ts
- product-list.tsx
- order-history.tsx
- payment-form.tsx

❌ 間違った例：
- UserProfile.tsx     # パスカルケース
- userProfile.tsx     # キャメルケース
- user_profile.tsx    # スネークケース
- userprofile.tsx     # 全て小文字（区切りなし）
```

## 2. ファイルタイプ別の命名規則

### 2.1 React コンポーネント

- 拡張子：`.tsx`
- ファイル名：ケバブケース
- コンポーネント名：パスカルケース

```typescript
// ファイル名: hero-section.tsx
export default function HeroSection() {
  return <section>Hero Section</section>;
}

// ファイル名: user-profile-card.tsx
export default function UserProfileCard() {
  return <div>User Profile Card</div>;
}
```

### 2.2 TypeScript ファイル

- 拡張子：`.ts`
- ファイル名：ケバブケース

```
✅ 正しい例：
- api-client.ts
- auth-utils.ts
- data-validator.ts
- string-helpers.ts
- date-formatter.ts

❌ 間違った例：
- apiClient.ts
- AuthUtils.ts
- data_validator.ts
```

### 2.3 API ルート（Next.js）

- 拡張子：`.ts`
- ファイル名：ケバブケース

```
app/api/
├── user-profile/
│   └── route.ts
├── auth/
│   ├── login/
│   │   └── route.ts
│   └── logout/
│       └── route.ts
└── product-catalog/
    └── route.ts
```

### 2.4 ページファイル（Next.js App Router）

- 拡張子：`.tsx`
- ファイル名：`page.tsx`（固定）またはケバブケース

```
app/
├── page.tsx                    # ルートページ
├── about/
│   └── page.tsx               # Aboutページ
├── user-profile/
│   └── page.tsx               # ユーザープロフィールページ
└── product-catalog/
    ├── page.tsx               # 商品カタログページ
    └── [product-id]/
        └── page.tsx           # 商品詳細ページ
```

### 2.5 レイアウトファイル（Next.js App Router）

- 拡張子：`.tsx`
- ファイル名：`layout.tsx`（固定）

```
app/
├── layout.tsx                 # ルートレイアウト
├── dashboard/
│   ├── layout.tsx            # ダッシュボードレイアウト
│   └── page.tsx
└── admin/
    ├── layout.tsx            # 管理画面レイアウト
    └── page.tsx
```

### 2.6 設定ファイル

- プロジェクトルートの設定ファイルは慣例に従う
- カスタム設定ファイルはケバブケース

```
✅ 慣例に従う：
- package.json
- tsconfig.json
- next.config.js
- tailwind.config.js
- eslint.config.js

✅ カスタム設定：
- database-config.ts
- email-config.ts
- payment-config.ts
```

### 2.7 ユーティリティ・ヘルパー

- 拡張子：`.ts`
- ファイル名：ケバブケース

```
lib/
├── string-utils.ts
├── date-helpers.ts
├── api-client.ts
├── auth-helpers.ts
└── validation-rules.ts
```

### 2.8 フック（Hooks）

- 拡張子：`.ts` または `.tsx`
- ファイル名：`use-` プレフィックス + ケバブケース

```
hooks/
├── use-auth.ts
├── use-local-storage.ts
├── use-api-client.ts
├── use-form-validation.ts
└── use-debounced-value.ts
```

### 2.9 型定義ファイル

- 拡張子：`.ts`
- ファイル名：ケバブケース + `.types.ts`

```
types/
├── user.types.ts
├── product.types.ts
├── api-response.types.ts
├── form-data.types.ts
└── auth.types.ts
```

### 2.10 テストファイル

- 拡張子：`.test.ts` または `.spec.ts`
- ファイル名：対象ファイル名 + `.test.ts`

```
tests/
├── user-profile.test.tsx
├── api-client.test.ts
├── auth-helpers.test.ts
├── string-utils.test.ts
└── form-validation.test.ts
```

## 3. ディレクトリ命名規則

### 3.1 ディレクトリ名

- **ケバブケース**を使用
- 複数単語は `-` で区切る

```
✅ 正しい例：
- user-profile/
- product-catalog/
- order-history/
- payment-methods/
- admin-dashboard/

❌ 間違った例：
- userProfile/
- UserProfile/
- user_profile/
- userprofile/
```

### 3.2 特殊ディレクトリ

Next.js や React の慣例に従う特殊ディレクトリは例外

```
✅ 慣例に従う：
- _components/     # コンポーネント用（アンダースコア）
- [id]/           # 動的ルート（角括弧）
- (group)/        # ルートグループ（丸括弧）
- @modal/         # パラレルルート（アットマーク）
```

## 4. 実装例

### 4.1 典型的なプロジェクト構造

```
app/
├── _components/
│   ├── header.tsx
│   ├── footer.tsx
│   ├── navigation-menu.tsx
│   └── user-avatar.tsx
├── user-profile/
│   ├── page.tsx
│   ├── _components/
│   │   ├── profile-form.tsx
│   │   └── avatar-upload.tsx
│   └── edit/
│       └── page.tsx
├── product-catalog/
│   ├── page.tsx
│   ├── _components/
│   │   ├── product-grid.tsx
│   │   ├── product-card.tsx
│   │   └── filter-sidebar.tsx
│   └── [product-id]/
│       └── page.tsx
└── api/
    ├── user-profile/
    │   └── route.ts
    └── product-catalog/
        └── route.ts

lib/
├── api-client.ts
├── auth-helpers.ts
├── string-utils.ts
└── date-formatter.ts

hooks/
├── use-auth.ts
├── use-api-client.ts
└── use-local-storage.ts

types/
├── user.types.ts
├── product.types.ts
└── api-response.types.ts
```

## 5. チェックリスト

### ファイル作成時の確認事項

- [ ] ファイル名はケバブケースになっているか？
- [ ] 複数単語は `-` で区切られているか？
- [ ] 大文字は使用していないか？
- [ ] 適切な拡張子を使用しているか？
- [ ] ディレクトリ名も統一されているか？

### 特殊ケースの確認

- [ ] Next.js の慣例ファイル（page.tsx, layout.tsx）は適切か？
- [ ] 設定ファイルは慣例に従っているか？
- [ ] フックファイルは `use-` プレフィックスがあるか？
- [ ] 型定義ファイルは `.types.ts` 拡張子があるか？
- [ ] テストファイルは `.test.ts` または `.spec.ts` 拡張子があるか？

---

> このルールは全プロジェクトで共通して適用されます。変更が必要な場合は、このドキュメントを更新してください。
> description:
> globs:

## alwaysApply: false
# ファイル命名規則

このドキュメントは、JavaScript/TypeScript エコシステムのプロジェクト内のすべてのファイルに適用される命名規則を定義します。一貫性のあるファイル構造を維持するための統一ルールです。

## 対応フレームワーク・プラットフォーム

| カテゴリ             | フレームワーク・プラットフォーム                  |
| -------------------- | ------------------------------------------------- |
| **言語・ランタイム** | JavaScript, TypeScript, Node.js, Deno, Bun        |
| **フロントエンド**   | React, Vue.js, Svelte, Angular                    |
| **フルスタック**     | Next.js, Nuxt.js, SvelteKit, Remix, Gatsby, Astro |
| **モバイル**         | React Native, Expo, Ionic                         |
| **デスクトップ**     | Electron, Tauri                                   |
| **バックエンド**     | Express.js, Fastify, NestJS, Hono                 |
| **ビルドツール**     | Vite                                              |

## 1. 基本原則

### 1.1 ケバブケース（kebab-case）を使用

- すべてのファイル名は**ケバブケース**で命名する
- 複数単語は `-` で区切る
- 大文字は使用しない

```
✅ 正しい例：
- user-profile.tsx
- api-client.ts
- auth-middleware.ts
- product-list.tsx
- order-history.tsx
- payment-form.tsx

❌ 間違った例：
- UserProfile.tsx     # パスカルケース
- userProfile.tsx     # キャメルケース
- user_profile.tsx    # スネークケース
- userprofile.tsx     # 全て小文字（区切りなし）
```

## 2. ファイルタイプ別の命名規則

### 2.1 React コンポーネント

- 拡張子：`.tsx`
- ファイル名：ケバブケース
- コンポーネント名：パスカルケース

```typescript
// ファイル名: hero-section.tsx
export default function HeroSection() {
  return <section>Hero Section</section>;
}

// ファイル名: user-profile-card.tsx
export default function UserProfileCard() {
  return <div>User Profile Card</div>;
}
```

### 2.2 TypeScript ファイル

- 拡張子：`.ts`
- ファイル名：ケバブケース

```
✅ 正しい例：
- api-client.ts
- auth-utils.ts
- data-validator.ts
- string-helpers.ts
- date-formatter.ts

❌ 間違った例：
- apiClient.ts
- AuthUtils.ts
- data_validator.ts
```

### 2.3 API ルート（Next.js）

- 拡張子：`.ts`
- ファイル名：ケバブケース

```
app/api/
├── user-profile/
│   └── route.ts
├── auth/
│   ├── login/
│   │   └── route.ts
│   └── logout/
│       └── route.ts
└── product-catalog/
    └── route.ts
```

### 2.4 ページファイル（Next.js App Router）

- 拡張子：`.tsx`
- ファイル名：`page.tsx`（固定）またはケバブケース

```
app/
├── page.tsx                    # ルートページ
├── about/
│   └── page.tsx               # Aboutページ
├── user-profile/
│   └── page.tsx               # ユーザープロフィールページ
└── product-catalog/
    ├── page.tsx               # 商品カタログページ
    └── [product-id]/
        └── page.tsx           # 商品詳細ページ
```

### 2.5 レイアウトファイル（Next.js App Router）

- 拡張子：`.tsx`
- ファイル名：`layout.tsx`（固定）

```
app/
├── layout.tsx                 # ルートレイアウト
├── dashboard/
│   ├── layout.tsx            # ダッシュボードレイアウト
│   └── page.tsx
└── admin/
    ├── layout.tsx            # 管理画面レイアウト
    └── page.tsx
```

### 2.6 設定ファイル

- プロジェクトルートの設定ファイルは慣例に従う
- カスタム設定ファイルはケバブケース

```
✅ 慣例に従う：
- package.json
- tsconfig.json
- next.config.js
- tailwind.config.js
- eslint.config.js

✅ カスタム設定：
- database-config.ts
- email-config.ts
- payment-config.ts
```

### 2.7 ユーティリティ・ヘルパー

- 拡張子：`.ts`
- ファイル名：ケバブケース

```
lib/
├── string-utils.ts
├── date-helpers.ts
├── api-client.ts
├── auth-helpers.ts
└── validation-rules.ts
```

### 2.8 フック（Hooks）

- 拡張子：`.ts` または `.tsx`
- ファイル名：`use-` プレフィックス + ケバブケース

```
hooks/
├── use-auth.ts
├── use-local-storage.ts
├── use-api-client.ts
├── use-form-validation.ts
└── use-debounced-value.ts
```

### 2.9 型定義ファイル

- 拡張子：`.ts`
- ファイル名：ケバブケース + `.types.ts`

```
types/
├── user.types.ts
├── product.types.ts
├── api-response.types.ts
├── form-data.types.ts
└── auth.types.ts
```

### 2.10 テストファイル

- 拡張子：`.test.ts` または `.spec.ts`
- ファイル名：対象ファイル名 + `.test.ts`

```
tests/
├── user-profile.test.tsx
├── api-client.test.ts
├── auth-helpers.test.ts
├── string-utils.test.ts
└── form-validation.test.ts
```

## 3. ディレクトリ命名規則

### 3.1 ディレクトリ名

- **ケバブケース**を使用
- 複数単語は `-` で区切る

```
✅ 正しい例：
- user-profile/
- product-catalog/
- order-history/
- payment-methods/
- admin-dashboard/

❌ 間違った例：
- userProfile/
- UserProfile/
- user_profile/
- userprofile/
```

### 3.2 特殊ディレクトリ

Next.js や React の慣例に従う特殊ディレクトリは例外

```
✅ 慣例に従う：
- _components/     # コンポーネント用（アンダースコア）
- [id]/           # 動的ルート（角括弧）
- (group)/        # ルートグループ（丸括弧）
- @modal/         # パラレルルート（アットマーク）
```

## 4. 実装例

### 4.1 典型的なプロジェクト構造

```
app/
├── _components/
│   ├── header.tsx
│   ├── footer.tsx
│   ├── navigation-menu.tsx
│   └── user-avatar.tsx
├── user-profile/
│   ├── page.tsx
│   ├── _components/
│   │   ├── profile-form.tsx
│   │   └── avatar-upload.tsx
│   └── edit/
│       └── page.tsx
├── product-catalog/
│   ├── page.tsx
│   ├── _components/
│   │   ├── product-grid.tsx
│   │   ├── product-card.tsx
│   │   └── filter-sidebar.tsx
│   └── [product-id]/
│       └── page.tsx
└── api/
    ├── user-profile/
    │   └── route.ts
    └── product-catalog/
        └── route.ts

lib/
├── api-client.ts
├── auth-helpers.ts
├── string-utils.ts
└── date-formatter.ts

hooks/
├── use-auth.ts
├── use-api-client.ts
└── use-local-storage.ts

types/
├── user.types.ts
├── product.types.ts
└── api-response.types.ts
```

## 5. チェックリスト

### ファイル作成時の確認事項

- [ ] ファイル名はケバブケースになっているか？
- [ ] 複数単語は `-` で区切られているか？
- [ ] 大文字は使用していないか？
- [ ] 適切な拡張子を使用しているか？
- [ ] ディレクトリ名も統一されているか？

### 特殊ケースの確認

- [ ] Next.js の慣例ファイル（page.tsx, layout.tsx）は適切か？
- [ ] 設定ファイルは慣例に従っているか？
- [ ] フックファイルは `use-` プレフィックスがあるか？
- [ ] 型定義ファイルは `.types.ts` 拡張子があるか？
- [ ] テストファイルは `.test.ts` または `.spec.ts` 拡張子があるか？

---

> このルールは全プロジェクトで共通して適用されます。変更が必要な場合は、このドキュメントを更新してください。
> description:
> globs:

## alwaysApply: false
