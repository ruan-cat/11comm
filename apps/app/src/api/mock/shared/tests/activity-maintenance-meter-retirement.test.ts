import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import activityMocks from '../../activity.mock'
import maintenanceMocks from '../../maintenance.mock'
import meterMocks from '../../meter.mock'

const mockSourceFiles = [
  fileURLToPath(new URL('../../activity.mock.ts', import.meta.url)),
  fileURLToPath(new URL('../../maintenance.mock.ts', import.meta.url)),
  fileURLToPath(new URL('../../meter.mock.ts', import.meta.url)),
]

describe('activity maintenance meter local mock retirement', () => {
  test('do not depend on old app server modules or adapter', () => {
    const source = mockSourceFiles.map(file => readFileSync(file, 'utf8')).join('\n')

    expect(source).not.toContain('server/modules')
    expect(source).not.toContain('mock-definition-adapter')
  })

  test('export local handlers for activity maintenance and meter urls', () => {
    const mocks = [...activityMocks, ...maintenanceMocks, ...meterMocks]
    const urls = mocks.map(mock => mock.url)

    expect(urls).toEqual(expect.arrayContaining([
      '/app/activities.listActivitiess',
      '/app/activities.saveActivities',
      '/app/activities.updateActivities',
      '/app/activities.deleteActivities',
      '/app/activities.increaseView',
      '/app/activities.likeActivity',
      '/app/activities.updateStatus',
      '/app/activities.updateLike',
      '/app/activities.updateCollect',
      '/app/maintenance.listMaintenanceTasks',
      '/app/maintenance.queryMaintenanceTask',
      '/app/maintenance.listMaintenanceTaskDetails',
      '/app/maintenance.startMaintenanceTask',
      '/app/maintenance.completeMaintenanceTask',
      '/app/maintenance.submitMaintenanceSingle',
      '/app/maintenance.transferMaintenanceTask',
      '/app/meter.listMeterWaters',
      '/app/meter.queryFeeTypes',
      '/app/meter.queryFeeTypesItems',
      '/app/meter.listMeterType',
      '/app/meter.queryPreMeterWater',
      '/app/meter.saveMeterWater',
      '/app/meter.listFloorShareReading',
      '/app/meter.listFloorShareMeter',
      '/app/meter.saveFloorShareReading',
      '/app/meter.auditFloorShareReading',
    ]))
  })
})
