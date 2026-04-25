/**
 * Mock 工具类型定义
 * 用于Mock数据生成和API模拟的通用工具类型
 */

import type { ApiResponse } from '@/types/api'

/** Mock 请求上下文 */
export interface MockRequestContext {
  query: Record<string, any>
  body: Record<string, any>
  headers: Record<string, string>
  method: string
  url: string
}

/** Mock 响应选项 */
export interface MockResponseOptions {
  status?: number
  statusText?: string
  headers?: Record<string, string>
  delay?: number | [number, number]
}

/** Mock 处理器函数 */
export type MockHandler<T = any> = (context: MockRequestContext) => Promise<ApiResponse<T>> | ApiResponse<T>
