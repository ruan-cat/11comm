import { describe, expect, test } from 'vitest'
import {
  createRoomEndpointDefinitions,
} from '../../../server/modules/room/endpoints'
import { createRoomMockRepository } from '../../../server/modules/room/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('room endpoints', () => {
  test('registers the legacy room list and detail URLs', () => {
    const registry = createEndpointRegistry(
      createRoomEndpointDefinitions(createRoomMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/room.queryRooms')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/room.queryRoomDetail')).toBeTruthy()
  })

  test('keeps the room list and detail response structures stable', async () => {
    const registry = createEndpointRegistry(
      createRoomEndpointDefinitions(createRoomMockRepository()),
    )

    const listResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/room.queryRooms',
      query: {
        communityId: 'COMM_001',
        floorId: 'F_COMM_001_001',
        unitId: 'U_COMM_001_001_01',
        page: 1,
        row: 5,
      },
    })

    const detailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/room.queryRoomDetail',
      query: {
        roomId: listResponse.data.list[0].roomId,
      },
    })

    expect(Array.isArray(listResponse.data.list)).toBe(true)
    expect(listResponse.data.list.length).toBeGreaterThan(0)
    expect(detailResponse).toMatchObject({
      success: true,
      data: {
        roomId: listResponse.data.list[0].roomId,
      },
    })
  })
})
