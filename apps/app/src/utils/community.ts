/**
 * 小区相关工具函数
 */

/** 小区信息 */
export interface CommunityInfo {
  communityId: string
  communityName: string
}

/** 获取当前小区信息 */
export function getCurrentCommunity(): CommunityInfo {
  // 从本地存储获取当前小区信息
  try {
    const communityInfo = uni.getStorageSync('currentCommunity')
    if (communityInfo) {
      return JSON.parse(communityInfo)
    }
  }
  catch (error) {
    console.error('获取当前小区信息失败:', error)
  }

  // 返回默认小区信息
  return {
    communityId: '1001',
    communityName: '默认小区',
  }
}

/** 获取当前小区ID */
export function getCurrentCommunityId(): string {
  return getCurrentCommunity().communityId
}

/** 设置当前小区信息 */
export function setCurrentCommunity(community: CommunityInfo): void {
  try {
    uni.setStorageSync('currentCommunity', JSON.stringify(community))
  }
  catch (error) {
    console.error('设置当前小区信息失败:', error)
  }
}
