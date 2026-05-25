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

describe('phase7 app api shadow base url', () => {
  const legacyRuntimeEnv = {
    VITE_API_RUNTIME: 'nitro-standalone',
    VITE_SERVER_BASEURL: 'http://legacy.example.com',
    VITE_11COMM_API_BASE_URL: 'http://127.0.0.1:3102',
  }

  test('allowlists migrated app legacy endpoints with registry coverage', () => {
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
      '/app/activities.listActivitiess',
      '/app/communitySpace.listCommunitySpaceConfirmOrder',
      '/app/auditUser.listAuditComplaints',
      '/app/auditUser.listAuditHistoryComplaints',
      '/app/complaint.listComplaintEvent',
      '/app/complaintAppraise.listComplaintAppraise',
      '/app/contact.listContacts',
      '/app/contact.getContactDetail',
      '/app/contact.getContactsByDepartment',
      '/app/contact.searchContacts',
      '/app/contact.getDepartments',
      '/app/contact.getFavoriteContacts',
      '/app/contact.getEmergencyContacts',
      '/app/room.queryRooms',
      '/app/room.queryRoomDetail',
      '/app/unit.queryUnits',
      '/app/unit.queryUnitDetail',
      '/app/owner.queryOwnerAndMembers',
    ])

    expect(isPhase2ApiShadowEndpoint('/app/fee.listFee')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/feeConfig.listFeeConfigs')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/oweFeeCallable.listOweFeeCallable')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/ownerRepair.listOwnerRepairs')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/ownerRepair.queryOwnerRepair')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/repairSetting.listRepairSettings')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/dict.queryRepairStates')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/workorder/todo/list')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/workorder/detail')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/workorder/copy/list')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/workorder/task/list')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/workorder/task/items')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/visit.getVisit')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/visit.getVisitDetail')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/profile.getUserProfile')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/profile.listCommunities')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/profile.listAttendanceRecords')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/video.listMonitorArea')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/video.listStaffMonitorMachine')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/video.getPlayVideoUrl')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/notice.listNotices')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/activities.listActivitiess')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/communitySpace.listCommunitySpaceConfirmOrder')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/room.queryRooms')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/room.queryRoomDetail')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/unit.queryUnits')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/unit.queryUnitDetail')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/owner.queryOwnerAndMembers')).toBe(true)
    expect(isPhase2ApiShadowEndpoint('/app/ownerRepair.saveOwnerRepair')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/workorder/create')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/workorder/copy/finish')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/visit.auditVisit')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/profile.changeCommunity')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/profile.changePassword')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/activities.saveActivities')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/activities.updateActivities')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/activities.deleteActivities')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/activities.increaseView')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/activities.likeActivity')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/activities.updateStatus')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/activities.updateLike')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/activities.updateCollect')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/communitySpace.saveCommunitySpaceConfirmOrder')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/complaint')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/complaint.auditComplaint')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/complaintAppraise.replyComplaintAppraise')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/contact.updateOnlineStatus')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/owner.saveRoomOwner')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/owner.editOwner')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/app/owner.deleteOwner')).toBe(false)
    expect(isPhase2ApiShadowEndpoint('/callComponent/core/list')).toBe(true)
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
      'http://127.0.0.1:3102/app/ownerRepair.listOwnerRepairs',
    )
    expect(prependRuntimeBaseUrl('/callComponent/core/list', shadowEnv)).toBe(
      'http://127.0.0.1:3102/callComponent/core/list',
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
    '/app/ownerRepair.saveOwnerRepair',
  ])('keeps non-allowlisted %s on the legacy runtime when shadow is enabled', (endpoint) => {
    expect(
      prependRuntimeBaseUrl(`${endpoint}?communityId=COMM_001`, {
        ...legacyRuntimeEnv,
        VITE_SERVER_BASEURL: 'http://127.0.0.1:3101',
        VITE_11COMM_API_SHADOW_ENABLE: 'true',
      }),
    ).toBe(`http://127.0.0.1:3101${endpoint}?communityId=COMM_001`)
  })

  test.each([
    '/app/ownerRepair.listOwnerRepairs',
    '/app/ownerRepair.queryOwnerRepair',
    '/app/repairSetting.listRepairSettings',
    '/app/dict.queryRepairStates',
  ])('routes repair readonly %s to apps/api when shadow is enabled', (endpoint) => {
    expect(
      prependRuntimeBaseUrl(`${endpoint}?communityId=COMM_001`, {
        ...legacyRuntimeEnv,
        VITE_11COMM_API_SHADOW_ENABLE: 'true',
      }),
    ).toBe(`http://127.0.0.1:3102${endpoint}?communityId=COMM_001`)
  })

  test.each([
    '/app/workorder/todo/list',
    '/app/workorder/detail',
    '/app/workorder/copy/list',
    '/app/workorder/task/list',
    '/app/workorder/task/items',
  ])('routes work-order readonly %s to apps/api when shadow is enabled', (endpoint) => {
    expect(
      prependRuntimeBaseUrl(`${endpoint}?communityId=COMM_001`, {
        ...legacyRuntimeEnv,
        VITE_11COMM_API_SHADOW_ENABLE: 'true',
      }),
    ).toBe(`http://127.0.0.1:3102${endpoint}?communityId=COMM_001`)
  })

  test.each([
    '/app/visit.getVisit',
    '/app/visit.getVisitDetail',
  ])('routes visit readonly %s to apps/api when shadow is enabled', (endpoint) => {
    expect(
      prependRuntimeBaseUrl(`${endpoint}?communityId=COMM_001`, {
        ...legacyRuntimeEnv,
        VITE_11COMM_API_SHADOW_ENABLE: 'true',
      }),
    ).toBe(`http://127.0.0.1:3102${endpoint}?communityId=COMM_001`)
  })

  test.each([
    '/app/profile.getUserProfile',
    '/app/profile.listCommunities',
    '/app/profile.listAttendanceRecords',
  ])('routes profile readonly %s to apps/api when shadow is enabled', (endpoint) => {
    expect(
      prependRuntimeBaseUrl(`${endpoint}?communityId=COMM_001`, {
        ...legacyRuntimeEnv,
        VITE_11COMM_API_SHADOW_ENABLE: 'true',
      }),
    ).toBe(`http://127.0.0.1:3102${endpoint}?communityId=COMM_001`)
  })

  test.each([
    '/app/video.listMonitorArea',
    '/app/video.listStaffMonitorMachine',
    '/app/video.getPlayVideoUrl',
  ])('routes video readonly %s to apps/api when shadow is enabled', (endpoint) => {
    expect(
      prependRuntimeBaseUrl(`${endpoint}?communityId=COMM_001`, {
        ...legacyRuntimeEnv,
        VITE_11COMM_API_SHADOW_ENABLE: 'true',
      }),
    ).toBe(`http://127.0.0.1:3102${endpoint}?communityId=COMM_001`)
  })

  test('routes notice readonly to apps/api when shadow is enabled', () => {
    expect(
      prependRuntimeBaseUrl('/app/notice.listNotices?communityId=COMM_001', {
        ...legacyRuntimeEnv,
        VITE_11COMM_API_SHADOW_ENABLE: 'true',
      }),
    ).toBe('http://127.0.0.1:3102/app/notice.listNotices?communityId=COMM_001')
  })

  test.each([
    '/app/workorder/create',
    '/app/workorder/update',
    '/app/workorder/start',
    '/app/workorder/complete',
    '/app/workorder/audit',
    '/app/workorder/cancel',
    '/app/workorder/copy/finish',
    '/app/visit.auditVisit',
    '/app/profile.changeCommunity',
    '/app/profile.changePassword',
    '/app/activities.saveActivities',
    '/app/activities.updateActivities',
    '/app/activities.deleteActivities',
    '/app/activities.increaseView',
    '/app/activities.likeActivity',
    '/app/activities.updateStatus',
    '/app/activities.updateLike',
    '/app/activities.updateCollect',
  ])('keeps work-order mutation %s on the legacy runtime when shadow is enabled', (endpoint) => {
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

  test('routes activity readonly to apps/api when shadow is enabled', () => {
    expect(
      prependRuntimeBaseUrl('/app/activities.listActivitiess?communityId=COMM_001', {
        ...legacyRuntimeEnv,
        VITE_SERVER_BASEURL: 'http://127.0.0.1:3101',
        VITE_11COMM_API_SHADOW_ENABLE: 'true',
      }),
    ).toBe('http://127.0.0.1:3102/app/activities.listActivitiess?communityId=COMM_001')
  })

  test('routes appointment readonly list to apps/api while keeping confirm write on legacy runtime', () => {
    const shadowEnv = {
      ...legacyRuntimeEnv,
      VITE_SERVER_BASEURL: 'http://127.0.0.1:3101',
      VITE_11COMM_API_SHADOW_ENABLE: 'true',
    }

    expect(prependRuntimeBaseUrl('/app/communitySpace.listCommunitySpaceConfirmOrder?communityId=COMM_001', shadowEnv)).toBe(
      'http://127.0.0.1:3102/app/communitySpace.listCommunitySpaceConfirmOrder?communityId=COMM_001',
    )
    expect(prependRuntimeBaseUrl('/app/communitySpace.saveCommunitySpaceConfirmOrder', shadowEnv)).toBe(
      'http://127.0.0.1:3101/app/communitySpace.saveCommunitySpaceConfirmOrder',
    )
  })

  test('routes complaint readonly paths to apps/api while keeping complaint writes on legacy runtime', () => {
    const shadowEnv = {
      ...legacyRuntimeEnv,
      VITE_SERVER_BASEURL: 'http://127.0.0.1:3101',
      VITE_11COMM_API_SHADOW_ENABLE: 'true',
    }

    for (const endpoint of [
      '/app/auditUser.listAuditComplaints',
      '/app/auditUser.listAuditHistoryComplaints',
      '/app/complaint.listComplaintEvent',
      '/app/complaintAppraise.listComplaintAppraise',
    ]) {
      expect(prependRuntimeBaseUrl(`${endpoint}?communityId=COMM_001`, shadowEnv)).toBe(
        `http://127.0.0.1:3102${endpoint}?communityId=COMM_001`,
      )
    }

    for (const endpoint of [
      '/app/complaint',
      '/app/complaint.auditComplaint',
      '/app/complaintAppraise.replyComplaintAppraise',
    ]) {
      expect(prependRuntimeBaseUrl(endpoint, shadowEnv)).toBe(`http://127.0.0.1:3101${endpoint}`)
    }
  })

  test('routes contact readonly paths to apps/api while keeping online status writes on legacy runtime', () => {
    const shadowEnv = {
      ...legacyRuntimeEnv,
      VITE_SERVER_BASEURL: 'http://127.0.0.1:3101',
      VITE_11COMM_API_SHADOW_ENABLE: 'true',
    }

    for (const endpoint of [
      '/app/contact.listContacts',
      '/app/contact.getContactDetail',
      '/app/contact.getContactsByDepartment',
      '/app/contact.searchContacts',
      '/app/contact.getDepartments',
      '/app/contact.getFavoriteContacts',
      '/app/contact.getEmergencyContacts',
    ]) {
      expect(prependRuntimeBaseUrl(`${endpoint}?communityId=COMM_001`, shadowEnv)).toBe(
        `http://127.0.0.1:3102${endpoint}?communityId=COMM_001`,
      )
    }

    expect(prependRuntimeBaseUrl('/app/contact.updateOnlineStatus', shadowEnv)).toBe(
      'http://127.0.0.1:3101/app/contact.updateOnlineStatus',
    )
  })

  test('routes room and unit readonly paths to apps/api when shadow is enabled', () => {
    const shadowEnv = {
      ...legacyRuntimeEnv,
      VITE_SERVER_BASEURL: 'http://127.0.0.1:3101',
      VITE_11COMM_API_SHADOW_ENABLE: 'true',
    }

    for (const endpoint of [
      '/app/room.queryRooms',
      '/app/room.queryRoomDetail',
      '/app/unit.queryUnits',
      '/app/unit.queryUnitDetail',
    ]) {
      expect(prependRuntimeBaseUrl(`${endpoint}?communityId=COMM_001`, shadowEnv)).toBe(
        `http://127.0.0.1:3102${endpoint}?communityId=COMM_001`,
      )
    }
  })

  test('routes owner readonly query to apps/api while keeping owner writes on legacy runtime', () => {
    const shadowEnv = {
      ...legacyRuntimeEnv,
      VITE_SERVER_BASEURL: 'http://127.0.0.1:3101',
      VITE_11COMM_API_SHADOW_ENABLE: 'true',
    }

    expect(prependRuntimeBaseUrl('/app/owner.queryOwnerAndMembers?communityId=COMM_001', shadowEnv)).toBe(
      'http://127.0.0.1:3102/app/owner.queryOwnerAndMembers?communityId=COMM_001',
    )

    for (const endpoint of [
      '/app/owner.saveRoomOwner',
      '/app/owner.editOwner',
      '/app/owner.deleteOwner',
    ]) {
      expect(prependRuntimeBaseUrl(endpoint, shadowEnv)).toBe(`http://127.0.0.1:3101${endpoint}`)
    }
  })

  test('falls back to existing runtime base when shadow is disabled', () => {
    expect(
      prependRuntimeBaseUrl('/app/fee.listFee', {
        ...legacyRuntimeEnv,
        VITE_11COMM_API_SHADOW_ENABLE: 'false',
      }),
    ).toBe('http://legacy.example.com/app/fee.listFee')
  })

  test.each([
    '/app/feeConfig.listFeeConfigs',
    '/app/reportFeeMonthStatistics.queryReportFeeSummary',
    '/app/reportFeeMonthStatistics/queryPayFeeDetail',
    '/app/dataReport.queryFeeDataReport',
  ])('falls back to existing runtime base for fee/report %s when shadow is disabled', (endpoint) => {
    expect(
      prependRuntimeBaseUrl(`${endpoint}?communityId=COMM_001`, {
        ...legacyRuntimeEnv,
        VITE_11COMM_API_SHADOW_ENABLE: 'false',
      }),
    ).toBe(`http://legacy.example.com${endpoint}?communityId=COMM_001`)
  })

  test('routes callComponent core/list to apps/api when shadow is enabled (Phase7 batch1)', () => {
    expect(
      prependRuntimeBaseUrl('/callComponent/core/list', {
        ...legacyRuntimeEnv,
        VITE_11COMM_API_SHADOW_ENABLE: 'true',
      }),
    ).toBe('http://127.0.0.1:3102/callComponent/core/list')
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
    expect(prependRuntimeBaseUrl('/app/floor.queryFloorDetail', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/floor.queryFloorDetail',
    )
    expect(prependRuntimeBaseUrl('/app/ownerRepair.listOwnerRepairs', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/ownerRepair.listOwnerRepairs',
    )
    expect(prependRuntimeBaseUrl('/app/ownerRepair.saveOwnerRepair', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/ownerRepair.saveOwnerRepair',
    )
    expect(prependRuntimeBaseUrl('/app/workorder/copy/list', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/workorder/copy/list',
    )
    expect(prependRuntimeBaseUrl('/app/workorder/task/list', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/workorder/task/list',
    )
    expect(prependRuntimeBaseUrl('/app/workorder/task/items', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/workorder/task/items',
    )
    expect(prependRuntimeBaseUrl('/app/visit.getVisit', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/visit.getVisit',
    )
    expect(prependRuntimeBaseUrl('/app/visit.getVisitDetail', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/visit.getVisitDetail',
    )
    expect(prependRuntimeBaseUrl('/app/profile.getUserProfile', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/profile.getUserProfile',
    )
    expect(prependRuntimeBaseUrl('/app/profile.listCommunities', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/profile.listCommunities',
    )
    expect(prependRuntimeBaseUrl('/app/profile.listAttendanceRecords', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/profile.listAttendanceRecords',
    )
    expect(prependRuntimeBaseUrl('/app/video.listMonitorArea', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/video.listMonitorArea',
    )
    expect(prependRuntimeBaseUrl('/app/video.listStaffMonitorMachine', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/video.listStaffMonitorMachine',
    )
    expect(prependRuntimeBaseUrl('/app/video.getPlayVideoUrl', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/video.getPlayVideoUrl',
    )
    expect(prependRuntimeBaseUrl('/app/notice.listNotices', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/notice.listNotices',
    )
    expect(prependRuntimeBaseUrl('/app/activities.listActivitiess', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/activities.listActivitiess',
    )
    expect(prependRuntimeBaseUrl('/app/room.queryRooms', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/room.queryRooms',
    )
    expect(prependRuntimeBaseUrl('/app/room.queryRoomDetail', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/room.queryRoomDetail',
    )
    expect(prependRuntimeBaseUrl('/app/unit.queryUnits', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/unit.queryUnits',
    )
    expect(prependRuntimeBaseUrl('/app/unit.queryUnitDetail', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/unit.queryUnitDetail',
    )
    expect(prependRuntimeBaseUrl('/app/owner.queryOwnerAndMembers', productionEnv)).toBe(
      'https://01s-11-server.ruan-cat.com/app/owner.queryOwnerAndMembers',
    )
  })
})
