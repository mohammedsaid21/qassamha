import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../AuthContext'
import { useLang, useApiError } from '../i18n'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { login } = useAuth()
  const { t } = useLang()
  const apiError = useApiError()
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
      setError(err.response?.data?.error)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-6">
      <div className="card p-7">
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl font-bold">
            {mode === 'login' ? t('loginTitle') : t('registerTitle')}
          </h2>
          <p className="text-sm text-inksoft mt-1">
            {mode === 'login' ? t('loginSub') : t('registerSub')}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-bold mb-1.5">{t('nameLabel')}</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={change}
                required
                className="input w-full"
                placeholder={t('namePlaceholder')}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold mb-1.5">{t('emailLabel')}</label>
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
            <label className="block text-sm font-bold mb-1.5">{t('passwordLabel')}</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={change}
              required
              className="input w-full"
              placeholder={t('passwordPlaceholder')}
              dir="ltr"
            />
          </div>

          {error && (
            <p className="text-sm text-debt bg-debtwash rounded-lg px-3 py-2">
              {apiError(error)}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn-pen w-full">
            {busy
              ? t('busy')
              : mode === 'login'
                ? t('loginBtn')
                : t('registerBtn')}
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
          {mode === 'login' ? t('toRegister') : t('toLogin')}
        </button>
      </div>

      {mode === 'login' && (
        <p className="text-center text-xs text-inksoft mt-4 leading-relaxed">
          {t('demoHint')}{' '}
          <span className="num" dir="ltr">demo@qassamha.app / Demo1234!</span>
        </p>
      )}
    </div>
  )
}
