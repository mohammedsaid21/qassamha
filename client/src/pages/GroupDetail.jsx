import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../AuthContext'
import { useLang, useApiError } from '../i18n'
import Avatar from '../components/Avatar'
import Loader from '../components/Loader'

export default function GroupDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { t } = useLang()
  const apiError = useApiError()
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
  const [editing, setEditing] = useState(false)
  const [nameVal, setNameVal] = useState('')

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

  async function saveName(e) {
    e.preventDefault()
    if (!nameVal.trim()) return
    try {
      const { data } = await api.patch(`/groups/${id}`, { name: nameVal })
      setGroup(data)
      setEditing(false)
    } catch (err) {
      setError(err.response?.data?.error)
    }
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
      setInviteError(err.response?.data?.error)
    }
  }

  async function deleteExpense(expenseId) {
    try {
      await api.delete(`/groups/${id}/expenses/${expenseId}`)
      setExpenses(expenses.filter((e) => e.id !== expenseId))
      refresh()
    } catch (err) {
      setError(err.response?.data?.error)
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
      setError(err.response?.data?.error)
    }
  }

  if (!group || !expenses || !splitWith || !balances || !settlements) {
    return (
      <div>
        <Link to="/" className="text-sm text-inksoft hover:text-pen">
          {t('backArrow')} {t('backToGroups')}
        </Link>
        <div className="mt-4">
          <Loader label={t('loaderDetail')} />
        </div>
      </div>
    )
  }

  const myMember = group.members.find((m) => m.userId === user.id)
  const isOwner = group.ownerId === user.id
  const tabs = [
    ['expenses', t('tabExpenses')],
    ['balances', t('tabBalances')],
    ['settlements', t('tabSettlements')],
  ]
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div>
      <Link to="/" className="text-sm text-inksoft hover:text-pen">
        {t('backArrow')} {t('backToGroups')}
      </Link>

      <div className="card px-5 py-4 mt-3">
        <div className="flex items-center gap-3">
          {editing ? (
            <form onSubmit={saveName} className="flex-1 flex gap-2">
              <input
                value={nameVal}
                onChange={(e) => setNameVal(e.target.value)}
                className="input flex-1"
                autoFocus
              />
              <button className="btn-pen text-sm px-4 py-2">{t('save')}</button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="btn-ghost text-sm px-4 py-2"
              >
                {t('cancel')}
              </button>
            </form>
          ) : (
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <h2 className="font-display text-2xl font-bold truncate">
                {group.name}
              </h2>
              {isOwner && (
                <button
                  onClick={() => {
                    setNameVal(group.name)
                    setEditing(true)
                  }}
                  title={t('renameTitle')}
                  className="text-inksoft hover:text-pen"
                >
                  ✎
                </button>
              )}
            </div>
          )}
          <div className="flex -space-x-2 rtl:space-x-reverse">
            {group.members.slice(0, 4).map((m) => (
              <Avatar key={m.id} name={m.user.name} size="md" />
            ))}
          </div>
        </div>
        <p className="text-xs text-inksoft mt-1.5 num">
          {t('metaLine', { n: group.members.length, total: Math.round(total) })}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {group.members.map((member) => (
          <span
            key={member.id}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-bold ${
              member.id === myMember?.id
                ? 'bg-penwash text-pen'
                : 'bg-white border border-hairline text-inksoft'
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
          placeholder={t('invitePlaceholder')}
          required
          className="input flex-1"
          dir="ltr"
        />
        <button type="submit" className="btn-ghost text-sm px-4 py-2">
          {t('inviteBtn')}
        </button>
      </form>
      {inviteError && (
        <p className="text-sm text-debt mt-1">{apiError(inviteError)}</p>
      )}

      <div className="flex gap-5 mt-6 border-b border-hairline">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`pb-2.5 -mb-px text-sm font-bold border-b-2 transition-colors ${
              tab === key
                ? 'border-pen text-pen'
                : 'border-transparent text-inksoft hover:text-ink'
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
                placeholder={t('descPlaceholder')}
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
                className="input w-24 num"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap text-sm">
              <span className="text-xs text-inksoft font-bold">{t('paidBy')}</span>
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
              <span className="text-xs text-inksoft font-bold mr-2">
                {t('splitBetween')}
              </span>
              {group.members.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => toggleSplit(m.id)}
                  className={`rounded-full px-3 py-1 border transition-colors ${
                    splitWith.includes(m.id)
                      ? 'bg-pen text-white border-pen'
                      : 'bg-white text-inksoft border-hairline hover:border-pen/50'
                  }`}
                >
                  {m.user.name}
                </button>
              ))}
            </div>
            {error && <p className="text-sm text-debt">{apiError(error)}</p>}
            <button
              type="submit"
              disabled={splitWith.length === 0}
              className="btn-pen px-6 text-sm"
            >
              {t('addExpenseBtn')}
            </button>
          </form>

          <div className="mt-5">
            {expenses.length === 0 ? (
              <div className="card p-8 text-center text-inksoft text-sm">
                {t('expensesEmpty')}
              </div>
            ) : (
              <div className="card px-5 py-1">
                {expenses.map((expense) => {
                  const canDelete =
                    expense.payerId === myMember?.id || isOwner
                  return (
                    <div
                      key={expense.id}
                      className="flex items-center gap-3 py-3 border-b border-dashed border-hairline last:border-0"
                    >
                      <Avatar name={expense.payer.user.name} size="sm" />
                      <p className="font-bold truncate max-w-[45%]">
                        {expense.description}
                      </p>
                      <span className="flex-1 border-b border-dotted border-ink/20 -translate-y-1" />
                      <span className="text-xs text-inksoft whitespace-nowrap hidden sm:inline">
                        {t('splitCount', { n: expense.splits.length })}
                      </span>
                      <span className="num font-bold whitespace-nowrap">
                        {expense.amount} ₪
                      </span>
                      {canDelete && (
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          className="text-inksoft/40 hover:text-debt text-lg leading-none"
                          title={t('delete')}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  )
                })}
                <div className="flex items-center gap-2 py-3">
                  <span className="text-xs font-bold text-inksoft">
                    {t('total')}
                  </span>
                  <span className="flex-1 border-b border-dotted border-ink/20 -translate-y-1" />
                  <span className="num font-bold">{Math.round(total)} ₪</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'balances' && (
        <div className="card mt-5 overflow-hidden">
          <div className="grid grid-cols-[1fr_4rem_4rem_6rem] gap-x-3 px-5 py-2.5 bg-penwash text-xs font-bold text-pen">
            <span>{t('thMember')}</span>
            <span className="text-center">{t('thPaid')}</span>
            <span className="text-center">{t('thOwed')}</span>
            <span className="text-center">{t('thNet')}</span>
          </div>
          {balances.map((b) => (
            <div
              key={b.memberId}
              className="grid grid-cols-[1fr_4rem_4rem_6rem] gap-x-3 px-5 py-3 border-t border-hairline items-center"
            >
              <span className="flex items-center gap-2 font-bold text-sm truncate">
                <Avatar name={b.name} size="sm" />
                {b.name}
              </span>
              <span className="num text-sm text-inksoft text-center">
                {b.paid}
              </span>
              <span className="num text-sm text-inksoft text-center">
                {b.owed}
              </span>
              <span className="text-center">
                {b.net === 0 ? (
                  <span className="text-xs text-inksoft">{t('even')}</span>
                ) : (
                  <span
                    className={`num text-sm font-bold ${
                      b.net > 0 ? 'text-credit' : 'text-debt'
                    }`}
                  >
                    {b.net > 0
                      ? t('gets', { n: Math.abs(b.net) })
                      : t('owes', { n: Math.abs(b.net) })}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === 'settlements' && (
        <div className="mt-5 space-y-3">
          {settlements.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="font-display font-bold text-lg">
                {t('settledTitle')}
              </p>
              <p className="text-sm text-inksoft mt-1">{t('settledSub')}</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-inksoft">
                {t('settlementsIntro', { n: settlements.length })}
              </p>
              {settlements.map((t2, i) => (
                <div key={i} className="card p-4 flex items-center gap-3">
                  <Avatar name={t2.fromName} />
                  <div className="flex-1 min-w-0 text-sm">
                    <span className="font-bold text-debt">{t2.fromName}</span>
                    <span className="text-inksoft"> {t('paysLabel')} </span>
                    <span className="font-bold">{t2.toName}</span>
                  </div>
                  <span className="num font-bold bg-penwash text-pen rounded-full px-4 py-1.5">
                    {t2.amount} ₪
                  </span>
                  <Avatar name={t2.toName} />
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
