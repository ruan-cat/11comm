/**
 * 娲诲姩妯″潡 Mock 鎺ュ彛
 * 鍏变韩涓氬姟閫昏緫宸茶縼绉诲埌 `server/modules/activity`锛岃繖閲屼粎淇濈暀 Vite mock 鍖呰灞傘€?
 */

import { createActivityEndpointDefinitions } from '../../../server/modules/activity/endpoints'
import { createLegacyMockDefinitionsFromEndpoints } from '../../../server/shared/runtime/mock-definition-adapter'
import { defineUniAppMock } from './shared/utils'

export default defineUniAppMock(
  createLegacyMockDefinitionsFromEndpoints(createActivityEndpointDefinitions()),
)
