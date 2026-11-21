import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import rateLimit from 'express-rate-limit'
import { query } from '../db.js'
import { signToken, requireAuth } from '../middleware/auth.js'

const router = Router()

// Slow down password guessing and mass sign-ups.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts, please try again later' },
})

const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  phone: z.string().trim().min(7).max(20).optional(),
  // bcrypt only uses the first 72 bytes, so cap the length.
  password: z.string().min(8).max(72),
})

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1).max(72),
})

const publicUser = (u) => ({
  id: u.id,
  fullName: u.full_name,
  email: u.email,
  phone: u.phone,
  role: u.role,
})

// A fixed hash to compare against when the email is unknown, so response time
// does not reveal which emails are registered.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12)

router.post('/register', authLimiter, async (req, res) => {
  const data = registerSchema.parse(req.body)
  const hash = await bcrypt.hash(data.password, 12)

  try {
    // Public sign-up always creates a patient. Staff/admin are created by an admin.
    const { rows } = await query(
      `INSERT INTO users (full_name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, 'patient')
       RETURNING id, full_name, email, phone, role`,
      [data.fullName, data.email, data.phone ?? null, hash],
    )
    res.status(201).json({ token: signToken(rows[0]), user: publicUser(rows[0]) })
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }
    throw err
  }
})

router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = loginSchema.parse(req.body)
  const { rows } = await query('SELECT * FROM users WHERE lower(email) = lower($1)', [email])
  const user = rows[0]

  const ok = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH)
  if (!user || !ok) return res.status(401).json({ error: 'Incorrect email or password' })

  res.json({ token: signToken(user), user: publicUser(user) })
})

router.get('/me', requireAuth, async (req, res) => {
  const { rows } = await query(
    'SELECT id, full_name, email, phone, role FROM users WHERE id = $1',
    [req.user.id],
  )
  if (!rows[0]) return res.status(401).json({ error: 'Account no longer exists' })
  res.json({ user: publicUser(rows[0]) })
})

export default router
