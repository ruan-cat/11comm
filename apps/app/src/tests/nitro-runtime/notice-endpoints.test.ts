import { describe, expect, test } from 'vitest'
import { createNoticeEndpointDefinitions } from '../../../server/modules/notice/endpoints'
import { createNoticeMockRepository } from '../../../server/modules/notice/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('notice endpoints', () => {
  test('registers the legacy notice endpoint', () => {
    const registry = createEndpointRegistry(createNoticeEndpointDefinitions(createNoticeMockRepository()))

    expect(findEndpointDefinition(registry, 'GET', '/app/notice.listNotices')).toBeTruthy()
  })

  test('keeps the notice list response structure stable', async () => {
    const registry = createEndpointRegistry(createNoticeEndpointDefinitions(createNoticeMockRepository()))

    const allResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/notice.listNotices',
      query: {
        page: 1,
        row: 5,
        communityId: 'COMM_001',
      },
    })

    const notice = allResponse.data.notices[0]

    const filteredResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/notice.listNotices',
      query: {
        page: 1,
        row: 5,
        communityId: notice.communityId,
        noticeId: notice.noticeId,
      },
    })

    expect(Array.isArray(allResponse.data.notices)).toBe(true)
    expect(filteredResponse.data.notices[0]).toMatchObject({
      noticeId: notice.noticeId,
    })
  })
})
