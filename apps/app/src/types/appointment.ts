/**
 * 预约核销模块类型定义
 */

/** 预约核销订单 */
export interface AppointmentOrder {
  orderId: string
  timeId: string
  spaceName: string
  appointmentDate: string
  hours: string
  personName: string
  personTel: string
  createTime?: string
  state: 'WAIT_CONFIRM' | 'CONFIRMED'
}

/** 预约核销列表查询参数 */
export interface AppointmentOrderQueryParams {
  page: number
  row: number
  communityId: string
  timeId?: string
}
