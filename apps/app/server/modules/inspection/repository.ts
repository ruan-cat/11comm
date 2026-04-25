import type {
  InspectionItemTitle,
  InspectionSubmitParams,
  InspectionTask,
  InspectionTaskDetail,
  InspectionTodayReport,
  InspectionTransferParams,
} from '../../../src/types/inspection.ts'
import dayjs from 'dayjs'
import {
  INSPECTION_SIGN_TYPES,
  INSPECTION_STATES,
  INSPECTION_TITLE_TYPES,
} from '../../../src/constants/inspection.ts'
import {
  createPaginationResponse,
  formatDateTime,
  generateChineseName,
  generateId,
} from '../../shared/runtime/common-utils.ts'

export interface InspectionModuleRepository {
  getItemTitles: (params: { communityId?: string, itemId: string, page: number, row: number }) => ReturnType<typeof createPaginationResponse<InspectionItemTitle>>
  getStaffList: (params: { communityId?: string }) => Array<{ userId: string, userName: string }>
  getTaskDetail: (params: {
    communityId?: string
    inspectionId?: string
    page: number
    planUserId?: string
    qrCodeTime?: string
    queryTime?: string
    row: number
    state?: string
    taskId?: string
  }) => ReturnType<typeof createPaginationResponse<InspectionTaskDetail>>
  getTaskList: (params: {
    canReexamine?: string
    isToday?: number
    moreState?: string
    page: number
    planInsTime?: string
    row: number
  }) => ReturnType<typeof createPaginationResponse<InspectionTask>>
  getTodayReport: (params: { communityId?: string, queryTime?: string }) => InspectionTodayReport[]
  submitInspection: (data: InspectionSubmitParams) => boolean
  transferTask: (data: InspectionTransferParams) => boolean
}

/** 创建 `inspection` 模块的 mock 内存仓储。 */
export function createInspectionMockRepository(): InspectionModuleRepository {
  return new InspectionDatabase()
}

/** 巡检计划名称库。 */
const INSPECTION_PLAN_NAMES = [
  '小区日常巡检',
  '消防设施检查',
  '电梯运行检查',
  '公共区域巡查',
  '绿化环境检查',
  '安防设备巡检',
  '车库安全巡查',
  '垃圾分类检查',
  '水电设施巡检',
  '楼道安全检查',
]

/** 巡检项名称库。 */
const INSPECTION_ITEM_NAMES = [
  '大门岗亭检查',
  '消防通道检查',
  '电梯运行检查',
  '监控设备检查',
  '路灯照明检查',
  '绿化养护检查',
  '垃圾清运检查',
  '停车秩序检查',
  '水电设施检查',
  '公共设施检查',
]

/** 巡检项标题库。 */
const INSPECTION_TITLE_LIBRARY = {
  radio: [
    { title: '设施状态', values: ['完好', '损坏', '需维修'] },
    { title: '卫生情况', values: ['良好', '一般', '较差'] },
    { title: '安全状况', values: ['安全', '存在隐患', '危险'] },
  ],
  checkbox: [
    { title: '存在问题', values: ['设备异常', '卫生问题', '安全隐患', '其他问题'] },
    { title: '需要改进', values: ['增加设施', '加强管理', '定期维护', '人员培训'] },
  ],
  text: [
    { title: '详细说明', placeholder: '请详细描述巡检情况' },
    { title: '整改建议', placeholder: '请填写整改建议' },
    { title: '备注信息', placeholder: '其他需要说明的内容' },
  ],
}

/** inspection 模块的 mock 内存仓储实现。 */
class InspectionDatabase implements InspectionModuleRepository {
  private readonly itemTitles = new Map<string, InspectionItemTitle[]>()
  private readonly staffList: Array<{ userId: string, userName: string }> = []
  private readonly taskDetails = new Map<string, InspectionTaskDetail[]>()
  private readonly tasks: InspectionTask[] = []
  private readonly todayReports: InspectionTodayReport[] = []

  constructor() {
    this.initData()
  }

  getTaskList(params: {
    canReexamine?: string
    isToday?: number
    moreState?: string
    page: number
    planInsTime?: string
    row: number
  }) {
    let filteredTasks = [...this.tasks]

    if (params.moreState) {
      const states = params.moreState.split(',')
      filteredTasks = filteredTasks.filter(task => states.includes(task.state))
    }

    if (params.isToday === 1) {
      const today = dayjs().format('YYYY-MM-DD')
      filteredTasks = filteredTasks.filter(task => task.planInsTime.startsWith(today))
    }

    if (params.canReexamine === '2000') {
      filteredTasks = filteredTasks.filter(task =>
        task.state === '20200405' || task.state === '20200408')
    }

    if (params.planInsTime) {
      filteredTasks = filteredTasks.filter(task => task.planInsTime.startsWith(params.planInsTime))
    }

    return cloneValue(createPaginationResponse(filteredTasks, params.page, params.row))
  }

  getTodayReport(_params: { communityId?: string, queryTime?: string }) {
    return cloneValue(this.todayReports)
  }

  getTaskDetail(params: {
    communityId?: string
    inspectionId?: string
    page: number
    planUserId?: string
    qrCodeTime?: string
    queryTime?: string
    row: number
    state?: string
    taskId?: string
  }) {
    let details: InspectionTaskDetail[] = []

    if (params.taskId) {
      details = this.taskDetails.get(params.taskId) || []
    }
    else if (params.planUserId) {
      this.taskDetails.forEach((taskDetails) => {
        details.push(...taskDetails)
      })
    }
    else if (params.inspectionId) {
      this.taskDetails.forEach((taskDetails) => {
        details.push(...taskDetails.filter(detail => detail.inspectionId === params.inspectionId))
      })
    }
    else {
      this.taskDetails.forEach((taskDetails) => {
        details.push(...taskDetails)
      })
    }

    if (params.state) {
      details = details.filter(detail => detail.state === params.state)
    }

    if (params.qrCodeTime) {
      const [hour] = params.qrCodeTime.split(':')
      details = details.filter((detail) => {
        if (!detail.pointStartTime) {
          return false
        }

        const [startHour] = detail.pointStartTime.split(':')
        return startHour === hour
      })
    }

    return cloneValue(createPaginationResponse(details, params.page, params.row))
  }

  getItemTitles(params: { communityId?: string, itemId: string, page: number, row: number }) {
    const titles = this.itemTitles.get(params.itemId) || []
    return cloneValue(createPaginationResponse(titles, params.page, params.row))
  }

  submitInspection(data: InspectionSubmitParams) {
    const details = this.taskDetails.get(data.taskId)
    if (!details) {
      return false
    }

    const detail = details.find(item => item.taskDetailId === data.taskDetailId)
    if (!detail) {
      return false
    }

    const completedStatus = INSPECTION_STATES.find(item => item.value === '20200407')
    if (!completedStatus) {
      return false
    }

    detail.state = completedStatus.value as string
    detail.stateName = completedStatus.label
    detail.description = data.description
    detail.photos = data.photos.map(url => ({
      url,
      fileId: generateId('FILE'),
    }))
    return true
  }

  getStaffList(_params: { communityId?: string }) {
    return cloneValue(this.staffList)
  }

  transferTask(data: InspectionTransferParams) {
    const task = this.tasks.find(item => item.taskId === data.taskId)
    if (!task) {
      return false
    }

    task.planUserName = data.staffName
    return true
  }

  /** 初始化巡检种子数据。 */
  private initData() {
    this.tasks.push(...Array.from({ length: 20 }, (_, index) => generateInspectionTask(index + 1)))

    for (const task of this.tasks) {
      const detailCount = Math.floor(Math.random() * 5) + 3
      const details = Array.from({ length: detailCount }, (_, index) =>
        generateInspectionTaskDetail(task.taskId, index + 1))
      this.taskDetails.set(task.taskId, details)
    }

    this.todayReports.push(...Array.from({ length: 10 }, (_, index) => generateTodayReport(index + 1)))

    for (const itemId of ['ITEM_001', 'ITEM_002', 'ITEM_003', 'ITEM_004', 'ITEM_005']) {
      this.itemTitles.set(itemId, [
        generateInspectionItemTitle(1, 'radio'),
        generateInspectionItemTitle(2, 'checkbox'),
        generateInspectionItemTitle(3, 'text'),
      ])
    }

    this.staffList.push(...Array.from({ length: 20 }, (_, index) => ({
      userId: `USER_${String(index + 1).padStart(3, '0')}`,
      userName: generateChineseName(),
    })))
  }
}

/** 默认供运行时直接复用的 inspection 仓储实例。 */
export const inspectionMockRepository = createInspectionMockRepository()

/** 生成巡检任务。 */
function generateInspectionTask(index: number): InspectionTask {
  const statusItem = INSPECTION_STATES[Math.floor(Math.random() * INSPECTION_STATES.length)]
  const signTypeItem = INSPECTION_SIGN_TYPES[Math.floor(Math.random() * INSPECTION_SIGN_TYPES.length)]
  const planName = INSPECTION_PLAN_NAMES[Math.floor(Math.random() * INSPECTION_PLAN_NAMES.length)]
  const planTime = dayjs().add(Math.floor(Math.random() * 7) - 3, 'day').hour(9 + Math.floor(Math.random() * 9))

  return {
    taskId: `TASK_${String(index).padStart(3, '0')}`,
    inspectionPlanId: `PLAN_${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`,
    inspectionPlanName: planName,
    planUserName: generateChineseName(),
    planInsTime: formatDateTime(planTime),
    signTypeName: signTypeItem.label,
    stateName: statusItem.label,
    state: statusItem.value as string,
  }
}

/** 生成巡检任务详情。 */
function generateInspectionTaskDetail(taskId: string, index: number): InspectionTaskDetail {
  const states = INSPECTION_STATES.slice(0, 3)
  const statusItem = states[Math.floor(Math.random() * states.length)]
  const itemName = INSPECTION_ITEM_NAMES[Math.floor(Math.random() * INSPECTION_ITEM_NAMES.length)]
  const startHour = 9 + Math.floor(Math.random() * 8)
  const pointStartTime = `${String(startHour).padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
  const pointEndTime = `${String(startHour + 1).padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
  const detail: InspectionTaskDetail = {
    taskDetailId: `DETAIL_${String(index).padStart(3, '0')}`,
    taskId,
    inspectionId: `INSP_${String(index).padStart(3, '0')}`,
    inspectionName: itemName,
    itemId: `ITEM_${String(index).padStart(3, '0')}`,
    state: statusItem.value as string,
    stateName: statusItem.label,
    pointStartTime,
    pointEndTime,
  }

  if (statusItem.value === '20200407') {
    detail.description = '巡检情况: 正常; 备注: 无异常'
    detail.photos = [
      { url: `https://picsum.photos/400/300?random=${index}_1`, fileId: `FILE_${index}_1` },
      { url: `https://picsum.photos/400/300?random=${index}_2`, fileId: `FILE_${index}_2` },
    ]
  }

  return detail
}

/** 生成今日巡检统计。 */
function generateTodayReport(index: number): InspectionTodayReport {
  return {
    staffId: `STAFF_${String(index).padStart(3, '0')}`,
    staffName: generateChineseName(),
    finishCount: Math.floor(Math.random() * 10),
    waitCount: Math.floor(Math.random() * 5),
  }
}

/** 生成巡检项标题。 */
function generateInspectionItemTitle(index: number, type: 'radio' | 'checkbox' | 'text'): InspectionItemTitle {
  const titleId = `TITLE_${type.toUpperCase()}_${String(index).padStart(3, '0')}`
  const titleType = INSPECTION_TITLE_TYPES.find(item => item.label === (type === 'radio' ? '单选' : type === 'checkbox' ? '多选' : '文本'))

  if (type === 'radio') {
    const item = INSPECTION_TITLE_LIBRARY.radio[Math.floor(Math.random() * INSPECTION_TITLE_LIBRARY.radio.length)]
    return {
      titleId,
      itemTitle: item.title,
      titleType: titleType?.value as string,
      radio: '',
      inspectionItemTitleValueDtos: item.values.map(value => ({ itemValue: value })),
    }
  }

  if (type === 'checkbox') {
    const item = INSPECTION_TITLE_LIBRARY.checkbox[Math.floor(Math.random() * INSPECTION_TITLE_LIBRARY.checkbox.length)]
    return {
      titleId,
      itemTitle: item.title,
      titleType: titleType?.value as string,
      radio: [],
      inspectionItemTitleValueDtos: item.values.map(value => ({ itemValue: value })),
    }
  }

  const item = INSPECTION_TITLE_LIBRARY.text[Math.floor(Math.random() * INSPECTION_TITLE_LIBRARY.text.length)]
  return {
    titleId,
    itemTitle: item.title,
    titleType: titleType?.value as string,
    radio: '',
    inspectionItemTitleValueDtos: [],
  }
}

/** 克隆仓储返回值，避免外部篡改内部引用。 */
function cloneValue<T>(value: T): T {
  return structuredClone(value)
}
