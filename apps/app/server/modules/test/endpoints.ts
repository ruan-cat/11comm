import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { TestModuleRepository } from './repository.ts'
import { errorResponse, successResponse } from '../../shared/runtime/response-builder.ts'
import { testMockRepository } from './repository.ts'

/** 创建 `test` 模块的共享 endpoint 定义。 */
export function createTestEndpointDefinitions(
  repository: TestModuleRepository = testMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/test',
      method: 'GET',
      handler: () => successResponse(repository.getSnapshot(), 'Mock 插件工作正常'),
    },
    {
      url: '/test/params',
      method: ['GET', 'POST'],
      handler: ({ query, body }) => successResponse(repository.echoParams(query, body), '参数测试成功'),
    },
    {
      url: '/test/error',
      method: 'GET',
      handler: ({ query }) => {
        if (repository.createErrorPayload(optionalString(query.trigger))) {
          return errorResponse('模拟服务器错误', '500')
        }

        return successResponse(null, '正常响应')
      },
    },
  ]
}

/** 导出默认的 test endpoint 集合。 */
export const testEndpointDefinitions = createTestEndpointDefinitions()

function optionalString(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined
  }

  const text = `${value}`.trim()
  return text || undefined
}
