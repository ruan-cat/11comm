import { describe, expect, test } from 'vitest'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'
import { legacyEndpointDefinitions } from '../../../server/shared/runtime/legacy-endpoints'

describe('legacy endpoints', () => {
  test('only keeps merged compatibility routes in the legacy layer', () => {
    const registry = createEndpointRegistry(legacyEndpointDefinitions)

    expect(findEndpointDefinition(registry, 'GET', '/app/staff/STAFF_001')).toBeUndefined()
    expect(findEndpointDefinition(registry, 'POST', '/app/activities.listActivitiess')).toBeUndefined()
    expect(findEndpointDefinition(registry, 'GET', '/app/fee.queryFeeDetail')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/callComponent/core/list')).toBeTruthy()
  })

  test('keeps fee detail endpoint compatible with fee and property application callers', async () => {
    const registry = createEndpointRegistry(legacyEndpointDefinitions)

    const response = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/fee.queryFeeDetail',
      query: {
        page: 1,
        row: 1,
        communityId: 'COMM_001',
        feeId: 'FEE_001',
      },
    })

    expect(Array.isArray(response.data.list)).toBe(true)
    expect(Array.isArray(response.data.feeDetails)).toBe(true)
  })

  test('switches dictionary endpoint payload shape by caller params', async () => {
    const registry = createEndpointRegistry(legacyEndpointDefinitions)

    const propertyResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/callComponent/core/list',
      query: {
        name: 'apply_room_discount',
        type: 'state',
      },
    })

    const repairResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/callComponent/core/list',
      query: {
        domain: 'repair_type',
      },
    })

    expect(Array.isArray(propertyResponse.data)).toBe(true)
    expect(Array.isArray(repairResponse.data.list)).toBe(true)
    expect(Array.isArray(repairResponse.data.data)).toBe(true)
  })

  test('switches resource type endpoint payload shape by query shape', async () => {
    const registry = createEndpointRegistry(legacyEndpointDefinitions)

    const repairResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/resourceStoreType.listResourceStoreTypes',
      query: {
        parentId: 'RST_001',
      },
    })

    const resourceResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/resourceStoreType.listResourceStoreTypes',
      query: {
        page: 1,
        row: 5,
      },
    })

    expect(Array.isArray(repairResponse.data)).toBe(true)
    expect(Array.isArray(resourceResponse.data.list)).toBe(true)
  })

  test('keeps resource store list endpoint compatible with purchase and resource callers', async () => {
    const registry = createEndpointRegistry(legacyEndpointDefinitions)

    const response = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/resourceStore.listResourceStores',
      query: {
        page: 1,
        row: 2,
      },
    })

    expect(Array.isArray(response.data.list)).toBe(true)
    expect(Array.isArray(response.data.resourceStores)).toBe(true)
  })
})
