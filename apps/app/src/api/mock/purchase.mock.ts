/**
 * 采购模块 Mock 接口
 */

import type { PurchaseItem, ResourceStore, SavePurchaseApplyReq, SaveUrgentPurchaseApplyReq } from '../purchase'
import { defineUniAppMock, errorResponse, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
}

const resourceStores: ResourceStore[] = [
  {
    resId: 'RES_001',
    resName: '打印纸',
    resCode: 'OFFICE_001',
    parentRstName: '办公用品',
    rstName: '纸张耗材',
    price: 28,
    stock: 120,
    description: 'A4 复印纸，本地 mock 数据',
  },
  {
    resId: 'RES_002',
    resName: '安全手套',
    resCode: 'SAFE_002',
    parentRstName: '安防物资',
    rstName: '劳保用品',
    price: 12,
    stock: 80,
    description: '维修巡检常用劳保手套',
  },
  {
    resId: 'RES_003',
    resName: '节能灯管',
    resCode: 'REPAIR_003',
    parentRstName: '维修耗材',
    rstName: '照明配件',
    price: 36,
    stock: 45,
    description: '公共区域照明备用件',
  },
]

/** 本地 mock 用固定数据断开旧内置 Nitro server 依赖。 */
export default defineUniAppMock([
  {
    url: '/app/resourceStore.listResourceStores',
    method: 'GET',
    body: () => successResponse({ resourceStores }, '查询成功'),
  },
  {
    url: '/app/purchase/purchaseApply',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const request = context.body as Partial<SavePurchaseApplyReq>
      if (!hasPurchaseItems(request.resourceStores)) {
        return errorResponse('请选择采购物资', '400')
      }

      return successResponse(createPurchaseApplyResult(request), '提交成功')
    },
  },
  {
    url: '/app/purchase/urgentPurchaseApply',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const request = context.body as Partial<SaveUrgentPurchaseApplyReq>
      if (!hasPurchaseItems(request.resourceStores)) {
        return errorResponse('请选择采购物资', '400')
      }

      if (!asOptionalString(request.endUserName)) {
        return errorResponse('请输入使用人', '400')
      }

      if (!asOptionalString(request.endUserTel)) {
        return errorResponse('请输入联系电话', '400')
      }

      if (!asOptionalString(request.description)) {
        return errorResponse('请输入申请说明', '400')
      }

      return successResponse(createPurchaseApplyResult(request, true), '提交成功')
    },
  },
])

function createPurchaseApplyResult(
  request: Partial<SavePurchaseApplyReq | SaveUrgentPurchaseApplyReq>,
  urgent: boolean = false,
) {
  return {
    applyId: `${urgent ? 'URGENT_PURCHASE' : 'PURCHASE'}_${Date.now()}`,
    resOrderType: asOptionalString(request.resOrderType) || (urgent ? '20000' : '10000'),
    resourceStores: request.resourceStores || [],
    description: asOptionalString(request.description) || '',
  }
}

function hasPurchaseItems(items: unknown): items is PurchaseItem[] {
  return Array.isArray(items) && items.length > 0
}

function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}
