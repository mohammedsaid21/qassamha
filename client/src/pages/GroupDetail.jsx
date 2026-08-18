import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../AuthContext'
import Avatar from '../components/Avatar'

function Skeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="card p-4 h-16 animate-pulse" />
      ))}
    </div>
  )
}

export default function GroupDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [group, setGroup] = useState(null)
  const [expenses, setExpenses] = useState(null)
  const [balances, setBalances] = useState(null)
  const [settlements, setSettlements] = useState(null)
  const [form, setForm] = useState({ description: '', amount: '', payerId: '' })
  const [splitWith, setSplitWith] = useState(null)
  const [error, setError] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteError, setInviteError] = useState('')
  const [tab, setTab] = useState('expenses')

  function refresh() {
    api.get(`/groups/${id}/expenses`).then((res) => setExpenses(res.data))
    api.get(`/groups/${id}/balances`).then((res) => setBalances(res.data))
    api.get(`/groups/${id}/settlements`).then((res) => setSettlements(res.data))
  }

  useEffect(() => {
    api.get(`/groups/${id}`).then((res) => setGroup(res.data))
    refresh()
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
      refresh()
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
      refresh()
    } catch (err) {
      setError(err.response?.data?.error || 'صار خطأ، جرب كمان مرة')
    }
  }

  if (!group || !expenses || !splitWith || !balances || !settlements) {
    return (
    <div>
      <Link to="/" className="text-sm text-slate-500 hover:text-emerald-600">
        → رجوع للمجموعات
      </Link>
      <div className="mt-4">
        <Skeleton />
      </div>
    </div>
    )
  }

  const myMember = group.members.find((m) => m.userId === user.id)
  const tabs = [
    ['expenses', 'المصاريف'],
    ['balances', 'الأرصدة'],
    ['settlements', 'التسوية'],
  ]
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div>
      <Link to="/" className="text-sm text-slate-500 hover:text-emerald-600">
        → رجوع للمجموعات
      </Link>

      <div className="card p-5 mt-3 flex items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-extrabold">{group.name}</h2>
          <p className="text-sm text-slate-400">
            {group.members.length} أعضاء · إجمالي المصاريف {Math.round(total)} ₪
          </p>
        </div>
        <div className="flex -space-x-2 rtl:space-x-reverse">
          {group.members.slice(0, 4).map((m) => (
            <Avatar key={m.id} name={m.user.name} size="md" />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {group.members.map((member) => (
          <span
            key={member.id}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-bold ${
              member.id === myMember?.id
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-white border border-stone-200'
            }`}
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
          className="input flex-1"
          dir="ltr"
        />
        <button
          type="submit"
          className="bg-white border border-stone-300 text-slate-600 font-bold rounded-xl px-4 text-sm hover:border-emerald-400 transition-colors"
        >
          دعوة
        </button>
      </form>
      {inviteError && <p className="text-sm text-rose-600 mt-1">{inviteError}</p>}

      <div className="flex gap-1.5 mt-6 bg-white border border-stone-200 rounded-2xl p-1.5 w-fit">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-xl px-5 py-2 text-sm font-bold transition-colors ${
              tab === key
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'expenses' && (
        <>
          <form onSubmit={addExpense} className="card p-4 mt-5 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="شو دفعتم؟ (فطور، بنزين...)"
                required
                className="input flex-1"
              />
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="₪"
                min="1"
                step="0.01"
                required
                className="input w-24"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap text-sm">
              <span className="text-xs text-slate-400 font-bold">دفع:</span>
              <select
                value={form.payerId}
                onChange={(e) => setForm({ ...form, payerId: e.target.value })}
                className="input py-1.5"
              >
                {group.members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.user.name}
                  </option>
                ))}
              </select>
              <span className="text-xs text-slate-400 font-bold mr-2">
                على مين:
              </span>
              {group.members.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => toggleSplit(m.id)}
                  className={`rounded-full px-3 py-1 border transition-colors ${
                    splitWith.includes(m.id)
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-500 border-stone-200'
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
              className="btn-primary px-6 text-sm"
            >
              أضف المصروف
            </button>
          </form>

          <div className="space-y-2.5 mt-5">
            {expenses.length === 0 && (
              <div className="card p-8 text-center text-slate-400 text-sm">
                ما في مصاريف لسا — أول واحد دفع؟ سجلها فوق
              </div>
            )}
            {expenses.map((expense) => {
              const canDelete =
                expense.payerId === myMember?.id || group.ownerId === user.id
              return (
                <div
                  key={expense.id}
                  className="card p-4 flex items-center gap-3"
                >
                  <Avatar name={expense.payer.user.name} />
                  <div className="flex-1">
                    <p className="font-bold">{expense.description}</p>
                    <p className="text-xs text-slate-400">
                      دفع {expense.payer.user.name} · على{' '}
                      {expense.splits.length} أشخاص
                    </p>
                  </div>
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
              )
            })}
          </div>
        </>
      )}

      {tab === 'balances' && (
        <div className="grid gap-3 mt-5 sm:grid-cols-2">
          {balances.map((b) => (
            <div key={b.memberId} className="card p-4 flex items-center gap-3">
              <Avatar name={b.name} />
              <div className="flex-1">
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
        <div className="mt-5 space-y-3">
          {settlements.length === 0 ? (
            <div className="card p-10 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <p className="font-bold">كل الحسابات متساوية</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500">
                خطة التسوية — أقل عدد تحويلات ممكن ({settlements.length}):
              </p>
              {settlements.map((t, i) => (
                <div key={i} className="card p-4 flex items-center gap-3">
                  <Avatar name={t.fromName} />
                  <div className="flex-1 text-center">
                    <p className="font-bold text-rose-600">{t.fromName}</p>
                    <p className="text-xs text-slate-400">يدفع لـ ↓</p>
                  </div>
                  <Avatar name={t.toName} />
                  <span className="bg-emerald-100 text-emerald-800 font-extrabold rounded-full px-4 py-1.5">
                    {t.amount} ₪
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
