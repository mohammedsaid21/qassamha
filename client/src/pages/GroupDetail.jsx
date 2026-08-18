import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../AuthContext'

export default function GroupDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [group, setGroup] = useState(null)
  const [expenses, setExpenses] = useState(null)
  const [balances, setBalances] = useState(null)
  const [settlements, setSettlements] = useState(null)
  const [tab, setTab] = useState('expenses')
  const [form, setForm] = useState({ description: '', amount: '', payerId: '' })
  const [splitWith, setSplitWith] = useState(null)
  const [error, setError] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteError, setInviteError] = useState('')

  useEffect(() => {
    api.get(`/groups/${id}`).then((res) => setGroup(res.data))
    api.get(`/groups/${id}/expenses`).then((res) => setExpenses(res.data))
    api.get(`/groups/${id}/balances`).then((res) => setBalances(res.data))
    api.get(`/groups/${id}/settlements`).then((res) => setSettlements(res.data))
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

  async function inviteMember(e) {
    e.preventDefault()
    setInviteError('')
    try {
      const { data } = await api.post(`/groups/${id}/members`, {
        email: inviteEmail,
      })
      setGroup({ ...group, members: [...group.members, data] })
      setInviteEmail('')
    } catch (err) {
      setInviteError(err.response?.data?.error || 'صار خطأ')
    }
  }

  async function deleteExpense(expenseId) {
    try {
      await api.delete(`/groups/${id}/expenses/${expenseId}`)
      setExpenses(expenses.filter((e) => e.id !== expenseId))
      api.get(`/groups/${id}/balances`).then((res) => setBalances(res.data))
      api.get(`/groups/${id}/settlements`).then((res) => setSettlements(res.data))
    } catch (err) {
      setError(err.response?.data?.error || 'ما قدرنا نحذف')
    }
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
      api.get(`/groups/${id}/balances`).then((res) => setBalances(res.data))
      api.get(`/groups/${id}/settlements`).then((res) => setSettlements(res.data))
    } catch (err) {
      setError(err.response?.data?.error || 'صار خطأ، جرب كمان مرة')
    }
  }

  if (!group || !expenses || !splitWith || !balances || !settlements) {
    return <p className="text-center text-slate-400 py-12">جارٍ التحميل...</p>
  }

  const tabs = [
    ['expenses', 'المصاريف'],
    ['balances', 'الأرصدة'],
    ['settlements', 'التسوية'],
  ]

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

      <form onSubmit={inviteMember} className="flex gap-2 mt-3">
        <input
          type="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="إيميل عضو تدعوه للمجموعة"
          required
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          type="submit"
          className="bg-white border border-slate-300 text-slate-600 font-bold rounded-lg px-4 text-sm hover:border-emerald-400"
        >
          دعوة
        </button>
      </form>
      {inviteError && <p className="text-sm text-rose-600 mt-1">{inviteError}</p>}

      <div className="flex gap-2 mt-8">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${
              tab === key
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-500 border border-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'expenses' && (
        <>
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
        {expenses.map((expense) => {
          const mine =
            expense.payerId === group.members.find((m) => m.userId === user.id)?.id
          const canDelete = mine || group.ownerId === user.id
          return (
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
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-emerald-700">
                  {expense.amount} ₪
                </span>
                {canDelete && (
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="text-slate-300 hover:text-rose-600 text-lg leading-none"
                    title="حذف"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
        </>
      )}

      {tab === 'balances' && (
        <div className="grid gap-3 mt-6 sm:grid-cols-2">
          {balances.map((b) => (
            <div
              key={b.memberId}
              className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-bold">{b.name}</p>
                <p className="text-xs text-slate-400">
                  دفع {b.paid} ₪ · عليه {b.owed} ₪
                </p>
              </div>
              {b.net === 0 ? (
                <span className="text-sm text-slate-400">متساوي 🎉</span>
              ) : (
                <span
                  className={`font-extrabold ${
                    b.net > 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {b.net > 0 ? `له ${b.net}` : `عليه ${-b.net}`} ₪
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'settlements' && (
        <div className="mt-6 space-y-3">
          {settlements.length === 0 ? (
            <p className="text-center text-slate-400 py-8">
              كل الحسابات متساوية 🎉
            </p>
          ) : (
            <>
              <p className="text-sm text-slate-500">
                أقل عدد تحويلات لتسوية كل الديون ({settlements.length} تحويل):
              </p>
              {settlements.map((t, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between"
                >
                  <p className="font-semibold">
                    <span className="text-rose-600">{t.fromName}</span>
                    <span className="text-slate-400 mx-2">يدفع لـ</span>
                    <span className="text-emerald-600">{t.toName}</span>
                  </p>
                  <span className="font-extrabold">{t.amount} ₪</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
