import { defineEventHandler } from 'nitro/h3'
import {
  createEndpointCatalog,
  renderEndpointCatalogHtml,
} from '../shared/runtime/endpoint-catalog.ts'
import { runtimeEndpointDefinitions } from '../shared/runtime/runtime-endpoints.ts'

/** Nitro 根地址接口目录页使用的系统接口定义。 */
const systemCatalogDefinitions = [
  {
    url: '/',
    method: 'GET',
  },
  {
    url: '/__nitro/health',
    method: 'GET',
  },
]

/** 根地址默认输出当前 Nitro 运行时的全部接口目录。 */
export default defineEventHandler(() => {
  const catalog = createEndpointCatalog([
    ...systemCatalogDefinitions,
    ...runtimeEndpointDefinitions,
  ])

  return new Response(renderEndpointCatalogHtml(catalog), {
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
  })
})
