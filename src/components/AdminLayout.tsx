'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  name: string
  href: string
  icon: string
}

const navItems: NavItem[] = [
  { name: '评价标准管理', href: '/admin/standards', icon: '📋' },
  { name: '测试集管理', href: '/admin/datasets', icon: '📁' },
  { name: 'Prompt 调试', href: '/admin/prompts', icon: '⚙️' },
  { name: '跑批验收', href: '/admin/batch-tasks', icon: '🚀' },
  { name: '刷数管理', href: '/admin/brush-tasks', icon: '🔄' },
  { name: 'LLM 设置', href: '/admin/llm-settings', icon: '🔧' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f3f4f6' }}>
      {/* 侧边栏 - 桌面端 */}
      <aside style={{
        width: '250px',
        background: '#1f2937',
        color: 'white',
        padding: '20px 0',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        overflowY: 'auto',
      }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #374151', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>智能评价排序系统</h2>
        </div>
        
        <nav>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  color: isActive ? '#ffffff' : '#9ca3af',
                  background: isActive ? '#374151' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '20px', marginRight: '12px' }}>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* 主内容区 */}
      <div style={{ flex: 1, marginLeft: '250px', display: 'flex', flexDirection: 'column' }}>
        {/* 顶部导航栏 */}
        <header style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/" style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '14px',
            }}>
              ← 返回首页
            </Link>
          </div>
        </header>

        {/* 页面内容 */}
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
