/**
 * 路由辅助函数和类型安全的路由跳转工具
 */

import type { PageParams, PageRoute, TabRoute } from '@/types/routes'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

/** 类型安全的路由跳转函数 */
export function navigateToTyped<T extends keyof PageParams>(
  url: T,
  params?: PageParams[T],
  options?: UniApp.NavigateToOptions,
) {
  const toast = useGlobalToast()
  let fullUrl: string = url
  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams(params as any).toString()
    fullUrl = `${url}?${query}`
  }

  return uni.navigateTo({
    url: fullUrl,
    ...options,
    fail: (err) => {
      console.error('页面跳转失败:', err)
      toast.error('页面跳转失败')
    },
  })
}

/** 类型安全的重定向函数 */
export function redirectToTyped<T extends keyof PageParams>(url: T, params?: PageParams[T]) {
  let fullUrl: string = url
  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams(params as any).toString()
    fullUrl = `${url}?${query}`
  }

  return uni.redirectTo({
    url: fullUrl,
    fail: (err) => {
      console.error('页面重定向失败:', err)
    },
  })
}

/** 类型安全的Tab切换函数 */
export function switchTabTyped(url: TabRoute) {
  return uni.switchTab({
    url,
    fail: (err) => {
      console.error('Tab切换失败:', err)
    },
  })
}

/** 返回上一页或指定页面 */
export function goBack(delta: number = 1) {
  const pages = getCurrentPages()
  if (pages.length > delta) {
    uni.navigateBack({
      delta,
      fail: (err) => {
        console.error('返回失败:', err)
        // 如果返回失败，尝试跳转到首页
        switchTabTyped('/pages/index/index')
      },
    })
  }
  else {
    // 如果没有足够的历史页面，跳转到首页
    switchTabTyped('/pages/index/index')
  }
}

/** 路由工具类 */
export class TypedRouter {
  /** 维修模块导航 (10个页面) */

  /** 跳转到维修工单池 */
  static toRepairList(params?: PageParams['/pages-sub/repair/order-list']) {
    return navigateToTyped('/pages-sub/repair/order-list', params)
  }

  /** 跳转到维修待办单 */
  static toRepairDispatch(params?: PageParams['/pages-sub/repair/dispatch']) {
    return navigateToTyped('/pages-sub/repair/dispatch', params)
  }

  /** 跳转到维修已办 */
  static toRepairFinish(params?: PageParams['/pages-sub/repair/finish']) {
    return navigateToTyped('/pages-sub/repair/finish', params)
  }

  /** 跳转到维修详情 */
  static toRepairDetail(repairId: string, storeId: string) {
    return navigateToTyped('/pages-sub/repair/order-detail', { repairId, storeId })
  }

  /** 跳转到新增维修记录 */
  static toAddRepair(communityId?: string) {
    return navigateToTyped('/pages-sub/repair/add-order', { communityId })
  }

  /** 跳转到订单处理 */
  static toRepairHandle(params: PageParams['/pages-sub/repair/handle']) {
    return navigateToTyped('/pages-sub/repair/handle', params)
  }

  /** 跳转到选择物品 */
  static toSelectResource(feeFlag: string) {
    return navigateToTyped('/pages-sub/repair/select-resource', { feeFlag })
  }

  /** 跳转到结束订单 */
  static toEndRepair(repairId: string, communityId: string) {
    return navigateToTyped('/pages-sub/repair/end-order', { repairId, communityId })
  }

  /** 跳转到回访工单 */
  static toAppraiseRepair(params: PageParams['/pages-sub/repair/appraise']) {
    return navigateToTyped('/pages-sub/repair/appraise', params)
  }

  /** 跳转到回复评价 */
  static toReplyAppraise(ruId: string, repairId: string) {
    return navigateToTyped('/pages-sub/repair/appraise-reply', { ruId, repairId })
  }

  /** 投诉模块导航 */
  static toComplaintList(params?: PageParams['/pages-sub/complaint/list']) {
    return navigateToTyped('/pages-sub/complaint/list', params)
  }

  static toComplaintDetail(complaintId: string) {
    return navigateToTyped('/pages-sub/complaint/detail', { complaintId })
  }

  static toComplaintHandle(complaintId: string) {
    return navigateToTyped('/pages-sub/complaint/handle', { complaintId })
  }

  static toComplaintOrder() {
    return navigateToTyped('/pages-sub/complaint/order', {})
  }

  static toComplaintFinish(params?: PageParams['/pages-sub/complaint/finish']) {
    return navigateToTyped('/pages-sub/complaint/finish', params)
  }

  static toComplaintAppraiseReply(appraiseId: string, communityId: string) {
    return navigateToTyped('/pages-sub/complaint/appraise-reply', { appraiseId, communityId })
  }

  /** 巡检模块导航 (8个页面) */

  /** 跳转到巡检任务列表 */
  static toInspectionTaskList() {
    return navigateToTyped('/pages-sub/inspection/task-list', {})
  }

  /** 跳转到巡检过程页 */
  static toInspectionExecute(taskId: string, inspectionPlanName?: string) {
    return navigateToTyped('/pages-sub/inspection/execute', { taskId, inspectionPlanName })
  }

  /** 跳转到二维码巡检页 */
  static toInspectionExecuteQrcode(inspectionId: string, inspectionName: string, itemId: string) {
    return navigateToTyped('/pages-sub/inspection/execute-qrcode', { inspectionId, inspectionName, itemId })
  }

  /** 跳转到执行单项巡检页 */
  static toInspectionExecuteSingle(params: PageParams['/pages-sub/inspection/execute-single']) {
    return navigateToTyped('/pages-sub/inspection/execute-single', params)
  }

  /** 跳转到补检页 */
  static toInspectionReexamine() {
    return navigateToTyped('/pages-sub/inspection/reexamine', {})
  }

  /** 跳转到任务流转页 */
  static toInspectionTransfer(task: string) {
    return navigateToTyped('/pages-sub/inspection/transfer', { task })
  }

  /** 跳转到员工未巡检详情页 */
  static toInspectionStaffNoTask(staffId: string, staffName: string, queryTime: string) {
    return navigateToTyped('/pages-sub/inspection/staff-no-task', { staffId, staffName, queryTime })
  }

  /** 跳转到今日巡检统计页 */
  static toInspectionTodayReport() {
    return navigateToTyped('/pages-sub/inspection/today-report', {})
  }

  /** 基础页面导航 */
  static toLogin(redirect?: string) {
    return navigateToTyped('/pages/login/login', { redirect })
  }

  static toActivityList() {
    const community = getCurrentCommunity()
    return navigateToTyped('/pages/activity/index', { currentCommunityId: community.communityId })
  }

  static toActivityDetail(activitiesId: string, currentCommunityId: string) {
    return navigateToTyped('/pages/activity/detail', { activitiesId, currentCommunityId })
  }

  static toNoticeList() {
    return navigateToTyped('/pages/notice/index', {})
  }

  /** Tab页面切换 */
  static toHome() {
    return switchTabTyped('/pages/index/index')
  }

  /**
   * 跳转到工作台
   * @description 对应旧代码 gitee-example/pages/index/work.vue
   */
  static toWorkbench() {
    return switchTabTyped('/pages/work-dashboard/index')
  }

  static toAddressList() {
    return switchTabTyped('/pages/address/list')
  }

  static toMe() {
    return switchTabTyped('/pages/me/me')
  }

  /** 物业管理模块导航 */
  static toApplyRoomList() {
    return navigateToTyped('/pages-sub/property/apply-room', {})
  }

  static toApplyRoomDetail(ardId: string, communityId: string) {
    return navigateToTyped('/pages-sub/property/apply-room-detail', { ardId, communityId })
  }

  static toApplyRoomRecord(params: PageParams['/pages-sub/property/apply-room-record']) {
    return navigateToTyped('/pages-sub/property/apply-room-record', params)
  }

  static toApplyRoomRecordHandle(params: PageParams['/pages-sub/property/apply-room-record-handle']) {
    return navigateToTyped('/pages-sub/property/apply-room-record-handle', params)
  }

  static toApplyRoomRecordDetail(params: PageParams['/pages-sub/property/apply-room-record-detail']) {
    return navigateToTyped('/pages-sub/property/apply-room-record-detail', params)
  }

  static toPropertyRenovation() {
    return navigateToTyped('/pages-sub/property/renovation', {})
  }

  static toOwnerList() {
    return navigateToTyped('/pages-sub/property/owner-list', {})
  }

  static toMeterReading() {
    return navigateToTyped('/pages-sub/meter/reading', {})
  }

  static toPurchaseApplyManage() {
    return navigateToTyped('/pages-sub/resource/purchase-apply-manage', {})
  }

  static toPurchaseApplyAudit() {
    return navigateToTyped('/pages-sub/resource/purchase-apply-audit', {})
  }

  static toItemOutManage() {
    return navigateToTyped('/pages-sub/resource/item-out-manage', {})
  }

  static toItemOutAudit() {
    return navigateToTyped('/pages-sub/resource/item-out-audit', {})
  }

  static toAllocationManage() {
    return navigateToTyped('/pages-sub/resource/allocation-manage', {})
  }

  static toAllocationAudit() {
    return navigateToTyped('/pages-sub/resource/allocation-audit', {})
  }

  static toResourceStoreManage() {
    return navigateToTyped('/pages-sub/resource/store-manage', {})
  }

  static toOwnerCar() {
    return navigateToTyped('/pages-sub/parking/owner-car', {})
  }

  static toBarrierGate() {
    return navigateToTyped('/pages-sub/parking/barrier-gate', {})
  }

  static toAppointment() {
    return navigateToTyped('/pages-sub/appointment/index', {})
  }

  static toWriteOffCoupon() {
    return navigateToTyped('/pages-sub/coupon/write-off-coupon', {})
  }

  static toWriteOffReserve() {
    return navigateToTyped('/pages-sub/coupon/write-off-reserve', {})
  }

  static toVisitList() {
    return navigateToTyped('/pages-sub/visit/index', {})
  }

  static toItemRelease() {
    return navigateToTyped('/pages-sub/item/release', {})
  }

  static toDataReport() {
    const community = getCurrentCommunity()
    return navigateToTyped('/pages-sub/report/data-report', { communityId: community.communityId })
  }

  static toPayFeeDetail() {
    const community = getCurrentCommunity()
    return navigateToTyped('/pages-sub/report/pay-fee-detail', { communityId: community.communityId })
  }

  static toRoomFeeReport() {
    const community = getCurrentCommunity()
    return navigateToTyped('/pages-sub/report/room-fee', { communityId: community.communityId })
  }

  static toFeeSummary() {
    const community = getCurrentCommunity()
    return navigateToTyped('/pages-sub/report/fee-summary', { communityId: community.communityId })
  }

  static toOpenDoorLog() {
    const community = getCurrentCommunity()
    return navigateToTyped('/pages-sub/report/open-door-log', { communityId: community.communityId })
  }

  static toChargeMachineOrder() {
    const community = getCurrentCommunity()
    return navigateToTyped('/pages-sub/report/charge-machine-order', { communityId: community.communityId })
  }

  /** 选择器模块导航 - 级联选择功能 */

  /**
   * 跳转到选择楼栋页面
   * @description 选择器流程的第一步，无需任何参数
   * @example
   * ```typescript
   * TypedRouter.toSelectFloor()
   * ```
   */
  static toSelectFloor() {
    return navigateToTyped('/pages-sub/selector/select-floor', {})
  }

  /**
   * 跳转到选择单元页面
   * @description 选择器流程的第二步，需要提供楼栋ID
   * @param floorId 楼栋ID，从选择楼栋页面获取
   * @example
   * ```typescript
   * TypedRouter.toSelectUnit('F001')
   * ```
   */
  static toSelectUnit(floorId: string) {
    return navigateToTyped('/pages-sub/selector/select-unit', { floorId })
  }

  /**
   * 跳转到选择房屋页面
   * @description 选择器流程的第三步，需要提供楼栋ID和单元ID
   * @param floorId 楼栋ID，从选择楼栋页面获取
   * @param unitId 单元ID，从选择单元页面获取
   * @example
   * ```typescript
   * TypedRouter.toSelectRoom('F001', 'U001')
   * ```
   */
  static toSelectRoom(floorId: string, unitId: string) {
    return navigateToTyped('/pages-sub/selector/select-room', { floorId, unitId })
  }

  /** 设备保养模块导航 (4个页面) */

  /**
   * 跳转到设备保养任务列表页
   * @description 对应旧代码 gitee-example/pages/maintainance/maintainance.vue
   */
  static toMaintenanceTaskList(params?: PageParams['/pages-sub/maintenance/task-list']) {
    return navigateToTyped('/pages-sub/maintenance/task-list', params)
  }

  /**
   * 跳转到保养执行页
   * @description 对应旧代码 gitee-example/pages/maintainance/excuteMaintainance.vue
   */
  static toMaintenanceExecute(taskId: string) {
    return navigateToTyped('/pages-sub/maintenance/execute', { taskId })
  }

  /**
   * 跳转到单项保养页
   * @description 对应旧代码 gitee-example/pages/maintainance/excuteOneMaintainance.vue
   */
  static toMaintenanceExecuteSingle(taskDetailId: string, taskId: string, itemName: string) {
    return navigateToTyped('/pages-sub/maintenance/execute-single', { taskDetailId, taskId, itemName })
  }

  /**
   * 跳转到保养任务流转页
   * @description 对应旧代码 gitee-example/pages/maintainance/maintainanceTransfer.vue
   */
  static toMaintenanceTransfer(taskId: string) {
    return navigateToTyped('/pages-sub/maintenance/transfer', { taskId })
  }

  static toOaWorkflow() {
    return navigateToTyped('/pages-sub/oa/workflow', {})
  }

  /** 工作单模块导航 (8个页面) */

  /**
   * 跳转到工作任务列表页
   * @description 对应旧代码 gitee-example/pages/work/workTask.vue
   */
  static toWorkTaskList(workId: string) {
    return navigateToTyped('/pages-sub/work/task-list', { workId })
  }

  /**
   * 跳转到发工作单页
   * @description 对应旧代码 gitee-example/pages/work/startWork.vue
   */
  static toWorkStart() {
    return navigateToTyped('/pages-sub/work/start-work', {})
  }

  /**
   * 跳转到办工作单页
   * @description 对应旧代码 gitee-example/pages/work/doWork.vue
   */
  static toWorkDo() {
    return navigateToTyped('/pages-sub/work/do-work', {})
  }

  /**
   * 跳转到工作单详情页
   * @description 对应旧代码 gitee-example/pages/work/workDetail.vue
   */
  static toWorkDetail(orderId: string) {
    return navigateToTyped('/pages-sub/work/work-detail', { orderId })
  }

  /**
   * 跳转到编辑工作单页
   * @description 对应旧代码 gitee-example/pages/work/editWrok.vue
   */
  static toWorkEdit(orderId: string) {
    return navigateToTyped('/pages-sub/work/edit-work', { orderId })
  }

  /**
   * 跳转到抄送工作单页
   * @description 对应旧代码 gitee-example/pages/work/copyWork.vue
   */
  static toWorkCopy() {
    return navigateToTyped('/pages-sub/work/copy-work', {})
  }

  /**
   * 跳转到处理抄送工作单页
   * @description 对应旧代码 gitee-example/pages/work/doCopyWork.vue
   */
  static toWorkDoCopy(copyId: string) {
    return navigateToTyped('/pages-sub/work/do-copy-work', { copyId })
  }

  /**
   * 跳转到工作单审核页
   * @description 对应旧代码 gitee-example/pages/work/doWorkAudit.vue
   */
  static toWorkAudit(taskId: string) {
    return navigateToTyped('/pages-sub/work/audit-work', { taskId })
  }

  /** 费用管理模块导航 (6个页面) */

  /**
   * 跳转到充电桩列表页
   * @description 对应旧代码 gitee-example/pages/charge/charge.vue
   */
  static toFeeCharge(params?: PageParams['/pages-sub/fee/charge']) {
    return navigateToTyped('/pages-sub/fee/charge', params)
  }

  /**
   * 跳转到充电桩详情页
   * @description 对应旧代码 gitee-example/pages/charge/chargeDetail.vue
   */
  static toFeeChargeDetail(params: PageParams['/pages-sub/fee/charge-detail']) {
    return navigateToTyped('/pages-sub/fee/charge-detail', params)
  }

  /**
   * 跳转到费用详情页
   * @description 对应旧代码 gitee-example/pages/feeDetail/feeDetail.vue
   */
  static toFeeDetail(params: PageParams['/pages-sub/fee/detail']) {
    return navigateToTyped('/pages-sub/fee/detail', params)
  }

  /**
   * 跳转到欠费催缴列表页
   * @description 对应旧代码 gitee-example/pages/fee/oweFeeCallable.vue
   */
  static toFeeOweCallable(params?: PageParams['/pages-sub/fee/owe-callable']) {
    return navigateToTyped('/pages-sub/fee/owe-callable', params)
  }

  /**
   * 跳转到填写欠费催缴页
   * @description 对应旧代码 gitee-example/pages/fee/writeOweFeeCallable.vue
   */
  static toFeeWriteOweCallable(params: PageParams['/pages-sub/fee/write-owe-callable']) {
    return navigateToTyped('/pages-sub/fee/write-owe-callable', params)
  }

  /**
   * 跳转到房间缴费页
   * @description 对应旧代码 gitee-example/pages/fee/roomPayFee.vue
   */
  static toFeeRoomPay(params?: PageParams['/pages-sub/fee/room-pay']) {
    return navigateToTyped('/pages-sub/fee/room-pay', params)
  }

  /**
   * 跳转到创建费用页（占位方法，待实现）
   * @description 创建费用功能
   */
  static toFeeCreate(params: { payerObjId: string, payerObjName: string }) {
    // TODO: 实现创建费用页面后，更新此方法
    console.warn('toFeeCreate: 创建费用页面尚未实现', params)
    return Promise.reject(new Error('创建费用页面尚未实现'))
  }
}

/** 路由参数解析工具 */
export function parseRouteParams<T extends keyof PageParams>(url: string): { path: T, params: PageParams[T] } | null {
  try {
    const [path, queryString] = url.split('?')
    const params: any = {}

    if (queryString) {
      const searchParams = new URLSearchParams(queryString)
      searchParams.forEach((value, key) => {
        params[key] = value
      })
    }

    return {
      path: path as T,
      params,
    }
  }
  catch (error) {
    console.error('解析路由参数失败:', error)
    return null
  }
}

/** 路由验证工具 */
export function isValidRoute(path: string): path is PageRoute {
  const validRoutes: PageRoute[] = [
    '/pages/index/index',
    '/pages/work-dashboard/index', // 工作台
    '/pages/about/about',
    '/pages/me/me',
    '/pages/login/login',
    '/pages/address/list',
    '/pages/activity/index',
    '/pages/activity/detail',
    '/pages/about/about',
    '/pages/notice/index',
    // 维修管理模块
    '/pages-sub/repair/order-list',
    '/pages-sub/repair/dispatch',
    '/pages-sub/repair/finish',
    '/pages-sub/repair/order-detail',
    '/pages-sub/repair/add-order',
    '/pages-sub/repair/handle',
    '/pages-sub/repair/select-resource',
    '/pages-sub/repair/end-order',
    '/pages-sub/repair/appraise',
    '/pages-sub/repair/appraise-reply',
    // 投诉管理模块
    '/pages-sub/complaint/list',
    '/pages-sub/complaint/detail',
    '/pages-sub/complaint/handle',
    '/pages-sub/complaint/order',
    '/pages-sub/complaint/finish',
    '/pages-sub/complaint/appraise-reply',
    // 巡检管理模块
    '/pages-sub/inspection/task-list',
    '/pages-sub/inspection/execute',
    '/pages-sub/inspection/execute-qrcode',
    '/pages-sub/inspection/execute-single',
    '/pages-sub/inspection/reexamine',
    '/pages-sub/inspection/transfer',
    '/pages-sub/inspection/staff-no-task',
    '/pages-sub/inspection/today-report',
    // 物业管理模块
    '/pages-sub/property/apply-room',
    '/pages-sub/property/apply-room-detail',
    '/pages-sub/property/apply-room-record',
    '/pages-sub/property/apply-room-record-handle',
    '/pages-sub/property/apply-room-record-detail',
    '/pages-sub/property/renovation',
    '/pages-sub/property/owner-list',
    '/pages-sub/meter/reading',
    // 选择器模块 - 级联选择功能
    '/pages-sub/selector/select-floor',
    '/pages-sub/selector/select-unit',
    '/pages-sub/selector/select-room',
    // 设备保养模块
    '/pages-sub/maintenance/task-list',
    '/pages-sub/maintenance/execute',
    '/pages-sub/maintenance/execute-single',
    '/pages-sub/maintenance/transfer',
    '/pages-sub/work/task-list',
    // 工作单模块
    '/pages-sub/work/task-list',
    '/pages-sub/work/start-work',
    '/pages-sub/work/do-work',
    '/pages-sub/work/work-detail',
    '/pages-sub/work/edit-work',
    '/pages-sub/work/copy-work',
    '/pages-sub/work/do-copy-work',
    '/pages-sub/work/audit-work',
    '/pages-sub/oa/workflow',
    '/pages-sub/resource/purchase-apply-manage',
    '/pages-sub/resource/purchase-apply-audit',
    '/pages-sub/resource/item-out-manage',
    '/pages-sub/resource/item-out-audit',
    '/pages-sub/resource/allocation-manage',
    '/pages-sub/resource/allocation-audit',
    '/pages-sub/resource/store-manage',
    // 费用管理模块
    '/pages-sub/fee/charge',
    '/pages-sub/fee/charge-detail',
    '/pages-sub/fee/detail',
    '/pages-sub/fee/owe-callable',
    '/pages-sub/fee/write-owe-callable',
    '/pages-sub/fee/room-pay',
    '/pages-sub/parking/owner-car',
    '/pages-sub/parking/barrier-gate',
    '/pages-sub/appointment/index',
    '/pages-sub/coupon/write-off-coupon',
    '/pages-sub/coupon/write-off-reserve',
    '/pages-sub/visit/index',
    '/pages-sub/item/release',
    '/pages-sub/report/data-report',
    '/pages-sub/report/pay-fee-detail',
    '/pages-sub/report/room-fee',
    '/pages-sub/report/fee-summary',
    '/pages-sub/report/open-door-log',
    '/pages-sub/report/charge-machine-order',
  ]

  return validRoutes.includes(path as PageRoute)
}

/** 通用导航工具类 */
export class NavigationUtils {
  /**
   * 预加载页面
   */
  static preloadPage<T extends keyof PageParams>(url: T, params?: PageParams[T]) {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    const fullUrl = url + query

    return uni.preloadPage({
      url: fullUrl,
    })
  }

  /**
   * 获取当前页面路径
   */
  static getCurrentPagePath(): string {
    const pages = getCurrentPages()
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1]
      return `/${(currentPage as any).route}`
    }
    return ''
  }

  /**
   * 检查是否可以返回
   */
  static canGoBack(): boolean {
    return getCurrentPages().length > 1
  }

  /**
   * 安全返回（如果无法返回则跳转到首页）
   */
  static safeGoBack() {
    if (this.canGoBack()) {
      goBack()
    }
    else {
      switchTabTyped('/pages/index/index')
    }
  }

  /**
   * 重新加载当前页面
   */
  static reloadCurrentPage() {
    const pages = getCurrentPages()
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1]
      const route = `/${(currentPage as any).route}`
      const options = (currentPage as any).options || {}

      // 构建参数字符串
      const query = Object.keys(options).length > 0 ? `?${new URLSearchParams(options).toString()}` : ''

      // 先返回再跳转实现重新加载
      if (pages.length > 1) {
        uni.navigateBack({
          delta: 1,
          success: () => {
            setTimeout(() => {
              uni.navigateTo({ url: route + query })
            }, 100)
          },
        })
      }
      else {
        uni.redirectTo({ url: route + query })
      }
    }
  }
}

/** 导出便捷别名 */
export { NavigationUtils as Nav }
