import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import couponMocks from '../../coupon.mock'
import inspectionMocks from '../../inspection.mock'
import itemReleaseMocks from '../../item-release.mock'

const mockSourceFiles = [
  fileURLToPath(new URL('../../coupon.mock.ts', import.meta.url)),
  fileURLToPath(new URL('../../inspection.mock.ts', import.meta.url)),
  fileURLToPath(new URL('../../item-release.mock.ts', import.meta.url)),
]

describe('coupon inspection item-release local mock retirement', () => {
  test('do not depend on old app server modules or adapter', () => {
    const source = mockSourceFiles.map(file => readFileSync(file, 'utf8')).join('\n')

    expect(source).not.toContain('server/modules')
    expect(source).not.toContain('mock-definition-adapter')
  })

  test('export local handlers for coupon inspection and item-release urls', () => {
    const mocks = [...couponMocks, ...inspectionMocks, ...itemReleaseMocks]
    const urls = mocks.map(mock => mock.url)

    expect(urls).toEqual(expect.arrayContaining([
      '/app/couponProperty.listCouponPropertyUserDetail',
      '/app/couponProperty.writeOffCouponPropertyUser',
      '/app/integral.listIntegralSetting',
      '/app/integral.useIntegral',
      '/app/integral.listIntegralUserDetail',
      '/app/reserveOrder.listReserveGoodsConfirmOrder',
      '/app/reserveOrder.saveReserveGoodsConfirmOrder',
      '/app/inspection.listInspectionTasks',
      '/app/inspection.getTodayReport',
      '/app/inspection.listInspectionTaskDetails',
      '/app/inspection.listInspectionItemTitles',
      '/app/inspection.submitInspection',
      '/app/staff.listStaffs',
      '/app/inspection.transferTask',
      '/app/itemRelease.queryUndoItemReleaseV2',
      '/app/itemRelease.queryFinishItemReleaseV2',
      '/app/itemRelease.getItemRelease',
      '/app/itemRelease.getItemReleaseRes',
      '/app/itemRelease.queryOaWorkflowUser',
      '/app/itemRelease.auditItemRelease',
    ]))
  })
})
