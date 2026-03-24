'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '../../../components/AdminLayout'

interface BrushTask {
  taskId: number
  taskName: string
  categoryName: string
  standardId: number
  promptId: number
  minScore: number
  maxScore: number
  targetCount: number
  actualCount: number
  status: 'pending' | 'running' | 'completed' | 'failed'
  scheduledAt?: string
  lastRunAt?: string
  createdAt: string
}

interface BrushResult {
  resultId: number
  taskId: number
  productId: number
  productName: string
  originalRank: number
  newRank: number
  originalScore: number
  newScore: number
  isPushed: boolean
  pushedAt?: string
  createdAt: string
}

interface Standard {
  standardId: number
  categoryName: string
  version: string
}

interface PromptTemplate {
  promptId: number
  templateName: string
  version: string
}

export default function BrushTasksPage() {
  const [tasks, setTasks] = useState<BrushTask[]>([])
  const [selectedTask, setSelectedTask] = useState<BrushTask | null>(null)
  const [results, setResults] = useState<BrushResult[]>([])
  const [standards, setStandards] = useState<Standard[]>([])
  const [prompts, setPrompts] = useState<PromptTemplate[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    taskName: '',
    categoryName: '',
    standardId: '',
    promptId: '',
    minScore: '60',
    maxScore: '100',
    targetCount: '50',
    scheduledAt: '',
  })

  useEffect(() => {
    loadTasks()
    loadStandards()
    loadPrompts()
  }, [])

  const loadTasks = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/brush-tasks')
      const data = await response.json()
      setTasks(data.tasks || [])
    } catch (error) {
      console.error('加载任务失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStandards = async () => {
    try {
      const response = await fetch('/api/standards')
      const data = await response.json()
      setStandards(data.standards || [])
    } catch (error) {
      console.error('加载标准失败:', error)
    }
  }

  const loadPrompts = async () => {
    try {
      const response = await fetch('/api/prompts')
      const data = await response.json()
      setPrompts(data.prompts || [])
    } catch (error) {
      console.error('加载 Prompt 失败:', error)
    }
  }

  const loadResults = async (taskId: number) => {
    try {
      const response = await fetch(`/api/brush-tasks/${taskId}/results`)
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('加载结果失败:', error)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/brush-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          standardId: parseInt(formData.standardId),
          promptId: parseInt(formData.promptId),
          minScore: parseInt(formData.minScore),
          maxScore: parseInt(formData.maxScore),
          targetCount: parseInt(formData.targetCount),
          scheduledAt: formData.scheduledAt || undefined,
        }),
      })

      if (response.ok) {
        alert('任务创建成功')
        setShowCreateModal(false)
        loadTasks()
        setFormData({
          taskName: '',
          categoryName: '',
          standardId: '',
          promptId: '',
          minScore: '60',
          maxScore: '100',
          targetCount: '50',
          scheduledAt: '',
        })
      } else {
        const error = await response.json()
        alert(`创建失败：${error.error}`)
      }
    } catch (error) {
      console.error('创建任务失败:', error)
      alert('创建失败，请重试')
    }
  }

  const handleViewResults = async (task: BrushTask) => {
    await loadResults(task.taskId)
    setSelectedTask(task)
    setShowResultsModal(true)
  }

  const handlePushResult = async (resultId: number) => {
    try {
      const response = await fetch(`/api/brush-tasks/results/${resultId}/push`, {
        method: 'POST',
      })

      if (response.ok) {
        alert('已推送')
        loadResults(selectedTask!.taskId)
      } else {
        alert('推送失败')
      }
    } catch (error) {
      console.error('推送结果失败:', error)
      alert('推送失败')
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('确定要删除此任务吗？')) {
      return
    }

    try {
      const response = await fetch(`/api/brush-tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('已删除')
        loadTasks()
      } else {
        alert('删除失败')
      }
    } catch (error) {
      console.error('删除任务失败:', error)
      alert('删除失败')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981'
      case 'running':
        return '#3b82f6'
      case 'failed':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  const getProgress = (task: BrushTask) => {
    if (task.targetCount === 0) return 0
    return Math.round((task.actualCount / task.targetCount) * 100)
  }

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>刷数管理</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            + 新建任务
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>加载中...</div>
        ) : (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                  <th style={thStyle}>任务名称</th>
                  <th style={thStyle}>品类</th>
                  <th style={thStyle}>状态</th>
                  <th style={thStyle}>进度</th>
                  <th style={thStyle}>目标/实际</th>
                  <th style={thStyle}>定时</th>
                  <th style={thStyle}>操作</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                      暂无任务，点击右上角创建新任务
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task.taskId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={tdStyle}>{task.taskName}</td>
                      <td style={tdStyle}>{task.categoryName}</td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 500,
                            backgroundColor: getStatusColor(task.status),
                            color: 'white',
                          }}
                        >
                          {task.status === 'pending' ? '待执行' :
                           task.status === 'running' ? '执行中' :
                           task.status === 'completed' ? '已完成' : '失败'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${getProgress(task)}%`,
                                height: '100%',
                                backgroundColor: '#8b5cf6',
                                transition: 'width 0.3s',
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>{getProgress(task)}%</span>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ color: '#8b5cf6', fontWeight: 500 }}>{task.targetCount}</span>
                        <span style={{ color: '#6b7280', margin: '0 4px' }}>/</span>
                        <span style={{ color: '#1f2937', fontWeight: 500 }}>{task.actualCount}</span>
                      </td>
                      <td style={tdStyle}>
                        {task.scheduledAt ? (
                          <span style={{ fontSize: '12px', color: '#059669' }}>
                            每日 {new Date(task.scheduledAt).getHours()}:00
                          </span>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#9ca3af' }}>-</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleViewResults(task)}
                            style={{
                              padding: '6px 12px',
                              fontSize: '13px',
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                          >
                            查看结果
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.taskId)}
                            style={{
                              padding: '6px 12px',
                              fontSize: '13px',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 创建任务弹窗 */}
        {showCreateModal && (
          <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#111827' }}>
                新建刷数任务
              </h2>
              <form onSubmit={handleCreate}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>任务名称</label>
                  <input
                    type="text"
                    required
                    value={formData.taskName}
                    onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                    style={inputStyle}
                    placeholder="例如：连衣裙品类刷数"
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>品类名称</label>
                  <input
                    type="text"
                    required
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                    style={inputStyle}
                    placeholder="例如：连衣裙、运动鞋、手机"
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>评价标准</label>
                  <select
                    required
                    value={formData.standardId}
                    onChange={(e) => setFormData({ ...formData, standardId: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="">请选择标准</option>
                    {standards.map((standard) => (
                      <option key={standard.standardId} value={standard.standardId}>
                        {standard.categoryName} - v{standard.version}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Prompt 模板</label>
                  <select
                    required
                    value={formData.promptId}
                    onChange={(e) => setFormData({ ...formData, promptId: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="">请选择 Prompt 模板</option>
                    {prompts.map((prompt) => (
                      <option key={prompt.promptId} value={prompt.promptId}>
                        {prompt.templateName} - v{prompt.version}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={labelStyle}>最低分数</label>
                    <input
                      type="number"
                      required
                      value={formData.minScore}
                      onChange={(e) => setFormData({ ...formData, minScore: e.target.value })}
                      style={inputStyle}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>最高分数</label>
                    <input
                      type="number"
                      required
                      value={formData.maxScore}
                      onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                      style={inputStyle}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>目标数量</label>
                  <input
                    type="number"
                    required
                    value={formData.targetCount}
                    onChange={(e) => setFormData({ ...formData, targetCount: e.target.value })}
                    style={inputStyle}
                    min="1"
                    max="1000"
                  />
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    需要刷数的商品评价数量
                  </p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>定时执行（可选）</label>
                  <input
                    type="time"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                    style={inputStyle}
                  />
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    设置后每日自动执行，不设置则手动执行
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    创建任务
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 结果查看弹窗 */}
        {showResultsModal && selectedTask && (
          <div style={{ ...modalOverlayStyle, maxWidth: '1200px' }}>
            <div style={{ ...modalContentStyle, maxWidth: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>
                  刷数结果：{selectedTask.taskName}
                </h2>
                <button
                  onClick={() => setShowResultsModal(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  关闭
                </button>
              </div>

              <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                <div style={{ display: 'flex', gap: '24px' }}>
                  <div>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>目标数：</span>
                    <span style={{ fontWeight: 500 }}>{selectedTask.targetCount}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', color: '#8b5cf6' }}>实际数：</span>
                    <span style={{ fontWeight: 500, color: '#8b5cf6' }}>{selectedTask.actualCount}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', color: '#10b981' }}>完成率：</span>
                    <span style={{ fontWeight: 500, color: '#10b981' }}>{getProgress(selectedTask)}%</span>
                  </div>
                </div>
              </div>

              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, backgroundColor: 'white' }}>
                      <th style={thStyle}>商品</th>
                      <th style={thStyle}>原排名</th>
                      <th style={thStyle}>新排名</th>
                      <th style={thStyle}>原分数</th>
                      <th style={thStyle}>新分数</th>
                      <th style={thStyle}>排名变化</th>
                      <th style={thStyle}>推送</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                          暂无结果
                        </td>
                      </tr>
                    ) : (
                      results.map((result) => (
                        <tr key={result.resultId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={tdStyle}>{result.productName}</td>
                          <td style={tdStyle}>
                            <span style={{ fontSize: '13px', color: '#6b7280' }}>#{result.originalRank}</span>
                          </td>
                          <td style={tdStyle}>
                            <span style={{
                              fontSize: '13px',
                              fontWeight: 600,
                              color: result.newRank < result.originalRank ? '#10b981' : '#ef4444',
                            }}>
                              #{result.newRank}
                            </span>
                          </td>
                          <td style={tdStyle}>
                            <span style={{ fontSize: '13px', color: '#6b7280' }}>{result.originalScore.toFixed(1)}</span>
                          </td>
                          <td style={tdStyle}>
                            <ScoreBadge score={result.newScore} />
                          </td>
                          <td style={tdStyle}>
                            {result.newRank < result.originalRank ? (
                              <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 500 }}>
                                ↑ {result.originalRank - result.newRank}
                              </span>
                            ) : result.newRank > result.originalRank ? (
                              <span style={{ fontSize: '13px', color: '#ef4444', fontWeight: 500 }}>
                                ↓ {result.newRank - result.originalRank}
                              </span>
                            ) : (
                              <span style={{ fontSize: '13px', color: '#6b7280' }}>-</span>
                            )}
                          </td>
                          <td style={tdStyle}>
                            {!result.isPushed ? (
                              <button
                                onClick={() => handlePushResult(result.resultId)}
                                style={{
                                  padding: '4px 8px',
                                  fontSize: '12px',
                                  backgroundColor: '#8b5cf6',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                }}
                              >
                                推送
                              </button>
                            ) : (
                              <span style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                backgroundColor: '#ddd6fe',
                                color: '#6b21a8',
                              }}>
                                已推送
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'
  return (
    <span style={{
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 500,
      backgroundColor: color + '20',
      color: color,
    }}>
      {score.toFixed(1)}
    </span>
  )
}

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: '13px',
  fontWeight: 600,
  color: '#374151',
}

const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: '13px',
  color: '#1f2937',
}

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 50,
  padding: '20px',
}

const modalContentStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '24px',
  maxWidth: '600px',
  width: '100%',
  maxHeight: '90vh',
  overflowY: 'auto',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '14px',
  fontWeight: 500,
  color: '#374151',
  marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  fontSize: '14px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  outline: 'none',
}
