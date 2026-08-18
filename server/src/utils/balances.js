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

// greedy min-cash-flow: match the biggest debtor with the biggest creditor
export function settleDebts(balances) {
  const creditors = []
  const debtors = []
  for (const b of balances) {
    const cents = Math.round(b.net * 100)
    if (cents > 0) {
      creditors.push({ memberId: b.memberId, name: b.name, cents })
    } else if (cents < 0) {
      debtors.push({ memberId: b.memberId, name: b.name, cents: -cents })
    }
  }

  creditors.sort((a, b) => b.cents - a.cents)
  debtors.sort((a, b) => b.cents - a.cents)

  const transfers = []
  let ci = 0
  let di = 0
  while (ci < creditors.length && di < debtors.length) {
    const creditor = creditors[ci]
    const debtor = debtors[di]
    const amount = Math.min(creditor.cents, debtor.cents)

    transfers.push({
      fromId: debtor.memberId,
      fromName: debtor.name,
      toId: creditor.memberId,
      toName: creditor.name,
      amount: amount / 100,
    })

    creditor.cents -= amount
    debtor.cents -= amount
    if (creditor.cents === 0) ci++
    if (debtor.cents === 0) di++
  }

  return transfers
}
