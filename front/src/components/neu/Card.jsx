// Neumorphism: 表示コンテナ — CLAUDE.md ルール: 影なし、bg-slate-100 (ページ bg-slate-200 より明るく浮かせる)
export function Card({ children, flush }) {
  return (
    <div className={`bg-slate-100 dark:bg-slate-800 w-[56rem] rounded-3xl overflow-hidden ${flush ? '' : 'p-8'}`}>
      {children}
    </div>
  )
}
