import { ThemeSwitcher } from './ThemeSwitcher'
import { NavSection as NeuNav } from './neu/NavSection'
import { NavSection as MatNav } from './material/NavSection'
import { useTheme } from '../theme/ThemeContext'
import { S } from '../strings'

// シールドアイコン (認証局 = 信頼・検証の象徴)
const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
)

// 証明書アイコン (ファイル + 十字)
const CertIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="12" y1="18" x2="12" y2="12"/>
    <line x1="9" y1="15" x2="15" y2="15"/>
  </svg>
)

export function SideBar() {
  const { theme } = useTheme()
  const isNeu = theme === 'neu'
  const NavSection = isNeu ? NeuNav : MatNav
  const bg = isNeu
    ? 'bg-slate-200 dark:bg-slate-900 border-r border-slate-300/70 dark:border-slate-700/70'
    : 'bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-sm'
  return (
    <div className={`fixed left-0 top-0 h-full w-24 flex flex-col items-center justify-between py-8 px-3 z-20 ${bg}`}>

      {/* 上部: ナビゲーション */}
      <div className="flex flex-col items-center gap-2 w-full">
        <NavSection to="/ca"   icon={<ShieldIcon />} label={S.sidebar.ca} />
        <NavSection to="/cert" icon={<CertIcon />}   label={S.sidebar.cert} />
      </div>

      {/* 下部: テーマ・ダークモード切替 */}
      <ThemeSwitcher />

    </div>
  )
}
