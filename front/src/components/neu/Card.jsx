// Neumorphism: 表示コンテナ — CLAUDE.md ルール: 影なし、bg-slate-100 (ページ bg-slate-200 より明るく浮かせる)
export function Card({ children }) {
  return (
    <div className="bg-slate-100 dark:bg-slate-800 w-full max-w-md rounded-3xl p-8">
      {children}
    </div>
  )
}
