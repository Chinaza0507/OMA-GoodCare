import 'dotenv/config'
import http from 'node:http'
import { Server } from 'socket.io'
import app from './app.js'

const PORT = process.env.PORT || 5001

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
