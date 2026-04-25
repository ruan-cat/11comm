import { describe, expect, test } from 'vitest'
import { createMeterEndpointDefinitions } from '../../../server/modules/meter/endpoints'
import { createMeterMockRepository } from '../../../server/modules/meter/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('meter endpoints', () => {
  test('registers shared meter endpoints', () => {
    const registry = createEndpointRegistry(
      createMeterEndpointDefinitions(createMeterMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/meter.listMeterWaters')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/meter.saveMeterWater')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/meter.auditFloorShareReading')).toBeTruthy()
  })

  test('keeps meter list and config response structures stable', async () => {
    const registry = createEndpointRegistry(
      createMeterEndpointDefinitions(createMeterMockRepository()),
    )

    const readingListResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/meter.listMeterWaters',
      query: {
        page: 1,
        row: 5,
        communityId: 'COMM_001',
      },
    })

    const feeTypeResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/meter.queryFeeTypes',
      query: {},
    })

    const feeConfigResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/meter.queryFeeTypesItems',
      query: {
        feeTypeCd: feeTypeResponse.data[0].id,
        communityId: 'COMM_001',
      },
    })

    expect(Array.isArray(readingListResponse.data.list)).toBe(true)
    expect(Array.isArray(feeTypeResponse.data)).toBe(true)
    expect(Array.isArray(feeConfigResponse.data)).toBe(true)
  })

  test('persists meter saving and floor-share auditing mutations through shared endpoints', async () => {
    const registry = createEndpointRegistry(
      createMeterEndpointDefinitions(createMeterMockRepository()),
    )

    const meterTypeResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/meter.listMeterType',
      query: {
        page: 1,
        row: 10,
        communityId: 'COMM_001',
      },
    })

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/meter.saveMeterWater',
      body: {
        communityId: 'COMM_001',
        configId: 'CFG_WATER_001',
        objId: 'ROOM_RUNTIME_001',
        objName: '1-1-01',
        meterType: meterTypeResponse.data[0].typeId,
        preDegrees: 100,
        curDegrees: 118,
        preReadingTime: '2026-03-01 00:00:00',
        curReadingTime: '2026-03-02 00:00:00',
        remark: '手工录入',
      },
    })

    const savedReadingResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/meter.listMeterWaters',
      query: {
        page: 1,
        row: 5,
        communityId: 'COMM_001',
      },
    })

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/meter.saveFloorShareReading',
      body: {
        communityId: 'COMM_001',
        fsmId: 'FSM_0001',
        preDegrees: 200,
        curDegrees: 216,
        preReadingTime: '2026-03-01 00:00:00',
        curReadingTime: '2026-03-02 00:00:00',
        remark: '公摊抄表',
      },
    })

    const floorShareResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/meter.listFloorShareReading',
      query: {
        page: 1,
        row: 10,
        communityId: 'COMM_001',
      },
    })
    const pendingReading = floorShareResponse.data.list[0]

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/meter.auditFloorShareReading',
      body: {
        state: 'F',
        auditRemark: '数据异常，驳回',
        readingId: pendingReading.readingId,
        communityId: 'COMM_001',
      },
    })

    const refreshedFloorShareResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/meter.listFloorShareReading',
      query: {
        page: 1,
        row: 10,
        communityId: 'COMM_001',
      },
    })

    expect(savedReadingResponse.data.list[0]).toMatchObject({
      objId: 'ROOM_RUNTIME_001',
      curDegrees: 118,
    })
    expect(refreshedFloorShareResponse.data.list[0]).toMatchObject({
      readingId: pendingReading.readingId,
      state: 'F',
      stateName: '已拒绝',
      auditRemark: '数据异常，驳回',
    })
  })
})
