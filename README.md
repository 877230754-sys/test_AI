# 智能评价排序系统

通过 Qwen3 多模态大模型对电商评价进行质量打分和重排序，提升转化率。

## 功能特性

- ✅ **评价标准管理** - 配置品类评分标准和维度
- ✅ **测试集管理** - 上传和管理测试数据
- ✅ **Prompt 调试** - 创建和优化评分 Prompt 模板
- ✅ **跑批验收** - 批量打分和人工验收
- ✅ **刷数管理** - 定时刷数和推送管理
- ✅ **LLM 设置** - 配置 Qwen API Key

## 技术栈

- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: Prisma + SQLite
- **AI**: Qwen3 多模态大模型
- **定时任务**: node-cron

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 初始化数据库

```bash
npx prisma generate
npx prisma db push
DATABASE_URL="file:./dev.db" npx tsx prisma/seed.ts
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```env
DATABASE_URL="file:./dev.db"
QWEN_API_KEY="your-qwen-api-key"
```

### 4. 启动开发服务器

```bash
DATABASE_URL="file:./dev.db" npm run dev
```

### 5. 访问应用

打开浏览器访问 [http://localhost:3001](http://localhost:3001)

## 项目结构

```
review-sorting-system/
├── src/
│   ├── app/
│   │   ├── admin/          # 管理后台页面
│   │   ├── api/            # API 接口
│   │   └── layout.tsx      # 根布局
│   ├── components/         # 组件
│   └── lib/               # 工具库
│       ├── cron.ts        # 定时任务
│       ├── prisma.ts      # 数据库客户端
│       └── qwen.ts        # Qwen API 集成
├── prisma/
│   ├── schema.prisma      # 数据库模型
│   └── seed.ts           # 种子数据
└── package.json
```

## 核心功能

### 1. 评价标准管理

- 上传品类评分标准（Excel）
- 配置评分维度和权重
- 管理标准版本

### 2. 测试集管理

- 上传测试数据集（Excel）
- 管理商品和评价数据
- 查看数据统计

### 3. Prompt 调试

- 创建 Prompt 模板
- 支持变量占位符
- 版本管理

### 4. 跑批验收

- 批量打分测试集
- 查看评分结果
- 人工验收功能

### 5. 刷数管理

- 定时刷数任务
- 自动排序评价
- 推送结果到推荐系统

### 6. LLM 设置

- 配置 Qwen API Key
- 选择模型版本
- 调整参数

## API 文档

### 评价标准

- `GET /api/standards` - 获取标准列表
- `POST /api/standards/upload` - 上传标准文件
- `DELETE /api/standards/:id` - 删除标准

### 测试集

- `GET /api/datasets` - 获取测试集列表
- `POST /api/datasets/upload` - 上传测试集
- `DELETE /api/datasets/:id` - 删除测试集

### Prompt 模板

- `GET /api/prompts` - 获取 Prompt 列表
- `POST /api/prompts` - 创建 Prompt
- `DELETE /api/prompts/:id` - 删除 Prompt

### 跑批任务

- `GET /api/batch-tasks` - 获取任务列表
- `POST /api/batch-tasks` - 创建任务
- `POST /api/batch-tasks/execute` - 执行任务
- `GET /api/batch-tasks/:id/results` - 获取结果

### 刷数任务

- `GET /api/brush-tasks` - 获取任务列表
- `POST /api/brush-tasks` - 创建任务
- `DELETE /api/brush-tasks/:id` - 删除任务

### LLM 配置

- `GET /api/llm-config` - 获取配置
- `POST /api/llm-config` - 保存配置

## 数据库模型

- `LLMConfig` - LLM 配置
- `EvaluationStandard` - 评价标准
- `EvaluationDimension` - 评分维度
- `TestDataset` - 测试集
- `TestProduct` - 测试商品
- `TestReview` - 测试评价
- `PromptTemplate` - Prompt 模板
- `BatchTask` - 跑批任务
- `BatchResult` - 跑批结果
- `BrushTask` - 刷数任务
- `BrushResult` - 刷数结果

## 定时任务

系统每日凌晨 2 点自动执行刷数任务：

- 获取活跃刷数任务
- 批量打分评价
- 排序并推送结果

## 开发

### 构建

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 许可证

MIT
