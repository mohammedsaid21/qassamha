import { Router } from 'express'
import { prisma } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { membersInclude } from '../utils/group.js'

const router = Router({ mergeParams: true })
router.use(requireAuth)

router.post('/', async (req, res) => {
  const { email } = req.body
  const group = await prisma.group.findUnique({
    where: { id: req.params.id },
    include: membersInclude,
  })
  if (!group) {
    return res.status(404).json({ error: 'group not found' })
  }
  if (!group.members.some((m) => m.userId === req.user.id)) {
    return res.status(403).json({ error: 'you are not a member of this group' })
  }
  if (!email) {
    return res.status(400).json({ error: 'member email is required' })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return res.status(404).json({ error: 'no user with this email' })
  }
  if (group.members.some((m) => m.userId === user.id)) {
    return res.status(409).json({ error: 'already a member' })
  }

  const member = await prisma.member.create({
    data: { groupId: group.id, userId: user.id },
    select: {
      id: true,
      userId: true,
      joinedAt: true,
      user: { select: { id: true, name: true, email: true } },
    },
  })
  res.status(201).json(member)
})

router.delete('/:memberId', async (req, res) => {
  const group = await prisma.group.findUnique({
    where: { id: req.params.id },
    include: membersInclude,
  })
  if (!group) {
    return res.status(404).json({ error: 'group not found' })
  }
  const me = group.members.find((m) => m.userId === req.user.id)
  if (!me) {
    return res.status(403).json({ error: 'you are not a member of this group' })
  }

  const target = group.members.find((m) => m.id === req.params.memberId)
  if (!target) {
    return res.status(404).json({ error: 'member not found' })
  }
  if (target.userId === group.ownerId) {
    return res.status(400).json({ error: 'cannot remove the group owner' })
  }
  if (target.id !== me.id && req.user.id !== group.ownerId) {
    return res.status(403).json({ error: 'only the owner can remove members' })
  }

  const expenseCount = await prisma.expense.count({
    where: {
      groupId: group.id,
      OR: [{ payerId: target.id }, { splits: { some: { memberId: target.id } } }],
    },
  })
  if (expenseCount > 0) {
    return res.status(400).json({ error: 'this member has expenses and cannot be removed' })
  }

  await prisma.member.delete({ where: { id: target.id } })
  res.json({ ok: true })
})

export default router
