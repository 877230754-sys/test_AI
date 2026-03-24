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
      prisma.testDataset.findMany({
        where,
        include: {
          products: {
            include: {
              reviews: true
            }
          }
        },
        orderBy: { uploadedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.testDataset.count({ where }),
    ])

    const enrichedList = list.map(dataset => ({
      ...dataset,
      productCount: dataset.products.length,
      reviewCount: dataset.products.reduce((sum, p) => sum + p.reviews.length, 0)
    }))

    return NextResponse.json({
      success: true,
      list: enrichedList,
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error('获取测试集列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取失败，请稍后重试' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少测试集 ID' },
        { status: 400 }
      )
    }

    await prisma.testDataset.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({
      success: true,
      message: '删除成功'
    })
  } catch (error) {
    console.error('删除测试集失败:', error)
    return NextResponse.json(
      { success: false, error: '删除失败，请稍后重试' },
      { status: 500 }
    )
  }
}
