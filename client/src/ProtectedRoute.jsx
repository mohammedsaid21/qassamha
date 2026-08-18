import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <p className="text-center text-slate-400 py-12">جارٍ التحميل...</p>
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}
