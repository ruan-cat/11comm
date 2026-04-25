import type { CustomRequestOptions } from '@/http/types'
import { prependRuntimeBaseUrl } from '@/http/runtime-base'
import { useUserStore } from '@/store'
import { platform } from '@/utils/platform'
import { stringifyQuery } from './tools/queryString'

const httpInterceptor = {
  /** 请求前拦截 */
  invoke(options: CustomRequestOptions) {
    if (options.query) {
      const queryStr = stringifyQuery(options.query)
      if (options.url.includes('?')) {
        options.url += `&${queryStr}`
      }
      else {
        options.url += `?${queryStr}`
      }
    }

    if (!options.url.startsWith('http')) {
      options.url = prependRuntimeBaseUrl(options.url, import.meta.env)
    }

    options.timeout = 60000
    options.header = {
      platform,
      ...options.header,
    }

    const userStore = useUserStore()
    const { token } = userStore.userInfo as unknown as IUserToken
    if (token) {
      options.header.Authorization = `Bearer ${token}`
    }
  },
}

export const requestInterceptor = {
  install() {
    uni.addInterceptor('request', httpInterceptor)
    uni.addInterceptor('uploadFile', httpInterceptor)
  },
}
