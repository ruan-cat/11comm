// 修复背景：https://github.com/unibest-tech/unibest/issues/219
//
// 这个 loader 只解决一个历史故障：Windows 本地执行 build:h5:prod 时，
// uni-app/Vite 构建链会动态 import `D:\...` 这类绝对路径；较新的 Node ESM
// 会把盘符 `D:` 当成 URL scheme，进而抛出 ERR_UNSUPPORTED_ESM_URL_SCHEME。
//
// 决策边界：这里只做 Windows 盘符路径 -> file:// URL 的最小转换。
// Linux/Vercel CI 不需要这层兼容，也不能让它影响默认 ESM 解析和产物搬运链路。

import { pathToFileURL } from 'node:url'

// loader 本身也做平台保护，防止被误注册到非 Windows 环境后改变解析行为。
// eslint-disable-next-line node/prefer-global/process -- platform detection in loader
const isWindows = typeof process !== 'undefined' ? process.platform === 'win32' : false

/**
 * Node ESM resolve hook。
 * 只把 Windows 绝对路径转换为 file:// URL，其他 specifier 全部交回默认解析。
 */
export function resolve(specifier, context, defaultResolve) {
  // 非 Windows 环境直接 no-op，避免再次混淆 Vercel 构建输出目录问题。
  if (!isWindows) {
    return defaultResolve(specifier, context, defaultResolve)
  }

  // Node 默认 ESM 不接受裸 `C:\...` / `C:/...`，必须先转成 file:// URL。
  if (specifier.match(/^[a-z]:\\/i) || specifier.match(/^[a-z]:\//i)) {
    const fileUrl = pathToFileURL(specifier).href
    return defaultResolve(fileUrl, context, defaultResolve)
  }

  // 其他包名、相对路径、URL 都不改，降低对 uni/Vite 默认行为的影响面。
  return defaultResolve(specifier, context, defaultResolve)
}

/**
 * Load hook for ESM loader
 */
export function load(url, context, defaultLoad) {
  return defaultLoad(url, context, defaultLoad)
}
