import process from 'node:process'
import { defineEventHandler } from 'nitro/h3'

/**
 * Nitro 健康检查接口。
 *
 * 设计目的：
 * 1. 供 `dev:h5:nitro` 与 `dev:mp-weixin:nitro` 这类编排脚本轮询 readiness。
 * 2. 供 `dev:nitro`、`preview:nitro` 的烟测统一验证接口服务是否可用。
 * 3. 顺带返回当前运行时与数据源，便于快速判断当前到底处于哪条联调链路。
 */
export default defineEventHandler(() => {
  return {
    status: 'ok',
    runtime: process.env.VITE_API_RUNTIME || 'nitro-standalone',
    dataSource: process.env.NITRO_DATA_SOURCE || 'mock',
    timestamp: Date.now(),
  }
})
