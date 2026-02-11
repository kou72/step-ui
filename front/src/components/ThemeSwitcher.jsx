import { useTheme } from '../theme/ThemeContext'

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

const TRACK_SHADOW = 'inset 1px 1px 3px #c0c0c0, inset -1px -1px 3px #ffffff'
const THUMB_SHADOW = '0 1px 3px rgba(0,0,0,0.18)'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const isNeu = theme === 'neu'

  return (
    <div className="fixed left-0 top-0 h-full w-24 bg-gray-200 border-r border-gray-300/70 flex flex-col items-center justify-end pb-8 z-20">
      <div className="flex flex-row items-center gap-2">

        {/* Neuアイコン (左) */}
        <span
          title="Neumorphism"
          className={`text-gray-500 transition-opacity duration-200 ${isNeu ? 'opacity-100' : 'opacity-25'}`}
        >
          <NeuIcon />
        </span>

        {/* 横型トグルトラック */}
        <button
          onClick={() => setTheme(isNeu ? 'material' : 'neu')}
          aria-label={`テーマ切替: 現在 ${isNeu ? 'Neumorphism' : 'Material'}`}
          className="relative w-10 h-5 rounded-full cursor-pointer"
          style={{ background: '#d1d5db', boxShadow: TRACK_SHADOW }}
        >
          {/* スライドするサム */}
          <div
            className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-gray-100 transition-transform duration-200"
            style={{
              transform: isNeu ? 'translateX(0px)' : 'translateX(20px)',
              boxShadow: THUMB_SHADOW,
            }}
          />
        </button>

        {/* Materialアイコン (右) */}
        <span
          title="Material"
          className={`text-gray-500 transition-opacity duration-200 ${!isNeu ? 'opacity-100' : 'opacity-25'}`}
        >
          <MaterialIcon />
        </span>

      </div>
    </div>
  )
}
