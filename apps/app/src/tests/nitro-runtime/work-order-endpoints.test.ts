import { describe, expect, test } from 'vitest'
import {
  createWorkOrderEndpointDefinitions,
} from '../../../server/modules/work-order/endpoints'
import { createWorkOrderMockRepository } from '../../../server/modules/work-order/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('work-order endpoints', () => {
  test('registers shared work-order endpoints', () => {
    const registry = createEndpointRegistry(
      createWorkOrderEndpointDefinitions(createWorkOrderMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/workorder/todo/list')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/workorder/detail')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/workorder/cancel')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/workorder/task/list')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/workorder/task/items')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/workorder/copy/finish')).toBeTruthy()
  })

  test('keeps list and detail response structures stable', async () => {
    const registry = createEndpointRegistry(
      createWorkOrderEndpointDefinitions(createWorkOrderMockRepository()),
    )

    const listResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/workorder/todo/list',
      query: {
        page: 1,
        row: 5,
        communityId: 'COMM_001',
      },
    })

    const detailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/workorder/detail',
      query: {
        orderId: listResponse.data.list[0].orderId,
      },
    })

    expect(Array.isArray(listResponse.data.list)).toBe(true)
    expect(listResponse.data.list.length).toBeGreaterThan(0)
    expect(detailResponse).toMatchObject({
      success: true,
      data: {
        order: {
          orderId: listResponse.data.list[0].orderId,
        },
      },
    })
  })

  test('persists repository mutations across create, start, complete and audit endpoints', async () => {
    const registry = createEndpointRegistry(
      createWorkOrderEndpointDefinitions(createWorkOrderMockRepository()),
    )

    const createResponse = await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/workorder/create',
      body: {
        title: '测试工作单',
        type: '1',
        priority: '2',
        content: '巡检地下车库消防设施',
        planStartTime: '2026-03-30 09:00:00',
        planEndTime: '2026-03-30 18:00:00',
        communityId: 'COMM_001',
      },
    })
    const orderId = createResponse.data.orderId

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/workorder/start',
      body: {
        orderId,
      },
    })

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/workorder/complete',
      body: {
        orderId,
        remark: '已处理完成',
        photos: ['https://example.com/photo-1.jpg'],
      },
    })

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/workorder/audit',
      body: {
        orderId,
        result: 'pass',
      },
    })

    const detailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/workorder/detail',
      query: {
        orderId,
      },
    })

    expect(detailResponse.data.order).toMatchObject({
      orderId,
      status: '10003',
      statusName: '已完成',
    })
  })

  test('serves task list, task items and copy finish endpoints', async () => {
    const registry = createEndpointRegistry(
      createWorkOrderEndpointDefinitions(createWorkOrderMockRepository()),
    )

    const taskList = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/workorder/task/list',
      query: {
        workId: 'WO_001',
        page: 1,
        row: 100,
      },
    })
    expect(taskList.data.list).toHaveLength(2)
    expect(taskList.data.list[0]).toMatchObject({
      taskId: expect.any(String),
      workId: 'WO_001',
      staffId: expect.any(String),
      staffName: expect.any(String),
      state: expect.any(String),
    })

    const taskItems = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/workorder/task/items',
      query: {
        workId: 'WO_001',
        states: 'W,C',
      },
    })
    expect(taskItems.data.list.length).toBeGreaterThan(0)
    expect(taskItems.data.list).toHaveLength(2)
    expect(taskItems.data.list.every((item: { state: string }) => ['W', 'C'].includes(item.state))).toBe(true)

    const finishedItem = taskItems.data.list.find((item: { state: string }) => item.state === 'C')
    expect(finishedItem).toBeTruthy()

    const finishResponse = await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/workorder/copy/finish',
      body: {
        copyId: 'WC_001',
        itemId: finishedItem.itemId,
        score: 9,
        deductionMoney: 0,
        deductionReason: '处理完成',
      },
    })
    expect(finishResponse.data).toMatchObject({
      success: true,
    })
  })
})
