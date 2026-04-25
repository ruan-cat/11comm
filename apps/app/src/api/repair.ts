/**
 * 维修工单模块 API 接口定义
 * 对应业务：维修工单流程管理
 */

import type {
  CreateRepairReq,
  DispatchAction,
  RepairListParams,
  RepairListResponse,
  RepairOrder,
  RepairResource,
  RepairStatistics,
  UpdateRepairReq,
} from '@/types/repair'
import { http } from '@/http/alova'

/** ==================== 查询接口 ==================== */

/** 1. 查询维修工单列表（工单池） */
export function getRepairOrderList(params: RepairListParams) {
  return http.Get<RepairListResponse>('/app/ownerRepair.listOwnerRepairs', { params })
}

/** 2. 查询维修待办单列表 */
export function getRepairDispatchList(params: RepairListParams) {
  return http.Get<RepairListResponse>('/app/ownerRepair.listStaffRepairs', { params })
}

/** 3. 查询维修已办单列表 */
export function getRepairFinishList(params: RepairListParams) {
  return http.Get<RepairListResponse>('/app/ownerRepair.listStaffFinishRepairs', { params })
}

/** 4. 获取维修工单详情 */
export function getRepairDetail(params: { repairId: string, storeId?: string, communityId?: string }) {
  return http.Get<{ ownerRepair?: RepairOrder }>('/app/ownerRepair.queryOwnerRepair', {
    params,
  })
}

/** 5. 获取维修统计数据 */
export function getRepairStatistics(communityId?: string) {
  return http.Get<RepairStatistics>('/app/ownerRepair.getRepairStatistics', {
    params: { communityId },
  })
}

/** 6. 查询维修师傅列表 */
export function getRepairStaffs(params?: { repairType?: string, communityId?: string }) {
  return http.Get<{ staffs: Array<{ staffId: string, staffName: string, repairTypes: string[] }> }>(
    '/app/ownerRepair.listRepairStaffs',
    { params },
  )
}

/** 7. 查询报修师傅（按维修类型查询） */
export function getRepairTypeUsers(params: { repairType: string, communityId?: string }) {
  return http.Get<{ users: Array<{ userId: string, userName: string }> }>('/app/repair.listRepairTypeUsers', {
    params,
  })
}

/** 8. 查询维修物品/资源列表 */
export function queryResources(params?: { keyword?: string, resTypeId?: string, page?: number, row?: number }) {
  return http.Get<{
    resources: Array<{
      resId: string
      resName: string
      resTypeName: string
      price?: number
      unit?: string
      stock?: number
    }>
    total: number
  }>('/app/resourceStore.listUserStorehouses', { params })
}

/** ==================== 创建和更新接口 ==================== */

/** 9. 创建维修工单 */
export function createRepairOrder(data: CreateRepairReq) {
  return http.Post<{ ownerRepair: RepairOrder }>('/app/ownerRepair.saveOwnerRepair', data)
}

/** 10. 更新维修工单 */
export function updateRepairOrder(data: UpdateRepairReq) {
  return http.Post<{ ownerRepair: RepairOrder }>('/app/ownerRepair.updateOwnerRepair', data)
}

/** ==================== 工单处理接口 ==================== */

/** 11. 派单/转单/退单（统一接口） */
export function dispatchRepair(data: {
  repairId: string
  staffId: string
  staffName: string
  action: DispatchAction
  context: string
  repairType?: string
  communityId?: string
  photos?: Array<{ photo: string }>
  userId?: string
  userName?: string
}) {
  return http.Post<{ success: boolean }>('/app/ownerRepair.repairDispatch', data)
}

/** 12. 办结工单 */
export function finishRepair(data: {
  repairId: string
  feeFlag: string
  context: string
  repairChannel?: string
  publicArea?: string
  maintenanceType?: string
  repairType?: string
  action?: string
  communityId?: string
  beforeRepairPhotos?: Array<{ photo: string }>
  afterRepairPhotos?: Array<{ photo: string }>
  repairObjType?: string
  userId?: string
  userName?: string
  storeId?: string
  choosedGoodsList?: RepairResource[]
  totalPrice?: number
  payType?: string
}) {
  return http.Post<{ success: boolean }>('/app/ownerRepair.repairFinish', data)
}

/** 13. 结束订单 */
export function endRepair(data: { repairId: string, communityId: string, context: string }) {
  return http.Post<{ success: boolean }>('/app/ownerRepair.repairEnd', data)
}

/** 14. 开始维修 */
export function repairStart(data: { repairId: string, communityId?: string }) {
  return http.Post<{ success: boolean }>('/app/ownerRepair.repairStart', data)
}

/** 15. 暂停维修 */
export function repairStop(data: { repairId: string, communityId?: string, remark?: string }) {
  return http.Post<{ success: boolean }>('/app/ownerRepair.repairStop', data)
}

/** ==================== 评价相关接口 ==================== */

/** 16. 回访工单（业主评价） */
export function appraiseRepair(data: {
  repairId: string
  repairType?: string
  repairChannel?: string
  publicArea?: string
  communityId?: string
  context: string
}) {
  return http.Post<{ success: boolean }>('/callComponent/ownerRepair.appraiseRepair', data)
}

/** 17. 回复评价 */
export function replyAppraise(data: { ruId: string, repairId: string, reply: string, communityId?: string }) {
  return http.Post<{ success: boolean }>('/app/repair.replyRepairAppraise', data)
}

/** ==================== 其他接口 ==================== */

/** 18. 查询维修相关配置信息（维修类型/状态等） */
export function queryRepairInfo(params?: { communityId?: string, rsts?: string }) {
  return http.Get<{
    resourceStoreTypes: Array<{
      rstId: string
      name: string
      parentRstId?: string
    }>
  }>('/app/resourceStoreType.listResourceStoreTypes', { params })
}

/** 19. 查询字典数据 */
export function queryDictInfo(params: { domain: string, name?: string }) {
  return http.Get<{
    list: Array<{
      statusCd: string
      name: string
    }>
  }>('/callComponent/core/list', { params })
}

/** 20. 抢单 */
export function robRepairOrder(data: { repairId: string, staffId: string, staffName: string, communityId?: string }) {
  return http.Post<{ success: boolean }>('/app/ownerRepair.grabbingRepair', data)
}

/** 21. 获取报修类型配置列表 */
export function getRepairSettings(params: { communityId: string, publicArea: 'T' | 'F', page?: number, row?: number }) {
  return http.Get<
    Array<{
      repairType: string
      repairTypeName: string
      payFeeFlag: 'T' | 'F'
      priceScope?: string
      publicArea: 'T' | 'F'
    }>
  >('/app/repairSetting.listRepairSettings', { params })
}

/** ==================== 新增缺失的 API 函数 ==================== */

/** 22. 查询维修状态字典 */
export function getRepairStates() {
  return http.Get<Array<{ statusCd: string, name: string }>>('/app/dict.queryRepairStates', {})
}

/** 23. 查询维修师傅待办列表（别名，与 getRepairDispatchList 相同） */
export function getRepairStaffList(params: RepairListParams) {
  return http.Get<RepairListResponse>('/app/ownerRepair.listStaffRepairs', { params })
}

/** 24. 查询工单流转记录 */
export function getRepairStaffRecords(params: { repairId: string, communityId?: string }) {
  return http.Get<{
    staffRecords?: Array<{
      ruId?: string
      repairId: string
      staffId: string
      staffName?: string
      statusCd?: string
      statusName?: string
      startTime?: string
      endTime?: string
      context?: string
      payTypeName?: string
    }>
  }>('/app/ownerRepair.listRepairStaffRecords', { params })
}

/** 25. 查询支付方式字典 */
export function getRepairPayTypes() {
  return http.Get<Array<{ statusCd: string, name: string }>>('/app/dict.queryPayTypes', {})
}

/** 26. 查询维修物资 */
export function getRepairResources(params: { rstId: string, communityId?: string }) {
  return http.Get<{
    resources: Array<{
      resId: string
      resName: string
      resTypeName?: string
      specName?: string
      price?: number
      outLowPrice?: number
      outHighPrice?: number
      unit?: string
      stock?: number
    }>
  }>('/app/resourceStore.listResources', { params })
}

/** 27. 查询物资类型 */
export function getRepairResourceTypes(params: { communityId?: string, parentId?: string }) {
  return http.Get<Array<{ rstId: string, name: string, parentRstId?: string }>>(
    '/app/resourceStoreType.listResourceStoreTypes',
    { params },
  )
}
