import { useState, useEffect } from 'react'
import { ThemeProvider } from './theme/ThemeContext'
import { Card, StatusBadge, InfoPanel, Button, ThemeSwitcher } from './components'

function StatusPage() {
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
    <div className="bg-gray-200 min-h-screen flex justify-center items-start pt-16 pl-24 pr-4">
      <ThemeSwitcher />
      <Card>
        <h1 className="text-lg font-semibold text-gray-700 tracking-wide mb-4">
          step-ca ステータス
        </h1>
        <div className="flex justify-between items-center px-1 py-3 mb-1 border-b border-gray-300">
          <span className="text-gray-600 text-sm">ステータス</span>
          <StatusBadge status={status} />
        </div>
        <InfoPanel data={data} timestamp={timestamp} />
        <Button onClick={fetchStatus} disabled={loading}>
          {loading ? '取得中…' : '更新'}
        </Button>
      </Card>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <StatusPage />
    </ThemeProvider>
  )
}
