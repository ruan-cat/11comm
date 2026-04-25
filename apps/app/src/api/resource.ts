/**
 * 资源管理模块 API 接口定义
 * 对应业务：采购申请、物品领用、物资调拨、仓库管理
 */

import type { PaginationResponse } from '@/types/api'
import { http } from '@/http/alova'

/** ==================== 类型定义 ==================== */

/** 物资项 */
export interface ResourceStore {
  /** 资源ID */
  resId: string
  /** 资源名称 */
  resName: string
  /** 资源编码 */
  resCode: string
  /** 父级分类名称 */
  parentRstName?: string
  /** 分类名称 */
  rstName?: string
  /** 单价 */
  price: number
  /** 库存 */
  stock: number
  /** 描述 */
  description: string
  /** 单位名称 */
  unitCodeName?: string
  /** 最小计量库存 */
  miniStock?: number
  /** 最小计量单位名称 */
  miniUnitCodeName?: string
  /** 是否固定资产 */
  isFixed?: string
  /** 是否固定资产名称 */
  isFixedName?: string
  /** 所属用户ID */
  userId?: string
  /** 所属用户名 */
  userName?: string
}

/** 仓库 */
export interface StoreHouse {
  /** 仓库ID */
  shId: string
  /** 仓库名称 */
  shName: string
  /** 仓库编码 */
  shCode: string
  /** 仓库地址 */
  address?: string
  /** 允许采购 */
  allowPurchase?: string
}

/** 采购/领用申请项 */
export interface ApplyItem {
  /** 申请ID */
  applyOrderId: string
  /** 资源名称（多个用逗号分隔） */
  resourceNames: string
  /** 状态 */
  state: number
  /** 状态名称 */
  stateName: string
  /** 申请人ID */
  createUserId: string
  /** 申请人名称 */
  createUserName: string
  /** 创建时间 */
  createTime: string
  /** 仓库ID */
  shId?: string
  /** 仓库名称 */
  shName?: string
  /** 联系人 */
  endUserName?: string
  /** 联系电话 */
  endUserTel?: string
  /** 申请说明 */
  description?: string
  /** 订单类型 */
  resOrderType?: string
  /** 采购申请详情列表 */
  purchaseApplyDetailVo?: Array<{
    resId: string
    resName: string
    resCode: string
    price: number
    quantity: number
  }>
}

/** 调拨申请项 */
export interface AllocationItem {
  /** 调拨ID */
  allocationId: string
  /** 资源名称 */
  resourceNames: string
  /** 备注说明 */
  description?: string
  /** 状态 */
  state: number
  /** 状态名称 */
  stateName: string
  /** 申请人ID */
  createUserId: string
  /** 申请人名称 */
  createUserName: string
  /** 创建时间 */
  createTime: string
  /** 源仓库 */
  fromShName?: string
  /** 目标仓库 */
  toShName?: string
}

/** 审核任务项 */
export interface AuditTask {
  /** 任务ID */
  taskId: string
  /** 业务ID */
  businessId: string
  /** 业务类型 */
  businessType: string
  /** 状态 */
  state: number
  /** 状态名称 */
  stateName: string
  /** 资源名称 */
  resourceNames: string
  /** 申请人ID */
  createUserId: string
  /** 申请人名称 */
  createUserName: string
  /** 创建时间 */
  createTime: string
}

/** 物品类型 */
export interface ResourceStoreType {
  /** 类型ID */
  rstId: string
  /** 类型名称 */
  rstName: string
  /** 父级ID */
  parentRstId?: string
}

/** 物品领用/采购请求 */
export interface SaveItemOutReq {
  /** 商品列表 */
  resourceStores: Array<{
    resId: string
    resName: string
    resCode: string
    price: number
    quantity: number
  }>
  /** 描述 */
  description: string
  /** 订单类型 */
  resOrderType: string
  /** 使用人 */
  endUserName?: string
  /** 联系电话 */
  endUserTel?: string
  /** 小区ID */
  communityId?: string
  /** 仓库ID */
  shId?: string
}

/** 调拨请求 */
export interface SaveAllocationReq {
  /** 商品列表 */
  resourceStores: Array<{
    resId: string
    resName: string
    resCode: string
    price: number
    quantity: number
  }>
  /** 描述 */
  description: string
  /** 源仓库ID */
  fromShId: string
  /** 目标仓库ID */
  toShId: string
  /** 小区ID */
  communityId?: string
}

/** 审核请求 */
export interface AuditReq {
  /** 任务ID */
  taskId: string
  /** 审核意见 */
  remark?: string
  /** 审核状态 */
  status: string
  /** 小区ID */
  communityId?: string
}

/** ==================== 查询接口 ==================== */

/** 1. 查询物资列表 */
export function listResourceStores(params: { page: number, row: number, communityId?: string, shId?: string }) {
  return http.Get<PaginationResponse<ResourceStore>>('/app/resourceStore.listResourceStores', {
    params,
  })
}

/** 2. 查询仓库列表 */
export function listStoreHouses(params: { page: number, row: number, communityId?: string, allowPurchase?: string }) {
  return http.Get<PaginationResponse<StoreHouse>>('/app/resourceStore.listStorehouses', {
    params,
  })
}

/** 3. 查询采购申请列表 */
export function queryPurchaseApplyList(params: { page: number, row: number, communityId?: string, userId?: string }) {
  return http.Get<PaginationResponse<ApplyItem>>('/app/purchaseApply.listPurchaseApplys', {
    params,
  })
}

/** 4. 查询领用申请列表 */
export function queryItemOutList(params: { page: number, row: number, communityId?: string, userId?: string }) {
  return http.Get<PaginationResponse<ApplyItem>>('/app/itemRelease.listItemRelease', {
    params,
  })
}

/** 5. 查询调拨申请列表 */
export function listAllocationStorehouseApplys(params: { page: number, row: number, communityId?: string, userId?: string }) {
  return http.Get<PaginationResponse<AllocationItem>>('/app/resourceStore.listAllocationStorehouseApplys', {
    params,
  })
}

/** 6. 查询采购待办列表 */
export function listMyAuditOrders(params: { page: number, row: number, communityId?: string }) {
  return http.Get<PaginationResponse<AuditTask>>('/app/purchaseApply.listMyAuditOrders', {
    params,
  })
}

/** 7. 查询领用待办列表 */
export function listMyItemOutOrders(params: { page: number, row: number, communityId?: string }) {
  return http.Get<PaginationResponse<AuditTask>>('/app/itemRelease.queryUndoItemRelease', {
    params,
  })
}

/** 8. 查询调拨待办列表 */
export function listMyAllocationStoreAuditOrders(params: { page: number, row: number, communityId?: string }) {
  return http.Get<PaginationResponse<AuditTask>>('/app/resourceStore.listAllocationStoreAuditOrders', {
    params,
  })
}

/** 9. 查询采购已办列表 */
export function listAuditHistoryOrders(params: { page: number, row: number, communityId?: string }) {
  return http.Get<PaginationResponse<AuditTask>>('/app/purchaseApply.listAuditHistoryOrders', {
    params,
  })
}

/** 10. 查询领用已办列表 */
export function listItemOutAuditHistoryOrders(params: { page: number, row: number, communityId?: string }) {
  return http.Get<PaginationResponse<AuditTask>>('/app/itemRelease.queryFinishItemRelease', {
    params,
  })
}

/** 11. 查询调拨已办列表 */
export function getAllocationHisAudit(params: { page: number, row: number, communityId?: string }) {
  return http.Get<PaginationResponse<AuditTask>>('/app/resourceStore.listAllocationStoreHisAuditOrders', {
    params,
  })
}

/** 12. 查询物品类型 */
export function listResourceStoreTypes(params: { page: number, row: number, communityId?: string }) {
  return http.Get<PaginationResponse<ResourceStoreType>>('/app/resourceStoreType.listResourceStoreTypes', {
    params,
  })
}

/** 13. 查询调拨物品列表 */
export function listAllocationStorehouses(params: { page: number, row: number, communityId?: string }) {
  return http.Get<PaginationResponse<ResourceStore>>('/app/resourceStore.listAllocationStorehouses', {
    params,
  })
}

/** ==================== 提交接口 ==================== */

/** 14. 提交采购申请 */
export function savePurchaseApply(data: {
  resourceStores: Array<{
    resId: string
    resName: string
    resCode: string
    price: number
    quantity: number
  }>
  description: string
  resOrderType: string
}) {
  return http.Post<void>('/app/purchase/purchaseApply', { data })
}

/** 14.1 更新采购申请 */
export function updatePurchaseApply(data: {
  applyOrderId: string
  resourceStores: Array<{
    resId: string
    resName: string
    resCode: string
    price: number
    quantity: number
  }>
  description: string
  resOrderType: string
}) {
  return http.Post<void>('/app/purchase/updatePurchaseApply', { data })
}

/** 15. 提交领用申请 */
export function saveItemOutApply(data: SaveItemOutReq) {
  return http.Post<void>('/app/collection/resourceOut', { data })
}

/** 16. 提交调拨申请 */
export function saveAllocationStorehouse(data: SaveAllocationReq) {
  return http.Post<void>('/app/resourceStore.saveAllocationStorehouse', { data })
}

/** 17. 提交入库 */
export function saveResourceEnter(data: {
  resourceStores: Array<{
    resId: string
    resName: string
    resCode: string
    price: number
    quantity: number
  }>
  description: string
  applyOrderId: string
}) {
  return http.Post<void>('/app/purchase/resourceEnter', { data })
}

/** 18. 提交出库 */
export function saveResourceOut(data: {
  resourceStores: Array<{
    resId: string
    resName: string
    resCode: string
    price: number
    quantity: number
  }>
  description: string
  applyOrderId: string
}) {
  return http.Post<void>('/app/collection/resourceOut', { data })
}

/** 19. 提交调拨入库 */
export function allocationStoreEnter(data: {
  resourceStores: Array<{
    resId: string
    resName: string
    resCode: string
    price: number
    quantity: number
  }>
  description: string
  applyOrderId: string
}) {
  return http.Post<void>('/app/resourceStore.allocationStoreEnter', { data })
}

/** 20. 采购审核 */
export function saveAuditOrders(data: AuditReq) {
  return http.Post<void>('/app/purchaseApply.auditApplyOrder', { data })
}

/** 21. 领用审核 */
export function auditUndoItemRelease(data: AuditReq) {
  return http.Post<void>('/app/itemRelease.auditUndoItemRelease', { data })
}

/** 22. 调拨审核 */
export function saveAuditAllocationStoreOrder(data: AuditReq) {
  return http.Post<void>('/app/resourceStore.auditAllocationStoreOrder', { data })
}

/** 23. 取消采购申请 */
export function deletePurchaseApply(data: { applyOrderId: string }) {
  return http.Post<void>('/app/purchaseApply.deletePurchaseApply', { data })
}

/** 24. 取消调拨 */
export function deleteAllocationStorehouse(data: { allocationId: string }) {
  return http.Post<void>('/app/resourceStore.deleteAllocationStorehouse', { data })
}

/** 25. 物品转赠 */
export function saveResourceStoreTransfer(data: {
  resourceStores: Array<{
    resId: string
    resName: string
    resCode: string
    price: number
    quantity: number
  }>
  description: string
  communityId: string
  targetUserId: string
}) {
  return http.Post<void>('/app/resourceStore.saveAllocationUserStorehouse', { data })
}

/** 26. 查询我的物资库存（个人物资） */
export function queryMyResourceStoreInfo(params: {
  page: number
  row: number
  communityId?: string
  resName?: string
  searchUserName?: string
}) {
  return http.Get<PaginationResponse<ResourceStore>>('/app/resourceStore.queryMyResourceStoreInfo', {
    params,
  })
}

/** 27. 物资退还 */
export function saveResourceReturn(data: {
  resourceStores: Array<{
    resId: string
    resName: string
    shzId: string
    curStock: number
  }>
  remark: string
  applyType: string
  communityId: string
}) {
  return http.Post<void>('/app/resourceStore.saveResourceReturn', { data })
}

/** 28. 物资报废 */
export function saveResourceScrap(data: {
  resourceStores: Array<{
    resId: string
    resName: string
    giveQuantity: number
    state: string
    purchaseRemark: string
  }>
  flag: number
  communityId: string
}) {
  return http.Post<void>('/app/resourceStore.saveResourceScrap', { data })
}
