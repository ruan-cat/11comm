import { describe, expect, test } from 'vitest'
import {
  createOwnerEndpointDefinitions,
} from '../../../server/modules/owner/endpoints'
import { createOwnerMockRepository } from '../../../server/modules/owner/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('owner endpoints', () => {
  test('registers the legacy owner list and CRUD URLs', () => {
    const registry = createEndpointRegistry(
      createOwnerEndpointDefinitions(createOwnerMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/owner.queryOwnerAndMembers')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/owner.saveRoomOwner')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/owner.editOwner')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/owner.deleteOwner')).toBeTruthy()
  })

  test('keeps owner save, edit, query, and delete responses stable', async () => {
    const registry = createEndpointRegistry(
      createOwnerEndpointDefinitions(createOwnerMockRepository()),
    )

    const saveResponse = await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/owner.saveRoomOwner',
      body: {
        name: '娴嬭瘯涓氫富',
        link: '13800000000',
        ownerTypeCd: '1002',
        personRole: '3',
        personType: 'P',
        roomName: '1-101-room',
        communityId: 'COMM_001',
        idCard: '440101199001010011',
        address: '1-101',
        remark: 'append-only',
        sex: '1',
      },
    })

    const memberId = saveResponse.data.memberId as string

    const queryResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/owner.queryOwnerAndMembers',
      query: {
        communityId: 'COMM_001',
        memberId,
        page: 1,
        row: 10,
      },
    })

    const ownerId = queryResponse.data.list[0].ownerId as string

    const editResponse = await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/owner.editOwner',
      body: {
        memberId,
        ownerId,
        communityId: 'COMM_001',
        name: '淇敼鍚庣殑涓氫富',
        link: '13800000001',
        ownerTypeCd: '1001',
        idCard: '440101199001010022',
        address: '2-202',
        remark: 'updated',
        sex: '0',
      },
    })

    const deleteResponse = await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/owner.deleteOwner',
      body: {
        memberId,
      },
    })

    const queryAfterDelete = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/owner.queryOwnerAndMembers',
      query: {
        communityId: 'COMM_001',
        memberId,
        page: 1,
        row: 10,
      },
    })

    expect(saveResponse).toMatchObject({
      success: true,
      data: {
        memberId,
      },
    })
    expect(queryResponse.data.list[0]).toMatchObject({
      memberId,
      communityId: 'COMM_001',
    })
    expect(editResponse).toMatchObject({
      success: true,
      data: {
        memberId,
      },
    })
    expect(deleteResponse).toMatchObject({
      success: true,
      data: {
        success: true,
      },
    })
    expect(queryAfterDelete.data.list).toHaveLength(0)
  })
})
