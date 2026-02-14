import { NavLink } from 'react-router-dom'

// Material: アクティブ時に青色ハイライト
export function NavSection({ to, icon, label }) {
  return (
    <NavLink to={to} className={({ isActive }) =>
      `flex flex-col items-center gap-2 cursor-pointer transition-colors rounded-xl px-3 py-2 w-full ${
        isActive
          ? 'text-blue-500 dark:text-blue-400'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
      }`
    }>
      {icon}
      <span className="text-[10px] font-semibold tracking-widest uppercase">
        {label}
      </span>
    </NavLink>
  )
}
