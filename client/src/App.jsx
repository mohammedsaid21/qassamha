import { Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-extrabold text-emerald-600">قسّمها</h1>
          <p className="text-sm text-slate-500">قسّموا مصاريفكم وما حد يظلم</p>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<div className="text-slate-400">قريباً...</div>} />
        </Routes>
      </main>
    </div>
  )
}
