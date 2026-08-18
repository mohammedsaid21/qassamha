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
    <div className="max-w-sm mx-auto mt-6">
      <div className="card p-7">
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl font-bold">
            {mode === 'login' ? 'أهلاً برجوعك' : 'خلينا نتعرف'}
          </h2>
          <p className="text-sm text-inksoft mt-1">
            {mode === 'login'
              ? 'سجّل دخولك وكمّل من حيث وقفت'
              : 'حساب جديد وبتتقلع بمجموعتك الأولى'}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-bold mb-1.5">الاسم</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={change}
                required
                className="input w-full"
                placeholder="شنو بنناديك؟"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold mb-1.5">الإيميل</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={change}
              required
              className="input w-full"
              placeholder="you@example.com"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1.5">كلمة السر</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={change}
              required
              className="input w-full"
              placeholder="6 أحرف على الأقل"
              dir="ltr"
            />
          </div>

          {error && (
            <p className="text-sm text-debt bg-debtwash rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn-pen w-full">
            {busy ? 'لحظة...' : mode === 'login' ? 'دخول' : 'أنشئ الحساب'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login')
            setError('')
          }}
          className="w-full mt-5 text-sm text-pen font-bold hover:underline"
        >
          {mode === 'login' ? 'ما معك حساب؟ أنشئ واحد' : 'عندك حساب؟ سجّل دخول'}
        </button>
      </div>

      {mode === 'login' && (
        <p className="text-center text-xs text-inksoft mt-4 leading-relaxed">
          للتجربة السريعة:{' '}
          <span className="num" dir="ltr">demo@qassamha.app / Demo1234!</span>
        </p>
      )}
    </div>
  )
}
