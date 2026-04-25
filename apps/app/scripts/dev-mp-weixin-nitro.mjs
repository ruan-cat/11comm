import { spawn } from 'node:child_process'
import process from 'node:process'

/**
 * 微信小程序 Nitro 联调脚本。
 *
 * 设计目的：
 * 1. 明确表达“小程序开发必须先有可访问的 Nitro 服务”这一前置条件。
 * 2. 把“先起 Nitro，再起 uni 编译链”的串行依赖固化成仓库脚本，而不是靠人工记忆。
 * 3. 让未来阅读者快速理解：这里解决的是 orchestration 问题，而不是业务接口本身。
 */

/** 独立 Nitro 服务的健康检查地址，用于串行启动与复用判断。 */
const healthUrl = 'http://127.0.0.1:3101/__nitro/health'

/** 当前脚本拉起的所有子进程集合，统一用于信号清理。 */
const children = new Set()

/**
 * 启动入口。
 *
 * 小程序链路和 H5 不同，这里没有 `nitro/vite` 的单进程目标，
 * 当前阶段的设计就是明确串行：
 * 1. 先确保 Nitro 服务可用。
 * 2. 再启动 `uni -p mp-weixin --mode development-nitro-api`。
 * 3. 任一关键进程退出都视为本次联调结束。
 */
async function main() {
  const nitroProcess = await ensureNitroServer()
  const uniProcess = startChild('pnpm', ['exec', 'uni', '-p', 'mp-weixin', '--mode', 'development-nitro-api'])
  const pending = [waitForExit(uniProcess, 'Uni')]

  if (nitroProcess) {
    pending.push(waitForExit(nitroProcess, 'Nitro'))
  }

  await Promise.race(pending)
}

/**
 * 启动一个受当前脚本托管的子进程。
 *
 * 设计理由与 H5 脚本一致：
 * 1. 保留原始 stdout / stderr 便于定位 uni 或 Nitro 的真实错误。
 * 2. Windows 下启用 `shell: true`，避免 `pnpm` 在不同终端里的兼容性问题。
 * 3. 把所有子进程登记进集合，便于统一清理。
 */
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

/**
 * 确保 Nitro 服务存在且可用。
 *
 * 设计要点：
 * 1. 优先复用已经健康的 Nitro，避免脚本二次启动造成端口冲突。
 * 2. 如果没有现成 Nitro，则由脚本自己拉起并等待健康检查通过。
 * 3. 返回 `null` 表示当前脚本没有创建 Nitro 进程，只是在复用外部环境。
 */
async function ensureNitroServer() {
  if (await isHealthyNitro(healthUrl)) {
    console.warn('[dev:mp-weixin:nitro] Reusing the existing Nitro server on port 3101.')
    return null
  }

  const nitroProcess = startChild('pnpm', ['exec', 'cross-env', 'NITRO_BUILDER=rollup', 'NITRO_APP_MODE=development-nitro-api', 'nitro', 'dev'])
  await waitForNitro(healthUrl, nitroProcess)
  return nitroProcess
}

/**
 * 轮询等待 Nitro 进入健康状态。
 *
 * 这是小程序链路最关键的同步点：
 * 如果不等 Nitro ready 就直接进入 uni 编译链，
 * 小程序页面一打开就会遇到接口不可用或首轮请求失败。
 */
async function waitForNitro(url, nitroProcess) {
  const startedAt = Date.now()
  const timeoutMs = 30_000

  while (Date.now() - startedAt < timeoutMs) {
    if (nitroProcess.exitCode !== null) {
      throw new Error('Nitro dev exited before health check passed')
    }

    if (await isHealthyNitro(url)) {
      return
    }

    await sleep(500)
  }

  throw new Error(`Timed out waiting for Nitro health endpoint: ${url}`)
}

/**
 * 检查当前地址上是否已有健康的 Nitro。
 *
 * 这份判断既用于端口复用，也用于 readiness probe，
 * 避免两套逻辑在未来演化时出现行为漂移。
 */
async function isHealthyNitro(url) {
  try {
    const response = await fetch(url)
    return response.ok
  }
  catch {
    return false
  }
}

/**
 * 等待子进程退出，并把非 0 退出码提升为显式错误。
 *
 * 小程序联调脚本本质上是一个编排器，因此对退出码必须严格：
 * 只要 Nitro 或 uni 任一侧失败，整次会话都应该失败，而不是假装还能继续。
 */
async function waitForExit(child, label) {
  const exitCode = await new Promise((resolve) => {
    child.on('exit', code => resolve(code ?? 0))
  })

  if (exitCode !== 0) {
    throw new Error(`${label} exited with code ${exitCode}`)
  }
}

/** 简单休眠工具，专用于健康检查轮询。 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 向当前脚本拥有的所有子进程转发退出信号。
 *
 * 这里采用整组会话统一结束的策略，
 * 因为小程序端与 Nitro 后端在开发时是强耦合联调关系，不适合留下半残状态。
 */
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
