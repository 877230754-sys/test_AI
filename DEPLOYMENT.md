# Vercel 部署指南

## 📋 部署前准备

### 1. 准备 Qwen API Key

访问 [阿里云百炼平台](https://bailian.console.aliyun.com/) 获取 API Key：
1. 登录阿里云账号
2. 开通百炼服务
3. 创建 API Key
4. 复制保存 API Key

### 2. 准备数据库

本项目使用 SQLite 数据库，Vercel 会自动处理。

## 🚀 部署步骤

### 方式一：通过 Vercel 网站（推荐）

#### 步骤 1：登录 Vercel

访问 [https://vercel.com](https://vercel.com)，使用 GitHub 账号登录。

#### 步骤 2：导入项目

1. 点击 **"Add New Project"**
2. 选择 **"Import Git Repository"**
3. 找到你的仓库：`877230754-sys/test_AI`
4. 点击 **"Import"**

#### 步骤 3：配置项目

**Framework Preset**: Next.js（自动识别）

**Root Directory**: `./`（默认）

**Build Command**: 
```bash
prisma generate && next build
```

**Output Directory**: `.next`（默认）

**Install Command**: 
```bash
npm install
```

#### 步骤 4：配置环境变量

在 **"Environment Variables"** 部分添加：

| Name | Value |
|------|-------|
| `DATABASE_URL` | `file:./dev.db` |
| `QWEN_API_KEY` | `你的 Qwen API Key` |

**重要**：
- `DATABASE_URL` 使用 `file:./dev.db`（SQLite 数据库）
- `QWEN_API_KEY` 填写你从阿里云获取的真实 API Key

#### 步骤 5：部署

1. 点击 **"Deploy"**
2. 等待部署完成（约 2-3 分钟）
3. 看到庆祝页面表示部署成功

#### 步骤 6：访问应用

部署成功后，你会获得一个 URL，例如：
```
https://test-ai-xxx.vercel.app
```

点击访问即可看到你的应用！

### 方式二：通过 Vercel CLI

#### 步骤 1：安装 Vercel CLI

```bash
npm install -g vercel
```

#### 步骤 2：登录 Vercel

```bash
vercel login
```

#### 步骤 3：部署项目

在项目根目录运行：

```bash
vercel
```

#### 步骤 4：配置环境变量

```bash
# 设置数据库 URL
vercel env add DATABASE_URL
# 输入: file:./dev.db

# 设置 Qwen API Key
vercel env add QWEN_API_KEY
# 输入你的 API Key
```

#### 步骤 5：部署到生产环境

```bash
vercel --prod
```

## 🔧 部署后配置

### 1. 查看部署日志

在 Vercel Dashboard 中：
1. 选择你的项目
2. 点击 **"Deployments"**
3. 点击具体的部署记录
4. 查看 **"Build Logs"** 和 **"Functions Logs"**

### 2. 查看环境变量

在 Vercel Dashboard 中：
1. 选择你的项目
2. 点击 **"Settings"**
3. 点击 **"Environment Variables"**
4. 可以添加、修改、删除环境变量

### 3. 绑定自定义域名（可选）

在 Vercel Dashboard 中：
1. 选择你的项目
2. 点击 **"Settings"**
3. 点击 **"Domains"**
4. 添加你的自定义域名

### 4. 配置自动部署

Vercel 会自动配置：
- ✅ 推送到 `main` 分支自动部署生产环境
- ✅ 推送到其他分支自动部署预览环境
- ✅ Pull Request 自动创建预览链接

## 📊 数据库说明

### SQLite 在 Vercel 上的限制

⚠️ **重要提示**：SQLite 在 Vercel 上有以下限制：

1. **数据不持久**：每次部署后数据库会重置
2. **只适合测试**：不建议用于生产环境
3. **文件大小限制**：数据库文件不能太大

### 推荐的生产数据库方案

对于生产环境，建议使用：

1. **Vercel Postgres**（推荐）
   - 在 Vercel Dashboard 中一键创建
   - 自动配置环境变量
   - 免费额度足够小型项目使用

2. **PlanetScale**
   - MySQL 兼容
   - 免费额度较大
   - 支持分支功能

3. **Supabase**
   - PostgreSQL
   - 提供认证、存储等功能
   - 免费额度

### 迁移到 Vercel Postgres

如果你想使用 Vercel Postgres：

1. 在 Vercel Dashboard 中创建 Postgres 数据库
2. 修改 `prisma/schema.prisma`：
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. 更新环境变量 `DATABASE_URL`
4. 运行迁移：
   ```bash
   npx prisma migrate deploy
   ```

## 🐛 常见问题

### 1. 部署失败：找不到模块

**原因**：依赖安装失败

**解决**：
- 检查 `package.json` 中的依赖版本
- 确保 `package-lock.json` 已提交

### 2. 数据库连接失败

**原因**：环境变量未配置或配置错误

**解决**：
- 检查 Vercel Dashboard 中的环境变量
- 确保 `DATABASE_URL` 格式正确

### 3. API 调用失败

**原因**：Qwen API Key 未配置或无效

**解决**：
- 检查 `QWEN_API_KEY` 环境变量
- 确保 API Key 有效且有余额

### 4. 页面加载慢

**原因**：首次访问需要冷启动

**解决**：
- Vercel 免费版有冷启动时间
- 升级到 Pro 版可以减少冷启动

### 5. 定时任务不执行

**原因**：Vercel 不支持后台任务

**解决**：
- 使用 Vercel Cron Jobs
- 或使用外部定时任务服务（如 cron-job.org）

## 📈 性能优化

### 1. 启用 Edge Functions

修改 `next.config.js`：
```javascript
const nextConfig = {
  experimental: {
    runtime: 'edge',
  },
}
```

### 2. 配置缓存

在 API 路由中添加缓存头：
```typescript
export const config = {
  runtime: 'edge',
}

export default async function handler(req: Request) {
  return new Response(JSON.stringify(data), {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    },
  })
}
```

### 3. 图片优化

使用 Next.js Image 组件：
```tsx
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={500}
  height={300}
/>
```

## 🔗 有用的链接

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Prisma Vercel 集成](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

## 💡 提示

1. **首次部署**：第一次部署可能需要 3-5 分钟，请耐心等待
2. **环境变量**：修改环境变量后需要重新部署才能生效
3. **日志查看**：如果遇到问题，先查看部署日志
4. **免费额度**：Vercel 免费版每月有 100GB 带宽，足够小型项目使用

## 🎉 部署成功后

部署成功后，你可以：

1. ✅ 分享链接给其他人访问
2. ✅ 绑定自定义域名
3. ✅ 配置团队协作
4. ✅ 查看访问统计
5. ✅ 设置告警通知

祝你部署顺利！🚀
