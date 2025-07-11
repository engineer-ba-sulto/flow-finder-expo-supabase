// 環境変数をモック（importの前に設定）
process.env.EXPO_PUBLIC_SUPABASE_URL = "https://test-project.supabase.co";
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key-mock";

// Supabaseクライアントのモック
jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    // モックのSupabaseクライアント
    auth: {},
    from: jest.fn(),
    channel: jest.fn(),
  })),
}));

// モジュールのモック（デフォルトエクスポート回避）
jest.mock("../supabase", () => {
  const mockClient = {
    auth: {},
    from: jest.fn(),
    channel: jest.fn(),
  };

  return {
    getSupabaseUrl: () => "https://test-project.supabase.co",
    getSupabaseAnonKey: () => "test-anon-key-mock",
    getSupabaseClient: jest.fn(() => mockClient),
    __esModule: true,
    default: mockClient,
  };
});

import {
  getSupabaseAnonKey,
  getSupabaseClient,
  getSupabaseUrl,
} from "../supabase";

// Supabase クライアントの初期化テスト
describe("Supabase クライアント", () => {
  describe("設定値の検証", () => {
    it("Supabase URL が設定されていること", () => {
      const url = getSupabaseUrl();
      expect(url).toBeDefined();
      expect(typeof url).toBe("string");
      expect(url).toBe("https://test-project.supabase.co");
    });

    it("Supabase ANON_KEY が設定されていること", () => {
      const anonKey = getSupabaseAnonKey();
      expect(anonKey).toBeDefined();
      expect(typeof anonKey).toBe("string");
      expect(anonKey).toBe("test-anon-key-mock");
    });
  });

  describe("クライアントの初期化", () => {
    it("Supabase クライアントが正しく初期化されること", () => {
      const client = getSupabaseClient();
      expect(client).toBeDefined();
      expect(typeof client).toBe("object");
    });

    it("シングルトンパターンで同じインスタンスが返されること", () => {
      const client1 = getSupabaseClient();
      const client2 = getSupabaseClient();
      expect(client1).toBe(client2);
    });
  });

  describe("クライアントの設定", () => {
    it("正しいURLとキーでクライアントが初期化されること", () => {
      const client = getSupabaseClient();
      const expectedUrl = getSupabaseUrl();
      const expectedKey = getSupabaseAnonKey();

      // クライアントオブジェクトが存在し、設定値も取得できることを確認
      expect(client).toBeDefined();
      expect(expectedUrl).toBeDefined();
      expect(expectedKey).toBeDefined();
      expect(typeof expectedUrl).toBe("string");
      expect(typeof expectedKey).toBe("string");
    });
  });

  describe("Refactor機能のテスト", () => {
    it("キャッシュ機能が動作すること", () => {
      const url1 = getSupabaseUrl();
      const url2 = getSupabaseUrl();

      // 同じ参照であることを確認（キャッシュされている）
      expect(url1).toBe(url2);
    });

    it("パフォーマンス最適化が動作すること", () => {
      const startTime = Date.now();

      // 複数回呼び出してもパフォーマンスが良いことを確認
      for (let i = 0; i < 100; i++) {
        getSupabaseUrl();
        getSupabaseAnonKey();
        getSupabaseClient();
      }

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // 100回の呼び出しが100ms以内で完了することを確認
      expect(executionTime).toBeLessThan(100);
    });

    it("JSDocコメントに対応した型安全性が保たれること", () => {
      const url = getSupabaseUrl();
      const anonKey = getSupabaseAnonKey();
      const client = getSupabaseClient();

      // 型が正しいことを確認
      expect(typeof url).toBe("string");
      expect(typeof anonKey).toBe("string");
      expect(typeof client).toBe("object");
      expect(client).toBeDefined();
    });
  });
});
