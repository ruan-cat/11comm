import { describe, expect, test } from 'vitest'
import {
  createUnitEndpointDefinitions,
} from '../../../server/modules/unit/endpoints'
import { createUnitMockRepository } from '../../../server/modules/unit/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('unit endpoints', () => {
  test('registers the legacy unit list and detail URLs', () => {
    const registry = createEndpointRegistry(
      createUnitEndpointDefinitions(createUnitMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/unit.queryUnits')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/unit.queryUnitDetail')).toBeTruthy()
  })

  test('keeps the unit list and detail response structures stable', async () => {
    const registry = createEndpointRegistry(
      createUnitEndpointDefinitions(createUnitMockRepository()),
    )

    const listResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/unit.queryUnits',
      query: {
        communityId: 'COMM_001',
        floorId: 'F_COMM_001_001',
        page: 1,
        row: 5,
      },
    })

    const detailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/unit.queryUnitDetail',
      query: {
        unitId: listResponse.data.list[0].unitId,
      },
    })

    expect(Array.isArray(listResponse.data.list)).toBe(true)
    expect(listResponse.data.list.length).toBeGreaterThan(0)
    expect(detailResponse).toMatchObject({
      success: true,
      data: {
        unitId: listResponse.data.list[0].unitId,
      },
    })
  })
})
