import type { WorkbenchMenu } from '@/pages/work-dashboard/menu-config'
import { workbenchCategories } from '@/pages/work-dashboard/menu-config'

export interface HomeMenuEntry {
  id: string
  name: string
  navigationKey: WorkbenchMenu['navigationKey']
  icon: WorkbenchMenu['icon']
  iconClass: WorkbenchMenu['iconClass']
  bgClass: WorkbenchMenu['bgClass']
  iconImage?: string
  meta?: string
}

export interface HomeSection {
  id: string
  title: string
  columns: 3 | 4
  entries: HomeMenuEntry[]
}

export const homeHeaderTitle = '智慧社区'
export const homeHeaderSubtitle = '物业工作台'

/** 查找工作台菜单配置 */
function findWorkbenchMenu(id: string): WorkbenchMenu {
  const menu = workbenchCategories
    .flatMap(category => category.menus)
    .find(item => item.id === id)

  if (!menu) {
    throw new Error(`未找到工作台菜单配置: ${id}`)
  }

  return menu
}

/** 生成首页入口配置 */
function createHomeEntry(
  workbenchMenuId: string,
  options: Pick<HomeMenuEntry, 'id'> & Partial<Omit<HomeMenuEntry, 'id' | 'navigationKey'>>,
): HomeMenuEntry {
  const menu = findWorkbenchMenu(workbenchMenuId)

  return {
    id: options.id,
    name: options.name ?? menu.name,
    navigationKey: menu.navigationKey,
    icon: options.icon ?? menu.icon,
    iconClass: options.iconClass ?? menu.iconClass,
    bgClass: options.bgClass ?? menu.bgClass,
    iconImage: options.iconImage,
    meta: options.meta,
  }
}

export const homeFeaturedEntries: HomeMenuEntry[] = [
  createHomeEntry('complaint-todo', {
    id: 'complaint-todo',
    icon: 'i-carbon-warning',
    iconImage: '/static/image/index_complaint.png',
    meta: '投诉工单',
  }),
  createHomeEntry('repair-dispatch-quick', {
    id: 'repair-dispatch',
    meta: '报修派单',
  }),
]

export const homeSections: HomeSection[] = [
  {
    id: 'quick',
    title: '快捷入口',
    columns: 4,
    entries: [
      createHomeEntry('inspection-task', {
        id: 'inspection-task',
        icon: 'i-carbon-location',
        iconImage: '/static/image/index_inspection.png',
      }),
      createHomeEntry('maintenance-task', { id: 'maintenance-task' }),
      createHomeEntry('purchase-audit', { id: 'purchase-audit', icon: 'i-carbon-shopping-cart' }),
      createHomeEntry('item-out-audit', { id: 'item-out-audit', icon: 'i-carbon-delivery' }),
      createHomeEntry('allocation-audit', { id: 'allocation-audit', icon: 'i-carbon-arrows-horizontal' }),
      createHomeEntry('visit', { id: 'visit' }),
      createHomeEntry('release', { id: 'release', icon: 'i-carbon-box' }),
      createHomeEntry('oa-workflow', { id: 'oa-workflow', icon: 'i-carbon-document', name: 'OA待办' }),
    ],
  },
  {
    id: 'repair',
    title: '维修中心',
    columns: 3,
    entries: [
      createHomeEntry('repair-order', { id: 'repair-order' }),
      createHomeEntry('repair-dispatch', { id: 'repair-dispatch-panel', name: '维修待办单' }),
      createHomeEntry('repair-finish', {
        id: 'repair-finish',
        icon: 'i-carbon-task-complete',
        iconImage: '/static/image/index_repair.png',
        name: '维修已办',
      }),
    ],
  },
  {
    id: 'work',
    title: '工单协同',
    columns: 4,
    entries: [
      createHomeEntry('work-start', { id: 'work-start', icon: 'i-carbon-edit' }),
      createHomeEntry('work-do', {
        id: 'work-do',
        icon: 'i-carbon-task',
        iconImage: '/static/image/index_dealRepair.png',
      }),
      createHomeEntry('work-copy', { id: 'work-copy', icon: 'i-carbon-copy' }),
    ],
  },
]
