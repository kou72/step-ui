import { useState } from 'react'
import { S } from '../../strings'

// Neumorphism: CA初期化フォーム
const SHADOW_OUT = '3px 3px 6px var(--neu-shadow-dark), -3px -3px 6px var(--neu-shadow-light)'
const SHADOW_IN  = 'inset 2px 2px 5px var(--neu-shadow-dark), inset -2px -2px 5px var(--neu-shadow-light)'

function Field({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide">{label}</label>
      <input
        type={type}
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

export function InitPanel({ onSubmit, loading, error, defaults }) {
  const [name,        setName]        = useState(defaults?.name        ?? '')
  const [dns,         setDns]         = useState(defaults?.dns         ?? '')
  const [address,     setAddress]     = useState(defaults?.address     ?? ':443')
  const [provisioner, setProvisioner] = useState(defaults?.provisioner ?? '')
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
        className="bg-slate-100 dark:bg-slate-700 w-full py-3 mt-3 rounded-2xl
                   text-slate-700 dark:text-slate-200 font-medium text-sm
                   tracking-wide transition-all duration-150 active:scale-[0.98] disabled:opacity-60"
        style={{ boxShadow: SHADOW_OUT }}
      >
        {loading ? S.btn.initing : S.btn.init}
      </button>
    </div>
  )
}
