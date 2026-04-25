/**
 * 访客模块类型定义
 */

/** 访客记录 */
export interface VisitRecord {
  visitId: string
  name: string
  phoneNumber: string
  ownerName: string
  roomName: string
  carNum: string
  visitTime: string
  state: '0' | '1' | '2'
  stateName: string
  taskId?: string
}

/** 访客详情 */
export interface VisitDetail extends VisitRecord {
  departureTime: string
  visitCase: string
}

/** 访客审核参数 */
export interface AuditVisitParams {
  visitId: string
  state: '1' | '2'
  msg: string
}
