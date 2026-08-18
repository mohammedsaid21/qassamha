import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../AuthContext'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
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
      const { data } = await api.post(`/auth/${mode}`, form)
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
      <h2 className="text-xl font-bold mb-4">
        {mode === 'login' ? 'تسجيل الدخول' : 'حساب جديد'}
      </h2>
      <form onSubmit={submit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label className="block text-sm font-semibold mb-1">الاسم</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={change}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        )}
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
          {busy ? 'لحظة...' : mode === 'login' ? 'دخول' : 'أنشئ الحساب'}
        </button>
      </form>
      <button
        type="button"
        onClick={() => {
          setMode(mode === 'login' ? 'register' : 'login')
          setError('')
        }}
        className="w-full mt-4 text-sm text-emerald-700 hover:underline"
      >
        {mode === 'login' ? 'ما معك حساب؟ أنشئ واحد' : 'عندك حساب؟ سجل دخول'}
      </button>
    </div>
  )
}
