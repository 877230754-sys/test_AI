import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')

    const where: any = {}
    if (category) where.categoryId = category
    if (status) where.status = status

    const [list, total] = await Promise.all([
      prisma.evaluationStandard.findMany({
        where,
        include: {
          dimensions: {
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.evaluationStandard.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      list,
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error('获取标准列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取失败，请稍后重试' },
      { status: 500 }
    )
  }
}
