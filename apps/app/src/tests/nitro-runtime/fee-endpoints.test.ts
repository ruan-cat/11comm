import { describe, expect, test } from 'vitest'
import {
  createFeeEndpointDefinitions,
  feeRuntimeEndpointDefinitions,
} from '../../../server/modules/fee/endpoints'
import { createFeeMockRepository } from '../../../server/modules/fee/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'
import { runtimeEndpointDefinitions } from '../../../server/shared/runtime/runtime-endpoints'

describe('fee endpoints', () => {
  test('registers shared fee endpoints', () => {
    const registry = createEndpointRegistry(
      createFeeEndpointDefinitions(createFeeMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/fee.queryFeeDetail')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/fee.listFee')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/payment.nativeQrcodePayment')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/iot/listChargeMachineBmoImpl')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/workorder/task/list')).toBeUndefined()
  })

  test('registers non-conflict fee endpoints in the Nitro priority layer', () => {
    const registry = createEndpointRegistry(feeRuntimeEndpointDefinitions)

    expect(findEndpointDefinition(registry, 'GET', '/app/fee.queryFeeDetail')).toBeUndefined()
    expect(findEndpointDefinition(registry, 'GET', '/app/fee.listFee')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/iot/listChargeMachineOrderBmoImpl')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/reportFeeMonthStatistics.queryReportFeeSummary')).toBeTruthy()
  })

  test('serves fee endpoints from the actual Nitro runtime registry', async () => {
    const registry = createEndpointRegistry(runtimeEndpointDefinitions)

    expect(findEndpointDefinition(registry, 'GET', '/app/fee.queryFeeDetail')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/iot/listChargeMachineBmoImpl')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/reportFeeMonthStatistics.queryReportFeeSummary')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/reportFeeMonthStatistics/queryPayFeeDetail')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/machine/listMachineRecords')).toBeTruthy()

    const machines = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/iot/listChargeMachineBmoImpl',
      query: {
        page: 1,
        row: 10,
        communityId: 'COMM_001',
      },
    })
    expect(machines.data.list[0]).toMatchObject({
      machineId: 'MACHINE_001',
    })

    const summary = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/reportFeeMonthStatistics.queryReportFeeSummary',
      query: {
        page: 1,
        row: 10,
        communityId: 'COMM_001',
      },
    })
    expect(summary.data.list[0]).toMatchObject({
      receivedFee: expect.any(Number),
    })
  })

  test('keeps fee detail response structures stable', async () => {
    const registry = createEndpointRegistry(
      createFeeEndpointDefinitions(createFeeMockRepository()),
    )

    const response = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/fee.queryFeeDetail',
      query: {
        page: 1,
        row: 10,
        communityId: 'COMM_001',
        feeId: 'FEE_001',
      },
    })

    expect(Array.isArray(response.data.list)).toBe(true)
    expect(response.data.list[0]).toMatchObject({
      feeId: 'FEE_001',
      communityId: 'COMM_001',
    })
  })

  test('serves fee list, owe fee, callable, create fee and payment qrcode endpoints', async () => {
    const registry = createEndpointRegistry(
      createFeeEndpointDefinitions(createFeeMockRepository()),
    )

    const feeList = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/fee.listFee',
      query: {
        page: 1,
        row: 5,
        communityId: 'COMM_001',
      },
    })
    expect(feeList.data).toMatchObject({
      total: expect.any(Number),
      page: 1,
      row: 5,
    })
    expect(feeList.data.list[0]).toMatchObject({
      feeId: expect.any(String),
      roomId: expect.any(String),
      ownerName: expect.any(String),
      stateName: expect.any(String),
    })

    const oweFees = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/feeApi/listOweFees',
      query: {
        page: 1,
        row: 5,
        communityId: 'COMM_001',
      },
    })
    expect(oweFees.data.data[0]).toMatchObject({
      feeId: expect.any(String),
      oweAmount: expect.any(Number),
      totalAmount: expect.any(Number),
    })

    const callables = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/oweFeeCallable.listOweFeeCallable',
      query: {
        page: 1,
        row: 5,
        communityId: 'COMM_001',
        payerObjId: 'ROOM_001',
      },
    })
    expect(callables.data.list[0]).toMatchObject({
      feeId: expect.any(String),
      callableWayName: expect.any(String),
    })

    const writeCallable = await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/oweFeeCallable.writeOweFeeCallable',
      body: {
        communityId: 'COMM_001',
        feeIds: ['FEE_001'],
        roomId: 'ROOM_001',
        roomName: '1栋101室',
        remark: '电话提醒',
      },
    })
    expect(writeCallable.data).toMatchObject({
      code: 0,
      msg: '登记成功',
    })

    const createFee = await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/fee.saveRoomCreateFee',
      body: {
        locationObjId: 'ROOM_001',
        feeTypeCd: '888800010001',
        configId: 'CONFIG_001',
        startTime: '2026-04-01',
        endTime: '2026-04-30',
        feeFlag: '1003006',
        computingFormula: '4004',
        communityId: 'COMM_001',
      },
    })
    expect(createFee.data).toMatchObject({
      success: true,
      totalRoom: 1,
      successRoom: 1,
      errorRoom: 0,
    })

    const payment = await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/payment.nativeQrcodePayment',
      body: {
        roomId: 'ROOM_001',
        communityId: 'COMM_001',
        business: 'oweFee',
        feeIds: ['FEE_001'],
      },
    })
    expect(payment.data).toMatchObject({
      code: 0,
      msg: '生成二维码成功',
      data: {
        codeUrl: expect.stringContaining('ROOM_001'),
      },
    })
  })

  test('serves charge machine, report and open door log endpoints', async () => {
    const registry = createEndpointRegistry(
      createFeeEndpointDefinitions(createFeeMockRepository()),
    )

    const machines = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/iot/listChargeMachineBmoImpl',
      query: {
        page: 1,
        row: 10,
        communityId: 'COMM_001',
      },
    })
    expect(machines.data.list[0]).toMatchObject({
      machineId: 'MACHINE_001',
      machineName: expect.any(String),
      stateName: expect.any(String),
    })

    const orders = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/iot/listChargeMachineOrderBmoImpl',
      query: {
        page: 1,
        row: 10,
        communityId: 'COMM_001',
        machineId: 'MACHINE_001',
      },
    })
    expect(orders.data.list[0]).toMatchObject({
      orderId: expect.any(String),
      machineId: 'MACHINE_001',
      amount: expect.any(Number),
    })

    const ports = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/iot/listChargeMachinePortBmoImpl',
      query: {
        page: 1,
        row: 10,
        communityId: 'COMM_001',
        machineId: 'MACHINE_001',
      },
    })
    expect(ports.data.list[0]).toMatchObject({
      portId: expect.any(String),
      portCode: expect.any(String),
      stateName: expect.any(String),
    })

    const summary = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/reportFeeMonthStatistics.queryReportFeeSummary',
      query: {
        page: 1,
        row: 10,
        communityId: 'COMM_001',
      },
    })
    expect(summary.data.list[0]).toMatchObject({
      feeRoomCount: expect.any(Number),
      oweRoomCount: expect.any(Number),
      receivedFee: expect.any(Number),
    })

    const payFeeDetail = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/reportFeeMonthStatistics/queryPayFeeDetail',
      query: {
        page: 1,
        row: 10,
        communityId: 'COMM_001',
      },
    })
    expect(payFeeDetail.data).toMatchObject({
      total: expect.any(Number),
      list: expect.any(Array),
    })

    const roomFee = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/reportFeeMonthStatistics.queryReportFeeDetailRoom',
      query: {
        page: 1,
        row: 10,
        communityId: 'COMM_001',
      },
    })
    expect(roomFee.data.list[0]).toMatchObject({
      roomId: expect.any(String),
      feeName: expect.any(String),
      oweFee: expect.any(Number),
    })

    const dataReport = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/dataReport.queryFeeDataReport',
      query: {
        communityId: 'COMM_001',
        reportCode: 'FEE_REPORT',
      },
    })
    expect(dataReport.data.list[0]).toMatchObject({
      name: expect.any(String),
      value: expect.any(Number),
    })

    const openDoorLogs = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/machine/listMachineRecords',
      query: {
        page: 1,
        row: 10,
        communityId: 'COMM_001',
      },
    })
    expect(openDoorLogs.data.list[0]).toMatchObject({
      logId: expect.any(String),
      roomName: expect.any(String),
      openTypeName: expect.any(String),
    })
  })

  test('serves fee config endpoint for create fee page pickers', async () => {
    const registry = createEndpointRegistry(
      createFeeEndpointDefinitions(createFeeMockRepository()),
    )

    const response = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/feeConfig.listFeeConfigs',
      query: {
        page: 1,
        row: 500,
        communityId: 'COMM_001',
        feeTypeCd: '888800010001',
      },
    })

    expect(response.data[0]).toMatchObject({
      configId: expect.any(String),
      feeName: expect.any(String),
      feeFlag: expect.any(String),
      computingFormula: expect.any(String),
    })
  })
})
