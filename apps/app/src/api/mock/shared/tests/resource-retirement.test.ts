import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import resourceMocks, * as resourceMockModule from '../../resource.mock'

const mockSourceFile = fileURLToPath(new URL('../../resource.mock.ts', import.meta.url))

const legacyResourceUrls = [
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
]

describe('resource local mock retirement', () => {
  test('does not depend on old app server modules or adapter', () => {
    const source = readFileSync(mockSourceFile, 'utf8')

    expect(source).not.toContain('server/modules')
    expect(source).not.toContain('mock-definition-adapter')
  })

  test('exports legacy resource endpoint urls from local mock module', () => {
    expect(resourceMockModule.resourceMockEndpointUrls).toEqual(legacyResourceUrls)
  })

  test('exports local handlers for all legacy resource urls', () => {
    const urls = resourceMocks.map(mock => mock.url)

    expect(urls).toEqual(expect.arrayContaining(legacyResourceUrls))
    expect(urls).toHaveLength(legacyResourceUrls.length)
  })
})
