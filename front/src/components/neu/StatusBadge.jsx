// Neumorphism: 表示専用 — CLAUDE.md ルール: 影なし
const map = {
  loading: { label: '取得中…', cls: 'bg-gray-300 text-gray-600' },
  ok:      { label: 'OK',      cls: 'bg-emerald-100 text-emerald-700' },
  error:   { label: 'ERROR',   cls: 'bg-rose-100 text-rose-700' },
}

export function StatusBadge({ status }) {
  const { label, cls } = map[status] ?? map.loading
  return (
    <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${cls}`}>
      {label}
    </span>
  )
}
