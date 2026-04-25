import { describe, expect, test } from 'vitest'
import { createTestEndpointDefinitions } from '../../../server/modules/test/endpoints'
import { createTestMockRepository } from '../../../server/modules/test/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('test endpoints', () => {
  test('registers the legacy test endpoints', () => {
    const registry = createEndpointRegistry(createTestEndpointDefinitions(createTestMockRepository()))

    expect(findEndpointDefinition(registry, 'GET', '/test')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/test/error')).toBeTruthy()
  })

  test('keeps the parameter echo and error response contracts stable', async () => {
    const registry = createEndpointRegistry(createTestEndpointDefinitions(createTestMockRepository()))

    const paramsResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/test/params',
      query: {
        name: 'demo',
      },
      body: {
        value: 'ok',
      },
    })

    const errorResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/test/error',
      query: {
        trigger: 'error',
      },
    })

    expect(paramsResponse.data.receivedQuery).toMatchObject({ name: 'demo' })
    expect(paramsResponse.data.receivedBody).toMatchObject({ value: 'ok' })
    expect(errorResponse.success).toBe(false)
    expect(errorResponse.code).toBe('500')
  })
})
