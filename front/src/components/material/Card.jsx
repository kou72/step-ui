// Material: 表示コンテナ — bg-white + shadow-md
export function Card({ children }) {
  return (
    <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-md dark:shadow-slate-900 p-8">
      {children}
    </div>
  )
}
