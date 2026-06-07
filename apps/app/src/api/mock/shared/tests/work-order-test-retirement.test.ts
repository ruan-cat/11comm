import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import testMocks from '../../test.mock'
import workOrderMocks from '../../work-order.mock'

const mockSourceFiles = [
  fileURLToPath(new URL('../../work-order.mock.ts', import.meta.url)),
  fileURLToPath(new URL('../../test.mock.ts', import.meta.url)),
]

describe('work order and test local mock retirement', () => {
  test('do not depend on old app server modules or adapter', () => {
    const source = mockSourceFiles.map(file => readFileSync(file, 'utf8')).join('\n')

    expect(source).not.toContain('server/modules')
    expect(source).not.toContain('mock-definition-adapter')
  })

  test('export local handlers for work order and test urls', () => {
    const mocks = [...workOrderMocks, ...testMocks]
    const urls = mocks.map(mock => mock.url)

    expect(urls).toEqual(expect.arrayContaining([
      '/app/workorder/todo/list',
      '/app/workorder/copy/list',
      '/app/workorder/detail',
      '/app/workorder/create',
      '/app/workorder/update',
      '/app/workorder/start',
      '/app/workorder/complete',
      '/app/workorder/audit',
      '/app/workorder/cancel',
      '/app/workorder/task/list',
      '/app/workorder/task/items',
      '/app/workorder/copy/finish',
      '/test',
      '/test/params',
      '/test/error',
    ]))
  })
})
