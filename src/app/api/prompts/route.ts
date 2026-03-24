import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { templateName, version, promptContent, variables } = body

    if (!templateName || !promptContent) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      )
    }

    const template = await prisma.promptTemplate.create({
      data: {
        templateName,
        version: version || 'V1.0',
        status: 'draft',
        promptContent,
        variables: variables ? JSON.stringify(variables) : null,
        createdBy: 'system',
      }
    })

    return NextResponse.json({
      success: true,
      template_id: template.id,
      message: 'Prompt 模板创建成功',
    })
  } catch (error) {
    console.error('创建 Prompt 模板失败:', error)
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
      prisma.promptTemplate.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.promptTemplate.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      list,
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error('获取 Prompt 模板列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取失败，请稍后重试' },
      { status: 500 }
    )
  }
}
