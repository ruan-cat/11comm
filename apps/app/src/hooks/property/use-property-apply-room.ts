/**
 * 房屋申请 Hook
 * 提供房屋申请相关的辅助函数
 */

import type { ApplicationRecord, PropertyApplication } from '@/types/property-application'

/**
 * 从 PropertyApplication 对象提取跟踪记录所需参数
 *
 * @description 用于从完整的申请对象中提取跳转到跟踪记录页面所需的参数
 * @param apply - 房屋申请对象
 * @returns 跟踪记录页面所需的参数对象
 * @example extractApplyRecordParams(applyRoomInfo.value)
 */
export function extractApplyRecordParams(apply: PropertyApplication) {
  return {
    ardId: apply.ardId,
    communityId: apply.communityId,
    roomId: apply.roomId,
    roomName: apply.roomName,
    state: apply.state,
    stateName: apply.stateName,
  }
}

/**
 * 从 ApplicationRecord 对象提取记录详情所需参数
 *
 * @description 用于从申请记录对象中提取跳转到记录详情页面所需的参数
 * @param record - 申请记录对象
 * @param communityId - 小区ID
 * @returns 记录详情页面所需的参数对象
 * @example extractRecordDetailParams(record, communityId)
 */
export function extractRecordDetailParams(record: ApplicationRecord, communityId: string) {
  return {
    ardrId: record.ardrId,
    applicationId: record.applicationId,
    roomId: record.roomId,
    roomName: record.roomName,
    communityId,
    state: record.state,
    stateName: record.stateName,
  }
}

/**
 * 从 URL 参数重建 PropertyApplication 对象的核心字段
 *
 * @description 用于在目标页面的 onLoad 钩子中从 URL 参数重建申请对象
 * @param params - URL 参数对象
 * @returns 部分 PropertyApplication 对象
 * @example buildApplyFromParams(options)
 */
export function buildApplyFromParams(params: {
  ardId: string
  communityId: string
  roomId: string
  roomName: string
  state: string
  stateName: string
}): Partial<PropertyApplication> {
  return {
    ardId: params.ardId,
    communityId: params.communityId,
    roomId: params.roomId,
    roomName: params.roomName,
    state: params.state as PropertyApplication['state'],
    stateName: params.stateName,
  }
}

/**
 * 从 URL 参数重建 ApplicationRecord 对象的核心字段
 *
 * @description 用于在记录详情页面的 onLoad 钩子中从 URL 参数重建记录对象
 * @param params - URL 参数对象
 * @returns 部分 ApplicationRecord 对象（含 communityId）
 * @example buildRecordFromParams(options)
 */
export function buildRecordFromParams(params: {
  ardrId: string
  applicationId: string
  roomId: string
  roomName: string
  communityId: string
  state: string
  stateName: string
}): Partial<ApplicationRecord & { communityId: string }> {
  return {
    ardrId: params.ardrId,
    applicationId: params.applicationId,
    roomId: params.roomId,
    roomName: params.roomName,
    communityId: params.communityId,
    state: params.state,
    stateName: params.stateName,
  }
}

/**
 * 房屋申请 Hook
 *
 * @description 提供房屋申请相关的辅助函数集合
 * @returns 房屋申请相关的工具函数
 */
export function usePropertyApplyRoom() {
  return {
    extractApplyRecordParams,
    extractRecordDetailParams,
    buildApplyFromParams,
    buildRecordFromParams,
  }
}
