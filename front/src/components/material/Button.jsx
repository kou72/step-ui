// Material: アクション要素 — filled blue ボタン
export function Button({ onClick, disabled, children, small }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-blue-500 dark:bg-blue-600 text-white font-medium
                 cursor-pointer tracking-wide hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors
                 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
                 ${small ? 'px-3 py-1.5 rounded-lg text-xs' : 'w-full py-3 rounded-lg text-sm'}`}
    >
      {children}
    </button>
  )
}
