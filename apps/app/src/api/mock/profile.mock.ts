/**
 * 我的模块 Mock 接口。
 */

import type { AttendanceDayRecord, CommunityInfo, ProfileInfo } from '../../types/profile'
import { defineUniAppMock, errorResponse, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

/** 当前登录员工 mock 信息。 */
const profileInfo: ProfileInfo = {
  userId: 'STAFF_001',
  userName: '王小明',
  storeId: 'STORE_001',
  storeName: '阳光物业服务中心',
  avatar: 'https://picsum.photos/seed/profile-avatar/240/240',
  currentCommunityId: 'COMM_001',
  currentCommunityName: '阳光花园小区',
  version: 'V1.6',
}

/** 可切换小区 mock 数据。 */
const communityList: CommunityInfo[] = [
  { communityId: 'COMM_001', name: '阳光花园小区', address: '福田区幸福路 88 号' },
  { communityId: 'COMM_002', name: '绿洲新城', address: '南山区绿洲街 66 号' },
  { communityId: 'COMM_003', name: '滨江花园', address: '龙岗区滨江大道 18 号' },
]

export default defineUniAppMock([
  {
    url: '/app/profile.getUserProfile',
    method: ['GET', 'POST'],
    body: () => successResponse(profileInfo, '查询成功'),
  },
  {
    url: '/app/profile.listCommunities',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const keyword = asOptionalString(getRequestParams(context).keyword)
      const communities = keyword
        ? communityList.filter(item => item.name.includes(keyword) || item.address.includes(keyword))
        : communityList

      return successResponse(communities, '查询成功')
    },
  },
  {
    url: '/app/profile.changeCommunity',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const communityId = asOptionalString(context.body?.communityId)
      const target = communityList.find(item => item.communityId === communityId)

      if (!target) {
        return errorResponse('目标小区不存在', '404')
      }

      profileInfo.currentCommunityId = target.communityId
      profileInfo.currentCommunityName = target.name

      return successResponse({ success: true }, '切换成功')
    },
  },
  {
    url: '/app/profile.changePassword',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const oldPwd = asOptionalString(context.body?.oldPwd)
      const newPwd = asOptionalString(context.body?.newPwd)

      if (!oldPwd || !newPwd) {
        return errorResponse('参数不完整', '400')
      }

      return successResponse({ success: true }, '修改成功')
    },
  },
  {
    url: '/app/profile.listAttendanceRecords',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const month = asOptionalString(getRequestParams(context).month) || new Date().toISOString().slice(0, 7)

      return successResponse(createAttendanceRecords(month), '查询成功')
    },
  },
])

/** 创建当月工作日考勤记录。 */
function createAttendanceRecords(month: string): AttendanceDayRecord[] {
  const [year, monthValue] = month.split('-').map(Number)
  const days = Number.isFinite(year) && Number.isFinite(monthValue)
    ? new Date(year, monthValue, 0).getDate()
    : 30
  const records: AttendanceDayRecord[] = []

  for (let day = 1; day <= days; day += 1) {
    const date = new Date(year || 2026, (monthValue || 6) - 1, day)
    const week = date.getDay()
    if (week === 0 || week === 6) {
      continue
    }

    records.push({
      taskDay: day,
      attendanceClassesTaskDetails: [
        {
          specCd: '1001',
          checkTime: date.setHours(9, day % 3, 0, 0),
          state: '1200',
          stateName: '正常',
        },
        {
          specCd: '2002',
          checkTime: date.setHours(18, day % 5, 0, 0),
          state: '1200',
          stateName: '正常',
        },
      ],
    })
  }

  return records
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
