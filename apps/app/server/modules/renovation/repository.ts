import type {
  RenovationApplication,
  RenovationExaminePayload,
  RenovationQueryParams,
  RenovationRecord,
  RenovationRecordMedia,
  RenovationRecordQueryParams,
  SaveRenovationRecordPayload,
} from '../../../src/types/property-management.ts'
import {
  createPaginationResponse,
  formatDateTime,
  generateChineseName,
  generatePhoneNumber,
} from '../../shared/runtime/common-utils.ts'

export interface RenovationModuleRepository {
  addRecord: (payload: SaveRenovationRecordPayload) => boolean
  deleteRecord: (recordId: string) => boolean
  finishRenovation: (rId: string) => boolean
  getRecordMedia: (recordId: string) => RenovationRecordMedia[]
  queryRecords: (params: RenovationRecordQueryParams) => ReturnType<typeof createPaginationResponse<RenovationRecord>>
  queryRenovations: (params: RenovationQueryParams) => ReturnType<typeof createPaginationResponse<RenovationApplication>>
  updateExamine: (payload: Pick<RenovationExaminePayload, 'examineRemark' | 'rId' | 'state'>) => boolean
}

/** 创建 `renovation` 模块的 mock 内存仓储。 */
export function createRenovationMockRepository(): RenovationModuleRepository {
  return new RenovationDatabase()
}

/** 装修申请状态文案。 */
const RENOVATION_STATE_NAMES: Record<number, string> = {
  1000: '待审核',
  2000: '审核不通过',
  3000: '施工中',
  4000: '待验收',
  5000: '验收通过',
  6000: '验收不通过',
}

/** renovation 模块的 mock 内存仓储实现。 */
class RenovationDatabase implements RenovationModuleRepository {
  private recordSequence = 36
  private readonly recordMedia: RenovationRecordMedia[] = []
  private readonly records: RenovationRecord[] = []
  private readonly renovations: RenovationApplication[] = []

  constructor() {
    this.initData()
  }

  queryRenovations(params: RenovationQueryParams) {
    let list = [...this.renovations]

    if (params.communityId) {
      list = list.filter(item => item.communityId === params.communityId)
    }

    if (params.roomName) {
      list = list.filter(item => item.roomName.includes(params.roomName))
    }

    if (params.state) {
      list = list.filter(item => String(item.state) === String(params.state))
    }

    return cloneValue(createPaginationResponse(list, params.page, params.row))
  }

  queryRecords(params: RenovationRecordQueryParams) {
    let list = this.records.filter(item => item.rId === params.rId)

    if (params.communityId) {
      list = list.filter(item => item.communityId === params.communityId)
    }

    if (params.roomName) {
      list = list.filter(item => item.roomName.includes(params.roomName))
    }

    if (params.roomId) {
      list = list.filter(item => item.roomId === params.roomId)
    }

    return cloneValue(createPaginationResponse(list, params.page, params.row))
  }

  updateExamine(payload: Pick<RenovationExaminePayload, 'examineRemark' | 'rId' | 'state'>): boolean {
    const renovation = this.renovations.find(item => item.rId === payload.rId)
    if (!renovation) {
      return false
    }

    renovation.state = Number(payload.state)
    renovation.stateName = getRenovationStateName(Number(payload.state))
    renovation.remark = payload.examineRemark || renovation.remark

    this.records.unshift({
      recordId: this.createRecordId(),
      rId: renovation.rId,
      communityId: renovation.communityId,
      roomId: renovation.roomId,
      roomName: renovation.roomName,
      state: renovation.state,
      stateName: renovation.stateName,
      staffName: '系统审核员',
      remark: payload.examineRemark || '',
      createTime: formatDateTime(),
      isTrue: renovation.isViolation === 'Y' ? 'true' : 'false',
    })

    return true
  }

  finishRenovation(rId: string): boolean {
    const renovation = this.renovations.find(item => item.rId === rId)
    if (!renovation) {
      return false
    }

    renovation.state = 4000
    renovation.stateName = getRenovationStateName(4000)
    return true
  }

  addRecord(payload: SaveRenovationRecordPayload): boolean {
    const renovation = this.renovations.find(item => item.rId === payload.rId)
    if (!renovation) {
      return false
    }

    const recordId = this.createRecordId()
    this.records.unshift({
      recordId,
      rId: payload.rId,
      communityId: payload.communityId,
      roomId: payload.roomId,
      roomName: payload.roomName,
      state: payload.state,
      stateName: payload.stateName || getRenovationStateName(Number(payload.state) || 3000),
      staffName: '巡检人员',
      remark: payload.remark,
      createTime: formatDateTime(),
      isTrue: payload.isTrue,
    })

    payload.photos.forEach((photoId, index) => {
      this.recordMedia.push({
        detailId: `RM_${recordId}_${index + 1}`,
        recordId,
        relTypeCd: 19000,
        url: `https://picsum.photos/seed/${photoId}/400/300`,
      })
    })

    return true
  }

  deleteRecord(recordId: string): boolean {
    const index = this.records.findIndex(item => item.recordId === recordId)
    if (index < 0) {
      return false
    }

    this.records.splice(index, 1)

    for (let i = this.recordMedia.length - 1; i >= 0; i -= 1) {
      if (this.recordMedia[i].recordId === recordId) {
        this.recordMedia.splice(i, 1)
      }
    }

    return true
  }

  getRecordMedia(recordId: string): RenovationRecordMedia[] {
    return cloneValue(this.recordMedia.filter(item => item.recordId === recordId))
  }

  /** 初始化装修申请与跟踪记录种子数据。 */
  private initData() {
    for (let index = 1; index <= 36; index += 1) {
      const state = [1000, 3000, 4000, 5000][index % 4]
      const rId = `REN_${String(index).padStart(4, '0')}`
      const roomId = `ROOM_${String(index).padStart(4, '0')}`
      const roomName = `${Math.floor((index - 1) / 6) + 1}栋${(index % 6) + 1}${String((index % 28) + 1).padStart(2, '0')}室`

      const renovation: RenovationApplication = {
        rId,
        communityId: 'COMM_001',
        roomId,
        roomName,
        userId: `U_${String(index).padStart(4, '0')}`,
        personName: generateChineseName(),
        personTel: generatePhoneNumber(),
        startTime: formatDateTime(Date.now() - index * 86400000 * 3),
        endTime: formatDateTime(Date.now() + index * 86400000),
        renovationCompany: `筑家装修公司${(index % 5) + 1}`,
        personMain: generateChineseName(),
        personMainTel: generatePhoneNumber(),
        isPostpone: index % 7 === 0 ? 'Y' : 'N',
        postponeTime: index % 7 === 0 ? formatDateTime(Date.now() + index * 86400000 * 2) : '',
        remark: '房屋装修申请',
        state,
        stateName: getRenovationStateName(state),
        isViolation: index % 9 === 0 ? 'Y' : 'N',
      }

      this.renovations.push(renovation)

      const recordId = `RR_${String(index).padStart(4, '0')}`
      this.records.push({
        recordId,
        rId,
        communityId: renovation.communityId,
        roomId,
        roomName,
        state,
        stateName: renovation.stateName,
        staffName: generateChineseName(),
        remark: `${renovation.stateName}跟踪记录`,
        createTime: formatDateTime(Date.now() - index * 3600000),
        isTrue: renovation.isViolation === 'Y' ? 'true' : 'false',
      })

      if (index % 2 === 0) {
        this.recordMedia.push({
          detailId: `RM_IMG_${index}`,
          recordId,
          relTypeCd: 19000,
          url: `https://picsum.photos/seed/renovation-${index}/400/300`,
          remark: '现场图片',
        })
      }

      if (index % 5 === 0) {
        this.recordMedia.push({
          detailId: `RM_VIDEO_${index}`,
          recordId,
          relTypeCd: 21000,
          url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
          remark: '现场视频',
        })
      }
    }
  }

  /** 生成新的装修记录 ID。 */
  private createRecordId(): string {
    this.recordSequence += 1
    return `RR_RUNTIME_${String(this.recordSequence).padStart(4, '0')}`
  }
}

/** 默认供运行时直接复用的 renovation 仓储实例。 */
export const renovationMockRepository = createRenovationMockRepository()

/** 统一获取装修状态名称。 */
function getRenovationStateName(state: number): string {
  return RENOVATION_STATE_NAMES[state] || '未知状态'
}

/** 克隆仓储返回值，避免外部篡改内部引用。 */
function cloneValue<T>(value: T): T {
  return structuredClone(value)
}
