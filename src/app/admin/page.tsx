'use client'

import AdminLayout from '../../components/AdminLayout'
import Link from 'next/link'

export default function AdminHomePage() {
  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          智能评价排序系统
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>
          通过 Qwen3 多模态大模型对电商评价进行质量打分和重排序
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <StatCard
            title="评价标准"
            value="6 个品类"
            description="已配置评分标准"
            icon="📋"
            color="#3b82f6"
          />
          <StatCard
            title="测试数据"
            value="1,234 条"
            description="测试集评价数量"
            icon="📁"
            color="#10b981"
          />
          <StatCard
            title="跑批任务"
            value="12 个"
            description="已完成打分任务"
            icon="🚀"
            color="#8b5cf6"
          />
        </div>

        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
          快速开始
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <QuickLink
            title="配置 LLM"
            description="设置 Qwen API Key 以启用 AI 功能"
            href="/admin/llm-settings"
            icon="🔧"
          />
          <QuickLink
            title="上传标准"
            description="上传品类评价标准文件"
            href="/admin/standards"
            icon="📋"
          />
          <QuickLink
            title="创建测试集"
            description="上传测试数据集"
            href="/admin/datasets"
            icon="📁"
          />
          <QuickLink
            title="调试 Prompt"
            description="优化评分 Prompt 模板"
            href="/admin/prompts"
            icon="⚙️"
          />
          <QuickLink
            title="跑批验收"
            description="执行批量打分任务"
            href="/admin/batch-tasks"
            icon="🚀"
          />
          <QuickLink
            title="刷数管理"
            description="配置定时刷数任务"
            href="/admin/brush-tasks"
            icon="🔄"
          />
        </div>
      </div>
    </AdminLayout>
  )
}

function StatCard({ title, value, description, icon, color }: {
  title: string
  value: string
  description: string
  icon: string
  color: string
}) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>{title}</span>
        <span style={{ fontSize: '24px' }}>{icon}</span>
      </div>
      <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
        {value}
      </div>
      <div style={{ fontSize: '13px', color: '#9ca3af' }}>
        {description}
      </div>
    </div>
  )
}

function QuickLink({ title, description, href, icon }: {
  title: string
  description: string
  href: string
  icon: string
}) {
  return (
    <Link href={href} style={{
      display: 'block',
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      textDecoration: 'none',
      transition: 'all 0.2s',
      border: '2px solid transparent',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <span style={{ fontSize: '20px' }}>{icon}</span>
        <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{title}</span>
      </div>
      <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
        {description}
      </p>
    </Link>
  )
}
