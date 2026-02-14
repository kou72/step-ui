// Neumorphism: アクション要素 — CLAUDE.md ルール: 影あり (CSS 変数でライト/ダーク自動切替)
const SHADOW_OUT = '3px 3px 6px var(--neu-shadow-dark), -3px -3px 6px var(--neu-shadow-light)'

export function Button({ onClick, disabled, children, small }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium
                 cursor-pointer tracking-wide transition-all duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
                 ${small ? 'px-3 py-1.5 rounded-xl text-xs' : 'w-full py-3 rounded-2xl text-sm'}`}
      style={{ boxShadow: SHADOW_OUT }}
    >
      {children}
    </button>
  )
}
