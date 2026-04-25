/**
 * 采购模块 API 接口定义
 * 对应业务：采购申请、紧急采购、物资管理
 */

import { http } from '@/http/alova'

/** ==================== 类型定义 ==================== */

/** 采购商品项 */
export interface PurchaseItem {
  /** 资源ID */
  resId: string
  /** 资源名称 */
  resName: string
  /** 资源编码 */
  resCode: string
  /** 单价 */
  price: number
  /** 库存 */
  stock: number
  /** 描述 */
  description: string
  /** 数量 */
  quantity: number
}

/** 采购申请请求 */
export interface SavePurchaseApplyReq {
  /** 采购商品列表 */
  resourceStores: PurchaseItem[]
  /** 描述 */
  description: string
  /** 采购订单类型 */
  resOrderType: string
}

/** 紧急采购申请请求 */
export interface SaveUrgentPurchaseApplyReq {
  /** 采购商品列表 */
  resourceStores: PurchaseItem[]
  /** 描述 */
  description: string
  /** 采购订单类型 */
  resOrderType: string
  /** 使用人 */
  endUserName: string
  /** 联系电话 */
  endUserTel: string
  /** 小区ID */
  communityId: string
}

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
}

/** ==================== 查询接口 ==================== */

/** 1. 查询物资列表 */
export function listResourceStores(params: { page: number, row: number, communityId?: string }) {
  return http.Get<{ resourceStores: ResourceStore[] }>('/app/resourceStore.listResourceStores', {
    params,
  })
}

/** ==================== 提交接口 ==================== */

/** 2. 提交采购申请 */
export function savePurchaseApply(data: SavePurchaseApplyReq) {
  return http.Post('/app/purchase/purchaseApply', { data })
}

/** 3. 提交紧急采购申请 */
export function saveUrgentPurchaseApply(data: SaveUrgentPurchaseApplyReq) {
  return http.Post('/app/purchase/urgentPurchaseApply', { data })
}
