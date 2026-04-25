/**
 * API 错误处理工具类
 * @description 统一的接口错误提示处理工具，供全局拦截器和组件层使用
 * @see `.claude/skills/api-error-handling.md`
 */
import { useGlobalToast } from '@/hooks/useGlobalToast'

/** 错误级别枚举 */
export enum ErrorLevel {
  /** 致命错误 - 认证过期、服务器宕机 */
  FATAL = 'fatal',
  /** 严重错误 - 权限不足、数据不存在 */
  SEVERE = 'severe',
  /** 一般错误 - 业务逻辑错误、参数错误 */
  NORMAL = 'normal',
  /** 轻微错误 - 网络波动、超时 */
  LIGHT = 'light',
}

/** API 错误信息接口 */
export interface ApiErrorInfo {
  /** 错误级别 */
  level: ErrorLevel
  /** 错误消息 */
  message: string
  /** 错误码（HTTP 状态码或业务错误码） */
  code?: number | string
}

/** 错误处理选项 */
export interface ErrorHandlerOptions {
  /** 是否显示错误提示，默认为 true */
  shouldShowError?: boolean
}

/** HTTP 状态码错误映射表 */
const HTTP_ERROR_MAP: Record<number, { level: ErrorLevel, message: string }> = {
  400: { level: ErrorLevel.NORMAL, message: '请求参数错误' },
  401: { level: ErrorLevel.FATAL, message: '登录已过期，请重新登录' },
  403: { level: ErrorLevel.SEVERE, message: '权限不足，无法访问' },
  404: { level: ErrorLevel.NORMAL, message: '请求的资源不存在' },
  408: { level: ErrorLevel.LIGHT, message: '请求超时，请稍后重试' },
  500: { level: ErrorLevel.SEVERE, message: '服务器内部错误' },
  502: { level: ErrorLevel.LIGHT, message: '网关错误，请稍后重试' },
  503: { level: ErrorLevel.SEVERE, message: '服务暂时不可用' },
  504: { level: ErrorLevel.LIGHT, message: '网关超时，请稍后重试' },
}

/** 默认错误信息 */
const DEFAULT_ERROR: { level: ErrorLevel, message: string } = {
  level: ErrorLevel.NORMAL,
  message: '请求失败，请稍后重试',
}

/**
 * API 错误处理器
 * @description 统一的接口错误提示处理工具，供全局拦截器和组件层使用
 */
export class ApiErrorHandler {
  /**
   * 统一错误处理入口
   * @param error 错误信息对象
   * @param options 错误处理选项
   * @example ApiErrorHandler.handle({ level: ErrorLevel.NORMAL, message: '操作失败' })
   */
  static handle(error: ApiErrorInfo, options: ErrorHandlerOptions = {}): void {
    const { shouldShowError = true } = options

    if (!shouldShowError)
      return

    const toast = useGlobalToast()

    switch (error.level) {
      case ErrorLevel.FATAL:
        this.handleFatalError(error.message, error.code)
        break
      case ErrorLevel.SEVERE:
        toast.error({ msg: error.message, duration: 3000 })
        break
      case ErrorLevel.NORMAL:
        toast.error({ msg: error.message, duration: 2000 })
        break
      case ErrorLevel.LIGHT:
        toast.warning({ msg: error.message, duration: 1500 })
        break
    }
  }

  /**
   * 处理致命错误
   * @param message 错误消息
   * @param code 错误码
   * @description 使用 Modal 弹框，并提供跳转处理
   */
  private static handleFatalError(message: string, code?: number | string): void {
    uni.showModal({
      title: '系统错误',
      content: message,
      showCancel: false,
      success: () => {
        uni.reLaunch({ url: '/pages/index/index' })
      },
    })
  }

  /**
   * 映射 HTTP 状态码到错误信息
   * @param statusCode HTTP 状态码
   * @param originalMessage 原始错误消息（可选，用于覆盖默认消息）
   * @returns 错误信息对象
   * @example const error = ApiErrorHandler.mapStatusCode(404, '用户不存在')
   */
  static mapStatusCode(statusCode: number, originalMessage?: string): ApiErrorInfo {
    const error = HTTP_ERROR_MAP[statusCode] || DEFAULT_ERROR

    return {
      ...error,
      code: statusCode,
      message: originalMessage || error.message,
    }
  }

  /**
   * 映射业务错误码到错误信息
   * @param code 业务错误码
   * @param message 错误消息
   * @returns 错误信息对象
   * @example const error = ApiErrorHandler.mapBusinessCode('1001', '余额不足')
   */
  static mapBusinessCode(code: string | number, message: string): ApiErrorInfo {
    return {
      level: ErrorLevel.NORMAL,
      message,
      code,
    }
  }

  /**
   * 创建网络错误信息
   * @param message 错误消息（可选）
   * @returns 错误信息对象
   * @example const error = ApiErrorHandler.createNetworkError()
   */
  static createNetworkError(message?: string): ApiErrorInfo {
    return {
      level: ErrorLevel.LIGHT,
      message: message || '网络连接异常，请检查网络设置',
      code: 'NETWORK_ERROR',
    }
  }

  /**
   * 创建超时错误信息
   * @param message 错误消息（可选）
   * @returns 错误信息对象
   * @example const error = ApiErrorHandler.createTimeoutError()
   */
  static createTimeoutError(message?: string): ApiErrorInfo {
    return {
      level: ErrorLevel.LIGHT,
      message: message || '请求超时，请稍后重试',
      code: 'TIMEOUT_ERROR',
    }
  }
}
