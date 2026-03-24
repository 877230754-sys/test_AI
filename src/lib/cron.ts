import cron from 'node-cron'
import { prisma } from '@/lib/prisma'
import { scoreReview } from '@/lib/qwen'

// 每日凌晨 2 点执行刷数任务
const DAILY_SCHEDULE = '0 2 * * *'

export function startDailyBrushTask() {
  console.log('启动每日刷数定时任务，执行时间：每日凌晨 2:00')
  
  cron.schedule(DAILY_SCHEDULE, async () => {
    console.log('开始执行每日刷数任务...')
    
    try {
      // 获取所有活跃的刷数任务
      const tasks = await prisma.brushTask.findMany({
        where: {
          status: 'pending'
        },
        include: {
          standard: {
            include: {
              dimensions: true
            }
          },
          prompt: true
        }
      })

      for (const task of tasks) {
        await executeBrushTask(task)
      }

      console.log('每日刷数任务执行完成')
    } catch (error) {
      console.error('每日刷数任务执行失败:', error)
    }
  })
}

async function executeBrushTask(task: any) {
  console.log(`开始执行刷数任务：${task.taskName}`)
  
  try {
    // 更新任务状态
    await prisma.brushTask.update({
      where: { id: task.id },
      data: {
        status: 'running',
        startedAt: new Date()
      }
    })

    // 获取该品类的所有商品
    // 注意：这里简化处理，实际应该从推荐系统获取活跃商品列表
    const products = await prisma.testProduct.findMany({
      where: {
        category: task.categoryId
      },
      include: {
        reviews: true
      },
      take: task.productCount || 100
    })

    let processedCount = 0

    for (const product of products) {
      const reviewScores: any[] = []
      const reviewIds: string[] = []

      // 对每个商品的评价进行打分
      for (const review of product.reviews) {
        try {
          const imageUrls = review.imageUrls ? JSON.parse(review.imageUrls) : []
          
          const scoringResult = await scoreReview(
            review.reviewText,
            imageUrls,
            product.productName,
            product.category || '',
            task.prompt.promptContent
          )

          reviewScores.push({
            reviewId: review.reviewId,
            score: scoringResult.total_score,
            details: scoringResult
          })
          reviewIds.push(review.reviewId)
          
          processedCount++
        } catch (error) {
          console.error(`评价打分失败：${review.reviewId}`, error)
        }
      }

      // 根据分数排序
      reviewScores.sort((a, b) => b.score - a.score)
      const sortedReviewIds = reviewScores.map(r => r.reviewId)

      // 保存刷数结果
      await prisma.brushResult.create({
        data: {
          taskId: task.id,
          productId: product.productId,
          reviewIds: JSON.stringify(reviewIds),
          reviewScores: JSON.stringify(reviewScores.map(r => r.score)),
          sortedReviewIds: JSON.stringify(sortedReviewIds),
          pushStatus: 'pending'
        }
      })

      // 模拟推送结果到推荐系统
      await pushToRecommendationSystem(product.productId, sortedReviewIds)
    }

    // 更新任务状态
    await prisma.brushTask.update({
      where: { id: task.id },
      data: {
        status: 'completed',
        completedAt: new Date()
      }
    })

    console.log(`刷数任务完成：${task.taskName}, 处理评价数：${processedCount}`)
  } catch (error) {
    console.error(`刷数任务失败：${task.taskName}`, error)
    
    await prisma.brushTask.update({
      where: { id: task.id },
      data: {
        status: 'failed',
        completedAt: new Date()
      }
    })
  }
}

async function pushToRecommendationSystem(productId: string, sortedReviewIds: string[]) {
  // 模拟推送排序结果到推荐系统
  // 实际应该调用推荐系统的 API
  console.log(`推送商品 ${productId} 的评价排序结果到推荐系统`)
  
  // 更新推送状态
  await prisma.brushResult.updateMany({
    where: {
      productId
    },
    data: {
      pushStatus: 'pushed',
      pushedAt: new Date()
    }
  })
}
