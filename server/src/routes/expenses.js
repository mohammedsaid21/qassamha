import { Router } from 'express'
import { prisma } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { membersInclude } from '../utils/group.js'

const router = Router({ mergeParams: true })
router.use(requireAuth)

const expenseInclude = {
  payer: { select: { id: true, user: { select: { id: true, name: true } } } },
  splits: {
    select: {
      id: true,
      member: { select: { id: true, user: { select: { id: true, name: true } } } },
    },
  },
}

async function loadGroup(groupId) {
  return prisma.group.findUnique({
    where: { id: groupId },
    include: membersInclude,
  })
}

router.post('/', async (req, res) => {
  const { payerId, amount, description, splitWith } = req.body
  const group = await loadGroup(req.params.id)
  if (!group) {
    return res.status(404).json({ error: 'group not found' })
  }
  const me = group.members.find((m) => m.userId === req.user.id)
  if (!me) {
    return res.status(403).json({ error: 'you are not a member of this group' })
  }

  if (!description || !description.trim()) {
    return res.status(400).json({ error: 'description is required' })
  }
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' })
  }
  if (!group.members.some((m) => m.id === payerId)) {
    return res.status(400).json({ error: 'payer is not a member of this group' })
  }

  let splitMemberIds = Array.isArray(splitWith) && splitWith.length > 0
    ? splitWith
    : group.members.map((m) => m.id)
  if (!splitMemberIds.every((id) => group.members.some((m) => m.id === id))) {
    return res.status(400).json({ error: 'split members must belong to the group' })
  }

  const expense = await prisma.expense.create({
    data: {
      groupId: group.id,
      payerId,
      amount,
      description: description.trim(),
      splits: { create: splitMemberIds.map((memberId) => ({ memberId })) },
    },
    include: expenseInclude,
  })
  res.status(201).json(expense)
})

router.get('/', async (req, res) => {
  const group = await loadGroup(req.params.id)
  if (!group) {
    return res.status(404).json({ error: 'group not found' })
  }
  if (!group.members.some((m) => m.userId === req.user.id)) {
    return res.status(403).json({ error: 'you are not a member of this group' })
  }

  const expenses = await prisma.expense.findMany({
    where: { groupId: group.id },
    include: expenseInclude,
    orderBy: { createdAt: 'desc' },
  })
  res.json(expenses)
})

router.patch('/:expenseId', async (req, res) => {
  const { payerId, amount, description, splitWith } = req.body
  const group = await loadGroup(req.params.id)
  if (!group) {
    return res.status(404).json({ error: 'group not found' })
  }
  const me = group.members.find((m) => m.userId === req.user.id)
  if (!me) {
    return res.status(403).json({ error: 'you are not a member of this group' })
  }

  const expense = await prisma.expense.findFirst({
    where: { id: req.params.expenseId, groupId: group.id },
  })
  if (!expense) {
    return res.status(404).json({ error: 'expense not found' })
  }
  if (expense.payerId !== me.id && req.user.id !== group.ownerId) {
    return res.status(403).json({ error: 'only the payer or the owner can edit an expense' })
  }

  if (!description || !description.trim()) {
    return res.status(400).json({ error: 'description is required' })
  }
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' })
  }
  if (!group.members.some((m) => m.id === payerId)) {
    return res.status(400).json({ error: 'payer is not a member of this group' })
  }

  let splitMemberIds = Array.isArray(splitWith) && splitWith.length > 0
    ? splitWith
    : group.members.map((m) => m.id)
  if (!splitMemberIds.every((id) => group.members.some((m) => m.id === id))) {
    return res.status(400).json({ error: 'split members must belong to the group' })
  }

  const updated = await prisma.expense.update({
    where: { id: expense.id },
    data: {
      payerId,
      amount,
      description: description.trim(),
      splits: { deleteMany: {}, create: splitMemberIds.map((memberId) => ({ memberId })) },
    },
    include: expenseInclude,
  })
  res.json(updated)
})

router.delete('/:expenseId', async (req, res) => {
  const group = await loadGroup(req.params.id)
  if (!group) {
    return res.status(404).json({ error: 'group not found' })
  }
  const me = group.members.find((m) => m.userId === req.user.id)
  if (!me) {
    return res.status(403).json({ error: 'you are not a member of this group' })
  }

  const expense = await prisma.expense.findFirst({
    where: { id: req.params.expenseId, groupId: group.id },
  })
  if (!expense) {
    return res.status(404).json({ error: 'expense not found' })
  }
  if (expense.payerId !== me.id && req.user.id !== group.ownerId) {
    return res.status(403).json({ error: 'only the payer or the owner can delete an expense' })
  }

  await prisma.expense.delete({ where: { id: expense.id } })
  res.json({ ok: true })
})

export default router
