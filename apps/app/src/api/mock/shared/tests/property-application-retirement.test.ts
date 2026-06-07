import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import propertyApplicationMocks from '../../property-application.mock'

const mockSourceFile = fileURLToPath(new URL('../../property-application.mock.ts', import.meta.url))

describe('property application local mock retirement', () => {
  test('does not depend on old app server modules or adapter', () => {
    const source = readFileSync(mockSourceFile, 'utf8')

    expect(source).not.toContain('server/modules')
    expect(source).not.toContain('mock-definition-adapter')
  })

  test('exports local handlers for all property application urls', () => {
    const urls = propertyApplicationMocks.map(mock => mock.url)

    expect(urls).toEqual(expect.arrayContaining([
      '/app/applyRoomDiscount/queryApplyRoomDiscount',
      '/app/applyRoomDiscount/updateApplyRoomDiscount',
      '/app/applyRoomDiscount/updateReviewApplyRoomDiscount',
      '/callComponent/core/list',
      '/app/feeDiscount/queryFeeDiscount',
      '/app/fee.queryFeeDetail',
      '/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord',
      '/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail',
      '/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord',
      '/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord',
    ]))
  })
})
