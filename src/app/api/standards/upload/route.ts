import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: '请上传文件' },
        { status: 400 }
      )
    }

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { success: false, error: '请上传 Excel 格式文件' },
        { status: 400 }
      )
    }

    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(sheet)

    if (data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Excel 文件为空' },
        { status: 400 }
      )
    }

    const firstRow = data[0] as any
    if (!firstRow['维度名称'] || !firstRow['权重']) {
      return NextResponse.json(
        { success: false, error: 'Excel 文件格式不正确，必须包含"维度名称"和"权重"列' },
        { status: 400 }
      )
    }

    let totalWeight = 0
    data.forEach((row: any) => {
      totalWeight += row['权重'] || 0
    })

    if (Math.abs(totalWeight - 1) > 0.01) {
      return NextResponse.json(
        { success: false, error: '维度权重之和必须为 100%' },
        { status: 400 }
      )
    }

    const categoryName = formData.get('categoryName') as string || '未命名品类'
    const version = `V1.0_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`

    const standard = await prisma.evaluationStandard.create({
      data: {
        categoryId: formData.get('categoryId') as string || 'default',
        categoryName,
        version,
        status: 'draft',
        createdBy: 'system',
        dimensions: {
          create: data.map((row: any, index: number) => ({
            dimensionName: row['维度名称'],
            weight: row['权重'] || 0,
            description: row['评分说明'] || '',
            score1Desc: row['1分标准'] || '',
            score3Desc: row['3分标准'] || '',
            score5Desc: row['5分标准'] || '',
            sortOrder: index + 1,
          })),
        },
      },
    })

    return NextResponse.json({
      success: true,
      standard_id: standard.id,
      message: '上传成功',
    })
  } catch (error) {
    console.error('上传评分标准失败:', error)
    return NextResponse.json(
      { success: false, error: '上传失败，请稍后重试' },
      { status: 500 }
    )
  }
}
