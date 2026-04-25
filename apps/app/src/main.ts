import { VueQueryPlugin } from '@tanstack/vue-query'
import { createSSRApp } from 'vue'
// #ifdef H5
import { installH5FormControlAttributesPatch } from '@/utils/h5-form-control-attributes'
// #endif
import App from './App.vue'
import { requestInterceptor } from './http/interceptor'
import { routeInterceptor } from './router/interceptor'

import store from './store'
import '@/style/index.scss'
import 'virtual:uno.css'

type H5ProcessShim = {
  env?: Record<string, string | undefined>
}

/** H5 production bundles can evaluate `process?.env.UNI_APP_X` in the browser. */
function ensureH5ProcessShim() {
  // #ifdef H5
  const runtimeGlobal = globalThis as typeof globalThis & Record<string, unknown>
  const processShim = (Reflect.get(runtimeGlobal, 'process') as H5ProcessShim | undefined) ?? {
    env: {
      UNI_APP_X: 'false',
    },
  }

  if (!processShim.env) {
    processShim.env = {}
  }

  if (typeof processShim.env.UNI_APP_X === 'undefined') {
    processShim.env.UNI_APP_X = 'false'
  }

  Reflect.set(runtimeGlobal, 'process', processShim)
  // #endif
}

ensureH5ProcessShim()

/**
 * 全局配置 z-paging 组件
 * @see https://z-paging.zxlee.cn/api/props/global-config.html
 */
uni.$zp = {
  config: {
    // 配置分页默认pageSize为10
    'default-page-size': 10,

    /**
     * 自定义页面reload时的加载view，
     * 注意：这个slot默认仅会在第一次加载时显示，若需要每次reload时都显示，
     * 需要将auto-hide-loading-after-first-loaded设置为false
     * @see https://z-paging.zxlee.cn/api/slot/main.html
     */
    'auto-hide-loading-after-first-loaded': false,

    /** 是否启用下拉刷新 @see https://z-paging.zxlee.cn/api/props/refresher.html */
    'refresher-enabled': true,

    /** 是否启用加载更多数据 @see https://z-paging.zxlee.cn/api/props/loading-more.html */
    'loading-more-enabled': true,

    /** 控制是否出现滚动条 @see https://z-paging.zxlee.cn/api/props/scroll-view.html */
    'show-scrollbar': false,
  },
}

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(routeInterceptor)
  app.use(requestInterceptor)
  app.use(VueQueryPlugin)

  // #ifdef H5
  installH5FormControlAttributesPatch()
  // #endif

  return {
    app,
  }
}
