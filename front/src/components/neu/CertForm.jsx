import { useState } from 'react'
import { S } from '../../strings'

// Neumorphism: 証明書発行フォーム
const SHADOW_OUT = '3px 3px 6px var(--neu-shadow-dark), -3px -3px 6px var(--neu-shadow-light)'
const SHADOW_IN  = 'inset 2px 2px 5px var(--neu-shadow-dark), inset -2px -2px 5px var(--neu-shadow-light)'

function Field({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-200
                   text-sm rounded-xl px-3 py-2 outline-none placeholder-slate-400
                   dark:placeholder-slate-600 w-full"
        style={{ boxShadow: SHADOW_IN }}
      />
    </div>
  )
}

export function CertForm({ onSubmit, loading, error }) {
  const [subject,    setSubject]    = useState('')
  const [sans,       setSans]       = useState('')
  const [duration,   setDuration]   = useState('1')
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
        className="bg-slate-100 dark:bg-slate-700 w-full py-3 mt-3 rounded-2xl
                   text-slate-700 dark:text-slate-200 font-medium text-sm
                   tracking-wide transition-all duration-150 active:scale-[0.98] disabled:opacity-60"
        style={{ boxShadow: SHADOW_OUT }}
      >
        {loading ? S.btn.certIssuing : S.btn.certSubmit}
      </button>
    </div>
  )
}
