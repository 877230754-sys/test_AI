import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { startDailyBrushTask } from "@/lib/cron"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "智能评价排序系统",
  description: "基于 Qwen3 多模态大模型的评价质量排序系统",
}

// 启动定时任务
if (process.env.NODE_ENV === 'development') {
  startDailyBrushTask()
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
