/**
 * 我的模块 Mock 接口
 * 共享业务逻辑已经迁移到 `server/modules/profile`，这里只保留 Vite mock 包装层。
 */

import { createProfileEndpointDefinitions } from '../../../server/modules/profile/endpoints'
import { createLegacyMockDefinitionsFromEndpoints } from '../../../server/shared/runtime/mock-definition-adapter'
import { defineUniAppMock } from './shared/utils'

export default defineUniAppMock(
  createLegacyMockDefinitionsFromEndpoints(createProfileEndpointDefinitions()),
)
