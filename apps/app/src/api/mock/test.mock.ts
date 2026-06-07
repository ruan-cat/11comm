/**
 * 测试 Mock 接口。
 */

import { defineUniAppMock, errorResponse, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  query?: Record<string, unknown>
}

export default defineUniAppMock([
  {
    url: '/test',
    method: 'GET',
    body: () => successResponse({
      timestamp: Date.now(),
      version: '1.0.0',
      plugin: 'vite-plugin-mock-dev-server',
    }, 'Mock 插件工作正常'),
  },
  {
    url: '/test/params',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => successResponse({
      receivedQuery: context.query || {},
      receivedBody: context.body || {},
    }, '参数测试成功'),
  },
  {
    url: '/test/error',
    method: 'GET',
    body: (context: MockContext = {}) => {
      if (context.query?.trigger === 'error') {
        return errorResponse('模拟服务器错误', '500')
      }

      return successResponse(null, '正常响应')
    },
  },
])
