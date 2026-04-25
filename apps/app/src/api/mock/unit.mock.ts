/**
 * 单元模块 Mock 接口
 * 共享业务逻辑已迁移到 `server/modules/unit`，这里仅保留 Vite mock 包装层。
 */

import { createUnitEndpointDefinitions } from '../../../server/modules/unit/endpoints'
import { createLegacyMockDefinitionsFromEndpoints } from '../../../server/shared/runtime/mock-definition-adapter'
import { defineUniAppMock } from './shared/utils'

export default defineUniAppMock(
  createLegacyMockDefinitionsFromEndpoints(createUnitEndpointDefinitions()),
)
