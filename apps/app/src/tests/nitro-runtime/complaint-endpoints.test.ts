import { describe, expect, test } from 'vitest'
import { createComplaintEndpointDefinitions } from '../../../server/modules/complaint/endpoints'
import { createComplaintMockRepository } from '../../../server/modules/complaint/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('complaint endpoints', () => {
  test('registers shared complaint endpoints', () => {
    const registry = createEndpointRegistry(
      createComplaintEndpointDefinitions(createComplaintMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/auditUser.listAuditComplaints')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/complaint')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/complaint.auditComplaint')).toBeTruthy()
  })

  test('keeps complaint list, event and appraise response structures stable', async () => {
    const registry = createEndpointRegistry(
      createComplaintEndpointDefinitions(createComplaintMockRepository()),
    )

    const todoListResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/auditUser.listAuditComplaints',
      query: {
        page: 1,
        row: 5,
        userId: 'USER_001',
        communityId: 'COMM_001',
      },
    })

    const complaint = todoListResponse.data.data[0]
    const eventResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/complaint.listComplaintEvent',
      query: {
        page: 1,
        row: 20,
        complaintId: complaint.complaintId,
        communityId: 'COMM_001',
      },
    })

    const appraiseResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/complaintAppraise.listComplaintAppraise',
      query: {
        page: 1,
        row: 20,
        complaintId: complaint.complaintId,
        communityId: 'COMM_001',
      },
    })

    expect(Array.isArray(todoListResponse.data.data)).toBe(true)
    expect(Array.isArray(eventResponse.data.data)).toBe(true)
    expect(Array.isArray(appraiseResponse.data.data)).toBe(true)
  })

  test('persists complaint create and handle mutations', async () => {
    const registry = createEndpointRegistry(
      createComplaintEndpointDefinitions(createComplaintMockRepository()),
    )

    const createResponse = await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/complaint',
      body: {
        typeCd: '809001',
        complaintName: '测试投诉人',
        tel: '13800138000',
        roomId: 'ROOM_001',
        context: '测试投诉内容',
        photos: [],
        userId: 'USER_001',
        storeId: 'STORE_001',
        communityId: 'COMM_001',
      },
    })

    const complaintId = createResponse.data.complaint.complaintId

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/complaint.auditComplaint',
      body: {
        complaintId,
        context: '已处理',
        communityId: 'COMM_001',
        userId: 'USER_001',
      },
    })

    const eventResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/complaint.listComplaintEvent',
      query: {
        page: 1,
        row: 20,
        complaintId,
        communityId: 'COMM_001',
      },
    })

    expect(eventResponse.data.data).toHaveLength(2)
    expect(eventResponse.data.data.at(-1)).toMatchObject({
      complaintId,
      eventType: '1001',
    })
  })
})
