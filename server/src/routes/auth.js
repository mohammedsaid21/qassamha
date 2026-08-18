import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../db.js'

const router = Router()

function signToken(user) {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email }
}

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'password must be at least 6 characters' })
  }

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    return res.status(409).json({ error: 'this email is already registered' })
  }

  const user = await prisma.user.create({
    data: { name, email, password: await bcrypt.hash(password, 10) },
  })

  res.status(201).json({ token: signToken(user), user: publicUser(user) })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'wrong email or password' })
  }

  res.json({ token: signToken(user), user: publicUser(user) })
})

export default router
