import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { useLang } from './i18n'
import Loader from './components/Loader'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const { t } = useLang()

  if (loading) {
    return <Loader label={t('loaderProtected')} />
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}
