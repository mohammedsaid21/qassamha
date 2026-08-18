import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api'

export default function GroupDetail() {
  const { id } = useParams()
  const [group, setGroup] = useState(null)
  const [expenses, setExpenses] = useState(null)

  useEffect(() => {
    api.get(`/groups/${id}`).then((res) => setGroup(res.data))
    api.get(`/groups/${id}/expenses`).then((res) => setExpenses(res.data))
  }, [id])

  if (!group || !expenses) {
    return <p className="text-center text-slate-400 py-12">جارٍ التحميل...</p>
  }

  return (
    <div>
      <Link to="/" className="text-sm text-slate-500 hover:text-emerald-600">
        → رجوع للمجموعات
      </Link>
      <h2 className="text-2xl font-extrabold mt-3">{group.name}</h2>
      <div className="flex flex-wrap gap-2 mt-3">
        {group.members.map((member) => (
          <span
            key={member.id}
            className="bg-white border border-slate-200 rounded-full px-3 py-1 text-sm"
          >
            {member.user.name}
            {member.userId === group.ownerId && ' 👑'}
          </span>
        ))}
      </div>

      <h3 className="font-bold mt-8 mb-3">المصاريف</h3>
      <div className="space-y-2">
        {expenses.length === 0 && (
          <p className="text-slate-400 text-sm">ما في مصاريف لسا</p>
        )}
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold">{expense.description}</p>
              <p className="text-xs text-slate-400">
                دفع {expense.payer.user.name} · على {expense.splits.length} أشخاص
              </p>
            </div>
            <span className="font-extrabold text-emerald-700">
              {expense.amount} ₪
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
