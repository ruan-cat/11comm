import type { EndpointDefinition } from './endpoint-registry.ts'
import { feeEndpointDefinitions } from '../../modules/fee/endpoints.ts'
import { propertyApplicationEndpointDefinitions } from '../../modules/property-application/endpoints.ts'
import { purchaseEndpointDefinitions } from '../../modules/purchase/endpoints.ts'
import { repairEndpointDefinitions } from '../../modules/repair/endpoints.ts'
import { resourceEndpointDefinitions } from '../../modules/resource/endpoints.ts'
import { successResponse } from './response-builder.ts'

/** 仅保留仍需合并兼容的 legacy 冲突 URL。 */
export const legacyEndpointDefinitions: EndpointDefinition[] = [
  createMergedFeeDetailDefinition(),
  createMergedCoreListDefinition(),
  createMergedResourceStoresDefinition(),
  createMergedPurchaseApplyDefinition(),
  createMergedResourceStoreTypesDefinition(),
]

/** 创建 `/app/fee.queryFeeDetail` 的兼容型响应。 */
function createMergedFeeDetailDefinition(): EndpointDefinition {
  const feeDefinition = requireDefinition(
    feeEndpointDefinitions,
    '/app/fee.queryFeeDetail',
    'fee',
  )
  const propertyDefinition = requireDefinition(
    propertyApplicationEndpointDefinitions,
    '/app/fee.queryFeeDetail',
    'property-application',
  )

  return {
    url: '/app/fee.queryFeeDetail',
    method: mergeMethods(feeDefinition.method, propertyDefinition.method),
    handler: async (context) => {
      const feeResponse = await feeDefinition.handler(context)
      const propertyResponse = await propertyDefinition.handler(context)
      const feeData = asObject(feeResponse?.data)
      const propertyData = asObject(propertyResponse?.data)
      const list = asArray(feeData.list)
      const feeDetails = asArray(propertyData.feeDetails, list)

      return successResponse(
        {
          ...feeData,
          ...propertyData,
          list,
          feeDetails,
        },
        feeResponse?.message || propertyResponse?.message || '查询成功',
      )
    },
  }
}

/** 创建 `/callComponent/core/list` 的兼容型响应。 */
function createMergedCoreListDefinition(): EndpointDefinition {
  const repairDefinition = requireDefinition(
    repairEndpointDefinitions,
    '/callComponent/core/list',
    'repair',
  )
  const propertyDefinition = requireDefinition(
    propertyApplicationEndpointDefinitions,
    '/callComponent/core/list',
    'property-application',
  )

  return {
    url: '/callComponent/core/list',
    method: mergeMethods(repairDefinition.method, propertyDefinition.method),
    handler: async (context) => {
      if (context.params.domain) {
        const repairResponse = await repairDefinition.handler(context)
        const repairData = asObject(repairResponse?.data)
        const list = asArray(repairData.data, repairData.list)

        return successResponse(
          {
            ...repairData,
            list,
            data: list,
          },
          repairResponse?.message || '查询成功',
        )
      }

      return await propertyDefinition.handler(context)
    },
  }
}

/** 创建 `/app/resourceStore.listResourceStores` 的兼容型响应。 */
function createMergedResourceStoresDefinition(): EndpointDefinition {
  const purchaseDefinition = requireDefinition(
    purchaseEndpointDefinitions,
    '/app/resourceStore.listResourceStores',
    'purchase',
  )
  const resourceDefinition = requireDefinition(
    resourceEndpointDefinitions,
    '/app/resourceStore.listResourceStores',
    'resource',
  )

  return {
    url: '/app/resourceStore.listResourceStores',
    method: mergeMethods(purchaseDefinition.method, resourceDefinition.method),
    handler: async (context) => {
      const purchaseResponse = await purchaseDefinition.handler(context)
      const resourceResponse = await resourceDefinition.handler(context)
      const purchaseData = asObject(purchaseResponse?.data)
      const resourceData = asObject(resourceResponse?.data)
      const list = asArray(resourceData.list, purchaseData.resourceStores)
      const resourceStores = asArray(purchaseData.resourceStores, list)

      return successResponse(
        {
          ...resourceData,
          list,
          total: resourceData.total ?? resourceStores.length,
          page: resourceData.page ?? Number(context.params.page || 1),
          row: resourceData.row ?? Number(context.params.row || resourceStores.length || 0),
          resourceStores,
        },
        resourceResponse?.message || purchaseResponse?.message || '查询成功',
      )
    },
  }
}

/** 创建 `/app/purchase/purchaseApply` 的兼容型响应。 */
function createMergedPurchaseApplyDefinition(): EndpointDefinition {
  const purchaseDefinition = requireDefinition(
    purchaseEndpointDefinitions,
    '/app/purchase/purchaseApply',
    'purchase',
  )
  const resourceDefinition = requireDefinition(
    resourceEndpointDefinitions,
    '/app/purchase/purchaseApply',
    'resource',
  )

  return {
    url: '/app/purchase/purchaseApply',
    method: mergeMethods(purchaseDefinition.method, resourceDefinition.method),
    handler: async (context) => {
      const purchaseResponse = await purchaseDefinition.handler(context)
      const resourceResponse = await resourceDefinition.handler(context)

      if (purchaseResponse?.success === false) {
        return purchaseResponse
      }

      if (resourceResponse?.success === false) {
        return resourceResponse
      }

      return purchaseResponse || resourceResponse || successResponse({ success: true }, '提交成功')
    },
  }
}

/** 创建 `/app/resourceStoreType.listResourceStoreTypes` 的兼容型响应。 */
function createMergedResourceStoreTypesDefinition(): EndpointDefinition {
  const repairDefinition = requireDefinition(
    repairEndpointDefinitions,
    '/app/resourceStoreType.listResourceStoreTypes',
    'repair',
  )
  const resourceDefinition = requireDefinition(
    resourceEndpointDefinitions,
    '/app/resourceStoreType.listResourceStoreTypes',
    'resource',
  )

  return {
    url: '/app/resourceStoreType.listResourceStoreTypes',
    method: mergeMethods(repairDefinition.method, resourceDefinition.method),
    handler: async (context) => {
      const wantsPagination = context.params.page !== undefined || context.params.row !== undefined
      if (wantsPagination) {
        return await resourceDefinition.handler(context)
      }

      return await repairDefinition.handler(context)
    },
  }
}

/** 从共享模块端点集合中挑出 legacy 兼容层需要的冲突 URL。 */
function requireDefinition(
  definitions: EndpointDefinition[],
  url: string,
  sourceLabel: string,
): EndpointDefinition {
  const definition = definitions.find(item => item.url === url)
  if (!definition) {
    throw new Error(`Missing legacy endpoint definition: ${sourceLabel} -> ${url}`)
  }

  return definition
}

/** 合并两个 endpoint 的 method 定义，避免重复值。 */
function mergeMethods(left: string | string[], right: string | string[]): string[] {
  return Array.from(new Set([...toMethodArray(left), ...toMethodArray(right)]))
}

/** 统一把 method 定义转换成数组。 */
function toMethodArray(method: string | string[]): string[] {
  return Array.isArray(method) ? method : [method]
}

/** 把未知响应数据收敛成对象。 */
function asObject(value: unknown): Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Record<string, any>
    : {}
}

/** 把未知响应数据收敛成数组。 */
function asArray(value: unknown, fallback: unknown[] = []): unknown[] {
  return Array.isArray(value) ? value : fallback
}
