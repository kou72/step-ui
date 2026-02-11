// Material: 表示コンテナ — bg-white + shadow-md
export function Card({ children }) {
  return (
    <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-8">
      {children}
    </div>
  )
}
