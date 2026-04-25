import { describe, expect, test } from 'vitest'
import { createItemReleaseEndpointDefinitions } from '../../../server/modules/item-release/endpoints'
import { createItemReleaseMockRepository } from '../../../server/modules/item-release/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('item-release endpoints', () => {
  test('registers shared item-release endpoints', () => {
    const registry = createEndpointRegistry(
      createItemReleaseEndpointDefinitions(createItemReleaseMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/itemRelease.queryUndoItemReleaseV2')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/itemRelease.getItemRelease')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/itemRelease.auditItemRelease')).toBeTruthy()
  })

  test('keeps item-release list, detail, resource and comment response structures stable', async () => {
    const registry = createEndpointRegistry(
      createItemReleaseEndpointDefinitions(createItemReleaseMockRepository()),
    )

    const undoResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/itemRelease.queryUndoItemReleaseV2',
      query: {
        page: 1,
        row: 5,
        communityId: 'COMM_001',
      },
    })
    const task = undoResponse.data.list[0]

    const detailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/itemRelease.getItemRelease',
      query: {
        page: 1,
        row: 1,
        irId: task.irId,
        communityId: 'COMM_001',
      },
    })

    const resResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/itemRelease.getItemReleaseRes',
      query: {
        page: 1,
        row: 10,
        irId: task.irId,
        communityId: 'COMM_001',
      },
    })

    const commentResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/itemRelease.queryOaWorkflowUser',
      query: {
        page: 1,
        row: 10,
        id: task.irId,
        flowId: task.flowId,
        communityId: 'COMM_001',
      },
    })

    expect(Array.isArray(undoResponse.data.list)).toBe(true)
    expect(detailResponse.data.list[0]).toMatchObject({
      irId: task.irId,
    })
    expect(Array.isArray(resResponse.data.list)).toBe(true)
    expect(Array.isArray(commentResponse.data.list)).toBe(true)
  })

  test('persists audit mutations through the shared endpoints', async () => {
    const registry = createEndpointRegistry(
      createItemReleaseEndpointDefinitions(createItemReleaseMockRepository()),
    )

    const undoResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/itemRelease.queryUndoItemReleaseV2',
      query: {
        page: 1,
        row: 5,
        communityId: 'COMM_001',
      },
    })
    const task = undoResponse.data.list[0]

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/itemRelease.auditItemRelease',
      body: {
        irId: task.irId,
        flowId: task.flowId,
        taskId: task.taskId || '',
        auditCode: '1100',
        auditMessage: '同意',
      },
    })

    const finishResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/itemRelease.queryFinishItemReleaseV2',
      query: {
        page: 1,
        row: 10,
        communityId: 'COMM_001',
      },
    })

    expect(finishResponse.data.list[0]).toMatchObject({
      irId: task.irId,
      stateName: '宸插姙缁?',
    })
  })
})
