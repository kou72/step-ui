import { NavLink } from 'react-router-dom'

// Neumorphism: アクティブ時に凹み影
const SHADOW_INSET = 'inset 2px 2px 5px var(--neu-shadow-dark), inset -2px -2px 5px var(--neu-shadow-light)'

export function NavSection({ to, icon, label }) {
  return (
    <NavLink to={to} className={({ isActive }) =>
      `flex flex-col items-center gap-2 cursor-pointer transition-all rounded-xl px-3 py-2 w-full ${
        isActive
          ? 'text-slate-700 dark:text-slate-200'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
      }`
    } style={({ isActive }) => isActive ? { boxShadow: SHADOW_INSET } : undefined}>
      {icon}
      <span className="text-[10px] font-semibold tracking-widest uppercase">
        {label}
      </span>
    </NavLink>
  )
}
