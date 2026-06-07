/**
 * Mock 工具函数集合
 * 提供通用的数据生成、响应处理等工具函数
 */

import type { ApiResponse, PaginationResponse, PriorityType } from '../../../types/api'
import dayjs from 'dayjs'

/** 统一的日期时间格式。 */
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

/** 统一的日期时间格式化。 */
export function formatDateTime(value: dayjs.ConfigType = dayjs()): string {
  return dayjs(value).format(DATE_TIME_FORMAT)
}

/** 模拟请求延迟。 */
export function delay(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** 生成随机延迟。 */
export function randomDelay(min: number = 200, max: number = 800): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min
  return delay(ms)
}

/** 创建分页响应结构。 */
export function createPaginationResponse<T>(
  data: T[],
  page: number = 1,
  pageSize: number = 10,
): PaginationResponse<T> {
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return {
    list: data.slice(start, end),
    total: data.length,
    page,
    pageSize,
    hasMore: end < data.length,
  }
}

/** 生成随机 ID。 */
export function generateId(prefix: string = 'ID'): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).slice(2, 8)

  return `${prefix}_${timestamp}_${random}`.toUpperCase()
}

/** 生成业务编号。 */
export function generateBusinessId(prefix: string = 'BIZ'): string {
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')

  return `${prefix}${dayjs().format('YYYYMMDDHHmmss')}${random}`
}

/** 生成随机中文姓名。 */
export function generateChineseName(): string {
  const surnames = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴']
  const names = ['伟', '芳', '娜', '敏', '静', '强', '磊', '军', '洋', '艳']

  return `${generateStatus(surnames)}${generateStatus(names)}`
}

/** 生成随机手机号。 */
export function generatePhoneNumber(): string {
  const prefixes = ['130', '131', '132', '133', '135', '136', '137', '138', '139', '150', '151', '152', '157', '158', '159', '180', '181', '182', '186', '188']
  const prefix = generateStatus(prefixes)
  const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')

  return `${prefix}${suffix}`
}

/** 生成随机地址。 */
export function generateAddress(): string {
  const building = Math.floor(Math.random() * 20) + 1
  const floor = (Math.floor(Math.random() * 30) + 1).toString().padStart(2, '0')
  const unit = generateStatus(['A', 'B', 'C', 'D', 'E', 'F'])

  return `${building}栋${floor}${unit}室`
}

/** 生成随机时间范围。 */
export function generateTimeRange(startDaysFromNow: number = -30, endDaysFromNow: number = 30): string {
  const startTime = Date.now() + startDaysFromNow * 24 * 60 * 60 * 1000
  const endTime = Date.now() + endDaysFromNow * 24 * 60 * 60 * 1000
  const randomTime = startTime + Math.random() * (endTime - startTime)

  return formatDateTime(randomTime)
}

/** 生成随机金额。 */
export function generateAmount(min: number = 10, max: number = 1000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** 生成随机状态。 */
export function generateStatus<T extends string>(statuses: T[]): T {
  return statuses[Math.floor(Math.random() * statuses.length)]
}

/** 生成随机优先级。 */
export function generatePriority(): PriorityType {
  return generateStatus(['HIGH', 'MEDIUM', 'LOW'])
}

/** 清理 HTML 标签。 */
export function stripHtmlTags(html: string, maxLength: number = 120): string {
  if (!html) {
    return ''
  }

  const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()

  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength).trim()}...`
}

/** 生成更真实的活动标题。 */
export function generateRealisticTitle(category: string, index: number): string {
  const titleTemplates: Record<string, string[]> = {
    health: ['春季健身操培训班', '社区太极拳晨练', '健康体检义诊活动'],
    family: ['亲子手工制作坊', '家庭趣味运动会', '少儿绘画比赛'],
    culture: ['诗歌朗诵分享会', '书法展览开幕式', '传统文化知识竞赛'],
    environment: ['垃圾分类知识讲座', '绿色出行倡导活动', '社区植树护绿'],
    safety: ['消防安全演练', '防诈骗知识宣传', '急救技能培训'],
    social: ['邻里见面交流会', '新业主欢迎会', '社区议事协商'],
    festival: ['春节联欢晚会', '端午节包粽子', '中秋赏月活动'],
    volunteer: ['爱心助老服务', '社区清洁志愿', '图书整理活动'],
  }
  const templates = titleTemplates[category] || ['社区活动']
  const suffixes = [`（第${index}期）`, '', ' - 报名中', '（限额招募）']

  return `${generateStatus(templates)}${generateStatus(suffixes)}`
}

/** 构造共享成功响应。 */
export function successResponse<T>(data: T, message: string = '操作成功'): ApiResponse<T> {
  return {
    success: true,
    code: ResultEnumMap.Success,
    message,
    data,
    timestamp: Date.now(),
  }
}

/** 构造共享失败响应。 */
export function errorResponse(message: string = '操作失败', code: string = ResultEnumMap.InternalServerError): ApiResponse<null> {
  return {
    success: false,
    code,
    message,
    data: null,
    timestamp: Date.now(),
  }
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

function createDefineMock(
  transformer: <T extends { url: string }>(mock: T) => T | void,
) {
  function defineMock<T extends { url: string }>(mock: T): T
  function defineMock<T extends { url: string }>(mock: T[]): T[]
  function defineMock<T extends { url: string }>(mock: T | T[]) {
    if (Array.isArray(mock)) {
      return mock.map(item => transformer(item) || item)
    }

    return transformer(mock) || mock
  }

  return defineMock
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
