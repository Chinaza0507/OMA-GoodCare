import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { checkDb } from './db.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', async (_req, res) => {
  res.json({ status: 'ok', database: await checkDb() })
})

// Routes to come: /api/auth, /api/departments, /api/bookings, /api/queue

export default app
