import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { ZodError } from 'zod'
import { checkDb } from './db.js'
import authRoutes from './routes/auth.js'
import departmentRoutes from './routes/departments.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json({ limit: '10kb' }))

app.get('/api/health', async (_req, res) => {
  res.json({ status: 'ok', database: await checkDb() })
})

app.use('/api/auth', authRoutes)
app.use('/api/departments', departmentRoutes)
// Routes to come: /api/bookings, /api/queue

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }))

// Central error handler (Express 5 forwards async errors here automatically).
app.use((err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Invalid input',
      details: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    })
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON' })
  }
  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
})

export default app
