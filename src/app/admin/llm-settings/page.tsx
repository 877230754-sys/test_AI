'use client'

import { useState, useEffect } from 'react'

export default function LLMSettingsPage() {
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    apiKey: '',
    modelName: 'qwen-vl-plus',
    temperature: 0.7,
    maxTokens: 2000,
    apiEndpoint: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation'
  })

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/llm-config')
      const data = await response.json()
      if (data.success && data.active) {
        setConfig(data.active)
      }
    } catch (error) {
      console.error('加载配置失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/llm-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      
      if (data.success) {
        alert('配置保存成功！')
        loadConfig()
      } else {
        alert('保存失败：' + data.error)
      }
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败，请稍后重试')
    }
  }

  const handleTest = async () => {
    if (!formData.apiKey) {
      alert('请先输入 API Key')
      return
    }

    try {
      const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${formData.apiKey}`
        },
        body: JSON.stringify({
          model: formData.modelName,
          input: {
            messages: [{ role: 'user', content: 'Hello' }]
          },
          parameters: {
            max_tokens: 10
          }
        })
      })

      if (response.ok) {
        alert('✅ 连接测试成功！')
      } else {
        const error = await response.text()
        alert('❌ 连接失败：' + error)
      }
    } catch (error: any) {
      alert('❌ 连接失败：' + error.message)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          🔧 LLM 设置
        </h1>
        <p style={{ color: '#6b7280' }}>配置 Qwen3 API 连接参数</p>
      </div>

      <div style={{ maxWidth: '800px' }}>
        {/* 当前配置 */}
        {config && (
          <div style={{
            background: '#d1fae5',
            border: '1px solid #6ee7b7',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#065f46', marginBottom: '12px' }}>
              ✅ 当前活跃配置
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
              <div>
                <p style={{ color: '#6b7280', marginBottom: '4px' }}>API Key</p>
                <p style={{ fontWeight: '500' }}>{config.apiKey}</p>
              </div>
              <div>
                <p style={{ color: '#6b7280', marginBottom: '4px' }}>模型</p>
                <p style={{ fontWeight: '500' }}>{config.modelName}</p>
              </div>
              <div>
                <p style={{ color: '#6b7280', marginBottom: '4px' }}>Temperature</p>
                <p style={{ fontWeight: '500' }}>{config.temperature}</p>
              </div>
              <div>
                <p style={{ color: '#6b7280', marginBottom: '4px' }}>Max Tokens</p>
                <p style={{ fontWeight: '500' }}>{config.maxTokens}</p>
              </div>
            </div>
          </div>
        )}

        {/* 配置表单 */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '24px',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
            {config ? '更新配置' : '新建配置'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                API Key *
              </label>
              <input
                type="password"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="请输入 Qwen API Key"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                在阿里云百炼平台获取：https://dashscope.console.aliyun.com/
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                模型名称 *
              </label>
              <select
                value={formData.modelName}
                onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              >
                <option value="qwen-vl-plus">qwen-vl-plus (多模态)</option>
                <option value="qwen-vl-max">qwen-vl-max (多模态增强)</option>
                <option value="qwen-turbo">qwen-turbo (文本)</option>
                <option value="qwen-plus">qwen-plus (文本增强)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                  Temperature
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                />
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  创造性参数 (0-2)，默认 0.7
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                  Max Tokens
                </label>
                <input
                  type="number"
                  value={formData.maxTokens}
                  onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                />
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  最大输出长度，默认 2000
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                API 端点
              </label>
              <input
                type="url"
                value={formData.apiEndpoint}
                onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={handleTest}
                style={{
                  padding: '10px 20px',
                  background: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                🧪 测试连接
              </button>
              
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  background: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  flex: 1,
                }}
              >
                💾 保存配置
              </button>
            </div>
          </form>
        </div>

        {/* 使用说明 */}
        <div style={{
          background: '#fef3c7',
          border: '1px solid #fde68a',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '24px',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#92400e', marginBottom: '12px' }}>
            💡 使用说明
          </h3>
          <ol style={{ fontSize: '14px', color: '#78350f', paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>在阿里云百炼平台注册账号并创建 API Key</li>
            <li>将 API Key 填入上方表单</li>
            <li>选择适合的模型（推荐使用多模态模型）</li>
            <li>点击"测试连接"验证配置是否正确</li>
            <li>保存后即可在跑批任务中使用 AI 打分功能</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
