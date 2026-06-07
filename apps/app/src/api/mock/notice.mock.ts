/**
 * 公告模块 Mock 接口。
 */

import type { NoticeItem } from '../../types/notice'
import { defineUniAppMock, formatDateTime, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

/** 公告 mock 数据。 */
const noticeMockData: NoticeItem[] = createNoticeMockData()

export default defineUniAppMock([
  {
    url: '/app/notice.listNotices',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const page = asPositiveNumber(params.page, 1)
      const row = asPositiveNumber(params.row, 10)
      const communityId = asOptionalString(params.communityId)
      const noticeTypeCd = asOptionalString(params.noticeTypeCd)
      const noticeId = asOptionalString(params.noticeId)
      const titleLike = asOptionalString(params.titleLike)
      const notices = noticeMockData
        .filter(item => !communityId || item.communityId === communityId)
        .filter(item => !noticeTypeCd || item.noticeTypeCd === noticeTypeCd)
        .filter(item => !noticeId || item.noticeId === noticeId)
        .filter(item => !titleLike || item.title.includes(titleLike))
      const start = (page - 1) * row

      return successResponse({
        notices: notices.slice(start, start + row),
        total: notices.length,
        page,
        row,
      }, '查询成功')
    },
  },
])

/** 生成公告列表数据。 */
function createNoticeMockData(): NoticeItem[] {
  const titles = [
    '关于电梯维护检修的通知',
    '春节期间物业服务安排公告',
    '消防安全巡检工作提醒',
    '地下车库照明升级施工通知',
    '垃圾分类专项整治行动公告',
    '社区便民服务日活动预告',
  ]

  return Array.from({ length: 18 }, (_, index) => {
    const title = titles[index % titles.length]
    const timestamp = Date.now() - index * 86400000

    return {
      noticeId: `NOTICE_${(index + 1).toString().padStart(4, '0')}`,
      title: `${title}${index < 4 ? '（重要）' : ''}`,
      context: `<p>${title}，请各位业主知悉并配合相关工作安排。</p>`,
      startTime: formatDateTime(timestamp),
      timeStr: formatDateTime(timestamp),
      noticeTypeCd: index % 5 === 0 ? '1002' : '1001',
      communityId: 'COMM_001',
    }
  })
}

/** 合并 Vite mock 的 query、body 与 params。 */
function getRequestParams(context: MockContext): Record<string, unknown> {
  return {
    ...(context.query || {}),
    ...(context.body || {}),
    ...(context.params || {}),
  }
}

/** 将未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}

/** 将未知值收敛为正数。 */
function asPositiveNumber(value: unknown, fallback: number): number {
  const numberValue = Number(asOptionalString(value))

  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : fallback
}
