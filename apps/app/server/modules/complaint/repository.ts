import type {
  Complaint,
  ComplaintAppraise,
  ComplaintAppraiseListResponse,
  ComplaintEvent,
  ComplaintEventListResponse,
  ComplaintHistoryListResponse,
  ComplaintListResponse,
  ComplaintPhoto,
} from '../../../src/types/complaint.ts'
import { createPaginationResponse, formatDateTime, generateChineseName, generateId, generatePhoneNumber, generateTimeRange } from '../../shared/runtime/common-utils.ts'

export interface ComplaintModuleRepository {
  addComplaint: (complaint: Complaint) => Complaint
  auditComplaint: (data: { complaintId: string, context?: string, remark?: string, state?: string }) => boolean
  getComplaintById: (complaintId: string) => Complaint | undefined
  listAuditComplaints: (params: { page: number, row: number, process?: string }) => ComplaintListResponse
  listAuditHistoryComplaints: (params: { page: number, row: number, process?: string }) => ComplaintHistoryListResponse
  listComplaintAppraise: (complaintId: string, page: number, row: number) => ComplaintAppraiseListResponse
  listComplaintEvent: (complaintId: string, page: number, row: number) => ComplaintEventListResponse
  replyComplaintAppraise: (appraiseId: string, replyContext: string) => boolean
  saveComplaint: (data: Record<string, any>) => { complaint: Complaint }
}

/** 创建 `complaint` 模块的 mock 内存仓储。 */
export function createComplaintMockRepository(): ComplaintModuleRepository {
  return new ComplaintDatabase()
}

class ComplaintDatabase implements ComplaintModuleRepository {
  private readonly complaints: Complaint[] = Array.from({ length: 40 }, (_, index) => this.createComplaint(index + 1))
  private readonly events: ComplaintEvent[] = []
  private readonly appraises: ComplaintAppraise[] = []

  constructor() {
    for (const complaint of this.complaints.slice(0, 15)) {
      this.events.push(this.createCreateEvent(complaint))
      this.events.push({
        eventId: generateId('EVENT'),
        complaintId: complaint.complaintId,
        communityId: complaint.communityId,
        eventType: '1001',
        eventTypeName: '处理',
        createUserId: complaint.userId,
        createUserName: '物业工作人员',
        createTime: formatDateTime(Date.now() - 3600000),
        remark: '已受理',
      })
      this.appraises.push({
        appraiseId: generateId('APPR'),
        complaintId: complaint.complaintId,
        communityId: complaint.communityId,
        context: '处理及时，服务满意',
        score: 5,
        state: 'C',
        stateName: '已回复',
        replyContext: '感谢反馈',
        createTime: generateTimeRange(-10, 0),
        createUserName: generateChineseName(),
      })
    }
  }

  listAuditComplaints(params: { page: number, row: number, process?: string }): ComplaintListResponse {
    const list = this.complaints.filter(item => item.taskId)
    const result = createPaginationResponse(list, params.page, params.row)
    return {
      data: result.list,
      total: result.total,
      page: result.page,
      records: result.pageSize,
    }
  }

  listAuditHistoryComplaints(params: { page: number, row: number, process?: string }) {
    const result = createPaginationResponse(this.complaints, params.page, params.row)
    const formattedList = result.list.map(item => ({
      ...item,
      createTime: item.createTime.slice(5, 10),
    }))

    return {
      complaints: formattedList,
      total: result.total,
      page: result.page,
      records: result.pageSize,
    }
  }

  saveComplaint(data: Record<string, any>) {
    const complaint: Complaint = {
      complaintId: generateId('COMP'),
      communityId: data.communityId || 'COMM_001',
      storeId: data.storeId || 'STORE_001',
      userId: data.userId || 'USER_001',
      typeCd: String(data.typeCd || '809001'),
      typeName: String(data.typeCd) === '809001' ? '投诉' : '建议',
      complaintName: String(data.complaintName || ''),
      tel: String(data.tel || ''),
      roomId: String(data.roomId || ''),
      roomName: `房间-${String(data.roomId || '')}`,
      context: String(data.context || ''),
      createTime: formatDateTime(),
      taskId: generateId('TASK'),
      photos: (data.photos || []).map((item: ComplaintPhoto) => ({
        photoId: generateId('PHOTO'),
        complaintId: '',
        photo: item.photo,
        url: '',
      })),
    }

    this.addComplaint(complaint)
    return { complaint }
  }

  auditComplaint(data: { complaintId: string, context?: string, remark?: string, state?: string }) {
    const complaint = this.getComplaintById(data.complaintId)
    if (!complaint) {
      return false
    }

    this.events.push({
      eventId: generateId('EVENT'),
      complaintId: complaint.complaintId,
      communityId: complaint.communityId,
      eventType: '1001',
      eventTypeName: '处理',
      createUserId: complaint.userId,
      createUserName: '物业工作人员',
      createTime: formatDateTime(),
      remark: data.context || data.remark,
    })

    if (data.state) {
      complaint.state = data.state
      complaint.stateName = data.state === '1100' ? '已处理' : '无法处理'
    }

    return true
  }

  listComplaintEvent(complaintId: string, page: number, row: number) {
    const list = this.events.filter(event => event.complaintId === complaintId)
    const result = createPaginationResponse(list, page, row)
    return {
      data: result.list,
      total: result.total,
    }
  }

  listComplaintAppraise(complaintId: string, page: number, row: number) {
    const list = this.appraises.filter(appraise => appraise.complaintId === complaintId)
    const result = createPaginationResponse(list, page, row)
    return {
      data: result.list,
      total: result.total,
    }
  }

  replyComplaintAppraise(appraiseId: string, replyContext: string) {
    const appraise = this.appraises.find(item => item.appraiseId === appraiseId)
    if (!appraise) {
      return false
    }

    appraise.state = 'C'
    appraise.stateName = '已回复'
    appraise.replyContext = replyContext
    return true
  }

  getComplaintById(complaintId: string) {
    return this.complaints.find(item => item.complaintId === complaintId)
  }

  addComplaint(complaint: Complaint) {
    this.complaints.unshift(complaint)
    this.events.push(this.createCreateEvent(complaint))
    return complaint
  }

  private createComplaint(index: number): Complaint {
    const complaintId = `COMP_${index.toString().padStart(3, '0')}`
    const typeCd = index % 3 === 0 ? '809002' : '809001'

    return {
      complaintId,
      communityId: 'COMM_001',
      storeId: 'STORE_001',
      userId: `USER_${index.toString().padStart(3, '0')}`,
      typeCd,
      typeName: typeCd === '809001' ? '投诉' : '建议',
      complaintName: generateChineseName(),
      tel: generatePhoneNumber(),
      roomId: `ROOM_${index}`,
      roomName: `${Math.floor(index / 2) + 1}栋1单元10${index % 10}`,
      floorNum: String((index % 10) + 1),
      unitNum: String((index % 4) + 1),
      roomNum: String(100 + index),
      context: `投诉内容 ${index}`,
      state: index % 2 === 0 ? '1100' : '1200',
      stateName: index % 2 === 0 ? '已处理' : '待处理',
      createTime: generateTimeRange(-30, 0),
      taskId: `TASK_${complaintId}`,
      photos: [],
    }
  }

  private createCreateEvent(complaint: Complaint): ComplaintEvent {
    return {
      eventId: generateId('EVENT'),
      complaintId: complaint.complaintId,
      communityId: complaint.communityId,
      eventType: '1000',
      eventTypeName: '创建',
      createUserId: complaint.userId,
      createUserName: complaint.complaintName,
      createTime: complaint.createTime,
      remark: complaint.context,
    }
  }
}

/** 默认复用的 complaint mock 仓储实例。 */
export const complaintMockRepository = createComplaintMockRepository()
