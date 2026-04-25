import type {
  AuditItemReleaseParams,
  ItemReleaseComment,
  ItemReleaseDetail,
  ItemReleaseResource,
  ItemReleaseTask,
} from '../../../src/types/item-release.ts'
import { createPaginationResponse, formatDateTime, generateChineseName, generateId, generatePhoneNumber } from '../../shared/runtime/common-utils.ts'

export interface ItemReleaseModuleRepository {
  auditItemRelease: (data: AuditItemReleaseParams) => boolean
  getItemRelease: (irId: string) => ItemReleaseDetail[]
  getItemReleaseRes: (irId: string) => ItemReleaseResource[]
  queryFinishItemRelease: (params: { page: number, row: number }) => ReturnType<typeof createPaginationResponse>
  queryOaWorkflowUser: (id: string) => ItemReleaseComment[]
  queryUndoItemRelease: (params: { page: number, row: number }) => ReturnType<typeof createPaginationResponse>
}

/** 创建 `item-release` 模块的 mock 内存仓储。 */
export function createItemReleaseMockRepository(): ItemReleaseModuleRepository {
  return new ItemReleaseDatabase()
}

class ItemReleaseDatabase implements ItemReleaseModuleRepository {
  private undoTasks: ItemReleaseTask[] = []
  private finishTasks: ItemReleaseTask[] = []
  private details = new Map<string, ItemReleaseDetail>()
  private resources = new Map<string, ItemReleaseResource[]>()
  private comments = new Map<string, ItemReleaseComment[]>()

  constructor() {
    this.init()
  }

  queryUndoItemRelease(params: { page: number, row: number }) {
    return createPaginationResponse(this.undoTasks, params.page, params.row)
  }

  queryFinishItemRelease(params: { page: number, row: number }) {
    return createPaginationResponse(this.finishTasks, params.page, params.row)
  }

  getItemRelease(irId: string) {
    const detail = this.details.get(irId)
    return detail ? [structuredClone(detail)] : []
  }

  getItemReleaseRes(irId: string) {
    return structuredClone(this.resources.get(irId) || [])
  }

  queryOaWorkflowUser(id: string) {
    return structuredClone(this.comments.get(id) || [])
  }

  auditItemRelease(data: AuditItemReleaseParams) {
    const targetIndex = this.undoTasks.findIndex(item => item.irId === data.irId)
    if (targetIndex === -1) {
      return true
    }

    const target = this.undoTasks[targetIndex]
    this.undoTasks.splice(targetIndex, 1)

    const nextStateName = data.auditCode === '1100' ? '宸插姙缁?' : '宸叉嫆缁?'
    this.finishTasks.unshift({
      ...target,
      stateName: nextStateName,
      action: 'View',
    })

    const detail = this.details.get(data.irId)
    if (detail) {
      detail.remark = data.auditMessage
      this.comments.set(data.irId, [
        ...(this.comments.get(data.irId) || []),
        {
          staffName: '审批人',
          context: data.auditMessage,
          endTime: formatDateTime(),
        },
      ])
    }

    return true
  }

  private init() {
    for (let index = 0; index < 18; index += 1) {
      this.createTask(index + 1, false)
    }

    for (let index = 0; index < 12; index += 1) {
      this.createTask(index + 1, true)
    }
  }

  private createTask(index: number, finished: boolean) {
    const irId = finished ? `IR_F_${index.toString().padStart(5, '0')}` : `IR_${index.toString().padStart(5, '0')}`
    const flowId = finished ? `FLOW_F_${index.toString().padStart(5, '0')}` : `FLOW_${index.toString().padStart(5, '0')}`
    const typeName = index % 2 === 0 ? '住户搬家放行' : '装修物料放行'
    const detail: ItemReleaseDetail = {
      irId,
      flowId,
      typeName,
      applyCompany: index % 2 === 0 ? '绿地物业服务中心' : '绿地装修服务部',
      applyPerson: generateChineseName(),
      applyTel: generatePhoneNumber(),
      idCard: `4401011990${(index + 10).toString().padStart(2, '0')}0012`,
      carNum: `粤B${(12000 + index).toString()}`,
      passTime: formatDateTime(Date.now() + (finished ? -1 : 1) * (index % 7) * 3600000),
      remark: finished ? '历史放行记录' : '放行申请说明',
      createUserId: `USER_${index.toString().padStart(4, '0')}`,
    }

    this.details.set(irId, detail)
    this.resources.set(irId, [
      {
        resId: generateId('RES'),
        resName: index % 2 === 0 ? '木质衣柜' : '水泥',
        amount: (index % 3) + 1,
      },
    ])
    this.comments.set(irId, [
      {
        staffName: '申请人',
        context: '提交放行申请',
        endTime: formatDateTime(Date.now() - 3600000),
      },
      {
        staffName: '物业前台',
        context: finished ? '审核通过' : '待审核',
      },
    ])

    const task: ItemReleaseTask = {
      irId,
      flowId,
      taskId: finished ? undefined : `TASK_${index.toString().padStart(5, '0')}`,
      typeName,
      stateName: finished ? '宸插姙缁?' : '寰呭鏍?',
      passTime: detail.passTime,
      amount: this.resources.get(irId)?.reduce((sum, item) => sum + item.amount, 0) || 0,
      action: finished ? 'View' : 'Audit',
    }

    if (finished) {
      this.finishTasks.push(task)
    }
    else {
      this.undoTasks.push(task)
    }
  }
}

/** 默认复用的 item-release mock 仓储实例。 */
export const itemReleaseMockRepository = createItemReleaseMockRepository()
