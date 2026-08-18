import { Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'
import ProtectedRoute from './ProtectedRoute'

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-extrabold text-emerald-600">قسّمها</h1>
          <p className="text-xs text-slate-500">قسّموا مصاريفكم وما حد يظلم</p>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <p className="text-slate-400">المجموعات قريباً...</p>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}
