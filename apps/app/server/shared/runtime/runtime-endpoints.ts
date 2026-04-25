import { activityEndpointDefinitions } from '../../modules/activity/endpoints.ts'
import { appointmentEndpointDefinitions } from '../../modules/appointment/endpoints.ts'
import { complaintEndpointDefinitions } from '../../modules/complaint/endpoints.ts'
import { contactEndpointDefinitions } from '../../modules/contact/endpoints.ts'
import { couponEndpointDefinitions } from '../../modules/coupon/endpoints.ts'
import { feeRuntimeEndpointDefinitions } from '../../modules/fee/endpoints.ts'
import { floorEndpointDefinitions } from '../../modules/floor/endpoints.ts'
import { inspectionRuntimeEndpointDefinitions } from '../../modules/inspection/endpoints.ts'
import { itemReleaseEndpointDefinitions } from '../../modules/item-release/endpoints.ts'
import { maintenanceRuntimeEndpointDefinitions } from '../../modules/maintenance/endpoints.ts'
import { meterRuntimeEndpointDefinitions } from '../../modules/meter/endpoints.ts'
import { noticeEndpointDefinitions } from '../../modules/notice/endpoints.ts'
import { oaWorkflowRuntimeEndpointDefinitions } from '../../modules/oa-workflow/endpoints.ts'
import { ownerEndpointDefinitions } from '../../modules/owner/endpoints.ts'
import { parkingRuntimeEndpointDefinitions } from '../../modules/parking/endpoints.ts'
import { profileEndpointDefinitions } from '../../modules/profile/endpoints.ts'
import { propertyApplicationRuntimeEndpointDefinitions } from '../../modules/property-application/endpoints.ts'
import { purchaseRuntimeEndpointDefinitions } from '../../modules/purchase/endpoints.ts'
import { renovationRuntimeEndpointDefinitions } from '../../modules/renovation/endpoints.ts'
import { repairRuntimeEndpointDefinitions } from '../../modules/repair/endpoints.ts'
import { resourceRuntimeEndpointDefinitions } from '../../modules/resource/endpoints.ts'
import { roomEndpointDefinitions } from '../../modules/room/endpoints.ts'
import { staffEndpointDefinitions } from '../../modules/staff/endpoints.ts'
import { testEndpointDefinitions } from '../../modules/test/endpoints.ts'
import { unitEndpointDefinitions } from '../../modules/unit/endpoints.ts'
import { videoEndpointDefinitions } from '../../modules/video/endpoints.ts'
import { visitEndpointDefinitions } from '../../modules/visit/endpoints.ts'
import { workOrderRuntimeEndpointDefinitions } from '../../modules/work-order/endpoints.ts'
import { legacyEndpointDefinitions } from './legacy-endpoints.ts'

/**
 * 当前 Nitro dispatcher 实际使用的端点集合。
 *
 * 已经完成共享化拆分的模块，优先走显式注册的共享端点；
 * 其余模块继续由全量 legacy 适配层兜底，保持全量 Nitro 覆盖。
 * 其中 purchase 只把非冲突 URL 放进 Nitro 优先层，避免破坏兼容合并策略。
 */
export const runtimeEndpointDefinitions = [
  ...activityEndpointDefinitions,
  ...appointmentEndpointDefinitions,
  ...complaintEndpointDefinitions,
  ...contactEndpointDefinitions,
  ...couponEndpointDefinitions,
  ...feeRuntimeEndpointDefinitions,
  ...floorEndpointDefinitions,
  ...inspectionRuntimeEndpointDefinitions,
  ...itemReleaseEndpointDefinitions,
  ...maintenanceRuntimeEndpointDefinitions,
  ...meterRuntimeEndpointDefinitions,
  ...noticeEndpointDefinitions,
  ...oaWorkflowRuntimeEndpointDefinitions,
  ...ownerEndpointDefinitions,
  ...parkingRuntimeEndpointDefinitions,
  ...profileEndpointDefinitions,
  ...propertyApplicationRuntimeEndpointDefinitions,
  ...purchaseRuntimeEndpointDefinitions,
  ...renovationRuntimeEndpointDefinitions,
  ...repairRuntimeEndpointDefinitions,
  ...resourceRuntimeEndpointDefinitions,
  ...roomEndpointDefinitions,
  ...staffEndpointDefinitions,
  ...testEndpointDefinitions,
  ...unitEndpointDefinitions,
  ...videoEndpointDefinitions,
  ...visitEndpointDefinitions,
  ...workOrderRuntimeEndpointDefinitions,
  ...legacyEndpointDefinitions,
]
