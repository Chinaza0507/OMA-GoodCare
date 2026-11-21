import pg from 'pg'

// Connection pool for the hosted PostgreSQL database (Neon / Supabase).
// DATABASE_URL comes from the .env file.
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
})

export async function checkDb() {
  if (!process.env.DATABASE_URL) return 'not configured'
  try {
    await pool.query('SELECT 1')
    return 'connected'
  } catch {
    return 'error'
  }
}
