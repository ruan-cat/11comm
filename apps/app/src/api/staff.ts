/**
 * 员工通讯录 API 接口封装
 * 从 Vue2 的 java110Context 架构迁移到 Vue3 + Alova
 * 对应原项目的 queryStaffInfos 接口
 */

import type { Staff, StaffGroup, StaffListResponse, StaffQueryParams } from '@/types/staff'
import { http } from '@/http/alova'

/**
 * 查询员工信息列表
 * 对应原项目的 queryStaffInfos 接口 (app/query.staff.infos)
 * 完全遵循源项目的 API 设计和参数要求
 */
export function queryStaffList(params: StaffQueryParams) {
  return http.Get<StaffListResponse>('/app/query.staff.infos', {
    params: {
      page: params.page || 1,
      row: params.row || 1000,
      storeId: params.storeId,
      name: params.name,
      orgName: params.orgName,
      initials: params.initials,
    },
    meta: {
      // 忽略认证，因为原项目没有复杂的认证机制
      ignoreAuth: true,
    },
  })
}

/**
 * 搜索员工信息
 * @param keyword 搜索关键词
 * @param storeId 商户ID
 */
export function searchStaff(keyword: string, storeId?: string) {
  return queryStaffList({
    name: keyword,
    storeId,
    page: 1,
    row: 1000,
  })
}

/**
 * 获取员工详情
 * @param staffId 员工ID
 */
export function getStaffDetail(staffId: string) {
  return http.Get<Staff>(`/app/staff/${staffId}`, {
    meta: {
      ignoreAuth: true,
    },
  })
}

/**
 * 按部门分组获取员工列表
 * @param storeId 商户ID
 */
export function getStaffByDepartment(storeId?: string) {
  return http.Get<StaffListResponse>('/app/staff/by-department', {
    params: {
      storeId,
    },
    meta: {
      ignoreAuth: true,
    },
  })
}

/**
 * 格式化员工列表为按首字母分组（兼容原项目的 _formatList 方法）
 * @param staffs 员工列表
 * @param keyword 分组关键字段（默认为 initials）
 */
export function formatStaffList(staffs: Staff[], keyword: string = 'initials'): StaffGroup[] {
  if (!staffs || staffs.length === 0) {
    return []
  }

  const sortedStaffs = [...staffs].sort((a, b) => {
    return `${a[keyword as keyof Staff]}`.localeCompare(`${b[keyword as keyof Staff]}`)
  })

  const groupMap = new Map<string, Staff[]>()

  sortedStaffs.forEach((staff) => {
    const staffKeyword = `${staff[keyword as keyof Staff] || '#'}`
    const groupStaffs = groupMap.get(staffKeyword) || []
    groupStaffs.push(staff)
    groupMap.set(staffKeyword, groupStaffs)
  })

  return Array.from(groupMap.entries()).map(([initials, groupStaffs]) => ({
    initials,
    staffs: groupStaffs,
  }))
}
