import 'dotenv/config'
import { pool } from '../db.js'

const departments = [
  ['General Outpatient', 'General consultations and check-ups'],
  ['Pediatrics', 'Care for babies and children'],
  ['Antenatal / Maternity', 'Pregnancy and maternal care'],
  ['Dental', 'Dental care'],
  ['Laboratory', 'Tests and sample collection'],
  ['Pharmacy', 'Prescription collection'],
]

for (const [name, description] of departments) {
  await pool.query(
    'INSERT INTO departments (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
    [name, description],
  )
}
console.log(`Seeded ${departments.length} departments.`)
await pool.end()
