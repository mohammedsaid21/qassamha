import { Router } from 'express'
import { prisma } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { membersInclude, getMember } from '../utils/group.js'

const router = Router()
router.use(requireAuth)

router.post('/', async (req, res) => {
  const { name } = req.body
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'group name is required' })
  }

  const group = await prisma.group.create({
    data: {
      name: name.trim(),
      ownerId: req.user.id,
      members: { create: { userId: req.user.id } },
    },
    include: membersInclude,
  })

  res.status(201).json(group)
})

router.get('/', async (req, res) => {
  const groups = await prisma.group.findMany({
    where: { members: { some: { userId: req.user.id } } },
    include: membersInclude,
    orderBy: { createdAt: 'desc' },
  })
  res.json(groups)
})

router.get('/:id', async (req, res) => {
  const group = await prisma.group.findUnique({
    where: { id: req.params.id },
    include: membersInclude,
  })
  if (!group) {
    return res.status(404).json({ error: 'group not found' })
  }

  const member = group.members.find((m) => m.userId === req.user.id)
  if (!member) {
    return res.status(403).json({ error: 'you are not a member of this group' })
  }

  res.json(group)
})

router.patch('/:id', async (req, res) => {
  const { name } = req.body
  const group = await prisma.group.findUnique({
    where: { id: req.params.id },
  })
  if (!group) {
    return res.status(404).json({ error: 'group not found' })
  }
  if (group.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'only the owner can rename the group' })
  }
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'group name is required' })
  }

  const updated = await prisma.group.update({
    where: { id: group.id },
    data: { name: name.trim() },
    include: membersInclude,
  })
  res.json(updated)
})

export default router
