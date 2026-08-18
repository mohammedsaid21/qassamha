import { Router } from 'express'
import { prisma } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { membersInclude } from '../utils/group.js'
import { computeBalances } from '../utils/balances.js'

const router = Router({ mergeParams: true })
router.use(requireAuth)

router.get('/', async (req, res) => {
  const group = await prisma.group.findUnique({
    where: { id: req.params.id },
    include: {
      members: membersInclude.members,
      expenses: { include: { splits: true } },
    },
  })
  if (!group) {
    return res.status(404).json({ error: 'group not found' })
  }
  if (!group.members.some((m) => m.userId === req.user.id)) {
    return res.status(403).json({ error: 'you are not a member of this group' })
  }

  res.json(computeBalances(group.members, group.expenses))
})

export default router
