/**
 * 费用模块 API 接口定义
 * 对应业务：费用管理、充值管理、报表统计
 */

import type {
  FeeDetailParams,
  FeeDetailResponse,
  FeeListParams,
  FeeListResponse,
  OweFeeListResponse,
  OweFeeParams,
} from '@/types/fee'
import { http } from '@/http/alova'

/** ==================== 费用查询接口 ==================== */

/** 1. 查询费用列表 */
export function getFeeList(params: FeeListParams) {
  return http.Get<FeeListResponse>('/app/fee.listFee', { params })
}

/** 2. 查询费用详情 */
export function getFeeDetail(params: FeeDetailParams) {
  return http.Get<FeeDetailResponse>('/app/fee.queryFeeDetail', { params })
}

/** 3. 查询缴费历史 */
export function listFeeDetails(params: FeeDetailParams) {
  return http.Get<FeeDetailResponse>('/app/fee.queryFeeDetail', { params })
}

/** 4. 查询欠费信息 */
export function getRoomOweFees(params: OweFeeParams) {
  return http.Get<OweFeeListResponse>('/app/feeApi/listOweFees', { params })
}

/** ==================== 费用创建接口 ==================== */

/** 5. 创建费用 */
export function saveRoomCreateFee(data: {
  locationTypeCd: string
  locationObjId: string
  feeTypeCd: string
  configId: string
  startTime: string
  feeFlag: string
  endTime: string
  computingFormula: string
  amount?: string
  rateCycle?: string
  rate?: string
  rateStartTime?: string
  communityId: string
}) {
  return http.Post<{
    success: boolean
    totalRoom: number
    successRoom: number
    errorRoom: number
    msg?: string
  }>('/app/fee.saveRoomCreateFee', data)
}

/** ==================== 支付接口 ==================== */

/** 6. 生成二维码支付 */
export function toPayOweFee(data: {
  roomId: string
  communityId: string
  business: string
  feeIds: string[]
}) {
  return http.Post<{
    code: number
    msg: string
    data: {
      codeUrl: string
    }
  }>('/app/payment.nativeQrcodePayment', data)
}

/** ==================== 欠费催缴接口 ==================== */

/** 7. 查询欠费催缴列表 */
export function queryOweFeeCallable(params: {
  page: number
  row: number
  communityId: string
  payerObjId?: string
}) {
  return http.Get<{
    list: Array<{
      feeId: string
      feeName: string
      ownerName: string
      staffName: string
      amountdOwed: number
      callableWayName: string
      startTime: string
      endTime: string
      remark: string
      createTime: string
    }>
  }>('/app/oweFeeCallable.listOweFeeCallable', { params })
}

/** 8. 填写欠费催缴 */
export function writeOweFeeCallable(data: {
  communityId: string
  feeIds: string[]
  remark: string
  roomId: string
  roomName: string
}) {
  return http.Post<{
    code: number
    msg: string
  }>('/app/oweFeeCallable.writeOweFeeCallable', data)
}

/** ==================== 充电桩接口 ==================== */

/** 9. 查询充电桩列表 */
export function getChargeMachineList(params: {
  page: number
  row: number
  communityId: string
  machineNameLike?: string
  machineId?: string
}) {
  return http.Get<{
    list: Array<{
      machineId: string
      machineName: string
      machineCode: string
      photoUrl: string
      communityId: string
      factoryName: string
      ruleName: string
      chargeTypeName: string
      stateName: string
      state: string
    }>
  }>('/app/iot/listChargeMachineBmoImpl', { params })
}

/** 10. 查询充电桩订单列表 */
export function getChargeMachineOrderList(params: {
  page: number
  row: number
  communityId: string
  machineId?: string
}) {
  return http.Get<{
    list: Array<{
      orderId: string
      personName: string
      personTel: string
      machineName: string
      machineCode: string
      portCode: string
      chargeHours: number
      durationPrice: number
      energy: number
      amount: number
      startTime: string
      endTime: string
      stateName: string
      remark: string
    }>
  }>('/app/iot/listChargeMachineOrderBmoImpl', { params })
}

/** 11. 查询充电桩插座列表 */
export function getChargeMachinePortList(params: {
  page: number
  row: number
  communityId: string
  machineId: string
}) {
  return http.Get<{
    list: Array<{
      portId: string
      portName: string
      portCode: string
      stateName: string
    }>
  }>('/app/iot/listChargeMachinePortBmoImpl', { params })
}

/** ==================== 报表接口 ==================== */

/** 12. 查询费用汇总报表 */
export function getFeeSummaryReport(params: {
  page: number
  row: number
  communityId: string
  startDate?: string
  endDate?: string
  feeTypeCd?: string
  floorId?: string
}) {
  return http.Get<{
    list: Array<{
      feeRoomCount: number
      oweRoomCount: number
      curOweFee: number
      hisOweFee: number
      receivedFee: number
      curReceivableFee: number
      hisReceivedFee: number
      roomCount: number
    }>
  }>('/app/reportFeeMonthStatistics.queryReportFeeSummary', { params })
}

/** 13. 查询缴费明细报表 */
export function getPayFeeDetailReport(params: {
  page: number
  row: number
  communityId: string
  startDate?: string
  endDate?: string
  feeTypeCd?: string
  floorId?: string
  roomId?: string
}) {
  return http.Get<{
    list: Array<{
      feeId: string
      feeName: string
      roomId: string
      roomName: string
      ownerName: string
      receivedAmount: number
      payTime: string
      payMethod: string
      stateName: string
    }>
    total: number
  }>('/app/reportFeeMonthStatistics/queryPayFeeDetail', { params })
}

/** 14. 查询房间费用报表 */
export function getRoomFeeReport(params: {
  page: number
  row: number
  communityId: string
  startDate?: string
  endDate?: string
  feeTypeCd?: string
  floorId?: string
  roomId?: string
}) {
  return http.Get<{
    list: Array<{
      roomId: string
      roomName: string
      ownerName: string
      feeName: string
      receivableFee: number
      receivedFee: number
      oweFee: number
      stateName: string
    }>
    total: number
  }>('/app/reportFeeMonthStatistics.queryReportFeeDetailRoom', { params })
}

/** 15. 查询数据报表 */
export function getDataReport(params: {
  communityId: string
  reportCode: string
  startDate?: string
  endDate?: string
}) {
  return http.Get<{
    list: Array<{
      name: string
      value: number
      unit?: string
    }>
  }>('/app/dataReport.queryFeeDataReport', { params })
}

/** ==================== 开门记录接口 ==================== */

/** 16. 查询开门记录 */
export function getOpenDoorLogList(params: {
  page: number
  row: number
  communityId: string
  startDate?: string
  endDate?: string
}) {
  return http.Get<{
    list: Array<{
      logId: string
      roomId: string
      roomName: string
      ownerName: string
      openType: string
      openTypeName: string
      openTime: string
      remark: string
    }>
    total: number
  }>('/app/machine/listMachineRecords', { params })
}

/** ==================== 字典查询接口 ==================== */

/** 17. 查询字典数据（费用类型等） */
export function queryDictInfo(params: {
  name: string
  type?: string
}) {
  return http.Get<Array<{
    statusCd: string
    name: string
  }>>('/callComponent/core/list', { params })
}

/** 18. 查询费用配置项 */
export function queryFeeConfigs(params: {
  page: number
  row: number
  communityId: string
  feeTypeCd: string
  isDefault?: string
  valid?: number
}) {
  return http.Get<Array<{
    configId: string
    feeName: string
    feeFlag: string
    computingFormula: string
  }>>('/app/feeConfig.listFeeConfigs', { params })
}
