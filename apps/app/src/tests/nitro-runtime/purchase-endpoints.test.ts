import { describe, expect, test } from 'vitest'
import {
  createPurchaseEndpointDefinitions,
  purchaseRuntimeEndpointDefinitions,
} from '../../../server/modules/purchase/endpoints'
import { createPurchaseMockRepository } from '../../../server/modules/purchase/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('purchase endpoints', () => {
  test('registers shared purchase endpoints', () => {
    const registry = createEndpointRegistry(
      createPurchaseEndpointDefinitions(createPurchaseMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/resourceStore.listResourceStores')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/purchase/purchaseApply')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/purchase/urgentPurchaseApply')).toBeTruthy()
  })

  test('keeps conflicting legacy URLs out of the Nitro priority layer', () => {
    const runtimeUrls = purchaseRuntimeEndpointDefinitions.map(item => item.url)

    expect(runtimeUrls).not.toContain('/app/resourceStore.listResourceStores')
    expect(runtimeUrls).not.toContain('/app/purchase/purchaseApply')
    expect(runtimeUrls).toContain('/app/purchase/urgentPurchaseApply')
  })

  test('keeps purchase response structures stable', async () => {
    const registry = createEndpointRegistry(
      createPurchaseEndpointDefinitions(createPurchaseMockRepository()),
    )

    const resourceResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/resourceStore.listResourceStores',
      query: {
        page: 1,
        row: 10,
      },
    })

    const applyResponse = await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/purchase/purchaseApply',
      body: {
        resourceStores: [
          {
            resId: 'RES_001',
            resName: '鍔炲叕妗?',
            resCode: 'OFFICE_001',
            price: 599,
            quantity: 2,
          },
        ],
        description: '鏂板閲囪喘鐢宠',
        resOrderType: '10000',
      },
    })

    expect(Array.isArray(resourceResponse.data.resourceStores)).toBe(true)
    expect(resourceResponse.data.resourceStores.length).toBeGreaterThan(0)
    expect(applyResponse.data.applyId).toEqual(expect.any(String))
  })
})
