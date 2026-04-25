import type { Staff, StaffListResponse, StaffQueryParams } from '../../../src/types/staff.ts'
import { match as matchHanToPinyin } from 'pinyin-pro'
import { STAFF_ORGANIZATION_OPTIONS, STAFF_POSITION_OPTIONS } from '../../../src/constants/staff.ts'
import { generateChineseName, generatePhoneNumber } from '../../shared/runtime/common-utils.ts'

/** 是否包含至少一个 CJK 统一汉字（用于决定是否走拼音匹配） */
const HAN_REGEX = /[\u4E00-\u9FFF]/

/**
 * 汉字文本是否可被 `pinyin-pro` 的拼音模式命中（全拼 / 首字母 / 混拼，大小写不敏感）。
 * 无汉字或无拉丁字母时返回 false，避免对纯英文、纯数字字段误用 `match`。
 */
function hanTextMatchesPinyinPattern(text: string, keyword: string): boolean {
  const q = keyword.trim()
  if (!text || !q || !HAN_REGEX.test(text) || !/[a-z]/i.test(q))
    return false

  const hit = matchHanToPinyin(text, q, { insensitive: true })
  return hit !== null && hit.length > 0
}

export interface StaffModuleRepository {
  addStaff: (staff: Omit<Staff, 'id'>) => Staff
  getAllOrganizations: () => string[]
  getOnlineStaffs: () => Staff[]
  getStaffById: (staffId: string) => Staff | undefined
  getStaffsByDepartment: (orgName: string) => Staff[]
  queryStaffInfos: (params: StaffQueryParams) => StaffListResponse
  searchStaffs: (keyword: string) => Staff[]
  updateStaffOnlineStatus: (staffId: string, isOnline: boolean) => Staff | null
}

/**
 * 员工是否命中 `queryStaffInfos(name)` 与 `searchStaffs` 共用的模糊关键词规则。
 * 含字面子串匹配；姓名、部门、职位另支持 `pinyin-pro` 拼音/首字母/混拼匹配（通讯录常用拉丁检索）。
 * 电话支持原始子串或去非数字后的数字子串；邮箱、首字母索引、工号为不区分大小写的子串匹配。
 */
function staffMatchesSearchKeyword(staff: Staff, rawKeyword: string): boolean {
  const keyword = rawKeyword.trim()
  if (!keyword)
    return true

  const lower = keyword.toLowerCase()
  const telDigits = keyword.replace(/\D/g, '')
  const staffTelDigits = staff.tel.replace(/\D/g, '')

  return (
    staff.name.includes(keyword)
    || staff.name.toLowerCase().includes(lower)
    || staff.orgName.includes(keyword)
    || staff.orgName.toLowerCase().includes(lower)
    || (staff.position?.includes(keyword) ?? false)
    || (staff.position?.toLowerCase().includes(lower) ?? false)
    || (staff.email?.toLowerCase().includes(lower) ?? false)
    || staff.tel.includes(keyword)
    || (telDigits.length > 0 && staffTelDigits.includes(telDigits))
    || staff.initials.toLowerCase().includes(lower)
    || staff.id.toLowerCase().includes(lower)
    || hanTextMatchesPinyinPattern(staff.name, keyword)
    || hanTextMatchesPinyinPattern(staff.orgName, keyword)
    || hanTextMatchesPinyinPattern(staff.position ?? '', keyword)
  )
}

/** 创建 `staff` 模块的 mock 内存仓库。 */
export function createStaffMockRepository(): StaffModuleRepository {
  const staffs = Array.from({ length: 50 }, (_, index) => createMockStaff((index + 1).toString().padStart(3, '0')))
  /** 固定一条便于拼音首拼「gj」验证的数据（高进 → gao jin） */
  staffs.unshift({
    id: 'STAFF_DEMO_PINYIN',
    name: '高进',
    tel: '13800138000',
    orgName: '行政部',
    initials: 'G',
    position: '行政助理',
    email: 'gaojin@property.com',
    avatar: 'https://picsum.photos/100/100?random=demo-gj',
    isOnline: true,
  })

  return {
    addStaff(staff) {
      const newStaff: Staff = {
        ...staff,
        id: `STAFF_${Date.now()}`,
      }

      staffs.unshift(newStaff)
      return newStaff
    },
    getAllOrganizations() {
      return Array.from(new Set(staffs.map(staff => staff.orgName))).sort()
    },
    getOnlineStaffs() {
      return staffs.filter(staff => staff.isOnline)
    },
    getStaffById(staffId) {
      return staffs.find(staff => staff.id === staffId)
    },
    getStaffsByDepartment(orgName) {
      return staffs.filter(staff => staff.orgName === orgName)
    },
    queryStaffInfos(params) {
      let filteredStaffs = [...staffs]

      if (params.name?.trim()) {
        const keyword = params.name.trim()
        filteredStaffs = filteredStaffs.filter(staff => staffMatchesSearchKeyword(staff, keyword))
      }

      if (params.orgName?.trim()) {
        const orgQ = params.orgName.trim()
        filteredStaffs = filteredStaffs.filter(staff =>
          staff.orgName.includes(orgQ)
          || staff.orgName.toLowerCase().includes(orgQ.toLowerCase())
          || hanTextMatchesPinyinPattern(staff.orgName, orgQ))
      }

      if (params.initials?.trim()) {
        const letter = params.initials.trim().toUpperCase()
        filteredStaffs = filteredStaffs.filter(staff => staff.initials.toUpperCase() === letter)
      }

      filteredStaffs.sort((left, right) => `${left.initials}`.localeCompare(`${right.initials}`))

      const page = params.page || 1
      const row = params.row || 1000
      const startIndex = (page - 1) * row
      const endIndex = startIndex + row

      return {
        staffs: filteredStaffs.slice(startIndex, endIndex),
        total: filteredStaffs.length,
        page,
        row,
      }
    },
    searchStaffs(keyword) {
      if (!keyword?.trim()) {
        return []
      }

      const q = keyword.trim()
      return staffs.filter(staff => staffMatchesSearchKeyword(staff, q))
    },
    updateStaffOnlineStatus(staffId, isOnline) {
      const staff = this.getStaffById(staffId)
      if (!staff) {
        return null
      }

      staff.isOnline = isOnline
      return staff
    },
  }
}

/** 导出默认 staff mock 仓库实例。 */
export const staffMockRepository = createStaffMockRepository()

function createMockStaff(id: string): Staff {
  const name = generateChineseName()
  const positionItem = STAFF_POSITION_OPTIONS[Math.floor(Math.random() * STAFF_POSITION_OPTIONS.length)]
  const organizationItem = STAFF_ORGANIZATION_OPTIONS[Math.floor(Math.random() * STAFF_ORGANIZATION_OPTIONS.length)]

  return {
    id: `STAFF_${id}`,
    name,
    tel: generatePhoneNumber(),
    orgName: String(organizationItem.value),
    initials: getInitials(name),
    position: String(positionItem.value),
    email: `staff${id}@property.com`,
    avatar: `https://picsum.photos/100/100?random=${id}`,
    isOnline: Math.random() > 0.3,
  }
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
