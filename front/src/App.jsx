import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
)
import { ThemeProvider, useTheme } from './theme/ThemeContext'
import { Card, StatusBadge, ConfigPanel, InitPanel, Button, SideBar, LogPanel, CertForm, CertTable, RootCertPanel } from './components'
import { Modal } from './components/Modal'
import { S } from './strings'

function StatusPage() {
  const { dark } = useTheme()
  const [status,   setStatus]  = useState('loading')
  const [loading,  setLoading] = useState(false)
  const [initError, setInitError] = useState(null)
  const [config,    setConfig]    = useState(null)
  const [initOpen,  setInitOpen]  = useState(false)
  const [logs,      setLogs]      = useState([])
  const [autoLog,   setAutoLog]   = useState(true)
  const [logOpen,   setLogOpen]   = useState(true)

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
        pollStatus()
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

  const fetchLogs = async () => {
    try {
      const res  = await fetch('/api/ca/logs')
      const json = await res.json()
      setLogs(json.lines ?? [])
    } catch {}
  }

  // アクション後に最大 n 回ポーリング (2秒間隔)
  const pollStatus = (n = 3) => {
    if (n <= 0) return
    setTimeout(async () => { await fetchStatus(); pollStatus(n - 1) }, 2000)
  }

  const toggleCA = () => {
    if (status === 'ok')    stopCA()
    else if (status === 'error') startCA()
  }

  useEffect(() => {
    fetchStatus()
    fetchConfig()
    fetchLogs()
  }, [])

  // ログ自動ポーリング: autoLog が ON かつ CA 起動中のみ
  useEffect(() => {
    if (!autoLog || status !== 'ok') return
    const id = setInterval(fetchLogs, 2000)
    return () => clearInterval(id)
  }, [autoLog, status])

  return (
    <div className={`${dark ? 'dark' : ''} bg-slate-200 dark:bg-slate-900 min-h-screen flex justify-center items-start pt-16 pl-24 pr-4 pb-8`}>
      <SideBar />
      <div className="flex flex-col gap-4">
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
              <button
                onClick={fetchStatus}
                aria-label="ステータスを更新"
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <RefreshIcon />
              </button>
            </div>
            <Button small onClick={() => { setInitError(null); setInitOpen(true) }}>
              {S.btn.initOpen}
            </Button>
          </div>

          <ConfigPanel config={config} />
        </Card>

        <Card flush>
          <LogPanel lines={logs} autoLog={autoLog} onToggleAutoLog={() => setAutoLog(v => !v)} collapsed={!logOpen} onToggleCollapse={() => setLogOpen(v => !v)} />
        </Card>
      </div>

      <Modal open={initOpen} onClose={() => setInitOpen(false)} title={S.page.init}>
        <InitPanel
          onSubmit={initCA}
          loading={loading}
          error={initError}
          defaults={config && !config.error ? {
            name:        (config.caName ?? '').replace(/ Root CA$/, ''),
            dns:         config.dnsNames ?? '',
            address:     config.address  ?? ':443',
            provisioner: config.provisioners?.split(', ')[0]?.replace(/ \([^)]+\)$/, '') ?? '',
          } : undefined}
        />
      </Modal>
    </div>
  )
}

function CertPage() {
  const { dark } = useTheme()
  const [certs,      setCerts]      = useState([])
  const [rootCert,   setRootCert]   = useState(null)
  const [loading,    setLoading]    = useState(false)
  const [issueOpen,  setIssueOpen]  = useState(false)
  const [issueError, setIssueError] = useState(null)

  const fetchCerts = async () => {
    try {
      const res  = await fetch('/api/cert/list')
      const json = await res.json()
      setCerts(json.certs ?? [])
    } catch {}
  }

  const fetchRootCert = async () => {
    try {
      const res  = await fetch('/api/cert/root')
      const json = await res.json()
      if (json.status !== 'error') setRootCert(json)
    } catch {}
  }

  const issueCert = async (fields) => {
    setLoading(true)
    setIssueError(null)
    try {
      const res  = await fetch('/api/cert/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      const json = await res.json()
      if (json.status === 'ok') {
        setIssueOpen(false)
        fetchCerts()
      } else {
        setIssueError(json.message)
      }
    } catch {
      setIssueError(S.cert.err.generic)
    } finally {
      setLoading(false)
    }
  }

  const deleteCert = async (id, subject) => {
    if (!confirm(S.cert.deleteConfirm)) return
    try {
      const res  = await fetch(`/api/cert/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.status === 'ok') fetchCerts()
    } catch {}
  }

  const triggerDownload = (url) => {
    const a = document.createElement('a')
    a.href = url
    a.download = ''
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const handleDownload = (id, type) => {
    triggerDownload(`/api/cert/download/${id}/${type}`)
  }

  const downloadRootCert = () => {
    triggerDownload('/api/cert/root/download')
  }

  useEffect(() => { fetchCerts(); fetchRootCert() }, [])

  return (
    <div className={`${dark ? 'dark' : ''} bg-slate-200 dark:bg-slate-900 min-h-screen flex justify-center items-start pt-16 pl-24 pr-4 pb-8`}>
      <SideBar />
      <div className="flex flex-col gap-4">
        <Card>
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 tracking-wide mb-3">
            {S.rootCert.title}
          </h2>
          <RootCertPanel rootCert={rootCert} onDownload={downloadRootCert} />
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-semibold text-slate-700 dark:text-slate-200 tracking-wide">
              {S.page.cert}
            </h1>
            <Button small onClick={() => { setIssueError(null); setIssueOpen(true) }}>
              {S.btn.certIssue}
            </Button>
          </div>
          <CertTable certs={certs} onDownload={handleDownload} onDelete={deleteCert} />
        </Card>
      </div>

      <Modal open={issueOpen} onClose={() => setIssueOpen(false)} title={S.page.certIssue}>
        <CertForm onSubmit={issueCert} loading={loading} error={issueError} />
      </Modal>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/ca" element={<StatusPage />} />
        <Route path="/cert" element={<CertPage />} />
        <Route path="*" element={<Navigate to="/ca" replace />} />
      </Routes>
    </ThemeProvider>
  )
}
