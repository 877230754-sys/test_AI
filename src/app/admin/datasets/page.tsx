'use client'

import { useState, useEffect } from 'react'

interface Dataset {
  id: number
  datasetName: string
  categoryId: string
  productCount: number
  reviewCount: number
  uploadedAt: string
  status: string
}

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)

  useEffect(() => {
    loadDatasets()
  }, [])

  const loadDatasets = async () => {
    try {
      const response = await fetch('/api/datasets')
      const data = await response.json()
      if (data.success) {
        setDatasets(data.list)
      }
    } catch (error) {
      console.error('加载测试集失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      const response = await fetch('/api/datasets/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      
      if (data.success) {
        alert('上传成功！')
        setShowUploadModal(false)
        loadDatasets()
      } else {
        alert('上传失败：' + data.error)
      }
    } catch (error) {
      console.error('上传失败:', error)
      alert('上传失败，请稍后重试')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个测试集吗？')) return
    
    try {
      const response = await fetch(`/api/datasets?id=${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      
      if (data.success) {
        alert('删除成功！')
        loadDatasets()
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
            测试集管理
          </h1>
          <p style={{ color: '#6b7280' }}>上传和管理测试集数据</p>
        </div>
        
        <button
          onClick={() => setShowUploadModal(true)}
          style={{
            padding: '12px 24px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          📤 上传测试集
        </button>
      </div>

      {/* 测试集列表 */}
      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>名称</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>品类</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>商品数</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>评价数</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>上传时间</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>操作</th>
            </tr>
          </thead>
          <tbody style={{ borderTop: '1px solid #e5e7eb' }}>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  加载中...
                </td>
              </tr>
            ) : datasets.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  暂无数据，请上传测试集
                </td>
              </tr>
            ) : (
              datasets.map((dataset) => (
                <tr key={dataset.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                    {dataset.datasetName}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                    {dataset.categoryId}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                    {dataset.productCount}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                    {dataset.reviewCount}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                    {new Date(dataset.uploadedAt).toLocaleString('zh-CN')}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', fontSize: '14px' }}>
                    <button
                      onClick={() => handleDelete(dataset.id)}
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
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>上传测试集</h2>
            
            <form onSubmit={handleUpload}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                  测试集名称
                </label>
                <input
                  type="text"
                  name="datasetName"
                  required
                  placeholder="例如：美妆测试集 V1"
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
                  品类 ID
                </label>
                <input
                  type="text"
                  name="categoryId"
                  required
                  placeholder="例如：beauty"
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
                  请上传包含商品信息的 Excel 文件
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
                    background: '#10b981',
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
    </div>
  )
}
