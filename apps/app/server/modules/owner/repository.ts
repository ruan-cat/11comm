import type { OwnerMember, SaveOwnerPayload, UpdateOwnerPayload } from '../../../src/types/property-management.ts'
import { COMMUNITY_OPTIONS } from '../../../src/constants/common.ts'
import {
  createPaginationResponse,
  generateAddress,
  generateChineseName,
  generatePhoneNumber,
} from '../../shared/runtime/common-utils.ts'

const OWNER_TYPE_NAME_MAP: Record<string, string> = {
  1001: '业主',
  1002: '家庭成员',
  1003: '租客',
}

export interface OwnerModuleRepository {
  deleteOwner: (memberId: string) => boolean
  queryOwners: (params: {
    communityId: string
    link?: string
    memberId?: string
    name?: string
    page: number
    row: number
    roomName?: string
  }) => ReturnType<typeof createPaginationResponse<OwnerMember>>
  saveOwner: (data: SaveOwnerPayload) => OwnerMember
  updateOwner: (data: UpdateOwnerPayload) => OwnerMember | null
}

/** 创建 `owner` 模块的 mock 内存仓储。 */
export function createOwnerMockRepository(): OwnerModuleRepository {
  return new OwnerDatabase()
}

/** owner 模块的 mock 内存仓储实现。 */
class OwnerDatabase implements OwnerModuleRepository {
  private owners: OwnerMember[] = []

  constructor() {
    this.initData()
  }

  queryOwners(params: {
    communityId: string
    link?: string
    memberId?: string
    name?: string
    page: number
    row: number
    roomName?: string
  }) {
    let list = [...this.owners]

    if (params.communityId) {
      list = list.filter(item => item.communityId === params.communityId)
    }

    if (params.memberId) {
      list = list.filter(item => item.memberId === params.memberId)
    }

    if (params.name) {
      list = list.filter(item => item.name.includes(params.name))
    }

    if (params.link) {
      list = list.filter(item => item.link.includes(params.link))
    }

    if (params.roomName) {
      list = list.filter(item => item.roomName.includes(params.roomName))
    }

    return cloneValue(createPaginationResponse(list, params.page, params.row))
  }

  saveOwner(data: SaveOwnerPayload): OwnerMember {
    const memberId = `MEM_${(this.owners.length + 1).toString().padStart(4, '0')}`
    const ownerId = `OWN_${(this.owners.length + 1).toString().padStart(4, '0')}`

    const item: OwnerMember = {
      memberId,
      ownerId,
      communityId: data.communityId,
      name: data.name,
      ownerTypeCd: data.ownerTypeCd || '1002',
      ownerTypeName: OWNER_TYPE_NAME_MAP[data.ownerTypeCd] || '家庭成员',
      personRole: data.personRole,
      personType: data.personType,
      roomName: data.roomName,
      roomId: memberId.replace('MEM', 'ROOM'),
      link: data.link,
      idCard: data.idCard,
      address: data.address,
      remark: data.remark,
      sex: data.sex || '0',
      faceUrl: data.ownerPhotoUrl || '',
    }

    this.owners.unshift(item)
    return cloneValue(item)
  }

  updateOwner(data: UpdateOwnerPayload): OwnerMember | null {
    const index = this.owners.findIndex(item => item.memberId === data.memberId)
    if (index < 0) {
      return null
    }

    this.owners[index] = {
      ...this.owners[index],
      ...data,
      ownerTypeName: OWNER_TYPE_NAME_MAP[data.ownerTypeCd] || this.owners[index].ownerTypeName,
      faceUrl: data.ownerPhotoUrl || this.owners[index].faceUrl,
    }

    return cloneValue(this.owners[index])
  }

  deleteOwner(memberId: string): boolean {
    const index = this.owners.findIndex(item => item.memberId === memberId)
    if (index < 0) {
      return false
    }

    this.owners.splice(index, 1)
    return true
  }

  /** 初始化业主数据。 */
  private initData() {
    if (this.owners.length > 0) {
      return
    }

    for (let index = 1; index <= 60; index += 1) {
      const community = COMMUNITY_OPTIONS[index % COMMUNITY_OPTIONS.length]
      const floorNum = Math.floor(Math.random() * 20) + 1
      const unitNum = Math.floor(Math.random() * 6) + 1
      const roomNum = Math.floor(Math.random() * 20) + 1
      const ownerTypeCd = index % 4 === 0 ? '1003' : (index % 3 === 0 ? '1002' : '1001')

      this.owners.push({
        memberId: `MEM_${index.toString().padStart(4, '0')}`,
        ownerId: `OWN_${Math.ceil(index / 2).toString().padStart(4, '0')}`,
        communityId: String(community.value),
        name: generateChineseName(),
        ownerTypeCd,
        ownerTypeName: OWNER_TYPE_NAME_MAP[ownerTypeCd],
        personRole: index % 4 === 0 ? '2' : '3',
        personType: index % 5 === 0 ? 'C' : 'P',
        roomName: `${floorNum}楼${unitNum}${roomNum.toString().padStart(2, '0')}室`,
        roomId: `ROOM_${index.toString().padStart(4, '0')}`,
        link: generatePhoneNumber(),
        idCard: `44010${Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')}`,
        address: generateAddress(),
        remark: 'mock 业主数据',
        sex: String(index % 2),
        faceUrl: `https://picsum.photos/seed/owner-${index}/200/200`,
      })
    }
  }
}

/** 默认运行时共享使用的 owner 仓储实例。 */
export const ownerMockRepository = createOwnerMockRepository()

/** 克隆仓储返回值，避免外部引用直接修改内部状态。 */
function cloneValue<T>(value: T): T {
  return structuredClone(value)
}
