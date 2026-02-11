// Neumorphism: 表示コンテナ — CLAUDE.md ルール: 影なし、bg-gray-100 (ページ bg-gray-200 より明るく浮かせる)
export function Card({ children }) {
  return (
    <div className="bg-gray-100 w-full max-w-md rounded-3xl p-8">
      {children}
    </div>
  )
}
