import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function postbuild() {
  console.log('🚀 开始构建后处理...')

  try {
    console.log('📦 推送数据库 schema...')
    await execAsync('npx prisma db push --skip-generate')
    console.log('✅ 数据库 schema 推送成功')

    console.log('🌱 运行种子数据...')
    await execAsync('DATABASE_URL="file:./dev.db" npx tsx prisma/seed.ts')
    console.log('✅ 种子数据运行成功')

    console.log('🎉 构建后处理完成！')
  } catch (error) {
    console.error('❌ 构建后处理失败:', error)
    process.exit(1)
  }
}

postbuild()
