import { useState, useEffect } from 'react'
import { ThemeProvider, useTheme } from './theme/ThemeContext'
import { Card, StatusBadge, InfoPanel, Button, InitPanel, ConfigPanel, SideBar } from './components'
import { S } from './strings'

function StatusPage() {
  const { dark } = useTheme()
  const [data,      setData]      = useState(null)
  const [status,    setStatus]    = useState('loading')
  const [timestamp, setTimestamp] = useState(null)
  const [loading,   setLoading]   = useState(false)
  const [initError, setInitError] = useState(null)
  const [config,    setConfig]    = useState(null)

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

  const stopCA = async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/ca/stop', { method: 'POST' })
      const json = await res.json()
      if (json.status === 'stopped' || json.status === 'not_running') {
        fetchStatus()
      } else {
        setStatus('error')
        setLoading(false)
      }
    } catch {
      setStatus('error')
      setLoading(false)
    }
  }

  const startCA = async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/ca/start', { method: 'POST' })
      const json = await res.json()
      if (json.status === 'already_running') {
        fetchStatus()
      } else if (json.status === 'starting') {
        setStatus('loading')
        setLoading(false)
        setTimeout(fetchStatus, 2000)
      } else {
        setStatus('error')
        setLoading(false)
      }
    } catch {
      setStatus('error')
      setLoading(false)
    }
  }

  const fetchConfig = async () => {
    try {
      const res  = await fetch('/api/ca/config')
      const json = await res.json()
      if (json.status === 'error') setConfig({ error: json.message })
      else                         setConfig(json)
    } catch {
      setConfig({ error: S.config.loadError })
    }
  }

  const initCA = async (fields) => {
    setLoading(true)
    setInitError(null)
    try {
      const res  = await fetch('/api/ca/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      const json = await res.json()
      if (json.status === 'ok') {
        fetchConfig()
        fetchStatus()
      } else {
        setInitError(json.message)
        setLoading(false)
      }
    } catch {
      setInitError(S.init.err.generic)
      setLoading(false)
    }
  }

  useEffect(() => { fetchStatus(); fetchConfig() }, [])

  return (
    <div className={`${dark ? 'dark' : ''} bg-slate-200 dark:bg-slate-900 min-h-screen flex flex-wrap justify-center items-start gap-6 pt-16 pl-24 pr-4 pb-8`}>
      <SideBar />
      <Card>
        <h1 className="text-lg font-semibold text-slate-700 dark:text-slate-200 tracking-wide mb-4">
          {S.page.status}
        </h1>
        <div className="flex justify-between items-center px-1 py-3 mb-1 border-b border-slate-300 dark:border-slate-700">
          <span className="text-slate-600 dark:text-slate-400 text-sm">{S.label.status}</span>
          <StatusBadge status={status} />
        </div>
        <InfoPanel data={data} timestamp={timestamp} />
        <div className="flex flex-col gap-2">
          {status === 'error' && (
            <Button onClick={startCA} disabled={loading}>{S.btn.start}</Button>
          )}
          {status === 'ok' && (
            <Button onClick={stopCA} disabled={loading}>{S.btn.stop}</Button>
          )}
          <Button onClick={fetchStatus} disabled={loading}>
            {loading ? S.btn.refreshing : S.btn.refresh}
          </Button>
        </div>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 tracking-wide mb-4">
          {S.page.config}
        </h2>
        <ConfigPanel config={config} />
      </Card>
      <Card>
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 tracking-wide mb-4">
          {S.page.init}
        </h2>
        <InitPanel onSubmit={initCA} loading={loading} error={initError} />
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
