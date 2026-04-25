import { describe, expect, test } from 'vitest'
import { createContactEndpointDefinitions } from '../../../server/modules/contact/endpoints'
import { createContactMockRepository } from '../../../server/modules/contact/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('contact endpoints', () => {
  test('registers the legacy contact endpoints', () => {
    const registry = createEndpointRegistry(createContactEndpointDefinitions(createContactMockRepository()))

    expect(findEndpointDefinition(registry, 'GET', '/app/contact.listContacts')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'GET', '/app/contact.getContactDetail')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/contact.updateOnlineStatus')).toBeTruthy()
  })

  test('keeps contact detail and update responses stable', async () => {
    const registry = createEndpointRegistry(createContactEndpointDefinitions(createContactMockRepository()))

    const listResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/contact.listContacts',
      query: {
        page: 1,
        row: 5,
      },
    })

    const contactId = listResponse.data.contacts[0].contactId

    const detailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/contact.getContactDetail',
      query: {
        contactId,
      },
    })
    const initialOnlineStatus = detailResponse.data.contact.isOnline

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/contact.updateOnlineStatus',
      body: {
        contactId,
        isOnline: !initialOnlineStatus,
      },
    })

    const updatedDetailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/contact.getContactDetail',
      query: {
        contactId,
      },
    })

    expect(Array.isArray(listResponse.data.contacts)).toBe(true)
    expect(detailResponse.data.contact).toMatchObject({ contactId })
    expect(updatedDetailResponse.data.contact).toMatchObject({ contactId })
    expect(updatedDetailResponse.data.contact.isOnline).toBe(!initialOnlineStatus)
  })
})
