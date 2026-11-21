import pg from 'pg'

// Connection pool for the hosted PostgreSQL database (Neon / Supabase).
// DATABASE_URL comes from server/.env and should include ?sslmode=require.
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

export const query = (text, params) => pool.query(text, params)

export async function checkDb() {
  if (!process.env.DATABASE_URL) return 'not configured'
  try {
    await pool.query('SELECT 1')
    return 'connected'
  } catch {
    return 'error'
  }
}
