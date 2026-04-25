import { describe, expect, test } from 'vitest'
import { createEndpointRegistry, dispatchEndpoint, findEndpointDefinition } from '../../../server/shared/runtime/endpoint-registry'
import { pilotEndpointDefinitions } from '../../../server/shared/runtime/pilot-endpoints'

describe('pilot endpoints', () => {
  test('registers repair and work-order endpoints for nitro dispatcher', () => {
    const registry = createEndpointRegistry(pilotEndpointDefinitions)

    expect(findEndpointDefinition(registry, 'GET', '/app/ownerRepair.listOwnerRepairs')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/workorder/detail')).toBeTruthy()
  })

  test('dispatches a work-order detail request through adapted mock definitions', async () => {
    const registry = createEndpointRegistry(pilotEndpointDefinitions)

    const response = await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/workorder/detail',
      body: {
        orderId: 'WO_001',
      },
    })

    expect(response).toMatchObject({
      success: true,
      data: {
        order: {
          orderId: 'WO_001',
        },
      },
    })
  })

  test('allows CORS preflight requests for legacy nitro endpoints', async () => {
    const registry = createEndpointRegistry(pilotEndpointDefinitions)

    await expect(dispatchEndpoint(registry, {
      method: 'OPTIONS',
      path: '/app/ownerRepair.listOwnerRepairs',
    })).resolves.toBeNull()
  })
})
