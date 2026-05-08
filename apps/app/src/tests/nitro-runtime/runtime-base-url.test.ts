import { getDomains } from '@ruan-cat/domains'
import { describe, expect, test } from 'vitest'
import {
  isPhase2ApiShadowEndpoint,
  PHASE2_API_SHADOW_ENDPOINTS,
  prependRuntimeBaseUrl,
  resolveApiRuntime,
  resolveHttpBaseUrl,
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

describe('phase6 app api shadow base url', () => {
  const legacyRuntimeEnv = {
    VITE_API_RUNTIME: 'nitro-standalone',
    VITE_SERVER_BASEURL: 'http://legacy.example.com',
    VITE_11COMM_API_BASE_URL: 'http://127.0.0.1:3102',
  }

  test('allowlists only Phase6 fee payment report endpoints with legacy test coverage', () => {
    expect(PHASE2_API_SHADOW_ENDPOINTS).toEqual([
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
    ])

    expect(isPhase2ApiShadowEndpoint('/app/fee.listFee')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/feeConfig.listFeeConfigs')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/oweFeeCallable.listOweFeeCallable')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/ownerRepair.listOwnerRepairs')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/callComponent/core/list')).toBe(false)
  })

  test('uses apps/api base for allowlisted app endpoint when shadow is enabled', () => {
    expect(
      prependRuntimeBaseUrl('/app/fee.listFee', {
        ...legacyRuntimeEnv,
        VITE_11COMM_API_SHADOW_ENABLE: 'true',
      }),
    ).toBe('http://127.0.0.1:3102/app/fee.listFee')
  })

  test('uses apps/api base for newly cut over fee config and owe fee callable endpoints', () => {
    expect(
      prependRuntimeBaseUrl('/app/oweFeeCallable.listOweFeeCallable?page=1', {
        ...legacyRuntimeEnv,
        VITE_11COMM_API_SHADOW_ENABLE: 'true',
      }),
    ).toBe('http://127.0.0.1:3102/app/oweFeeCallable.listOweFeeCallable?page=1')

    expect(
      prependRuntimeBaseUrl('/app/feeConfig.listFeeConfigs', {
        ...legacyRuntimeEnv,
        VITE_11COMM_API_SHADOW_ENABLE: 'true',
      }),
    ).toBe('http://127.0.0.1:3102/app/feeConfig.listFeeConfigs')
  })

  test('routes fee payment and report legacy endpoints to apps/api while keeping non-allowlisted endpoints on legacy runtime', () => {
    const shadowEnv = {
      ...legacyRuntimeEnv,
      VITE_11COMM_API_SHADOW_ENABLE: 'true',
    }

    expect(prependRuntimeBaseUrl('/app/fee.listFee', shadowEnv)).toBe('http://127.0.0.1:3102/app/fee.listFee')
    expect(prependRuntimeBaseUrl('/app/payment.nativeQrcodePayment', shadowEnv)).toBe(
      'http://127.0.0.1:3102/app/payment.nativeQrcodePayment',
    )
    expect(prependRuntimeBaseUrl('/app/reportFeeMonthStatistics/queryPayFeeDetail', shadowEnv)).toBe(
      'http://127.0.0.1:3102/app/reportFeeMonthStatistics/queryPayFeeDetail',
    )
    expect(prependRuntimeBaseUrl('/app/ownerRepair.listOwnerRepairs', shadowEnv)).toBe(
      'http://legacy.example.com/app/ownerRepair.listOwnerRepairs',
    )
    expect(prependRuntimeBaseUrl('/callComponent/core/list', shadowEnv)).toBe(
      'http://legacy.example.com/callComponent/core/list',
    )
  })

  test.each(PHASE2_API_SHADOW_ENDPOINTS)('routes allowlisted %s to apps/api when shadow is enabled', (endpoint) => {
    expect(
      prependRuntimeBaseUrl(`${endpoint}?communityId=COMM_001`, {
        ...legacyRuntimeEnv,
        VITE_11COMM_API_SHADOW_ENABLE: 'true',
      }),
    ).toBe(`http://127.0.0.1:3102${endpoint}?communityId=COMM_001`)
  })

  test.each([
    '/callComponent/core/list',
    '/app/ownerRepair.listOwnerRepairs',
    '/app/floor.queryFloors',
    '/app/floor.queryFloorDetail',
  ])('keeps non-allowlisted %s on the legacy runtime when shadow is enabled', (endpoint) => {
    expect(
      prependRuntimeBaseUrl(`${endpoint}?communityId=COMM_001`, {
        ...legacyRuntimeEnv,
        VITE_SERVER_BASEURL: 'http://127.0.0.1:3101',
        VITE_11COMM_API_SHADOW_ENABLE: 'true',
      }),
    ).toBe(`http://127.0.0.1:3101${endpoint}?communityId=COMM_001`)
  })

  test('falls back to existing runtime base for non-allowlisted app endpoint when shadow is enabled', () => {
    expect(
      prependRuntimeBaseUrl('/app/unknown.endpoint', {
        ...legacyRuntimeEnv,
        VITE_11COMM_API_SHADOW_ENABLE: 'true',
      }),
    ).toBe('http://legacy.example.com/app/unknown.endpoint')
  })

  test('falls back to existing runtime base when shadow is disabled', () => {
    expect(
      prependRuntimeBaseUrl('/app/fee.listFee', {
        ...legacyRuntimeEnv,
        VITE_11COMM_API_SHADOW_ENABLE: 'false',
      }),
    ).toBe('http://legacy.example.com/app/fee.listFee')
  })

  test('keeps callComponent legacy contract on the existing runtime base', () => {
    expect(
      prependRuntimeBaseUrl('/callComponent/core/list', {
        ...legacyRuntimeEnv,
        VITE_11COMM_API_SHADOW_ENABLE: 'true',
      }),
    ).toBe('http://legacy.example.com/callComponent/core/list')
  })

  test('routes production app requests through the unified standalone server', () => {
    const productionEnv = {
      VITE_API_RUNTIME: 'nitro-standalone',
      VITE_SERVER_BASEURL: 'https://01s-11-server.ruan-cat.com',
      VITE_11COMM_API_BASE_URL: 'https://01s-11-server.ruan-cat.com',
      VITE_11COMM_API_SHADOW_ENABLE: 'true',
    }

    expect(prependRuntimeBaseUrl('/app/fee.listFee', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/fee.listFee',
    )
    expect(prependRuntimeBaseUrl('/callComponent/core/list', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/callComponent/core/list',
    )
    expect(prependRuntimeBaseUrl('/app/floor.queryFloors', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/floor.queryFloors',
    )
  })
})
