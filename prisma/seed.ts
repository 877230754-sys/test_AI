import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始填充 Mock 数据...')

  // 创建 LLM 配置
  const llmConfig = await prisma.lLMConfig.create({
    data: {
      apiKey: 'sk-qwen-xxxxxx',
      modelName: 'qwen-vl-plus',
      temperature: 0.7,
      maxTokens: 2000,
      apiEndpoint: 'https://dashscope.aliyuncs.com/api/v1',
      isActive: true,
    },
  })
  console.log('✓ LLM 配置创建成功')

  // 创建评分标准
  const beautyStandard = await prisma.evaluationStandard.create({
    data: {
      categoryId: 'beauty',
      categoryName: '美妆',
      version: 'V1.0',
      status: 'effective',
      createdBy: 'zhangsan',
      effectiveAt: new Date(),
      dimensions: {
        create: [
          {
            dimensionName: '图片质量',
            weight: 0.20,
            description: '图片清晰度、光线、构图等',
            score1Desc: '图片模糊、光线差',
            score3Desc: '图片清晰、光线充足',
            score5Desc: '图片高清、光线专业',
            sortOrder: 1,
          },
          {
            dimensionName: '图文相关性',
            weight: 0.25,
            description: '图片与文字描述的一致性',
            score1Desc: '图片与文字完全无关',
            score3Desc: '图片与文字基本相关',
            score5Desc: '图片完美诠释文字内容',
            sortOrder: 2,
          },
          {
            dimensionName: '文字信息量',
            weight: 0.25,
            description: '使用体验、效果描述等',
            score1Desc: '文字<20字，无信息量',
            score3Desc: '文字50-100字，有基本描述',
            score5Desc: '文字>150字，详细描述',
            sortOrder: 3,
          },
          {
            dimensionName: '真实性',
            weight: 0.15,
            description: '是否像真实用户评价',
            score1Desc: '疑似刷单、模板化严重',
            score3Desc: '语言自然，有真实使用场景',
            score5Desc: '语言生动，有个人情感表达',
            sortOrder: 4,
          },
          {
            dimensionName: '专业性',
            weight: 0.15,
            description: '对美妆产品的专业理解程度',
            score1Desc: '无专业描述',
            score3Desc: '有基本成分/功效说明',
            score5Desc: '专业分析成分、对比竞品',
            sortOrder: 5,
          },
        ],
      },
    },
  })
  console.log('✓ 评分标准创建成功')

  // 创建测试集
  const testDataset = await prisma.testDataset.create({
    data: {
      datasetName: '美妆测试集 V1',
      categoryId: 'beauty',
      productCount: 100,
      reviewCount: 1000,
      uploadedBy: 'zhangsan',
      status: 'active',
      products: {
        create: [
          {
            productId: '10001',
            productName: 'YSL 口红 #01',
            category: '彩妆/口红',
            price: 320.00,
            reviewCount: 10,
            reviews: {
              create: [
                {
                  reviewId: '50001',
                  userId: 'u_12345',
                  userLevel: 5,
                  reviewText: '颜色很正，显色度非常好！滋润度也不错，不会拔干。持久度大概 4-5 小时，吃饭会掉一些。整体很满意~',
                  imageUrls: JSON.stringify(['https://example.com/img1.jpg', 'https://example.com/img2.jpg', 'https://example.com/img3.jpg']),
                  imageCount: 3,
                  textLength: 120,
                },
                {
                  reviewId: '50002',
                  userId: 'u_23456',
                  userLevel: 3,
                  reviewText: '好用，推荐购买',
                  imageUrls: JSON.stringify(['https://example.com/img4.jpg']),
                  imageCount: 1,
                  textLength: 8,
                },
                {
                  reviewId: '50003',
                  userId: 'u_34567',
                  userLevel: 6,
                  reviewText: '滋润度好，不拔干，持久度 5 小时左右。成分安全，适合敏感肌使用。',
                  imageUrls: JSON.stringify(['https://example.com/img5.jpg', 'https://example.com/img6.jpg']),
                  imageCount: 2,
                  textLength: 65,
                },
              ],
            },
          },
        ],
      },
    },
  })
  console.log('✓ 测试集创建成功')

  // 创建 Prompt 模板
  const promptTemplate = await prisma.promptTemplate.create({
    data: {
      templateName: '美妆评分 Prompt V3.1',
      version: 'V3.1',
      status: 'effective',
      promptContent: `# 角色定义
你是一位专业的美妆产品评价质量评估专家，擅长从图片质量、图文相关性、文字信息量等多个维度评价用户生成的内容质量。

# 评分维度
请根据以下维度对评价进行打分（1-5 分）：
1. 图片质量（权重 20%）：清晰度、光线、构图等
2. 图文相关性（权重 25%）：图片与文字描述的一致性
3. 文字信息量（权重 25%）：使用体验、效果描述等
4. 真实性（权重 15%）：是否像真实用户评价
5. 专业性（权重 15%）：对美妆产品的专业理解程度

# 输入数据
商品名称：{{product_name}}
商品类目：{{product_category}}
评价内容：{{review_text}}
评价图片：{{review_images}}

# 输出格式
请严格按照以下 JSON 格式输出：
{
  "image_quality": {"score": 1-5, "reason": "评分理由"},
  "relevance": {"score": 1-5, "reason": "评分理由"},
  "informativeness": {"score": 1-5, "reason": "评分理由"},
  "authenticity": {"score": 1-5, "reason": "评分理由"},
  "professionalism": {"score": 1-5, "reason": "评分理由"},
  "total_score": 1-5,
  "suggestion": "改进建议"
}`,
      variables: JSON.stringify(['product_name', 'product_category', 'review_text', 'review_images']),
      testAccuracy: 0.82,
      createdBy: 'lisi',
    },
  })
  console.log('✓ Prompt 模板创建成功')

  // 创建跑批任务
  const batchTask = await prisma.batchTask.create({
    data: {
      taskName: '美妆测试集跑批_0319',
      datasetId: testDataset.id,
      standardId: beautyStandard.id,
      promptId: promptTemplate.id,
      status: 'completed',
      totalCount: 1000,
      successCount: 995,
      failedCount: 5,
      concurrency: 'medium',
      startedAt: new Date('2026-03-19 15:00:00'),
      completedAt: new Date('2026-03-19 15:20:00'),
      createdBy: 'zhangsan',
      results: {
        create: [
          {
            reviewId: '50001',
            productId: '10001',
            imageQualityScore: 4.0,
            relevanceScore: 5.0,
            informativenessScore: 4.0,
            authenticityScore: 5.0,
            professionalismScore: 3.0,
            totalScore: 4.25,
            scoreDetails: JSON.stringify({
              image_quality: { score: 4, reason: '图片清晰，光线充足' },
              relevance: { score: 5, reason: '图片完美诠释文字内容' },
              informativeness: { score: 4, reason: '有基本使用体验描述' },
              authenticity: { score: 5, reason: '语言生动，有个人情感' },
              professionalism: { score: 3, reason: '有基本成分说明' },
            }),
            originalRank: 1,
            newRank: 1,
            acceptanceStatus: 'accepted',
          },
        ],
      },
    },
  })
  console.log('✓ 跑批任务创建成功')

  // 创建刷数任务
  const brushTask = await prisma.brushTask.create({
    data: {
      taskName: '美妆品类线上刷数_0319',
      categoryId: 'beauty',
      standardId: beautyStandard.id,
      promptId: promptTemplate.id,
      scope: 'all',
      productCount: 102580,
      status: 'completed',
      scheduledAt: new Date('2026-03-19 02:00:00'),
      startedAt: new Date('2026-03-19 02:00:00'),
      completedAt: new Date('2026-03-19 05:45:00'),
      createdBy: 'zhangsan',
      results: {
        create: [
          {
            productId: '10001',
            reviewIds: JSON.stringify(['50001', '50002', '50003']),
            reviewScores: JSON.stringify([4.25, 3.20, 4.10]),
            sortedReviewIds: JSON.stringify(['50001', '50003', '50002']),
            pushStatus: 'pushed',
            pushedAt: new Date('2026-03-19 06:30:00'),
          },
        ],
      },
    },
  })
  console.log('✓ 刷数任务创建成功')

  // 创建用户
  await prisma.user.create({
    data: {
      username: 'zhangsan',
      passwordHash: 'bcrypt:xxxxxx',
      role: 'operator',
      email: 'zhangsan@example.com',
    },
  })
  console.log('✓ 用户创建成功')

  console.log('\n✅ Mock 数据填充完成！')
}

main()
  .catch((e) => {
    console.error('❌ 填充失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
