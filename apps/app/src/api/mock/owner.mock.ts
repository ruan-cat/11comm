/**
 * 业主管理 Mock 接口。
 */

import type { OwnerMember, SaveOwnerPayload, UpdateOwnerPayload } from '../../types/property-management'
import { createPaginationResponse, defineUniAppMock, errorResponse, generateAddress, generateChineseName, generatePhoneNumber, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

/** 业主类型名称。 */
const ownerTypeNameMap: Record<string, string> = {
  1001: '业主',
  1002: '家庭成员',
  1003: '租客',
}

/** 业主 mock 数据。 */
const ownerList: OwnerMember[] = Array.from({ length: 18 }, (_, index) => {
  const id = (index + 1).toString().padStart(4, '0')
  const ownerTypeCd = index % 4 === 0 ? '1003' : index % 3 === 0 ? '1002' : '1001'

  return {
    memberId: `MEM_${id}`,
    ownerId: `OWN_${Math.ceil((index + 1) / 2).toString().padStart(4, '0')}`,
    communityId: index % 2 === 0 ? 'COMM_001' : 'COMM_002',
    name: generateChineseName(),
    ownerTypeCd,
    ownerTypeName: ownerTypeNameMap[ownerTypeCd],
    personRole: index % 4 === 0 ? '2' : '3',
    personType: index % 5 === 0 ? 'C' : 'P',
    roomName: `${(index % 6) + 1}楼${(index % 3) + 1}${(101 + index).toString().slice(-3)}室`,
    roomId: `ROOM_${id}`,
    link: generatePhoneNumber(),
    idCard: `44010${(100000000000 + index).toString()}`,
    address: generateAddress(),
    remark: '本地 mock 业主数据',
    sex: String(index % 2),
    faceUrl: `https://picsum.photos/seed/owner-${id}/200/200`,
  }
})

export default defineUniAppMock([
  {
    url: '/app/owner.queryOwnerAndMembers',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const page = asPositiveNumber(params.page, 1)
      const row = asPositiveNumber(params.row, 10)
      const members = ownerList
        .filter(item => item.communityId === (asOptionalString(params.communityId) || 'COMM_001'))
        .filter(item => !params.memberId || item.memberId === asOptionalString(params.memberId))
        .filter(item => !params.name || item.name.includes(asOptionalString(params.name) || ''))
        .filter(item => !params.link || item.link.includes(asOptionalString(params.link) || ''))
        .filter(item => !params.roomName || item.roomName.includes(asOptionalString(params.roomName) || ''))

      return successResponse(createPaginationResponse(members, page, row), '查询成功')
    },
  },
  {
    url: '/app/owner.saveRoomOwner',
    method: ['POST'],
    body: (context: MockContext = {}) => {
      const body = context.body || {}
      if (!body.name || !body.link || !body.communityId) {
        return errorResponse('参数不完整', '400')
      }

      const owner = createOwner(normalizeSaveOwnerPayload(body))
      ownerList.unshift(owner)

      return successResponse({ memberId: owner.memberId }, '保存成功')
    },
  },
  {
    url: '/app/owner.editOwner',
    method: ['POST'],
    body: (context: MockContext = {}) => {
      const body = context.body || {}
      const memberId = asOptionalString(body.memberId)

      if (!memberId) {
        return errorResponse('memberId 不能为空', '400')
      }

      const owner = updateOwner(normalizeUpdateOwnerPayload(body))
      if (!owner) {
        return errorResponse('业主不存在', '404')
      }

      return successResponse({ memberId: owner.memberId }, '修改成功')
    },
  },
  {
    url: '/app/owner.deleteOwner',
    method: ['POST'],
    body: (context: MockContext = {}) => {
      const memberId = asOptionalString(context.body?.memberId)
      const index = ownerList.findIndex(item => item.memberId === memberId)

      if (index < 0) {
        return errorResponse('业主不存在', '404')
      }

      ownerList.splice(index, 1)

      return successResponse({ success: true }, '删除成功')
    },
  },
])

/** 新建业主记录。 */
function createOwner(data: SaveOwnerPayload): OwnerMember {
  const id = (ownerList.length + 1).toString().padStart(4, '0')
  const ownerTypeCd = data.ownerTypeCd || '1002'

  return {
    memberId: `MEM_${id}`,
    ownerId: `OWN_${id}`,
    communityId: data.communityId,
    name: data.name,
    ownerTypeCd,
    ownerTypeName: ownerTypeNameMap[ownerTypeCd] || '家庭成员',
    personRole: data.personRole,
    personType: data.personType,
    roomName: data.roomName,
    roomId: `ROOM_${id}`,
    link: data.link,
    idCard: data.idCard,
    address: data.address,
    remark: data.remark,
    sex: data.sex || '0',
    faceUrl: data.ownerPhotoUrl || '',
  }
}

/** 把保存请求体收敛为业主保存参数。 */
function normalizeSaveOwnerPayload(body: Record<string, unknown>): SaveOwnerPayload {
  return {
    name: asOptionalString(body.name) || '',
    link: asOptionalString(body.link) || '',
    ownerTypeCd: asOptionalString(body.ownerTypeCd) || '1002',
    personRole: asOptionalString(body.personRole) || '3',
    personType: asOptionalString(body.personType) || 'P',
    roomName: asOptionalString(body.roomName) || '1楼101室',
    communityId: asOptionalString(body.communityId) || 'COMM_001',
    idCard: asOptionalString(body.idCard),
    address: asOptionalString(body.address),
    remark: asOptionalString(body.remark),
    sex: asOptionalString(body.sex) || '0',
    ownerPhotoUrl: asOptionalString(body.ownerPhotoUrl),
  }
}

/** 把更新请求体收敛为业主更新参数。 */
function normalizeUpdateOwnerPayload(body: Record<string, unknown>): UpdateOwnerPayload {
  const currentOwner = ownerList.find(item => item.memberId === asOptionalString(body.memberId))

  return {
    memberId: asOptionalString(body.memberId) || '',
    ownerId: asOptionalString(body.ownerId) || currentOwner?.ownerId || '',
    communityId: asOptionalString(body.communityId) || currentOwner?.communityId || 'COMM_001',
    name: asOptionalString(body.name) || currentOwner?.name || '',
    link: asOptionalString(body.link) || currentOwner?.link || '',
    ownerTypeCd: asOptionalString(body.ownerTypeCd) || currentOwner?.ownerTypeCd || '1002',
    idCard: asOptionalString(body.idCard) || currentOwner?.idCard,
    address: asOptionalString(body.address) || currentOwner?.address,
    remark: asOptionalString(body.remark) || currentOwner?.remark,
    sex: asOptionalString(body.sex) || currentOwner?.sex,
    ownerPhotoUrl: asOptionalString(body.ownerPhotoUrl) || currentOwner?.faceUrl,
  }
}

/** 更新业主记录。 */
function updateOwner(data: UpdateOwnerPayload): OwnerMember | undefined {
  const owner = ownerList.find(item => item.memberId === data.memberId)

  if (!owner) {
    return undefined
  }

  Object.assign(owner, {
    ...data,
    ownerTypeName: ownerTypeNameMap[data.ownerTypeCd] || owner.ownerTypeName,
    faceUrl: data.ownerPhotoUrl || owner.faceUrl,
  })

  return owner
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
