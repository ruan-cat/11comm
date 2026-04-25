import type { PurchaseItem, SavePurchaseApplyReq, SaveUrgentPurchaseApplyReq } from '../../../src/api/purchase.ts'
import { generateId } from '../../shared/runtime/common-utils.ts'

export interface PurchaseModuleRepository {
  listResourceStores: () => PurchaseItem[]
  savePurchaseApply: (data: SavePurchaseApplyReq) => { applyId: string }
  saveUrgentPurchaseApply: (data: SaveUrgentPurchaseApplyReq) => { applyId: string }
}

/** 创建 `purchase` 模块的 mock 内存仓储。 */
export function createPurchaseMockRepository(): PurchaseModuleRepository {
  return new PurchaseDatabase()
}

/** `purchase` 模块的 mock 内存仓储实现。 */
class PurchaseDatabase implements PurchaseModuleRepository {
  private readonly resourceStoreList: PurchaseItem[] = [
    {
      resId: 'RES_001',
      resName: '办公桌',
      resCode: 'OFFICE_001',
      price: 599,
      stock: 50,
      description: '标准办公桌，1.2米 x 0.6米',
      quantity: 0,
    },
    {
      resId: 'RES_002',
      resName: '办公椅',
      resCode: 'OFFICE_002',
      price: 299,
      stock: 100,
      description: '人体工学办公椅',
      quantity: 0,
    },
    {
      resId: 'RES_003',
      resName: 'A4 打印纸',
      resCode: 'OFFICE_003',
      price: 25,
      stock: 500,
      description: '得力A4纸，500张/包',
      quantity: 0,
    },
    {
      resId: 'RES_004',
      resName: '中性笔',
      resCode: 'OFFICE_004',
      price: 2,
      stock: 1000,
      description: '晨光0.5mm中性笔',
      quantity: 0,
    },
    {
      resId: 'RES_005',
      resName: '投影仪',
      resCode: 'OFFICE_005',
      price: 2999,
      stock: 10,
      description: '爱普生商用投影仪',
      quantity: 0,
    },
    {
      resId: 'RES_006',
      resName: '碎纸机',
      resCode: 'OFFICE_006',
      price: 399,
      stock: 20,
      description: '保密碎纸机',
      quantity: 0,
    },
    {
      resId: 'RES_007',
      resName: '扫描仪',
      resCode: 'OFFICE_007',
      price: 1299,
      stock: 15,
      description: '佳能高速扫描仪',
      quantity: 0,
    },
    {
      resId: 'RES_008',
      resName: '会议麦克风',
      resCode: 'OFFICE_008',
      price: 899,
      stock: 30,
      description: '会议专用无线麦克风',
      quantity: 0,
    },
    {
      resId: 'RES_009',
      resName: '白板',
      resCode: 'OFFICE_009',
      price: 499,
      stock: 40,
      description: '标准白板，1.5米 x 1米',
      quantity: 0,
    },
    {
      resId: 'RES_010',
      resName: '文件柜',
      resCode: 'OFFICE_010',
      price: 799,
      stock: 25,
      description: '四门文件柜',
      quantity: 0,
    },
  ]

  private readonly purchaseApplyList: Array<{
    applyId: string
    description: string
    resOrderType: string
    userId: string
    userName: string
  }> = []

  listResourceStores(): PurchaseItem[] {
    return structuredClone(this.resourceStoreList)
  }

  savePurchaseApply(data: SavePurchaseApplyReq): { applyId: string } {
    const applyId = generateId('APPLY')

    this.purchaseApplyList.unshift({
      applyId,
      description: data.description || '',
      resOrderType: data.resOrderType || '10000',
      userId: 'USER_001',
      userName: '管理员',
    })

    return { applyId }
  }

  saveUrgentPurchaseApply(data: SaveUrgentPurchaseApplyReq): { applyId: string } {
    const applyId = generateId('URGENT')

    this.purchaseApplyList.unshift({
      applyId,
      description: data.description || '',
      resOrderType: '20000',
      userId: 'USER_001',
      userName: data.endUserName,
    })

    return { applyId }
  }
}

/** 默认导出的 purchase mock 仓储实例。 */
export const purchaseMockRepository = createPurchaseMockRepository()
