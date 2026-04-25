/**
 * 统一的路由管理中心
 * 整合拦截器、守卫和类型安全的路由跳转
 */

import { removeRouteGuards, setupRouteGuards } from './guards'
import { TypedRouter } from './helpers'
import { routeInterceptor } from './interceptor'

/** 导出配置 */
export * from './config'
/** 导出类型安全的路由工具 */
export {
  goBack,
  isValidRoute,
  Nav,
  navigateToTyped,
  NavigationUtils,
  parseRouteParams,
  redirectToTyped,
  switchTabTyped,
  TypedRouter,
} from './helpers'

export type { PageParams, PageRoute, TabRoute } from '@/types/routes'

/** 路由管理器类 */
export class RouterManager {
  private static instance: RouterManager
  private isInitialized = false

  static getInstance(): RouterManager {
    if (!RouterManager.instance) {
      RouterManager.instance = new RouterManager()
    }
    return RouterManager.instance
  }

  /**
   * 初始化路由系统
   */
  init() {
    if (this.isInitialized) {
      console.warn('路由系统已经初始化，跳过重复初始化')
      return
    }

    try {
      // 安装路由拦截器
      routeInterceptor.install()

      // 设置路由守卫
      setupRouteGuards()

      this.isInitialized = true
      console.log('路由系统初始化完成')
    }
    catch (error) {
      console.error('路由系统初始化失败:', error)
    }
  }

  /**
   * 销毁路由系统
   */
  destroy() {
    if (!this.isInitialized) {
      return
    }

    try {
      // 移除路由守卫
      removeRouteGuards()

      // 移除拦截器
      uni.removeInterceptor('navigateTo')
      uni.removeInterceptor('redirectTo')
      uni.removeInterceptor('switchTab')
      uni.removeInterceptor('reLaunch')

      this.isInitialized = false
      console.log('路由系统已销毁')
    }
    catch (error) {
      console.error('路由系统销毁失败:', error)
    }
  }

  /**
   * 重新初始化路由系统
   */
  reinit() {
    this.destroy()
    this.init()
  }

  /**
   * 获取初始化状态
   */
  isReady(): boolean {
    return this.isInitialized
  }
}

/** 便捷的导出函数 */
export const router = RouterManager.getInstance()

/**
 * 初始化路由系统
 */
export function setupRouter() {
  router.init()
}

/**
 * 销毁路由系统
 */
export function destroyRouter() {
  router.destroy()
}

/** 导出常用的路由跳转函数（向后兼容） */
export const {
  toRepairList,
  toRepairDetail,
  toAddRepair,
  toComplaintList,
  toComplaintDetail,
  toComplaintHandle,
  toInspectionTaskList,
  toInspectionExecute,
  toInspectionExecuteQrcode,
  toInspectionExecuteSingle,
  toInspectionReexamine,
  toInspectionTransfer,
  toInspectionStaffNoTask,
  toInspectionTodayReport,
  toLogin,
  toActivityDetail,
  toHome,
  toAddressList,
  toMe,
  toApplyRoomList,
  toApplyRoomDetail,
  toApplyRoomRecord,
  toApplyRoomRecordHandle,
  toApplyRoomRecordDetail,
} = TypedRouter

/** 路由工具函数 */
export function getCurrentRoute() {
  const pages = getCurrentPages()
  if (pages.length === 0)
    return null

  const currentPage = pages[pages.length - 1] as any
  return {
    path: `/${currentPage.route}`,
    options: currentPage.options || {},
  }
}

export function getPreviousRoute() {
  const pages = getCurrentPages()
  if (pages.length < 2)
    return null

  const previousPage = pages[pages.length - 2] as any
  return {
    path: `/${previousPage.route}`,
    options: previousPage.options || {},
  }
}

export function canGoBack(): boolean {
  return getCurrentPages().length > 1
}

export function safeGoBack(fallbackUrl: string = '/pages/index/index') {
  if (canGoBack()) {
    uni.navigateBack()
  }
  else {
    uni.redirectTo({ url: fallbackUrl })
  }
}
