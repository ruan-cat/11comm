import { describe, expect, test } from 'vitest'
import { createOaWorkflowEndpointDefinitions } from '../../../server/modules/oa-workflow/endpoints'
import { createOaWorkflowMockRepository } from '../../../server/modules/oa-workflow/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('oa-workflow endpoints', () => {
  test('registers shared oa-workflow endpoints', () => {
    const registry = createEndpointRegistry(
      createOaWorkflowEndpointDefinitions(createOaWorkflowMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/oa/workflow/query')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/oa/workflow/form/save')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/oa/workflow/audit')).toBeTruthy()
  })

  test('keeps workflow list, form and record response structures stable', async () => {
    const registry = createEndpointRegistry(
      createOaWorkflowEndpointDefinitions(createOaWorkflowMockRepository()),
    )

    const flowResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/oa/workflow/query',
      query: {
        page: 1,
        row: 10,
      },
    })
    const flow = flowResponse.data.data[0]

    const formResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/oa/workflow/form/query',
      query: {
        page: 1,
        row: 10,
        flowId: flow.flowId,
      },
    })

    const recordResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/oa/workflow/form/data/query',
      query: {
        page: 1,
        row: 10,
        flowId: flow.flowId,
      },
    })

    expect(Array.isArray(flowResponse.data.data)).toBe(true)
    expect(formResponse.data.data[0]).toMatchObject({
      flowId: flow.flowId,
    })
    expect(Array.isArray(recordResponse.data.data)).toBe(true)
  })

  test('persists save, update and audit mutations through shared endpoints', async () => {
    const registry = createEndpointRegistry(
      createOaWorkflowEndpointDefinitions(createOaWorkflowMockRepository()),
    )

    const saveResponse = await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/oa/workflow/form/save',
      body: {
        flowId: 'FLOW_001',
        formData: {
          applicantName: '赵六',
          startDate: '2026-04-01',
          endDate: '2026-04-02',
          leaveType: 'annual',
          reason: '外出办事',
        },
      },
    })
    const workflowId = saveResponse.data.id

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/oa/workflow/form/update',
      body: {
        id: workflowId,
        flowId: 'FLOW_001',
        formData: {
          applicantName: '赵六',
          startDate: '2026-04-01',
          endDate: '2026-04-03',
          leaveType: 'annual',
          reason: '调整请假时间',
        },
      },
    })

    const savedRecordResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/oa/workflow/form/data/query',
      query: {
        page: 1,
        row: 10,
        flowId: 'FLOW_001',
        id: workflowId,
      },
    })
    const savedRecord = savedRecordResponse.data.data[0]

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/oa/workflow/audit',
      body: {
        flowId: savedRecord.flowId,
        id: savedRecord.id,
        taskId: savedRecord.taskId,
        auditCode: '1500',
        auditMessage: '审核通过',
      },
    })

    const auditedRecordResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/oa/workflow/form/data/query',
      query: {
        page: 1,
        row: 10,
        flowId: 'FLOW_001',
        id: workflowId,
      },
    })

    const commentsResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/oa/workflow/user/query',
      query: {
        page: 1,
        row: 10,
        flowId: 'FLOW_001',
        id: workflowId,
      },
    })

    expect(auditedRecordResponse.data.data[0]).toMatchObject({
      id: workflowId,
      state: '1005',
      stateName: '办结',
    })
    expect(commentsResponse.data.data.at(-1)).toMatchObject({
      context: '审核通过',
    })
  })
})
