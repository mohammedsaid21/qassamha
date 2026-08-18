import { prisma } from '../db.js'

export const membersInclude = {
  members: {
    select: {
      id: true,
      userId: true,
      joinedAt: true,
      user: { select: { id: true, name: true, email: true } },
    },
  },
}

export async function getMember(groupId, userId) {
  return prisma.member.findUnique({
    where: { groupId_userId: { groupId, userId } },
  })
}
