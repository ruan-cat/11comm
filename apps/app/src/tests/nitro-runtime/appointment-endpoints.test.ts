import { describe, expect, test } from 'vitest'
import { createAppointmentEndpointDefinitions } from '../../../server/modules/appointment/endpoints'
import { createAppointmentMockRepository } from '../../../server/modules/appointment/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('appointment endpoints', () => {
  test('registers shared appointment endpoints', () => {
    const registry = createEndpointRegistry(
      createAppointmentEndpointDefinitions(createAppointmentMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/communitySpace.listCommunitySpaceConfirmOrder')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/communitySpace.saveCommunitySpaceConfirmOrder')).toBeTruthy()
  })

  test('keeps appointment list response structure stable', async () => {
    const registry = createEndpointRegistry(
      createAppointmentEndpointDefinitions(createAppointmentMockRepository()),
    )

    const response = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/communitySpace.listCommunitySpaceConfirmOrder',
      query: {
        page: 1,
        row: 5,
        communityId: 'COMM_001',
      },
    })

    expect(Array.isArray(response.data.list)).toBe(true)
    expect(response.data.list[0]).toMatchObject({
      orderId: expect.any(String),
      timeId: expect.any(String),
    })
  })

  test('persists confirm mutations through the shared endpoints', async () => {
    const registry = createEndpointRegistry(
      createAppointmentEndpointDefinitions(createAppointmentMockRepository()),
    )

    const listResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/communitySpace.listCommunitySpaceConfirmOrder',
      query: {
        page: 1,
        row: 20,
        communityId: 'COMM_001',
      },
    })
    const pendingOrder = listResponse.data.list.find((item: any) => item.state === 'WAIT_CONFIRM')

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/communitySpace.saveCommunitySpaceConfirmOrder',
      body: {
        timeId: pendingOrder.timeId,
        communityId: 'COMM_001',
      },
    })

    const refreshedResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/communitySpace.listCommunitySpaceConfirmOrder',
      query: {
        page: 1,
        row: 20,
        communityId: 'COMM_001',
        timeId: pendingOrder.timeId,
      },
    })

    expect(refreshedResponse.data.list[0]).toMatchObject({
      timeId: pendingOrder.timeId,
      state: 'CONFIRMED',
    })
  })
})
