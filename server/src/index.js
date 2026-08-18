import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRoutes)

app.use((req, res) => {
  res.status(404).json({ error: 'not found' })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'something went wrong' })
})

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
