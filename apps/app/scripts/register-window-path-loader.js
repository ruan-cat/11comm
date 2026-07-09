import { register } from 'node:module'
import process from 'node:process'

// build:h5:prod 通过 `node --import` 先加载本文件，再启动 uni 构建。
// 这里不用 `--experimental-loader`，因为它会产生 Node experimental warning；
// 历史上该入口也曾和 Vercel 输出目录搬运问题混在一起被反复回退。
//
// 当前决策是“按平台注册”：只在 Windows 本地注册 window-path-loader，修复
// `D:\...` 绝对路径被 Node ESM 误判为 unsupported URL scheme 的故障；
// Linux/Vercel CI 不注册 loader，保持默认解析，避免影响线上静态产物链路。
if (process.platform === 'win32') {
  register('./window-path-loader.js', import.meta.url)
}
