import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../AuthContext'

export default function GroupDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [group, setGroup] = useState(null)
  const [expenses, setExpenses] = useState(null)
  const [form, setForm] = useState({ description: '', amount: '', payerId: '' })
  const [splitWith, setSplitWith] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/groups/${id}`).then((res) => setGroup(res.data))
    api.get(`/groups/${id}/expenses`).then((res) => setExpenses(res.data))
  }, [id])

  useEffect(() => {
    if (!group || splitWith) return
    setSplitWith(group.members.map((m) => m.id))
    const me = group.members.find((m) => m.userId === user.id)
    if (me) {
      setForm((f) => ({ ...f, payerId: me.id }))
    }
  }, [group])

  function toggleSplit(memberId) {
    setSplitWith((prev) =>
      prev.includes(memberId)
        ? prev.filter((x) => x !== memberId)
        : [...prev, memberId],
    )
  }

  async function addExpense(e) {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post(`/groups/${id}/expenses`, {
        description: form.description,
        amount: Number(form.amount),
        payerId: form.payerId,
        splitWith,
      })
      setExpenses([data, ...expenses])
      setForm({ ...form, description: '', amount: '' })
    } catch (err) {
      setError(err.response?.data?.error || 'صار خطأ، جرب كمان مرة')
    }
  }

  if (!group || !expenses || !splitWith) {
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

      <form
        onSubmit={addExpense}
        className="bg-white rounded-xl border border-slate-200 p-4 mt-6 space-y-3"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="شو دفعتم؟ (فطور، بنزين...)"
            required
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="المبلغ"
            min="1"
            step="0.01"
            required
            className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap text-sm">
          <span className="text-xs text-slate-400">دفع:</span>
          <select
            value={form.payerId}
            onChange={(e) => setForm({ ...form, payerId: e.target.value })}
            className="rounded-lg border border-slate-300 px-2 py-1.5"
          >
            {group.members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 flex-wrap text-sm">
          <span className="text-xs text-slate-400">على مين:</span>
          {group.members.map((m) => (
            <button
              type="button"
              key={m.id}
              onClick={() => toggleSplit(m.id)}
              className={`rounded-full px-3 py-1 border ${
                splitWith.includes(m.id)
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              {m.user.name}
            </button>
          ))}
        </div>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button
          type="submit"
          disabled={splitWith.length === 0}
          className="bg-emerald-600 text-white font-bold rounded-lg px-5 py-2 text-sm hover:bg-emerald-700 disabled:opacity-50"
        >
          أضف المصروف
        </button>
      </form>

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
