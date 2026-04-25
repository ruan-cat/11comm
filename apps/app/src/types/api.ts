/**
 * API 通用类型定义
 * 包含所有业务模块共享的通用类型和接口
 */

/** ========== 通用响应类型 ========== */

/** 通用API响应结构 */
export interface ApiResponse<T = any> {
  success: boolean
  code: string
  message: string
  data: T
  timestamp: number
}

/** ========== 分页相关类型 ========== */

/** 分页请求参数 */
export interface PaginationParams {
  page: number
  row: number
}

/** 分页响应结构 */
export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

/** ========== 通用枚举类型 ========== */

/** 状态枚举 */
export type StatusType = '0' | '1'

/** 优先级枚举 */
export type PriorityType = 'HIGH' | 'MEDIUM' | 'LOW'
