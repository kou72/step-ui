// Neumorphism: 表示専用 — CLAUDE.md ルール: 影なし
const map = {
  loading: { label: '取得中…', cls: 'bg-slate-300 text-slate-600 dark:bg-slate-600 dark:text-slate-300' },
  ok:      { label: 'OK',      cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' },
  error:   { label: 'ERROR',   cls: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300' },
}

export function StatusBadge({ status }) {
  const { label, cls } = map[status] ?? map.loading
  return (
    <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${cls}`}>
      {label}
    </span>
  )
}
