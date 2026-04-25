import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { ContactModuleRepository } from './repository.ts'
import { errorResponse, successResponse } from '../../shared/runtime/response-builder.ts'
import { contactMockRepository } from './repository.ts'

/** 创建 `contact` 模块的共享 endpoint 定义。 */
export function createContactEndpointDefinitions(
  repository: ContactModuleRepository = contactMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/contact.listContacts',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const result = repository.getContactList({
          page: Number(params.page) || 1,
          row: Number(params.row) || 20,
          department: params.department,
          keyword: optionalString(params.keyword),
          isOnline: params.isOnline === undefined ? undefined : toBoolean(params.isOnline),
        } as any)

        return successResponse(result, '获取通讯录列表成功')
      },
    },
    {
      url: '/app/contact.getContactDetail',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const contactId = optionalString(params.contactId)
        if (!contactId) {
          return errorResponse('联系人ID不能为空', '400')
        }

        const contact = repository.getContactById(contactId)
        if (!contact) {
          return errorResponse('联系人不存在', '404')
        }

        return successResponse({ contact }, '获取联系人详情成功')
      },
    },
    {
      url: '/app/contact.getContactsByDepartment',
      method: ['GET', 'POST'],
      handler: () => successResponse(repository.getContactsByDepartment(), '获取部门通讯录成功'),
    },
    {
      url: '/app/contact.searchContacts',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const keyword = optionalString(params.keyword)
        if (!keyword) {
          return errorResponse('搜索关键字不能为空', '400')
        }

        const result = repository.searchContacts({
          page: Number(params.page) || 1,
          row: Number(params.row) || 50,
          department: params.department,
          keyword,
          isOnline: params.isOnline === undefined ? undefined : toBoolean(params.isOnline),
        } as any)

        return successResponse({
          contacts: result.contacts,
          total: result.total,
          keyword,
        }, '搜索联系人成功')
      },
    },
    {
      url: '/app/contact.getDepartments',
      method: ['GET', 'POST'],
      handler: () => successResponse({ departments: repository.getDepartments() }, '获取部门列表成功'),
    },
    {
      url: '/app/contact.updateOnlineStatus',
      method: 'POST',
      handler: ({ body }) => {
        const contactId = optionalString(body?.contactId)
        if (!contactId) {
          return errorResponse('联系人ID不能为空', '400')
        }

        const contact = repository.updateOnlineStatus(contactId, toBoolean(body?.isOnline))
        if (!contact) {
          return errorResponse('联系人不存在', '404')
        }

        return successResponse({ contact }, '更新在线状态成功')
      },
    },
    {
      url: '/app/contact.getFavoriteContacts',
      method: ['GET', 'POST'],
      handler: () => successResponse({ contacts: repository.getFavoriteContacts() }, '获取常用联系人成功'),
    },
    {
      url: '/app/contact.getEmergencyContacts',
      method: ['GET', 'POST'],
      handler: () => successResponse({ contacts: repository.getEmergencyContacts() }, '获取紧急联系人成功'),
    },
  ]
}

/** 导出默认的 contact endpoint 集合。 */
export const contactEndpointDefinitions = createContactEndpointDefinitions()

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
