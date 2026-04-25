import { spawn } from 'node:child_process'
import process from 'node:process'

/**
 * H5 Nitro 联调脚本。
 *
 * 设计目的：
 * 1. 在当前仓库里提供 `dev:h5:nitro` 入口，让 H5 可以切到 Nitro 真实接口运行时。
 * 2. 在未来升级到 Vite 7+ 后，自动切回真正的 `nitro/vite` 全栈模式。
 * 3. 在当前仍停留在 Vite 6 的阶段，稳定回退到“standalone Nitro + H5”双进程联调。
 *
 * 这份脚本的重点不是“把两个命令拼起来”，而是明确表达当前技术栈限制下的兼容策略，
 * 避免以后阅读时误以为这里本来就只能双进程运行。
 */

/** 独立 Nitro 服务的健康检查地址，用于串行启动与复用判断。 */
const healthUrl = 'http://127.0.0.1:3101/__nitro/health'

/** 当前脚本拉起的所有子进程集合，统一用于信号清理。 */
const children = new Set()

/**
 * 启动入口。
 *
 * 设计要点：
 * 1. 先判断当前安装的 Vite 主版本。
 * 2. 若仓库已经升级到 Vite 7+，直接运行真正的 `development-nitro` 模式。
 * 3. 若仍是 Vite 6，则使用当前经过验证的 fallback：先起 standalone Nitro，再起 H5。
 * 4. 使用 `Promise.race` 是为了让任一关键子进程退出时立即暴露问题，而不是静默挂起。
 */
async function main() {
  const viteMajorVersion = await getInstalledViteMajorVersion()

  if (viteMajorVersion >= 7) {
    await runSingleProcess('pnpm', ['exec', 'uni', '--mode', 'development-nitro'])
    return
  }

  console.warn('[dev:h5:nitro] This repo is on Vite 6. Nitro v3 full-stack mode requires Vite 7+, so the command falls back to standalone Nitro + H5.')

  const nitroProcess = await ensureNitroServer()
  const h5Process = startChild('pnpm', ['exec', 'uni', '--mode', 'development-nitro-api'])
  const pending = [waitForExit(h5Process, 'Uni H5')]

  if (nitroProcess) {
    pending.push(waitForExit(nitroProcess, 'Nitro'))
  }

  await Promise.race(pending)
}

/**
 * 读取当前安装的 Vite 主版本。
 *
 * 这里不直接依赖 package.json 中的声明值，而是读取实际安装结果，
 * 这样未来仓库升级 Vite 时，这个脚本可以自动切换行为，不需要再手改条件分支。
 */
async function getInstalledViteMajorVersion() {
  const vitePkg = await import('vite/package.json', { with: { type: 'json' } })
  return Number.parseInt(String(vitePkg.default.version).split('.')[0] || '0', 10)
}

/**
 * 启动一个受当前脚本托管的子进程。
 *
 * 设计要点：
 * 1. `stdio: 'inherit'` 让用户能直接看到 Nitro 与 uni 的原始日志。
 * 2. Windows 下保留 `shell: true`，避免 `pnpm` 命令在 PowerShell / cmd 环境中行为不一致。
 * 3. 所有子进程都要登记到 `children`，这样脚本异常退出时可以统一回收。
 */
function startChild(command, args, extraEnv = {}) {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      ...extraEnv,
    },
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
 * 运行单个命令并等待它完成。
 *
 * 这个分支主要服务于未来的 Vite 7+ 真正全栈模式，
 * 当不再需要 dual-process fallback 时，可以复用同一套退出码处理逻辑。
 */
async function runSingleProcess(command, args) {
  const child = startChild(command, args)
  await waitForExit(child, args.join(' '))
}

/**
 * 确保 Nitro 服务存在且可用。
 *
 * 设计要点：
 * 1. 如果 3101 上已经有健康的 Nitro，直接复用，避免重复拉起导致端口冲突。
 * 2. 如果没有现成 Nitro，再由当前脚本负责创建并等待健康检查通过。
 * 3. 返回 `null` 表示“本脚本没有拥有 Nitro 进程”，后续退出时也就不应该尝试管理它。
 */
async function ensureNitroServer() {
  if (await isHealthyNitro(healthUrl)) {
    console.warn('[dev:h5:nitro] Reusing the existing Nitro server on port 3101.')
    return null
  }

  const nitroProcess = startChild(
    'pnpm',
    ['exec', 'cross-env', 'NITRO_BUILDER=rollup', 'NITRO_APP_MODE=development-nitro-api', 'nitro', 'dev'],
    {
      NODE_OPTIONS: mergeNodeOptions(process.env.NODE_OPTIONS, '--experimental-strip-types'),
    },
  )
  await waitForNitro(healthUrl, nitroProcess)
  return nitroProcess
}

/**
 * 轮询等待 Nitro 进入健康状态。
 *
 * 这里显式检查 `nitroProcess.exitCode`，是为了区分两种失败：
 * 1. Nitro 还没准备好，只是需要继续等待。
 * 2. Nitro 已经提前崩溃，继续轮询没有意义，应立刻失败。
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
 * 这一步既用于“是否复用已有 Nitro”的判断，也用于新起 Nitro 后的 readiness probe，
 * 保持探测逻辑只维护一份。
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
 * 这里不吞掉失败，是因为这两个开发命令本质上属于 orchestration 脚本，
 * 任何一侧退出异常都意味着当前联调环境已经不可信。
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

/** Ensure the Nitro child process can load TypeScript sources directly under Node 22. */
function mergeNodeOptions(currentValue, requiredFlag) {
  const parts = String(currentValue || '')
    .split(/\s+/u)
    .filter(Boolean)

  if (!parts.includes(requiredFlag)) {
    parts.push(requiredFlag)
  }

  return parts.join(' ')
}

/**
 * 向当前脚本拥有的所有子进程转发退出信号。
 *
 * 这里不区分 Nitro 与 H5，因为对这个 orchestrator 来说，
 * 任一侧停止都意味着整组联调会话应该整体结束。
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
