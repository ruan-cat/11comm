import { resolve11CommNitroServerBaseUrl } from '@/config/project-domains'

export type ApiRuntime = 'mock' | 'nitro-vite' | 'nitro-standalone'

export interface RuntimeBaseEnv {
  VITE_API_RUNTIME?: string
  VITE_APP_PROXY_ENABLE?: boolean | string
  VITE_APP_PROXY_PREFIX?: string
  VITE_SERVER_BASEURL?: string
  VITE_UPLOAD_BASEURL?: string
}

/** 解析当前接口运行时 */
export function resolveApiRuntime(env: RuntimeBaseEnv): ApiRuntime {
  const runtime = env.VITE_API_RUNTIME

  if (runtime === 'nitro-vite' || runtime === 'nitro-standalone') {
    return runtime
  }

  return 'mock'
}

/** 判断 mock 代理是否启用 */
export function isMockProxyEnabled(env: RuntimeBaseEnv): boolean {
  return String(env.VITE_APP_PROXY_ENABLE) === 'true'
}

/** 解析 HTTP 请求基址 */
export function resolveHttpBaseUrl(env: RuntimeBaseEnv): string {
  const runtime = resolveApiRuntime(env)

  if (runtime === 'nitro-vite') {
    return ''
  }

  if (runtime === 'nitro-standalone') {
    return env.VITE_SERVER_BASEURL || resolve11CommNitroServerBaseUrl()
  }

  if (isMockProxyEnabled(env)) {
    return env.VITE_APP_PROXY_PREFIX || ''
  }

  return env.VITE_SERVER_BASEURL || ''
}

/** 为相对路径补全运行时基址 */
export function prependRuntimeBaseUrl(url: string, env: RuntimeBaseEnv): string {
  if (/^https?:\/\//.test(url)) {
    return url
  }

  const baseUrl = resolveHttpBaseUrl(env)

  if (!baseUrl) {
    return url
  }

  if (url === baseUrl || url.startsWith(`${baseUrl}/`)) {
    return url
  }

  if (!url.startsWith('/')) {
    return `${baseUrl}/${url}`
  }

  return `${baseUrl}${url}`
}

/** 解析上传基址 */
export function resolveUploadBaseUrl(env: RuntimeBaseEnv): string {
  const runtime = resolveApiRuntime(env)

  if (runtime === 'nitro-vite') {
    return '/upload'
  }

  return env.VITE_UPLOAD_BASEURL || prependRuntimeBaseUrl('/upload', env)
}
