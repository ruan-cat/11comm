import type { AttendanceDayRecord, CommunityInfo, ProfileInfo } from '../../../src/types/profile.ts'
import dayjs from 'dayjs'

export interface ProfileModuleRepository {
  changeCommunity: (communityId: string) => boolean
  changePassword: (oldPwd: string, newPwd: string) => boolean
  getProfile: () => ProfileInfo
  listAttendanceRecords: (month: string) => AttendanceDayRecord[]
  listCommunities: (keyword?: string) => CommunityInfo[]
}

/** 创建 `profile` 模块的 mock 内存仓库。 */
export function createProfileMockRepository(): ProfileModuleRepository {
  const profile: ProfileInfo = {
    userId: 'STAFF_001',
    userName: '王小明',
    storeId: 'STORE_001',
    storeName: '阳光物业服务中心',
    avatar: 'https://picsum.photos/seed/profile-avatar/240/240',
    currentCommunityId: 'COMM_001',
    currentCommunityName: '阳光花园',
    version: 'V1.6',
  }

  const communities: CommunityInfo[] = [
    { communityId: 'COMM_001', name: '阳光花园', address: '福田区幸福路 88 号' },
    { communityId: 'COMM_002', name: '海棠湾小区', address: '南山区海棠街 66 号' },
    { communityId: 'COMM_003', name: '青云里', address: '龙岗区青云大街 18 号' },
    { communityId: 'COMM_004', name: '锦绣雅苑', address: '宝安区锦绣路 108 号' },
    { communityId: 'COMM_005', name: '和谐家园', address: '龙华区和平路 38 号' },
  ]

  return {
    changeCommunity(communityId) {
      const target = communities.find(item => item.communityId === communityId)
      if (!target) {
        return false
      }

      profile.currentCommunityId = target.communityId
      profile.currentCommunityName = target.name
      return true
    },
    changePassword(oldPwd, newPwd) {
      return Boolean(oldPwd && newPwd)
    },
    getProfile() {
      return profile
    },
    listAttendanceRecords(month) {
      return createAttendanceRecords(month)
    },
    listCommunities(keyword) {
      const searchKeyword = keyword?.trim()
      return searchKeyword
        ? communities.filter(item => item.name.includes(searchKeyword))
        : communities
    },
  }
}

/** 导出默认的 profile mock 仓库实例。 */
export const profileMockRepository = createProfileMockRepository()

function createAttendanceRecords(month: string): AttendanceDayRecord[] {
  const start = dayjs(`${month}-01`)
  const days = start.daysInMonth()
  const records: AttendanceDayRecord[] = []

  for (let day = 1; day <= days; day += 1) {
    const date = start.date(day)
    const week = date.day()
    if (week === 0 || week === 6) {
      continue
    }

    const workStart = date.hour(8).minute(57 + (day % 3)).second(0).valueOf()
    const workEnd = date.hour(18).minute(2 + (day % 4)).second(0).valueOf()

    records.push({
      taskDay: day,
      attendanceClassesTaskDetails: [
        {
          specCd: '1001',
          checkTime: workStart,
          state: '1200',
          stateName: '正常',
        },
        {
          specCd: '2002',
          checkTime: workEnd,
          state: '1200',
          stateName: '正常',
        },
      ],
    })
  }

  return records
}
