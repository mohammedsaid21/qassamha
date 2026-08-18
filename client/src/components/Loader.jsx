export default function Loader({ label = 'بنجهّز الأرقام...' }) {
  return (
    <div className="flex flex-col items-center gap-4 py-20" role="status">
      <div className="relative w-40 border-t-2 border-dashed border-ink/20">
        <span className="absolute -top-[11px] right-0 text-xl animate-cut" aria-hidden>
          ✂️
        </span>
      </div>
      <p className="text-sm text-inksoft">{label}</p>
    </div>
  )
}
