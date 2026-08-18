import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const day = 24 * 60 * 60 * 1000
const ago = (days) => new Date(Date.now() - days * day)

async function main() {
  await prisma.expenseSplit.deleteMany()
  await prisma.expense.deleteMany()
  await prisma.member.deleteMany()
  await prisma.group.deleteMany()
  await prisma.user.deleteMany()

  const password = await bcrypt.hash('Demo1234!', 10)
  const mkUser = (name, email) =>
    prisma.user.create({ data: { name, email, password } })

  const moh = await mkUser('محمد', 'demo@qassamha.app')
  const ahmad = await mkUser('أحمد', 'ahmad@qassamha.app')
  const sara = await mkUser('سارة', 'sara@qassamha.app')
  const lina = await mkUser('لينا', 'lina@qassamha.app')
  const karim = await mkUser('كريم', 'karim@qassamha.app')
  const rahaf = await mkUser('رهف', 'rahaf@qassamha.app')

  async function mkGroup(name, ownerId, others) {
    const group = await prisma.group.create({
      data: {
        name,
        ownerId,
        createdAt: ago(others.length * 7 + 2),
        members: {
          create: [
            { userId: ownerId, joinedAt: ago(others.length * 7 + 2) },
            ...others.map((u, i) => ({
              userId: u.id,
              joinedAt: ago((others.length - i) * 6),
            })),
          ],
        },
      },
      include: { members: true },
    })
    const byUser = Object.fromEntries(group.members.map((m) => [m.userId, m]))
    return { group, m: (u) => byUser[u.id] }
  }

  async function addExpense(group, payer, amount, description, days, members) {
    await prisma.expense.create({
      data: {
        groupId: group.id,
        payerId: payer.id,
        amount,
        description,
        createdAt: ago(days),
        splits: { create: members.map((m) => ({ memberId: m.id })) },
      },
    })
  }

  const trip = await mkGroup('رحلة بحر غزة', moh.id, [ahmad, sara, lina])
  await addExpense(trip.group, trip.m(moh), 150, 'بنزين', 6, trip.group.members)
  await addExpense(trip.group, trip.m(ahmad), 120, 'شاورما على البحر', 5, trip.group.members)
  await addExpense(trip.group, trip.m(sara), 65, 'آيس كريم وقهوة', 4, trip.group.members)
  await addExpense(trip.group, trip.m(lina), 38, 'بطيخ وبرتقال', 3, [trip.m(moh), trip.m(lina)])
  await addExpense(trip.group, trip.m(moh), 80, 'مواصفات الرجوع', 3, [trip.m(ahmad), trip.m(sara)])

  const flat = await mkGroup('بيت الشباب', ahmad.id, [moh, karim])
  await addExpense(flat.group, flat.m(ahmad), 340, 'فاتورة الكهرب', 10, flat.group.members)
  await addExpense(flat.group, flat.m(karim), 150, 'إنترنت الشهر', 8, flat.group.members)
  await addExpense(flat.group, flat.m(moh), 275.5, 'تسوق سوبرماركت', 5, flat.group.members)
  await addExpense(flat.group, flat.m(ahmad), 180, 'صيانة الغسالة', 2, [flat.m(ahmad), flat.m(karim)])

  const coffee = await mkGroup('قهوة الخميس', sara.id, [moh, rahaf, lina])
  await addExpense(coffee.group, coffee.m(sara), 90, 'أرجيلة', 7, coffee.group.members)
  await addExpense(coffee.group, coffee.m(rahaf), 45, 'حلويات مع القهوة', 7, coffee.group.members)
  await addExpense(coffee.group, coffee.m(lina), 36, 'كابتشينو', 6, coffee.group.members)

  console.log('seed done: 6 users, 3 groups, 12 expenses')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
