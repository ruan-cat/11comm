/**
 * 员工通讯录模块 Mock 接口
 */

import type { Staff } from '../../types/staff'
import { createPaginationResponse, defineUniAppMock, errorResponse, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

const staffs: Staff[] = [
  {
    id: 'STAFF_001',
    name: '张小明',
    tel: '13800001001',
    orgName: '工程维修部',
    initials: 'Z',
    position: '维修主管',
    email: 'zhangxiaoming@example.com',
    isOnline: true,
  },
  {
    id: 'STAFF_002',
    name: '李安安',
    tel: '13800001002',
    orgName: '客户服务部',
    initials: 'L',
    position: '客服专员',
    email: 'lianshan@example.com',
    isOnline: false,
  },
  {
    id: 'STAFF_003',
    name: '王佳佳',
    tel: '13800001003',
    orgName: '秩序维护部',
    initials: 'W',
    position: '秩序队长',
    email: 'wangjiajia@example.com',
    isOnline: true,
  },
  {
    id: 'STAFF_004',
    name: '赵宁',
    tel: '13800001004',
    orgName: '工程维修部',
    initials: 'Z',
    position: '维修工程师',
    email: 'zhaoning@example.com',
    isOnline: true,
  },
]

/** 本地 mock 用固定员工数据断开旧内置 Nitro server 依赖。 */
export default defineUniAppMock([
  {
    url: '/app/query.staff.infos',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const page = asPositiveNumber(params.page, 1)
      const row = asPositiveNumber(params.row, 1000)
      const list = filterStaffs(params)
      const pageData = createPaginationResponse(list, page, row)

      return successResponse({
        staffs: pageData.list,
        total: pageData.total,
        page,
        row,
      }, '查询员工信息成功')
    },
  },
  {
    url: '/app/staff/by-department',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const orgName = asOptionalString(getRequestParams(context).orgName)
      const list = orgName
        ? staffs.filter(staff => staff.orgName === orgName)
        : staffs

      return successResponse({
        staffs: list,
        total: list.length,
        page: 1,
        row: list.length,
      }, '获取部门员工成功')
    },
  },
  {
    url: '/app/staff/search',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const keyword = asOptionalString(getRequestParams(context).keyword)
      if (!keyword) {
        return errorResponse('搜索关键字不能为空', '400')
      }

      const list = staffs.filter(staff => matchesKeyword(staff, keyword))

      return successResponse({
        staffs: list,
        total: list.length,
        keyword,
      }, '搜索员工成功')
    },
  },
  {
    url: '/app/staff/organizations',
    method: 'GET',
    body: () => {
      const organizations = Array.from(new Set(staffs.map(staff => staff.orgName)))

      return successResponse({
        organizations: organizations.map(orgName => ({
          orgName,
          staffCount: staffs.filter(staff => staff.orgName === orgName).length,
          onlineCount: staffs.filter(staff => staff.orgName === orgName && staff.isOnline).length,
        })),
        totalOrganizations: organizations.length,
        totalStaffs: staffs.length,
      }, '获取组织列表成功')
    },
  },
  {
    url: '/app/staff/update-online-status',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const staffId = asOptionalString(context.body?.staffId)
      if (!staffId) {
        return errorResponse('员工ID不能为空', '400')
      }

      const staff = staffs.find(item => item.id === staffId)
      if (!staff) {
        return errorResponse('员工不存在', '404')
      }

      staff.isOnline = toBoolean(context.body?.isOnline)

      return successResponse({ staff }, '更新在线状态成功')
    },
  },
  {
    url: '/app/staff/online',
    method: 'GET',
    body: () => {
      const onlineStaffs = staffs.filter(staff => staff.isOnline)

      return successResponse({
        staffs: onlineStaffs,
        total: onlineStaffs.length,
        onlineRatio: Math.round((onlineStaffs.length / Math.max(staffs.length, 1)) * 100),
      }, '获取在线员工成功')
    },
  },
  {
    url: '/app/staff/add',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const name = asOptionalString(context.body?.name)
      const tel = asOptionalString(context.body?.tel)
      const orgName = asOptionalString(context.body?.orgName)

      if (!name || !tel || !orgName) {
        return errorResponse('姓名、电话和组织名称不能为空', '400')
      }

      const staff: Staff = {
        id: `STAFF_${(staffs.length + 1).toString().padStart(3, '0')}`,
        name,
        tel,
        orgName,
        initials: getInitials(name),
        position: asOptionalString(context.body?.position) || '员工',
        email: asOptionalString(context.body?.email),
        avatar: asOptionalString(context.body?.avatar),
        isOnline: true,
      }
      staffs.push(staff)

      return successResponse({ staff }, '添加员工成功')
    },
  },
  {
    url: '/app/staff/:staffId',
    method: 'GET',
    body: (context: MockContext = {}) => {
      const staffId = asOptionalString(context.params?.staffId)
      const staff = staffId ? staffs.find(item => item.id === staffId) : undefined
      if (!staff) {
        return errorResponse('员工不存在', '404')
      }

      return successResponse(staff, '获取员工详情成功')
    },
  },
])

function filterStaffs(params: Record<string, unknown>): Staff[] {
  const name = asOptionalString(params.name)
  const orgName = asOptionalString(params.orgName)
  const initials = asOptionalString(params.initials)

  return staffs
    .filter(staff => !name || matchesKeyword(staff, name))
    .filter(staff => !orgName || staff.orgName === orgName)
    .filter(staff => !initials || staff.initials === initials)
}

function matchesKeyword(staff: Staff, keyword: string): boolean {
  return staff.name.includes(keyword)
    || staff.tel.includes(keyword)
    || staff.orgName.includes(keyword)
    || staff.initials.toLowerCase().includes(keyword.toLowerCase())
}

function getRequestParams(context: MockContext): Record<string, unknown> {
  return {
    ...(context.query || {}),
    ...(context.body || {}),
    ...(context.params || {}),
  }
}

function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}

function asPositiveNumber(value: unknown, fallback: number): number {
  const numberValue = Number(asOptionalString(value))

  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : fallback
}

function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value
  }

  const text = `${value}`.trim().toLowerCase()
  return text === 'true' || text === '1' || text === 'yes'
}

function getInitials(name: string): string {
  return name.charAt(0).toUpperCase()
}
