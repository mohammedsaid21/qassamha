import { Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'
import Groups from './pages/Groups'
import GroupDetail from './pages/GroupDetail'
import ProtectedRoute from './ProtectedRoute'
import Avatar from './components/Avatar'
import { useAuth } from './AuthContext'
import { useLang } from './i18n'

export default function App() {
  const { user, logout } = useAuth()
  const { lang, switchLang, t } = useLang()

  return (
    <div className="min-h-screen">
      <header className="bg-white/85 backdrop-blur border-b border-hairline sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h1 className="font-display text-2xl font-bold leading-none">{t('brand')}</h1>
            <span className="text-xs text-inksoft hidden sm:inline">{t('tagline')}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => switchLang(lang === 'ar' ? 'en' : 'ar')}
              className="text-xs font-bold text-pen bg-penwash rounded-full px-3 py-1.5 hover:opacity-80"
            >
              {t('switchLang')}
            </button>
            {user && (
              <>
                <div className="flex items-center gap-2 bg-penwash rounded-full py-1 pr-3 pl-1.5">
                  <span className="text-xs font-bold text-pen">{user.name}</span>
                  <Avatar name={user.name} size="sm" />
                </div>
                <button
                  onClick={logout}
                  className="text-xs text-inksoft hover:text-debt font-bold"
                >
                  {t('logout')}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Groups />
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups/:id"
            element={
              <ProtectedRoute>
                <GroupDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}
