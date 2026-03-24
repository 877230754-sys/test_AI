import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskName, datasetId, standardId, promptId, concurrency = 'medium' } = body

    if (!taskName || !datasetId || !standardId || !promptId) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      )
    }

    const dataset = await prisma.testDataset.findUnique({
      where: { id: parseInt(datasetId) },
      include: { products: { include: { reviews: true } } }
    })

    if (!dataset) {
      return NextResponse.json(
        { success: false, error: '测试集不存在' },
        { status: 404 }
      )
    }

    const totalCount = dataset.products.reduce((sum, p) => sum + p.reviews.length, 0)

    const task = await prisma.batchTask.create({
      data: {
        taskName,
        datasetId: parseInt(datasetId),
        standardId: parseInt(standardId),
        promptId: parseInt(promptId),
        status: 'pending',
        totalCount,
        concurrency,
        createdBy: 'system',
      }
    })

    return NextResponse.json({
      success: true,
      task_id: task.id,
      message: '跑批任务创建成功，等待执行',
    })
  } catch (error) {
    console.error('创建跑批任务失败:', error)
    return NextResponse.json(
      { success: false, error: '创建失败，请稍后重试' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')

    const where: any = {}
    if (status) where.status = status

    const [list, total] = await Promise.all([
      prisma.batchTask.findMany({
        where,
        include: {
          dataset: true,
          results: {
            take: 10,
            orderBy: { createdAt: 'desc' }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.batchTask.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      list,
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error('获取跑批任务列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取失败，请稍后重试' },
      { status: 500 }
    )
  }
}
