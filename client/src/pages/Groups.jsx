import { useEffect, useState } from 'react'
import api from '../api'

export default function Groups() {
  const [groups, setGroups] = useState(null)

  useEffect(() => {
    api.get('/groups').then((res) => setGroups(res.data))
  }, [])

  if (!groups) {
    return <p className="text-center text-slate-400 py-12">جارٍ التحميل...</p>
  }

  return (
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
  )
}
