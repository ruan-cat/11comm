/**
 * 费用相关模块 Mock 接口。
 */

import type {
  Fee,
  FeeDetail,
  FeeDetailParams,
  FeeDetailResponse,
  FeeListParams,
  FeeListResponse,
  OweFee,
  OweFeeListResponse,
  OweFeeParams,
} from '../../types/fee'
import { createPaginationResponse, defineUniAppMock, generateId, generateTimeRange, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

interface OweFeeCallable {
  amountdOwed: number
  callableWayName: string
  createTime: string
  endTime: string
  feeId: string
  feeName: string
  ownerName: string
  remark: string
  staffName: string
  startTime: string
}

interface FeeConfigItem {
  computingFormula: string
  configId: string
  feeFlag: string
  feeName: string
  feeTypeCd: string
  isDefault: string
  valid: number
}

interface ChargeMachine {
  chargeTypeName: string
  communityId: string
  factoryName: string
  machineCode: string
  machineId: string
  machineName: string
  monitorId?: string
  monitorName?: string
  photoUrl: string
  ruleName: string
  state: string
  stateName: string
}

interface ChargeMachineOrder {
  amount: number
  chargeHours: number
  durationPrice: number
  endTime: string
  energy: number
  machineCode: string
  machineId: string
  machineName: string
  orderId: string
  personName: string
  personTel: string
  portCode: string
  remark: string
  startTime: string
  stateName: string
}

interface ChargeMachinePort {
  machineId: string
  portCode: string
  portId: string
  portName: string
  stateName: string
}

interface FeeSummaryReportItem {
  curOweFee: number
  curReceivableFee: number
  feeRoomCount: number
  hisOweFee: number
  hisReceivedFee: number
  oweRoomCount: number
  receivedFee: number
  roomCount: number
}

interface PayFeeDetailReportItem {
  feeId: string
  feeName: string
  ownerName: string
  payMethod: string
  payTime: string
  receivedAmount: number
  roomId: string
  roomName: string
  stateName: string
}

interface RoomFeeReportItem {
  feeName: string
  oweFee: number
  ownerName: string
  receivableFee: number
  receivedFee: number
  roomId: string
  roomName: string
  stateName: string
}

interface DataReportItem {
  name: string
  unit?: string
  value: number
}

interface OpenDoorLog {
  logId: string
  openTime: string
  openType: string
  openTypeName: string
  ownerName: string
  remark: string
  roomId: string
  roomName: string
}

/** 费用列表 mock 数据。 */
const fees: Fee[] = [
  {
    feeId: 'FEE_001',
    feeName: '物业管理费',
    feeType: 'PROPERTY',
    feeTypeCdName: '物业费',
    roomId: 'ROOM_001',
    roomName: '1栋101室',
    communityId: 'COMM_001',
    ownerName: '张三',
    ownerTel: '13800138001',
    receivedAmount: 360,
    paidAmount: 120,
    oweAmount: 240,
    startTime: '2026-04-01',
    endTime: '2026-04-30',
    deadlineTime: '2026-04-30',
    feeFlagName: '周期性费用',
    state: 'PARTIAL_PAID',
    stateName: '部分缴费',
    createTime: '2026-04-01 09:00:00',
    updateTime: '2026-04-10 10:30:00',
  },
  {
    feeId: 'FEE_002',
    feeName: '停车服务费',
    feeType: 'PARKING',
    feeTypeCdName: '停车费',
    roomId: 'ROOM_002',
    roomName: '2栋202室',
    communityId: 'COMM_001',
    ownerName: '李四',
    ownerTel: '13800138002',
    receivedAmount: 280,
    paidAmount: 280,
    oweAmount: 0,
    startTime: '2026-04-01',
    endTime: '2026-04-30',
    deadlineTime: '2026-04-30',
    feeFlagName: '周期性费用',
    state: 'PAID',
    stateName: '已缴费',
    createTime: '2026-04-01 09:10:00',
    updateTime: '2026-04-12 15:20:00',
  },
  {
    feeId: 'FEE_003',
    feeName: '水费',
    feeType: 'WATER',
    feeTypeCdName: '水费',
    roomId: 'ROOM_003',
    roomName: '3栋303室',
    communityId: 'COMM_001',
    ownerName: '王五',
    ownerTel: '13800138003',
    receivedAmount: 96,
    paidAmount: 0,
    oweAmount: 96,
    startTime: '2026-03-01',
    endTime: '2026-03-31',
    deadlineTime: '2026-04-10',
    feeFlagName: '一次性费用',
    state: 'OVERDUE',
    stateName: '已逾期',
    createTime: '2026-03-31 08:30:00',
    updateTime: '2026-04-11 08:30:00',
  },
  {
    feeId: 'FEE_004',
    feeName: '电费',
    feeType: 'ELECTRICITY',
    feeTypeCdName: '电费',
    roomId: 'ROOM_004',
    roomName: '4栋404室',
    communityId: 'COMM_001',
    ownerName: '赵六',
    ownerTel: '13800138004',
    receivedAmount: 188,
    paidAmount: 0,
    oweAmount: 188,
    startTime: '2026-04-01',
    endTime: '2026-04-30',
    deadlineTime: '2026-04-30',
    feeFlagName: '一次性费用',
    state: 'UNPAID',
    stateName: '未缴费',
    createTime: '2026-04-02 09:20:00',
    updateTime: '2026-04-02 09:20:00',
  },
]

/** 费用详情 mock 数据。 */
const feeDetails: FeeDetail[] = [
  createFeeDetail('FEE_001', '物业管理费', 'ROOM_001', '1栋101A室', '张三', 300, '微信支付'),
  createFeeDetail('FEE_001', '垃圾处理费', 'ROOM_001', '1栋101A室', '张三', 50, '微信支付'),
  createFeeDetail('FEE_002', '停车服务费', 'ROOM_002', '2栋202B室', '李四', 280, '支付宝'),
  createFeeDetail('FEE_003', '水费', 'ROOM_003', '3栋303C室', '王五', 96, '现金'),
  ...Array.from({ length: 30 }, (_, index) => createFeeDetail(
    `FEE_${(index % 4) + 1}`.padStart(7, '0'),
    index % 2 === 0 ? '物业管理费' : '公共区域维护费',
    `ROOM_${(index % 8) + 1}`,
    `${(index % 12) + 1}栋${String((index % 20) + 1).padStart(2, '0')}室`,
    `业主${index + 1}`,
    Math.floor(Math.random() * 400 + 80),
    index % 2 === 0 ? '微信支付' : '支付宝',
  )),
]

/** 欠费催缴 mock 数据。 */
const oweFeeCallables: OweFeeCallable[] = [
  {
    feeId: 'FEE_001',
    feeName: '物业管理费',
    ownerName: '张三',
    staffName: '客服张霞',
    amountdOwed: 240,
    callableWayName: '电话催缴',
    startTime: '2026-04-01',
    endTime: '2026-04-30',
    remark: '已电话提醒业主尽快缴费',
    createTime: '2026-04-15 10:00:00',
  },
]

/** 费用配置 mock 数据。 */
const feeConfigs: FeeConfigItem[] = [
  { configId: 'CONFIG_001', feeName: '物业管理费标准', feeTypeCd: '888800010001', feeFlag: '1003006', computingFormula: '4004', isDefault: 'F', valid: 1 },
  { configId: 'CONFIG_002', feeName: '停车服务费标准', feeTypeCd: '888800010002', feeFlag: '1003006', computingFormula: '4004', isDefault: 'F', valid: 1 },
  { configId: 'CONFIG_003', feeName: '水电阶梯计费', feeTypeCd: '888800010003', feeFlag: '1003001', computingFormula: '1102', isDefault: 'F', valid: 1 },
]

/** 充电桩 mock 数据。 */
const chargeMachines: ChargeMachine[] = [
  {
    machineId: 'MACHINE_001',
    machineName: '东门充电桩 1 号',
    machineCode: 'CM-001',
    photoUrl: 'https://picsum.photos/300/200?random=charge-1',
    communityId: 'COMM_001',
    factoryName: '智充科技',
    ruleName: '按小时计费',
    chargeTypeName: '慢充',
    stateName: '在线',
    state: 'ONLINE',
    monitorId: 'MONITOR_001',
    monitorName: '东门监控',
  },
  {
    machineId: 'MACHINE_002',
    machineName: '地下车库充电桩 2 号',
    machineCode: 'CM-002',
    photoUrl: 'https://picsum.photos/300/200?random=charge-2',
    communityId: 'COMM_001',
    factoryName: '智充科技',
    ruleName: '按电量计费',
    chargeTypeName: '快充',
    stateName: '离线',
    state: 'OFFLINE',
  },
]

/** 充电订单 mock 数据。 */
const chargeOrders: ChargeMachineOrder[] = [
  {
    orderId: 'CHARGE_ORDER_001',
    personName: '张三',
    personTel: '13800138001',
    machineId: 'MACHINE_001',
    machineName: '东门充电桩 1 号',
    machineCode: 'CM-001',
    portCode: 'A01',
    chargeHours: 2,
    durationPrice: 2.5,
    energy: 12.6,
    amount: 5,
    startTime: '2026-04-20 08:00:00',
    endTime: '2026-04-20 10:00:00',
    stateName: '已完成',
    remark: '自动扣费成功',
  },
]

/** 充电端口 mock 数据。 */
const chargePorts: ChargeMachinePort[] = [
  { portId: 'PORT_001', machineId: 'MACHINE_001', portName: 'A01 插座', portCode: 'A01', stateName: '空闲' },
  { portId: 'PORT_002', machineId: 'MACHINE_001', portName: 'A02 插座', portCode: 'A02', stateName: '使用中' },
]

/** 开门记录 mock 数据。 */
const openDoorLogs: OpenDoorLog[] = [
  { logId: 'OPEN_LOG_001', roomId: 'ROOM_001', roomName: '1栋101室', ownerName: '张三', openType: 'FACE', openTypeName: '人脸开门', openTime: '2026-04-20 08:30:00', remark: '东门门禁' },
  { logId: 'OPEN_LOG_002', roomId: 'ROOM_002', roomName: '2栋202室', ownerName: '李四', openType: 'CARD', openTypeName: '门禁卡', openTime: '2026-04-20 09:10:00', remark: '单元门' },
]

export default defineUniAppMock([
  {
    url: '/app/fee.listFee',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = normalizeFeeListParams(getRequestParams(context))

      return successResponse(getFeeList(params), '查询费用列表成功')
    },
  },
  {
    url: '/app/fee.queryFeeDetail',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = normalizeFeeDetailParams(getRequestParams(context))

      return successResponse(getFeeDetailList(params), '查询费用详情成功')
    },
  },
  {
    url: '/app/feeApi/listOweFees',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = normalizeOweFeeParams(getRequestParams(context))

      return successResponse(getOweFees(params), '查询欠费成功')
    },
  },
  {
    url: '/app/fee.saveRoomCreateFee',
    method: 'POST',
    body: (context: MockContext = {}) => successResponse(saveRoomCreateFee(context.body || {}), '创建费用成功'),
  },
  {
    url: '/app/payment.nativeQrcodePayment',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const body = context.body || {}
      const roomId = asOptionalString(body.roomId) || 'ROOM_001'
      const communityId = asOptionalString(body.communityId) || 'COMM_001'
      const feeIds = asStringArray(body.feeIds).join(',') || 'FEE_001'

      return successResponse({
        code: 0,
        msg: '生成二维码成功',
        data: {
          codeUrl: `mock-payment://pay?roomId=${roomId}&communityId=${communityId}&feeIds=${feeIds}&business=${asOptionalString(body.business) || 'oweFee'}`,
        },
      }, '生成二维码成功')
    },
  },
  {
    url: '/app/oweFeeCallable.listOweFeeCallable',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const payerObjId = asOptionalString(params.payerObjId)
      const list = payerObjId
        ? oweFeeCallables.filter(item => item.feeId === payerObjId || item.feeId === 'FEE_001')
        : oweFeeCallables

      return successResponse({ list: paginate(list, asPositiveNumber(params.page, 1), asPositiveNumber(params.row, 10)).list }, '查询欠费催缴成功')
    },
  },
  {
    url: '/app/oweFeeCallable.writeOweFeeCallable',
    method: 'POST',
    body: (context: MockContext = {}) => {
      oweFeeCallables.unshift({
        feeId: asStringArray(context.body?.feeIds)[0] || 'FEE_001',
        feeName: '物业管理费',
        ownerName: '张三',
        staffName: '当前员工',
        amountdOwed: 240,
        callableWayName: '人工登记',
        startTime: '2026-04-01',
        endTime: '2026-04-30',
        remark: asOptionalString(context.body?.remark) || '已登记催缴',
        createTime: '2026-04-24 10:00:00',
      })

      return successResponse({ code: 0, msg: '登记成功' }, '登记欠费催缴成功')
    },
  },
  {
    url: '/app/iot/listChargeMachineBmoImpl',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const machineId = asOptionalString(params.machineId)
      const machineNameLike = asOptionalString(params.machineNameLike)
      const list = chargeMachines
        .filter(item => item.communityId === (asOptionalString(params.communityId) || 'COMM_001'))
        .filter(item => !machineId || item.machineId === machineId)
        .filter(item => !machineNameLike || item.machineName.includes(machineNameLike))

      return successResponse({ list: paginate(list, asPositiveNumber(params.page, 1), asPositiveNumber(params.row, 10)).list }, '查询充电桩成功')
    },
  },
  {
    url: '/app/iot/listChargeMachineOrderBmoImpl',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const machineId = asOptionalString(params.machineId)
      const list = machineId ? chargeOrders.filter(item => item.machineId === machineId) : chargeOrders

      return successResponse({ list: paginate(list, asPositiveNumber(params.page, 1), asPositiveNumber(params.row, 10)).list }, '查询充电桩订单成功')
    },
  },
  {
    url: '/app/iot/listChargeMachinePortBmoImpl',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const machineId = asOptionalString(params.machineId) || 'MACHINE_001'
      const list = chargePorts.filter(item => item.machineId === machineId)

      return successResponse({ list: paginate(list, asPositiveNumber(params.page, 1), asPositiveNumber(params.row, 10)).list }, '查询充电桩插座成功')
    },
  },
  {
    url: '/app/reportFeeMonthStatistics.queryReportFeeSummary',
    method: ['GET', 'POST'],
    body: () => successResponse({ list: [createFeeSummaryReport()] }, '查询费用汇总成功'),
  },
  {
    url: '/app/reportFeeMonthStatistics/queryPayFeeDetail',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const roomId = asOptionalString(params.roomId)
      const reportItems = feeDetails
        .filter(item => !roomId || item.roomId === roomId)
        .map<PayFeeDetailReportItem>(item => ({
          feeId: item.feeId,
          feeName: item.feeName,
          roomId: item.roomId,
          roomName: item.roomName,
          ownerName: item.ownerName,
          receivedAmount: item.receivedAmount,
          payTime: item.payTime,
          payMethod: item.payMethod,
          stateName: item.payState === 'PAID' ? '已缴费' : '未缴费',
        }))
      const result = paginate(reportItems, asPositiveNumber(params.page, 1), asPositiveNumber(params.row, 10))

      return successResponse({ list: result.list, total: result.total }, '查询缴费明细成功')
    },
  },
  {
    url: '/app/reportFeeMonthStatistics.queryReportFeeDetailRoom',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const roomId = asOptionalString(params.roomId)
      const reportItems = fees
        .filter(item => !roomId || item.roomId === roomId)
        .map<RoomFeeReportItem>(item => ({
          roomId: item.roomId,
          roomName: item.roomName,
          ownerName: item.ownerName,
          feeName: item.feeName,
          receivableFee: item.receivedAmount,
          receivedFee: item.paidAmount,
          oweFee: item.oweAmount,
          stateName: item.stateName,
        }))
      const result = paginate(reportItems, asPositiveNumber(params.page, 1), asPositiveNumber(params.row, 10))

      return successResponse({ list: result.list, total: result.total }, '查询房间费用成功')
    },
  },
  {
    url: '/app/dataReport.queryFeeDataReport',
    method: ['GET', 'POST'],
    body: () => successResponse({ list: createFeeDataReport() }, '查询数据报表成功'),
  },
  {
    url: '/app/machine/listMachineRecords',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const result = paginate(openDoorLogs, asPositiveNumber(params.page, 1), asPositiveNumber(params.row, 10))

      return successResponse({ list: result.list, total: result.total }, '查询开门记录成功')
    },
  },
  {
    url: '/app/feeConfig.listFeeConfigs',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const valid = params.valid === undefined ? undefined : Number(params.valid)
      const list = feeConfigs
        .filter(item => !params.feeTypeCd || item.feeTypeCd === asOptionalString(params.feeTypeCd))
        .filter(item => !params.isDefault || item.isDefault === asOptionalString(params.isDefault))
        .filter(item => valid === undefined || item.valid === valid)

      return successResponse(paginate(list, asPositiveNumber(params.page, 1), asPositiveNumber(params.row, 500)).list, '查询费用配置成功')
    },
  },
])

/** 创建费用明细。 */
function createFeeDetail(
  feeId: string,
  feeName: string,
  roomId: string,
  roomName: string,
  ownerName: string,
  receivedAmount: number,
  payMethod: string,
): FeeDetail {
  return {
    detailId: generateId('FEE_DETAIL'),
    feeId,
    feeName,
    roomId,
    roomName,
    communityId: 'COMM_001',
    ownerName,
    receivedAmount,
    payTime: generateTimeRange(-90, 0),
    payMethod,
    payState: 'PAID',
    createTime: generateTimeRange(-90, 0),
  }
}

/** 查询费用列表。 */
function getFeeList(params: FeeListParams): FeeListResponse {
  const roomId = params.roomId || params.payerObjId
  const list = fees
    .filter(item => !params.communityId || item.communityId === params.communityId)
    .filter(item => !roomId || item.roomId === roomId)
    .filter(item => !params.feeId || item.feeId === params.feeId)
    .filter(item => !params.ownerName || item.ownerName.includes(params.ownerName))
    .filter(item => !params.state || item.state === params.state)
    .filter(item => !params.feeType || item.feeType === params.feeType)
    .filter(item => !params.roomName || item.roomName.includes(params.roomName))
  const result = createPaginationResponse(list, params.page, params.row)

  return {
    list: result.list,
    total: result.total,
    page: result.page,
    row: result.pageSize,
  }
}

/** 查询费用详情。 */
function getFeeDetailList(params: FeeDetailParams): FeeDetailResponse {
  const result = createPaginationResponse(
    feeDetails
      .filter(item => !params.communityId || item.communityId === params.communityId)
      .filter(item => !params.feeId || item.feeId === params.feeId),
    params.page,
    params.row,
  )

  return {
    list: result.list,
  }
}

/** 查询欠费。 */
function getOweFees(params: OweFeeParams): OweFeeListResponse {
  const list = fees
    .filter(item => item.oweAmount > 0)
    .map(toOweFee)
    .filter(item => !params.communityId || item.communityId === params.communityId)
    .filter(item => !params.roomId || item.roomId === params.roomId)
  const result = createPaginationResponse(list, params.page, params.row)

  return {
    data: result.list,
    totalAmount: list.reduce((sum, item) => sum + item.totalAmount, 0),
    total: list.length,
    page: params.page,
    row: params.row,
  }
}

/** 手工创建费用并追加到内存列表。 */
function saveRoomCreateFee(params: Record<string, unknown>) {
  const amount = Number(params.amount || 100)
  const newFeeId = `FEE_${String(fees.length + 1).padStart(3, '0')}`

  fees.unshift({
    feeId: newFeeId,
    feeName: feeConfigs.find(item => item.configId === asOptionalString(params.configId))?.feeName || '新增费用',
    feeType: 'OTHER',
    feeTypeCdName: '其他费用',
    roomId: asOptionalString(params.locationObjId) || 'ROOM_001',
    roomName: asOptionalString(params.locationObjId) || 'ROOM_001',
    communityId: asOptionalString(params.communityId) || 'COMM_001',
    ownerName: '模拟业主',
    ownerTel: '13800138999',
    receivedAmount: amount,
    paidAmount: 0,
    oweAmount: amount,
    startTime: asOptionalString(params.startTime) || '2026-04-01',
    endTime: asOptionalString(params.endTime) || '2026-04-30',
    feeFlagName: '手工创建',
    state: 'UNPAID',
    stateName: '未缴费',
    createTime: '2026-04-24 10:00:00',
    updateTime: '2026-04-24 10:00:00',
  })

  return {
    success: true,
    totalRoom: 1,
    successRoom: 1,
    errorRoom: 0,
    msg: '创建收费成功',
  }
}

/** 生成费用汇总报表。 */
function createFeeSummaryReport(): FeeSummaryReportItem {
  const oweFees = fees.filter(item => item.oweAmount > 0)

  return {
    feeRoomCount: new Set(fees.map(item => item.roomId)).size,
    oweRoomCount: new Set(oweFees.map(item => item.roomId)).size,
    curOweFee: oweFees.reduce((sum, item) => sum + item.oweAmount, 0),
    hisOweFee: 320,
    receivedFee: fees.reduce((sum, item) => sum + item.paidAmount, 0),
    curReceivableFee: fees.reduce((sum, item) => sum + item.receivedAmount, 0),
    hisReceivedFee: 960,
    roomCount: new Set(fees.map(item => item.roomId)).size,
  }
}

/** 生成费用数据报表。 */
function createFeeDataReport(): DataReportItem[] {
  return [
    { name: '本月应收', value: fees.reduce((sum, item) => sum + item.receivedAmount, 0), unit: '元' },
    { name: '本月实收', value: fees.reduce((sum, item) => sum + item.paidAmount, 0), unit: '元' },
    { name: '欠费房屋', value: fees.filter(item => item.oweAmount > 0).length, unit: '户' },
  ]
}

/** 将费用记录映射为欠费记录。 */
function toOweFee(fee: Fee): OweFee {
  return {
    oweFeeId: `OWE_${fee.feeId}`,
    feeId: fee.feeId,
    feeName: fee.feeName,
    roomId: fee.roomId,
    roomName: fee.roomName,
    communityId: fee.communityId,
    ownerName: fee.ownerName,
    ownerTel: fee.ownerTel,
    oweAmount: fee.oweAmount,
    startTime: fee.startTime,
    endTime: fee.endTime,
    oweDays: fee.state === 'OVERDUE' ? 15 : 3,
    lateFee: fee.state === 'OVERDUE' ? 12 : 0,
    totalAmount: fee.oweAmount + (fee.state === 'OVERDUE' ? 12 : 0),
    state: fee.state,
    createTime: fee.createTime,
  }
}

/** 把请求参数收敛为费用列表查询参数。 */
function normalizeFeeListParams(params: Record<string, unknown>): FeeListParams {
  return {
    page: asPositiveNumber(params.page, 1),
    row: asPositiveNumber(params.row, 10),
    communityId: asOptionalString(params.communityId) || 'COMM_001',
    roomId: asOptionalString(params.roomId),
    roomName: asOptionalString(params.roomName),
    feeType: asOptionalString(params.feeType),
    state: asOptionalString(params.state),
    ownerName: asOptionalString(params.ownerName),
    feeId: asOptionalString(params.feeId),
    payerObjId: asOptionalString(params.payerObjId),
  }
}

/** 把请求参数收敛为费用详情查询参数。 */
function normalizeFeeDetailParams(params: Record<string, unknown>): FeeDetailParams {
  return {
    page: asPositiveNumber(params.page, 1),
    row: asPositiveNumber(params.row, 50),
    communityId: asOptionalString(params.communityId) || 'COMM_001',
    feeId: asOptionalString(params.feeId) || '',
  }
}

/** 把请求参数收敛为欠费查询参数。 */
function normalizeOweFeeParams(params: Record<string, unknown>): OweFeeParams {
  return {
    page: asPositiveNumber(params.page, 1),
    row: asPositiveNumber(params.row, 10),
    communityId: asOptionalString(params.communityId) || 'COMM_001',
    roomId: asOptionalString(params.roomId),
    ownerId: asOptionalString(params.ownerId),
  }
}

/** 对数组执行简单分页。 */
function paginate<T>(data: T[], page: number = 1, row: number = 10) {
  const start = (page - 1) * row
  const end = start + row

  return {
    list: data.slice(start, end),
    total: data.length,
    page,
  }
}

/** 合并 Vite mock 的 query、body 与 params。 */
function getRequestParams(context: MockContext): Record<string, unknown> {
  return {
    ...(context.query || {}),
    ...(context.body || {}),
    ...(context.params || {}),
  }
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

/** 把未知值收敛为字符串数组。 */
function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(item => `${item}`).filter(Boolean)
  }

  if (typeof value === 'string') {
    return value.split(',').map(item => item.trim()).filter(Boolean)
  }

  return []
}
