import { describe, expect, test } from 'vitest'
import { createMaintenanceEndpointDefinitions } from '../../../server/modules/maintenance/endpoints'
import { createMaintenanceMockRepository } from '../../../server/modules/maintenance/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('maintenance endpoints', () => {
  test('registers shared maintenance endpoints', () => {
    const registry = createEndpointRegistry(
      createMaintenanceEndpointDefinitions(createMaintenanceMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/maintenance.listMaintenanceTasks')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/maintenance.startMaintenanceTask')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/maintenance.transferMaintenanceTask')).toBeTruthy()
  })

  test('keeps list and detail response structures stable', async () => {
    const registry = createEndpointRegistry(
      createMaintenanceEndpointDefinitions(createMaintenanceMockRepository()),
    )

    const listResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/maintenance.listMaintenanceTasks',
      query: {
        page: 1,
        row: 5,
        communityId: 'COMM_001',
      },
    })

    const detailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/maintenance.queryMaintenanceTask',
      query: {
        taskId: listResponse.data.list[0].taskId,
      },
    })

    expect(Array.isArray(listResponse.data.list)).toBe(true)
    expect(detailResponse).toMatchObject({
      success: true,
      data: {
        task: {
          taskId: listResponse.data.list[0].taskId,
        },
      },
    })
  })

  test('persists repository mutations across start, single submit and complete endpoints', async () => {
    const registry = createEndpointRegistry(
      createMaintenanceEndpointDefinitions(createMaintenanceMockRepository()),
    )

    const listResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/maintenance.listMaintenanceTasks',
      query: {
        page: 1,
        row: 20,
        communityId: 'COMM_001',
      },
    })
    const pendingTask = listResponse.data.list.find((task: any) => task.status === '10001')

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/maintenance.startMaintenanceTask',
      body: {
        taskId: pendingTask.taskId,
      },
    })

    const detailItemsResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/maintenance.listMaintenanceTaskDetails',
      query: {
        taskId: pendingTask.taskId,
      },
    })

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/maintenance.submitMaintenanceSingle',
      body: {
        taskId: pendingTask.taskId,
        taskDetailId: detailItemsResponse.data.items[0].taskDetailId,
        result: '正常',
        remark: '已检查',
      },
    })

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/maintenance.completeMaintenanceTask',
      body: {
        taskId: pendingTask.taskId,
      },
    })

    const detailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/maintenance.queryMaintenanceTask',
      query: {
        taskId: pendingTask.taskId,
      },
    })

    expect(detailResponse.data.task).toMatchObject({
      taskId: pendingTask.taskId,
      status: '10003',
      statusName: '已完成',
    })
  })
})
