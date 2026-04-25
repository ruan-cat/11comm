import type { Contact, ContactListParams, ContactListResponse, ContactsByDepartmentResponse, DepartmentType, EmergencyContact } from '../../../src/types/contact.ts'
import { CONTACT_DEPARTMENT_OPTIONS, CONTACT_POSITION_OPTIONS } from '../../../src/constants/contact.ts'
import { createPaginationResponse, generateChineseName, generatePhoneNumber } from '../../shared/runtime/common-utils.ts'

export interface ContactModuleRepository {
  getContactById: (contactId: string) => Contact | undefined
  getContactList: (params: ContactListParams) => ContactListResponse
  getContactsByDepartment: () => ContactsByDepartmentResponse
  getDepartments: () => Array<{ departmentName: DepartmentType, onlineCount: number, totalCount: number }>
  getEmergencyContacts: () => EmergencyContact[]
  getFavoriteContacts: () => Contact[]
  searchContacts: (params: ContactListParams) => ContactListResponse
  updateOnlineStatus: (contactId: string, isOnline: boolean) => Contact | null
}

/** 创建 `contact` 模块的 mock 内存仓库。 */
export function createContactMockRepository(): ContactModuleRepository {
  const contacts = Array.from({ length: 30 }, (_, index) => createMockContact((index + 1).toString().padStart(3, '0')))

  return {
    getContactById(contactId) {
      return contacts.find(contact => contact.contactId === contactId)
    },
    getContactList(params) {
      const filtered = filterContacts(contacts, params)
      const result = createPaginationResponse(filtered, params.page, params.row)

      return {
        contacts: result.list,
        total: result.total,
        page: result.page,
        row: result.pageSize,
      }
    },
    getContactsByDepartment() {
      const departments = groupContactsByDepartment(contacts)
      return {
        departments,
        totalContacts: contacts.length,
        onlineContacts: contacts.filter(contact => contact.isOnline).length,
      }
    },
    getDepartments() {
      return CONTACT_DEPARTMENT_OPTIONS.map((departmentItem) => {
        const departmentName = String(departmentItem.value) as DepartmentType
        const departmentContacts = contacts.filter(contact => contact.department === departmentName)

        return {
          departmentName,
          totalCount: departmentContacts.length,
          onlineCount: departmentContacts.filter(contact => contact.isOnline).length,
        }
      })
    },
    getEmergencyContacts() {
      return createEmergencyContacts()
    },
    getFavoriteContacts() {
      return contacts.slice(0, 8).filter(contact => contact.isOnline || Math.random() > 0.3)
    },
    searchContacts(params) {
      if (!params.keyword?.trim()) {
        return {
          contacts: [],
          total: 0,
          page: params.page,
          row: params.row,
        }
      }

      const keyword = params.keyword.toLowerCase()
      const filtered = filterContacts(contacts, params).sort((left, right) => {
        const leftScore = getContactMatchScore(left, keyword)
        const rightScore = getContactMatchScore(right, keyword)
        return rightScore - leftScore
      })
      const result = createPaginationResponse(filtered, params.page, params.row)

      return {
        contacts: result.list,
        total: result.total,
        page: result.page,
        row: result.pageSize,
      }
    },
    updateOnlineStatus(contactId, isOnline) {
      const contact = contacts.find(item => item.contactId === contactId)
      if (!contact) {
        return null
      }

      contact.isOnline = isOnline
      return contact
    },
  }
}

/** 导出默认 contact mock 仓库实例。 */
export const contactMockRepository = createContactMockRepository()

function createMockContact(id: string): Contact {
  const departmentItem = CONTACT_DEPARTMENT_OPTIONS[Math.floor(Math.random() * CONTACT_DEPARTMENT_OPTIONS.length)]
  const positionItem = CONTACT_POSITION_OPTIONS[Math.floor(Math.random() * CONTACT_POSITION_OPTIONS.length)]

  return {
    contactId: `CON_${id}`,
    name: generateChineseName(),
    position: String(positionItem.value),
    department: String(departmentItem.value) as DepartmentType,
    phone: generatePhoneNumber(),
    email: `employee${id}@property.com`,
    workTime: '09:00-18:00',
    avatar: `https://picsum.photos/100/100?random=${id}`,
    description: '负责相关业务处理，为业主提供优质服务。',
    isOnline: Math.random() > 0.3,
  }
}

function createEmergencyContacts(): EmergencyContact[] {
  return [
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
      name: '保安队长',
      phone: generatePhoneNumber(),
      department: '保安部',
      position: '队长',
      description: '负责社区安全管理',
      isOnline: true,
      priority: 'HIGH',
    },
    {
      contactId: 'EMG_003',
      name: '维修主管',
      phone: generatePhoneNumber(),
      department: '维修部',
      position: '主管',
      description: '负责紧急维修事务',
      isOnline: Math.random() > 0.3,
      priority: 'MEDIUM',
    },
    {
      contactId: 'EMG_004',
      name: '医疗急救',
      phone: '120',
      department: '外部联系',
      position: '急救服务',
      description: '医疗紧急情况',
      isOnline: true,
      priority: 'CRITICAL',
    },
    {
      contactId: 'EMG_005',
      name: '火警报警',
      phone: '119',
      department: '外部联系',
      position: '消防服务',
      description: '火灾紧急情况',
      isOnline: true,
      priority: 'CRITICAL',
    },
    {
      contactId: 'EMG_006',
      name: '治安报警',
      phone: '110',
      department: '外部联系',
      position: '治安服务',
      description: '治安紧急情况',
      isOnline: true,
      priority: 'CRITICAL',
    },
  ]
}

function filterContacts(contacts: Contact[], params: ContactListParams): Contact[] {
  let filtered = [...contacts]

  if (params.department) {
    filtered = filtered.filter(contact => contact.department === params.department)
  }

  if (params.isOnline !== undefined) {
    filtered = filtered.filter(contact => contact.isOnline === params.isOnline)
  }

  if (params.keyword?.trim()) {
    const keyword = params.keyword.toLowerCase()
    filtered = filtered.filter(contact =>
      contact.name.toLowerCase().includes(keyword)
      || contact.position.toLowerCase().includes(keyword)
      || contact.department.toLowerCase().includes(keyword)
      || contact.phone.includes(keyword)
      || contact.email?.toLowerCase().includes(keyword))
  }

  filtered.sort((left, right) => {
    if (left.department !== right.department) {
      return left.department.localeCompare(right.department)
    }

    return left.name.localeCompare(right.name)
  })

  return filtered
}

function groupContactsByDepartment(contacts: Contact[]) {
  const grouped = contacts.reduce((result, contact) => {
    if (!result[contact.department]) {
      result[contact.department] = []
    }

    result[contact.department].push(contact)
    return result
  }, {} as Record<DepartmentType, Contact[]>)

  return Object.keys(grouped)
    .sort()
    .map((departmentName) => {
      const departmentContacts = grouped[departmentName as DepartmentType]
      departmentContacts.sort((left, right) => left.name.localeCompare(right.name))

      return {
        departmentName: departmentName as DepartmentType,
        contacts: departmentContacts,
        onlineCount: departmentContacts.filter(contact => contact.isOnline).length,
        totalCount: departmentContacts.length,
      }
    })
}

function getContactMatchScore(contact: Contact, keyword: string): number {
  return (contact.name.toLowerCase().includes(keyword) ? 3 : 0)
    + (contact.position.toLowerCase().includes(keyword) ? 2 : 0)
    + (contact.department.toLowerCase().includes(keyword) ? 1 : 0)
}
