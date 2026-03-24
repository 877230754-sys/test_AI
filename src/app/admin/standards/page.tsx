'use client'

import { useState, useEffect } from 'react'

interface Standard {
  id: number
  categoryId: string
  categoryName: string
  version: string
  status: string
  createdAt: string
  dimensions: any[]
}

export default function StandardsPage() {
  const [standards, setStandards] = useState<Standard[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null)

  useEffect(() => {
    loadStandards()
  }, [])

  const loadStandards = async () => {
    try {
      const response = await fetch('/api/standards')
      const data = await response.json()
      if (data.success) {
        setStandards(data.list)
      }
    } catch (error) {
      console.error('加载标准列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      const response = await fetch('/api/standards/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      
      if (data.success) {
        alert('上传成功！')
        setShowUploadModal(false)
        loadStandards()
      } else {
        alert('上传失败：' + data.error)
      }
    } catch (error) {
      console.error('上传失败:', error)
      alert('上传失败，请稍后重试')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个标准吗？')) return
    
    try {
      const response = await fetch(`/api/standards?id=${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      
      if (data.success) {
        alert('删除成功！')
        loadStandards()
      } else {
        alert('删除失败：' + data.error)
      }
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败，请稍后重试')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
            评价标准管理
          </h1>
          <p style={{ color: '#6b7280' }}>上传和管理分品类的评价评分标准</p>
        </div>
        
        <button
          onClick={() => setShowUploadModal(true)}
          style={{
            padding: '12px 24px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          📤 上传标准
        </button>
      </div>

      {/* 标准列表 */}
      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>品类</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>版本</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>状态</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>创建时间</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>操作</th>
            </tr>
          </thead>
          <tbody style={{ borderTop: '1px solid #e5e7eb' }}>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  加载中...
                </td>
              </tr>
            ) : standards.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  暂无数据，请上传评价标准
                </td>
              </tr>
            ) : (
              standards.map((standard) => (
                <tr key={standard.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                    {standard.categoryName}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                    {standard.version}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: standard.status === 'effective' ? '#d1fae5' : '#fef3c7',
                      color: standard.status === 'effective' ? '#065f46' : '#92400e',
                    }}>
                      {standard.status === 'effective' ? '✅ 已生效' : '⏳ 草稿'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                    {new Date(standard.createdAt).toLocaleString('zh-CN')}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', fontSize: '14px' }}>
                    <button
                      onClick={() => setSelectedStandard(standard)}
                      style={{
                        padding: '6px 12px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        marginRight: '8px',
                      }}
                    >
                      查看
                    </button>
                    <button
                      onClick={() => handleDelete(standard.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 上传弹窗 */}
      {showUploadModal && (
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
            maxWidth: '500px',
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>上传评价标准</h2>
            
            <form onSubmit={handleUpload}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                  品类名称
                </label>
                <input
                  type="text"
                  name="categoryName"
                  required
                  placeholder="例如：美妆"
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
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                  Excel 文件
                </label>
                <input
                  type="file"
                  name="file"
                  accept=".xlsx,.xls"
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
                  请上传 Excel 文件，包含维度名称、权重、评分标准等列
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
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
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  上传
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 详情弹窗 */}
      {selectedStandard && (
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
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              标准详情 - {selectedStandard.categoryName}
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>版本</p>
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>{selectedStandard.version}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>状态</p>
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>
                    {selectedStandard.status === 'effective' ? '✅ 已生效' : '⏳ 草稿'}
                  </p>
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>评分维度</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead style={{ background: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #e5e7eb' }}>维度名称</th>
                  <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #e5e7eb' }}>权重</th>
                  <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #e5e7eb' }}>说明</th>
                </tr>
              </thead>
              <tbody>
                {selectedStandard.dimensions.map((dim, index) => (
                  <tr key={index}>
                    <td style={{ padding: '8px', border: '1px solid #e5e7eb' }}>{dim.dimensionName}</td>
                    <td style={{ padding: '8px', border: '1px solid #e5e7eb' }}>{(dim.weight * 100).toFixed(0)}%</td>
                    <td style={{ padding: '8px', border: '1px solid #e5e7eb' }}>{dim.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                onClick={() => setSelectedStandard(null)}
                style={{
                  padding: '10px 20px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
