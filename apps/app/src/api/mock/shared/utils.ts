/**
 * Mock 工具函数集合
 * 提供通用的数据生成、响应处理等工具函数
 */

import {
  createPaginationResponse,
  DATE_TIME_FORMAT,
  delay,
  formatDateTime,
  generateAddress,
  generateAmount,
  generateBusinessId,
  generateChineseName,
  generateId,
  generatePhoneNumber,
  generatePriority,
  generateRealisticTitle,
  generateStatus,
  generateTimeRange,
  randomDelay,
  stripHtmlTags,
} from '../../../../server/shared/runtime/common-utils'
import { errorResponse, successResponse } from '../../../../server/shared/runtime/response-builder'

export {
  createPaginationResponse,
  DATE_TIME_FORMAT,
  delay,
  errorResponse,
  formatDateTime,
  generateAddress,
  generateAmount,
  generateBusinessId,
  generateChineseName,
  generateId,
  generatePhoneNumber,
  generatePriority,
  generateRealisticTitle,
  generateStatus,
  generateTimeRange,
  randomDelay,
  stripHtmlTags,
  successResponse,
}

/**
 * 仅用于在 `*.mock.ts` 文件内使用。
 * @description
 * FIXME: 在 `*.mock.ts` 文件内使用 `ResultEnum` 枚举，会导致项目启动失败。
 * 故不得不提供字面量版本的对象，规避这个问题。
 */
export const ResultEnumMap = {
  Success: '0',
  Error: '400',
  Unauthorized: '401',
  Forbidden: '403',
  NotFound: '404',
  MethodNotAllowed: '405',
  RequestTimeout: '408',
  InternalServerError: '500',
  NotImplemented: '501',
  BadGateway: '502',
  ServiceUnavailable: '503',
  GatewayTimeout: '504',
  HttpVersionNotSupported: '505',
}

/**
 * 自定义 Mock 定义函数，自动添加环境变量前缀。
 * 当前 H5 mock 运行时只应补齐单层代理前缀，
 * 需要与前端请求基址 `/dev-api` 保持一致。
 */
export const defineUniAppMock = createDefineMock((mock) => {
  const prefix = import.meta.env?.VITE_APP_PROXY_PREFIX || ''
  mock.url = prependProxyPrefix(mock.url, prefix)
})

function createDefineMock<T extends { url: string }>(
  transformer: (mock: T) => T | void,
) {
  return (mock: T | T[]) => {
    if (Array.isArray(mock)) {
      return mock.map(item => transformer(item) || item)
    }

    return transformer(mock) || mock
  }
}

/** 为 Vite mock URL 补齐单层代理前缀。 */
function prependProxyPrefix(url: string, prefix: string): string {
  if (!prefix || url.startsWith(prefix)) {
    return url
  }

  return `${prefix}${url}`
}

/** 调试日志 */
export function mockLog(label: string, ...args: any[]) {
  console.log(`馃殌 Mock API [${label}]:`, ...args)
}
