import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import {
  createPaginationResponse,
  errorResponse,
  successResponse,
} from '../utils'

const utilsSourcePath = fileURLToPath(new URL('../utils.ts', import.meta.url))

describe('mock shared utils', () => {
  test('does not depend on server shared runtime modules', () => {
    const source = readFileSync(utilsSourcePath, 'utf8')
    const forbiddenPath = 'server/shared/' + 'runtime'

    expect(source).not.toContain(forbiddenPath)
  })

  test('creates local compatible response helpers', () => {
    expect(successResponse({ id: 1 })).toMatchObject({
      success: true,
      code: '0',
      message: '操作成功',
      data: { id: 1 },
    })

    expect(errorResponse('失败', '400')).toMatchObject({
      success: false,
      code: '400',
      message: '失败',
      data: null,
    })
  })

  test('creates local compatible pagination responses', () => {
    expect(createPaginationResponse([1, 2, 3], 2, 2)).toEqual({
      list: [3],
      total: 3,
      page: 2,
      pageSize: 2,
      hasMore: false,
    })
  })
})
