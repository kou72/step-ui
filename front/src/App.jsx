import { useState, useEffect } from 'react'

function StatusBadge({ status }) {
  if (status === 'loading')
    return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-600 uppercase">取得中…</span>
  if (status === 'ok')
    return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 uppercase">OK</span>
  return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 uppercase">ERROR</span>
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-gray-800 font-mono text-sm">{value ?? '—'}</span>
    </div>
  )
}

export default function App() {
  const [data,      setData]      = useState(null)
  const [status,    setStatus]    = useState('loading')
  const [timestamp, setTimestamp] = useState(null)
  const [loading,   setLoading]   = useState(false)

  const fetchStatus = async () => {
    setLoading(true)
    setStatus('loading')
    try {
      const res  = await fetch('/api/status')
      const json = await res.json()
      setData(json)
      setStatus(json.status === 'ok' ? 'ok' : 'error')
    } catch {
      setStatus('error')
      setData(null)
    } finally {
      setTimestamp(new Date().toLocaleString('ja-JP', { hour12: false }))
      setLoading(false)
    }
  }

  useEffect(() => { fetchStatus() }, [])

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-start pt-12 px-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-lg font-semibold text-gray-800 mb-6">step-ca ステータス</h1>

        <div className="divide-y divide-gray-100">
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-500 text-sm">ステータス</span>
            <StatusBadge status={status} />
          </div>
          <Row label="CA URL"          value={data?.ca_url} />
          <Row label="HTTP ステータス" value={data?.http_status} />
          <Row label="取得時刻"         value={timestamp} />
        </div>

        <button
          onClick={fetchStatus}
          disabled={loading}
          className="mt-6 w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium
                     hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '取得中…' : '更新'}
        </button>
      </div>
    </div>
  )
}
