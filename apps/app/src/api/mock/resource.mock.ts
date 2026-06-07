/**
 * 资源管理模块 Mock 接口。
 * 本文件维护 app 本地 mock 数据，避免继续依赖旧内置 Nitro server。
 */

import type {
  AllocationItem,
  ApplyItem,
  AuditTask,
  ResourceStore,
  ResourceStoreType,
  StoreHouse,
} from '../resource'
import { createPaginationResponse, defineUniAppMock, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

export const resourceMockEndpointUrls = [
  '/app/resourceStore.listResourceStores',
  '/app/resourceStore.listStorehouses',
  '/app/purchaseApply.listPurchaseApplys',
  '/app/itemRelease.listItemRelease',
  '/app/resourceStore.listAllocationStorehouseApplys',
  '/app/purchaseApply.listMyAuditOrders',
  '/app/itemRelease.queryUndoItemRelease',
  '/app/resourceStore.listAllocationStoreAuditOrders',
  '/app/resourceStoreType.listResourceStoreTypes',
  '/app/purchase/purchaseApply',
  '/app/collection/resourceOut',
  '/app/resourceStore.saveAllocationStorehouse',
  '/app/purchaseApply.auditApplyOrder',
  '/app/itemRelease.auditUndoItemRelease',
  '/app/resourceStore.auditAllocationStoreOrder',
  '/app/purchase/resourceEnter',
  '/app/purchaseApply.deletePurchaseApply',
  '/app/resourceStore.deleteAllocationStorehouse',
  '/app/resourceStore.allocationStoreEnter',
  '/app/resourceStore.saveAllocationUserStorehouse',
  '/app/resourceStore.listAllocationStorehouses',
  '/app/resourceStore.queryMyResourceStoreInfo',
  '/app/resourceStore.saveResourceReturn',
  '/app/resourceStore.saveResourceScrap',
] as const

const resourceStores: ResourceStore[] = [
  {
    resId: 'RES_001',
    resName: '办公桌',
    resCode: 'OFFICE_001',
    parentRstName: '办公家具',
    rstName: '桌椅',
    price: 599,
    stock: 50,
    description: '标准办公桌，本地 mock 数据',
  },
  {
    resId: 'RES_002',
    resName: 'A4 打印纸',
    resCode: 'OFFICE_002',
    parentRstName: '办公用品',
    rstName: '纸张',
    price: 25,
    stock: 500,
    description: '500 张一包打印纸',
  },
  {
    resId: 'RES_003',
    resName: '投影仪',
    resCode: 'DEVICE_001',
    parentRstName: '电子设备',
    rstName: '会议设备',
    price: 2999,
    stock: 8,
    description: '会议室备用投影仪',
  },
]

const storehouses: StoreHouse[] = [
  {
    shId: 'SH_001',
    shName: '总部仓库',
    shCode: 'WH_001',
    address: '总部办公楼负一层',
    allowPurchase: 'ON',
  },
  {
    shId: 'SH_002',
    shName: '维修仓库',
    shCode: 'WH_002',
    address: '维修中心库房',
    allowPurchase: 'OFF',
  },
]

const purchaseApplys: ApplyItem[] = [
  {
    applyOrderId: 'PA_001',
    resourceNames: '办公桌、A4 打印纸',
    state: 1200,
    stateName: '待审核',
    createUserId: 'USER_001',
    createUserName: '张三',
    createTime: '2026-06-01 09:00:00',
    description: '办公补充采购',
  },
]

const itemReleaseApplys: ApplyItem[] = [
  {
    applyOrderId: 'IO_001',
    resourceNames: '投影仪',
    state: 1200,
    stateName: '待审核',
    createUserId: 'USER_002',
    createUserName: '李四',
    createTime: '2026-06-01 10:00:00',
    description: '会议活动领用',
  },
]

const allocationApplys: AllocationItem[] = [
  {
    allocationId: 'AL_001',
    resourceNames: 'A4 打印纸',
    state: 1200,
    stateName: '待审核',
    createUserId: 'USER_003',
    createUserName: '王五',
    createTime: '2026-06-01 11:00:00',
    fromShName: '总部仓库',
    toShName: '维修仓库',
    description: '维修中心补货',
  },
]

const auditTasks: AuditTask[] = [
  {
    taskId: 'TASK_PA_001',
    businessId: 'PA_001',
    businessType: '采购审核',
    state: 1200,
    stateName: '待审核',
    resourceNames: '办公桌、A4 打印纸',
    createUserId: 'USER_001',
    createUserName: '张三',
    createTime: '2026-06-01 09:00:00',
  },
  {
    taskId: 'TASK_IO_001',
    businessId: 'IO_001',
    businessType: '领用审核',
    state: 1200,
    stateName: '待审核',
    resourceNames: '投影仪',
    createUserId: 'USER_002',
    createUserName: '李四',
    createTime: '2026-06-01 10:00:00',
  },
  {
    taskId: 'TASK_AL_001',
    businessId: 'AL_001',
    businessType: '调拨审核',
    state: 1200,
    stateName: '待审核',
    resourceNames: 'A4 打印纸',
    createUserId: 'USER_003',
    createUserName: '王五',
    createTime: '2026-06-01 11:00:00',
  },
]

const resourceStoreTypes: ResourceStoreType[] = [
  { rstId: 'RST_001', rstName: '办公家具', parentRstId: '' },
  { rstId: 'RST_002', rstName: '办公用品', parentRstId: '' },
  { rstId: 'RST_003', rstName: '电子设备', parentRstId: '' },
]

const myResourceStores: ResourceStore[] = [
  {
    ...resourceStores[0],
    stock: 2,
    unitCodeName: '张',
    miniStock: 2,
    miniUnitCodeName: '张',
    isFixed: 'Y',
    isFixedName: '是',
    userId: 'USER_001',
    userName: '张三',
  },
  {
    ...resourceStores[1],
    stock: 10,
    unitCodeName: '包',
    miniStock: 10,
    miniUnitCodeName: '包',
    isFixed: 'N',
    isFixedName: '否',
    userId: 'USER_002',
    userName: '李四',
  },
]

export default defineUniAppMock([
  {
    url: '/app/resourceStore.listResourceStores',
    method: 'GET',
    body: (context: MockContext = {}) => successResponse(paginate(resourceStores, context)),
  },
  {
    url: '/app/resourceStore.listStorehouses',
    method: 'GET',
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const allowPurchase = asOptionalString(params.allowPurchase)
      const list = allowPurchase
        ? storehouses.filter(item => item.allowPurchase === allowPurchase)
        : storehouses

      return successResponse(paginate(list, context))
    },
  },
  {
    url: '/app/purchaseApply.listPurchaseApplys',
    method: 'GET',
    body: (context: MockContext = {}) => successResponse(paginate(purchaseApplys, context)),
  },
  {
    url: '/app/itemRelease.listItemRelease',
    method: 'GET',
    body: (context: MockContext = {}) => successResponse(paginate(itemReleaseApplys, context)),
  },
  {
    url: '/app/resourceStore.listAllocationStorehouseApplys',
    method: 'GET',
    body: (context: MockContext = {}) => successResponse(paginate(allocationApplys, context)),
  },
  {
    url: '/app/purchaseApply.listMyAuditOrders',
    method: 'GET',
    body: (context: MockContext = {}) => successResponse(
      paginate(auditTasks.filter(item => item.businessType === '采购审核'), context),
    ),
  },
  {
    url: '/app/itemRelease.queryUndoItemRelease',
    method: 'GET',
    body: (context: MockContext = {}) => successResponse(
      paginate(auditTasks.filter(item => item.businessType === '领用审核'), context),
    ),
  },
  {
    url: '/app/resourceStore.listAllocationStoreAuditOrders',
    method: 'GET',
    body: (context: MockContext = {}) => successResponse(
      paginate(auditTasks.filter(item => item.businessType === '调拨审核'), context),
    ),
  },
  {
    url: '/app/resourceStoreType.listResourceStoreTypes',
    method: 'GET',
    body: (context: MockContext = {}) => successResponse(paginate(resourceStoreTypes, context)),
  },
  {
    url: '/app/purchase/purchaseApply',
    method: 'POST',
    body: (context: MockContext = {}) => {
      purchaseApplys.unshift(createApplyItem('PA', context.body))

      return successResponse(null, '提交成功')
    },
  },
  {
    url: '/app/collection/resourceOut',
    method: 'POST',
    body: (context: MockContext = {}) => {
      itemReleaseApplys.unshift(createApplyItem('IO', context.body))

      return successResponse(null, '提交成功')
    },
  },
  {
    url: '/app/resourceStore.saveAllocationStorehouse',
    method: 'POST',
    body: (context: MockContext = {}) => {
      allocationApplys.unshift(createAllocationItem(context.body))

      return successResponse(null, '提交成功')
    },
  },
  {
    url: '/app/purchaseApply.auditApplyOrder',
    method: 'POST',
    body: (context: MockContext = {}) => successResponse(auditTask(context.body), '审核成功'),
  },
  {
    url: '/app/itemRelease.auditUndoItemRelease',
    method: 'POST',
    body: (context: MockContext = {}) => successResponse(auditTask(context.body), '审核成功'),
  },
  {
    url: '/app/resourceStore.auditAllocationStoreOrder',
    method: 'POST',
    body: (context: MockContext = {}) => successResponse(auditTask(context.body), '审核成功'),
  },
  {
    url: '/app/purchase/resourceEnter',
    method: 'POST',
    body: () => successResponse(null, '入库成功'),
  },
  {
    url: '/app/purchaseApply.deletePurchaseApply',
    method: 'POST',
    body: (context: MockContext = {}) => {
      removeById(purchaseApplys, 'applyOrderId', asOptionalString(context.body?.applyOrderId))

      return successResponse(null, '取消成功')
    },
  },
  {
    url: '/app/resourceStore.deleteAllocationStorehouse',
    method: 'POST',
    body: (context: MockContext = {}) => {
      removeById(allocationApplys, 'allocationId', asOptionalString(context.body?.allocationId))

      return successResponse(null, '取消成功')
    },
  },
  {
    url: '/app/resourceStore.allocationStoreEnter',
    method: 'POST',
    body: () => successResponse(null, '调拨入库成功'),
  },
  {
    url: '/app/resourceStore.saveAllocationUserStorehouse',
    method: 'POST',
    body: () => successResponse(null, '转赠成功'),
  },
  {
    url: '/app/resourceStore.listAllocationStorehouses',
    method: 'GET',
    body: (context: MockContext = {}) => successResponse(paginate(resourceStores, context)),
  },
  {
    url: '/app/resourceStore.queryMyResourceStoreInfo',
    method: 'GET',
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const resName = asOptionalString(params.resName)
      const searchUserName = asOptionalString(params.searchUserName)
      const list = myResourceStores.filter((item) => {
        const matchesResource = !resName || item.resName.includes(resName)
        const matchesUser = !searchUserName || item.userName?.includes(searchUserName)

        return matchesResource && matchesUser
      })

      return successResponse(paginate(list, context))
    },
  },
  {
    url: '/app/resourceStore.saveResourceReturn',
    method: 'POST',
    body: () => successResponse(null, '退还成功'),
  },
  {
    url: '/app/resourceStore.saveResourceScrap',
    method: 'POST',
    body: () => successResponse(null, '报废成功'),
  },
])

function paginate<T>(list: T[], context: MockContext) {
  const params = getRequestParams(context)
  const page = asPositiveNumber(params.page, 1)
  const row = asPositiveNumber(params.row, 10)
  const result = createPaginationResponse(cloneValue(list), page, row)

  return {
    ...result,
    row,
  }
}

function createApplyItem(prefix: 'IO' | 'PA', body: Record<string, unknown> = {}): ApplyItem {
  return {
    applyOrderId: `${prefix}_${Date.now()}`,
    resourceNames: readResourceNames(body.resourceStores),
    state: 1200,
    stateName: '待审核',
    createUserId: 'USER_CURRENT',
    createUserName: '当前用户',
    createTime: '2026-06-06 12:00:00',
    description: asOptionalString(body.description) || '',
  }
}

function createAllocationItem(body: Record<string, unknown> = {}): AllocationItem {
  return {
    allocationId: `AL_${Date.now()}`,
    resourceNames: readResourceNames(body.resourceStores),
    state: 1200,
    stateName: '待审核',
    createUserId: 'USER_CURRENT',
    createUserName: '当前用户',
    createTime: '2026-06-06 12:00:00',
    fromShName: '总部仓库',
    toShName: '维修仓库',
    description: asOptionalString(body.description) || '',
  }
}

function auditTask(body: Record<string, unknown> = {}) {
  const taskId = asOptionalString(body.taskId)
  const task = auditTasks.find(item => item.taskId === taskId)

  if (task) {
    task.state = asOptionalString(body.status) === '1400' ? 1400 : 1300
    task.stateName = task.state === 1400 ? '已拒绝' : '已完成'
  }

  return null
}

function removeById<T>(list: T[], key: keyof T, id?: string) {
  const index = list.findIndex(item => item[key] === id)

  if (index >= 0) {
    list.splice(index, 1)
  }
}

function readResourceNames(value: unknown): string {
  if (!Array.isArray(value)) {
    return ''
  }

  return value
    .map(item => asOptionalString((item as Record<string, unknown>).resName))
    .filter(Boolean)
    .join('、')
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

function cloneValue<T>(value: T): T {
  return structuredClone(value)
}
