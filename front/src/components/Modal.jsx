import { useTheme } from '../theme/ThemeContext'

// 共通モーダル — テーマ対応、dark モード対応
export function Modal({ open, onClose, title, children }) {
  const { theme } = useTheme()
  const isNeu = theme === 'neu'
  const bg = isNeu
    ? 'bg-slate-200 dark:bg-slate-800'
    : 'bg-white dark:bg-slate-800'
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative ${bg} rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl`}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 tracking-wide">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none transition-colors ml-4"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
