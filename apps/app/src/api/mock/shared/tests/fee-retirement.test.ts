import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import feeMocks from '../../fee.mock'

const mockSourceFile = fileURLToPath(new URL('../../fee.mock.ts', import.meta.url))

describe('fee local mock retirement', () => {
  test('does not depend on old app server modules or adapter', () => {
    const source = readFileSync(mockSourceFile, 'utf8')

    expect(source).not.toContain('server/modules')
    expect(source).not.toContain('mock-definition-adapter')
  })

  test('exports local handlers for all fee urls', () => {
    const urls = feeMocks.map(mock => mock.url)

    expect(urls).toEqual(expect.arrayContaining([
      '/app/fee.listFee',
      '/app/fee.queryFeeDetail',
      '/app/feeApi/listOweFees',
      '/app/fee.saveRoomCreateFee',
      '/app/payment.nativeQrcodePayment',
      '/app/oweFeeCallable.listOweFeeCallable',
      '/app/oweFeeCallable.writeOweFeeCallable',
      '/app/iot/listChargeMachineBmoImpl',
      '/app/iot/listChargeMachineOrderBmoImpl',
      '/app/iot/listChargeMachinePortBmoImpl',
      '/app/reportFeeMonthStatistics.queryReportFeeSummary',
      '/app/reportFeeMonthStatistics/queryPayFeeDetail',
      '/app/reportFeeMonthStatistics.queryReportFeeDetailRoom',
      '/app/dataReport.queryFeeDataReport',
      '/app/machine/listMachineRecords',
      '/app/feeConfig.listFeeConfigs',
    ]))
  })
})
