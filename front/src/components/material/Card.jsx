// Material: 表示コンテナ — bg-white + shadow-md
export function Card({ children, flush }) {
  return (
    <div className={`bg-white dark:bg-slate-800 w-[56rem] rounded-2xl shadow-md dark:shadow-slate-900 overflow-hidden ${flush ? '' : 'p-8'}`}>
      {children}
    </div>
  )
}
