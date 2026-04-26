import { getDomains } from '@ruan-cat/domains'
import { describe, expect, test } from 'vitest'
import {
  isPhase2ApiShadowEndpoint,
  prependRuntimeBaseUrl,
  resolveApiRuntime,
  resolveHttpBaseUrl,
  resolveHttpBaseUrlForPath,
  resolveUploadBaseUrl,
} from '@/http/runtime-base'

describe('runtime base url', () => {
  const nitroStandaloneDomain = getDomains({
    projectName: '11comm',
    projectAlias: '11commAppNitroServer',
  })[0]

  test('defaults to mock runtime when env is missing', () => {
    expect(resolveApiRuntime({})).toBe('mock')
  })

  test('uses proxy prefix in mock runtime when proxy is enabled', () => {
    expect(
      resolveHttpBaseUrl({
        VITE_API_RUNTIME: 'mock',
        VITE_APP_PROXY_ENABLE: 'true',
        VITE_APP_PROXY_PREFIX: '/api',
        VITE_SERVER_BASEURL: 'http://127.0.0.1:3101',
      }),
    ).toBe('/api')
  })

  test('uses standalone server base url outside mock runtime', () => {
    expect(
      resolveHttpBaseUrl({
        VITE_API_RUNTIME: 'nitro-standalone',
        VITE_APP_PROXY_ENABLE: 'true',
        VITE_APP_PROXY_PREFIX: '/api',
        VITE_SERVER_BASEURL: 'http://127.0.0.1:3101',
      }),
    ).toBe('http://127.0.0.1:3101')
  })

  test('keeps h5 full-stack requests same-origin in nitro-vite runtime', () => {
    expect(
      resolveHttpBaseUrl({
        VITE_API_RUNTIME: 'nitro-vite',
        VITE_APP_PROXY_ENABLE: 'true',
        VITE_APP_PROXY_PREFIX: '/api',
        VITE_SERVER_BASEURL: 'http://127.0.0.1:3101',
      }),
    ).toBe('')
  })

  test('falls back to domains package alias in standalone runtime when base url env is missing', () => {
    expect(
      resolveHttpBaseUrl({
        VITE_API_RUNTIME: 'nitro-standalone',
      }),
    ).toBe(`https://${nitroStandaloneDomain}`)
  })

  test('prefixes relative urls and leaves absolute urls untouched', () => {
    const env = {
      VITE_API_RUNTIME: 'nitro-standalone',
      VITE_SERVER_BASEURL: 'http://127.0.0.1:3101',
    }

    expect(prependRuntimeBaseUrl('/app/ownerRepair.listOwnerRepairs', env)).toBe(
      'http://127.0.0.1:3101/app/ownerRepair.listOwnerRepairs',
    )
    expect(prependRuntimeBaseUrl('https://example.com/file.png', env)).toBe('https://example.com/file.png')
  })

  test('does not prepend the mock proxy prefix twice', () => {
    expect(
      prependRuntimeBaseUrl('/dev-api/app/activities.listActivitiess', {
        VITE_API_RUNTIME: 'mock',
        VITE_APP_PROXY_ENABLE: 'true',
        VITE_APP_PROXY_PREFIX: '/dev-api',
      }),
    ).toBe('/dev-api/app/activities.listActivitiess')
  })

  test('keeps upload requests same-origin in nitro-vite runtime', () => {
    expect(
      resolveUploadBaseUrl({
        VITE_API_RUNTIME: 'nitro-vite',
        VITE_UPLOAD_BASEURL: 'http://127.0.0.1:3101/upload',
      }),
    ).toBe('/upload')
  })

  test('derives upload base url from domains package alias in standalone runtime when upload env is missing', () => {
    expect(
      resolveUploadBaseUrl({
        VITE_API_RUNTIME: 'nitro-standalone',
      }),
    ).toBe(`https://${nitroStandaloneDomain}/upload`)
  })
})

describe('phase3 app api shadow base url', () => {
  test('only enables shadow api base for Phase2 fee/payment/report endpoints', () => {
    expect(isPhase2ApiShadowEndpoint('/app/fee.listFee')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/fee.queryFeeDetail')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/payment.nativeQrcodePayment')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/reportFeeMonthStatistics.queryReportFeeSummary')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/ownerRepair.listOwnerRepairs')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/resourceStore.listResourceStores')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/owner.queryOwnerCars')).toBe(false)
  })

  test('uses shadow api base only when the switch is enabled', () => {
    expect(
      resolveHttpBaseUrlForPath('/app/fee.listFee', {
        VITE_API_RUNTIME: 'nitro-standalone',
        VITE_SERVER_BASEURL: 'http://legacy.example.com',
        VITE_11COMM_API_BASE_URL: 'http://127.0.0.1:3102',
        VITE_11COMM_API_SHADOW_ENABLE: 'true',
      }),
    ).toBe('http://127.0.0.1:3102')

    expect(
      resolveHttpBaseUrlForPath('/app/fee.queryFeeDetail', {
        VITE_API_RUNTIME: 'nitro-standalone',
        VITE_SERVER_BASEURL: 'http://legacy.example.com',
        VITE_11COMM_API_BASE_URL: 'http://127.0.0.1:3102',
        VITE_11COMM_API_SHADOW_ENABLE: 'true',
      }),
    ).toBe('http://127.0.0.1:3102')

    expect(
      resolveHttpBaseUrlForPath('/app/ownerRepair.listOwnerRepairs', {
        VITE_API_RUNTIME: 'nitro-standalone',
        VITE_SERVER_BASEURL: 'http://legacy.example.com',
        VITE_11COMM_API_BASE_URL: 'http://127.0.0.1:3102',
        VITE_11COMM_API_SHADOW_ENABLE: 'true',
      }),
    ).toBe('http://legacy.example.com')
  })
})
