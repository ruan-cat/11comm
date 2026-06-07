import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import parkingMocks from '../../parking.mock'

const mockSourceFile = fileURLToPath(new URL('../../parking.mock.ts', import.meta.url))

describe('parking local mock retirement', () => {
  test('does not depend on old app server modules or adapter', () => {
    const source = readFileSync(mockSourceFile, 'utf8')

    expect(source).not.toContain('server/modules')
    expect(source).not.toContain('mock-definition-adapter')
  })

  test('exports local handlers for all parking urls', () => {
    const urls = parkingMocks.map(mock => mock.url)

    expect(urls).toEqual(expect.arrayContaining([
      '/app/owner.queryOwnerCars',
      '/app/parkingArea.listParkingAreas',
      '/app/machine.listParkingAreaMachines',
      '/app/machine/openDoor',
      '/app/machine/closeDoor',
      '/app/machine.customCarInOutCmd',
      '/app/carInout.listCarInParkingAreaCmd',
      '/app/parkingCoupon.listParkingCouponCar',
      '/app/tempCarFee.getTempCarFeeOrder',
      '/app/carInoutDetail.listCarInoutDetail',
      '/app/carInoutPayment.listCarInoutPayment',
      '/app/machine.getBarrierCloudVideo',
    ]))
  })
})
