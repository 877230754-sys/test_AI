'use client'

import { useState, useEffect } from 'react'

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<any[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    templateName: '',
    version: 'V1.0',
    promptContent: '',
  })

  useEffect(() => {
    loadPrompts()
  }, [])

  const loadPrompts = async () => {
    const response = await fetch('/api/prompts')
    const data = await response.json()
    if (data.success) {
      setPrompts(data.list)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const response = await fetch('/api/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    const data = await response.json()
    
    if (data.success) {
      alert('创建成功！')
      setShowCreateModal(false)
      loadPrompts()
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
            ⚙️ Prompt 调试
          </h1>
          <p style={{ color: '#6b7280' }}>配置和优化 Prompt 模板</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '12px 24px',
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          ➕ 创建模板
        </button>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {prompts.map((prompt) => (
          <div key={prompt.id} style={{
            background: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{prompt.templateName}</h3>
              <span style={{
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                background: prompt.status === 'effective' ? '#d1fae5' : '#fef3c7',
                color: prompt.status === 'effective' ? '#065f46' : '#92400e',
              }}>
                {prompt.status === 'effective' ? '✅ 已生效' : '⏳ 草稿'}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
              版本：{prompt.version} | 创建时间：{new Date(prompt.createdAt).toLocaleString('zh-CN')}
            </p>
            <pre style={{
              background: '#f9fafb',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '13px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {prompt.promptContent}
            </pre>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '700px',
            maxHeight: '80vh',
            overflow: 'auto',
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>创建 Prompt 模板</h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  模板名称
                </label>
                <input
                  type="text"
                  value={formData.templateName}
                  onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
                  placeholder="例如：美妆评分 Prompt V3.1"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  版本
                </label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="V1.0"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Prompt 内容
                </label>
                <textarea
                  value={formData.promptContent}
                  onChange={(e) => setFormData({ ...formData, promptContent: e.target.value })}
                  placeholder="请输入 Prompt 模板内容，使用 {{variable}} 作为变量占位符"
                  rows={15}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '10px 20px',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    background: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
