import { describe, expect, test } from 'vitest'
import { createVideoEndpointDefinitions } from '../../../server/modules/video/endpoints'
import { createVideoMockRepository } from '../../../server/modules/video/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('video endpoints', () => {
  test('registers the legacy video endpoints', () => {
    const registry = createEndpointRegistry(createVideoEndpointDefinitions(createVideoMockRepository()))

    expect(findEndpointDefinition(registry, 'GET', '/app/video.listMonitorArea')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/video.getPlayVideoUrl')).toBeTruthy()
  })

  test('keeps list and playback response structures stable', async () => {
    const registry = createEndpointRegistry(createVideoEndpointDefinitions(createVideoMockRepository()))

    const areaResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/video.listMonitorArea',
      query: {
        page: 1,
        row: 5,
      },
    })

    const machineResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/video.listStaffMonitorMachine',
      query: {
        page: 1,
        row: 5,
        maId: 'AREA_001',
      },
    })

    const playResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/video.getPlayVideoUrl',
      query: {
        machineId: machineResponse.data.list[0].machineId,
      },
    })

    expect(Array.isArray(areaResponse.data.list)).toBe(true)
    expect(Array.isArray(machineResponse.data.list)).toBe(true)
    expect(playResponse.data.url).toContain(machineResponse.data.list[0].machineId)
  })
})
