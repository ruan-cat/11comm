/**
 * 路由守卫配置
 * 优化版本：与拦截器解耦，专注于权限和业务逻辑检查
 */

import type { PageRoute, RouteGuard } from '@/types/routes'

/** 需要登录的页面列表（根据项目实际情况更新） */
const AUTH_REQUIRED_PAGES: PageRoute[] = [
  '/pages/activity/index',
  '/pages/activity/detail',
  '/pages/me/me',
  // 维修模块（根据业务需求调整）
  '/pages-sub/repair/order-list',
  '/pages-sub/repair/add-order',
  '/pages-sub/repair/order-detail',
  // 投诉模块
  '/pages-sub/complaint/list',
  '/pages-sub/complaint/detail',
  '/pages-sub/complaint/handle',
  // 巡检模块
  '/pages-sub/inspection/task-list',
  '/pages-sub/inspection/execute',
]

/** 游客可访问的页面列表 */
const GUEST_ALLOWED_PAGES = ['/pages/index/index', '/pages/login/login', '/pages/about/about']

/**
 * 检查用户是否已登录
 * 注意：根据项目原则，我们不考虑严格的登录逻辑
 * 这里保留接口以备未来扩展使用
 */
function isUserLoggedIn(): boolean {
  // 根据项目原则：不考虑严格的登录逻辑，默认返回 true
  return true

  // 以下代码保留，供未来需要时启用
  // const token = uni.getStorageSync('token')
  // const userInfo = uni.getStorageSync('userInfo')
  // return !!(token && userInfo)
}

/**
 * 获取登录重定向URL
 */
function getLoginRedirectUrl(targetUrl: string): string {
  const encodedUrl = encodeURIComponent(targetUrl)
  return `/pages/login/login?redirect=${encodedUrl}`
}

/**
 * 登录检查守卫
 * 注意：根据项目原则，我们不考虑严格的登录逻辑和鉴权逻辑
 * 任何页面都可以随意跳转，任意访问
 */
export const authGuard: RouteGuard = (to: string, from: string) => {
  // 根据项目原则：不做任何鉴权处理，任何页面都可以随意跳转
  return true

  // 以下代码保留，供未来需要启用登录检查时使用
  /*
  const targetPath = to.split('?')[0] // 提取路径部分

  // 如果是需要登录的页面
  if (AUTH_REQUIRED_PAGES.includes(targetPath as PageRoute)) {
    if (!isUserLoggedIn()) {
      // 未登录，重定向到登录页
      const loginUrl = getLoginRedirectUrl(to)
      uni.redirectTo({
        url: loginUrl,
        fail: () => {
          uni.showToast({
            title: '请先登录',
            icon: 'none',
            duration: 2000,
          })
        },
      })
      return false
    }
  }

  return true
  */
}

/**
 * 页面访问权限检查守卫
 */
export const permissionGuard: RouteGuard = (to: string, from: string) => {
  // 这里可以根据用户角色检查页面访问权限
  // 目前暂时返回 true，允许所有已登录用户访问
  return true
}

/**
 * 页面重复访问检查守卫
 */
export const duplicateGuard: RouteGuard = (to: string, from: string) => {
  // 防止重复跳转到同一页面
  if (to === from) {
    console.warn('重复跳转到同一页面:', to)
    return false
  }

  return true
}

/**
 * 设置路由守卫
 */
export function setupRouteGuards() {
  // 拦截 navigateTo
  uni.addInterceptor('navigateTo', {
    invoke(args) {
      const { url } = args
      const currentPages = getCurrentPages()
      const from = currentPages.length > 0 ? `/${(currentPages[currentPages.length - 1] as any).route}` : ''

      // 执行守卫检查
      if (!authGuard(url, from))
        return false
      if (!permissionGuard(url, from))
        return false
      if (!duplicateGuard(url, from))
        return false

      return true
    },
    success(res) {
      console.log('页面跳转成功:', res)
    },
    fail(err) {
      console.error('页面跳转失败:', err)
    },
  })

  // 拦截 redirectTo
  uni.addInterceptor('redirectTo', {
    invoke(args) {
      const { url } = args
      const currentPages = getCurrentPages()
      const from = currentPages.length > 0 ? `/${(currentPages[currentPages.length - 1] as any).route}` : ''

      // 对于 redirectTo，通常不需要登录检查，因为可能本身就是去登录页
      if (!permissionGuard(url, from))
        return false
      if (!duplicateGuard(url, from))
        return false

      return true
    },
  })

  // 拦截 switchTab
  uni.addInterceptor('switchTab', {
    invoke(args) {
      const { url } = args
      const currentPages = getCurrentPages()
      const from = currentPages.length > 0 ? `/${(currentPages[currentPages.length - 1] as any).route}` : ''

      // Tab页面的权限检查
      if (!authGuard(url, from))
        return false
      if (!permissionGuard(url, from))
        return false

      return true
    },
  })

  console.log('路由守卫已设置完成')
}

/**
 * 移除路由守卫
 */
export function removeRouteGuards() {
  uni.removeInterceptor('navigateTo')
  uni.removeInterceptor('redirectTo')
  uni.removeInterceptor('switchTab')
  console.log('路由守卫已移除')
}
