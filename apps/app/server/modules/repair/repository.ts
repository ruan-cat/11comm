import type { PaginationResponse, PriorityType } from '../../../src/types/api.ts'
import type { RepairListParams, RepairOrder, RepairStatus, RepairType } from '../../../src/types/repair.ts'
import dayjs from 'dayjs'
import {
  REPAIR_PAY_TYPE_OPTIONS,
  REPAIR_STATUSES,
  REPAIR_TYPE_OPTIONS,
} from '../../../src/constants/repair.ts'
import {
  createPaginationResponse,
  formatDateTime,
  generateAddress,
  generateAmount,
  generateChineseName,
  generateId,
  generatePhoneNumber,
} from '../../shared/runtime/common-utils.ts'

export interface RepairStaff {
  repairTypes: string[]
  staffId: string
  staffName: string
}

export interface RepairResource {
  outHighPrice?: number
  outLowPrice?: number
  price?: number
  resId: string
  resName: string
  resTypeName: string
  specName?: string
  stock?: number
  unit?: string
}

export interface RepairResourceType {
  name: string
  parentRstId: string
  rstId: string
}

export interface RepairSetting {
  payFeeFlag: 'T' | 'F'
  priceScope?: string
  publicArea: 'T' | 'F'
  repairType: string
  repairTypeName: string
}

export interface RepairStateDictionaryItem {
  name: string
  statusCd: string
}

export interface RepairStaffRecord {
  context?: string
  endTime?: string
  repairId: string
  ruId: string
  staffId: string
  staffName: string
  startTime: string
  statusCd: string
  statusName: string
}

export type RepairDictDomain = 'maintenance_type' | 'repair_status' | 'repair_type'

export interface RepairListResult extends PaginationResponse<RepairOrder> {}

export interface RepairModuleRepository {
  create: (input: Record<string, any>) => RepairOrder
  end: (repairId: string) => RepairOrder | undefined
  finish: (repairId: string, totalPrice?: number) => RepairOrder | undefined
  getById: (repairId: string) => RepairOrder | undefined
  getStatistics: () => {
    avgResponseTime: string
    monthlyStats: Record<string, number>
    satisfactionRate: string
    statusStats: Record<RepairStatus, number>
    total: number
    typeStats: Record<string, number>
  }
  grab: (repairId: string, staffName?: string) => RepairOrder | undefined
  list: (params: RepairListParams) => RepairListResult
  listDict: (domain?: RepairDictDomain | string) => RepairStateDictionaryItem[]
  listDispatch: (params: RepairListParams) => RepairListResult
  listFinish: (params: RepairListParams) => RepairListResult
  listPayTypes: () => RepairStateDictionaryItem[]
  listRepairSettings: (params: { page?: number, publicArea?: string, row?: number }) => RepairSetting[]
  listRepairStaffRecords: (repairId: string) => RepairStaffRecord[]
  listRepairTypeUsers: (repairType?: string) => Array<{ userId: string, userName: string }>
  listRepairs: () => RepairOrder[]
  listRepairStates: () => RepairStateDictionaryItem[]
  listRepairStaffs: (repairType?: string) => RepairStaff[]
  listResourceStoreTypes: (parentId?: string) => RepairResourceType[]
  listResources: (rstId?: string) => { resources: RepairResource[], total: number }
  listUserStorehouses: (params: { keyword?: string, page?: number, row?: number }) => { resources: RepairResource[], total: number }
  replyAppraise: (repairId: string) => RepairOrder | undefined
  setAppraise: (repairId: string, comment: string) => RepairOrder | undefined
  start: (repairId: string) => RepairOrder | undefined
  stop: (repairId: string) => RepairOrder | undefined
  transfer: (repairId: string, action: string, staffName?: string) => RepairOrder | undefined
  update: (repairId: string, input: Partial<RepairOrder>) => RepairOrder | undefined
}

/** 创建 `repair` 模块的 mock 内存仓储。 */
export function createRepairMockRepository(): RepairModuleRepository {
  const repairs: RepairOrder[] = Array.from({ length: 60 }, (_, index) =>
    createMockRepair((index + 1).toString().padStart(3, '0')))
  const staffs: RepairStaff[] = [
    { staffId: 'STAFF_001', staffName: '张师傅', repairTypes: ['水电维修', '管道疏通'] },
    { staffId: 'STAFF_002', staffName: '李师傅', repairTypes: ['门窗维修', '墙面修补'] },
    { staffId: 'STAFF_003', staffName: '王师傅', repairTypes: ['空调维修', '电梯维修'] },
    { staffId: 'STAFF_004', staffName: '赵师傅', repairTypes: ['水电维修', '其他维修'] },
    { staffId: 'STAFF_005', staffName: '刘师傅', repairTypes: ['管道疏通', '墙面修补'] },
  ]
  const resources: RepairResource[] = [
    { resId: 'RES_001', resName: '水龙头', resTypeName: '水管类', specName: '普通型', price: 50, outLowPrice: 40, outHighPrice: 60, unit: '个', stock: 20 },
    { resId: 'RES_008', resName: '管道胶', resTypeName: '水管类', specName: '防水型', price: 35, outLowPrice: 30, outHighPrice: 40, unit: '瓶', stock: 15 },
    { resId: 'RES_007', resName: '电线', resTypeName: '电线类', specName: '2.5平方', price: 8, outLowPrice: 7, outHighPrice: 10, unit: '米', stock: 500 },
    { resId: 'RES_009', resName: '网线', resTypeName: '电线类', specName: '六类线', price: 3, outLowPrice: 2.5, outHighPrice: 3.5, unit: '米', stock: 300 },
    { resId: 'RES_002', resName: '插座', resTypeName: '开关插座', specName: '五孔', price: 15, outLowPrice: 12, outHighPrice: 18, unit: '个', stock: 50 },
    { resId: 'RES_010', resName: '开关', resTypeName: '开关插座', specName: '单开', price: 10, outLowPrice: 8, outHighPrice: 12, unit: '个', stock: 60 },
    { resId: 'RES_003', resName: '门锁', resTypeName: '门锁类', specName: '防盗型', price: 120, outLowPrice: 100, outHighPrice: 150, unit: '把', stock: 10 },
    { resId: 'RES_011', resName: '智能门锁', resTypeName: '门锁类', specName: '指纹识别', price: 800, outLowPrice: 700, outHighPrice: 900, unit: '把', stock: 5 },
    { resId: 'RES_004', resName: '窗户密封条', resTypeName: '密封条', specName: '隔音型', price: 30, outLowPrice: 25, outHighPrice: 35, unit: '米', stock: 100 },
    { resId: 'RES_012', resName: '门缝密封条', resTypeName: '密封条', specName: '防风型', price: 25, outLowPrice: 20, outHighPrice: 30, unit: '米', stock: 80 },
    { resId: 'RES_005', resName: '空调氟利昂', resTypeName: '制冷剂', specName: 'R410A', price: 200, outLowPrice: 180, outHighPrice: 220, unit: '瓶', stock: 5 },
    { resId: 'RES_013', resName: 'R32制冷剂', resTypeName: '制冷剂', specName: '环保型', price: 180, outLowPrice: 160, outHighPrice: 200, unit: '瓶', stock: 8 },
    { resId: 'RES_014', resName: '空调滤网', resTypeName: '滤网', specName: '通用型', price: 40, outLowPrice: 35, outHighPrice: 45, unit: '个', stock: 20 },
    { resId: 'RES_006', resName: '瓷砖', resTypeName: '瓷砖类', specName: '釉面砖', price: 25, outLowPrice: 20, outHighPrice: 30, unit: '片', stock: 200 },
    { resId: 'RES_015', resName: '地砖', resTypeName: '瓷砖类', specName: '防滑型', price: 35, outLowPrice: 30, outHighPrice: 40, unit: '片', stock: 150 },
    { resId: 'RES_016', resName: '乳胶漆', resTypeName: '涂料类', specName: '环保型', price: 120, outLowPrice: 100, outHighPrice: 140, unit: '桶', stock: 10 },
  ]
  const resourceTypes: RepairResourceType[] = [
    { rstId: 'RST_001', name: '水电材料', parentRstId: '0' },
    { rstId: 'RST_002', name: '五金材料', parentRstId: '0' },
    { rstId: 'RST_003', name: '空调材料', parentRstId: '0' },
    { rstId: 'RST_004', name: '装修材料', parentRstId: '0' },
    { rstId: 'RST_001_01', name: '水管类', parentRstId: 'RST_001' },
    { rstId: 'RST_001_02', name: '电线类', parentRstId: 'RST_001' },
    { rstId: 'RST_001_03', name: '开关插座', parentRstId: 'RST_001' },
    { rstId: 'RST_002_01', name: '门锁类', parentRstId: 'RST_002' },
    { rstId: 'RST_002_02', name: '密封条', parentRstId: 'RST_002' },
    { rstId: 'RST_002_03', name: '滑轨配件', parentRstId: 'RST_002' },
    { rstId: 'RST_003_01', name: '制冷剂', parentRstId: 'RST_003' },
    { rstId: 'RST_003_02', name: '滤网', parentRstId: 'RST_003' },
    { rstId: 'RST_004_01', name: '瓷砖类', parentRstId: 'RST_004' },
    { rstId: 'RST_004_02', name: '涂料类', parentRstId: 'RST_004' },
  ]
  const repairSettings: RepairSetting[] = [
    { repairType: '1001', repairTypeName: '水电维修', payFeeFlag: 'T', priceScope: '50-300元', publicArea: 'T' },
    { repairType: '1002', repairTypeName: '门窗维修', payFeeFlag: 'T', priceScope: '80-400元', publicArea: 'T' },
    { repairType: '1003', repairTypeName: '空调维修', payFeeFlag: 'T', priceScope: '100-500元', publicArea: 'T' },
    { repairType: '1004', repairTypeName: '电梯维修', payFeeFlag: 'F', publicArea: 'T' },
    { repairType: '1005', repairTypeName: '管道疏通', payFeeFlag: 'T', priceScope: '60-200元', publicArea: 'F' },
    { repairType: '1006', repairTypeName: '墙面修补', payFeeFlag: 'T', priceScope: '40-250元', publicArea: 'F' },
    { repairType: '1007', repairTypeName: '其他维修', payFeeFlag: 'T', priceScope: '30-500元', publicArea: 'F' },
  ]
  const repairStates: RepairStateDictionaryItem[] = REPAIR_STATUSES.map(item => ({
    statusCd: String(item.value),
    name: item.label,
  }))
  const payTypes: RepairStateDictionaryItem[] = REPAIR_PAY_TYPE_OPTIONS.map(item => ({
    statusCd: String(item.value),
    name: item.label,
  }))

  return {
    list(params) {
      return buildRepairListResult(filterRepairs(repairs, params), params)
    },
    listDispatch(params) {
      const result = buildRepairListResult(filterRepairs(repairs, params), params)
      const allowedStatus = ['10002', '10003', '10006']
      result.list = result.list.filter((repair) => {
        const isAssignedOrProcessing = allowedStatus.includes(repair.statusCd || '')
        const isCompletedWithReturnVisit = repair.statusCd === '10004' && repair.returnVisitFlag === '003'
        const matchFilter = params.statusCd ? repair.statusCd === params.statusCd : true
        return (isAssignedOrProcessing || isCompletedWithReturnVisit) && matchFilter
      })
      result.total = result.list.length
      return cloneValue(result)
    },
    listFinish(params) {
      return buildRepairListResult(filterRepairs(repairs, { ...params, statusCd: '10004' }), params)
    },
    getById(repairId) {
      const repair = repairs.find(item => item.repairId === repairId)
      return repair ? cloneValue(normalizeRepairOrder(repair)) : undefined
    },
    create(input) {
      const newRepair: RepairOrder = {
        repairId: generateId('REP'),
        title: String(input.title || ''),
        context: String(input.context || ''),
        repairName: String(input.repairName || ''),
        tel: String(input.tel || ''),
        address: String(input.address || ''),
        repairType: (input.repairType || '1007') as RepairType,
        repairTypeName: String(input.repairTypeName || findRepairTypeLabel(input.repairType) || '其他维修'),
        statusCd: '10001',
        statusName: '待派单',
        priority: (input.priority || 'MEDIUM') as PriorityType,
        createTime: formatDateTime(),
        updateTime: formatDateTime(),
        assignedWorker: null,
        estimatedCost: Number(input.estimatedCost || 0),
        actualCost: null,
        images: Array.isArray(input.photos) ? input.photos.filter(Boolean) : [],
        communityId: String(input.communityId || 'COMM_001'),
      }

      repairs.unshift(newRepair)
      return cloneValue(newRepair)
    },
    update(repairId, input) {
      const repair = repairs.find(item => item.repairId === repairId)
      if (!repair) {
        return undefined
      }

      Object.assign(repair, {
        ...input,
        updateTime: formatDateTime(),
      })

      return cloneValue(normalizeRepairOrder(repair))
    },
    transfer(repairId, action, staffName) {
      const repair = repairs.find(item => item.repairId === repairId)
      if (!repair) {
        return undefined
      }

      if (action === 'DISPATCH' || action === 'TRANSFER') {
        repair.statusCd = '10002'
        repair.statusName = '已派单'
        repair.assignedWorker = staffName || repair.assignedWorker
      }
      else if (action === 'RETURN') {
        repair.statusCd = '10001'
        repair.statusName = '待派单'
        repair.assignedWorker = null
      }

      repair.updateTime = formatDateTime()
      return cloneValue(normalizeRepairOrder(repair))
    },
    finish(repairId, totalPrice) {
      const repair = repairs.find(item => item.repairId === repairId)
      if (!repair) {
        return undefined
      }

      repair.statusCd = '10004'
      repair.statusName = '已完成'
      repair.actualCost = totalPrice || repair.estimatedCost
      repair.updateTime = formatDateTime()
      return cloneValue(normalizeRepairOrder(repair))
    },
    end(repairId) {
      const repair = repairs.find(item => item.repairId === repairId)
      if (!repair) {
        return undefined
      }

      repair.statusCd = '10005'
      repair.statusName = '已取消'
      repair.updateTime = formatDateTime()
      return cloneValue(normalizeRepairOrder(repair))
    },
    setAppraise(repairId, comment) {
      const repair = repairs.find(item => item.repairId === repairId)
      if (!repair) {
        return undefined
      }

      repair.evaluation = {
        rating: 5,
        comment,
        evaluateTime: formatDateTime(),
      }
      repair.updateTime = formatDateTime()
      return cloneValue(normalizeRepairOrder(repair))
    },
    replyAppraise(repairId) {
      const repair = repairs.find(item => item.repairId === repairId)
      return repair ? cloneValue(normalizeRepairOrder(repair)) : undefined
    },
    listRepairStaffs(repairType) {
      return cloneValue(filterRepairStaffs(staffs, repairType))
    },
    listRepairTypeUsers(repairType) {
      return filterRepairStaffs(staffs, repairType).map(staff => ({
        userId: staff.staffId,
        userName: staff.staffName,
      }))
    },
    listUserStorehouses(params) {
      let filteredResources = [...resources]
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filteredResources = filteredResources.filter(resource =>
          resource.resName.toLowerCase().includes(keyword)
          || resource.resTypeName.toLowerCase().includes(keyword))
      }

      const page = Number(params.page) || 1
      const row = Number(params.row) || 20
      const result = createPaginationResponse(filteredResources, page, row)
      return {
        resources: cloneValue(result.list),
        total: result.total,
      }
    },
    getStatistics() {
      const statusStats: Record<RepairStatus, number> = repairs.reduce((accumulator, repair) => {
        const code = (repair.statusCd || 'UNKNOWN') as RepairStatus
        accumulator[code] = (accumulator[code] || 0) + 1
        return accumulator
      }, {} as Record<RepairStatus, number>)
      const typeStats = repairs.reduce((accumulator, repair) => {
        accumulator[repair.repairType] = (accumulator[repair.repairType] || 0) + 1
        return accumulator
      }, {} as Record<string, number>)
      const monthlyStats = repairs.reduce((accumulator, repair) => {
        const month = dayjs(repair.createTime).format('YYYY-MM')
        accumulator[month] = (accumulator[month] || 0) + 1
        return accumulator
      }, {} as Record<string, number>)
      const evaluatedRepairs = repairs.filter(repair => repair.evaluation)
      const satisfactionRate = evaluatedRepairs.length > 0
        ? `${Math.round((evaluatedRepairs.filter(repair => (repair.evaluation?.rating || 0) >= 4).length / evaluatedRepairs.length) * 100)}%`
        : '0%'

      return {
        total: repairs.length,
        statusStats,
        typeStats,
        monthlyStats,
        avgResponseTime: '2.5小时',
        satisfactionRate,
      }
    },
    listResourceStoreTypes(parentId) {
      const items = parentId
        ? resourceTypes.filter(item => item.parentRstId === parentId)
        : resourceTypes
      return cloneValue(items)
    },
    listRepairSettings(params) {
      let settings = [...repairSettings]
      if (params.publicArea) {
        settings = settings.filter(item => item.publicArea === params.publicArea)
      }

      const page = Number(params.page) || 1
      const row = Number(params.row) || 10
      const start = (page - 1) * row
      const end = start + row
      return cloneValue(settings.slice(start, end))
    },
    listDict(domain) {
      const dictData: Record<string, RepairStateDictionaryItem[]> = {
        repair_status: [
          { statusCd: 'PENDING', name: '待派单' },
          { statusCd: 'ASSIGNED', name: '已派单' },
          { statusCd: 'IN_PROGRESS', name: '处理中' },
          { statusCd: 'COMPLETED', name: '已完成' },
          { statusCd: 'CANCELLED', name: '已取消' },
        ],
        repair_type: [
          { statusCd: '1001', name: '水电维修' },
          { statusCd: '1002', name: '门窗维修' },
          { statusCd: '1003', name: '空调维修' },
          { statusCd: '1004', name: '电梯维修' },
          { statusCd: '1005', name: '管道疏通' },
          { statusCd: '1006', name: '墙面修补' },
          { statusCd: '1007', name: '其他维修' },
        ],
        maintenance_type: [
          { statusCd: '1001', name: '有偿用料' },
          { statusCd: '1002', name: '无偿用料' },
          { statusCd: '1003', name: '有偿不用料' },
          { statusCd: '1004', name: '无偿不用料' },
        ],
      }

      return cloneValue(dictData[domain || ''] || [])
    },
    start(repairId) {
      const repair = repairs.find(item => item.repairId === repairId)
      if (!repair) {
        return undefined
      }

      repair.statusCd = '10003'
      repair.statusName = '处理中'
      repair.updateTime = formatDateTime()
      return cloneValue(normalizeRepairOrder(repair))
    },
    stop(repairId) {
      const repair = repairs.find(item => item.repairId === repairId)
      if (!repair) {
        return undefined
      }

      repair.statusCd = '10006'
      repair.statusName = '暂停'
      repair.updateTime = formatDateTime()
      return cloneValue(normalizeRepairOrder(repair))
    },
    grab(repairId, staffName) {
      const repair = repairs.find(item => item.repairId === repairId)
      if (!repair) {
        return undefined
      }

      repair.statusCd = '10002'
      repair.statusName = '已派单'
      repair.assignedWorker = staffName
      repair.updateTime = formatDateTime()
      return cloneValue(normalizeRepairOrder(repair))
    },
    listRepairStates() {
      return cloneValue(repairStates)
    },
    listRepairs() {
      return cloneValue(ensureNormalizedList(repairs))
    },
    listRepairStaffRecords(repairId) {
      const repair = repairs.find(item => item.repairId === repairId)
      if (!repair) {
        return []
      }

      const records: RepairStaffRecord[] = [
        {
          ruId: 'RU_001',
          repairId,
          staffId: 'STAFF_001',
          staffName: '张师傅',
          statusCd: '10001',
          statusName: '待派单',
          startTime: repair.createTime,
          endTime: repair.statusCd !== '10001' ? formatDateTime(dayjs(repair.createTime).add(1, 'hour')) : undefined,
          context: '工单已创建',
        },
      ]

      if (repair.statusCd === '10002' || repair.statusCd === '10003' || repair.statusCd === '10004') {
        records.push({
          ruId: 'RU_002',
          repairId,
          staffId: 'STAFF_002',
          staffName: repair.assignedWorker || '李师傅',
          statusCd: '10002',
          statusName: '已派单',
          startTime: formatDateTime(dayjs(repair.createTime).add(1, 'hour')),
          endTime: repair.statusCd !== '10002' ? formatDateTime(dayjs(repair.createTime).add(2, 'hour')) : undefined,
          context: '已派单给维修师傅',
        })
      }

      if (repair.statusCd === '10003' || repair.statusCd === '10004') {
        records.push({
          ruId: 'RU_003',
          repairId,
          staffId: 'STAFF_002',
          staffName: repair.assignedWorker || '李师傅',
          statusCd: '10003',
          statusName: '处理中',
          startTime: formatDateTime(dayjs(repair.createTime).add(2, 'hour')),
          endTime: repair.statusCd === '10004' ? formatDateTime(dayjs(repair.createTime).add(3, 'hour')) : undefined,
          context: '正在处理维修问题',
        })
      }

      if (repair.statusCd === '10004') {
        records.push({
          ruId: 'RU_004',
          repairId,
          staffId: 'STAFF_002',
          staffName: repair.assignedWorker || '李师傅',
          statusCd: '10004',
          statusName: '已完成',
          startTime: formatDateTime(dayjs(repair.createTime).add(3, 'hour')),
          endTime: formatDateTime(dayjs(repair.createTime).add(3, 'hour')),
          context: '维修已完成，问题已解决',
        })
      }

      if (repair.evaluation) {
        records.push({
          ruId: 'RU_005',
          repairId,
          staffId: 'STAFF_002',
          staffName: repair.assignedWorker || '李师傅',
          statusCd: '10007',
          statusName: '业主评价',
          startTime: repair.evaluation.evaluateTime,
          endTime: repair.evaluation.evaluateTime,
          context: repair.evaluation.comment,
        })
      }

      return cloneValue(records)
    },
    listPayTypes() {
      return cloneValue(payTypes)
    },
    listResources(rstId) {
      let filteredResources = [...resources]
      if (rstId) {
        const resourceType = resourceTypes.find(item => item.rstId === rstId)
        if (resourceType) {
          filteredResources = filteredResources.filter(item => item.resTypeName === resourceType.name)
        }
      }

      return {
        resources: cloneValue(filteredResources),
        total: filteredResources.length,
      }
    },
  }
}

/** 默认供运行时直接复用的 repair 仓储实例。 */
export const repairMockRepository = createRepairMockRepository()

/** 生成更贴近真实业务的维修描述。 */
function generateRepairDescription(repairTypeName: string): string {
  const descriptions: Record<string, string[]> = {
    水电维修: [
      '卫生间水龙头漏水，需要更换密封圈',
      '客厅插座没电，怀疑是线路问题',
      '厨房热水器不出热水，需要检修',
      '阳台排水管堵塞，积水严重',
      '卧室开关失灵，灯光无法正常控制',
    ],
    门窗维修: [
      '入户门锁损坏，无法正常开启',
      '卧室窗户密封条老化，漏风严重',
      '阳台推拉门滑轨卡死，开关困难',
      '防盗门猫眼松动，存在安全隐患',
      '窗户玻璃有裂痕，需要更换',
    ],
    空调维修: [
      '客厅空调不制冷，怀疑缺氟',
      '卧室空调噪音过大，影响休息',
      '空调遥控器失灵，无法调节温度',
      '空调滤网长期未清洗，风量减小',
      '空调外机支架松动，存在安全风险',
    ],
    电梯维修: [
      '电梯按钮失灵，部分楼层无法到达',
      '电梯门关闭不严，存在安全隐患',
      '电梯运行时有异响，需要检查',
      '电梯停电后困人，应急系统故障',
      '电梯显示屏不亮，楼层显示不清',
    ],
    管道疏通: [
      '厨房下水道堵塞，污水倒灌',
      '卫生间马桶堵塞，无法正常使用',
      '阳台地漏堵塞，雨水无法排出',
      '洗手池下水慢，怀疑管道堵塞',
      '楼道排水管破裂，污水泄漏',
    ],
    墙面修补: [
      '客厅墙面开裂，影响美观',
      '卧室墙皮脱落，需要重新粉刷',
      '厨房瓷砖松动，存在脱落风险',
      '卫生间墙面渗水，怀疑防水层破损',
      '阳台墙面发霉，需要除霉处理',
    ],
    其他维修: [
      '楼道照明灯具损坏，影响出行安全',
      '小区健身器材故障，无法正常使用',
      '停车场地面破损，车辆容易受损',
      '小区门禁系统故障，业主无法刷卡',
      '消防设施损坏，存在安全隐患',
    ],
  }

  const items = descriptions[repairTypeName] || descriptions['其他维修']
  return items[Math.floor(Math.random() * items.length)]
}

/** 创建模拟维修工单。 */
function createMockRepair(id: string): RepairOrder {
  const typeItem = REPAIR_TYPE_OPTIONS[Math.floor(Math.random() * REPAIR_TYPE_OPTIONS.length)]
  const statusItem = REPAIR_STATUSES[Math.floor(Math.random() * REPAIR_STATUSES.length)]
  const priority = (['HIGH', 'MEDIUM', 'LOW'] as PriorityType[])[Math.floor(Math.random() * 3)]
  const now = Date.now()
  const randomDays = Math.floor(Math.random() * 30)
  const address = generateAddress()
  const appointmentTime = formatDateTime(dayjs(now).add(Math.floor(Math.random() * 7), 'day'))
  const isDispatchedOrProcessing = statusItem.value === '10002' || statusItem.value === '10003'
  const preStaffId = isDispatchedOrProcessing
    ? `STAFF_${String(Math.floor(Math.random() * 5) + 1).padStart(3, '0')}`
    : undefined
  const returnVisitFlag = statusItem.value === '10004'
    ? (Math.random() > 0.5 ? '003' : '001')
    : undefined

  return {
    repairId: `REP_${id}`,
    repairType: typeItem.value as RepairType,
    repairTypeName: typeItem.label,
    context: generateRepairDescription(typeItem.label),
    repairName: generateChineseName(),
    tel: generatePhoneNumber(),
    address,
    repairObjName: address,
    appointmentTime,
    statusCd: String(statusItem.value),
    statusName: statusItem.label,
    priority,
    createTime: formatDateTime(dayjs(now).subtract(randomDays, 'day')),
    updateTime: formatDateTime(),
    assignedWorker: statusItem.value === '10001' ? null : `维修工${Math.floor(Math.random() * 10 + 1)}`,
    estimatedCost: generateAmount(50, 500),
    actualCost: statusItem.value === '10004' ? generateAmount(40, 600) : null,
    images: Math.random() > 0.5 ? [`https://picsum.photos/400/300?random=${id}`] : [],
    communityId: 'COMM_001',
    preStaffId,
    returnVisitFlag,
    evaluation: statusItem.value === '10004' && Math.random() > 0.3
      ? {
          rating: Math.floor(Math.random() * 2) + 4,
          comment: ['服务很好，维修及时', '师傅很专业，问题解决了', '效率很高，满意', '态度不错'][
            Math.floor(Math.random() * 4)
          ],
          evaluateTime: formatDateTime(),
        }
      : undefined,
  }
}

/** 过滤维修工单。 */
function filterRepairs(repairs: RepairOrder[], params: RepairListParams): RepairOrder[] {
  let filteredRepairs = [...repairs]

  if (params.statusCd) {
    filteredRepairs = filteredRepairs.filter(repair => repair.statusCd === params.statusCd)
  }

  if (params.repairType) {
    filteredRepairs = filteredRepairs.filter(repair => repair.repairType === params.repairType)
  }

  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredRepairs = filteredRepairs.filter(repair =>
      (repair.context || '').toLowerCase().includes(keyword)
      || (repair.repairName || '').toLowerCase().includes(keyword)
      || (repair.tel || '').toLowerCase().includes(keyword)
      || (repair.address || '').toLowerCase().includes(keyword))
  }

  if (params.startDate) {
    filteredRepairs = filteredRepairs.filter(repair =>
      dayjs(repair.createTime).valueOf() >= dayjs(params.startDate).valueOf())
  }

  if (params.endDate) {
    filteredRepairs = filteredRepairs.filter(repair =>
      dayjs(repair.createTime).valueOf() <= dayjs(params.endDate).valueOf())
  }

  if (params.assignedWorker) {
    filteredRepairs = filteredRepairs.filter(repair => repair.assignedWorker === params.assignedWorker)
  }

  filteredRepairs.sort((left, right) => dayjs(right.createTime).valueOf() - dayjs(left.createTime).valueOf())
  return filteredRepairs
}

/** 构建统一的 repair 列表结果。 */
function buildRepairListResult(repairs: RepairOrder[], params: RepairListParams): RepairListResult {
  const result = createPaginationResponse(repairs, Number(params.page) || 1, Number(params.row) || 10)
  return {
    ...result,
    list: ensureNormalizedList(result.list),
  }
}

/** 统一筛选维修师傅。 */
function filterRepairStaffs(staffs: RepairStaff[], repairType?: string): RepairStaff[] {
  if (!repairType) {
    return staffs
  }

  const repairTypeName = findRepairTypeLabel(repairType) || repairType
  return staffs.filter(staff =>
    staff.repairTypes.includes(repairType)
    || staff.repairTypes.includes(repairTypeName))
}

/** 补齐维修工单展示必需字段。 */
function normalizeRepairOrder(repair: RepairOrder): RepairOrder {
  const typeItem = REPAIR_TYPE_OPTIONS.find(item => item.value === repair.repairType)
  const statusItem = REPAIR_STATUSES.find(item => item.value === repair.statusCd)
  const normalizedTitle = (repair.title || '').trim()
  const nameFromTitle = normalizedTitle.includes('维修申请')
    ? normalizedTitle.replace(/^.*-\s*/, '').replace(/的维修申请.*$/, '').trim()
    : ''
  const typeFromTitle = normalizedTitle.split('-')[0]?.trim()
  const normalizedName = (repair.repairName || '').trim() || nameFromTitle || '未填写报修人'
  const normalizedTel = (repair.tel || (repair as any).ownerTel || (repair as any).phone || '').trim() || '未填写电话'

  return {
    ...repair,
    repairTypeName: repair.repairTypeName || typeItem?.label || typeFromTitle || '其他维修',
    statusName: repair.statusName || statusItem?.label || '待派单',
    repairName: normalizedName,
    tel: normalizedTel,
    repairObjName: repair.repairObjName || repair.address || '未填写位置',
    appointmentTime: repair.appointmentTime || repair.createTime || '',
    context: repair.context || normalizedTitle || '暂无报修内容',
  }
}

/** 批量补齐维修工单展示字段。 */
function ensureNormalizedList(list: RepairOrder[]): RepairOrder[] {
  return list.map(normalizeRepairOrder)
}

/** 查找维修类型标签。 */
function findRepairTypeLabel(repairType?: string): string | undefined {
  return REPAIR_TYPE_OPTIONS.find(item => item.value === repairType)?.label
}

/** 克隆仓储返回值，避免外部篡改内部引用。 */
function cloneValue<T>(value: T): T {
  return structuredClone(value)
}
