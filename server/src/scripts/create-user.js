// Create a staff or admin account (patients register through the app).
// Usage: node src/scripts/create-user.js "Full Name" email@example.com staff|admin
// The password is read from the NEW_USER_PASSWORD environment variable so it
// does not appear in your shell history as a command argument.
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { pool } from '../db.js'

const [fullName, email, role] = process.argv.slice(2)
const password = process.env.NEW_USER_PASSWORD

if (!fullName || !email || !['staff', 'admin'].includes(role) || !password) {
  console.error('Usage: NEW_USER_PASSWORD=... node src/scripts/create-user.js "Full Name" email staff|admin')
  process.exit(1)
}
if (password.length < 8) {
  console.error('Password must be at least 8 characters.')
  process.exit(1)
}

const hash = await bcrypt.hash(password, 12)
await pool.query(
  'INSERT INTO users (full_name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
  [fullName, email.trim(), hash, role],
)
console.log(`Created ${role}: ${email}`)
await pool.end()
