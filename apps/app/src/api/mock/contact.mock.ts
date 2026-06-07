/**
 * 通讯录模块 Mock 接口。
 */

import type { Contact, DepartmentType, EmergencyContact } from '../../types/contact'
import { createPaginationResponse, defineUniAppMock, errorResponse, generateChineseName, generatePhoneNumber, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

/** 通讯录部门。 */
const departments: DepartmentType[] = ['物业管理处', '保安部', '清洁部', '维修部', '客服部', '财务部']

/** 通讯录 mock 数据。 */
const contactList: Contact[] = Array.from({ length: 18 }, (_, index) => {
  const department = departments[index % departments.length]
  const id = (index + 1).toString().padStart(3, '0')

  return {
    contactId: `CON_${id}`,
    name: generateChineseName(),
    position: index % 3 === 0 ? '主管' : index % 3 === 1 ? '专员' : '助理',
    department,
    phone: generatePhoneNumber(),
    email: `employee${id}@property.com`,
    workTime: '09:00-18:00',
    avatar: `https://picsum.photos/seed/contact-${id}/100/100`,
    description: '负责相关业务处理，为业主提供服务。',
    isOnline: index % 4 !== 0,
  }
})

export default defineUniAppMock([
  {
    url: '/app/contact.listContacts',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const page = asPositiveNumber(params.page, 1)
      const row = asPositiveNumber(params.row, 20)
      const contacts = filterContacts(contactList, {
        department: asOptionalString(params.department) as DepartmentType | undefined,
        keyword: asOptionalString(params.keyword),
        isOnline: params.isOnline === undefined ? undefined : toBoolean(params.isOnline),
      })
      const pageData = createPaginationResponse(contacts, page, row)

      return successResponse({
        contacts: pageData.list,
        total: pageData.total,
        page: pageData.page,
        row: pageData.pageSize,
      }, '获取通讯录列表成功')
    },
  },
  {
    url: '/app/contact.getContactDetail',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const contactId = asOptionalString(getRequestParams(context).contactId)

      if (!contactId) {
        return errorResponse('联系人ID不能为空', '400')
      }

      const contact = contactList.find(item => item.contactId === contactId)
      if (!contact) {
        return errorResponse('联系人不存在', '404')
      }

      return successResponse({ contact }, '获取联系人详情成功')
    },
  },
  {
    url: '/app/contact.getContactsByDepartment',
    method: ['GET', 'POST'],
    body: () => successResponse({
      departments: groupContactsByDepartment(),
      totalContacts: contactList.length,
      onlineContacts: contactList.filter(contact => contact.isOnline).length,
    }, '获取部门通讯录成功'),
  },
  {
    url: '/app/contact.searchContacts',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const keyword = asOptionalString(params.keyword)

      if (!keyword) {
        return errorResponse('搜索关键字不能为空', '400')
      }

      const contacts = filterContacts(contactList, { keyword })
      const pageData = createPaginationResponse(contacts, asPositiveNumber(params.page, 1), asPositiveNumber(params.row, 50))

      return successResponse({ contacts: pageData.list, total: pageData.total, keyword }, '搜索联系人成功')
    },
  },
  {
    url: '/app/contact.getDepartments',
    method: ['GET', 'POST'],
    body: () => successResponse({ departments: createDepartmentStats() }, '获取部门列表成功'),
  },
  {
    url: '/app/contact.updateOnlineStatus',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const contactId = asOptionalString(context.body?.contactId)
      const contact = contactList.find(item => item.contactId === contactId)

      if (!contact) {
        return errorResponse('联系人不存在', '404')
      }

      contact.isOnline = toBoolean(context.body?.isOnline)

      return successResponse({ contact }, '更新在线状态成功')
    },
  },
  {
    url: '/app/contact.getFavoriteContacts',
    method: ['GET', 'POST'],
    body: () => successResponse({ contacts: contactList.slice(0, 8) }, '获取常用联系人成功'),
  },
  {
    url: '/app/contact.getEmergencyContacts',
    method: ['GET', 'POST'],
    body: () => successResponse({ contacts: emergencyContacts }, '获取紧急联系人成功'),
  },
])

/** 紧急联系人 mock 数据。 */
const emergencyContacts: EmergencyContact[] = [
  {
    contactId: 'EMG_001',
    name: '24小时值班室',
    phone: '400-888-9999',
    department: '物业管理处',
    position: '值班',
    description: '24小时为您服务',
    isOnline: true,
    priority: 'HIGH',
  },
  {
    contactId: 'EMG_002',
    name: '维修主管',
    phone: '13800009999',
    department: '维修部',
    position: '主管',
    description: '负责紧急维修事务',
    isOnline: true,
    priority: 'MEDIUM',
  },
]

/** 按查询条件筛选联系人。 */
function filterContacts(
  contacts: Contact[],
  params: { department?: DepartmentType, isOnline?: boolean, keyword?: string },
): Contact[] {
  return contacts
    .filter(contact => !params.department || contact.department === params.department)
    .filter(contact => params.isOnline === undefined || contact.isOnline === params.isOnline)
    .filter(contact => !params.keyword || [
      contact.name,
      contact.position,
      contact.department,
      contact.phone,
      contact.email || '',
    ].some(value => value.includes(params.keyword || '')))
}

/** 按部门分组联系人。 */
function groupContactsByDepartment() {
  return departments.map((departmentName) => {
    const contacts = contactList.filter(contact => contact.department === departmentName)

    return {
      departmentName,
      contacts,
      onlineCount: contacts.filter(contact => contact.isOnline).length,
      totalCount: contacts.length,
    }
  })
}

/** 生成部门统计。 */
function createDepartmentStats() {
  return groupContactsByDepartment().map(({ contacts: _contacts, ...department }) => department)
}

/** 合并 Vite mock 的 query、body 与 params。 */
function getRequestParams(context: MockContext): Record<string, unknown> {
  return {
    ...(context.query || {}),
    ...(context.body || {}),
    ...(context.params || {}),
  }
}

/** 将未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}

/** 将未知值收敛为正数。 */
function asPositiveNumber(value: unknown, fallback: number): number {
  const numberValue = Number(asOptionalString(value))

  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : fallback
}

/** 将未知值收敛为布尔值。 */
function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value
  }

  const text = `${value}`.trim().toLowerCase()
  return text === 'true' || text === '1' || text === 'yes'
}
