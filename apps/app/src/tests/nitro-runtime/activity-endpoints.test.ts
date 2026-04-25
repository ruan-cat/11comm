import { describe, expect, test } from 'vitest'
import { createActivityEndpointDefinitions } from '../../../server/modules/activity/endpoints'
import { createActivityMockRepository } from '../../../server/modules/activity/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('activity endpoints', () => {
  test('registers shared activity endpoints', () => {
    const registry = createEndpointRegistry(
      createActivityEndpointDefinitions(createActivityMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/activities.listActivitiess')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/activities.saveActivities')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/activities.updateActivities')).toBeTruthy()
  })

  test('keeps activity list and detail response structures stable', async () => {
    const registry = createEndpointRegistry(
      createActivityEndpointDefinitions(createActivityMockRepository()),
    )

    const listResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/activities.listActivitiess',
      query: {
        page: 1,
        row: 10,
        communityId: 'COMM_001',
      },
    })

    const activity = listResponse.data.activitiess[0]
    const detailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/activities.listActivitiess',
      query: {
        page: 1,
        row: 1,
        communityId: 'COMM_001',
        activitiesId: activity.activitiesId,
      },
    })

    expect(Array.isArray(listResponse.data.activitiess)).toBe(true)
    expect(detailResponse.data.activitiess[0]).toMatchObject({
      activitiesId: activity.activitiesId,
    })
  })

  test('persists activity create, update and delete mutations', async () => {
    const registry = createEndpointRegistry(
      createActivityEndpointDefinitions(createActivityMockRepository()),
    )

    const createResponse = await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/activities.saveActivities',
      body: {
        title: '单元测试活动',
        context: '活动内容',
        startTime: '2026-04-01 09:00:00',
        endTime: '2026-04-01 11:00:00',
        communityId: 'COMM_001',
      },
    })

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/activities.updateActivities',
      body: {
        activitiesId: createResponse.data.activitiesId,
        title: '单元测试活动',
        context: '活动内容已更新',
        startTime: '2026-04-01 09:00:00',
        endTime: '2026-04-01 12:00:00',
        communityId: 'COMM_001',
        status: 'ONGOING',
      },
    })

    const updatedListResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/activities.listActivitiess',
      query: {
        page: 1,
        row: 10,
        communityId: 'COMM_001',
        activitiesId: createResponse.data.activitiesId,
      },
    })

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/activities.deleteActivities',
      body: {
        activitiesId: createResponse.data.activitiesId,
      },
    })

    const refreshedListResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/activities.listActivitiess',
      query: {
        page: 1,
        row: 10,
        communityId: 'COMM_001',
        activitiesId: createResponse.data.activitiesId,
      },
    })

    expect(updatedListResponse.data.activitiess[0]).toMatchObject({
      activitiesId: createResponse.data.activitiesId,
      status: 'ONGOING',
    })
    expect(refreshedListResponse.data.activitiess).toHaveLength(0)
  })
})
