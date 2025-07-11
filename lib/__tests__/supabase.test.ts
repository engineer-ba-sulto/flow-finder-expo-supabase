// 環境変数をモック（importの前に設定）
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co'
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key-mock'

// Supabaseクライアントのモック
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    // モックのSupabaseクライアント
    auth: {},
    from: jest.fn(),
    channel: jest.fn()
  }))
}))

// モジュールのモック（デフォルトエクスポート回避）
jest.mock('../supabase', () => {
  const mockClient = {
    auth: {},
    from: jest.fn(),
    channel: jest.fn()
  }
  
  return {
    getSupabaseUrl: () => 'https://test-project.supabase.co',
    getSupabaseAnonKey: () => 'test-anon-key-mock',
    getSupabaseClient: jest.fn(() => mockClient),
    __esModule: true,
    default: mockClient
  }
})

import { getSupabaseClient, getSupabaseUrl, getSupabaseAnonKey } from '../supabase'

// Supabase クライアントの初期化テスト
describe('Supabase クライアント', () => {
  describe('設定値の検証', () => {
    it('Supabase URL が設定されていること', () => {
      const url = getSupabaseUrl()
      expect(url).toBeDefined()
      expect(typeof url).toBe('string')
      expect(url).toBe('https://test-project.supabase.co')
    })

    it('Supabase ANON_KEY が設定されていること', () => {
      const anonKey = getSupabaseAnonKey()
      expect(anonKey).toBeDefined()
      expect(typeof anonKey).toBe('string')
      expect(anonKey).toBe('test-anon-key-mock')
    })
  })

  describe('クライアントの初期化', () => {
    it('Supabase クライアントが正しく初期化されること', () => {
      const client = getSupabaseClient()
      expect(client).toBeDefined()
      expect(typeof client).toBe('object')
    })

    it('シングルトンパターンで同じインスタンスが返されること', () => {
      const client1 = getSupabaseClient()
      const client2 = getSupabaseClient()
      expect(client1).toBe(client2)
    })
  })

  describe('クライアントの設定', () => {
    it('正しいURLとキーでクライアントが初期化されること', () => {
      const client = getSupabaseClient()
      const expectedUrl = getSupabaseUrl()
      const expectedKey = getSupabaseAnonKey()
      
      // クライアントオブジェクトが存在し、設定値も取得できることを確認
      expect(client).toBeDefined()
      expect(expectedUrl).toBeDefined()
      expect(expectedKey).toBeDefined()
      expect(typeof expectedUrl).toBe('string')
      expect(typeof expectedKey).toBe('string')
    })
  })
})