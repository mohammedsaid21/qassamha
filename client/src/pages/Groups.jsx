import { useEffect, useState } from 'react'
import api from '../api'

export default function Groups() {
  const [groups, setGroups] = useState(null)
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api.get('/groups').then((res) => setGroups(res.data))
  }, [])

  async function createGroup(e) {
    e.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    try {
      const { data } = await api.post('/groups', { name })
      setGroups([data, ...groups])
      setName('')
    } finally {
      setBusy(false)
    }
  }

  if (!groups) {
    return <p className="text-center text-slate-400 py-12">جارٍ التحميل...</p>
  }

  return (
    <div className="space-y-6">
      <form onSubmit={createGroup} className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسم المجموعة الجديدة"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          type="submit"
          disabled={busy}
          className="bg-emerald-600 text-white font-bold rounded-lg px-5 hover:bg-emerald-700 disabled:opacity-50"
        >
          إنشاء
        </button>
      </form>

      <div className="space-y-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-xl border border-slate-200 p-4"
          >
            <h3 className="font-bold">{group.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
