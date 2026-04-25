import { describe, expect, test } from 'vitest'
import { createInspectionEndpointDefinitions } from '../../../server/modules/inspection/endpoints'
import { createInspectionMockRepository } from '../../../server/modules/inspection/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('inspection endpoints', () => {
  test('registers shared inspection endpoints', () => {
    const registry = createEndpointRegistry(
      createInspectionEndpointDefinitions(createInspectionMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/inspection.listInspectionTasks')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/inspection.submitInspection')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/staff.listStaffs')).toBeTruthy()
  })

  test('keeps task list and detail response structures stable', async () => {
    const registry = createEndpointRegistry(
      createInspectionEndpointDefinitions(createInspectionMockRepository()),
    )

    const listResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/inspection.listInspectionTasks',
      query: {
        page: 1,
        row: 5,
      },
    })

    const detailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/inspection.listInspectionTaskDetails',
      query: {
        taskId: listResponse.data.list[0].taskId,
        page: 1,
        row: 20,
      },
    })

    expect(Array.isArray(listResponse.data.list)).toBe(true)
    expect(Array.isArray(detailResponse.data.list)).toBe(true)
    expect(detailResponse.data.list.length).toBeGreaterThan(0)
  })

  test('persists submit and transfer mutations through shared endpoints', async () => {
    const registry = createEndpointRegistry(
      createInspectionEndpointDefinitions(createInspectionMockRepository()),
    )

    const taskListResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/inspection.listInspectionTasks',
      query: {
        page: 1,
        row: 5,
      },
    })
    const taskId = taskListResponse.data.list[0].taskId

    const detailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/inspection.listInspectionTaskDetails',
      query: {
        taskId,
        page: 1,
        row: 20,
      },
    })
    const taskDetail = detailResponse.data.list[0]

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/inspection.submitInspection',
      body: {
        taskId,
        taskDetailId: taskDetail.taskDetailId,
        inspectionId: taskDetail.inspectionId,
        inspectionName: taskDetail.inspectionName,
        communityId: 'COMM_001',
        patrolType: '巡检',
        description: '现场巡检正常',
        photos: ['https://example.com/photo-1.jpg'],
        userId: 'USER_001',
        userName: '巡检员',
        latitude: 0,
        longitude: 0,
      },
    })

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/inspection.transferTask',
      body: {
        taskId,
        staffId: 'USER_002',
        staffName: '张师傅',
        communityId: 'COMM_001',
        inspectionPlanId: taskListResponse.data.list[0].inspectionPlanId,
        inspectionPlanName: taskListResponse.data.list[0].inspectionPlanName,
        taskType: 1,
        transferDesc: '流转处理',
      },
    })

    const updatedDetailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/inspection.listInspectionTaskDetails',
      query: {
        inspectionId: taskDetail.inspectionId,
        page: 1,
        row: 20,
      },
    })

    expect(updatedDetailResponse.data.list[0]).toMatchObject({
      inspectionId: taskDetail.inspectionId,
      state: '20200407',
    })
  })
})
