import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskName, categoryId, standardId, promptId, scope = 'all', productCount = 0 } = body

    if (!taskName || !categoryId || !standardId || !promptId) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      )
    }

    const task = await prisma.brushTask.create({
      data: {
        taskName,
        categoryId,
        standardId: parseInt(standardId),
        promptId: parseInt(promptId),
        scope,
        productCount,
        status: 'pending',
        scheduledAt: new Date(),
        createdBy: 'system',
      }
    })

    return NextResponse.json({
      success: true,
      task_id: task.id,
      message: '刷数任务创建成功，等待执行',
    })
  } catch (error) {
    console.error('创建刷数任务失败:', error)
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
    const categoryId = searchParams.get('categoryId')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')

    const where: any = {}
    if (status) where.status = status
    if (categoryId) where.categoryId = categoryId

    const [list, total] = await Promise.all([
      prisma.brushTask.findMany({
        where,
        include: {
          results: {
            take: 5,
            orderBy: { createdAt: 'desc' }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.brushTask.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      list,
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error('获取刷数任务列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取失败，请稍后重试' },
      { status: 500 }
    )
  }
}
