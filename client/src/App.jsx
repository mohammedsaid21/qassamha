import { Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'
import Groups from './pages/Groups'
import GroupDetail from './pages/GroupDetail'
import ProtectedRoute from './ProtectedRoute'
import { useAuth } from './AuthContext'

export default function App() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-emerald-600">قسّمها</h1>
            <p className="text-xs text-slate-500">قسّموا مصاريفكم وما حد يظلم</p>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold">{user.name}</span>
              <button
                onClick={logout}
                className="text-sm text-slate-500 hover:text-rose-600"
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
