import type { EndpointDefinition } from '../../../server/shared/runtime/endpoint-registry.ts'
import { describe, expect, test } from 'vitest'
import { createLegacyMockDefinitionsFromEndpoints } from '../../../server/shared/runtime/mock-definition-adapter'

describe('createLegacyMockDefinitionsFromEndpoints', () => {
  test('merges query and body into handler params when vite mock passes empty params object', () => {
    const captured: Array<Record<string, unknown>> = []
    const definitions: EndpointDefinition[] = [
      {
        url: '/app/__probe.merge',
        method: 'GET',
        handler: (ctx) => {
          captured.push({ ...ctx.params })
          return { ok: true }
        },
      },
    ]

    const legacy = createLegacyMockDefinitionsFromEndpoints(definitions)
    legacy[0].body({
      query: { name: 'gj', page: '1' },
      body: {},
      params: {},
    })

    expect(captured[0]).toMatchObject({ name: 'gj', page: '1' })
  })

  test('path-style params override query keys', () => {
    const captured: Array<Record<string, unknown>> = []
    const definitions: EndpointDefinition[] = [
      {
        url: '/app/__probe.override',
        method: 'GET',
        handler: (ctx) => {
          captured.push({ ...ctx.params })
          return { ok: true }
        },
      },
    ]

    const legacy = createLegacyMockDefinitionsFromEndpoints(definitions)
    legacy[0].body({
      query: { id: 'from-query' },
      body: {},
      params: { id: 'from-path' },
    })

    expect(captured[0].id).toBe('from-path')
  })
})
