import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scoreReview } from '@/lib/qwen'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskId } = body

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: '缺少任务 ID' },
        { status: 400 }
      )
    }

    // 获取任务信息
    const task = await prisma.batchTask.findUnique({
      where: { id: parseInt(taskId) },
      include: {
        dataset: {
          include: {
            products: {
              include: {
                reviews: true
              }
            }
          }
        },
        standard: {
          include: {
            dimensions: true
          }
        },
        prompt: true
      }
    })

    if (!task) {
      return NextResponse.json(
        { success: false, error: '任务不存在' },
        { status: 404 }
      )
    }

    // 更新任务状态为运行中
    await prisma.batchTask.update({
      where: { id: parseInt(taskId) },
      data: {
        status: 'running',
        startedAt: new Date()
      }
    })

    let successCount = 0
    let failedCount = 0
    const results = []

    // 遍历所有评价进行打分
    for (const product of task.dataset.products) {
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

          const result = await prisma.batchResult.create({
            data: {
              taskId: parseInt(taskId),
              reviewId: review.reviewId,
              productId: product.productId,
              imageQualityScore: scoringResult.image_quality.score,
              relevanceScore: scoringResult.relevance.score,
              informativenessScore: scoringResult.informativeness.score,
              authenticityScore: scoringResult.authenticity.score,
              professionalismScore: scoringResult.professionalism.score,
              totalScore: scoringResult.total_score,
              scoreDetails: JSON.stringify(scoringResult),
              originalRank: 0,
              newRank: 0,
              acceptanceStatus: 'pending'
            }
          })

          results.push(result)
          successCount++
        } catch (error) {
          console.error('评价打分失败:', review.reviewId, error)
          failedCount++
        }
      }
    }

    // 更新任务状态
    await prisma.batchTask.update({
      where: { id: parseInt(taskId) },
      data: {
        status: 'completed',
        successCount,
        failedCount,
        completedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: '批量打分完成',
      total: results.length,
      success: successCount,
      failed: failedCount,
    })
  } catch (error) {
    console.error('执行批量打分任务失败:', error)
    
    // 更新任务状态为失败
    if (body.taskId) {
      await prisma.batchTask.update({
        where: { id: parseInt(body.taskId) },
        data: {
          status: 'failed',
          completedAt: new Date()
        }
      })
    }

    return NextResponse.json(
      { success: false, error: '执行失败，请稍后重试' },
      { status: 500 }
    )
  }
}
