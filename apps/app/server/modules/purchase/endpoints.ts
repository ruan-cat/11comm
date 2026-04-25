import type { SavePurchaseApplyReq, SaveUrgentPurchaseApplyReq } from '../../../src/api/purchase.ts'
import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { PurchaseModuleRepository } from './repository.ts'
import { errorResponse, successResponse } from '../../shared/runtime/response-builder.ts'
import { purchaseMockRepository } from './repository.ts'

const purchaseLegacyConflictUrls = new Set([
  '/app/resourceStore.listResourceStores',
  '/app/purchase/purchaseApply',
])

/** 创建 `purchase` 模块的共享 endpoint 定义。 */
export function createPurchaseEndpointDefinitions(
  repository: PurchaseModuleRepository = purchaseMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/resourceStore.listResourceStores',
      method: 'GET',
      handler: () => successResponse(
        {
          resourceStores: repository.listResourceStores(),
        },
        '查询成功',
      ),
    },
    {
      url: '/app/purchase/purchaseApply',
      method: 'POST',
      handler: ({ body }) => {
        const request = body as SavePurchaseApplyReq
        if (!request.resourceStores || request.resourceStores.length === 0) {
          return errorResponse('请选择采购物资', '400')
        }

        return successResponse(
          repository.savePurchaseApply(request),
          '提交成功',
        )
      },
    },
    {
      url: '/app/purchase/urgentPurchaseApply',
      method: 'POST',
      handler: ({ body }) => {
        const request = body as SaveUrgentPurchaseApplyReq
        if (!request.resourceStores || request.resourceStores.length === 0) {
          return errorResponse('请选择采购物资', '400')
        }

        if (!request.endUserName) {
          return errorResponse('请输入使用人', '400')
        }

        if (!request.endUserTel) {
          return errorResponse('请输入联系电话', '400')
        }

        if (!request.description) {
          return errorResponse('请输入申请说明', '400')
        }

        return successResponse(
          repository.saveUrgentPurchaseApply(request),
          '提交成功',
        )
      },
    },
  ]
}

/** 默认导出的 purchase 共享 endpoint 定义。 */
export const purchaseEndpointDefinitions = createPurchaseEndpointDefinitions()

/** purchase 的冲突 legacy URL 继续留给兼容层处理。 */
export const purchaseRuntimeEndpointDefinitions = purchaseEndpointDefinitions.filter(
  definition => !purchaseLegacyConflictUrls.has(definition.url),
)
