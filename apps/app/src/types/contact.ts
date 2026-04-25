/**
 * 通讯录模块类型定义
 */

import type { PaginationParams } from './api'

/** 部门类型 */
export type DepartmentType = '物业管理处' | '保安部' | '清洁部' | '维修部' | '客服部' | '财务部' | '外部联系'

/** 联系人信息 */
export interface Contact {
  contactId: string
  name: string
  position: string
  department: DepartmentType
  phone: string
  email?: string
  workTime?: string
  avatar?: string
  description?: string
  isOnline: boolean
}

/** 紧急联系人 */
export interface EmergencyContact extends Contact {
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
}

/** 通讯录列表查询参数 */
export interface ContactListParams extends PaginationParams {
  department?: DepartmentType
  keyword?: string
  isOnline?: boolean
}

/** 通讯录列表响应 */
export interface ContactListResponse {
  contacts: Contact[]
  total: number
  page: number
  row: number
}

/** 部门信息 */
export interface Department {
  departmentName: DepartmentType
  totalCount: number
  onlineCount: number
  contacts?: Contact[]
}

/** 按部门分组的通讯录响应 */
export interface ContactsByDepartmentResponse {
  departments: Department[]
  totalContacts: number
  onlineContacts: number
}
