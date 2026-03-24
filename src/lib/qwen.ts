import { prisma } from '@/lib/prisma'

export interface QwenMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface QwenImage {
  url: string
}

export interface ScoringResult {
  image_quality: { score: number; reason: string }
  relevance: { score: number; reason: string }
  informativeness: { score: number; reason: string }
  authenticity: { score: number; reason: string }
  professionalism: { score: number; reason: string }
  total_score: number
  suggestion: string
}

export async function getActiveLLMConfig() {
  const config = await prisma.lLMConfig.findFirst({
    where: { isActive: true }
  })

  if (!config) {
    throw new Error('未找到活跃的 LLM 配置，请先在 LLM 设置页面配置 API Key')
  }

  return config
}

export async function callQwenAPI(
  prompt: string,
  images?: QwenImage[]
): Promise<ScoringResult> {
  const config = await getActiveLLMConfig()

  const messages: QwenMessage[] = [
    {
      role: 'system',
      content: '你是一位专业的评价质量评估专家，擅长从多个维度评价用户生成的内容质量。请严格按照 JSON 格式返回评分结果。'
    },
    {
      role: 'user',
      content: prompt
    }
  ]

  const payload: any = {
    model: config.modelName,
    input: {
      messages
    },
    parameters: {
      temperature: config.temperature || 0.7,
      max_tokens: config.maxTokens || 2000,
      result_format: 'json'
    }
  }

  // 如果有图片，添加到输入中
  if (images && images.length > 0) {
    payload.input.images = images.map(img => img.url)
  }

  try {
    const response = await fetch(config.apiEndpoint || 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Qwen API 调用失败：${response.status} ${errorText}`)
    }

    const data = await response.json()
    
    // 解析返回结果
    const content = data.output?.choices?.[0]?.message?.content
    if (!content) {
      throw new Error('Qwen API 返回结果为空')
    }

    // 尝试解析 JSON
    try {
      const result = JSON.parse(content) as ScoringResult
      return result
    } catch (parseError) {
      console.error('解析评分结果失败:', parseError)
      throw new Error('评分结果格式错误，无法解析')
    }
  } catch (error) {
    console.error('调用 Qwen API 失败:', error)
    throw error
  }
}

export function buildPrompt(
  template: string,
  variables: Record<string, string>
): string {
  let prompt = template
  
  Object.entries(variables).forEach(([key, value]) => {
    prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value)
  })
  
  return prompt
}

export async function scoreReview(
  reviewText: string,
  imageUrls: string[],
  productName: string,
  productCategory: string,
  promptTemplate: string
): Promise<ScoringResult> {
  const images: QwenImage[] = imageUrls.map(url => ({ url }))
  
  const prompt = buildPrompt(promptTemplate, {
    product_name: productName,
    product_category: productCategory,
    review_text: reviewText,
    review_images: imageUrls.join(', ')
  })

  return await callQwenAPI(prompt, images)
}
