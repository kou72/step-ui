import { S } from '../../strings'

// Neumorphism: 表示専用 — CLAUDE.md ルール: 影なし、border-b で行区切り
function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center py-3">
      <span className="text-slate-600 dark:text-slate-400 text-sm">{label}</span>
      <span className="text-slate-800 dark:text-slate-200 font-mono text-sm">{value ?? '—'}</span>
    </div>
  )
}

export function InfoPanel({ data, timestamp }) {
  return (
    <div className="mb-6">
      <div className="border-b border-slate-300 dark:border-slate-700">
        <Row label={S.info.caUrl}      value={data?.ca_url} />
      </div>
      <div className="border-b border-slate-300 dark:border-slate-700">
        <Row label={S.info.httpStatus} value={data?.http_status} />
      </div>
      <Row label={S.info.fetchedAt}  value={timestamp} />
    </div>
  )
}
