import { describe, expect, test } from 'vitest'
import {
  createPropertyApplicationEndpointDefinitions,
  propertyApplicationRuntimeEndpointDefinitions,
} from '../../../server/modules/property-application/endpoints'
import { createPropertyApplicationMockRepository } from '../../../server/modules/property-application/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('property-application endpoints', () => {
  test('registers shared property-application endpoints', () => {
    const registry = createEndpointRegistry(
      createPropertyApplicationEndpointDefinitions(createPropertyApplicationMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/applyRoomDiscount/queryApplyRoomDiscount')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/applyRoomDiscount/updateReviewApplyRoomDiscount')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord')).toBeTruthy()
  })

  test('keeps duplicate legacy URLs out of the Nitro priority layer', () => {
    const runtimeUrls = propertyApplicationRuntimeEndpointDefinitions.map(item => item.url)

    expect(runtimeUrls).not.toContain('/callComponent/core/list')
    expect(runtimeUrls).not.toContain('/app/fee.queryFeeDetail')
    expect(runtimeUrls).toContain('/app/applyRoomDiscount/queryApplyRoomDiscount')
  })

  test('keeps list, detail and record response structures stable', async () => {
    const registry = createEndpointRegistry(
      createPropertyApplicationEndpointDefinitions(createPropertyApplicationMockRepository()),
    )

    const listResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/applyRoomDiscount/queryApplyRoomDiscount',
      query: {
        page: 1,
        row: 5,
        communityId: 'COMM_001',
      },
    })
    const application = listResponse.data.list[0]

    const detailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/applyRoomDiscount/queryApplyRoomDiscount',
      query: {
        page: 1,
        row: 1,
        communityId: 'COMM_001',
        ardId: application.ardId,
      },
    })

    const recordResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord',
      query: {
        page: 1,
        row: 10,
        communityId: 'COMM_001',
        applicationId: application.ardId,
        roomId: application.roomId,
        roomName: application.roomName,
      },
    })

    expect(Array.isArray(listResponse.data.list)).toBe(true)
    expect(detailResponse.data.list[0]).toMatchObject({
      ardId: application.ardId,
      roomId: application.roomId,
    })
    expect(Array.isArray(recordResponse.data.list)).toBe(true)
  })

  test('persists check, review, save-record and delete-record mutations through shared endpoints', async () => {
    const registry = createEndpointRegistry(
      createPropertyApplicationEndpointDefinitions(createPropertyApplicationMockRepository()),
    )

    const listResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/applyRoomDiscount/queryApplyRoomDiscount',
      query: {
        page: 1,
        row: 20,
        communityId: 'COMM_001',
      },
    })
    const application = listResponse.data.list.find((item: any) => item.ardId === 'ARD_002') || listResponse.data.list[0]

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/applyRoomDiscount/updateApplyRoomDiscount',
      body: {
        ardId: application.ardId,
        communityId: application.communityId,
        startTime: application.startTime,
        endTime: application.endTime,
        createRemark: application.createRemark,
        state: '2',
        checkRemark: '验房通过',
        photos: ['PHOTO_001'],
      },
    })

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/applyRoomDiscount/updateReviewApplyRoomDiscount',
      body: {
        ardId: application.ardId,
        communityId: application.communityId,
        startTime: application.startTime,
        endTime: application.endTime,
        createRemark: application.createRemark,
        state: '4',
        reviewRemark: '审批通过',
        discountType: '3003',
        discountId: 'DISCOUNT_001',
        returnWay: '1001',
        selectedFees: ['DETAIL_001'],
        feeId: application.feeId,
        roomId: application.roomId,
        checkRemark: '验房通过',
        fees: [],
        configId: 'CONFIG_001',
        discounts: [],
      },
    })

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord',
      body: {
        applicationId: application.ardId,
        roomId: application.roomId,
        roomName: application.roomName,
        state: '4',
        stateName: '审批通过',
        photos: ['PHOTO_002'],
        videoName: '',
        remark: '审批通过记录',
        detailType: '1001',
        communityId: application.communityId,
        examineRemark: '现场正常',
        isTrue: 'false',
      },
    })

    const updatedDetailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/applyRoomDiscount/queryApplyRoomDiscount',
      query: {
        page: 1,
        row: 1,
        communityId: 'COMM_001',
        ardId: application.ardId,
      },
    })

    const recordResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord',
      query: {
        page: 1,
        row: 20,
        communityId: application.communityId,
        applicationId: application.ardId,
        roomId: application.roomId,
        roomName: application.roomName,
      },
    })
    const createdRecord = recordResponse.data.list[0]

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord',
      body: {
        ardrId: createdRecord.ardrId,
        communityId: application.communityId,
        roomName: application.roomName,
        applicationId: application.ardId,
        roomId: application.roomId,
        state: createdRecord.state,
        stateName: createdRecord.stateName,
      },
    })

    const refreshedRecordResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord',
      query: {
        page: 1,
        row: 20,
        communityId: application.communityId,
        applicationId: application.ardId,
        roomId: application.roomId,
        roomName: application.roomName,
      },
    })

    expect(updatedDetailResponse.data.list[0]).toMatchObject({
      ardId: application.ardId,
      state: '4',
      stateName: '审批通过',
      reviewRemark: '审批通过',
    })
    expect(refreshedRecordResponse.data.list.some((item: any) => item.ardrId === createdRecord.ardrId)).toBe(false)
  })
})
