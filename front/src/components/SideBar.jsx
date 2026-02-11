import { ThemeSwitcher } from './ThemeSwitcher'
import { S } from '../strings'

// シールドアイコン (認証局 = 信頼・検証の象徴)
const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
)

// CA セクション — アプリのアイデンティティを示す上部エリア
function CASection() {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-slate-500 dark:text-slate-400">
        <ShieldIcon />
      </span>
      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-500 tracking-widest uppercase">
        {S.sidebar.ca}
      </span>
    </div>
  )
}

export function SideBar() {
  return (
    <div className="fixed left-0 top-0 h-full w-24 bg-slate-200 dark:bg-slate-900 border-r border-slate-300/70 dark:border-slate-700/70 flex flex-col items-center justify-between py-8 px-3 z-20">

      {/* 上部: CA セクション */}
      <CASection />

      {/* 下部: テーマ・ダークモード切替 */}
      <ThemeSwitcher />

    </div>
  )
}
