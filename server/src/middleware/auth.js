import jwt from 'jsonwebtoken'
import { prisma } from '../db.js'

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'missing token' })
  }

  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET)
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) {
      return res.status(401).json({ error: 'user not found' })
    }
    req.user = user
    next()
  } catch {
    res.status(401).json({ error: 'invalid token' })
  }
}
