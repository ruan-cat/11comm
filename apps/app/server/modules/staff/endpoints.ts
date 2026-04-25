import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { StaffModuleRepository } from './repository.ts'
import { errorResponse, successResponse } from '../../shared/runtime/response-builder.ts'
import { staffMockRepository } from './repository.ts'

/** 创建 `staff` 模块的共享 endpoint 定义。 */
export function createStaffEndpointDefinitions(
  repository: StaffModuleRepository = staffMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/query.staff.infos',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.queryStaffInfos({
        page: Number(params.page) || 1,
        row: Number(params.row) || 1000,
        storeId: optionalString(params.storeId) || 'DEFAULT_STORE',
        name: optionalString(params.name),
        orgName: optionalString(params.orgName),
        initials: optionalString(params.initials),
      }), '查询员工信息成功'),
    },
    {
      url: '/app/staff/by-department',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const orgName = optionalString(params.orgName) || ''
        const staffs = repository.getStaffsByDepartment(orgName)

        return successResponse({
          staffs,
          total: staffs.length,
          page: 1,
          row: staffs.length,
        }, '获取部门员工成功')
      },
    },
    {
      url: '/app/staff/search',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const keyword = optionalString(params.keyword)
        if (!keyword) {
          return errorResponse('搜索关键字不能为空', '400')
        }

        const staffs = repository.searchStaffs(keyword)
        return successResponse({
          staffs,
          total: staffs.length,
          keyword,
        }, '搜索员工成功')
      },
    },
    {
      url: '/app/staff/organizations',
      method: 'GET',
      handler: () => {
        const organizations = repository.getAllOrganizations()
        const totalStaffs = repository.queryStaffInfos({ page: 1, row: 1, storeId: 'DEFAULT_STORE' }).total
        const organizationStats = organizations.map(orgName => ({
          orgName,
          staffCount: repository.getStaffsByDepartment(orgName).length,
          onlineCount: repository.getStaffsByDepartment(orgName).filter(staff => staff.isOnline).length,
        }))

        return successResponse({
          organizations: organizationStats,
          totalOrganizations: organizations.length,
          totalStaffs,
        }, '获取组织列表成功')
      },
    },
    {
      url: '/app/staff/update-online-status',
      method: 'POST',
      handler: ({ body }) => {
        const staffId = optionalString(body?.staffId)
        if (!staffId) {
          return errorResponse('员工ID不能为空', '400')
        }

        const staff = repository.updateStaffOnlineStatus(staffId, toBoolean(body?.isOnline))
        if (!staff) {
          return errorResponse('员工不存在', '404')
        }

        return successResponse({ staff }, '更新在线状态成功')
      },
    },
    {
      url: '/app/staff/online',
      method: 'GET',
      handler: () => {
        const staffs = repository.getOnlineStaffs()
        const totalStaffs = repository.queryStaffInfos({ page: 1, row: 1, storeId: 'DEFAULT_STORE' }).total
        return successResponse({
          staffs,
          total: staffs.length,
          onlineRatio: Math.round((staffs.length / Math.max(totalStaffs, 1)) * 100),
        }, '获取在线员工成功')
      },
    },
    {
      url: '/app/staff/add',
      method: 'POST',
      handler: ({ body }) => {
        const name = optionalString(body?.name)
        const tel = optionalString(body?.tel)
        const orgName = optionalString(body?.orgName)

        if (!name || !tel || !orgName) {
          return errorResponse('姓名、电话和组织名称不能为空', '400')
        }

        const staff = repository.addStaff({
          name,
          tel,
          orgName,
          position: optionalString(body?.position) || '员工',
          initials: getInitials(name),
          email: optionalString(body?.email),
          isOnline: true,
          avatar: optionalString(body?.avatar),
        })

        return successResponse({ staff }, '添加员工成功')
      },
    },
    {
      url: '/app/staff/:staffId',
      method: 'GET',
      handler: ({ params }) => {
        const staffId = optionalString(params.staffId)
        if (!staffId) {
          return errorResponse('员工不存在', '404')
        }

        const staff = repository.getStaffById(staffId)
        if (!staff) {
          return errorResponse('员工不存在', '404')
        }

        return successResponse(staff, '获取员工详情成功')
      },
    },
  ]
}

/** 导出默认的 staff endpoint 集合。 */
export const staffEndpointDefinitions = createStaffEndpointDefinitions()

function optionalString(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined
  }

  const text = `${value}`.trim()
  return text || undefined
}

function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value
  }

  const text = `${value}`.trim().toLowerCase()
  return text === 'true' || text === '1' || text === 'yes'
}

function getInitials(name: string): string {
  const firstChar = name.charAt(0)
  const initialMap: Record<string, string> = {
    张: 'Z',
    王: 'W',
    李: 'L',
    赵: 'Z',
    刘: 'L',
    陈: 'C',
    杨: 'Y',
    黄: 'H',
    周: 'Z',
    吴: 'W',
    徐: 'X',
    孙: 'S',
    胡: 'H',
    朱: 'Z',
    高: 'G',
    林: 'L',
    何: 'H',
    郭: 'G',
    马: 'M',
    罗: 'L',
  }

  return initialMap[firstChar] || firstChar.toUpperCase()
}
