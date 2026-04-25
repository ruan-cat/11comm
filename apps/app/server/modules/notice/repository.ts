import type { NoticeItem, NoticeListParams, NoticeListResponse } from '../../../src/types/notice.ts'
import dayjs from 'dayjs'
import { formatDateTime } from '../../shared/runtime/common-utils.ts'

export interface NoticeModuleRepository {
  listNotices: (params: NoticeListParams) => NoticeListResponse
}

/** 创建 `notice` 模块的 mock 内存仓库。 */
export function createNoticeMockRepository(): NoticeModuleRepository {
  const notices = createNotices()

  return {
    listNotices(params) {
      let filtered = [...notices]

      if (params.communityId) {
        filtered = filtered.filter(item => item.communityId === String(params.communityId))
      }

      if (params.noticeTypeCd) {
        filtered = filtered.filter(item => item.noticeTypeCd === String(params.noticeTypeCd))
      }

      if (params.noticeId) {
        filtered = filtered.filter(item => item.noticeId === String(params.noticeId))
      }

      if (params.titleLike) {
        const keyword = String(params.titleLike).trim()
        filtered = filtered.filter(item => item.title.includes(keyword))
      }

      const page = Number(params.page) || 1
      const row = Number(params.row) || 10
      const start = (page - 1) * row

      return {
        notices: filtered.slice(start, start + row),
        total: filtered.length,
        page,
        row,
      }
    },
  }
}

/** 导出默认的 notice mock 仓库实例。 */
export const noticeMockRepository = createNoticeMockRepository()

function createNotices(): NoticeItem[] {
  const titles = [
    '关于电梯维护检修的通知',
    '春节期间物业服务安排公告',
    '消防安全巡检工作提醒',
    '地下车库照明升级施工通知',
    '垃圾分类专项整治行动公告',
    '社区便民服务日活动预告',
    '关于供水设施保养的通知',
    '公共区域绿化修剪安排公告',
    '雨季防汛安全提示',
    '社区文明养犬倡议书',
    '物业费缴费提醒公告',
    '夜间噪音治理专项通知',
    '门禁系统升级维护公告',
    '快递驿站服务时间调整通知',
    '小区健身器材检修公告',
  ]

  return Array.from({ length: 36 }, (_, index) => {
    const title = titles[index % titles.length]
    const startTime = dayjs().subtract(index, 'day').hour(9).minute(30).second(0)

    return {
      noticeId: `NOTICE_${(index + 1).toString().padStart(4, '0')}`,
      title: `${title}${index < 8 ? '（重要）' : ''}`,
      context: [
        '<p>尊敬的业主您好：</p>',
        `<p>现发布<strong>${title}</strong>，请各位业主知悉并配合相关工作安排。</p>`,
        '<p>如有疑问，请联系物业服务中心，电话：755-12345678。</p>',
        '<p>感谢您的理解与支持。</p>',
      ].join(''),
      startTime: formatDateTime(startTime),
      timeStr: startTime.format('YYYY-MM-DD HH:mm'),
      noticeTypeCd: '1001',
      communityId: 'COMM_001',
    }
  })
}
