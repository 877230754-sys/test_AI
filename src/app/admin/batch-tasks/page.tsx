'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '../../../components/AdminLayout'

interface BatchTask {
  taskId: number
  taskName: string
  datasetId: number
  datasetName: string
  standardId: number
  promptId: number
  status: 'pending' | 'running' | 'completed' | 'failed'
  totalReviews: number
  processedReviews: number
  successCount: number
  failCount: number
  createdAt: string
  startedAt?: string
  finishedAt?: string
}

interface BatchResult {
  resultId: number
  taskId: number
  reviewId: number
  productId: number
  productName: string
  reviewText: string
  imageQualityScore: number
  textQualityScore: number
  relevanceScore: number
  totalScore: number
  sortedRank?: number
  isAccepted?: boolean
  createdAt: string
}

interface Dataset {
  datasetId: number
  datasetName: string
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

export default function BatchTasksPage() {
  const [tasks, setTasks] = useState<BatchTask[]>([])
  const [selectedTask, setSelectedTask] = useState<BatchTask | null>(null)
  const [results, setResults] = useState<BatchResult[]>([])
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [standards, setStandards] = useState<Standard[]>([])
  const [prompts, setPrompts] = useState<PromptTemplate[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    taskName: '',
    datasetId: '',
    standardId: '',
    promptId: '',
    concurrency: '5',
  })

  useEffect(() => {
    loadTasks()
    loadDatasets()
    loadStandards()
    loadPrompts()
  }, [])

  const loadTasks = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/batch-tasks')
      const data = await response.json()
      setTasks(data.tasks || [])
    } catch (error) {
      console.error('加载任务失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDatasets = async () => {
    try {
      const response = await fetch('/api/datasets')
      const data = await response.json()
      setDatasets(data.datasets || [])
    } catch (error) {
      console.error('加载测试集失败:', error)
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
      const response = await fetch(`/api/batch-tasks/${taskId}/results`)
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('加载结果失败:', error)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/batch-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          datasetId: parseInt(formData.datasetId),
          standardId: parseInt(formData.standardId),
          promptId: parseInt(formData.promptId),
          concurrency: parseInt(formData.concurrency),
        }),
      })

      if (response.ok) {
        alert('任务创建成功')
        setShowCreateModal(false)
        loadTasks()
        setFormData({
          taskName: '',
          datasetId: '',
          standardId: '',
          promptId: '',
          concurrency: '5',
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

  const handleExecute = async (task: BatchTask) => {
    if (!confirm(`确定要执行任务 "${task.taskName}" 吗？`)) {
      return
    }

    setIsExecuting(true)
    try {
      const response = await fetch('/api/batch-tasks/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: task.taskId.toString() }),
      })

      if (response.ok) {
        alert('任务执行成功')
        loadTasks()
      } else {
        const error = await response.json()
        alert(`执行失败：${error.error}`)
      }
    } catch (error) {
      console.error('执行任务失败:', error)
      alert('执行失败，请重试')
    } finally {
      setIsExecuting(false)
    }
  }

  const handleViewResults = async (task: BatchTask) => {
    await loadResults(task.taskId)
    setSelectedTask(task)
    setShowResultsModal(true)
  }

  const handleAcceptResult = async (resultId: number) => {
    try {
      const response = await fetch(`/api/batch-tasks/results/${resultId}/accept`, {
        method: 'POST',
      })

      if (response.ok) {
        alert('已接受')
        loadResults(selectedTask!.taskId)
      } else {
        alert('操作失败')
      }
    } catch (error) {
      console.error('接受结果失败:', error)
      alert('操作失败')
    }
  }

  const handleRejectResult = async (resultId: number) => {
    try {
      const response = await fetch(`/api/batch-tasks/results/${resultId}/reject`, {
        method: 'POST',
      })

      if (response.ok) {
        alert('已拒绝')
        loadResults(selectedTask!.taskId)
      } else {
        alert('操作失败')
      }
    } catch (error) {
      console.error('拒绝结果失败:', error)
      alert('操作失败')
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

  const getProgress = (task: BatchTask) => {
    if (task.totalReviews === 0) return 0
    return Math.round((task.processedReviews / task.totalReviews) * 100)
  }

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>跑批验收</h1>
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
                  <th style={thStyle}>测试集</th>
                  <th style={thStyle}>状态</th>
                  <th style={thStyle}>进度</th>
                  <th style={thStyle}>成功/失败</th>
                  <th style={thStyle}>创建时间</th>
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
                      <td style={tdStyle}>{task.datasetName}</td>
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
                                backgroundColor: '#3b82f6',
                                transition: 'width 0.3s',
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>{getProgress(task)}%</span>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ color: '#10b981', fontWeight: 500 }}>{task.successCount}</span>
                        <span style={{ color: '#6b7280', margin: '0 4px' }}>/</span>
                        <span style={{ color: '#ef4444', fontWeight: 500 }}>{task.failCount}</span>
                      </td>
                      <td style={tdStyle}>{new Date(task.createdAt).toLocaleString('zh-CN')}</td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {task.status === 'pending' && (
                            <button
                              onClick={() => handleExecute(task)}
                              disabled={isExecuting}
                              style={{
                                padding: '6px 12px',
                                fontSize: '13px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: isExecuting ? 'not-allowed' : 'pointer',
                                opacity: isExecuting ? 0.6 : 1,
                              }}
                            >
                              {isExecuting ? '执行中...' : '执行'}
                            </button>
                          )}
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
                新建跑批任务
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
                    placeholder="例如：双 11 评价批量打分"
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>选择测试集</label>
                  <select
                    required
                    value={formData.datasetId}
                    onChange={(e) => setFormData({ ...formData, datasetId: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="">请选择测试集</option>
                    {datasets.map((dataset) => (
                      <option key={dataset.datasetId} value={dataset.datasetId}>
                        {dataset.datasetName}
                      </option>
                    ))}
                  </select>
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
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>并发数</label>
                  <input
                    type="number"
                    required
                    value={formData.concurrency}
                    onChange={(e) => setFormData({ ...formData, concurrency: e.target.value })}
                    style={inputStyle}
                    min="1"
                    max="20"
                  />
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    建议值：5-10（根据 API 配额调整）
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
                      backgroundColor: '#3b82f6',
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
                  任务结果：{selectedTask.taskName}
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
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>总数：</span>
                    <span style={{ fontWeight: 500 }}>{selectedTask.processedReviews}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', color: '#10b981' }}>成功：</span>
                    <span style={{ fontWeight: 500, color: '#10b981' }}>{selectedTask.successCount}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', color: '#ef4444' }}>失败：</span>
                    <span style={{ fontWeight: 500, color: '#ef4444' }}>{selectedTask.failCount}</span>
                  </div>
                </div>
              </div>

              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, backgroundColor: 'white' }}>
                      <th style={thStyle}>商品</th>
                      <th style={thStyle}>评价内容</th>
                      <th style={thStyle}>图片分</th>
                      <th style={thStyle}>文本分</th>
                      <th style={thStyle}>相关性</th>
                      <th style={thStyle}>总分</th>
                      <th style={thStyle}>验收</th>
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
                          <td style={{ ...tdStyle, maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {result.reviewText}
                          </td>
                          <td style={tdStyle}>
                            <ScoreBadge score={result.imageQualityScore} />
                          </td>
                          <td style={tdStyle}>
                            <ScoreBadge score={result.textQualityScore} />
                          </td>
                          <td style={tdStyle}>
                            <ScoreBadge score={result.relevanceScore} />
                          </td>
                          <td style={tdStyle}>
                            <ScoreBadge score={result.totalScore} />
                          </td>
                          <td style={tdStyle}>
                            {result.isAccepted === undefined ? (
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                  onClick={() => handleAcceptResult(result.resultId)}
                                  style={{
                                    padding: '4px 8px',
                                    fontSize: '12px',
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={() => handleRejectResult(result.resultId)}
                                  style={{
                                    padding: '4px 8px',
                                    fontSize: '12px',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  ✗
                                </button>
                              </div>
                            ) : (
                              <span style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                backgroundColor: result.isAccepted ? '#d1fae5' : '#fee2e2',
                                color: result.isAccepted ? '#065f46' : '#991b1b',
                              }}>
                                {result.isAccepted ? '已接受' : '已拒绝'}
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
