/**
 * 鐗╁搧鏀捐妯″潡 Mock 鎺ュ彛
 * 鍏变韩涓氬姟閫昏緫宸茶縼绉诲埌 `server/modules/item-release`锛岃繖閲屼粎淇濈暀 Vite mock 鍖呰灞傘€?
 */

import { createItemReleaseEndpointDefinitions } from '../../../server/modules/item-release/endpoints'
import { createLegacyMockDefinitionsFromEndpoints } from '../../../server/shared/runtime/mock-definition-adapter'
import { defineUniAppMock } from './shared/utils'

export default defineUniAppMock(
  createLegacyMockDefinitionsFromEndpoints(createItemReleaseEndpointDefinitions()),
)
