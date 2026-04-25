import type {
  AllocationItem,
  ApplyItem,
  AuditTask,
  ResourceStore,
  ResourceStoreType,
  SaveAllocationReq,
  SaveItemOutReq,
  StoreHouse,
} from '../../../src/api/resource.ts'
import dayjs from 'dayjs'
import {
  formatDateTime,
  generateId,
} from '../../shared/runtime/common-utils.ts'

type PageResult<T> = {
  list: T[]
  total: number
  page: number
  row: number
}

export interface ResourceModuleRepository {
  allocationStoreEnter: () => boolean
  auditAllocationStoreOrder: (data: { status?: string, taskId?: string }) => boolean
  auditApplyOrder: (data: { status?: string, taskId?: string }) => boolean
  auditUndoItemRelease: (data: { status?: string, taskId?: string }) => boolean
  collectionResourceOut: (data: SaveItemOutReq | { description?: string, resourceStores?: Array<{ resName: string }> }) => boolean
  deleteAllocationStorehouse: (allocationId?: string) => boolean
  deletePurchaseApply: (applyOrderId?: string) => boolean
  listAllocationStoreAuditOrders: (params: { page: number, row: number }) => PageResult<AuditTask>
  listAllocationStorehouseApplys: (params: { page: number, row: number }) => PageResult<AllocationItem>
  listAllocationStorehouses: (params: { page: number, row: number }) => PageResult<ResourceStore>
  listMyAuditOrders: (params: { page: number, row: number }) => PageResult<AuditTask>
  listResourceStoreTypes: () => PageResult<ResourceStoreType>
  listResourceStores: (params: { page: number, row: number }) => PageResult<ResourceStore>
  listStorehouses: (params: { allowPurchase?: string, page: number, row: number }) => PageResult<StoreHouse>
  purchaseApply: (data: { description?: string, resourceStores?: Array<{ resName: string }> }) => boolean
  purchaseResourceEnter: () => boolean
  queryItemOutList: (params: { page: number, row: number }) => PageResult<ApplyItem>
  queryMyResourceStoreInfo: (params: { page: number, resName?: string, row: number, searchUserName?: string }) => PageResult<ResourceStore>
  queryPurchaseApplyList: (params: { page: number, row: number }) => PageResult<ApplyItem>
  queryUndoItemRelease: (params: { page: number, row: number }) => PageResult<AuditTask>
  saveAllocationStorehouse: (data: SaveAllocationReq | { description?: string, resourceStores?: Array<{ resName: string }> }) => boolean
  saveAllocationUserStorehouse: () => boolean
  saveResourceReturn: () => boolean
  saveResourceScrap: () => boolean
}

/** 创建 `resource` 模块的 mock 内存仓储。 */
export function createResourceMockRepository(): ResourceModuleRepository {
  return new ResourceDatabase()
}

const resourceStoreList: ResourceStore[] = [
  { resId: 'RES_001', resName: '办公桌', resCode: 'OFFICE_001', price: 599, stock: 50, description: '标准办公桌，1.2米×0.6米', parentRstName: '办公家具', rstName: '桌子' },
  { resId: 'RES_002', resName: '办公椅', resCode: 'OFFICE_002', price: 299, stock: 100, description: '人体工学办公椅', parentRstName: '办公家具', rstName: '椅子' },
  { resId: 'RES_003', resName: 'A4 打印纸', resCode: 'OFFICE_003', price: 25, stock: 500, description: '得力A4纸，500张/包', parentRstName: '办公用品', rstName: '纸张' },
  { resId: 'RES_004', resName: '中性笔', resCode: 'OFFICE_004', price: 2, stock: 1000, description: '晨光0.5mm中性笔', parentRstName: '办公用品', rstName: '笔类' },
  { resId: 'RES_005', resName: '台式电脑', resCode: 'ELECTRONIC_001', price: 3999, stock: 20, description: '联想台式机，i5处理器', parentRstName: '电子设备', rstName: '电脑' },
  { resId: 'RES_006', resName: '激光打印机', resCode: 'ELECTRONIC_002', price: 1299, stock: 15, description: '惠普激光打印机', parentRstName: '电子设备', rstName: '打印机' },
  { resId: 'RES_007', resName: '投影仪', resCode: 'ELECTRONIC_003', price: 2999, stock: 8, description: '爱普生投影仪，1080P', parentRstName: '电子设备', rstName: '投影仪' },
  { resId: 'RES_008', resName: '文件柜', resCode: 'OFFICE_005', price: 899, stock: 30, description: '四门铁皮文件柜', parentRstName: '办公家具', rstName: '柜子' },
]

const storeHouseList: StoreHouse[] = [
  { shId: 'SH_001', shName: '总部仓库', shCode: 'WH_001', address: '北京市朝阳区总部大厦', allowPurchase: 'ON' },
  { shId: 'SH_002', shName: '分部仓库', shCode: 'WH_002', address: '上海市浦东分部', allowPurchase: 'ON' },
  { shId: 'SH_003', shName: '临时仓库', shCode: 'WH_003', address: '广州市天河临时', allowPurchase: 'OFF' },
]

const resourceStoreTypes: ResourceStoreType[] = [
  { rstId: 'T001', rstName: '办公家具', parentRstId: '' },
  { rstId: 'T002', rstName: '办公用品', parentRstId: '' },
  { rstId: 'T003', rstName: '电子设备', parentRstId: '' },
]

const myResourceStoreList: ResourceStore[] = [
  { resId: 'RES_001', resName: '办公桌', parentRstName: '办公家具', rstName: '桌子', stock: 5, unitCodeName: '张', miniStock: 5, miniUnitCodeName: '张', isFixed: 'Y', isFixedName: '是', userId: 'USER_001', userName: '张三', resCode: '', price: 0, description: '' },
  { resId: 'RES_002', resName: '办公椅', parentRstName: '办公家具', rstName: '椅子', stock: 8, unitCodeName: '把', miniStock: 8, miniUnitCodeName: '把', isFixed: 'Y', isFixedName: '是', userId: 'USER_001', userName: '张三', resCode: '', price: 0, description: '' },
  { resId: 'RES_003', resName: 'A4 打印纸', parentRstName: '办公用品', rstName: '纸张', stock: 20, unitCodeName: '包', miniStock: 20, miniUnitCodeName: '包', isFixed: 'N', isFixedName: '否', userId: 'USER_001', userName: '张三', resCode: '', price: 0, description: '' },
  { resId: 'RES_004', resName: '中性笔', parentRstName: '办公用品', rstName: '笔类', stock: 50, unitCodeName: '支', miniStock: 50, miniUnitCodeName: '支', isFixed: 'N', isFixedName: '否', userId: 'USER_002', userName: '李四', resCode: '', price: 0, description: '' },
  { resId: 'RES_005', resName: '台式电脑', parentRstName: '电子设备', rstName: '电脑', stock: 2, unitCodeName: '台', miniStock: 2, miniUnitCodeName: '台', isFixed: 'Y', isFixedName: '是', userId: 'USER_001', userName: '张三', resCode: '', price: 0, description: '' },
  { resId: 'RES_006', resName: '激光打印机', parentRstName: '电子设备', rstName: '打印机', stock: 1, unitCodeName: '台', miniStock: 1, miniUnitCodeName: '台', isFixed: 'Y', isFixedName: '是', userId: 'USER_002', userName: '李四', resCode: '', price: 0, description: '' },
]

/** resource 模块的 mock 内存仓储实现。 */
class ResourceDatabase implements ResourceModuleRepository {
  private readonly allocationList: AllocationItem[] = [
    { allocationId: 'AL_20240301_001', resourceNames: '办公桌、文件柜', state: 1200, stateName: '待审核', createUserId: 'USER_001', createUserName: '张三', createTime: '2024-03-01 15:00:00', fromShName: '总部仓库', toShName: '分部仓库' },
  ]

  private readonly auditTaskList: AuditTask[] = [
    { taskId: 'TASK_001', businessId: 'PA_20240301_001', businessType: '采购审核', state: 1200, stateName: '待审核', resourceNames: '办公桌、办公椅', createUserId: 'USER_001', createUserName: '张三', createTime: '2024-03-01 10:00:00' },
    { taskId: 'TASK_002', businessId: 'IO_20240301_001', businessType: '领用审核', state: 1200, stateName: '待审核', resourceNames: '台式电脑', createUserId: 'USER_003', createUserName: '王五', createTime: '2024-03-01 09:00:00' },
    { taskId: 'TASK_003', businessId: 'AL_20240301_001', businessType: '调拨审核', state: 1200, stateName: '待审核', resourceNames: '办公桌、文件柜', createUserId: 'USER_001', createUserName: '张三', createTime: '2024-03-01 15:00:00' },
  ]

  private readonly itemOutList: ApplyItem[] = [
    { applyOrderId: 'IO_20240301_001', resourceNames: '台式电脑', state: 1200, stateName: '待审核', createUserId: 'USER_003', createUserName: '王五', createTime: '2024-03-01 09:00:00', description: '新员工办公设备' },
    { applyOrderId: 'IO_20240302_001', resourceNames: '激光打印机', state: 1300, stateName: '已出库', createUserId: 'USER_004', createUserName: '赵六', createTime: '2024-03-02 11:00:00', description: '部门打印机更换' },
  ]

  private readonly purchaseApplyList: ApplyItem[] = [
    { applyOrderId: 'PA_20240301_001', resourceNames: '办公桌、办公椅', state: 1200, stateName: '待审核', createUserId: 'USER_001', createUserName: '张三', createTime: '2024-03-01 10:00:00', description: '办公室采购' },
    { applyOrderId: 'PA_20240302_001', resourceNames: 'A4打印纸、中性笔', state: 1300, stateName: '已完成', createUserId: 'USER_002', createUserName: '李四', createTime: '2024-03-02 14:30:00', description: '日常办公用品' },
  ]

  listResourceStores(params: { page: number, row: number }): PageResult<ResourceStore> {
    return paginate(resourceStoreList, params.page, params.row)
  }

  listStorehouses(params: { allowPurchase?: string, page: number, row: number }): PageResult<StoreHouse> {
    let list = storeHouseList
    if (params.allowPurchase) {
      list = storeHouseList.filter(item => item.allowPurchase === params.allowPurchase)
    }

    return paginate(list, params.page, params.row)
  }

  queryPurchaseApplyList(params: { page: number, row: number }): PageResult<ApplyItem> {
    return paginate(this.purchaseApplyList, params.page, params.row)
  }

  queryItemOutList(params: { page: number, row: number }): PageResult<ApplyItem> {
    return paginate(this.itemOutList, params.page, params.row)
  }

  collectionResourceOut(data: SaveItemOutReq | { description?: string, resourceStores?: Array<{ resName: string }> }): boolean {
    this.itemOutList.unshift({
      applyOrderId: `IO_${dayjs().format('YYYYMMDD')}_${generateId('IO')}`,
      resourceNames: (data.resourceStores || []).map(item => item.resName).join('、'),
      state: 1200,
      stateName: '待审核',
      createUserId: 'USER_001',
      createUserName: '当前用户',
      createTime: formatDateTime(new Date()),
      description: data.description || '',
    })

    return true
  }

  listAllocationStorehouseApplys(params: { page: number, row: number }): PageResult<AllocationItem> {
    return paginate(this.allocationList, params.page, params.row)
  }

  listMyAuditOrders(params: { page: number, row: number }): PageResult<AuditTask> {
    return paginate(this.auditTaskList.filter(item => item.businessType === '采购审核'), params.page, params.row)
  }

  queryUndoItemRelease(params: { page: number, row: number }): PageResult<AuditTask> {
    return paginate(this.auditTaskList.filter(item => item.businessType === '领用审核'), params.page, params.row)
  }

  listAllocationStoreAuditOrders(params: { page: number, row: number }): PageResult<AuditTask> {
    return paginate(this.auditTaskList.filter(item => item.businessType === '调拨审核'), params.page, params.row)
  }

  listResourceStoreTypes(): PageResult<ResourceStoreType> {
    return { list: cloneValue(resourceStoreTypes), total: resourceStoreTypes.length, page: 1, row: 10 }
  }

  purchaseApply(data: { description?: string, resourceStores?: Array<{ resName: string }> }): boolean {
    this.purchaseApplyList.unshift({
      applyOrderId: `PA_${dayjs().format('YYYYMMDD')}_${Math.random().toString().slice(2, 5)}`,
      resourceNames: (data.resourceStores || []).map(item => item.resName).join('、'),
      state: 1200,
      stateName: '待审核',
      createUserId: 'USER_001',
      createUserName: '当前用户',
      createTime: formatDateTime(new Date()),
      description: data.description || '',
    })

    return true
  }

  saveAllocationStorehouse(data: SaveAllocationReq | { description?: string, resourceStores?: Array<{ resName: string }> }): boolean {
    this.allocationList.unshift({
      allocationId: `AL_${dayjs().format('YYYYMMDD')}_${generateId('IO')}`,
      resourceNames: (data.resourceStores || []).map(item => item.resName).join('、'),
      state: 1200,
      stateName: '待审核',
      createUserId: 'USER_001',
      createUserName: '当前用户',
      createTime: formatDateTime(new Date()),
      fromShName: '总部仓库',
      toShName: '分部仓库',
      description: data.description || '',
    })

    return true
  }

  auditApplyOrder(data: { status?: string, taskId?: string }): boolean {
    const task = this.auditTaskList.find(item => item.taskId === data.taskId)
    if (task) {
      task.state = data.status === '1200' ? 1300 : 1400
      task.stateName = data.status === '1200' ? '已完成' : '已拒绝'
    }

    return true
  }

  auditUndoItemRelease(data: { status?: string, taskId?: string }): boolean {
    const task = this.auditTaskList.find(item => item.taskId === data.taskId)
    if (task) {
      task.state = data.status === '1200' ? 1300 : 1400
      task.stateName = data.status === '1200' ? '已出库' : '已拒绝'
    }

    return true
  }

  auditAllocationStoreOrder(data: { status?: string, taskId?: string }): boolean {
    const task = this.auditTaskList.find(item => item.taskId === data.taskId)
    if (task) {
      task.state = data.status === '1200' ? 1300 : 1400
      task.stateName = data.status === '1200' ? '已完成' : '已拒绝'
    }

    return true
  }

  purchaseResourceEnter(): boolean {
    return true
  }

  deletePurchaseApply(applyOrderId?: string): boolean {
    const index = this.purchaseApplyList.findIndex(item => item.applyOrderId === applyOrderId)
    if (index > -1) {
      this.purchaseApplyList.splice(index, 1)
    }

    return true
  }

  deleteAllocationStorehouse(allocationId?: string): boolean {
    const index = this.allocationList.findIndex(item => item.allocationId === allocationId)
    if (index > -1) {
      this.allocationList.splice(index, 1)
    }

    return true
  }

  allocationStoreEnter(): boolean {
    return true
  }

  saveAllocationUserStorehouse(): boolean {
    return true
  }

  listAllocationStorehouses(params: { page: number, row: number }): PageResult<ResourceStore> {
    return paginate(resourceStoreList, params.page, params.row)
  }

  queryMyResourceStoreInfo(params: { page: number, resName?: string, row: number, searchUserName?: string }): PageResult<ResourceStore> {
    let list = myResourceStoreList
    if (params.resName) {
      list = list.filter(item => item.resName.includes(params.resName))
    }
    if (params.searchUserName) {
      list = list.filter(item => item.userName?.includes(params.searchUserName))
    }

    return paginate(list, params.page, params.row)
  }

  saveResourceReturn(): boolean {
    return true
  }

  saveResourceScrap(): boolean {
    return true
  }
}

/** 默认供运行时直接复用的 resource 仓储实例。 */
export const resourceMockRepository = createResourceMockRepository()

/** 构建兼容旧响应结构的分页结果。 */
function paginate<T>(list: T[], page: number, row: number): PageResult<T> {
  const start = (page - 1) * row
  const end = start + row

  return cloneValue({
    list: list.slice(start, end),
    total: list.length,
    page,
    row,
  })
}

/** 克隆仓储返回值，避免外部篡改内部引用。 */
function cloneValue<T>(value: T): T {
  return structuredClone(value)
}
