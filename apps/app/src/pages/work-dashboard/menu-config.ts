export type WorkbenchNavigationKey
  = | 'toActivityList'
    | 'toAllocationAudit'
    | 'toAllocationManage'
    | 'toAppointment'
    | 'toApplyRoomList'
    | 'toBarrierGate'
    | 'toChargeMachineOrder'
    | 'toComplaintFinish'
    | 'toComplaintList'
    | 'toComplaintOrder'
    | 'toDataReport'
    | 'toFeeRoomPay'
    | 'toFeeSummary'
    | 'toInspectionTaskList'
    | 'toItemOutAudit'
    | 'toItemOutManage'
    | 'toItemRelease'
    | 'toMaintenanceTaskList'
    | 'toMeterReading'
    | 'toNoticeList'
    | 'toOaWorkflow'
    | 'toOpenDoorLog'
    | 'toOwnerCar'
    | 'toOwnerList'
    | 'toPayFeeDetail'
    | 'toPropertyRenovation'
    | 'toPurchaseApplyAudit'
    | 'toPurchaseApplyManage'
    | 'toRepairDispatch'
    | 'toRepairFinish'
    | 'toRepairList'
    | 'toResourceStoreManage'
    | 'toRoomFeeReport'
    | 'toVisitList'
    | 'toWorkCopy'
    | 'toWorkDo'
    | 'toWorkStart'
    | 'toWriteOffCoupon'
    | 'toWriteOffReserve'
    | 'toAddRepair'

/** 功能菜单项 */
export interface WorkbenchMenu {
  id: string
  name: string
  icon: string
  iconClass: string
  bgClass: string
  navigationKey: WorkbenchNavigationKey
  badge?: number
}

/** 功能分类 */
export interface WorkbenchCategory {
  title: string
  icon: string
  iconClass: string
  menus: WorkbenchMenu[]
}

/** 工作台功能分类配置 */
export const workbenchCategories: WorkbenchCategory[] = [
  {
    title: '常用功能',
    icon: 'i-carbon-star-filled',
    iconClass: 'text-colorui-orange',
    menus: [
      { id: 'complaint-todo', name: '投诉待办', icon: 'i-carbon-warning-alt', iconClass: 'text-colorui-red', bgClass: 'bg-colorui-red/10', navigationKey: 'toComplaintList' },
      { id: 'repair-dispatch-quick', name: '报修待办', icon: 'i-carbon-tools', iconClass: 'text-colorui-blue', bgClass: 'bg-colorui-blue/10', navigationKey: 'toRepairDispatch' },
      { id: 'inspection-task', name: '巡检打卡', icon: 'i-carbon-location', iconClass: 'text-colorui-green', bgClass: 'bg-colorui-green/10', navigationKey: 'toInspectionTaskList' },
      { id: 'maintenance-task', name: '设备保养', icon: 'i-carbon-settings', iconClass: 'text-colorui-orange', bgClass: 'bg-colorui-orange/10', navigationKey: 'toMaintenanceTaskList' },
      { id: 'notice-list', name: '公告通知', icon: 'i-carbon-notification', iconClass: 'text-colorui-purple', bgClass: 'bg-colorui-purple/10', navigationKey: 'toNoticeList' },
      { id: 'activity-list', name: '社区活动', icon: 'i-carbon-calendar-heat-map', iconClass: 'text-colorui-cyan', bgClass: 'bg-colorui-cyan/10', navigationKey: 'toActivityList' },
    ],
  },
  {
    title: '维修报修',
    icon: 'i-carbon-tools',
    iconClass: 'text-colorui-blue',
    menus: [
      { id: 'repair-order', name: '维修工单池', icon: 'i-carbon-document', iconClass: 'text-colorui-orange', bgClass: 'bg-colorui-orange/10', navigationKey: 'toRepairList' },
      { id: 'repair-add', name: '添加维修', icon: 'i-carbon-document-add', iconClass: 'text-colorui-cyan', bgClass: 'bg-colorui-cyan/10', navigationKey: 'toAddRepair' },
      { id: 'repair-dispatch', name: '维修待办单', icon: 'i-carbon-tools', iconClass: 'text-colorui-blue', bgClass: 'bg-colorui-blue/10', navigationKey: 'toRepairDispatch' },
      { id: 'repair-finish', name: '维修已办', icon: 'i-carbon-task-complete', iconClass: 'text-colorui-green', bgClass: 'bg-colorui-green/10', navigationKey: 'toRepairFinish' },
    ],
  },
  {
    title: '投诉业务',
    icon: 'i-carbon-chat',
    iconClass: 'text-colorui-red',
    menus: [
      { id: 'complaint-list', name: '投诉待办', icon: 'i-carbon-warning-alt', iconClass: 'text-colorui-red', bgClass: 'bg-colorui-red/10', navigationKey: 'toComplaintList' },
      { id: 'complaint-order', name: '投诉录单', icon: 'i-carbon-edit', iconClass: 'text-colorui-orange', bgClass: 'bg-colorui-orange/10', navigationKey: 'toComplaintOrder' },
      { id: 'complaint-finish', name: '投诉已办', icon: 'i-carbon-checkmark-outline', iconClass: 'text-colorui-green', bgClass: 'bg-colorui-green/10', navigationKey: 'toComplaintFinish' },
    ],
  },
  {
    title: '工单业务',
    icon: 'i-carbon-document',
    iconClass: 'text-colorui-cyan',
    menus: [
      { id: 'work-start', name: '发工作单', icon: 'i-carbon-document-add', iconClass: 'text-colorui-blue', bgClass: 'bg-colorui-blue/10', navigationKey: 'toWorkStart' },
      { id: 'work-do', name: '办工作单', icon: 'i-carbon-task', iconClass: 'text-colorui-green', bgClass: 'bg-colorui-green/10', navigationKey: 'toWorkDo' },
      { id: 'work-copy', name: '抄送工作单', icon: 'i-carbon-send-alt', iconClass: 'text-colorui-cyan', bgClass: 'bg-colorui-cyan/10', navigationKey: 'toWorkCopy' },
      { id: 'oa-workflow', name: 'OA流程', icon: 'i-carbon-flow', iconClass: 'text-colorui-purple', bgClass: 'bg-colorui-purple/10', navigationKey: 'toOaWorkflow' },
    ],
  },
  {
    title: '资源管理',
    icon: 'i-carbon-cube',
    iconClass: 'text-colorui-green',
    menus: [
      { id: 'purchase-manage', name: '采购管理', icon: 'i-carbon-shopping-cart', iconClass: 'text-colorui-blue', bgClass: 'bg-colorui-blue/10', navigationKey: 'toPurchaseApplyManage' },
      { id: 'purchase-audit', name: '采购待办', icon: 'i-carbon-task-approval', iconClass: 'text-colorui-orange', bgClass: 'bg-colorui-orange/10', navigationKey: 'toPurchaseApplyAudit' },
      { id: 'item-out-manage', name: '领用管理', icon: 'i-carbon-delivery', iconClass: 'text-colorui-green', bgClass: 'bg-colorui-green/10', navigationKey: 'toItemOutManage' },
      { id: 'item-out-audit', name: '领用待办', icon: 'i-carbon-task-approved', iconClass: 'text-colorui-cyan', bgClass: 'bg-colorui-cyan/10', navigationKey: 'toItemOutAudit' },
      { id: 'allocation-manage', name: '调拨管理', icon: 'i-carbon-arrows-horizontal', iconClass: 'text-colorui-purple', bgClass: 'bg-colorui-purple/10', navigationKey: 'toAllocationManage' },
      { id: 'allocation-audit', name: '调拨待办', icon: 'i-carbon-arrows-vertical', iconClass: 'text-colorui-orange', bgClass: 'bg-colorui-orange/10', navigationKey: 'toAllocationAudit' },
      { id: 'resource-store', name: '我的物品', icon: 'i-carbon-box', iconClass: 'text-colorui-blue', bgClass: 'bg-colorui-blue/10', navigationKey: 'toResourceStoreManage' },
    ],
  },
  {
    title: '物业服务',
    icon: 'i-carbon-home',
    iconClass: 'text-colorui-purple',
    menus: [
      { id: 'apply-room', name: '空置房管理', icon: 'i-carbon-building-insights-3', iconClass: 'text-colorui-cyan', bgClass: 'bg-colorui-cyan/10', navigationKey: 'toApplyRoomList' },
      { id: 'renovation', name: '装修管理', icon: 'i-carbon-paint-brush', iconClass: 'text-colorui-orange', bgClass: 'bg-colorui-orange/10', navigationKey: 'toPropertyRenovation' },
      { id: 'fee-room-pay', name: '收银台', icon: 'i-carbon-currency', iconClass: 'text-colorui-green', bgClass: 'bg-colorui-green/10', navigationKey: 'toFeeRoomPay' },
      { id: 'meter-reading', name: '抄表管理', icon: 'i-carbon-meter', iconClass: 'text-colorui-blue', bgClass: 'bg-colorui-blue/10', navigationKey: 'toMeterReading' },
      { id: 'owner-list', name: '业主管理', icon: 'i-carbon-user-multiple', iconClass: 'text-colorui-purple', bgClass: 'bg-colorui-purple/10', navigationKey: 'toOwnerList' },
    ],
  },
  {
    title: '停车业务',
    icon: 'i-carbon-car',
    iconClass: 'text-colorui-blue',
    menus: [
      { id: 'owner-car', name: '业主车辆', icon: 'i-carbon-car', iconClass: 'text-colorui-blue', bgClass: 'bg-colorui-blue/10', navigationKey: 'toOwnerCar' },
      { id: 'barrier-gate', name: '道闸管理', icon: 'i-carbon-gate', iconClass: 'text-colorui-orange', bgClass: 'bg-colorui-orange/10', navigationKey: 'toBarrierGate' },
    ],
  },
  {
    title: '核销业务',
    icon: 'i-carbon-checkmark-outline',
    iconClass: 'text-colorui-red',
    menus: [
      { id: 'appointment-index', name: '预约管理', icon: 'i-carbon-calendar', iconClass: 'text-colorui-green', bgClass: 'bg-colorui-green/10', navigationKey: 'toAppointment' },
      { id: 'coupon', name: '核销优惠券', icon: 'i-carbon-ticket', iconClass: 'text-colorui-red', bgClass: 'bg-colorui-red/10', navigationKey: 'toWriteOffCoupon' },
      { id: 'write-off-reserve', name: '核销预约', icon: 'i-carbon-calendar-settings', iconClass: 'text-colorui-orange', bgClass: 'bg-colorui-orange/10', navigationKey: 'toWriteOffReserve' },
    ],
  },
  {
    title: '访客放行',
    icon: 'i-carbon-user-avatar',
    iconClass: 'text-colorui-cyan',
    menus: [
      { id: 'visit', name: '访客管理', icon: 'i-carbon-user-avatar', iconClass: 'text-colorui-blue', bgClass: 'bg-colorui-blue/10', navigationKey: 'toVisitList' },
      { id: 'release', name: '物品放行', icon: 'i-carbon-package', iconClass: 'text-colorui-orange', bgClass: 'bg-colorui-orange/10', navigationKey: 'toItemRelease' },
    ],
  },
  {
    title: '报表统计',
    icon: 'i-carbon-chart-bar',
    iconClass: 'text-colorui-orange',
    menus: [
      { id: 'data-report', name: '数据统计', icon: 'i-carbon-chart-bar', iconClass: 'text-colorui-blue', bgClass: 'bg-colorui-blue/10', navigationKey: 'toDataReport' },
      { id: 'pay-fee-detail', name: '缴费明细', icon: 'i-carbon-receipt', iconClass: 'text-colorui-green', bgClass: 'bg-colorui-green/10', navigationKey: 'toPayFeeDetail' },
      { id: 'room-fee-report', name: '房屋费用', icon: 'i-carbon-home', iconClass: 'text-colorui-cyan', bgClass: 'bg-colorui-cyan/10', navigationKey: 'toRoomFeeReport' },
      { id: 'fee-summary', name: '费用汇总', icon: 'i-carbon-report', iconClass: 'text-colorui-orange', bgClass: 'bg-colorui-orange/10', navigationKey: 'toFeeSummary' },
      { id: 'open-door-log', name: '开门记录', icon: 'i-carbon-door-open', iconClass: 'text-colorui-purple', bgClass: 'bg-colorui-purple/10', navigationKey: 'toOpenDoorLog' },
      { id: 'charge-machine-order', name: '充电订单', icon: 'i-carbon-battery-charging', iconClass: 'text-colorui-red', bgClass: 'bg-colorui-red/10', navigationKey: 'toChargeMachineOrder' },
    ],
  },
]
