import { describe, expect, test } from 'vitest'
import { createProfileEndpointDefinitions } from '../../../server/modules/profile/endpoints'
import { createProfileMockRepository } from '../../../server/modules/profile/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('profile endpoints', () => {
  test('registers the legacy profile endpoints', () => {
    const registry = createEndpointRegistry(createProfileEndpointDefinitions(createProfileMockRepository()))

    expect(findEndpointDefinition(registry, 'GET', '/app/profile.getUserProfile')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/profile.listAttendanceRecords')).toBeTruthy()
  })

  test('persists a community switch through the profile snapshot endpoint', async () => {
    const registry = createEndpointRegistry(createProfileEndpointDefinitions(createProfileMockRepository()))

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/profile.changeCommunity',
      body: {
        communityId: 'COMM_002',
      },
    })

    const profileResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/profile.getUserProfile',
    })

    const attendanceResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/profile.listAttendanceRecords',
      query: {
        month: '2026-03',
        staffId: 'STAFF_001',
      },
    })

    expect(profileResponse.data.currentCommunityId).toBe('COMM_002')
    expect(Array.isArray(attendanceResponse.data)).toBe(true)
    expect(attendanceResponse.data.length).toBeGreaterThan(0)
  })
})
