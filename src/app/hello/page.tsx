export default function HelloPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">
          你好！
        </h1>
        <p className="text-2xl text-gray-800">
          智能评价排序系统正在运行
        </p>
        <div className="mt-8 space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-green-600 text-xl font-bold">
              ✅ 服务器状态：运行中
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-blue-600 text-xl font-bold">
              🌐 访问地址：http://localhost:3001
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-purple-600 text-xl font-bold">
              📦 项目框架：Next.js 14 + TypeScript + Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
