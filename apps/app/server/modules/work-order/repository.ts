import type {
  AuditWorkOrderParams,
  CompleteWorkOrderParams,
  CreateWorkOrderParams,
  UpdateWorkOrderParams,
  WorkOrder,
  WorkOrderCopyUser,
  WorkOrderDetail,
  WorkOrderLog,
  WorkTask,
  WorkTaskItem,
} from '../../../src/types/work-order.ts'
import dayjs from 'dayjs'
import {
  createPaginationResponse,
  formatDateTime,
  generateBusinessId,
  generateChineseName,
} from '../../shared/runtime/common-utils.ts'

export interface WorkOrderModuleRepository {
  audit: (params: AuditWorkOrderParams) => boolean
  cancel: (orderId: string, reason?: string) => boolean
  complete: (params: CompleteWorkOrderParams) => boolean
  create: (params: CreateWorkOrderParams) => string
  finishCopyWork: (params: { copyId: string, deductionMoney: number, deductionReason: string, itemId: string, score: number }) => boolean
  getCopyList: (params: { communityId: string, keyword?: string, page: number, row: number, status?: string }) => ReturnType<typeof createPaginationResponse<WorkOrder>>
  getDetail: (orderId: string) => WorkOrderDetail | undefined
  getTaskItems: (params: { page: number, row: number, states?: string, workId: string }) => ReturnType<typeof createPaginationResponse<WorkTaskItem>>
  getTaskList: (params: { page: number, row: number, workId: string }) => ReturnType<typeof createPaginationResponse<WorkTask>>
  getTodoList: (params: { communityId: string, keyword?: string, page: number, row: number, status?: string, type?: string }) => ReturnType<typeof createPaginationResponse<WorkOrder>>
  start: (orderId: string) => boolean
  update: (params: UpdateWorkOrderParams) => boolean
}

/** 创建 `work-order` 模块的 mock 内存仓储。 */
export function createWorkOrderMockRepository(): WorkOrderModuleRepository {
  return new WorkOrderMockRepository()
}

/** 工作单状态配置。 */
const WORK_ORDER_STATES = [
  { value: '10001', label: '待处理' },
  { value: '10002', label: '处理中' },
  { value: '10003', label: '已完成' },
  { value: '10004', label: '已驳回' },
]

/** 工作单类型配置。 */
const WORK_ORDER_TYPES = [
  { value: '1', label: '日常工作' },
  { value: '2', label: '临时任务' },
  { value: '3', label: '周期任务' },
]

/** 工作单优先级配置。 */
const WORK_ORDER_PRIORITIES = [
  { value: '1', label: '低' },
  { value: '2', label: '中' },
  { value: '3', label: '高' },
  { value: '4', label: '紧急' },
]

/** 工作单标题模板。 */
const WORK_ORDER_TITLES = [
  '园区绿化修剪',
  '公共区域清洁',
  '设备巡检任务',
  '安全隐患排查',
  '消防设施检查',
  '停车场管理',
  '门禁系统维护',
  '监控设备检查',
  '电梯日常巡检',
  '水电设施检修',
]

/** 工作单内容模板。 */
const WORK_ORDER_CONTENTS = [
  '对园区内的绿化带进行修剪和维护，包括草坪修剪、灌木修剪等',
  '对公共区域进行全面清洁，包括楼道、电梯间、大堂等',
  '对小区内各类设备进行日常巡检，确保设备正常运行',
  '排查小区内的安全隐患，及时处理发现的问题',
  '检查消防设施是否完好，确保消防通道畅通',
  '管理停车场秩序，处理违规停车问题',
  '维护门禁系统，确保门禁正常使用',
  '检查监控设备运行状态，确保监控覆盖无死角',
  '对电梯进行日常巡检，记录运行状态',
  '检修水电设施，处理漏水、断电等问题',
]

/** work-order 模块的 mock 内存仓储实现。 */
class WorkOrderMockRepository implements WorkOrderModuleRepository {
  private readonly copyOrders: WorkOrder[] = []
  private readonly orderDetails = new Map<string, WorkOrderDetail>()
  private readonly taskItems: WorkTaskItem[] = []
  private readonly tasks: WorkTask[] = []
  private readonly todoOrders: WorkOrder[] = []

  constructor() {
    this.initData()
  }

  getTodoList(params: { communityId: string, keyword?: string, page: number, row: number, status?: string, type?: string }) {
    let filteredOrders = [...this.todoOrders]

    if (params.status) {
      filteredOrders = filteredOrders.filter(order => order.status === params.status)
    }

    if (params.type) {
      filteredOrders = filteredOrders.filter(order => order.type === params.type)
    }

    if (params.keyword) {
      const keyword = params.keyword.toLowerCase()
      filteredOrders = filteredOrders.filter(order =>
        order.title.toLowerCase().includes(keyword)
        || order.content.toLowerCase().includes(keyword))
    }

    return cloneValue(createPaginationResponse(filteredOrders, params.page, params.row))
  }

  getCopyList(params: { communityId: string, keyword?: string, page: number, row: number, status?: string }) {
    let filteredOrders = [...this.copyOrders]

    if (params.status) {
      filteredOrders = filteredOrders.filter(order => order.status === params.status)
    }

    if (params.keyword) {
      const keyword = params.keyword.toLowerCase()
      filteredOrders = filteredOrders.filter(order =>
        order.title.toLowerCase().includes(keyword)
        || order.content.toLowerCase().includes(keyword))
    }

    return cloneValue(createPaginationResponse(filteredOrders, params.page, params.row))
  }

  getDetail(orderId: string): WorkOrderDetail | undefined {
    const order = this.orderDetails.get(orderId)
    return order ? cloneValue(order) : undefined
  }

  getTaskList(params: { page: number, row: number, workId: string }) {
    const normalizedWorkId = normalizeWorkId(params.workId)
    const exactTasks = this.tasks.filter(task => task.workId === params.workId)
    const filteredTasks = exactTasks.length > 0
      ? exactTasks
      : this.tasks.filter(task => normalizeWorkId(task.workId) === normalizedWorkId)

    return cloneValue(createPaginationResponse(
      filteredTasks.map(task => ({
        ...task,
        workId: params.workId,
      })),
      params.page,
      params.row,
    ))
  }

  getTaskItems(params: { page: number, row: number, states?: string, workId: string }) {
    const normalizedWorkId = normalizeWorkId(params.workId)
    const stateSet = parseStateSet(params.states)
    const exactItems = this.taskItems.filter(item => item.workId === params.workId)
    let filteredItems = exactItems.length > 0
      ? exactItems
      : this.taskItems.filter(item => normalizeWorkId(item.workId) === normalizedWorkId)

    if (stateSet.size > 0) {
      filteredItems = filteredItems.filter(item => stateSet.has(item.state))
    }

    return cloneValue(createPaginationResponse(
      filteredItems.map(item => ({
        ...item,
        workId: params.workId,
      })),
      params.page,
      params.row,
    ))
  }

  finishCopyWork(params: { copyId: string, deductionMoney: number, deductionReason: string, itemId: string, score: number }) {
    if (!params.copyId || !params.itemId) {
      return false
    }

    const item = this.taskItems.find(taskItem => taskItem.itemId === params.itemId)
    if (!item) {
      return false
    }

    item.state = 'C'
    item.remark = params.deductionReason || item.remark || `评分 ${params.score} 分`
    item.finishTime = formatDateTime()

    return true
  }

  create(params: CreateWorkOrderParams): string {
    const newIndex = this.todoOrders.length + this.copyOrders.length + 1
    const typeItem = WORK_ORDER_TYPES.find(item => item.value === params.type) || WORK_ORDER_TYPES[0]
    const priorityItem = WORK_ORDER_PRIORITIES.find(item => item.value === params.priority) || WORK_ORDER_PRIORITIES[1]

    const newOrder: WorkOrder = {
      orderId: `WO_${String(newIndex).padStart(3, '0')}`,
      orderNo: generateBusinessId('WO'),
      title: params.title,
      type: params.type,
      typeName: typeItem.label,
      status: '10001',
      statusName: '待处理',
      priority: params.priority,
      priorityName: priorityItem.label,
      content: params.content,
      staffId: params.staffId,
      staffName: params.staffId ? generateChineseName() : undefined,
      creatorId: 'CURRENT_USER',
      creatorName: '当前用户',
      planStartTime: params.planStartTime,
      planEndTime: params.planEndTime,
      createTime: formatDateTime(),
      communityId: params.communityId,
      communityName: '阳光花园小区',
    }

    this.todoOrders.unshift(newOrder)

    const detail: WorkOrderDetail = {
      ...newOrder,
      attachments: params.attachments,
      copyUsers: params.copyUserIds?.map(id => ({
        userId: id,
        userName: generateChineseName(),
      })),
      operationLogs: [generateWorkOrderLog(newOrder.orderId, 0)],
    }
    this.orderDetails.set(newOrder.orderId, detail)

    return newOrder.orderId
  }

  update(params: UpdateWorkOrderParams): boolean {
    const order = this.todoOrders.find(item => item.orderId === params.orderId)
    if (!order) {
      return false
    }

    if (params.title) {
      order.title = params.title
    }

    if (params.type) {
      order.type = params.type
      const typeItem = WORK_ORDER_TYPES.find(item => item.value === params.type)
      if (typeItem) {
        order.typeName = typeItem.label
      }
    }

    if (params.priority) {
      order.priority = params.priority
      const priorityItem = WORK_ORDER_PRIORITIES.find(item => item.value === params.priority)
      if (priorityItem) {
        order.priorityName = priorityItem.label
      }
    }

    if (params.content) {
      order.content = params.content
    }

    if (params.staffId) {
      order.staffId = params.staffId
      order.staffName = generateChineseName()
    }

    if (params.planStartTime) {
      order.planStartTime = params.planStartTime
    }

    if (params.planEndTime) {
      order.planEndTime = params.planEndTime
    }

    order.updateTime = formatDateTime()

    const detail = this.orderDetails.get(params.orderId)
    if (detail) {
      Object.assign(detail, order)
      if (params.attachments) {
        detail.attachments = params.attachments
      }
    }

    return true
  }

  start(orderId: string): boolean {
    const order = this.todoOrders.find(item => item.orderId === orderId)
    if (!order || order.status !== '10001') {
      return false
    }

    order.status = '10002'
    order.statusName = '处理中'
    order.actualStartTime = formatDateTime()
    order.updateTime = formatDateTime()

    const detail = this.orderDetails.get(orderId)
    if (detail) {
      Object.assign(detail, order)
      detail.operationLogs?.unshift({
        logId: `LOG_${orderId}_${Date.now()}`,
        orderId,
        operationType: 'start',
        operationTypeName: '开始处理',
        operatorId: 'CURRENT_USER',
        operatorName: '当前用户',
        operationTime: formatDateTime(),
      })
    }

    return true
  }

  complete(params: CompleteWorkOrderParams): boolean {
    const order = this.todoOrders.find(item => item.orderId === params.orderId)
    if (!order || order.status !== '10002') {
      return false
    }

    order.status = '10003'
    order.statusName = '已完成'
    order.actualEndTime = formatDateTime()
    order.updateTime = formatDateTime()

    const detail = this.orderDetails.get(params.orderId)
    if (detail) {
      Object.assign(detail, order)
      detail.completeRemark = params.remark
      detail.completePhotos = params.photos
      detail.operationLogs?.unshift({
        logId: `LOG_${params.orderId}_${Date.now()}`,
        orderId: params.orderId,
        operationType: 'complete',
        operationTypeName: '完成任务',
        operatorId: 'CURRENT_USER',
        operatorName: '当前用户',
        operationTime: formatDateTime(),
        remark: params.remark,
      })
    }

    return true
  }

  audit(params: AuditWorkOrderParams): boolean {
    const order = this.todoOrders.find(item => item.orderId === params.orderId)
    if (!order) {
      return false
    }

    if (params.result === 'pass') {
      order.status = '10003'
      order.statusName = '已完成'
    }
    else {
      order.status = '10004'
      order.statusName = '已驳回'
    }

    order.updateTime = formatDateTime()

    const detail = this.orderDetails.get(params.orderId)
    if (detail) {
      Object.assign(detail, order)
      detail.operationLogs?.unshift({
        logId: `LOG_${params.orderId}_${Date.now()}`,
        orderId: params.orderId,
        operationType: 'audit',
        operationTypeName: params.result === 'pass' ? '审核通过' : '审核驳回',
        operatorId: 'CURRENT_USER',
        operatorName: '当前用户',
        operationTime: formatDateTime(),
        remark: params.opinion,
      })
    }

    return true
  }

  cancel(orderId: string, reason?: string): boolean {
    const order = this.todoOrders.find(item => item.orderId === orderId)
    if (!order || (order.status !== '10001' && order.status !== '10002')) {
      return false
    }

    order.status = '10005'
    order.statusName = '已取消'
    order.updateTime = formatDateTime()

    const detail = this.orderDetails.get(orderId)
    if (detail) {
      Object.assign(detail, order)
      detail.operationLogs?.unshift({
        logId: `LOG_${orderId}_${Date.now()}`,
        orderId,
        operationType: 'cancel',
        operationTypeName: '取消工作单',
        operatorId: 'CURRENT_USER',
        operatorName: '当前用户',
        operationTime: formatDateTime(),
        remark: reason,
      })
    }

    return true
  }

  /** 初始化工作单数据。 */
  private initData() {
    this.todoOrders.push(...Array.from({ length: 20 }, (_, index) => generateWorkOrder(index + 1, false)))
    this.copyOrders.push(...Array.from({ length: 10 }, (_, index) => generateWorkOrder(index + 100, true)))

    const allOrders = [...this.todoOrders, ...this.copyOrders]
    for (const order of allOrders) {
      const logCount = Math.floor(Math.random() * 3) + 1
      const logs = Array.from({ length: logCount }, (_, index) => generateWorkOrderLog(order.orderId, index))
      const copyUserCount = Math.floor(Math.random() * 3)
      const copyUsers: WorkOrderCopyUser[] = Array.from({ length: copyUserCount }, (_, index) => ({
        userId: `USER_${String(index + 1).padStart(3, '0')}`,
        userName: generateChineseName(),
      }))

      this.orderDetails.set(order.orderId, {
        ...order,
        attachments: Math.random() > 0.5 ? [`https://picsum.photos/400/300?random=${order.orderId}_1`] : undefined,
        copyUsers,
        operationLogs: logs,
      })
    }

    this.initTaskData()
  }

  /** 初始化工作单任务与任务项数据。 */
  private initTaskData() {
    const seedWorkIds = ['WO_001', 'WO_002', 'WO_003', 'WORK_001']

    for (const workId of seedWorkIds) {
      const normalizedWorkId = normalizeWorkId(workId)

      this.tasks.push(
        {
          taskId: `TASK_${normalizedWorkId}_001`,
          workId,
          staffId: 'STAFF_001',
          staffName: '张师傅',
          state: 'W',
          createTime: formatDateTime(dayjs().subtract(2, 'day')),
        },
        {
          taskId: `TASK_${normalizedWorkId}_002`,
          workId,
          staffId: 'STAFF_002',
          staffName: '李师傅',
          state: 'C',
          createTime: formatDateTime(dayjs().subtract(1, 'day')),
        },
      )

      this.taskItems.push(
        {
          itemId: `ITEM_${normalizedWorkId}_001`,
          workId,
          taskId: `TASK_${normalizedWorkId}_001`,
          content: '检查公共区域卫生',
          staffId: 'STAFF_001',
          staffName: '张师傅',
          state: 'W',
          createTime: formatDateTime(dayjs().subtract(2, 'day')),
        },
        {
          itemId: `ITEM_${normalizedWorkId}_002`,
          workId,
          taskId: `TASK_${normalizedWorkId}_002`,
          content: '完成设备巡检并上传照片',
          staffId: 'STAFF_002',
          staffName: '李师傅',
          state: 'C',
          remark: '设备运行正常',
          finishTime: formatDateTime(dayjs().subtract(1, 'day')),
          pathUrls: [`https://picsum.photos/300/200?random=${normalizedWorkId}-task`],
          createTime: formatDateTime(dayjs().subtract(2, 'day')),
        },
        {
          itemId: `ITEM_${normalizedWorkId}_003`,
          workId,
          taskId: `TASK_${normalizedWorkId}_001`,
          content: '复核现场处理情况',
          staffId: 'STAFF_003',
          staffName: '王师傅',
          state: 'P',
          createTime: formatDateTime(dayjs().subtract(1, 'day')),
        },
      )
    }
  }
}

/** 生成模拟工作单。 */
function generateWorkOrder(index: number, isCopyToMe: boolean = false): WorkOrder {
  const statusItem = WORK_ORDER_STATES[Math.floor(Math.random() * WORK_ORDER_STATES.length)]
  const typeItem = WORK_ORDER_TYPES[Math.floor(Math.random() * WORK_ORDER_TYPES.length)]
  const priorityItem = WORK_ORDER_PRIORITIES[Math.floor(Math.random() * WORK_ORDER_PRIORITIES.length)]
  const titleIndex = Math.floor(Math.random() * WORK_ORDER_TITLES.length)
  const now = dayjs()
  const createTime = now.subtract(Math.floor(Math.random() * 30), 'day')
  const planStartTime = createTime.add(Math.floor(Math.random() * 7), 'day')
  const planEndTime = planStartTime.add(Math.floor(Math.random() * 3) + 1, 'day')

  return {
    orderId: `WO_${String(index).padStart(3, '0')}`,
    orderNo: generateBusinessId('WO'),
    title: WORK_ORDER_TITLES[titleIndex],
    type: typeItem.value,
    typeName: typeItem.label,
    status: statusItem.value,
    statusName: statusItem.label,
    priority: priorityItem.value,
    priorityName: priorityItem.label,
    content: WORK_ORDER_CONTENTS[titleIndex],
    staffId: statusItem.value !== '10001' ? `STAFF_${String(Math.floor(Math.random() * 10) + 1).padStart(3, '0')}` : undefined,
    staffName: statusItem.value !== '10001' ? generateChineseName() : undefined,
    creatorId: `ADMIN_${String(Math.floor(Math.random() * 5) + 1).padStart(3, '0')}`,
    creatorName: generateChineseName(),
    planStartTime: formatDateTime(planStartTime),
    planEndTime: formatDateTime(planEndTime),
    createTime: formatDateTime(createTime),
    communityId: 'COMM_001',
    communityName: '阳光花园小区',
    isCopyToMe,
  }
}

/** 生成工作单操作记录。 */
function generateWorkOrderLog(orderId: string, index: number): WorkOrderLog {
  const operationTypes = [
    { type: 'create', name: '创建工作单' },
    { type: 'assign', name: '分配任务' },
    { type: 'start', name: '开始处理' },
    { type: 'complete', name: '完成任务' },
    { type: 'audit', name: '审核通过' },
  ]
  const operationType = operationTypes[index % operationTypes.length]

  return {
    logId: `LOG_${orderId}_${String(index).padStart(2, '0')}`,
    orderId,
    operationType: operationType.type,
    operationTypeName: operationType.name,
    operatorId: `STAFF_${String(Math.floor(Math.random() * 10) + 1).padStart(3, '0')}`,
    operatorName: generateChineseName(),
    operationTime: formatDateTime(dayjs().subtract(index, 'day')),
    remark: index === 0 ? '新建工作单' : undefined,
  }
}

/** 兼容迁移 smoke 参数中的 WORK_001 与实际工作单 WO_001。 */
function normalizeWorkId(workId: string): string {
  return workId.replace(/^WORK_/, 'WO_')
}

/** 解析逗号分隔的任务状态筛选。 */
function parseStateSet(states?: string): Set<string> {
  if (!states?.trim()) {
    return new Set()
  }

  return new Set(states.split(',').map(item => item.trim()).filter(Boolean))
}

/** 克隆仓储返回值，避免外部篡改内部引用。 */
function cloneValue<T>(value: T): T {
  return structuredClone(value)
}

/** 默认供运行时直接复用的 work-order 仓储实例。 */
export const workOrderMockRepository = createWorkOrderMockRepository()
