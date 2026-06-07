import { spawn } from 'node:child_process'
import process from 'node:process'

const apiHealthUrl = process.env.PHASE7_API_HEALTH_URL || 'http://127.0.0.1:3102/__nitro/health'
const children = new Set()

/**
 * app 内置 Nitro 已退役；该脚本只编排独立 apps/api 与微信小程序前端。
 * 统一 API 不再依赖 apps/app/server，便于后续执行目录 dry-run 删除检查。
 */
async function main() {
  if (process.argv.includes('--dry-run')) {
    console.log(`reuse-or-start-api: ${apiHealthUrl}`)
    console.log('api command: pnpm -F @01s-11comm/api dev')
    console.log('frontend command: pnpm -F @01s-11comm/app dev:mp-weixin')
    return
  }

  const apiProcess = await ensureUnifiedApi()
  const uniProcess = startChild('pnpm', ['-F', '@01s-11comm/app', 'run', 'dev:mp-weixin'])
  const pending = [waitForExit(uniProcess, 'App mp-weixin')]

  if (apiProcess) {
    pending.push(waitForExit(apiProcess, 'Unified API'))
  }

  await Promise.race(pending)
}

async function ensureUnifiedApi() {
  if (await isHealthyApi()) {
    console.warn(`[dev:mp-weixin:nitro] 复用已经健康的统一 API：${apiHealthUrl}`)
    return null
  }

  const apiProcess = startChild('pnpm', ['-F', '@01s-11comm/api', 'run', 'dev'])
  await waitForApi(apiProcess)
  return apiProcess
}

function startChild(command, args) {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  children.add(child)
  child.on('exit', () => {
    children.delete(child)
  })

  return child
}

async function waitForApi(apiProcess) {
  const startedAt = Date.now()
  const timeoutMs = 30_000

  while (Date.now() - startedAt < timeoutMs) {
    if (apiProcess.exitCode !== null) {
      throw new Error('Unified API exited before health check passed')
    }

    if (await isHealthyApi()) {
      return
    }

    await sleep(500)
  }

  throw new Error(`Timed out waiting for unified API health endpoint: ${apiHealthUrl}`)
}

async function isHealthyApi() {
  try {
    const response = await fetch(apiHealthUrl)
    return response.ok
  }
  catch {
    return false
  }
}

async function waitForExit(child, label) {
  const exitCode = await new Promise((resolve) => {
    child.on('exit', code => resolve(code ?? 0))
  })

  if (exitCode !== 0) {
    throw new Error(`${label} exited with code ${exitCode}`)
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function shutdown(signal) {
  for (const child of children) {
    child.kill(signal)
  }
}

process.on('SIGINT', () => {
  shutdown('SIGINT')
  process.exit(130)
})

process.on('SIGTERM', () => {
  shutdown('SIGTERM')
  process.exit(143)
})

main().catch((error) => {
  console.error(error)
  shutdown('SIGTERM')
  process.exit(1)
})
