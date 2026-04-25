/**
 * 用户相关工具函数
 * 提供用户信息和小区信息的获取方法
 */

export interface UserInfo {
  userId: string
  userName: string
  storeId: string
  storeName?: string
  tel?: string
  [key: string]: any
}

export interface CommunityInfo {
  communityId: string
  communityName: string
  [key: string]: any
}

/**
 * 获取当前用户信息
 * @example getUserInfo()
 */
export function getUserInfo(): UserInfo {
  // TODO: 从本地存储或状态管理中获取用户信息
  // 当前返回模拟数据
  return {
    userId: 'USER_001',
    userName: '测试员工',
    storeId: 'STORE_001',
    storeName: '物业公司',
    tel: '13800138000',
  }
}

/**
 * 获取当前小区信息
 * @example getCurrentCommunity()
 */
export function getCurrentCommunity(): CommunityInfo {
  // TODO: 从本地存储或状态管理中获取小区信息
  // 当前返回模拟数据
  return {
    communityId: 'COMM_001',
    communityName: '测试小区',
  }
}

/**
 * 设置用户信息
 * @example setUserInfo({ userId: 'USER_001', userName: '张三' })
 */
export function setUserInfo(userInfo: UserInfo): void {
  // TODO: 保存到本地存储或状态管理
  uni.setStorageSync('userInfo', userInfo)
}

/**
 * 设置当前小区信息
 * @example setCurrentCommunity({ communityId: 'COMM_001', communityName: '阳光小区' })
 */
export function setCurrentCommunity(community: CommunityInfo): void {
  // TODO: 保存到本地存储或状态管理
  uni.setStorageSync('currentCommunity', community)
}

/**
 * 清除用户信息
 * @example clearUserInfo()
 */
export function clearUserInfo(): void {
  uni.removeStorageSync('userInfo')
  uni.removeStorageSync('currentCommunity')
}
