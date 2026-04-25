import { describe, expect, test } from 'vitest'
import {
  createFloorEndpointDefinitions,
} from '../../../server/modules/floor/endpoints'
import { createFloorMockRepository } from '../../../server/modules/floor/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('floor endpoints', () => {
  test('registers the legacy floor list and detail URLs', () => {
    const registry = createEndpointRegistry(
      createFloorEndpointDefinitions(createFloorMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/floor.queryFloors')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/floor.queryFloorDetail')).toBeTruthy()
  })

  test('keeps the floor list and detail response structures stable', async () => {
    const registry = createEndpointRegistry(
      createFloorEndpointDefinitions(createFloorMockRepository()),
    )

    const listResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/floor.queryFloors',
      query: {
        communityId: 'COMM_001',
        page: 1,
        row: 5,
      },
    })

    const detailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/floor.queryFloorDetail',
      query: {
        floorId: listResponse.data.list[0].floorId,
      },
    })

    expect(Array.isArray(listResponse.data.list)).toBe(true)
    expect(listResponse.data.list.length).toBeGreaterThan(0)
    expect(detailResponse).toMatchObject({
      success: true,
      data: {
        floorId: listResponse.data.list[0].floorId,
      },
    })
  })
})
