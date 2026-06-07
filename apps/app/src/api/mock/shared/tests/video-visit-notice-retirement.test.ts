import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import noticeMocks from '../../notice.mock'
import videoMocks from '../../video.mock'
import visitMocks from '../../visit.mock'

const mockSourceFiles = [
  fileURLToPath(new URL('../../video.mock.ts', import.meta.url)),
  fileURLToPath(new URL('../../visit.mock.ts', import.meta.url)),
  fileURLToPath(new URL('../../notice.mock.ts', import.meta.url)),
]

describe('video visit notice local mock retirement', () => {
  test('do not depend on old app server modules or adapter', () => {
    const source = mockSourceFiles.map(file => readFileSync(file, 'utf8')).join('\n')

    expect(source).not.toContain('server/modules')
    expect(source).not.toContain('mock-definition-adapter')
  })

  test('export local handlers for video visit and notice urls', () => {
    const mocks = [...videoMocks, ...visitMocks, ...noticeMocks]
    const urls = mocks.map(mock => mock.url)

    expect(urls).toEqual(expect.arrayContaining([
      '/app/video.listMonitorArea',
      '/app/video.listStaffMonitorMachine',
      '/app/video.getPlayVideoUrl',
      '/app/visit.getVisit',
      '/app/visit.getVisitDetail',
      '/app/visit.auditVisit',
      '/app/notice.listNotices',
    ]))
  })
})
