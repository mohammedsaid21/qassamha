export function round2(n) {
  return Math.round(n * 100) / 100
}

export function computeBalances(members, expenses) {
  const balances = new Map()
  for (const member of members) {
    balances.set(member.id, { memberId: member.id, name: member.user.name, paid: 0, owed: 0 })
  }

  for (const expense of expenses) {
    const payer = balances.get(expense.payerId)
    if (payer) payer.paid += expense.amount

    const share = expense.amount / expense.splits.length
    for (const split of expense.splits) {
      const target = balances.get(split.memberId)
      if (target) target.owed += share
    }
  }

  return [...balances.values()].map((b) => ({
    ...b,
    paid: round2(b.paid),
    owed: round2(b.owed),
    net: round2(b.paid - b.owed),
  }))
}
