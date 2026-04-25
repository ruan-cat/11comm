import { describe, expect, test } from 'vitest'
import {
  createRepairEndpointDefinitions,
} from '../../../server/modules/repair/endpoints'
import { createRepairMockRepository } from '../../../server/modules/repair/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('repair endpoints', () => {
  test('registers shared repair endpoints including compatibility URLs', () => {
    const registry = createEndpointRegistry(
      createRepairEndpointDefinitions(createRepairMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/ownerRepair.listOwnerRepairs')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/callComponent/core/list')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/resourceStore.listResources')).toBeTruthy()
  })

  test('keeps list and detail response structures stable', async () => {
    const registry = createEndpointRegistry(
      createRepairEndpointDefinitions(createRepairMockRepository()),
    )

    const listResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/ownerRepair.listOwnerRepairs',
      query: {
        page: 1,
        row: 5,
      },
    })

    const detailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/ownerRepair.queryOwnerRepair',
      query: {
        repairId: listResponse.data.ownerRepairs[0].repairId,
      },
    })

    expect(Array.isArray(listResponse.data.ownerRepairs)).toBe(true)
    expect(listResponse.data.ownerRepairs.length).toBeGreaterThan(0)
    expect(detailResponse).toMatchObject({
      success: true,
      data: {
        ownerRepair: {
          repairId: listResponse.data.ownerRepairs[0].repairId,
        },
      },
    })
  })

  test('persists repository mutations across create, dispatch, start and finish endpoints', async () => {
    const registry = createEndpointRegistry(
      createRepairEndpointDefinitions(createRepairMockRepository()),
    )

    const createResponse = await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/ownerRepair.saveOwnerRepair',
      body: {
        title: '测试维修工单',
        context: '厨房水管漏水',
        repairName: '张三',
        tel: '13800000000',
        address: '1栋0101室',
        repairType: '1001',
        communityId: 'COMM_001',
      },
    })
    const repairId = createResponse.data.ownerRepair.repairId

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/ownerRepair.repairDispatch',
      body: {
        repairId,
        action: 'DISPATCH',
        staffId: 'STAFF_001',
        staffName: '张师傅',
      },
    })

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/ownerRepair.repairStart',
      body: {
        repairId,
      },
    })

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/ownerRepair.repairFinish',
      body: {
        repairId,
        feeFlag: '1001',
        context: '处理完成',
        totalPrice: 88,
      },
    })

    const detailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/ownerRepair.queryOwnerRepair',
      query: {
        repairId,
      },
    })

    expect(detailResponse.data.ownerRepair).toMatchObject({
      repairId,
      statusCd: '10004',
      statusName: '已完成',
      actualCost: 88,
    })
  })
})
