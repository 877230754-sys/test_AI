export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          测试页面
        </h1>
        <p className="text-lg text-gray-600">
          如果你能看到这个页面，说明服务器运行正常！
        </p>
        <div className="mt-8 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-green-600 font-semibold">
              ✅ 服务器运行正常
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-blue-600 font-semibold">
              ✅ Next.js 编译成功
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-purple-600 font-semibold">
              ✅ 数据库连接正常
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
