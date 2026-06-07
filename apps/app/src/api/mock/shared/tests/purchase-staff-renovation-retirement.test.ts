import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import purchaseMocks from '../../purchase.mock'
import renovationMocks from '../../renovation.mock'
import staffMocks from '../../staff.mock'

const mockSourceFiles = [
  fileURLToPath(new URL('../../purchase.mock.ts', import.meta.url)),
  fileURLToPath(new URL('../../staff.mock.ts', import.meta.url)),
  fileURLToPath(new URL('../../renovation.mock.ts', import.meta.url)),
]

describe('purchase staff renovation local mock retirement', () => {
  test('do not depend on old app server modules or adapter', () => {
    const source = mockSourceFiles.map(file => readFileSync(file, 'utf8')).join('\n')

    expect(source).not.toContain('server/modules')
    expect(source).not.toContain('mock-definition-adapter')
  })

  test('export local handlers for purchase staff and renovation urls', () => {
    const mocks = [...purchaseMocks, ...staffMocks, ...renovationMocks]
    const urls = mocks.map(mock => mock.url)

    expect(urls).toEqual(expect.arrayContaining([
      '/app/resourceStore.listResourceStores',
      '/app/purchase/purchaseApply',
      '/app/purchase/urgentPurchaseApply',
      '/app/query.staff.infos',
      '/app/staff/by-department',
      '/app/staff/search',
      '/app/staff/organizations',
      '/app/staff/update-online-status',
      '/app/staff/online',
      '/app/staff/add',
      '/app/staff/:staffId',
      '/app/roomRenovation/queryRoomRenovation',
      '/app/roomRenovation/updateRoomToExamine',
      '/app/roomRenovation/saveRoomRenovationDetail',
      '/app/roomRenovation/updateRoomRenovationState',
      '/app/roomRenovation/queryRoomRenovationRecord',
      '/app/roomRenovation/queryRoomRenovationRecordDetail',
      '/app/roomRenovation/updateRoomDecorationRecord',
      '/app/roomRenovation/deleteRoomRenovationRecord',
    ]))
  })
})
