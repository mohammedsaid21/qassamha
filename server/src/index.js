import app from './app.js'
import { prisma } from './db.js'

const PORT = process.env.PORT || 4000

setInterval(() => {
  prisma.$queryRaw`SELECT 1`.catch(() => {})
}, 4 * 60 * 1000)

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
