import { useEffect, useRef } from 'react'
import { S } from '../../strings'

const CollapseIcon = ({ collapsed }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    className={`text-slate-400 transition-transform ${collapsed ? '-rotate-90' : ''}`}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

const AutoLogIcon = ({ active }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    className={active ? 'text-green-400' : 'text-slate-500'}>
    {active
      ? <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>
      : <><circle cx="12" cy="12" r="10"/><line x1="4" y1="4" x2="20" y2="20"/></>
    }
  </svg>
)

// Material: ログパネル — フラット端末表示、タイトル内包、折り畳み対応
export function LogPanel({ lines, autoLog, onToggleAutoLog, collapsed, onToggleCollapse }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!collapsed) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines, collapsed])

  return (
    <div>
      <div className="px-8 pt-4 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleCollapse}
            aria-label="ログパネル折り畳み"
            className="p-1 hover:opacity-70 transition-opacity"
          >
            <CollapseIcon collapsed={collapsed} />
          </button>
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-wide">
            {S.logs.title}
          </h2>
        </div>
        {!collapsed && (
          <button
            onClick={onToggleAutoLog}
            aria-label="自動読み込み切替"
            className="p-1 hover:opacity-70 transition-opacity"
            title={autoLog ? '自動読み込み: ON' : '自動読み込み: OFF'}
          >
            <AutoLogIcon active={autoLog} />
          </button>
        )}
      </div>
      {!collapsed && (
        <div className="bg-slate-900 dark:bg-slate-950 px-4 py-3 h-[28rem] overflow-y-auto font-mono text-xs">
          {lines.length === 0
            ? <p className="text-slate-600 select-none">{S.logs.empty}</p>
            : lines.map((line, i) => (
                <div key={i} className="text-slate-400 leading-relaxed whitespace-pre-wrap break-all">{line}</div>
              ))
          }
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  )
}
