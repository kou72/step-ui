import { S } from '../../strings'

// Material: 表示専用 — filled カラーピル
const map = {
  loading: { label: S.badge.loading, cls: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
  ok:      { label: S.badge.ok,      cls: 'bg-emerald-500 text-white dark:bg-emerald-600' },
  error:   { label: S.badge.error,   cls: 'bg-rose-500 text-white dark:bg-rose-600' },
}

export function StatusBadge({ status, onClick, disabled }) {
  const { label, cls } = map[status] ?? map.loading
  const base = `px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${cls}`
  if (onClick) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${base} transition-opacity hover:opacity-75 disabled:cursor-default disabled:opacity-100`}
      >
        {label}
      </button>
    )
  }
  return <span className={base}>{label}</span>
}
