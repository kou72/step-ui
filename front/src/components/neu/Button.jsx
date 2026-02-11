// Neumorphism: アクション要素 — CLAUDE.md ルール: 影あり
const SHADOW_OUT = '3px 3px 6px #d1d5db, -3px -3px 6px #ffffff'

export function Button({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-gray-100 w-full py-3 rounded-2xl text-gray-700 font-medium text-sm
                 tracking-wide transition-all duration-150 active:scale-[0.98] disabled:opacity-60"
      style={{ boxShadow: SHADOW_OUT }}
    >
      {children}
    </button>
  )
}
