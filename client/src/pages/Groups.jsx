import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import Avatar from '../components/Avatar'

function AvatarStack({ members }) {
  const shown = members.slice(0, 4)
  return (
    <div className="flex -space-x-2 rtl:space-x-reverse">
      {shown.map((m) => (
        <Avatar key={m.id} name={m.user.name} size="sm" />
      ))}
      {members.length > 4 && (
        <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 text-xs font-bold flex items-center justify-center">
          +{members.length - 4}
        </span>
      )}
    </div>
  )
}

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
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card p-4 h-16 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <form onSubmit={createGroup} className="card p-3 flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسم مجموعة جديدة... (رحلة، بيت، سفر)"
          className="input flex-1"
        />
        <button type="submit" disabled={busy} className="btn-primary px-6">
          إنشاء
        </button>
      </form>

      {groups.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="text-4xl mb-3">👋</div>
          <p className="font-bold">ما في مجموعات لسا</p>
          <p className="text-sm text-slate-400 mt-1">
            أنشئ وحدة بالفوق وقيّم تدعوا رفقتك
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => (
            <Link
              key={group.id}
              to={`/groups/${group.id}`}
              className="card p-4 flex items-center gap-4 hover:shadow-md hover:border-emerald-300 transition-all"
            >
              <div className="flex-1">
                <h3 className="font-extrabold text-lg">{group.name}</h3>
                <p className="text-xs text-slate-400">
                  {group.members.length} أعضاء
                </p>
              </div>
              <AvatarStack members={group.members} />
              <span className="text-slate-300 text-xl">←</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
