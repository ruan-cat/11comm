/**
 * 用户模块类型定义
 */

/** 用户信息 */
export interface User {
  userId: string
  username: string
  nickname?: string
  avatar?: string
  phone: string
  email?: string
  realName?: string
  idCard?: string
  communityId: string
  buildingInfo?: {
    building: string
    unit: string
    room: string
  }
  userType: 'OWNER' | 'TENANT' | 'PROPERTY_STAFF' | 'ADMIN'
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
  createTime: string
  updateTime: string
  lastLoginTime?: string
}

/** 登录请求 */
export interface LoginReq {
  username: string
  password: string
  captcha?: string
  remember?: boolean
}

/** 登录响应 */
export interface LoginResponse {
  user: User
  token: string
  refreshToken?: string
  expiresIn: number
}
