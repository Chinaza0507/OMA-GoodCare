import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

// Public: patients pick a department when booking.
router.get('/', async (_req, res) => {
  const { rows } = await query(
    'SELECT id, name, description FROM departments WHERE active ORDER BY name',
  )
  res.json({ departments: rows })
})

export default router
