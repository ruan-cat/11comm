import type { CustomTabBarItem, CustomTabBarItemBadge } from './config'
import { reactive } from 'vue'

import { FG_LOG_ENABLE } from '@/router/interceptor'
import { tabbarList as _tabbarList, customTabbarEnable, customTabbarExtraVisiblePaths } from './config'

// TODO 1/2: 中间的鼓包tabbarItem的开关
const BULGE_ENABLE = false

/** tabbarList 里面的 path 从 pages.config.ts 得到 */
const tabbarList = reactive<CustomTabBarItem[]>(
  _tabbarList.map(item => ({
    ...item,
    pagePath: item.pagePath.startsWith('/') ? item.pagePath : `/${item.pagePath}`,
  })),
)

if (customTabbarEnable && BULGE_ENABLE) {
  if (tabbarList.length % 2) {
    console.error('有鼓包时 tabbar 数量必须是偶数，否则样式很奇怪！！')
  }
  tabbarList.splice(tabbarList.length / 2, 0, {
    isBulge: true,
  } as CustomTabBarItem)
}

/** 与原生 Tab 页路径一致（含前导 `/`） */
function normalizeRoutePath(path: string) {
  if (!path)
    return ''
  return path.startsWith('/') ? path : `/${path}`
}

/** 是否为 Tab 根页面之一（登录页等逻辑仍用此项，勿与底栏展示混用） */
export function isPageTabbar(path: string) {
  const p = normalizeRoutePath(path)
  return tabbarList.some(item => item.pagePath === p)
}

/**
 * 是否显示自定义底部栏：Tab 根页面 + {@link customTabbarExtraVisiblePaths} 登记的分包页等
 */
export function shouldShowCustomTabbar(path: string) {
  if (!customTabbarEnable)
    return false
  const p = normalizeRoutePath(path)
  return isPageTabbar(p) || customTabbarExtraVisiblePaths.includes(p)
}

/**
 * 自定义 tabbar 的状态管理，原生 tabbar 无需关注本文件
 * tabbar 状态，增加 storageSync 保证刷新浏览器时在正确的 tabbar 页面
 * 使用reactive简单状态，而不是 pinia 全局状态
 */
const tabbarStore = reactive({
  curIdx: uni.getStorageSync('app-tabbar-index') || 0,
  prevIdx: uni.getStorageSync('app-tabbar-index') || 0,
  setCurIdx(idx: number) {
    this.curIdx = idx
    uni.setStorageSync('app-tabbar-index', idx)
  },
  setTabbarItemBadge(idx: number, badge: CustomTabBarItemBadge) {
    if (tabbarList[idx]) {
      tabbarList[idx].badge = badge
    }
  },
  setAutoCurIdx(path: string) {
    const index = tabbarList.findIndex(item => item.pagePath === path)
    FG_LOG_ENABLE && console.log('index:', index, path)
    // console.log('tabbarList:', tabbarList)
    if (index === -1) {
      const pagesPathList = getCurrentPages().map(item =>
        item.route.startsWith('/') ? item.route : `/${item.route}`,
      )
      // console.log(pagesPathList)
      const flag = tabbarList.some(item => pagesPathList.includes(item.pagePath))
      if (!flag) {
        this.setCurIdx(0)
        return
      }
    }
    else {
      this.setCurIdx(index)
    }
  },
  restorePrevIdx() {
    if (this.prevIdx === this.curIdx)
      return
    this.setCurIdx(this.prevIdx)
    this.prevIdx = uni.getStorageSync('app-tabbar-index') || 0
  },
})

export { tabbarList, tabbarStore }
