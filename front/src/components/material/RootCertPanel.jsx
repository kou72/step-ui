import { S } from '../../strings'

// Material: ルート証明書パネル

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

export function RootCertPanel({ rootCert, onDownload }) {
  if (!rootCert) {
    return <p className="text-slate-400 dark:text-slate-500 text-sm py-2 text-center">{S.rootCert.empty}</p>
  }
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-6 text-sm">
        <div>
          <span className="text-slate-500 dark:text-slate-400 text-xs mr-2">{S.rootCert.subject}</span>
          <span className="text-slate-700 dark:text-slate-200 font-mono">{rootCert.subject}</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 text-xs mr-2">{S.rootCert.expiry}</span>
          <span className="text-slate-700 dark:text-slate-200">{rootCert.notAfter}</span>
        </div>
      </div>
      <button
        onClick={onDownload}
        className="flex items-center gap-1.5 bg-blue-500 dark:bg-blue-600 px-3 py-1.5 rounded-lg
                   text-white text-xs font-medium
                   hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors
                   active:scale-[0.97] shrink-0 cursor-pointer"
      >
        <DownloadIcon />
        {S.rootCert.download}
      </button>
    </div>
  )
}
