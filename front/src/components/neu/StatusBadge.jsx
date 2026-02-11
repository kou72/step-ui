import { S } from '../../strings'

// Neumorphism: 表示専用 — CLAUDE.md ルール: 影なし
const map = {
  loading: { label: S.badge.loading, cls: 'bg-slate-300 text-slate-600 dark:bg-slate-600 dark:text-slate-300' },
  ok:      { label: S.badge.ok,      cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' },
  error:   { label: S.badge.error,   cls: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300' },
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
