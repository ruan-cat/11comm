/**
 * 棰勭害鏍搁攢妯″潡 Mock 鎺ュ彛
 * 鍏变韩涓氬姟閫昏緫宸茶縼绉诲埌 `server/modules/appointment`锛岃繖閲屼粎淇濈暀 Vite mock 鍖呰灞傘€?
 */

import { createAppointmentEndpointDefinitions } from '../../../server/modules/appointment/endpoints'
import { createLegacyMockDefinitionsFromEndpoints } from '../../../server/shared/runtime/mock-definition-adapter'
import { defineUniAppMock } from './shared/utils'

export default defineUniAppMock(
  createLegacyMockDefinitionsFromEndpoints(createAppointmentEndpointDefinitions()),
)
