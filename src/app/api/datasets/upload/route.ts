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

    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer)
    
    // 读取产品数据
    const productSheet = workbook.Sheets[workbook.SheetNames[0]]
    const products = XLSX.utils.sheet_to_json(productSheet)
    
    if (products.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Excel 文件为空' },
        { status: 400 }
      )
    }

    const datasetName = formData.get('datasetName') as string || `测试集_${new Date().toISOString().slice(0, 10)}`
    const categoryId = formData.get('categoryId') as string || 'default'

    // 创建测试集
    const dataset = await prisma.testDataset.create({
      data: {
        datasetName,
        categoryId,
        productCount: 0,
        reviewCount: 0,
        uploadedBy: 'system',
        status: 'active',
        products: {
          create: products.map((product: any) => ({
            productId: product['商品 ID'] || `prod_${Date.now()}_${Math.random()}`,
            productName: product['商品名称'] || '未命名商品',
            category: product['商品类目'] || '',
            price: parseFloat(product['价格']) || 0,
            reviewCount: parseInt(product['评价数量']) || 10,
            reviews: {
              create: [] // 评价数据将在后续添加
            }
          }))
        }
      }
    })

    return NextResponse.json({
      success: true,
      dataset_id: dataset.id,
      message: '测试集上传成功',
    })
  } catch (error) {
    console.error('上传测试集失败:', error)
    return NextResponse.json(
      { success: false, error: '上传失败，请稍后重试' },
      { status: 500 }
    )
  }
}
