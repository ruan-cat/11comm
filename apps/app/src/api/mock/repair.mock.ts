/**
 * 维修工单模块 Mock 接口。
 *
 * 这是 app 本地 mock，用于断开旧内置 Nitro server 依赖。
 */

import type { PriorityType } from '../../types/api'
import type {
  RepairListParams,
  RepairOrder,
  RepairResource,
  RepairStaffRecord,
} from '../../types/repair'
import { REPAIR_PAY_TYPE_OPTIONS, REPAIR_STATUSES, REPAIR_TYPE_OPTIONS } from '../../constants/repair'
import {
  createPaginationResponse,
  defineUniAppMock,
  errorResponse,
  formatDateTime,
  generateAddress,
  generateAmount,
  generateChineseName,
  generateId,
  generatePhoneNumber,
  successResponse,
} from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

interface RepairStaffFixture {
  repairTypes: string[]
  staffId: string
  staffName: string
}

interface RepairResourceTypeFixture {
  name: string
  parentRstId: string
  rstId: string
}

interface RepairSettingFixture {
  payFeeFlag: 'T' | 'F'
  priceScope?: string
  publicArea: 'T' | 'F'
  repairType: string
  repairTypeName: string
}

interface RepairDictItem {
  name: string
  statusCd: string
}

/** 维修师傅 app 本地 mock 数据。 */
const repairStaffs: RepairStaffFixture[] = [
  { staffId: 'STAFF_001', staffName: '张师傅', repairTypes: ['1001', '1005', '水电维修', '管道疏通'] },
  { staffId: 'STAFF_002', staffName: '李师傅', repairTypes: ['1002', '1006', '门窗维修', '墙面修补'] },
  { staffId: 'STAFF_003', staffName: '王师傅', repairTypes: ['1003', '1004', '空调维修', '电梯维修'] },
  { staffId: 'STAFF_004', staffName: '赵师傅', repairTypes: ['1001', '1007', '水电维修', '其他维修'] },
]

/** 维修工单 app 本地 mock 数据。 */
const repairOrders: RepairOrder[] = Array.from({ length: 36 }, (_, index) => createRepairOrder(index + 1))

/** 维修物资 app 本地 mock 数据。 */
const repairResources: RepairResource[] = [
  { resId: 'RES_001', resName: '水龙头', resTypeName: '水管类', specName: '普通型', price: 50, outLowPrice: 40, outHighPrice: 60, unit: '个', stock: 20 },
  { resId: 'RES_002', resName: '插座', resTypeName: '开关插座', specName: '五孔', price: 15, outLowPrice: 12, outHighPrice: 18, unit: '个', stock: 50 },
  { resId: 'RES_003', resName: '门锁', resTypeName: '门锁类', specName: '防盗型', price: 120, outLowPrice: 100, outHighPrice: 150, unit: '把', stock: 10 },
  { resId: 'RES_004', resName: '密封条', resTypeName: '密封条', specName: '隔音型', price: 30, outLowPrice: 25, outHighPrice: 35, unit: '米', stock: 100 },
  { resId: 'RES_005', resName: '制冷剂', resTypeName: '制冷剂', specName: 'R410A', price: 200, outLowPrice: 180, outHighPrice: 220, unit: '瓶', stock: 5 },
  { resId: 'RES_006', resName: '瓷砖', resTypeName: '瓷砖类', specName: '釉面砖', price: 25, outLowPrice: 20, outHighPrice: 30, unit: '片', stock: 200 },
]

/** 维修物资类型 app 本地 mock 数据。 */
const repairResourceTypes: RepairResourceTypeFixture[] = [
  { rstId: 'RST_001', name: '水电材料', parentRstId: '0' },
  { rstId: 'RST_002', name: '五金材料', parentRstId: '0' },
  { rstId: 'RST_003', name: '空调材料', parentRstId: '0' },
  { rstId: 'RST_004', name: '装修材料', parentRstId: '0' },
  { rstId: 'RST_001_01', name: '水管类', parentRstId: 'RST_001' },
  { rstId: 'RST_001_02', name: '开关插座', parentRstId: 'RST_001' },
  { rstId: 'RST_002_01', name: '门锁类', parentRstId: 'RST_002' },
  { rstId: 'RST_002_02', name: '密封条', parentRstId: 'RST_002' },
  { rstId: 'RST_003_01', name: '制冷剂', parentRstId: 'RST_003' },
  { rstId: 'RST_004_01', name: '瓷砖类', parentRstId: 'RST_004' },
]

/** 报修设置 app 本地 mock 数据。 */
const repairSettings: RepairSettingFixture[] = [
  { repairType: '1001', repairTypeName: '水电维修', payFeeFlag: 'T', priceScope: '50-300元', publicArea: 'T' },
  { repairType: '1002', repairTypeName: '门窗维修', payFeeFlag: 'T', priceScope: '80-400元', publicArea: 'T' },
  { repairType: '1003', repairTypeName: '空调维修', payFeeFlag: 'T', priceScope: '100-500元', publicArea: 'T' },
  { repairType: '1004', repairTypeName: '电梯维修', payFeeFlag: 'F', publicArea: 'T' },
  { repairType: '1005', repairTypeName: '管道疏通', payFeeFlag: 'T', priceScope: '60-200元', publicArea: 'F' },
  { repairType: '1006', repairTypeName: '墙面修补', payFeeFlag: 'T', priceScope: '40-250元', publicArea: 'F' },
  { repairType: '1007', repairTypeName: '其他维修', payFeeFlag: 'T', priceScope: '30-500元', publicArea: 'F' },
]

const repairStateDict: RepairDictItem[] = REPAIR_STATUSES.map(item => ({
  statusCd: String(item.value),
  name: String(item.label),
}))

const repairPayTypeDict: RepairDictItem[] = REPAIR_PAY_TYPE_OPTIONS.map(item => ({
  statusCd: String(item.value),
  name: String(item.label),
}))

export default defineUniAppMock([
  {
    url: '/app/ownerRepair.listOwnerRepairs',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const result = listRepairOrders(toRepairListParams(getRequestParams(context)))

      return successResponse({
        ownerRepairs: result.list,
        total: result.total,
        page: result.page,
        row: result.pageSize,
      }, '查询成功')
    },
  },
  {
    url: '/app/ownerRepair.listStaffRepairs',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = toRepairListParams(getRequestParams(context))
      const allowedStatus = ['10002', '10003', '10006']
      const list = filterRepairOrders(params)
        .filter(repair => allowedStatus.includes(repair.statusCd || '') || repair.returnVisitFlag === '003')

      const result = createPaginationResponse(list, params.page, params.row)

      return successResponse({
        ownerRepairs: result.list,
        total: result.total,
        page: result.page,
        row: result.pageSize,
      }, '查询成功')
    },
  },
  {
    url: '/app/ownerRepair.listStaffFinishRepairs',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = toRepairListParams(getRequestParams(context))
      const result = listRepairOrders({ ...params, statusCd: '10004' })

      return successResponse({
        ownerRepairs: result.list,
        total: result.total,
        page: result.page,
        row: result.pageSize,
      }, '查询成功')
    },
  },
  {
    url: '/app/ownerRepair.queryOwnerRepair',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const repairId = asOptionalString(getRequestParams(context).repairId)
      if (!repairId) {
        return errorResponse('维修工单ID不能为空', '400')
      }

      const repair = findRepairOrder(repairId)
      if (!repair) {
        return errorResponse('维修工单不存在', '404')
      }

      return successResponse({ ownerRepair: repair }, '查询成功')
    },
  },
  {
    url: '/app/ownerRepair.saveOwnerRepair',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const validationError = validateCreateRepairBody(context.body || {})
      if (validationError) {
        return validationError
      }

      const repair = saveRepairOrder(context.body || {})

      return successResponse({ ownerRepair: repair }, '创建维修工单成功')
    },
  },
  {
    url: '/app/ownerRepair.updateOwnerRepair',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const repairId = asOptionalString(context.body?.repairId)
      if (!repairId) {
        return errorResponse('维修工单ID不能为空', '400')
      }

      const repair = repairOrders.find(item => item.repairId === repairId)
      if (!repair) {
        return errorResponse('维修工单不存在', '404')
      }

      Object.assign(repair, context.body, { updateTime: formatDateTime() })

      return successResponse({ ownerRepair: cloneRepair(repair) }, '更新维修工单成功')
    },
  },
  {
    url: '/app/ownerRepair.repairDispatch',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const repairId = asOptionalString(context.body?.repairId)
      if (!repairId) {
        return errorResponse('维修工单ID不能为空', '400')
      }

      const action = asOptionalString(context.body?.action)
      if (!action) {
        return errorResponse('操作类型不能为空', '400')
      }

      if (!context.body?.staffId && action !== 'RETURN' && action !== 'BACK') {
        return errorResponse('维修师傅不能为空', '400')
      }

      const repair = repairOrders.find(item => item.repairId === repairId)
      if (!repair) {
        return errorResponse('维修工单不存在', '404')
      }

      dispatchRepairOrder(repair, action, asOptionalString(context.body?.staffId), asOptionalString(context.body?.staffName))

      return successResponse({ success: true }, action === 'TRANSFER' ? '转单成功' : action === 'RETURN' || action === 'BACK' ? '退单成功' : '派单成功')
    },
  },
  {
    url: '/app/ownerRepair.repairFinish',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const repairId = asOptionalString(context.body?.repairId)
      if (!repairId) {
        return errorResponse('维修工单ID不能为空', '400')
      }

      if (!asOptionalString(context.body?.feeFlag)) {
        return errorResponse('请选择维修类型', '400')
      }

      if (!asOptionalString(context.body?.context)) {
        return errorResponse('请填写处理意见', '400')
      }

      const repair = repairOrders.find(item => item.repairId === repairId)
      if (!repair) {
        return errorResponse('维修工单不存在', '404')
      }

      repair.statusCd = '10004'
      repair.statusName = '已完成'
      repair.actualCost = asPositiveNumber(context.body?.totalPrice, repair.estimatedCost || 0)
      repair.updateTime = formatDateTime()

      return successResponse({ success: true }, '办结工单成功')
    },
  },
  {
    url: '/app/ownerRepair.repairEnd',
    method: 'POST',
    body: (context: MockContext = {}) => changeRepairStatus(context.body?.repairId, '10005', '已取消', '结束订单成功'),
  },
  {
    url: '/callComponent/ownerRepair.appraiseRepair',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const repairId = asOptionalString(context.body?.repairId)
      if (!repairId) {
        return errorResponse('维修工单ID不能为空', '400')
      }

      const comment = asOptionalString(context.body?.context)
      if (!comment) {
        return errorResponse('请填写评价内容', '400')
      }

      const repair = repairOrders.find(item => item.repairId === repairId)
      if (!repair) {
        return errorResponse('维修工单不存在', '404')
      }

      repair.evaluation = {
        rating: asPositiveNumber(context.body?.rating, 5),
        comment,
        evaluateTime: formatDateTime(),
      }

      return successResponse({ success: true }, '评价成功')
    },
  },
  {
    url: '/app/repair.replyRepairAppraise',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const repairId = asOptionalString(context.body?.repairId)
      if (!repairId) {
        return errorResponse('维修工单ID不能为空', '400')
      }

      if (!asOptionalString(context.body?.reply || context.body?.replyContext)) {
        return errorResponse('请填写回复内容', '400')
      }

      if (!findRepairOrder(repairId)) {
        return errorResponse('维修工单不存在', '404')
      }

      return successResponse({ success: true }, '回复成功')
    },
  },
  {
    url: '/app/ownerRepair.listRepairStaffs',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) =>
      successResponse({ staffs: filterRepairStaffs(asOptionalString(getRequestParams(context).repairType)) }, '查询成功'),
  },
  {
    url: '/app/repair.listRepairTypeUsers',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) =>
      successResponse({
        users: filterRepairStaffs(asOptionalString(getRequestParams(context).repairType)).map(staff => ({
          userId: staff.staffId,
          userName: staff.staffName,
        })),
      }, '查询成功'),
  },
  {
    url: '/app/resourceStore.listUserStorehouses',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const resources = filterRepairResources(asOptionalString(params.keyword))
      const result = createPaginationResponse(
        resources,
        asPositiveNumber(params.page, 1),
        asPositiveNumber(params.row, 20),
      )

      return successResponse({ resources: result.list, total: result.total }, '查询成功')
    },
  },
  {
    url: '/app/ownerRepair.getRepairStatistics',
    method: ['GET', 'POST'],
    body: () => successResponse(getRepairStatistics(), '获取统计数据成功'),
  },
  {
    url: '/app/resourceStoreType.listResourceStoreTypes',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const parentId = asOptionalString(getRequestParams(context).parentId)
      const items = parentId
        ? repairResourceTypes.filter(item => item.parentRstId === parentId)
        : repairResourceTypes

      return successResponse(cloneValue(items), '查询成功')
    },
  },
  {
    url: '/app/repairSetting.listRepairSettings',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const publicArea = asOptionalString(params.publicArea)
      const settings = publicArea
        ? repairSettings.filter(item => item.publicArea === publicArea)
        : repairSettings
      const result = createPaginationResponse(
        settings,
        asPositiveNumber(params.page, 1),
        asPositiveNumber(params.row, 10),
      )

      return successResponse(result.list, '查询成功')
    },
  },
  {
    url: '/callComponent/core/list',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) =>
      successResponse({ data: listRepairDict(asOptionalString(getRequestParams(context).domain)) }, '查询成功'),
  },
  {
    url: '/app/ownerRepair.repairStart',
    method: 'POST',
    body: (context: MockContext = {}) => changeRepairStatus(context.body?.repairId, '10003', '处理中', '开始维修成功'),
  },
  {
    url: '/app/ownerRepair.repairStop',
    method: 'POST',
    body: (context: MockContext = {}) => changeRepairStatus(context.body?.repairId, '10006', '暂停', '暂停维修成功'),
  },
  {
    url: '/app/ownerRepair.grabbingRepair',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const repairId = asOptionalString(context.body?.repairId)
      if (!repairId) {
        return errorResponse('维修工单ID不能为空', '400')
      }

      if (!context.body?.staffId) {
        return errorResponse('维修师傅不能为空', '400')
      }

      const repair = repairOrders.find(item => item.repairId === repairId)
      if (!repair) {
        return errorResponse('维修工单不存在', '404')
      }

      if (repair.statusCd !== '10001') {
        return errorResponse('该工单已被抢单', '400')
      }

      repair.statusCd = '10002'
      repair.statusName = '已派单'
      repair.staffId = asOptionalString(context.body.staffId)
      repair.assignedWorker = asOptionalString(context.body.staffName)
      repair.updateTime = formatDateTime()

      return successResponse({ success: true }, '抢单成功')
    },
  },
  {
    url: '/app/dict.queryRepairStates',
    method: ['GET', 'POST'],
    body: () => successResponse(cloneValue(repairStateDict), '查询成功'),
  },
  {
    url: '/app/ownerRepair.listRepairStaffRecords',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const repairId = asOptionalString(getRequestParams(context).repairId)
      if (!repairId) {
        return errorResponse('维修工单ID不能为空', '400')
      }

      if (!findRepairOrder(repairId)) {
        return errorResponse('维修工单不存在', '404')
      }

      return successResponse({ staffRecords: createRepairStaffRecords(repairId) }, '查询成功')
    },
  },
  {
    url: '/app/dict.queryPayTypes',
    method: ['GET', 'POST'],
    body: () => successResponse(cloneValue(repairPayTypeDict), '查询成功'),
  },
  {
    url: '/app/resourceStore.listResources',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const rstId = asOptionalString(getRequestParams(context).rstId)
      const type = repairResourceTypes.find(item => item.rstId === rstId)
      const resources = type
        ? repairResources.filter(item => item.resTypeName === type.name)
        : repairResources

      return successResponse({ resources: cloneValue(resources), total: resources.length }, '查询成功')
    },
  },
])

/** 创建维修工单 fixture。 */
function createRepairOrder(index: number): RepairOrder {
  const typeItem = REPAIR_TYPE_OPTIONS[index % REPAIR_TYPE_OPTIONS.length]
  const statusItem = REPAIR_STATUSES[index % REPAIR_STATUSES.length]
  const repairId = `REP_${String(index).padStart(3, '0')}`
  const priority = (['HIGH', 'MEDIUM', 'LOW'] as PriorityType[])[index % 3]
  const address = generateAddress()

  return {
    repairId,
    title: `${typeItem.label}报修-${repairId}`,
    repairType: String(typeItem.value),
    repairTypeName: String(typeItem.label),
    context: `${address}${typeItem.label}，请安排师傅处理。`,
    repairName: generateChineseName(),
    tel: generatePhoneNumber(),
    address,
    repairObjName: address,
    statusCd: String(statusItem.value),
    statusName: String(statusItem.label),
    priority,
    createTime: formatDateTime(Date.now() - index * 86400000),
    updateTime: formatDateTime(),
    appointmentTime: formatDateTime(Date.now() + index * 3600000),
    assignedWorker: statusItem.value === '10001' ? null : repairStaffs[index % repairStaffs.length]?.staffName,
    estimatedCost: generateAmount(50, 500),
    actualCost: statusItem.value === '10004' ? generateAmount(60, 600) : null,
    images: [`https://example.test/repair/${repairId}.jpg`],
    communityId: 'COMM_001',
    returnVisitFlag: statusItem.value === '10004' ? '003' : undefined,
  }
}

/** 查询维修列表并保留旧分页字段。 */
function listRepairOrders(params: RepairListParams) {
  const list = filterRepairOrders(params)
  return createPaginationResponse(list, params.page, params.row)
}

/** 按请求条件筛选维修工单。 */
function filterRepairOrders(params: RepairListParams): RepairOrder[] {
  const keyword = params.keyword?.toLowerCase()

  return repairOrders
    .filter(repair => !params.statusCd || repair.statusCd === params.statusCd)
    .filter(repair => !params.repairType || repair.repairType === params.repairType)
    .filter(repair => !params.assignedWorker || repair.assignedWorker === params.assignedWorker)
    .filter(repair =>
      !keyword
      || repair.context?.toLowerCase().includes(keyword)
      || repair.repairName?.toLowerCase().includes(keyword)
      || repair.tel?.toLowerCase().includes(keyword)
      || repair.address?.toLowerCase().includes(keyword))
    .map(cloneRepair)
}

/** 创建维修工单。 */
function saveRepairOrder(body: Record<string, unknown>): RepairOrder {
  const type = asOptionalString(body.repairType) || '1007'
  const typeName = asOptionalString(body.repairTypeName) || findRepairTypeName(type) || '其他维修'
  const repair: RepairOrder = {
    repairId: generateId('REP'),
    title: asOptionalString(body.title) || `${typeName}报修`,
    context: asOptionalString(body.context),
    repairName: asOptionalString(body.repairName),
    tel: asOptionalString(body.tel),
    address: asOptionalString(body.address),
    repairObjName: asOptionalString(body.address),
    repairType: type,
    repairTypeName: typeName,
    statusCd: '10001',
    statusName: '待派单',
    priority: 'MEDIUM',
    createTime: formatDateTime(),
    updateTime: formatDateTime(),
    appointmentTime: asOptionalString(body.appointmentTime),
    assignedWorker: null,
    estimatedCost: 0,
    actualCost: null,
    images: Array.isArray(body.photos) ? body.photos.filter((item): item is string => typeof item === 'string') : [],
    communityId: asOptionalString(body.communityId) || 'COMM_001',
  }

  repairOrders.unshift(repair)
  return cloneRepair(repair)
}

/** 处理派单、转单和退单。 */
function dispatchRepairOrder(repair: RepairOrder, action: string, staffId?: string, staffName?: string) {
  if (action === 'RETURN' || action === 'BACK') {
    repair.statusCd = '10001'
    repair.statusName = '待派单'
    repair.staffId = undefined
    repair.assignedWorker = null
  }
  else {
    repair.statusCd = '10002'
    repair.statusName = '已派单'
    repair.staffId = staffId
    repair.assignedWorker = staffName || repair.assignedWorker
  }

  repair.updateTime = formatDateTime()
}

/** 修改维修状态。 */
function changeRepairStatus(repairIdValue: unknown, statusCd: string, statusName: string, message: string) {
  const repairId = asOptionalString(repairIdValue)
  if (!repairId) {
    return errorResponse('维修工单ID不能为空', '400')
  }

  const repair = repairOrders.find(item => item.repairId === repairId)
  if (!repair) {
    return errorResponse('维修工单不存在', '404')
  }

  repair.statusCd = statusCd
  repair.statusName = statusName
  repair.updateTime = formatDateTime()

  return successResponse({ success: true }, message)
}

/** 创建维修流转记录。 */
function createRepairStaffRecords(repairId: string): RepairStaffRecord[] {
  const repair = findRepairOrder(repairId)
  if (!repair) {
    return []
  }

  return [
    {
      ruId: `RU_${repairId}_001`,
      staffId: 'STAFF_001',
      staffName: repair.assignedWorker || '张师傅',
      statusCd: '10001',
      statusName: '待派单',
      startTime: repair.createTime || formatDateTime(),
      endTime: repair.statusCd === '10001' ? undefined : repair.updateTime,
      context: '工单已创建',
    },
    {
      ruId: `RU_${repairId}_002`,
      staffId: repair.staffId || 'STAFF_002',
      staffName: repair.assignedWorker || '李师傅',
      statusCd: repair.statusCd || '10002',
      statusName: repair.statusName || '已派单',
      startTime: repair.updateTime || formatDateTime(),
      endTime: repair.statusCd === '10004' ? repair.updateTime : undefined,
      context: repair.context,
      payTypeName: repair.payTypeName,
    },
  ]
}

/** 统计维修工单概况。 */
function getRepairStatistics() {
  const statusStats = repairOrders.reduce<Record<string, number>>((stats, repair) => {
    const status = repair.statusCd || 'UNKNOWN'
    stats[status] = (stats[status] || 0) + 1
    return stats
  }, {})
  const typeStats = repairOrders.reduce<Record<string, number>>((stats, repair) => {
    const type = repair.repairType || 'UNKNOWN'
    stats[type] = (stats[type] || 0) + 1
    return stats
  }, {})

  return {
    total: repairOrders.length,
    statusStats,
    typeStats,
    monthlyStats: { [formatDateTime().slice(0, 7)]: repairOrders.length },
    avgResponseTime: '2.5小时',
    satisfactionRate: '96%',
    avgRating: '4.8',
  }
}

/** 查询维修师傅。 */
function filterRepairStaffs(repairType?: string): RepairStaffFixture[] {
  if (!repairType) {
    return cloneValue(repairStaffs)
  }

  return cloneValue(repairStaffs.filter(staff => staff.repairTypes.includes(repairType)))
}

/** 查询维修物资。 */
function filterRepairResources(keyword?: string): RepairResource[] {
  if (!keyword) {
    return cloneValue(repairResources)
  }

  return cloneValue(repairResources.filter(resource =>
    resource.resName?.includes(keyword)
    || resource.resTypeName?.includes(keyword)))
}

/** 查询旧字典接口数据。 */
function listRepairDict(domain?: string): RepairDictItem[] {
  const dicts: Record<string, RepairDictItem[]> = {
    repair_status: repairStateDict,
    repair_type: REPAIR_TYPE_OPTIONS.map(item => ({ statusCd: String(item.value), name: String(item.label) })),
    maintenance_type: [
      { statusCd: '1001', name: '有偿用料' },
      { statusCd: '1002', name: '无偿用料' },
      { statusCd: '1003', name: '有偿不用料' },
      { statusCd: '1004', name: '无偿不用料' },
    ],
  }

  return cloneValue(dicts[domain || ''] || [])
}

/** 校验创建维修工单请求体。 */
function validateCreateRepairBody(body: Record<string, unknown>) {
  if (!asOptionalString(body.title)) {
    return errorResponse('维修标题不能为空', '400')
  }

  if (!asOptionalString(body.context)) {
    return errorResponse('维修描述不能为空', '400')
  }

  if (!asOptionalString(body.repairName)) {
    return errorResponse('业主姓名不能为空', '400')
  }

  if (!asOptionalString(body.tel)) {
    return errorResponse('联系电话不能为空', '400')
  }

  if (!asOptionalString(body.address)) {
    return errorResponse('维修地址不能为空', '400')
  }

  return undefined
}

/** 合并 Vite mock 的 query、body 与 params。 */
function getRequestParams(context: MockContext): Record<string, unknown> {
  return {
    ...(context.query || {}),
    ...(context.body || {}),
    ...(context.params || {}),
  }
}

/** 转换维修列表查询参数。 */
function toRepairListParams(params: Record<string, unknown>): RepairListParams {
  return {
    page: asPositiveNumber(params.page, 1),
    row: asPositiveNumber(params.row, 10),
    communityId: asOptionalString(params.communityId),
    statusCd: asOptionalString(params.statusCd || params.status),
    repairType: asOptionalString(params.repairType),
    keyword: asOptionalString(params.keyword || params.repairName),
    assignedWorker: asOptionalString(params.assignedWorker),
  }
}

/** 查找维修类型名称。 */
function findRepairTypeName(repairType: string): string | undefined {
  return REPAIR_TYPE_OPTIONS.find(item => item.value === repairType)?.label as string | undefined
}

/** 查找维修工单。 */
function findRepairOrder(repairId: string): RepairOrder | undefined {
  const repair = repairOrders.find(item => item.repairId === repairId)
  return repair ? cloneRepair(repair) : undefined
}

/** 克隆维修工单，避免外部修改内存 fixture。 */
function cloneRepair(repair: RepairOrder): RepairOrder {
  return cloneValue(repair)
}

/** 克隆 mock 返回值。 */
function cloneValue<T>(value: T): T {
  return structuredClone(value)
}

/** 将未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}

/** 将未知值收敛为正数。 */
function asPositiveNumber(value: unknown, fallback: number): number {
  const numberValue = Number(asOptionalString(value))

  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : fallback
}
