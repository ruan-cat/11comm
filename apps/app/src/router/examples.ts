/**
 * 路由系统使用示例
 * 展示如何使用类型安全的路由跳转
 */

import { navigateToTyped, redirectToTyped, switchTabTyped, TypedRouter } from './helpers'

/** 示例 1：使用 TypedRouter 类方法（推荐） */
export function navigationExamples() {
  // 跳转到维修工单列表（默认显示所有状态）
  TypedRouter.toRepairList()

  // 跳转到维修工单列表（仅显示待派单状态）
  TypedRouter.toRepairList({ statusCd: '10001' })

  // 跳转到维修工单详情
  TypedRouter.toRepairDetail('repair123', 'processing')

  // 跳转到新增维修工单
  TypedRouter.toAddRepair('community456')

  // 跳转到投诉列表
  TypedRouter.toComplaintList({ status: 'pending' })

  // 跳转到投诉详情
  TypedRouter.toComplaintDetail('complaint789')

  // 跳转到投诉处理页面
  TypedRouter.toComplaintHandle('complaint789')

  // 跳转到巡检列表
  TypedRouter.toInspectionTaskList()

  // 跳转到巡检执行页面
  TypedRouter.toInspectionExecute('task123', 'normal')

  // 跳转到登录页面
  TypedRouter.toLogin('/pages/me/me')

  // 跳转到活动详情
  TypedRouter.toActivityDetail('activity123', 'community456')

  // 切换到首页 Tab
  TypedRouter.toHome()

  // 切换到通讯录 Tab
  TypedRouter.toAddressList()

  // 切换到个人中心 Tab
  TypedRouter.toMe()
}

/** 示例 2：使用基础的类型安全函数 */
export function basicNavigationExamples() {
  // 跳转到页面（自动类型检查）
  navigateToTyped('/pages-sub/repair/order-detail', {
    repairId: 'repair123',
    storeId: 'store123',
  })

  // 重定向到页面
  redirectToTyped('/pages/login/login', {
    redirect: '/pages/me/me',
  })

  // 切换 Tab 页面
  switchTabTyped('/pages/index/index')
}

/** 示例 3：错误处理 */
export async function navigationWithErrorHandling() {
  try {
    await TypedRouter.toRepairDetail('repair123', 'store123')
    console.log('跳转成功')
  }
  catch (error) {
    console.error('跳转失败:', error)
    uni.showToast({
      title: '页面跳转失败',
      icon: 'none',
    })
  }
}

/** 示例 4：条件跳转 */
export function conditionalNavigation(userRole: 'admin' | 'user') {
  if (userRole === 'admin') {
    // 管理员可以处理投诉
    TypedRouter.toComplaintHandle('complaint123')
  }
  else {
    // 普通用户只能查看投诉详情
    TypedRouter.toComplaintDetail('complaint123')
  }
}

/** 示例 5：批量操作 */
export function batchNavigation(repairIds: string[]) {
  // 遍历维修工单，逐个跳转到详情页
  repairIds.forEach((id, index) => {
    setTimeout(() => {
      TypedRouter.toRepairDetail(id, 'store123')
    }, index * 100) // 避免频繁跳转
  })
}

/** 示例 6：返回逻辑 */
export function smartBack() {
  const pages = getCurrentPages()

  if (pages.length > 1) {
    // 有历史页面，直接返回
    uni.navigateBack()
  }
  else {
    // 没有历史页面，跳转到首页
    TypedRouter.toHome()
  }
}

/** 示例 7：页面参数解析 */
export function parseCurrentPageParams() {
  const pages = getCurrentPages()
  if (pages.length === 0)
    return null

  const currentPage = pages[pages.length - 1] as any
  const route = `/${currentPage.route}`
  const options = currentPage.options || {}

  console.log('当前页面路径:', route)
  console.log('当前页面参数:', options)

  // 根据路径类型处理参数
  if (route === '/pages-sub/repair/order-detail') {
    const { repairId, status } = options
    console.log('维修工单ID:', repairId)
    console.log('工单状态:', status)
  }
}

/** 示例 8：预加载页面 */
export function preloadPages() {
  // 预加载常用页面
  uni.preloadPage({
    url: '/pages-sub/repair/order-list',
  })

  uni.preloadPage({
    url: '/pages-sub/complaint/list',
  })
}

/** 示例 9：路由拦截示例 */
export function setupCustomInterceptor() {
  uni.addInterceptor('navigateTo', {
    invoke(args) {
      console.log('即将跳转到:', args.url)

      // 可以在这里添加自定义逻辑
      // 例如：埋点统计、参数验证等

      return true
    },
    success(res) {
      console.log('跳转成功:', res)
    },
    fail(err) {
      console.error('跳转失败:', err)
    },
  })
}
