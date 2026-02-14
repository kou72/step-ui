import { S } from '../../strings'

// Neumorphism: CA証明書パネル (ルート + 中間)

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

function Row({ label, cert, onDownload }) {
  if (!cert) return null
  return (
    <tr className="border-t border-slate-300 dark:border-slate-700">
      <td className="py-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium whitespace-nowrap">{label}</td>
      <td className="py-1.5 text-slate-700 dark:text-slate-200 font-mono text-xs">{cert.subject}</td>
      <td className="py-1.5 text-slate-500 dark:text-slate-400 font-mono text-xs whitespace-nowrap">{cert.serial ? `${cert.serial.slice(0, 8)}...` : ''}</td>
      <td className="py-1.5 text-slate-600 dark:text-slate-300 text-xs whitespace-nowrap">{cert.notAfter}</td>
      <td className="py-1.5 text-center">
        {onDownload && (
          <button onClick={onDownload}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer">
            <DownloadIcon />
          </button>
        )}
      </td>
    </tr>
  )
}

export function CaCertPanel({ caCerts, onDownloadRoot, onDownloadIntermediate }) {
  if (!caCerts || (!caCerts.root && !caCerts.intermediate)) {
    return <p className="text-slate-400 dark:text-slate-500 text-sm py-2 text-center">{S.caCert.empty}</p>
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-slate-500 dark:text-slate-400 text-xs">
            <th className="text-left py-1.5 font-medium"></th>
            <th className="text-left py-1.5 font-medium">{S.caCert.subject}</th>
            <th className="text-left py-1.5 font-medium">{S.caCert.serial}</th>
            <th className="text-left py-1.5 font-medium">{S.caCert.expiry}</th>
            <th className="text-center py-1.5 font-medium">{S.caCert.download}</th>
          </tr>
        </thead>
        <tbody>
          <Row label={S.caCert.root} cert={caCerts.root} onDownload={onDownloadRoot} />
          <Row label={S.caCert.intermediate} cert={caCerts.intermediate} onDownload={onDownloadIntermediate} />
        </tbody>
      </table>
    </div>
  )
}
