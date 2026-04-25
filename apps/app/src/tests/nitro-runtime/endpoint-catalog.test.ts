import { describe, expect, test } from 'vitest'
import rootCatalogHandler from '../../../server/routes/index.get'
import {
  createEndpointCatalog,
  renderEndpointCatalogHtml,
} from '../../../server/shared/runtime/endpoint-catalog'
import { runtimeEndpointDefinitions } from '../../../server/shared/runtime/runtime-endpoints'

describe('endpoint catalog', () => {
  test('deduplicates repeated url registrations and merges methods by url', () => {
    const catalog = createEndpointCatalog([
      {
        url: '/',
        method: 'GET',
      },
      {
        url: '/app/example',
        method: 'POST',
      },
      {
        url: '/app/example',
        method: ['GET', 'POST'],
      },
      {
        url: '/app/example/:id',
        method: 'DELETE',
      },
      {
        url: '/callComponent/core/list',
        method: 'POST',
      },
    ])

    expect(catalog.summary.totalDefinitions).toBe(5)
    expect(catalog.summary.totalUrls).toBe(4)
    expect(catalog.summary.totalMethodMappings).toBe(5)
    expect(catalog.entries.find(entry => entry.url === '/app/example')).toMatchObject({
      methods: ['GET', 'POST'],
      groupKey: '/app',
      isDynamic: false,
      canOpenDirectly: true,
    })
    expect(catalog.entries.find(entry => entry.url === '/app/example/:id')).toMatchObject({
      methods: ['DELETE'],
      isDynamic: true,
      canOpenDirectly: false,
    })
  })

  test('renders the current nitro endpoint registry into an html catalog page', () => {
    const catalog = createEndpointCatalog([
      {
        url: '/',
        method: 'GET',
      },
      {
        url: '/__nitro/health',
        method: 'GET',
      },
      ...runtimeEndpointDefinitions,
    ])

    const html = renderEndpointCatalogHtml(catalog)

    expect(catalog.summary.totalUrls).toBeGreaterThan(20)
    expect(html).toContain('11comm-app Nitro 接口目录')
    expect(html).toContain('/__nitro/health')
    expect(html).toContain('/app/ownerRepair.listOwnerRepairs')
    expect(html).toContain('/callComponent/core/list')
  })

  test('returns html from the nitro root route handler', async () => {
    const response = await rootCatalogHandler({} as never)

    expect(response).toBeInstanceOf(Response)
    expect(response.headers.get('content-type')).toContain('text/html')
    await expect(response.text()).resolves.toContain('11comm-app Nitro 接口目录')
  })
})
