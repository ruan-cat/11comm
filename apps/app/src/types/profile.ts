/**
 * 我的模块类型定义
 */

/** 个人信息 */
export interface ProfileInfo {
  userId: string
  userName: string
  storeId: string
  storeName: string
  avatar: string
  currentCommunityId: string
  currentCommunityName: string
  version: string
}

/** 小区信息 */
export interface CommunityInfo {
  communityId: string
  name: string
  address: string
}

/** 考勤明细 */
export interface AttendanceDetail {
  specCd: '1001' | '2002'
  checkTime: number
  state: string
  stateName: string
}

/** 某天考勤记录 */
export interface AttendanceDayRecord {
  taskDay: number
  attendanceClassesTaskDetails: AttendanceDetail[]
}

/** 考勤查询参数 */
export interface AttendanceQueryParams {
  month: string
  staffId: string
}
