import { describe, expect, test } from 'vitest'
import { workbenchNavigationKeys } from '@/pages/work-dashboard/navigation'
import {
  homeFeaturedEntries,
  homeSections,
} from '../home-menu-config'

describe('home menu config', () => {
  test('all homepage menus reference registered navigation keys', () => {
    const menus = [
      ...homeFeaturedEntries,
      ...homeSections.flatMap(section => section.entries),
    ]

    expect(menus.length).toBeGreaterThan(0)

    menus.forEach((menu) => {
      expect(workbenchNavigationKeys).toContain(menu.navigationKey)
    })
  })

  test('homepage preserves required legacy route entrances', () => {
    const navigationKeys = new Set([
      ...homeFeaturedEntries.map(entry => entry.navigationKey),
      ...homeSections.flatMap(section => section.entries.map(entry => entry.navigationKey)),
    ])

    expect([...navigationKeys]).toEqual(expect.arrayContaining([
      'toComplaintList',
      'toRepairDispatch',
      'toInspectionTaskList',
      'toMaintenanceTaskList',
      'toRepairList',
      'toRepairFinish',
      'toPurchaseApplyAudit',
      'toItemOutAudit',
      'toAllocationAudit',
      'toItemRelease',
      'toVisitList',
      'toWorkStart',
      'toWorkDo',
      'toWorkCopy',
      'toOaWorkflow',
    ]))
  })

  test('homepage keeps explicit carbon icon metadata and uses static image fallbacks for broken mp-weixin icons', () => {
    const menus = [
      ...homeFeaturedEntries,
      ...homeSections.flatMap(section => section.entries),
    ]

    menus.forEach((menu) => {
      expect(menu.icon).toMatch(/^i-/)
    })

    const iconMap = Object.fromEntries(menus.map(menu => [menu.id, menu.icon]))
    const iconImageMap = Object.fromEntries(
      menus
        .filter(menu => menu.iconImage)
        .map(menu => [menu.id, menu.iconImage]),
    )

    expect(iconMap).toMatchObject({
      'complaint-todo': 'i-carbon-warning',
      'repair-dispatch': 'i-carbon-tools',
      'inspection-task': 'i-carbon-location',
      'purchase-audit': 'i-carbon-shopping-cart',
      'item-out-audit': 'i-carbon-delivery',
      'allocation-audit': 'i-carbon-arrows-horizontal',
      'release': 'i-carbon-box',
      'repair-finish': 'i-carbon-task-complete',
      'work-start': 'i-carbon-edit',
      'work-do': 'i-carbon-task',
      'work-copy': 'i-carbon-copy',
    })

    expect(iconImageMap).toEqual({
      'complaint-todo': '/static/image/index_complaint.png',
      'inspection-task': '/static/image/index_inspection.png',
      'repair-finish': '/static/image/index_repair.png',
      'work-do': '/static/image/index_dealRepair.png',
    })
  })

  test('homepage follows the compact application-style information architecture', () => {
    expect(homeFeaturedEntries.map(entry => entry.id)).toEqual([
      'complaint-todo',
      'repair-dispatch',
    ])

    expect(homeSections.map(section => section.title)).toEqual([
      '快捷入口',
      '维修中心',
      '工单协同',
    ])

    expect(homeSections[0]?.entries.map(entry => entry.id)).toEqual([
      'inspection-task',
      'maintenance-task',
      'purchase-audit',
      'item-out-audit',
      'allocation-audit',
      'visit',
      'release',
      'oa-workflow',
    ])

    expect(homeSections[1]?.entries.map(entry => entry.id)).toEqual([
      'repair-order',
      'repair-dispatch-panel',
      'repair-finish',
    ])

    expect(homeSections[2]?.entries.map(entry => entry.id)).toEqual([
      'work-start',
      'work-do',
      'work-copy',
    ])
  })
})
