import { describe, expect, test } from 'vitest'
import {
  createVisitEndpointDefinitions,
} from '../../../server/modules/visit/endpoints'
import { createVisitMockRepository } from '../../../server/modules/visit/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('visit endpoints', () => {
  test('registers the legacy visit list, detail, and audit URLs', () => {
    const registry = createEndpointRegistry(
      createVisitEndpointDefinitions(createVisitMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/visit.getVisit')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/visit.getVisitDetail')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/visit.auditVisit')).toBeTruthy()
  })

  test('keeps visit list, detail, and audit responses stable', async () => {
    const registry = createEndpointRegistry(
      createVisitEndpointDefinitions(createVisitMockRepository()),
    )

    const listResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/visit.getVisit',
      query: {
        page: 1,
        row: 5,
      },
    })

    const visitId = listResponse.data.list[0].visitId as string

    const auditResponse = await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/visit.auditVisit',
      body: {
        visitId,
        state: '1',
        msg: '瀹℃牳閫氳繃',
      },
    })

    const detailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/visit.getVisitDetail',
      query: {
        visitId,
        page: 1,
        row: 1,
      },
    })

    expect(Array.isArray(listResponse.data.list)).toBe(true)
    expect(listResponse.data.list.length).toBeGreaterThan(0)
    expect(auditResponse).toMatchObject({
      success: true,
      data: {
        success: true,
      },
    })
    expect(detailResponse.data.list[0]).toMatchObject({
      visitId,
      state: '1',
      stateName: '审核通过',
    })
  })
})
