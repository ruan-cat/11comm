import type { ApiResponse } from '../../../src/types/api.ts'
import { ResultEnum } from '../../../src/http/tools/enum.ts'

/** 构造共享成功响应。 */
export function successResponse<T>(data: T, message: string = '操作成功'): ApiResponse<T> {
  return {
    success: true,
    code: String(ResultEnum.Success),
    message,
    data,
    timestamp: Date.now(),
  }
}

/** 构造共享失败响应。 */
export function errorResponse(message: string = '操作失败', code?: string): ApiResponse<null> {
  return {
    success: false,
    code: code || String(ResultEnum.InternalServerError),
    message,
    data: null,
    timestamp: Date.now(),
  }
}
