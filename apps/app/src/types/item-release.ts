/**
 * 物品放行模块类型定义
 */

/** 物品放行任务 */
export interface ItemReleaseTask {
  irId: string
  flowId: string
  taskId?: string
  typeName: string
  stateName: string
  passTime: string
  amount: number
  action: 'Audit' | 'View'
}

/** 物品放行详情 */
export interface ItemReleaseDetail {
  irId: string
  flowId: string
  typeName: string
  applyCompany: string
  applyPerson: string
  applyTel: string
  idCard: string
  carNum: string
  passTime: string
  remark: string
  createUserId: string
}

/** 物品放行明细 */
export interface ItemReleaseResource {
  resId: string
  resName: string
  amount: number
}

/** 审批流转记录 */
export interface ItemReleaseComment {
  staffName: string
  context: string
  endTime?: string
}

/** 物品放行审核参数 */
export interface AuditItemReleaseParams {
  irId: string
  flowId: string
  taskId: string
  auditCode: '1100' | '1200'
  auditMessage: string
}
