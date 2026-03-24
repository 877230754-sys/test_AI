import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { apiKey, modelName, temperature, maxTokens, apiEndpoint } = body

    if (!apiKey || !modelName) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 先停用所有配置
    await prisma.lLMConfig.updateMany({
      data: { isActive: false }
    })

    // 创建新配置
    const config = await prisma.lLMConfig.create({
      data: {
        apiKey,
        modelName,
        temperature: temperature || 0.7,
        maxTokens: maxTokens || 2000,
        apiEndpoint: apiEndpoint || 'https://dashscope.aliyuncs.com/api/v1',
        isActive: true,
      }
    })

    return NextResponse.json({
      success: true,
      config_id: config.id,
      message: 'LLM 配置保存成功',
    })
  } catch (error) {
    console.error('保存 LLM 配置失败:', error)
    return NextResponse.json(
      { success: false, error: '保存失败，请稍后重试' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const configs = await prisma.lLMConfig.findMany({
      orderBy: { createdAt: 'desc' }
    })

    const activeConfig = configs.find(c => c.isActive) || configs[0]

    return NextResponse.json({
      success: true,
      active: activeConfig ? {
        ...activeConfig,
        apiKey: activeConfig.apiKey.substring(0, 8) + '****' // 脱敏显示
      } : null,
      all: configs.map(c => ({
        ...c,
        apiKey: c.apiKey.substring(0, 8) + '****'
      }))
    })
  } catch (error) {
    console.error('获取 LLM 配置失败:', error)
    return NextResponse.json(
      { success: false, error: '获取失败，请稍后重试' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, isActive } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少配置 ID' },
        { status: 400 }
      )
    }

    if (isActive) {
      // 先停用所有配置
      await prisma.lLMConfig.updateMany({
        data: { isActive: false }
      })

      // 激活指定配置
      await prisma.lLMConfig.update({
        where: { id: parseInt(id) },
        data: { isActive: true }
      })
    }

    return NextResponse.json({
      success: true,
      message: '配置更新成功'
    })
  } catch (error) {
    console.error('更新 LLM 配置失败:', error)
    return NextResponse.json(
      { success: false, error: '更新失败，请稍后重试' },
      { status: 500 }
    )
  }
}
