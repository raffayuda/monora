import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import authRoutes from './routes/auth.js'
import usersRoutes from './routes/users.js'
import categoriesRoutes from './routes/categories.js'
import eventsRoutes from './routes/events.js'
import ordersRoutes from './routes/orders.js'
import vouchersRoutes from './routes/vouchers.js'
import refundsRoutes from './routes/refunds.js'
import chatsRoutes from './routes/chats.js'
import aiRoutes from './routes/ai.js'
import contactRoutes from './routes/contact.js'

// BigInt JSON serialization
BigInt.prototype.toJSON = function () {
  return Number(this)
}

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/events', eventsRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/vouchers', vouchersRoutes)
app.use('/api/refunds', refundsRoutes)
app.use('/api/chats', chatsRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/contact', contactRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
