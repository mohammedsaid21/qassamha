const COLORS = [
  'bg-emerald-500',
  'bg-sky-500',
  'bg-amber-500',
  'bg-violet-500',
  'bg-rose-500',
  'bg-teal-500',
]

const SIZES = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-lg',
}

export default function Avatar({ name, size = 'md' }) {
  const sum = [...name].reduce((a, c) => a + c.charCodeAt(0), 0)
  const color = COLORS[sum % COLORS.length]

  return (
    <span
      className={`${SIZES[size]} ${color} text-white font-bold rounded-full flex items-center justify-center shrink-0`}
    >
      {name[0]}
    </span>
  )
}
