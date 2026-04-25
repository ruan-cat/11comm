import { describe, expect, test } from 'vitest'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('endpoint registry', () => {
  test('matches endpoint by exact path and normalized method', async () => {
    const registry = createEndpointRegistry([
      {
        url: '/app/example/list',
        method: ['GET', 'POST'],
        handler: () => ({ ok: true }),
      },
    ])

    expect(findEndpointDefinition(registry, 'get', '/app/example/list')?.url).toBe('/app/example/list')
    expect(findEndpointDefinition(registry, 'POST', '/app/example/list')?.url).toBe('/app/example/list')
  })

  test('dispatches merged query and body payload to shared handler', async () => {
    const registry = createEndpointRegistry([
      {
        url: '/app/example/detail',
        method: 'POST',
        handler: ({ params, query, body }) => ({
          params,
          query,
          body,
        }),
      },
    ])

    await expect(
      dispatchEndpoint(registry, {
        method: 'post',
        path: '/app/example/detail',
        query: { page: '1' },
        body: { orderId: 'WO_001' },
      }),
    ).resolves.toEqual({
      params: {
        page: '1',
        orderId: 'WO_001',
      },
      query: { page: '1' },
      body: { orderId: 'WO_001' },
    })
  })

  test('throws a 404-style error when endpoint is missing', async () => {
    const registry = createEndpointRegistry([])

    await expect(
      dispatchEndpoint(registry, {
        method: 'GET',
        path: '/app/missing',
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
    })
  })
})
