import { describe, expect, test } from 'vitest'
import {
  createResourceEndpointDefinitions,
  resourceRuntimeEndpointDefinitions,
} from '../../../server/modules/resource/endpoints'
import { createResourceMockRepository } from '../../../server/modules/resource/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('resource endpoints', () => {
  test('registers shared resource endpoints', () => {
    const registry = createEndpointRegistry(
      createResourceEndpointDefinitions(createResourceMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/resourceStore.listResourceStores')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/resourceStore.saveAllocationStorehouse')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/resourceStore.saveResourceScrap')).toBeTruthy()
  })

  test('keeps duplicate legacy URLs out of the Nitro priority layer', () => {
    const runtimeUrls = resourceRuntimeEndpointDefinitions.map(item => item.url)

    expect(runtimeUrls).not.toContain('/app/resourceStore.listResourceStores')
    expect(runtimeUrls).not.toContain('/app/resourceStoreType.listResourceStoreTypes')
    expect(runtimeUrls).not.toContain('/app/purchase/purchaseApply')
    expect(runtimeUrls).toContain('/app/resourceStore.listStorehouses')
  })

  test('keeps resource query response structures stable', async () => {
    const registry = createEndpointRegistry(
      createResourceEndpointDefinitions(createResourceMockRepository()),
    )

    const storeHouseResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/resourceStore.listStorehouses',
      query: {
        page: 1,
        row: 10,
      },
    })

    const purchaseListResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/purchaseApply.listPurchaseApplys',
      query: {
        page: 1,
        row: 10,
      },
    })

    const myResourceResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/resourceStore.queryMyResourceStoreInfo',
      query: {
        page: 1,
        row: 10,
      },
    })

    expect(Array.isArray(storeHouseResponse.data.list)).toBe(true)
    expect(Array.isArray(purchaseListResponse.data.list)).toBe(true)
    expect(Array.isArray(myResourceResponse.data.list)).toBe(true)
  })

  test('persists create, audit and delete mutations through shared endpoints', async () => {
    const registry = createEndpointRegistry(
      createResourceEndpointDefinitions(createResourceMockRepository()),
    )

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/purchase/purchaseApply',
      body: {
        resourceStores: [
          { resId: 'RES_001', resName: '办公桌', resCode: 'OFFICE_001', price: 599, quantity: 2 },
        ],
        description: '新增采购申请',
        resOrderType: '10000',
      },
    })

    const purchaseListResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/purchaseApply.listPurchaseApplys',
      query: {
        page: 1,
        row: 10,
      },
    })
    const createdApply = purchaseListResponse.data.list[0]

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/purchaseApply.auditApplyOrder',
      body: {
        taskId: 'TASK_001',
        status: '1200',
      },
    })

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/purchaseApply.deletePurchaseApply',
      body: {
        applyOrderId: createdApply.applyOrderId,
      },
    })

    const refreshedPurchaseListResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/purchaseApply.listPurchaseApplys',
      query: {
        page: 1,
        row: 10,
      },
    })

    const auditTaskResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/purchaseApply.listMyAuditOrders',
      query: {
        page: 1,
        row: 10,
      },
    })

    expect(refreshedPurchaseListResponse.data.list.some((item: any) => item.applyOrderId === createdApply.applyOrderId)).toBe(false)
    expect(auditTaskResponse.data.list[0]).toMatchObject({
      taskId: 'TASK_001',
      state: 1300,
      stateName: '已完成',
    })
  })
})
