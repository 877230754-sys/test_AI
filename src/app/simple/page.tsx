export default function SimpleHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            智能评价排序系统
          </h1>
          <p className="text-xl text-gray-600">
            基于 Qwen3 多模态大模型的评价质量排序系统
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              📋 评价标准管理
            </h2>
            <p className="text-gray-600 mb-4">
              上传和管理分品类的评价评分标准
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
              进入管理
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              📁 测试集管理
            </h2>
            <p className="text-gray-600 mb-4">
              上传和管理测试集数据
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
              进入管理
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              ⚙️ Prompt 调试
            </h2>
            <p className="text-gray-600 mb-4">
              配置和优化 Prompt 模板
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
              进入调试
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              🚀 跑批验收
            </h2>
            <p className="text-gray-600 mb-4">
              批量打分任务和人工验收
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
              进入验收
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              🔄 刷数管理
            </h2>
            <p className="text-gray-600 mb-4">
              线上评价批量打分重排
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
              进入管理
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              🔧 LLM 设置
            </h2>
            <p className="text-gray-600 mb-4">
              配置 Qwen3 API 连接参数
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
              进入设置
            </button>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p>© 2024 智能评价排序系统. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
