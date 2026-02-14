import { S } from '../../strings'

// Material: 証明書一覧テーブル — divide-y で行区切り

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

const KeyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/>
    <path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)

export function CertTable({ certs, onDownload, onDelete }) {
  if (!certs || certs.length === 0) {
    return <p className="text-slate-400 dark:text-slate-500 text-sm py-4 text-center">{S.cert.empty}</p>
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-slate-500 dark:text-slate-400 text-xs border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-2 font-medium">{S.cert.table.subject}</th>
            <th className="text-left py-2 font-medium">{S.cert.table.san}</th>
            <th className="text-left py-2 font-medium">{S.cert.table.expiry}</th>
            <th className="text-center py-2 font-medium">{S.cert.table.download}</th>
            <th className="py-2 font-medium">{S.cert.table.action}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {certs.map(c => (
            <tr key={c.id}>
              <td className="py-2 text-slate-700 dark:text-slate-200 font-mono">{c.subject}</td>
              <td className="py-2 text-slate-600 dark:text-slate-300 font-mono text-xs break-all">{c.sans}</td>
              <td className="py-2 text-slate-600 dark:text-slate-300 whitespace-nowrap">{c.notAfter}</td>
              <td className="py-2 text-center">
                <div className="flex justify-center gap-2">
                  <button onClick={() => onDownload(c.id, 'crt')} title="証明書"
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer">
                    <DownloadIcon />
                  </button>
                  <button onClick={() => onDownload(c.id, 'key')} title="秘密鍵"
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer">
                    <KeyIcon />
                  </button>
                </div>
              </td>
              <td className="py-2 text-center">
                <button onClick={() => onDelete(c.id, c.subject)} title="削除"
                  className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer">
                  <TrashIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
