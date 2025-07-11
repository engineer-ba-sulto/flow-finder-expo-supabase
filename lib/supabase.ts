import { createClient, SupabaseClient } from '@supabase/supabase-js'

// 環境変数からSupabase設定を取得
const getSupabaseConfig = () => {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

  if (!url) {
    throw new Error('EXPO_PUBLIC_SUPABASE_URL環境変数が設定されていません')
  }

  if (!anonKey) {
    throw new Error('EXPO_PUBLIC_SUPABASE_ANON_KEY環境変数が設定されていません')
  }

  return { url, anonKey }
}

// シングルトンパターンでクライアントインスタンスを管理
let supabaseClient: SupabaseClient | null = null

/**
 * Supabase URL を取得
 */
export const getSupabaseUrl = (): string => {
  const { url } = getSupabaseConfig()
  return url
}

/**
 * Supabase ANON_KEY を取得
 */
export const getSupabaseAnonKey = (): string => {
  const { anonKey } = getSupabaseConfig()
  return anonKey
}

/**
 * Supabase クライアントを取得（シングルトンパターン）
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseClient) {
    const { url, anonKey } = getSupabaseConfig()
    supabaseClient = createClient(url, anonKey)
  }
  return supabaseClient
}

// デフォルトエクスポート
export default getSupabaseClient()