import type { ColumnItem } from 'wot-design-uni/components/wd-picker-view/types'

/** 维修状态配置（旧版 statusCd/name） */
export const REPAIR_STATUSES: ColumnItem[] = [
  { value: '10001', label: '待派单' },
  { value: '10002', label: '已派单' },
  { value: '10003', label: '处理中' },
  { value: '10004', label: '已完成' },
  { value: '10005', label: '已取消' },
  { value: '10006', label: '暂停' },
]

/** 维修流程状态（英文状态值） */
export const REPAIR_FLOW_STATUS_OPTIONS: ColumnItem[] = [
  { value: 'PENDING', label: '待派单' },
  { value: 'ASSIGNED', label: '已派单' },
  { value: 'IN_PROGRESS', label: '处理中' },
  { value: 'COMPLETED', label: '已完成' },
  { value: 'CANCELLED', label: '已取消' },
]

/** 维修类型（代码 + 名称） */
export const REPAIR_TYPE_OPTIONS: ColumnItem[] = [
  { value: '1001', label: '水电维修' },
  { value: '1002', label: '门窗维修' },
  { value: '1003', label: '空调维修' },
  { value: '1004', label: '电梯维修' },
  { value: '1005', label: '管道疏通' },
  { value: '1006', label: '墙面修补' },
  { value: '1007', label: '其他维修' },
]

/** 维修类型（仅名称，用于旧版 name 字段） */
export const REPAIR_TYPE_NAME_OPTIONS: ColumnItem[] = [
  { value: '水电维修', label: '水电维修' },
  { value: '门窗维修', label: '门窗维修' },
  { value: '空调维修', label: '空调维修' },
  { value: '电梯维修', label: '电梯维修' },
  { value: '管道疏通', label: '管道疏通' },
  { value: '墙面修补', label: '墙面修补' },
  { value: '其他维修', label: '其他维修' },
]

/** 维修支付方式 */
export const REPAIR_PAY_TYPE_OPTIONS: ColumnItem[] = [
  { value: 'CASH', label: '现金' },
  { value: 'WECHAT', label: '微信支付' },
  { value: 'ALIPAY', label: '支付宝' },
  { value: 'BANK_CARD', label: '银行卡' },
  { value: 'PROPERTY_FEE', label: '物业费抵扣' },
]

/** 维修物资类型 */
export const REPAIR_RESOURCE_TYPE_OPTIONS: ColumnItem[] = [
  { value: 'RST_001', label: '水电材料' },
  { value: 'RST_002', label: '五金材料' },
  { value: 'RST_003', label: '空调材料' },
  { value: 'RST_004', label: '装修材料' },
]
