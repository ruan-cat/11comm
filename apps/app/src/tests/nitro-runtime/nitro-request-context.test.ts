import { describe, expect, test } from 'vitest'
import {
  createDispatchInputFromNitroSnapshot,
  normalizeRequestBody,
} from '../../../server/shared/runtime/nitro-request-context'

describe('nitro request context', () => {
  test('normalizes Nitro snapshots into shared dispatch inputs', () => {
    expect(createDispatchInputFromNitroSnapshot({
      method: 'post',
      path: '/app/workorder/detail',
      query: {
        orderId: 'WO_001',
      },
      body: {
        orderId: 'WO_001',
      },
    })).toEqual({
      method: 'POST',
      path: '/app/workorder/detail',
      query: {
        orderId: 'WO_001',
      },
      body: {
        orderId: 'WO_001',
      },
    })
  })

  test('drops invalid or bodyless request payloads', () => {
    expect(normalizeRequestBody('GET', {
      orderId: 'WO_001',
    })).toEqual({})
    expect(normalizeRequestBody('POST', 'invalid')).toEqual({})
    expect(normalizeRequestBody('POST', {
      orderId: 'WO_002',
    })).toEqual({
      orderId: 'WO_002',
    })
  })
})
