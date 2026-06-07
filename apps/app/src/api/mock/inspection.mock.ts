/**
 * 巡检模块 Mock 接口。
 */

import type {
  InspectionItemTitle,
  InspectionSubmitParams,
  InspectionTask,
  InspectionTaskDetail,
  InspectionTodayReport,
  InspectionTransferParams,
} from '../../types/inspection'
import {
  createPaginationResponse,
  defineUniAppMock,
  errorResponse,
  formatDateTime,
  generateChineseName,
  generateId,
  successResponse,
} from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

/** 巡检任务状态字典。 */
const inspectionStates = [
  { value: '20200405', label: '待开始' },
  { value: '20200406', label: '进行中' },
  { value: '20200407', label: '已完成' },
  { value: '20200408', label: '待补检' },
]

/** 巡检签到方式字典。 */
const inspectionSignTypes = [
  { value: 'GPS', label: '移动定位' },
  { value: 'QRCODE', label: '二维码扫描' },
  { value: 'MANUAL', label: '手动签到' },
]

/** 巡检计划名称库。 */
const inspectionPlanNames = [
  '小区日常巡检',
  '消防设施检查',
  '电梯运行检查',
  '公共区域巡查',
  '绿化环境检查',
  '安防设备巡检',
]

/** 巡检点位名称库。 */
const inspectionItemNames = [
  '大门岗亭检查',
  '消防通道检查',
  '电梯运行检查',
  '监控设备检查',
  '路灯照明检查',
  '绿化养护检查',
]

/** 巡检任务 mock 数据。 */
const inspectionTasks: InspectionTask[] = Array.from({ length: 18 }, (_, index) => createInspectionTask(index + 1))

/** 巡检任务明细 mock 数据。 */
const inspectionTaskDetails = new Map<string, InspectionTaskDetail[]>(
  inspectionTasks.map(task => [
    task.taskId,
    Array.from({ length: 4 }, (_, index) => createInspectionTaskDetail(task.taskId, index + 1)),
  ]),
)

/** 巡检表单标题 mock 数据。 */
const inspectionItemTitles = new Map<string, InspectionItemTitle[]>(
  ['ITEM_001', 'ITEM_002', 'ITEM_003', 'ITEM_004'].map(itemId => [
    itemId,
    [
      createInspectionItemTitle('TITLE_RADIO_001', '设施状态', '1001', ['完好', '损坏', '需维修']),
      createInspectionItemTitle('TITLE_CHECK_001', '存在问题', '2002', ['设备异常', '卫生问题', '安全隐患']),
      createInspectionItemTitle('TITLE_TEXT_001', '详细说明', '3003', []),
    ],
  ]),
)

/** 可转派员工 mock 数据。 */
const staffList = Array.from({ length: 12 }, (_, index) => ({
  userId: `USER_${(index + 1).toString().padStart(3, '0')}`,
  userName: generateChineseName(),
}))

/** 今日巡检统计 mock 数据。 */
const todayReports: InspectionTodayReport[] = staffList.slice(0, 6).map((staff, index) => ({
  staffId: staff.userId,
  staffName: staff.userName,
  finishCount: index + 1,
  waitCount: Math.max(0, 5 - index),
}))

export default defineUniAppMock([
  {
    url: '/app/inspection.listInspectionTasks',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const tasks = filterInspectionTasks(inspectionTasks, {
        moreState: asOptionalString(params.moreState),
        isToday: Number(params.isToday || 0),
        canReexamine: asOptionalString(params.canReexamine),
        planInsTime: asOptionalString(params.planInsTime),
      })

      return successResponse(createPaginationResponse(
        tasks,
        asPositiveNumber(params.page, 1),
        asPositiveNumber(params.row, 10),
      ))
    },
  },
  {
    url: '/app/inspection.getTodayReport',
    method: ['GET', 'POST'],
    body: () => successResponse(todayReports),
  },
  {
    url: '/app/inspection.listInspectionTaskDetails',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const details = filterInspectionDetails({
        inspectionId: asOptionalString(params.inspectionId),
        qrCodeTime: asOptionalString(params.qrCodeTime),
        state: asOptionalString(params.state),
        taskId: asOptionalString(params.taskId),
      })

      return successResponse(createPaginationResponse(
        details,
        asPositiveNumber(params.page, 1),
        asPositiveNumber(params.row, 100),
      ))
    },
  },
  {
    url: '/app/inspection.listInspectionItemTitles',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const itemId = asOptionalString(params.itemId)
      if (!itemId) {
        return errorResponse('巡检项ID不能为空', '400')
      }

      return successResponse(createPaginationResponse(
        inspectionItemTitles.get(itemId) || [],
        asPositiveNumber(params.page, 1),
        asPositiveNumber(params.row, 100),
      ))
    },
  },
  {
    url: '/app/inspection.submitInspection',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const result = submitInspection(context.body as Partial<InspectionSubmitParams> | undefined)

      if (!result) {
        return errorResponse('提交失败', '400')
      }

      return successResponse({ success: true }, '提交成功')
    },
  },
  {
    url: '/app/staff.listStaffs',
    method: ['GET', 'POST'],
    body: () => successResponse(staffList),
  },
  {
    url: '/app/inspection.transferTask',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const result = transferTask(context.body as Partial<InspectionTransferParams> | undefined)

      if (!result) {
        return errorResponse('流转失败', '400')
      }

      return successResponse({ success: true }, '流转成功')
    },
  },
])

/** 创建巡检任务行。 */
function createInspectionTask(index: number): InspectionTask {
  const status = inspectionStates[index % inspectionStates.length]
  const signType = inspectionSignTypes[index % inspectionSignTypes.length]
  const planTime = Date.now() + (index % 7 - 3) * 86400000

  return {
    taskId: `TASK_${index.toString().padStart(3, '0')}`,
    inspectionPlanId: `PLAN_${((index % 6) + 1).toString().padStart(3, '0')}`,
    inspectionPlanName: inspectionPlanNames[index % inspectionPlanNames.length],
    planUserName: generateChineseName(),
    planInsTime: formatDateTime(planTime),
    signTypeName: signType.label,
    stateName: status.label,
    state: status.value,
    originalPlanUserId: `USER_${((index % 12) + 1).toString().padStart(3, '0')}`,
    originalPlanUserName: generateChineseName(),
    planUserId: `USER_${((index % 12) + 1).toString().padStart(3, '0')}`,
    signType: signType.value,
    statusCd: '0',
  }
}

/** 创建巡检任务明细行。 */
function createInspectionTaskDetail(taskId: string, index: number): InspectionTaskDetail {
  const status = inspectionStates[index % 3]
  const startHour = 8 + index

  return {
    taskDetailId: `DETAIL_${taskId}_${index.toString().padStart(3, '0')}`,
    taskId,
    inspectionId: `INSP_${index.toString().padStart(3, '0')}`,
    inspectionName: inspectionItemNames[index % inspectionItemNames.length],
    itemId: `ITEM_${index.toString().padStart(3, '0')}`,
    state: status.value,
    stateName: status.label,
    pointStartTime: `${String(startHour).padStart(2, '0')}:00`,
    pointEndTime: `${String(startHour + 1).padStart(2, '0')}:00`,
  }
}

/** 创建巡检表单标题。 */
function createInspectionItemTitle(
  titleId: string,
  itemTitle: string,
  titleType: string,
  values: string[],
): InspectionItemTitle {
  return {
    titleId,
    itemTitle,
    titleType,
    radio: titleType === '2002' ? [] : '',
    inspectionItemTitleValueDtos: values.map(itemValue => ({ itemValue })),
  }
}

/** 按巡检任务列表查询条件筛选。 */
function filterInspectionTasks(
  tasks: InspectionTask[],
  params: { canReexamine?: string, isToday?: number, moreState?: string, planInsTime?: string },
): InspectionTask[] {
  const today = formatDateTime().slice(0, 10)

  return tasks
    .filter(task => !params.moreState || params.moreState.split(',').includes(task.state))
    .filter(task => params.isToday !== 1 || task.planInsTime.startsWith(today))
    .filter(task => params.canReexamine !== '2000' || task.state === '20200405' || task.state === '20200408')
    .filter(task => !params.planInsTime || task.planInsTime.startsWith(params.planInsTime))
}

/** 按巡检明细查询条件筛选。 */
function filterInspectionDetails(params: {
  inspectionId?: string
  qrCodeTime?: string
  state?: string
  taskId?: string
}): InspectionTaskDetail[] {
  const details = params.taskId
    ? [...(inspectionTaskDetails.get(params.taskId) || [])]
    : [...inspectionTaskDetails.values()].flat()

  return details
    .filter(detail => !params.inspectionId || detail.inspectionId === params.inspectionId)
    .filter(detail => !params.state || detail.state === params.state)
    .filter(detail => !params.qrCodeTime || detail.pointStartTime?.startsWith(params.qrCodeTime.slice(0, 2)))
}

/** 提交巡检结果并更新内存态明细。 */
function submitInspection(data: Partial<InspectionSubmitParams> | undefined): boolean {
  const taskId = asOptionalString(data?.taskId)
  const taskDetailId = asOptionalString(data?.taskDetailId)
  const details = taskId ? inspectionTaskDetails.get(taskId) : undefined
  const detail = details?.find(item => item.taskDetailId === taskDetailId)

  if (!detail) {
    return false
  }

  detail.state = '20200407'
  detail.stateName = '已完成'
  detail.description = asOptionalString(data?.description) || '巡检完成'
  detail.photos = (data?.photos || []).map(url => ({ url, fileId: generateId('FILE') }))

  return true
}

/** 流转巡检任务并更新负责人名称。 */
function transferTask(data: Partial<InspectionTransferParams> | undefined): boolean {
  const taskId = asOptionalString(data?.taskId)
  const staffName = asOptionalString(data?.staffName)
  const task = inspectionTasks.find(item => item.taskId === taskId)

  if (!task || !staffName) {
    return false
  }

  task.planUserName = staffName
  task.planUserId = asOptionalString(data?.staffId) || task.planUserId

  return true
}

/** 合并 Vite mock 的 query、body 与 params。 */
function getRequestParams(context: MockContext): Record<string, unknown> {
  return {
    ...(context.query || {}),
    ...(context.body || {}),
    ...(context.params || {}),
  }
}

/** 将未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}

/** 将未知值收敛为正数。 */
function asPositiveNumber(value: unknown, fallback: number): number {
  const numberValue = Number(asOptionalString(value))

  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : fallback
}
