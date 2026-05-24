import { resolve11CommNitroServerBaseUrl } from '@/config/project-domains'

export type ApiRuntime = 'mock' | 'nitro-vite' | 'nitro-standalone'

export interface RuntimeBaseEnv {
  VITE_API_RUNTIME?: string
  VITE_APP_PROXY_ENABLE?: boolean | string
  VITE_APP_PROXY_PREFIX?: string
  VITE_SERVER_BASEURL?: string
  VITE_UPLOAD_BASEURL?: string
  VITE_11COMM_API_BASE_URL?: string
  VITE_11COMM_API_SHADOW_ENABLE?: boolean | string
}

export const PHASE2_API_SHADOW_ENDPOINTS = [
  '/app/fee.listFee',
  '/app/fee.queryFeeDetail',
  '/app/feeApi/listOweFees',
  '/app/fee.saveRoomCreateFee',
  '/app/payment.nativeQrcodePayment',
  '/app/oweFeeCallable.listOweFeeCallable',
  '/app/oweFeeCallable.writeOweFeeCallable',
  '/app/reportFeeMonthStatistics.queryReportFeeSummary',
  '/app/reportFeeMonthStatistics/queryPayFeeDetail',
  '/app/reportFeeMonthStatistics.queryReportFeeDetailRoom',
  '/app/dataReport.queryFeeDataReport',
  '/app/feeConfig.listFeeConfigs',
  '/callComponent/core/list',
  '/callComponent/ownerRepair.appraiseRepair',
  '/app/floor.queryFloors',
  '/app/floor.queryFloorDetail',
  '/app/ownerRepair.listOwnerRepairs',
  '/app/ownerRepair.queryOwnerRepair',
  '/app/repairSetting.listRepairSettings',
  '/app/dict.queryRepairStates',
  '/app/workorder/todo/list',
  '/app/workorder/detail',
  '/app/workorder/copy/list',
  '/app/workorder/task/list',
  '/app/workorder/task/items',
  '/app/visit.getVisit',
  '/app/visit.getVisitDetail',
  '/app/profile.getUserProfile',
  '/app/profile.listCommunities',
  '/app/profile.listAttendanceRecords',
  '/app/video.listMonitorArea',
  '/app/video.listStaffMonitorMachine',
  '/app/video.getPlayVideoUrl',
  '/app/notice.listNotices',
]

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

export function isPhase2ApiShadowEndpoint(url: string): boolean {
  const path = normalizeRequestPath(url)
  return PHASE2_API_SHADOW_ENDPOINTS.some(endpoint => endpoint === path)
}

export function isApiShadowEnabled(env: RuntimeBaseEnv): boolean {
  return String(env.VITE_11COMM_API_SHADOW_ENABLE) === 'true'
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

export function resolveHttpBaseUrlForPath(url: string, env: RuntimeBaseEnv): string {
  if (isApiShadowEnabled(env) && isPhase2ApiShadowEndpoint(url)) {
    return env.VITE_11COMM_API_BASE_URL || resolve11CommNitroServerBaseUrl()
  }

  return resolveHttpBaseUrl(env)
}

/** 为相对路径补全运行时基址 */
export function prependRuntimeBaseUrl(url: string, env: RuntimeBaseEnv): string {
  if (/^https?:\/\//.test(url)) {
    return url
  }

  const baseUrl = resolveHttpBaseUrlForPath(url, env)

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

function normalizeRequestPath(url: string): string {
  try {
    return new URL(url, 'http://local').pathname
  }
  catch {
    return url.split('?')[0] || url
  }
}
