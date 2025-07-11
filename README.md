# React Native + Expo + TypeScript + NativeWind + Bun + Jest で構築するモバイルアプリ開発環境

## プロジェクト概要

このプロジェクトは、2025 年最新の React Native 開発環境を構築するサンプルアプリケーションです。
モダンなツールスタックとベストプラクティスを使用して、効率的な React Native 開発を実現します。

## 技術選定

- **Bun**: 高速な JavaScript ランタイム・パッケージマネージャー
- **TypeScript**: 型安全性を提供する JavaScript の上位互換言語
- **React Native**: クロスプラットフォームモバイルアプリ開発フレームワーク
- **Expo**: React Native 開発を効率化するプラットフォーム
- **Expo Router**: ファイルベースのルーティングシステム
- **NativeWind**: React Native 用の Tailwind CSS ライブラリ
- **Jest**: JavaScript テストフレームワーク
- **React Native Testing Library**: React Native コンポーネントのテストユーティリティ

## プロジェクト構造

```
flow-finder-expo-supabase/
├── app/
│   ├── _layout.tsx              # ルートレイアウト
│   └── (tabs)/
│       ├── _layout.tsx          # タブレイアウト
│       ├── index.tsx            # ホーム画面
│       ├── settings.tsx         # 設定画面
│       └── __tests__/           # テストファイル
├── assets/                      # 画像・アイコン
├── global.css                   # グローバルスタイル
├── tailwind.config.js          # Tailwind設定
├── tsconfig.json               # TypeScript設定
└── package.json                # パッケージ設定
```

## 機能

- **タブナビゲーション**: ホーム画面と設定画面を切り替え
- **モダンなスタイリング**: NativeWind（Tailwind CSS）を使用
- **テスト環境**: Jest + React Native Testing Library によるテスト
- **型安全性**: TypeScript による型チェック

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

## 参考リンク

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Bun Documentation](https://bun.sh/)
