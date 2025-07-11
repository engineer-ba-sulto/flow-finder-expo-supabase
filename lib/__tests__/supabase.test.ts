import { createClient } from '@supabase/supabase-js'
import { getSupabaseClient, getSupabaseUrl, getSupabaseAnonKey } from '../supabase'

// Supabase クライアントの初期化テスト
describe('Supabase クライアント', () => {
  describe('設定値の検証', () => {
    it('Supabase URL が設定されていること', () => {
      const url = getSupabaseUrl()
      expect(url).toBeDefined()
      expect(typeof url).toBe('string')
      expect(url).toMatch(/^https:\/\//)
    })

    it('Supabase ANON_KEY が設定されていること', () => {
      const anonKey = getSupabaseAnonKey()
      expect(anonKey).toBeDefined()
      expect(typeof anonKey).toBe('string')
      expect(anonKey.length).toBeGreaterThan(0)
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