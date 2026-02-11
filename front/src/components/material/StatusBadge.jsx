import { S } from '../../strings'

// Material: 表示専用 — filled カラーピル
const map = {
  loading: { label: S.badge.loading, cls: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
  ok:      { label: S.badge.ok,      cls: 'bg-emerald-500 text-white dark:bg-emerald-600' },
  error:   { label: S.badge.error,   cls: 'bg-rose-500 text-white dark:bg-rose-600' },
}

export function StatusBadge({ status }) {
  const { label, cls } = map[status] ?? map.loading
  return (
    <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${cls}`}>
      {label}
    </span>
  )
}
