import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import oaWorkflowMocks from '../../oa-workflow.mock'

const mockSourceFile = fileURLToPath(new URL('../../oa-workflow.mock.ts', import.meta.url))

describe('oa workflow local mock retirement', () => {
  test('does not depend on old app server modules or adapter', () => {
    const source = readFileSync(mockSourceFile, 'utf8')

    expect(source).not.toContain('server/modules')
    expect(source).not.toContain('mock-definition-adapter')
  })

  test('exports local handlers for all oa workflow urls', () => {
    const urls = oaWorkflowMocks.map(mock => mock.url)

    expect(urls).toEqual(expect.arrayContaining([
      '/app/oa/workflow/query',
      '/app/oa/workflow/form/query',
      '/app/oa/workflow/form/data/query',
      '/app/oa/workflow/form/save',
      '/app/oa/workflow/form/update',
      '/app/oa/workflow/task/undo/query',
      '/app/oa/workflow/task/his/query',
      '/app/oa/workflow/user/query',
      '/app/oa/workflow/image/run',
      '/app/oa/workflow/task/next',
      '/app/oa/workflow/audit',
      '/app/oa/workflow/undo/next-deal-user',
      '/app/oa/workflow/undo/audit',
    ]))
  })
})
