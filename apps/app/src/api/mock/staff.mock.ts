/**
 * 员工通讯录模块 Mock 接口
 * 共享业务逻辑已经迁移到 `server/modules/staff`，这里只保留 Vite mock 包装层。
 */

import { createStaffEndpointDefinitions } from '../../../server/modules/staff/endpoints'
import { createLegacyMockDefinitionsFromEndpoints } from '../../../server/shared/runtime/mock-definition-adapter'
import { defineUniAppMock } from './shared/utils'

export default defineUniAppMock(
  createLegacyMockDefinitionsFromEndpoints(createStaffEndpointDefinitions()),
)
