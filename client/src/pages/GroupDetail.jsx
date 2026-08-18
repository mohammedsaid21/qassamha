import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api'

export default function GroupDetail() {
  const { id } = useParams()
  const [group, setGroup] = useState(null)

  useEffect(() => {
    api.get(`/groups/${id}`).then((res) => setGroup(res.data))
  }, [id])

  if (!group) {
    return <p className="text-center text-slate-400 py-12">جارٍ التحميل...</p>
  }

  return (
    <div>
      <Link to="/" className="text-sm text-slate-500 hover:text-emerald-600">
        → رجوع للمجموعات
      </Link>
      <h2 className="text-2xl font-extrabold mt-3">{group.name}</h2>
      <div className="flex flex-wrap gap-2 mt-3">
        {group.members.map((member) => (
          <span
            key={member.id}
            className="bg-white border border-slate-200 rounded-full px-3 py-1 text-sm"
          >
            {member.user.name}
            {member.userId === group.ownerId && ' 👑'}
          </span>
        ))}
      </div>
    </div>
  )
}
