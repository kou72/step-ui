import { useTheme } from '../theme/ThemeContext'
import { S } from '../strings'

// Neu: 同心の丸み四角 (ソフトな立体層)
const NeuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
    <rect x="2" y="2" width="18" height="18" rx="6" fill="currentColor" opacity="0.2"/>
    <rect x="5" y="5" width="12" height="12" rx="4" fill="currentColor" opacity="0.55"/>
    <circle cx="11" cy="11" r="2.5" fill="currentColor"/>
  </svg>
)

// Material: オフセット影のフラットカード (エレベーション)
const MaterialIcon = () => (
  <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
    <rect x="5" y="7" width="14" height="12" rx="2" fill="currentColor" opacity="0.2"/>
    <rect x="3" y="3" width="14" height="12" rx="2" fill="currentColor"/>
  </svg>
)

// 太陽アイコン (ライトモード)
const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4"/>
    <line x1="12" y1="2"  x2="12" y2="5"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
    <line x1="4.22" y1="4.22"   x2="6.34" y2="6.34"/>
    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
    <line x1="2"  y1="12" x2="5"  y2="12"/>
    <line x1="19" y1="12" x2="22" y2="12"/>
    <line x1="4.22"  y1="19.78" x2="6.34"  y2="17.66"/>
    <line x1="17.66" y1="6.34"  x2="19.78" y2="4.22"/>
  </svg>
)

// 月アイコン (ダークモード)
const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const TRACK_SHADOW = 'inset 1px 1px 3px var(--neu-shadow-dark), inset -1px -1px 3px var(--neu-shadow-light)'
const THUMB_SHADOW = '0 1px 3px rgba(0,0,0,0.22)'

// 横型トグルスイッチ — 左に現在の状態を示すアイコン1つ
function ToggleRow({ icon, checked, onChange, ariaLabel }) {
  return (
    <div className="flex flex-row items-center gap-2">
      <span className="text-slate-500 dark:text-slate-400 transition-all duration-200 w-5 flex justify-center">
        {icon}
      </span>
      <button
        onClick={onChange}
        aria-label={ariaLabel}
        className="relative w-10 h-5 rounded-full cursor-pointer bg-slate-300 dark:bg-slate-600"
        style={{ boxShadow: TRACK_SHADOW }}
      >
        <div
          className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-300"
          style={{
            transform: checked ? 'translateX(20px)' : 'translateX(0px)',
            transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: THUMB_SHADOW,
          }}
        />
      </button>
    </div>
  )
}

export function ThemeSwitcher() {
  const { theme, setTheme, dark, toggleDark } = useTheme()
  const isNeu = theme === 'neu'

  return (
    <div className="flex flex-col items-center gap-5">

      {/* ダークモード: 現在の状態アイコン + トグル */}
      <ToggleRow
        icon={dark ? <MoonIcon /> : <SunIcon />}
        checked={dark}
        onChange={toggleDark}
        ariaLabel={S.aria.darkMode(dark)}
      />

      {/* テーマ切替: 現在の状態アイコン + トグル */}
      <ToggleRow
        icon={isNeu ? <NeuIcon /> : <MaterialIcon />}
        checked={!isNeu}
        onChange={() => setTheme(isNeu ? 'material' : 'neu')}
        ariaLabel={S.aria.theme(isNeu)}
      />

    </div>
  )
}
