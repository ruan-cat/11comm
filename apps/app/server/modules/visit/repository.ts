import type { AuditVisitParams, VisitDetail, VisitRecord } from '../../../src/types/visit.ts'
import {
  createPaginationResponse,
  formatDateTime,
  generateChineseName,
  generatePhoneNumber,
} from '../../shared/runtime/common-utils.ts'

export interface VisitModuleRepository {
  auditVisit: (params: AuditVisitParams) => boolean
  getVisitDetailList: (params: { page: number, row: number, visitId: string }) => ReturnType<typeof createPaginationResponse<VisitDetail>>
  getVisitList: (params: { page: number, row: number, state?: string, visitId?: string }) => ReturnType<typeof createPaginationResponse<VisitRecord>>
}

/** 创建 `visit` 模块的 mock 内存仓储。 */
export function createVisitMockRepository(): VisitModuleRepository {
  return new VisitDatabase()
}

/** visit 模块的 mock 内存仓储实现。 */
class VisitDatabase implements VisitModuleRepository {
  private details: VisitDetail[] = []

  constructor() {
    this.initData()
  }

  getVisitList(params: { page: number, row: number, state?: string, visitId?: string }) {
    let list = [...this.details]

    if (params.state !== undefined && params.state !== '') {
      list = list.filter(item => item.state === String(params.state))
    }

    if (params.visitId) {
      list = list.filter(item => item.visitId === String(params.visitId))
    }

    return cloneValue(createPaginationResponse(
      list.map(item => ({
        visitId: item.visitId,
        name: item.name,
        phoneNumber: item.phoneNumber,
        ownerName: item.ownerName,
        roomName: item.roomName,
        carNum: item.carNum,
        visitTime: item.visitTime,
        state: item.state,
        stateName: item.stateName,
        taskId: item.taskId,
      })),
      params.page,
      params.row,
    ))
  }

  getVisitDetailList(params: { page: number, row: number, visitId: string }) {
    const list = this.details.filter(item => item.visitId === String(params.visitId || ''))
    return cloneValue(createPaginationResponse(list, params.page, params.row))
  }

  auditVisit(params: AuditVisitParams): boolean {
    const target = this.details.find(item => item.visitId === params.visitId)
    if (target) {
      target.state = params.state
      target.stateName = params.state === '1' ? '审核通过' : '已拒绝'
    }

    return true
  }

  /** 初始化访客数据。 */
  private initData() {
    if (this.details.length > 0) {
      return
    }

    this.details = Array.from({ length: 30 }).map((_, index) => {
      const state = index % 3 === 0 ? '0' : index % 3 === 1 ? '1' : '2'
      const ownerName = generateChineseName()
      const visitorName = generateChineseName()

      return {
        visitId: `VISIT_${(index + 1).toString().padStart(5, '0')}`,
        name: visitorName,
        phoneNumber: generatePhoneNumber(),
        ownerName,
        roomName: `${(index % 5) + 1}-${(index % 3) + 1}-${(101 + index).toString().slice(-3)}`,
        carNum: `粤A${(30000 + index).toString()}`,
        visitTime: formatDateTime(Date.now() + index * 7200000),
        state,
        stateName: state === '0' ? '待审核' : state === '1' ? '审核通过' : '已拒绝',
        taskId: state === '0' ? `TASK_V_${(index + 1).toString().padStart(4, '0')}` : undefined,
        departureTime: formatDateTime(Date.now() + (index + 2) * 7200000),
        visitCase: index % 2 === 0 ? '亲友来访' : '送货上门',
      }
    })
  }
}

/** 默认运行时共享使用的 visit 仓储实例。 */
export const visitMockRepository = createVisitMockRepository()

/** 克隆仓储返回值，避免外部引用直接修改内部状态。 */
function cloneValue<T>(value: T): T {
  return structuredClone(value)
}
