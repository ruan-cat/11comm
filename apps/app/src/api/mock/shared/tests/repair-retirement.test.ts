import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import repairMocks from '../../repair.mock'

const mockSourceFile = fileURLToPath(new URL('../../repair.mock.ts', import.meta.url))

describe('repair local mock retirement', () => {
  test('does not depend on old app server modules or adapter', () => {
    const source = readFileSync(mockSourceFile, 'utf8')

    expect(source).not.toContain('server/modules')
    expect(source).not.toContain('mock-definition-adapter')
  })

  test('exports local handlers for all repair urls', () => {
    const urls = repairMocks.map(mock => mock.url)

    expect(urls).toEqual(expect.arrayContaining([
      '/app/ownerRepair.listOwnerRepairs',
      '/app/ownerRepair.listStaffRepairs',
      '/app/ownerRepair.listStaffFinishRepairs',
      '/app/ownerRepair.queryOwnerRepair',
      '/app/ownerRepair.saveOwnerRepair',
      '/app/ownerRepair.updateOwnerRepair',
      '/app/ownerRepair.repairDispatch',
      '/app/ownerRepair.repairFinish',
      '/app/ownerRepair.repairEnd',
      '/callComponent/ownerRepair.appraiseRepair',
      '/app/repair.replyRepairAppraise',
      '/app/ownerRepair.listRepairStaffs',
      '/app/repair.listRepairTypeUsers',
      '/app/resourceStore.listUserStorehouses',
      '/app/ownerRepair.getRepairStatistics',
      '/app/resourceStoreType.listResourceStoreTypes',
      '/app/repairSetting.listRepairSettings',
      '/callComponent/core/list',
      '/app/ownerRepair.repairStart',
      '/app/ownerRepair.repairStop',
      '/app/ownerRepair.grabbingRepair',
      '/app/dict.queryRepairStates',
      '/app/ownerRepair.listRepairStaffRecords',
      '/app/dict.queryPayTypes',
      '/app/resourceStore.listResources',
    ]))
  })
})
