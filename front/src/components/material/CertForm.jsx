import { useState } from 'react'
import { S } from '../../strings'

// Material: 証明書発行フォーム
function Field({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900
                   text-slate-700 dark:text-slate-200 text-sm rounded-lg px-3 py-2
                   outline-none focus:border-blue-500 dark:focus:border-blue-400
                   placeholder-slate-400 dark:placeholder-slate-600 w-full transition-colors"
      />
    </div>
  )
}

export function CertForm({ onSubmit, loading, error }) {
  const [subject,    setSubject]    = useState('')
  const [sans,       setSans]       = useState('')
  const [duration,   setDuration]   = useState('24h')
  const [localError, setLocalError] = useState(null)

  const handleSubmit = () => {
    if (!subject || !sans) {
      setLocalError(S.cert.err.required)
      return
    }
    setLocalError(null)
    onSubmit({ subject, sans, duration })
  }

  const msg = localError || error

  return (
    <div>
      <Field label={S.cert.subject}  value={subject}  onChange={setSubject}  placeholder={S.cert.ph.subject} />
      <Field label={S.cert.san}      value={sans}     onChange={setSans}     placeholder={S.cert.ph.san} />
      <Field label={S.cert.duration} value={duration}  onChange={setDuration} placeholder={S.cert.ph.duration} />
      {msg && <p className="text-rose-500 dark:text-rose-400 text-xs mb-3">{msg}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 rounded-lg bg-blue-500 dark:bg-blue-600 text-white font-medium text-sm
                   tracking-wide hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors
                   active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? S.btn.certIssuing : S.btn.certSubmit}
      </button>
    </div>
  )
}
