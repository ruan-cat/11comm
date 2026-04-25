import { describe, expect, test } from 'vitest'
import { createRenovationEndpointDefinitions } from '../../../server/modules/renovation/endpoints'
import { createRenovationMockRepository } from '../../../server/modules/renovation/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('renovation endpoints', () => {
  test('registers shared renovation endpoints', () => {
    const registry = createEndpointRegistry(
      createRenovationEndpointDefinitions(createRenovationMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/roomRenovation/queryRoomRenovation')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/roomRenovation/updateRoomToExamine')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/roomRenovation/deleteRoomRenovationRecord')).toBeTruthy()
  })

  test('keeps application list and record detail responses stable', async () => {
    const registry = createEndpointRegistry(
      createRenovationEndpointDefinitions(createRenovationMockRepository()),
    )

    const listResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/roomRenovation/queryRoomRenovation',
      query: {
        page: 1,
        row: 5,
        communityId: 'COMM_001',
      },
    })
    const firstRenovation = listResponse.data.list[0]

    const recordResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/roomRenovation/queryRoomRenovationRecord',
      query: {
        page: 1,
        row: 10,
        rId: firstRenovation.rId,
      },
    })

    const detailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/roomRenovation/queryRoomRenovationRecordDetail',
      query: {
        page: 1,
        row: 10,
        recordId: recordResponse.data.list[0].recordId,
      },
    })

    expect(Array.isArray(listResponse.data.list)).toBe(true)
    expect(recordResponse.data.list[0]).toMatchObject({
      rId: firstRenovation.rId,
      roomId: firstRenovation.roomId,
    })
    expect(Array.isArray(detailResponse.data)).toBe(true)
  })

  test('persists examine, add-record and delete-record mutations through shared endpoints', async () => {
    const registry = createEndpointRegistry(
      createRenovationEndpointDefinitions(createRenovationMockRepository()),
    )

    const listResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/roomRenovation/queryRoomRenovation',
      query: {
        page: 1,
        row: 20,
        communityId: 'COMM_001',
      },
    })
    const targetRenovation = listResponse.data.list.find((item: any) => item.state === 1000) || listResponse.data.list[0]

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/roomRenovation/updateRoomToExamine',
      body: {
        communityId: targetRenovation.communityId,
        rId: targetRenovation.rId,
        roomId: targetRenovation.roomId,
        roomName: targetRenovation.roomName,
        userId: targetRenovation.userId,
        startTime: targetRenovation.startTime,
        endTime: targetRenovation.endTime,
        remark: targetRenovation.remark,
        detailType: '1001',
        state: 3000,
        examineRemark: '审核通过',
      },
    })

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/roomRenovation/updateRoomDecorationRecord',
      body: {
        rId: targetRenovation.rId,
        roomId: targetRenovation.roomId,
        roomName: targetRenovation.roomName,
        communityId: targetRenovation.communityId,
        state: 3000,
        stateName: '施工中',
        photos: ['PHOTO_001'],
        detailType: '1001',
        remark: '现场巡查正常',
        isTrue: 'false',
      },
    })

    const updatedRecordResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/roomRenovation/queryRoomRenovationRecord',
      query: {
        page: 1,
        row: 20,
        rId: targetRenovation.rId,
      },
    })
    const createdRecord = updatedRecordResponse.data.list[0]

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/roomRenovation/deleteRoomRenovationRecord',
      body: {
        recordId: createdRecord.recordId,
        communityId: targetRenovation.communityId,
      },
    })

    const refreshedListResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/roomRenovation/queryRoomRenovation',
      query: {
        page: 1,
        row: 20,
        communityId: 'COMM_001',
      },
    })

    const refreshedRecordResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/roomRenovation/queryRoomRenovationRecord',
      query: {
        page: 1,
        row: 20,
        rId: targetRenovation.rId,
      },
    })

    expect(refreshedListResponse.data.list.find((item: any) => item.rId === targetRenovation.rId)).toMatchObject({
      rId: targetRenovation.rId,
      state: 3000,
      stateName: '施工中',
    })
    expect(refreshedRecordResponse.data.list.some((item: any) => item.recordId === createdRecord.recordId)).toBe(false)
  })
})
