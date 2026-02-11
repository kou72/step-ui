import { useState } from 'react'
import { S } from '../../strings'

// Material: CA初期化フォーム
function Field({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide">{label}</label>
      <input
        type={type}
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

export function InitPanel({ onSubmit, loading, error }) {
  const [name,        setName]        = useState('')
  const [dns,         setDns]         = useState('')
  const [address,     setAddress]     = useState(':443')
  const [provisioner, setProvisioner] = useState('')
  const [password,    setPassword]    = useState('')
  const [confirm,     setConfirm]     = useState('')
  const [localError,  setLocalError]  = useState(null)

  const handleSubmit = () => {
    if (!name || !dns || !address || !provisioner || !password) {
      setLocalError(S.init.err.required)
      return
    }
    if (password !== confirm) {
      setLocalError(S.init.err.mismatch)
      return
    }
    setLocalError(null)
    onSubmit({ name, dns, address, provisioner, password })
  }

  const msg = localError || error

  return (
    <div>
      <p className="text-amber-600 dark:text-amber-400 text-xs mb-4">
        {S.init.warning}
      </p>
      <Field label={S.init.caName}          value={name}        onChange={setName}        placeholder={S.init.ph.caName} />
      <Field label={S.init.dns}             value={dns}         onChange={setDns}         placeholder={S.init.ph.dns} />
      <Field label={S.init.address}         value={address}     onChange={setAddress}     placeholder={S.init.ph.address} />
      <Field label={S.init.provisioner}     value={provisioner} onChange={setProvisioner} placeholder={S.init.ph.provisioner} />
      <Field label={S.init.password}        type="password" value={password} onChange={setPassword} placeholder={S.init.ph.password} />
      <Field label={S.init.confirmPassword} type="password" value={confirm}  onChange={setConfirm}  placeholder={S.init.ph.password} />
      {msg && <p className="text-rose-500 dark:text-rose-400 text-xs mb-3">{msg}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 rounded-lg bg-blue-500 dark:bg-blue-600 text-white font-medium text-sm
                   tracking-wide hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors
                   active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? S.btn.initing : S.btn.init}
      </button>
    </div>
  )
}
