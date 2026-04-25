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
} from '../../../src/types/fee.ts'
import { FEE_NAME_OPTIONS, FEE_PAY_METHOD_OPTIONS } from '../../../src/constants/fee.ts'
import {
  generateId,
  generateTimeRange,
} from '../../shared/runtime/common-utils.ts'

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

export interface FeeModuleRepository {
  createNativeQrcodePayment: (params: { business?: string, communityId: string, feeIds?: string[], roomId: string }) => { code: number, data: { codeUrl: string }, msg: string }
  getChargeMachineList: (params: { communityId: string, machineId?: string, machineNameLike?: string, page: number, row: number }) => { list: ChargeMachine[] }
  getChargeMachineOrderList: (params: { communityId: string, machineId?: string, page: number, row: number }) => { list: ChargeMachineOrder[] }
  getChargeMachinePortList: (params: { communityId: string, machineId: string, page: number, row: number }) => { list: ChargeMachinePort[] }
  getDataReport: (params: { communityId: string, reportCode: string }) => { list: DataReportItem[] }
  getFeeConfigList: (params: { communityId: string, feeTypeCd?: string, isDefault?: string, page: number, row: number, valid?: number }) => FeeConfigItem[]
  getFeeDetailList: (params: FeeDetailParams) => FeeDetailResponse
  getFeeList: (params: FeeListParams) => FeeListResponse
  getFeeSummaryReport: (params: { communityId: string, feeTypeCd?: string, floorId?: string, page: number, row: number }) => { list: FeeSummaryReportItem[] }
  getOpenDoorLogList: (params: { communityId: string, page: number, row: number }) => { list: OpenDoorLog[], total: number }
  getOweFeeCallableList: (params: { communityId: string, page: number, payerObjId?: string, row: number }) => { list: OweFeeCallable[] }
  getOweFees: (params: OweFeeParams) => OweFeeListResponse
  getPayFeeDetailReport: (params: { communityId: string, feeTypeCd?: string, floorId?: string, page: number, roomId?: string, row: number }) => { list: PayFeeDetailReportItem[], total: number }
  getRoomFeeReport: (params: { communityId: string, feeTypeCd?: string, floorId?: string, page: number, roomId?: string, row: number }) => { list: RoomFeeReportItem[], total: number }
  saveRoomCreateFee: (params: Record<string, any>) => { errorRoom: number, msg: string, success: boolean, successRoom: number, totalRoom: number }
  writeOweFeeCallable: (params: Record<string, any>) => { code: number, msg: string }
}

/** 创建 `fee` 模块的 mock 内存仓储。 */
export function createFeeMockRepository(): FeeModuleRepository {
  return new FeeDatabase()
}

/** fee 模块的 mock 内存仓储实现。 */
class FeeDatabase implements FeeModuleRepository {
  private readonly fees: Fee[] = [
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

  private readonly feeDetails: FeeDetail[] = [
    {
      detailId: 'FEE_DETAIL_001',
      feeId: 'FEE_001',
      feeName: '物业管理费',
      roomId: 'ROOM_001',
      roomName: '1栋101A室',
      communityId: 'COMM_001',
      ownerName: '张三',
      receivedAmount: 300,
      payTime: '2024-01-15 10:30:00',
      payMethod: '微信支付',
      payState: 'PAID',
      createTime: '2024-01-15 10:30:00',
    },
    {
      detailId: 'FEE_DETAIL_002',
      feeId: 'FEE_001',
      feeName: '垃圾处理费',
      roomId: 'ROOM_001',
      roomName: '1栋101A室',
      communityId: 'COMM_001',
      ownerName: '张三',
      receivedAmount: 50,
      payTime: '2024-01-15 10:31:00',
      payMethod: '微信支付',
      payState: 'PAID',
      createTime: '2024-01-15 10:31:00',
    },
    {
      detailId: 'FEE_DETAIL_003',
      feeId: 'FEE_001',
      feeName: '公共区域维护费',
      roomId: 'ROOM_001',
      roomName: '1栋101A室',
      communityId: 'COMM_001',
      ownerName: '张三',
      receivedAmount: 100,
      payTime: '2024-01-15 10:32:00',
      payMethod: '微信支付',
      payState: 'PAID',
      createTime: '2024-01-15 10:32:00',
    },
    {
      detailId: 'FEE_DETAIL_004',
      feeId: 'FEE_002',
      feeName: '物业管理费',
      roomId: 'ROOM_002',
      roomName: '2栋202B室',
      communityId: 'COMM_001',
      ownerName: '李四',
      receivedAmount: 320,
      payTime: '2024-02-01 14:20:00',
      payMethod: '支付宝',
      payState: 'PAID',
      createTime: '2024-02-01 14:20:00',
    },
    {
      detailId: 'FEE_DETAIL_005',
      feeId: 'FEE_002',
      feeName: '垃圾处理费',
      roomId: 'ROOM_002',
      roomName: '2栋202B室',
      communityId: 'COMM_001',
      ownerName: '李四',
      receivedAmount: 60,
      payTime: '2024-02-01 14:21:00',
      payMethod: '支付宝',
      payState: 'PAID',
      createTime: '2024-02-01 14:21:00',
    },
    {
      detailId: 'FEE_DETAIL_006',
      feeId: 'FEE_003',
      feeName: '物业管理费',
      roomId: 'ROOM_003',
      roomName: '3栋303C室',
      communityId: 'COMM_001',
      ownerName: '王五',
      receivedAmount: 280,
      payTime: '2024-01-20 09:15:00',
      payMethod: '现金',
      payState: 'PAID',
      createTime: '2024-01-20 09:15:00',
    },
  ]

  private readonly feeConfigs: FeeConfigItem[] = [
    {
      configId: 'CONFIG_001',
      feeName: '物业管理费标准',
      feeTypeCd: '888800010001',
      feeFlag: '1003006',
      computingFormula: '4004',
      isDefault: 'F',
      valid: 1,
    },
    {
      configId: 'CONFIG_002',
      feeName: '停车服务费标准',
      feeTypeCd: '888800010002',
      feeFlag: '1003006',
      computingFormula: '4004',
      isDefault: 'F',
      valid: 1,
    },
    {
      configId: 'CONFIG_003',
      feeName: '水电阶梯计费',
      feeTypeCd: '888800010003',
      feeFlag: '1003001',
      computingFormula: '1102',
      isDefault: 'F',
      valid: 1,
    },
  ]

  private readonly callables: OweFeeCallable[] = [
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

  private readonly chargeMachines: ChargeMachine[] = [
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

  private readonly chargeOrders: ChargeMachineOrder[] = [
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
    {
      orderId: 'CHARGE_ORDER_002',
      personName: '李四',
      personTel: '13800138002',
      machineId: 'MACHINE_001',
      machineName: '东门充电桩 1 号',
      machineCode: 'CM-001',
      portCode: 'A02',
      chargeHours: 1,
      durationPrice: 2.5,
      energy: 5.2,
      amount: 2.5,
      startTime: '2026-04-21 09:00:00',
      endTime: '2026-04-21 10:00:00',
      stateName: '已完成',
      remark: '',
    },
  ]

  private readonly chargePorts: ChargeMachinePort[] = [
    {
      portId: 'PORT_001',
      machineId: 'MACHINE_001',
      portName: 'A01 插座',
      portCode: 'A01',
      stateName: '空闲',
    },
    {
      portId: 'PORT_002',
      machineId: 'MACHINE_001',
      portName: 'A02 插座',
      portCode: 'A02',
      stateName: '使用中',
    },
  ]

  private readonly openDoorLogs: OpenDoorLog[] = [
    {
      logId: 'OPEN_LOG_001',
      roomId: 'ROOM_001',
      roomName: '1栋101室',
      ownerName: '张三',
      openType: 'FACE',
      openTypeName: '人脸开门',
      openTime: '2026-04-20 08:30:00',
      remark: '东门门禁',
    },
    {
      logId: 'OPEN_LOG_002',
      roomId: 'ROOM_002',
      roomName: '2栋202室',
      ownerName: '李四',
      openType: 'CARD',
      openTypeName: '门禁卡',
      openTime: '2026-04-20 09:10:00',
      remark: '单元门',
    },
  ]

  constructor() {
    this.initMoreData()
  }

  getFeeList(params: FeeListParams): FeeListResponse {
    let filteredData = [...this.fees]

    if (params.communityId) {
      filteredData = filteredData.filter(item => item.communityId === params.communityId)
    }

    const roomId = params.roomId || params.payerObjId
    if (roomId) {
      filteredData = filteredData.filter(item => item.roomId === roomId)
    }

    if (params.feeId) {
      filteredData = filteredData.filter(item => item.feeId === params.feeId)
    }

    if (params.ownerName) {
      filteredData = filteredData.filter(item => item.ownerName.includes(`${params.ownerName}`))
    }

    if (params.state) {
      filteredData = filteredData.filter(item => item.state === params.state)
    }

    const page = params.page || 1
    const row = params.row || 10

    return cloneValue({
      ...paginate(filteredData, page, row),
      row,
    })
  }

  getFeeDetailList(params: FeeDetailParams): FeeDetailResponse {
    let filteredData = [...this.feeDetails]

    if (params.communityId) {
      filteredData = filteredData.filter(item => item.communityId === params.communityId)
    }

    if (params.feeId) {
      filteredData = filteredData.filter(item => item.feeId === params.feeId)
    }

    const start = (params.page - 1) * params.row
    const end = start + params.row

    return cloneValue({
      list: filteredData.slice(start, end),
    })
  }

  getOweFees(params: OweFeeParams): OweFeeListResponse {
    let data = this.fees
      .filter(item => item.oweAmount > 0)
      .map(item => toOweFee(item))

    if (params.communityId) {
      data = data.filter(item => item.communityId === params.communityId)
    }

    if (params.roomId) {
      data = data.filter(item => item.roomId === params.roomId)
    }

    const page = params.page || 1
    const row = params.row || 10
    const sliced = paginate(data, page, row)

    return cloneValue({
      data: sliced.list,
      totalAmount: data.reduce((sum, item) => sum + item.totalAmount, 0),
      total: data.length,
      page,
      row,
    })
  }

  getOweFeeCallableList(params: { communityId: string, page: number, payerObjId?: string, row: number }) {
    let data = [...this.callables]

    if (params.payerObjId) {
      data = data.filter(item => item.feeId === params.payerObjId || item.feeId === 'FEE_001')
    }

    return cloneValue({
      list: paginate(data, params.page, params.row).list,
    })
  }

  writeOweFeeCallable(params: Record<string, any>) {
    this.callables.unshift({
      feeId: String(params.feeIds?.[0] || 'FEE_001'),
      feeName: '物业管理费',
      ownerName: '张三',
      staffName: '当前员工',
      amountdOwed: 240,
      callableWayName: '人工登记',
      startTime: '2026-04-01',
      endTime: '2026-04-30',
      remark: String(params.remark || '已登记催缴'),
      createTime: '2026-04-24 10:00:00',
    })

    return {
      code: 0,
      msg: '登记成功',
    }
  }

  saveRoomCreateFee(params: Record<string, any>) {
    const newFeeId = `FEE_${String(this.fees.length + 1).padStart(3, '0')}`
    this.fees.unshift({
      feeId: newFeeId,
      feeName: this.feeConfigs.find(item => item.configId === params.configId)?.feeName || '新增费用',
      feeType: 'OTHER',
      feeTypeCdName: '其他费用',
      roomId: String(params.locationObjId || 'ROOM_001'),
      roomName: String(params.locationObjId || 'ROOM_001'),
      communityId: String(params.communityId || 'COMM_001'),
      ownerName: '模拟业主',
      ownerTel: '13800138999',
      receivedAmount: Number(params.amount || 100),
      paidAmount: 0,
      oweAmount: Number(params.amount || 100),
      startTime: String(params.startTime || '2026-04-01'),
      endTime: String(params.endTime || '2026-04-30'),
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

  createNativeQrcodePayment(params: { business?: string, communityId: string, feeIds?: string[], roomId: string }) {
    const feeIds = params.feeIds?.filter(Boolean).join(',') || 'FEE_001'
    const codeUrl = `mock-payment://pay?roomId=${params.roomId}&communityId=${params.communityId}&feeIds=${feeIds}&business=${params.business || 'oweFee'}`

    return {
      code: 0,
      msg: '生成二维码成功',
      data: {
        codeUrl,
      },
    }
  }

  getChargeMachineList(params: { communityId: string, machineId?: string, machineNameLike?: string, page: number, row: number }) {
    let data = this.chargeMachines.filter(item => item.communityId === params.communityId)

    if (params.machineId) {
      data = data.filter(item => item.machineId === params.machineId)
    }

    if (params.machineNameLike) {
      data = data.filter(item => item.machineName.includes(`${params.machineNameLike}`))
    }

    return cloneValue({
      list: paginate(data, params.page, params.row).list,
    })
  }

  getChargeMachineOrderList(params: { communityId: string, machineId?: string, page: number, row: number }) {
    let data = [...this.chargeOrders]

    if (params.machineId) {
      data = data.filter(item => item.machineId === params.machineId)
    }

    return cloneValue({
      list: paginate(data, params.page, params.row).list,
    })
  }

  getChargeMachinePortList(params: { communityId: string, machineId: string, page: number, row: number }) {
    const data = this.chargePorts.filter(item => item.machineId === params.machineId)

    return cloneValue({
      list: paginate(data, params.page, params.row).list,
    })
  }

  getFeeSummaryReport(params: { communityId: string, feeTypeCd?: string, floorId?: string, page: number, row: number }) {
    const feeRoomCount = new Set(this.fees.map(item => item.roomId)).size
    const oweFees = this.fees.filter(item => item.oweAmount > 0)

    return cloneValue({
      list: [{
        feeRoomCount,
        oweRoomCount: new Set(oweFees.map(item => item.roomId)).size,
        curOweFee: oweFees.reduce((sum, item) => sum + item.oweAmount, 0),
        hisOweFee: 320,
        receivedFee: this.fees.reduce((sum, item) => sum + item.paidAmount, 0),
        curReceivableFee: this.fees.reduce((sum, item) => sum + item.receivedAmount, 0),
        hisReceivedFee: 960,
        roomCount: feeRoomCount,
      }],
    })
  }

  getPayFeeDetailReport(params: { communityId: string, feeTypeCd?: string, floorId?: string, page: number, roomId?: string, row: number }) {
    let data: PayFeeDetailReportItem[] = this.feeDetails.map(item => ({
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

    if (params.roomId) {
      data = data.filter(item => item.roomId === params.roomId)
    }

    const result = paginate(data, params.page, params.row)

    return cloneValue({
      list: result.list,
      total: result.total,
    })
  }

  getRoomFeeReport(params: { communityId: string, feeTypeCd?: string, floorId?: string, page: number, roomId?: string, row: number }) {
    let data = this.fees.map(item => ({
      roomId: item.roomId,
      roomName: item.roomName,
      ownerName: item.ownerName,
      feeName: item.feeName,
      receivableFee: item.receivedAmount,
      receivedFee: item.paidAmount,
      oweFee: item.oweAmount,
      stateName: item.stateName,
    }))

    if (params.roomId) {
      data = data.filter(item => item.roomId === params.roomId)
    }

    const result = paginate(data, params.page, params.row)

    return cloneValue({
      list: result.list,
      total: result.total,
    })
  }

  getDataReport(params: { communityId: string, reportCode: string }) {
    return cloneValue({
      list: [
        { name: '本月应收', value: this.fees.reduce((sum, item) => sum + item.receivedAmount, 0), unit: '元' },
        { name: '本月实收', value: this.fees.reduce((sum, item) => sum + item.paidAmount, 0), unit: '元' },
        { name: '欠费房屋', value: this.fees.filter(item => item.oweAmount > 0).length, unit: '户' },
      ],
    })
  }

  getOpenDoorLogList(params: { communityId: string, page: number, row: number }) {
    const result = paginate(this.openDoorLogs, params.page, params.row)

    return cloneValue({
      list: result.list,
      total: result.total,
    })
  }

  getFeeConfigList(params: { communityId: string, feeTypeCd?: string, isDefault?: string, page: number, row: number, valid?: number }) {
    let data = [...this.feeConfigs]

    if (params.feeTypeCd) {
      data = data.filter(item => item.feeTypeCd === params.feeTypeCd)
    }

    if (params.isDefault) {
      data = data.filter(item => item.isDefault === params.isDefault)
    }

    if (params.valid !== undefined) {
      data = data.filter(item => item.valid === params.valid)
    }

    return cloneValue(paginate(data, params.page, params.row).list)
  }

  /** 初始化更多费用明细。 */
  private initMoreData() {
    if (this.feeDetails.length < 200) {
      const additionalData = Array.from({ length: 194 }, (_, index) => {
        const roomId = `ROOM_${(index % 10) + 1}`
        const roomName = `${(index % 20) + 1}栋${String((index % 30) + 1).padStart(2, '0')}${String.fromCharCode(65 + (index % 8))}室`
        const ownerName = `业主${(index % 50) + 1}`
        const feeId = `FEE_${(index % 10) + 1}`

        return this.createMockFeeDetail(feeId, roomId, roomName, ownerName)
      })

      this.feeDetails.push(...additionalData)
    }
  }

  /** 生成模拟费用明细。 */
  private createMockFeeDetail(feeId: string, roomId: string, roomName: string, ownerName: string): FeeDetail {
    const feeNameItem = FEE_NAME_OPTIONS[Math.floor(Math.random() * FEE_NAME_OPTIONS.length)]
    const payMethodItem = FEE_PAY_METHOD_OPTIONS[Math.floor(Math.random() * FEE_PAY_METHOD_OPTIONS.length)]

    return {
      detailId: generateId('FEE_DETAIL'),
      feeId,
      feeName: `${feeNameItem.value}`,
      roomId,
      roomName,
      communityId: 'COMM_001',
      ownerName,
      receivedAmount: Math.floor(Math.random() * 500 + 50),
      payTime: generateTimeRange(-90, 0),
      payMethod: `${payMethodItem.value}`,
      payState: 'PAID',
      createTime: generateTimeRange(-90, 0),
    }
  }
}

/** 默认供运行时直接复用的 fee 仓储实例。 */
export const feeMockRepository = createFeeMockRepository()

/** 克隆仓储返回值，避免外部篡改内部引用。 */
function cloneValue<T>(value: T): T {
  return structuredClone(value)
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
