import type {
  MaintenanceSingleSubmitParams,
  MaintenanceTask,
  MaintenanceTaskDetail,
  MaintenanceTransferParams,
} from '../../../src/types/maintenance.ts'
import dayjs from 'dayjs'
import {
  createPaginationResponse,
  formatDateTime,
  generateChineseName,
} from '../../shared/runtime/common-utils.ts'

export interface MaintenanceModuleRepository {
  completeTask: (taskId: string) => boolean
  getTaskDetail: (taskId: string) => MaintenanceTask | undefined
  getTaskDetailItems: (taskId: string) => MaintenanceTaskDetail[]
  getTaskList: (params: { communityId: string, page: number, row: number, status?: string }) => ReturnType<typeof createPaginationResponse<MaintenanceTask>>
  startTask: (taskId: string) => boolean
  submitSingle: (params: MaintenanceSingleSubmitParams) => boolean
  transferTask: (params: MaintenanceTransferParams) => boolean
}

/** 创建 `maintenance` 模块的 mock 内存仓储。 */
export function createMaintenanceMockRepository(): MaintenanceModuleRepository {
  return new MaintenanceDatabase()
}

/** 设备名称库。 */
const MACHINE_NAMES = [
  '1号电梯',
  '2号电梯',
  '3号电梯',
  '消防水泵',
  '生活水泵',
  '配电房设备',
  '中央空调主机',
  '发电机组',
  '监控主机',
  '门禁系统',
  '车库道闸',
  '污水处理设备',
]

/** 保养项名称库。 */
const MAINTENANCE_ITEM_NAMES = [
  '外观检查',
  '运行状态检查',
  '润滑保养',
  '清洁保养',
  '紧固件检查',
  '电气系统检查',
  '安全装置检查',
  '性能测试',
]

/** 保养项内容库。 */
const MAINTENANCE_ITEM_CONTENTS = [
  '检查设备外观是否完好，有无损坏、锈蚀',
  '检查设备运行是否正常，有无异响、振动',
  '对运动部件进行润滑，更换润滑油',
  '清洁设备表面及内部灰尘、污垢',
  '检查各紧固件是否松动，必要时紧固',
  '检查电气线路、接头是否正常',
  '检查安全保护装置是否有效',
  '进行设备性能测试，记录测试数据',
]

/** 保养状态配置。 */
const MAINTENANCE_STATES = [
  { value: '10001', label: '待保养' },
  { value: '10002', label: '保养中' },
  { value: '10003', label: '已完成' },
]

/** maintenance 模块的 mock 内存仓储实现。 */
class MaintenanceDatabase implements MaintenanceModuleRepository {
  private readonly taskDetails = new Map<string, MaintenanceTaskDetail[]>()
  private tasks: MaintenanceTask[] = []

  constructor() {
    this.initData()
  }

  getTaskList(params: { communityId: string, page: number, row: number, status?: string }) {
    let filteredTasks = [...this.tasks]

    if (params.status) {
      filteredTasks = filteredTasks.filter(task => task.status === params.status)
    }

    if (params.communityId) {
      filteredTasks = filteredTasks.filter(task => task.communityId === params.communityId)
    }

    return cloneValue(createPaginationResponse(filteredTasks, params.page, params.row))
  }

  getTaskDetail(taskId: string): MaintenanceTask | undefined {
    const task = this.tasks.find(item => item.taskId === taskId)
    return task ? cloneValue(task) : undefined
  }

  getTaskDetailItems(taskId: string): MaintenanceTaskDetail[] {
    return cloneValue(this.taskDetails.get(taskId) || [])
  }

  startTask(taskId: string): boolean {
    const task = this.tasks.find(item => item.taskId === taskId)
    if (!task || task.status !== '10001') {
      return false
    }

    task.status = '10002'
    task.statusName = '保养中'
    task.staffId = 'STAFF_001'
    task.staffName = generateChineseName()
    return true
  }

  completeTask(taskId: string): boolean {
    const task = this.tasks.find(item => item.taskId === taskId)
    if (!task || task.status !== '10002') {
      return false
    }

    task.status = '10003'
    task.statusName = '已完成'
    return true
  }

  submitSingle(params: MaintenanceSingleSubmitParams): boolean {
    const details = this.taskDetails.get(params.taskId)
    if (!details) {
      return false
    }

    const detail = details.find(item => item.taskDetailId === params.taskDetailId)
    if (!detail) {
      return false
    }

    detail.result = params.result
    detail.remark = params.remark
    detail.photos = params.photos
    return true
  }

  transferTask(params: MaintenanceTransferParams): boolean {
    const task = this.tasks.find(item => item.taskId === params.taskId)
    if (!task) {
      return false
    }

    task.staffId = params.targetStaffId
    task.staffName = generateChineseName()
    return true
  }

  /** 初始化保养任务种子数据。 */
  private initData() {
    this.tasks = Array.from({ length: 15 }, (_, index) => generateMaintenanceTask(index + 1))

    for (const task of this.tasks) {
      const detailCount = Math.floor(Math.random() * 4) + 4
      const details = Array.from({ length: detailCount }, (_, index) =>
        generateMaintenanceTaskDetail(task.taskId, index + 1))
      this.taskDetails.set(task.taskId, details)
    }
  }
}

/** 默认供运行时直接复用的 maintenance 仓储实例。 */
export const maintenanceMockRepository = createMaintenanceMockRepository()

/** 生成保养任务。 */
function generateMaintenanceTask(index: number): MaintenanceTask {
  const statusItem = MAINTENANCE_STATES[Math.floor(Math.random() * MAINTENANCE_STATES.length)]
  const machineName = MACHINE_NAMES[Math.floor(Math.random() * MACHINE_NAMES.length)]
  const planTime = dayjs().add(Math.floor(Math.random() * 14) - 7, 'day')

  return {
    taskId: `MT_${String(index).padStart(3, '0')}`,
    taskName: `${machineName}定期保养`,
    machineName,
    machineId: `MACHINE_${String(index).padStart(3, '0')}`,
    planTime: formatDateTime(planTime),
    status: statusItem.value,
    statusName: statusItem.label,
    staffId: statusItem.value !== '10001' ? `STAFF_${String(Math.floor(Math.random() * 10) + 1).padStart(3, '0')}` : undefined,
    staffName: statusItem.value !== '10001' ? generateChineseName() : undefined,
    communityId: 'COMM_001',
  }
}

/** 生成保养任务详情项。 */
function generateMaintenanceTaskDetail(taskId: string, index: number): MaintenanceTaskDetail {
  const itemName = MAINTENANCE_ITEM_NAMES[index % MAINTENANCE_ITEM_NAMES.length]
  const itemContent = MAINTENANCE_ITEM_CONTENTS[index % MAINTENANCE_ITEM_CONTENTS.length]

  return {
    taskDetailId: `MTD_${taskId}_${String(index).padStart(2, '0')}`,
    taskId,
    itemName,
    itemContent,
    result: Math.random() > 0.5 ? '正常' : undefined,
    remark: Math.random() > 0.7 ? '无异常' : undefined,
    photos: Math.random() > 0.6
      ? [
          `https://picsum.photos/400/300?random=${index}_1`,
          `https://picsum.photos/400/300?random=${index}_2`,
        ]
      : undefined,
  }
}

/** 克隆仓储返回值，避免外部篡改内部引用。 */
function cloneValue<T>(value: T): T {
  return structuredClone(value)
}
