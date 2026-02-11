import { useState, useEffect } from 'react'
import { ThemeProvider, useTheme } from './theme/ThemeContext'
import { Card, StatusBadge, ConfigPanel, InitPanel, Button, SideBar } from './components'
import { Modal } from './components/Modal'
import { S } from './strings'

function StatusPage() {
  const { dark } = useTheme()
  const [status,   setStatus]  = useState('loading')
  const [loading,  setLoading] = useState(false)
  const [initError, setInitError] = useState(null)
  const [config,    setConfig]    = useState(null)
  const [initOpen,  setInitOpen]  = useState(false)

  // バックグラウンドポーリング用 — loading 状態を変更しない
  const fetchStatus = async () => {
    try {
      const res  = await fetch('/api/status')
      const json = await res.json()
      setStatus(json.status === 'ok' ? 'ok' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const stopCA = async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/ca/stop', { method: 'POST' })
      const json = await res.json()
      if (json.status === 'stopped' || json.status === 'not_running') {
        await fetchStatus()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const startCA = async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/ca/start', { method: 'POST' })
      const json = await res.json()
      if (json.status === 'already_running') {
        await fetchStatus()
      } else if (json.status === 'starting') {
        setStatus('loading')
        setTimeout(fetchStatus, 2000)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    } finally {
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
        setInitOpen(false)
        fetchConfig()
        fetchStatus()
      } else {
        setInitError(json.message)
      }
    } catch {
      setInitError(S.init.err.generic)
    } finally {
      setLoading(false)
    }
  }

  const toggleCA = () => {
    if (status === 'ok')    stopCA()
    else if (status === 'error') startCA()
  }

  useEffect(() => {
    fetchStatus()
    fetchConfig()
    const id = setInterval(fetchStatus, 2000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={`${dark ? 'dark' : ''} bg-slate-200 dark:bg-slate-900 min-h-screen flex justify-center items-start pt-16 pl-24 pr-4 pb-8`}>
      <SideBar />
      <Card>
        {/* タイトル行: CA + ステータスバッジ(トグルボタン) + 初期化ボタン */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-slate-700 dark:text-slate-200 tracking-wide">
              {S.page.ca}
            </h1>
            <StatusBadge
              status={status}
              onClick={toggleCA}
              disabled={status === 'loading' || loading}
            />
          </div>
          <Button small onClick={() => { setInitError(null); setInitOpen(true) }}>
            {S.btn.initOpen}
          </Button>
        </div>

        <ConfigPanel config={config} />
      </Card>

      <Modal open={initOpen} onClose={() => setInitOpen(false)} title={S.page.init}>
        <InitPanel onSubmit={initCA} loading={loading} error={initError} />
      </Modal>
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
