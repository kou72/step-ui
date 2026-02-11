// Material: 表示専用 — filled カラーピル
const map = {
  loading: { label: '取得中…', cls: 'bg-gray-200 text-gray-600' },
  ok:      { label: 'OK',      cls: 'bg-emerald-500 text-white' },
  error:   { label: 'ERROR',   cls: 'bg-rose-500 text-white' },
}

export function StatusBadge({ status }) {
  const { label, cls } = map[status] ?? map.loading
  return (
    <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${cls}`}>
      {label}
    </span>
  )
}
