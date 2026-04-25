/**
 * 员工通讯录类型定义
 * 从 Vue2 项目迁移到 Vue3 + TypeScript
 */

import type { PaginationParams } from './api'

/** 用户信息（替代原项目的 java110Context.getUserInfo() 返回的数据） */
export interface UserInfo {
  userId: string
  userName: string
  storeId: string
  token: string
  communityId?: string
  communityName?: string
  roles?: string[]
  privileges?: string[]
}

/** 员工信息接口 */
export interface Staff {
  id: string
  name: string
  tel: string
  orgName: string
  initials: string
  position?: string
  email?: string
  avatar?: string
  isOnline?: boolean
}

/** 按字母分组的员工列表 */
export interface StaffGroup {
  initials: string
  staffs: Staff[]
}

/** 员工查询参数 */
export interface StaffQueryParams extends PaginationParams {
  name?: string
  orgName?: string
  initials?: string
  storeId?: string
}

/** 员工列表响应 */
export interface StaffListResponse {
  staffs: Staff[]
  total: number
  page: number
  row: number
}

/** 字母索引触摸事件参数 */
export interface IndexTouchEvent {
  touches: Touch[]
  target?: {
    id?: string
  }
}

/** 索引栏位置信息 */
export interface IndexBarPosition {
  boxTop: number
  barTop: number
  barHeight?: number
}
