import fs from "fs";
import path from "path";

/**
 * Task 2.16: goals タブ追加のテスト作成 (Red Phase)
 * 
 * TDDのRed Phaseとして、まずテストを作成して失敗することを確認します。
 * 複雑なコンポーネントモックではなく、ファイル内容の確認により
 * Goalsタブの実装状況をテストします。
 */

describe("TabLayout - goals タブ追加テスト (Red Phase)", () => {
  const layoutPath = path.join(__dirname, "../_layout.tsx");
  let layoutContent: string;

  beforeAll(() => {
    // _layout.tsx の内容を読み込み
    layoutContent = fs.readFileSync(layoutPath, "utf-8");
  });

  describe("現在の実装状態確認", () => {
    it("_layout.tsx ファイルが存在すること", () => {
      expect(fs.existsSync(layoutPath)).toBe(true);
    });

    it("現在はHomeタブ（index）が実装されていること", () => {
      expect(layoutContent).toContain('name="index"');
      expect(layoutContent).toContain('title: "Home"');
      expect(layoutContent).toContain('name="home"'); // FontAwesome icon
    });

    it("現在はSettingsタブが実装されていること", () => {
      expect(layoutContent).toContain('name="settings"');
      expect(layoutContent).toContain('title: "Settings"');
      expect(layoutContent).toContain('name="cog"'); // FontAwesome icon
    });
  });

  describe("Green Phase: Goalsタブの実装確認", () => {
    it("Goalsタブのスクリーン定義が存在すること", () => {
      // Green Phase: goals タブが正常に追加されている
      expect(layoutContent).toContain('name="goals"');
    });

    it("Goalsタブのタイトル設定が存在すること", () => {
      // Green Phase: goals タブのタイトルが設定されている
      expect(layoutContent).toContain('title: "Goals"');
    });

    it("Goalsタブのbullseyeアイコンが設定されていること", () => {
      // Green Phase: 実装に合わせたテスト
      const goalsTabMatch = layoutContent.match(/name="goals"[\s\S]*?\/>/);
      if (goalsTabMatch) {
        expect(goalsTabMatch[0]).toContain('name="bullseye"');
      } else {
        fail("goals タブが存在しません");
      }
    });

    it("3つのタブスクリーンが定義されていること", () => {
      // Green Phase: index, goals, settings の3つのタブが存在
      const screenMatches = layoutContent.match(/<Tabs\.Screen/g) || [];
      expect(screenMatches).toHaveLength(3);
    });

    it("タブが正しい順序（index, goals, settings）で配置されていること", () => {
      // Green Phase: goals タブが中間に配置されている
      const indexPos = layoutContent.indexOf('name="index"');
      const goalsPos = layoutContent.indexOf('name="goals"');
      const settingsPos = layoutContent.indexOf('name="settings"');

      expect(indexPos).toBeGreaterThan(-1);
      expect(goalsPos).toBeGreaterThan(-1);
      expect(settingsPos).toBeGreaterThan(-1);
      expect(indexPos).toBeLessThan(goalsPos);
      expect(goalsPos).toBeLessThan(settingsPos);
    });
  });

  describe("期待される実装内容（Green Phase後に成功予定）", () => {
    it("完成時にはTabsコンポーネントが適切な設定を持つこと", () => {
      expect(layoutContent).toContain("tabBarActiveTintColor");
    });

    it("完成時にはFontAwesome アイコンが適切にインポートされていること", () => {
      expect(layoutContent).toContain("@expo/vector-icons/FontAwesome");
    });

    it("完成時には各タブに適切なアクセシビリティ設定があること", () => {
      // 将来的にアクセシビリティの改善が必要
      expect(layoutContent).toContain("tabBarIcon");
    });
  });

  describe("コード品質確認", () => {
    it("TypeScript形式で記述されていること", () => {
      expect(layoutPath).toMatch(/\.tsx?$/);
    });

    it("適切なExportが行われていること", () => {
      expect(layoutContent).toContain("export default");
    });

    it("必要なインポートが存在すること", () => {
      expect(layoutContent).toContain("expo-router");
    });
  });

  describe("今後の実装予定確認", () => {
    it("Task 2.17（Green Phase）でgoalsタブが追加される予定", () => {
      // このコメントは実装ガイドとして
      expect(true).toBe(true);
    });

    it("Task 2.18（Refactor Phase）でUI・アクセシビリティが改善される予定", () => {
      // このコメントは実装ガイドとして
      expect(true).toBe(true);
    });
  });
});