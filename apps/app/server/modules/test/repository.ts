export interface TestModuleRepository {
  createErrorPayload: (trigger?: string) => boolean
  echoParams: (query: Record<string, any>, body: Record<string, any>) => {
    receivedBody: Record<string, any>
    receivedQuery: Record<string, any>
  }
  getSnapshot: () => {
    plugin: string
    timestamp: number
    version: string
  }
}

/** 创建 `test` 模块的 mock 内存仓库。 */
export function createTestMockRepository(): TestModuleRepository {
  return {
    createErrorPayload(trigger) {
      return trigger === 'error'
    },
    echoParams(query, body) {
      return {
        receivedQuery: query,
        receivedBody: body,
      }
    },
    getSnapshot() {
      return {
        timestamp: Date.now(),
        version: '1.0.0',
        plugin: 'vite-plugin-mock-dev-server',
      }
    },
  }
}

/** 导出默认的 test mock 仓库实例。 */
export const testMockRepository = createTestMockRepository()
