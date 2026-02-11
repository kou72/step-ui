// Material: アクション要素 — filled blue ボタン
export function Button({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3 rounded-lg bg-blue-500 text-white font-medium text-sm
                 tracking-wide hover:bg-blue-600 transition-colors
                 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}
