import { S } from '../../strings'

// Neumorphism: CA設定表示 — 影なし、border-b で行区切り
function Row({ label, value }) {
  return (
    <div className="border-b border-slate-300 dark:border-slate-700 last:border-0">
      <div className="flex justify-between items-start gap-4 py-3">
        <span className="text-slate-600 dark:text-slate-400 text-sm shrink-0">{label}</span>
        <span className="text-slate-800 dark:text-slate-200 font-mono text-sm text-right break-all">{value ?? '—'}</span>
      </div>
    </div>
  )
}

export function ConfigPanel({ config }) {
  if (!config) return <p className="text-slate-400 dark:text-slate-500 text-sm py-4 text-center">{S.config.loading}</p>
  if (config.error) return <p className="text-rose-500 dark:text-rose-400 text-sm py-4 text-center">{config.error}</p>
  return (
    <div className="grid grid-cols-2 gap-x-8 mb-2">
      <div>
        <Row label={S.config.caName}     value={config.caName} />
        <Row label={S.config.address}    value={config.address} />
        <Row label={S.config.rootExpiry} value={config.rootExpiry} />
      </div>
      <div>
        <Row label={S.config.dns}         value={config.dnsNames} />
        <Row label={S.config.provisioner} value={config.provisioners} />
        <Row label={S.config.intExpiry}   value={config.intExpiry} />
      </div>
    </div>
  )
}
