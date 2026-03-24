'use client'

import { useState } from 'react'

export default function Home() {
  const [apiTestResult, setApiTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testAPI = async (endpoint: string, method: string = 'GET') => {
    setLoading(true)
    try {
      const response = await fetch(`/api${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      setApiTestResult({ endpoint, method, data, status: response.status })
    } catch (error: any) {
      setApiTestResult({ endpoint, method, error: error.message, status: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px', color: '#333' }}>
        ✅ 智能评价排序系统
      </h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
        项目已成功启动！
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={{ padding: '20px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '10px', color: '#0369a1' }}>📋 项目状态</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}>✅ Next.js 14 项目框架</li>
            <li style={{ marginBottom: '8px' }}>✅ TypeScript 配置</li>
            <li style={{ marginBottom: '8px' }}>✅ Tailwind CSS 样式</li>
            <li style={{ marginBottom: '8px' }}>✅ Prisma + SQLite 数据库</li>
            <li style={{ marginBottom: '8px' }}>✅ shadcn/ui 组件库</li>
          </ul>
        </div>
        
        <div style={{ padding: '20px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '10px', color: '#15803d' }}>🎯 已完成功能</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}>✅ 数据库设计（11 张表）</li>
            <li style={{ marginBottom: '8px' }}>✅ Mock 数据填充</li>
            <li style={{ marginBottom: '8px' }}>✅ 评价标准管理 API</li>
            <li style={{ marginBottom: '8px' }}>✅ 测试集管理 API</li>
            <li style={{ marginBottom: '8px' }}>✅ Prompt 调试 API</li>
            <li style={{ marginBottom: '8px' }}>✅ 跑批验收 API</li>
            <li style={{ marginBottom: '8px' }}>✅ 刷数管理 API</li>
            <li style={{ marginBottom: '8px' }}>✅ LLM 配置 API</li>
            <li style={{ marginBottom: '8px' }}>✅ Qwen3 AI 集成</li>
            <li style={{ marginBottom: '8px' }}>✅ 定时任务服务</li>
          </ul>
        </div>
        
        <div style={{ padding: '20px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '10px', color: '#b45309' }}>🚀 下一步计划</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}>⏳ 开发前端管理页面</li>
            <li style={{ marginBottom: '8px' }}>⏳ 实现评价标准上传功能</li>
            <li style={{ marginBottom: '8px' }}>⏳ 实现测试集上传功能</li>
            <li style={{ marginBottom: '8px' }}>⏳ 实现批量打分功能</li>
            <li style={{ marginBottom: '8px' }}>⏳ 实现人工验收功能</li>
          </ul>
        </div>
      </div>
      
      <div style={{ marginTop: '40px', padding: '20px', background: '#f3f4f6', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#374151' }}>🧪 API 接口测试</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => testAPI('/standards')}
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: loading ? '#ccc' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            测试评价标准 API
          </button>
          <button 
            onClick={() => testAPI('/datasets')}
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: loading ? '#ccc' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            测试测试集 API
          </button>
          <button 
            onClick={() => testAPI('/prompts')}
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: loading ? '#ccc' : '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            测试 Prompt API
          </button>
          <button 
            onClick={() => testAPI('/batch-tasks')}
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: loading ? '#ccc' : '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            测试跑批 API
          </button>
          <button 
            onClick={() => testAPI('/brush-tasks')}
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: loading ? '#ccc' : '#ec4899',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            测试刷数 API
          </button>
          <button 
            onClick={() => testAPI('/llm-config')}
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: loading ? '#ccc' : '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            测试 LLM 配置 API
          </button>
        </div>

        {apiTestResult && (
          <div style={{ background: '#1f2937', color: '#f3f4f6', padding: '15px', borderRadius: '4px' }}>
            <div style={{ marginBottom: '10px', fontSize: '14px', color: '#9ca3af' }}>
              测试结果：{apiTestResult.method} {apiTestResult.endpoint} - 状态：{apiTestResult.status}
            </div>
            <pre style={{ fontSize: '12px', overflow: 'auto', margin: 0 }}>
              {JSON.stringify(apiTestResult.data || { error: apiTestResult.error }, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '40px', padding: '20px', background: '#f3f4f6', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#374151' }}>📁 项目结构</h3>
        <pre style={{ background: '#1f2937', color: '#f3f4f6', padding: '15px', borderRadius: '4px', overflow: 'auto', fontSize: '14px' }}>
{`review-sorting-system/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── standards/       # 评价标准管理 API
│   │   │   ├── datasets/        # 测试集管理 API
│   │   │   ├── prompts/         # Prompt 调试 API
│   │   │   ├── batch-tasks/     # 跑批验收 API
│   │   │   ├── brush-tasks/     # 刷数管理 API
│   │   │   └── llm-config/      # LLM 配置 API
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/ui/
│   └── lib/
│       ├── prisma.ts
│       ├── qwen.ts              # Qwen3 API 集成
│       └── cron.ts              # 定时任务
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── dev.db
└── package.json`}
        </pre>
      </div>
      
      <div style={{ marginTop: '30px', textAlign: 'center', color: '#9ca3af' }}>
        <p>访问地址：http://localhost:3001</p>
        <p>© 2024 智能评价排序系统</p>
      </div>
    </div>
  )
}
