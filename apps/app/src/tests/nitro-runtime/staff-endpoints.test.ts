import { describe, expect, test } from 'vitest'
import { createStaffEndpointDefinitions } from '../../../server/modules/staff/endpoints'
import { createStaffMockRepository } from '../../../server/modules/staff/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'
import { formatStaffList } from '../../../src/api/staff'

describe('staff endpoints', () => {
  test('keeps literal routes ahead of the dynamic staff detail route', () => {
    const registry = createEndpointRegistry(createStaffEndpointDefinitions(createStaffMockRepository()))

    expect(findEndpointDefinition(registry, 'GET', '/app/staff/by-department')?.url).toBe('/app/staff/by-department')
    expect(findEndpointDefinition(registry, 'GET', '/app/staff/search')?.url).toBe('/app/staff/search')
    expect(findEndpointDefinition(registry, 'GET', '/app/staff/STAFF_001')?.url).toBe('/app/staff/:staffId')
  })

  test('keeps query list and dynamic detail response structures stable', async () => {
    const registry = createEndpointRegistry(createStaffEndpointDefinitions(createStaffMockRepository()))

    const listResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/query.staff.infos',
      query: {
        page: 1,
        row: 5,
      },
    })

    const staffId = listResponse.data.staffs[0].id

    const detailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: `/app/staff/${staffId}`,
    })

    expect(Array.isArray(listResponse.data.staffs)).toBe(true)
    expect(detailResponse.data).toMatchObject({
      id: staffId,
    })
  })

  test('query.staff.infos applies fuzzy search for name (substring, tel digits, orgName param)', async () => {
    const registry = createEndpointRegistry(createStaffEndpointDefinitions(createStaffMockRepository()))

    const full = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/query.staff.infos',
      query: { page: 1, row: 1000 },
    })
    const sample = full.data.staffs[0] as { name: string, tel: string, orgName: string }

    const nameSub = sample.name.slice(0, 1)
    const byNameSub = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/query.staff.infos',
      query: { page: 1, row: 1000, name: nameSub },
    })
    expect(byNameSub.data.staffs.some((s: { name: string }) => s.name === sample.name)).toBe(true)

    const last4 = sample.tel.replace(/\D/g, '').slice(-4)
    const byTel = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/query.staff.infos',
      query: { page: 1, row: 1000, name: last4 },
    })
    expect(byTel.data.staffs.some((s: { tel: string }) => s.tel === sample.tel)).toBe(true)

    const orgSub = sample.orgName.slice(0, 2)
    const byOrgFuzzy = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/query.staff.infos',
      query: { page: 1, row: 1000, orgName: orgSub },
    })
    expect(
      byOrgFuzzy.data.staffs.every((s: { orgName: string }) => s.orgName.includes(orgSub)),
    ).toBe(true)
  })

  test('query.staff.infos name supports pinyin-pro (initials, full spell, dept pinyin)', async () => {
    const repo = createStaffMockRepository()
    repo.addStaff({
      name: '张三',
      tel: '13900000001',
      orgName: '客服部',
      position: '客服专员',
      initials: 'Z',
      email: 'zs@test.com',
      isOnline: true,
    })
    const registry = createEndpointRegistry(createStaffEndpointDefinitions(repo))

    const byInitials = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/query.staff.infos',
      query: { page: 1, row: 200, name: 'zs' },
    })
    expect(byInitials.data.staffs.some((s: { name: string }) => s.name === '张三')).toBe(true)

    const byFull = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/query.staff.infos',
      query: { page: 1, row: 200, name: 'zhangsan' },
    })
    expect(byFull.data.staffs.some((s: { name: string }) => s.name === '张三')).toBe(true)

    const byDeptPinyin = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/query.staff.infos',
      query: { page: 1, row: 200, name: 'kefu' },
    })
    expect(byDeptPinyin.data.staffs.some((s: { name: string }) => s.name === '张三')).toBe(true)

    const byOrgParamPinyin = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/query.staff.infos',
      query: { page: 1, row: 200, orgName: 'kfb' },
    })
    expect(byOrgParamPinyin.data.staffs.some((s: { orgName: string }) => s.orgName === '客服部')).toBe(
      true,
    )
  })

  test('formatStaffList keeps same-initial search results visible', () => {
    const groups = formatStaffList([
      {
        id: 'STAFF_ZHANG_XIA',
        name: '张霞',
        tel: '13800138001',
        orgName: '客服部',
        initials: 'Z',
        position: '客服专员',
        isOnline: true,
      },
      {
        id: 'STAFF_ZHANG_XIUYING',
        name: '张秀英',
        tel: '13800138002',
        orgName: '工程部',
        initials: 'Z',
        position: '工程专员',
        isOnline: false,
      },
    ])

    expect(groups).toHaveLength(1)
    expect(groups[0]).toMatchObject({
      initials: 'Z',
      staffs: [
        { name: '张霞' },
        { name: '张秀英' },
      ],
    })
  })
})
