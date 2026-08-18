import { Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'
import Groups from './pages/Groups'
import GroupDetail from './pages/GroupDetail'
import ProtectedRoute from './ProtectedRoute'
import Avatar from './components/Avatar'
import { useAuth } from './AuthContext'

export default function App() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-l from-emerald-700 to-teal-600 text-white shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">قسّمها ✂️</h1>
            <p className="text-xs text-emerald-100">
              قسّموا مصاريفكم وما حد يظلم
            </p>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-full pl-3 pr-1 py-1">
                <span className="text-sm font-bold">{user.name}</span>
                <Avatar name={user.name} size="sm" />
              </div>
              <button
                onClick={logout}
                className="text-sm text-emerald-100 hover:text-white"
              >
                خروج
              </button>
            </div>
          )}
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
