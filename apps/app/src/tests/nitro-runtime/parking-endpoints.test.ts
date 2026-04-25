import { describe, expect, test } from 'vitest'
import { createParkingEndpointDefinitions } from '../../../server/modules/parking/endpoints'
import { createParkingMockRepository } from '../../../server/modules/parking/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('parking endpoints', () => {
  test('registers shared parking endpoints', () => {
    const registry = createEndpointRegistry(
      createParkingEndpointDefinitions(createParkingMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/owner.queryOwnerCars')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/machine/openDoor')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/machine.getBarrierCloudVideo')).toBeTruthy()
  })

  test('keeps parking query response structures stable', async () => {
    const registry = createEndpointRegistry(
      createParkingEndpointDefinitions(createParkingMockRepository()),
    )

    const ownerCarResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/owner.queryOwnerCars',
      query: {
        page: 1,
        row: 5,
        communityId: 'COMM_001',
      },
    })

    const parkingAreaResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/parkingArea.listParkingAreas',
      query: {
        page: 1,
        row: 10,
        communityId: 'COMM_001',
      },
    })

    const machineResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/machine.listParkingAreaMachines',
      query: {
        page: 1,
        row: 10,
        communityId: 'COMM_001',
        paNum: parkingAreaResponse.data[0].num,
      },
    })

    expect(Array.isArray(ownerCarResponse.data.list)).toBe(true)
    expect(Array.isArray(parkingAreaResponse.data)).toBe(true)
    expect(Array.isArray(machineResponse.data)).toBe(true)
  })

  test('keeps action endpoints and video lookup working through shared endpoints', async () => {
    const registry = createEndpointRegistry(
      createParkingEndpointDefinitions(createParkingMockRepository()),
    )

    const machineResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/machine.listParkingAreaMachines',
      query: {
        page: 1,
        row: 10,
        communityId: 'COMM_001',
        paNum: 'P1',
      },
    })
    const machine = machineResponse.data[0]

    const openDoorResponse = await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/machine/openDoor',
      body: {
        communityId: 'COMM_001',
        machineCode: machine.machineCode,
      },
    })

    const customInOutResponse = await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/machine.customCarInOutCmd',
      body: {
        machineId: machine.machineId,
        machineCode: machine.machineCode,
        communityId: 'COMM_001',
        paId: 'PA_001',
        paNum: 'P1',
        boxId: machine.boxId,
        carNum: '粤B12345',
        type: '1101',
      },
    })

    const videoResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/machine.getBarrierCloudVideo',
      query: {
        machineId: machine.machineId,
        communityId: 'COMM_001',
      },
    })

    expect(openDoorResponse.data).toMatchObject({ success: true })
    expect(customInOutResponse.message).toBe('车辆进场成功')
    expect(videoResponse.data).toMatchObject({ url: machine.videoUrl })
  })
})
