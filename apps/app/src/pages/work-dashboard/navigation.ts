import type { WorkbenchNavigationKey } from './menu-config'

export interface WorkbenchNavigationFactory {
  toActivityList: () => unknown
  toAllocationAudit: () => unknown
  toAllocationManage: () => unknown
  toAppointment: () => unknown
  toApplyRoomList: () => unknown
  toBarrierGate: () => unknown
  toChargeMachineOrder: () => unknown
  toComplaintFinish: () => unknown
  toComplaintList: () => unknown
  toComplaintOrder: () => unknown
  toDataReport: () => unknown
  toFeeRoomPay: () => unknown
  toFeeSummary: () => unknown
  toInspectionTaskList: () => unknown
  toItemOutAudit: () => unknown
  toItemOutManage: () => unknown
  toItemRelease: () => unknown
  toMaintenanceTaskList: () => unknown
  toMeterReading: () => unknown
  toNoticeList: () => unknown
  toOaWorkflow: () => unknown
  toOpenDoorLog: () => unknown
  toOwnerCar: () => unknown
  toOwnerList: () => unknown
  toPayFeeDetail: () => unknown
  toPropertyRenovation: () => unknown
  toPurchaseApplyAudit: () => unknown
  toPurchaseApplyManage: () => unknown
  toRepairDispatch: () => unknown
  toRepairFinish: () => unknown
  toRepairList: () => unknown
  toResourceStoreManage: () => unknown
  toRoomFeeReport: () => unknown
  toVisitList: () => unknown
  toWorkCopy: () => unknown
  toWorkDo: () => unknown
  toWorkStart: () => unknown
  toWriteOffCoupon: () => unknown
  toWriteOffReserve: () => unknown
  toAddRepair: () => unknown
}

/** 工作台可用导航键 */
export const workbenchNavigationKeys: WorkbenchNavigationKey[] = [
  'toActivityList',
  'toAllocationAudit',
  'toAllocationManage',
  'toAppointment',
  'toApplyRoomList',
  'toBarrierGate',
  'toChargeMachineOrder',
  'toComplaintFinish',
  'toComplaintList',
  'toComplaintOrder',
  'toDataReport',
  'toFeeRoomPay',
  'toFeeSummary',
  'toInspectionTaskList',
  'toItemOutAudit',
  'toItemOutManage',
  'toItemRelease',
  'toMaintenanceTaskList',
  'toMeterReading',
  'toNoticeList',
  'toOaWorkflow',
  'toOpenDoorLog',
  'toOwnerCar',
  'toOwnerList',
  'toPayFeeDetail',
  'toPropertyRenovation',
  'toPurchaseApplyAudit',
  'toPurchaseApplyManage',
  'toRepairDispatch',
  'toRepairFinish',
  'toRepairList',
  'toResourceStoreManage',
  'toRoomFeeReport',
  'toVisitList',
  'toWorkCopy',
  'toWorkDo',
  'toWorkStart',
  'toWriteOffCoupon',
  'toWriteOffReserve',
  'toAddRepair',
]

/** 创建工作台菜单导航映射 */
export function createWorkbenchMenuNavigators(factory: WorkbenchNavigationFactory): Record<WorkbenchNavigationKey, () => unknown> {
  return {
    toActivityList: factory.toActivityList,
    toAllocationAudit: factory.toAllocationAudit,
    toAllocationManage: factory.toAllocationManage,
    toAppointment: factory.toAppointment,
    toApplyRoomList: factory.toApplyRoomList,
    toBarrierGate: factory.toBarrierGate,
    toChargeMachineOrder: factory.toChargeMachineOrder,
    toComplaintFinish: factory.toComplaintFinish,
    toComplaintList: factory.toComplaintList,
    toComplaintOrder: factory.toComplaintOrder,
    toDataReport: factory.toDataReport,
    toFeeRoomPay: factory.toFeeRoomPay,
    toFeeSummary: factory.toFeeSummary,
    toInspectionTaskList: factory.toInspectionTaskList,
    toItemOutAudit: factory.toItemOutAudit,
    toItemOutManage: factory.toItemOutManage,
    toItemRelease: factory.toItemRelease,
    toMaintenanceTaskList: factory.toMaintenanceTaskList,
    toMeterReading: factory.toMeterReading,
    toNoticeList: factory.toNoticeList,
    toOaWorkflow: factory.toOaWorkflow,
    toOpenDoorLog: factory.toOpenDoorLog,
    toOwnerCar: factory.toOwnerCar,
    toOwnerList: factory.toOwnerList,
    toPayFeeDetail: factory.toPayFeeDetail,
    toPropertyRenovation: factory.toPropertyRenovation,
    toPurchaseApplyAudit: factory.toPurchaseApplyAudit,
    toPurchaseApplyManage: factory.toPurchaseApplyManage,
    toRepairDispatch: factory.toRepairDispatch,
    toRepairFinish: factory.toRepairFinish,
    toRepairList: factory.toRepairList,
    toResourceStoreManage: factory.toResourceStoreManage,
    toRoomFeeReport: factory.toRoomFeeReport,
    toVisitList: factory.toVisitList,
    toWorkCopy: factory.toWorkCopy,
    toWorkDo: factory.toWorkDo,
    toWorkStart: factory.toWorkStart,
    toWriteOffCoupon: factory.toWriteOffCoupon,
    toWriteOffReserve: factory.toWriteOffReserve,
    toAddRepair: factory.toAddRepair,
  }
}
