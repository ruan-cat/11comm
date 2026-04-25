import type {
  AuditReq,
  SaveAllocationReq,
  SaveItemOutReq,
} from '../../../src/api/resource.ts'
import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { ResourceModuleRepository } from './repository.ts'
import { successResponse } from '../../shared/runtime/response-builder.ts'
import { resourceMockRepository } from './repository.ts'

const resourceLegacyConflictUrls = new Set([
  '/app/resourceStore.listResourceStores',
  '/app/resourceStoreType.listResourceStoreTypes',
  '/app/purchase/purchaseApply',
])

/** 创建 `resource` 模块的共享 endpoint 定义。 */
export function createResourceEndpointDefinitions(
  repository: ResourceModuleRepository = resourceMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/resourceStore.listResourceStores',
      method: 'GET',
      handler: ({ params }) => successResponse(repository.listResourceStores({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
      })),
    },
    {
      url: '/app/resourceStore.listStorehouses',
      method: 'GET',
      handler: ({ params }) => successResponse(repository.listStorehouses({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        allowPurchase: asOptionalString(params.allowPurchase),
      })),
    },
    {
      url: '/app/purchaseApply.listPurchaseApplys',
      method: 'GET',
      handler: ({ params }) => successResponse(repository.queryPurchaseApplyList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
      })),
    },
    {
      url: '/app/itemRelease.listItemRelease',
      method: 'GET',
      handler: ({ params }) => successResponse(repository.queryItemOutList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
      })),
    },
    {
      url: '/app/resourceStore.listAllocationStorehouseApplys',
      method: 'GET',
      handler: ({ params }) => successResponse(repository.listAllocationStorehouseApplys({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
      })),
    },
    {
      url: '/app/purchaseApply.listMyAuditOrders',
      method: 'GET',
      handler: ({ params }) => successResponse(repository.listMyAuditOrders({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
      })),
    },
    {
      url: '/app/itemRelease.queryUndoItemRelease',
      method: 'GET',
      handler: ({ params }) => successResponse(repository.queryUndoItemRelease({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
      })),
    },
    {
      url: '/app/resourceStore.listAllocationStoreAuditOrders',
      method: 'GET',
      handler: ({ params }) => successResponse(repository.listAllocationStoreAuditOrders({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
      })),
    },
    {
      url: '/app/resourceStoreType.listResourceStoreTypes',
      method: 'GET',
      handler: () => successResponse(repository.listResourceStoreTypes()),
    },
    {
      url: '/app/purchase/purchaseApply',
      method: 'POST',
      handler: ({ body }) => successResponse(
        repository.purchaseApply(body as { description?: string, resourceStores?: Array<{ resName: string }> }) ? null : null,
        '提交成功',
      ),
    },
    {
      url: '/app/collection/resourceOut',
      method: 'POST',
      handler: ({ body }) => successResponse(
        repository.collectionResourceOut(body as SaveItemOutReq) ? null : null,
        '提交成功',
      ),
    },
    {
      url: '/app/resourceStore.saveAllocationStorehouse',
      method: 'POST',
      handler: ({ body }) => successResponse(
        repository.saveAllocationStorehouse(body as SaveAllocationReq) ? null : null,
        '提交成功',
      ),
    },
    {
      url: '/app/purchaseApply.auditApplyOrder',
      method: 'POST',
      handler: ({ body }) => successResponse(
        repository.auditApplyOrder(body as AuditReq) ? null : null,
        '审核成功',
      ),
    },
    {
      url: '/app/itemRelease.auditUndoItemRelease',
      method: 'POST',
      handler: ({ body }) => successResponse(
        repository.auditUndoItemRelease(body as AuditReq) ? null : null,
        '审核成功',
      ),
    },
    {
      url: '/app/resourceStore.auditAllocationStoreOrder',
      method: 'POST',
      handler: ({ body }) => successResponse(
        repository.auditAllocationStoreOrder(body as AuditReq) ? null : null,
        '审核成功',
      ),
    },
    {
      url: '/app/purchase/resourceEnter',
      method: 'POST',
      handler: () => successResponse(
        repository.purchaseResourceEnter() ? null : null,
        '入库成功',
      ),
    },
    {
      url: '/app/purchaseApply.deletePurchaseApply',
      method: 'POST',
      handler: ({ body }) => successResponse(
        repository.deletePurchaseApply(asOptionalString(body?.applyOrderId)) ? null : null,
        '取消成功',
      ),
    },
    {
      url: '/app/resourceStore.deleteAllocationStorehouse',
      method: 'POST',
      handler: ({ body }) => successResponse(
        repository.deleteAllocationStorehouse(asOptionalString(body?.allocationId)) ? null : null,
        '取消成功',
      ),
    },
    {
      url: '/app/resourceStore.allocationStoreEnter',
      method: 'POST',
      handler: () => successResponse(
        repository.allocationStoreEnter() ? null : null,
        '调拨入库成功',
      ),
    },
    {
      url: '/app/resourceStore.saveAllocationUserStorehouse',
      method: 'POST',
      handler: () => successResponse(
        repository.saveAllocationUserStorehouse() ? null : null,
        '转赠成功',
      ),
    },
    {
      url: '/app/resourceStore.listAllocationStorehouses',
      method: 'GET',
      handler: ({ params }) => successResponse(repository.listAllocationStorehouses({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
      })),
    },
    {
      url: '/app/resourceStore.queryMyResourceStoreInfo',
      method: 'GET',
      handler: ({ params }) => successResponse(repository.queryMyResourceStoreInfo({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        resName: asOptionalString(params.resName),
        searchUserName: asOptionalString(params.searchUserName),
      })),
    },
    {
      url: '/app/resourceStore.saveResourceReturn',
      method: 'POST',
      handler: () => successResponse(
        repository.saveResourceReturn() ? null : null,
        '退还成功',
      ),
    },
    {
      url: '/app/resourceStore.saveResourceScrap',
      method: 'POST',
      handler: () => successResponse(
        repository.saveResourceScrap() ? null : null,
        '报废成功',
      ),
    },
  ]
}

/** 默认供 shared registry 直接注册的 resource 端点集合。 */
export const resourceEndpointDefinitions = createResourceEndpointDefinitions()

/** resource 的重复旧 URL 继续交由 legacy compatibility 合并处理。 */
export const resourceRuntimeEndpointDefinitions = resourceEndpointDefinitions.filter(
  definition => !resourceLegacyConflictUrls.has(definition.url),
)

/** 把未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}
