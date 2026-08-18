import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import Avatar from '../components/Avatar'
import Loader from '../components/Loader'

function AvatarStack({ members }) {
  const shown = members.slice(0, 4)
  return (
    <div className="flex -space-x-2 rtl:space-x-reverse">
      {shown.map((m) => (
        <Avatar key={m.id} name={m.user.name} size="sm" />
      ))}
      {members.length > 4 && (
        <span className="w-7 h-7 rounded-full bg-penwash text-pen text-xs font-bold flex items-center justify-center">
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
    return <Loader label="بنفتح الدفتر..." />
  }

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-xl font-bold">دفاترك</h2>
        <span className="text-xs text-inksoft">
          {groups.length > 0 && `${groups.length} مجموعة`}
        </span>
      </div>

      <form onSubmit={createGroup} className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="دفتر جديد... (رحلة، بيت، قهوة الخميس)"
          className="input flex-1"
        />
        <button type="submit" disabled={busy} className="btn-pen px-6">
          افتح
        </button>
      </form>

      {groups.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-display font-bold text-lg">الدفتر لسا فاضي</p>
          <p className="text-sm text-inksoft mt-1">
            سمّي دفترك الأول بالفوق وقيّم تدعوا رفقتك
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => (
            <Link
              key={group.id}
              to={`/groups/${group.id}`}
              className="card p-4 flex items-center gap-4 hover:border-pen/40 hover:shadow-[0_2px_10px_rgba(47,69,184,0.08)] transition-all"
            >
              <div className="flex-1">
                <h3 className="font-bold text-lg">{group.name}</h3>
                <p className="text-xs text-inksoft mt-0.5">
                  {group.members.length} أعضاء
                </p>
              </div>
              <AvatarStack members={group.members} />
              <span className="text-inksoft/50 text-xl">←</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
