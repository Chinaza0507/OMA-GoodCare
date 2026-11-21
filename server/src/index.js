import 'dotenv/config'
import http from 'node:http'
import { Server } from 'socket.io'
import app from './app.js'

const PORT = process.env.PORT || 5001

// Fail fast instead of signing tokens with an undefined or weak secret.
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be set in server/.env and be at least 32 characters.')
  process.exit(1)
}

const server = http.createServer(app)

// Live queue updates will be emitted through this.
export const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173' },
})

io.on('connection', (socket) => {
  console.log('client connected', socket.id)
})

server.listen(PORT, () => {
  console.log(`ỌMA server running on http://localhost:${PORT}`)
})
