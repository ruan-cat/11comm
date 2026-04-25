import { describe, expect, test } from 'vitest'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'
import { runtimeEndpointDefinitions } from '../../../server/shared/runtime/runtime-endpoints'

describe('runtime endpoints', () => {
  test('registers shared module endpoints alongside legacy compatibility routes', () => {
    const registry = createEndpointRegistry(runtimeEndpointDefinitions)

    expect(findEndpointDefinition(registry, 'GET', '/app/staff/STAFF_001')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/activities.listActivitiess')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/fee.queryFeeDetail')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/callComponent/core/list')).toBeTruthy()
  })

  test('dispatches non-conflict endpoints through shared module registrations', async () => {
    const registry = createEndpointRegistry(runtimeEndpointDefinitions)

    const response = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/staff/STAFF_001',
    })

    expect(response).toMatchObject({
      success: true,
      data: {
        id: 'STAFF_001',
      },
    })
  })
})
