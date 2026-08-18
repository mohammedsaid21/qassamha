import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../AuthContext'

export default function Auth() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'صار خطأ، جرب كمان مرة')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl border border-slate-200 p-6">
      <h2 className="text-xl font-bold mb-4">تسجيل الدخول</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">الإيميل</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={change}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">كلمة السر</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={change}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-emerald-600 text-white font-bold rounded-lg py-2.5 hover:bg-emerald-700 disabled:opacity-50"
        >
          {busy ? 'لحظة...' : 'دخول'}
        </button>
      </form>
    </div>
  )
}
