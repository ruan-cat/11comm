/**
 * 房屋管理模块类型定义
 * 包含：业主管理、装修管理、装修跟踪记录
 */

/** 业主类型 */
export interface OwnerMember {
  memberId: string
  ownerId: string
  communityId: string
  name: string
  ownerTypeCd: string
  ownerTypeName: string
  personRole?: string
  personType?: string
  roomName: string
  roomId?: string
  link: string
  idCard?: string
  address?: string
  remark?: string
  sex?: string
  faceUrl?: string
}

/** 业主列表查询参数 */
export interface OwnerQueryParams {
  page: number
  row: number
  communityId: string
  name?: string
  link?: string
  roomName?: string
  memberId?: string
}

/** 保存业主参数 */
export interface SaveOwnerPayload {
  name: string
  link: string
  ownerTypeCd: string
  personRole: string
  personType: string
  roomName: string
  communityId: string
  idCard?: string
  address?: string
  remark?: string
  sex?: string
  ownerPhotoUrl?: string
}

/** 更新业主参数 */
export interface UpdateOwnerPayload {
  memberId: string
  ownerId: string
  communityId: string
  name: string
  link: string
  ownerTypeCd: string
  idCard?: string
  address?: string
  remark?: string
  sex?: string
  ownerPhotoUrl?: string
}

/** 装修申请 */
export interface RenovationApplication {
  rId: string
  communityId: string
  roomId: string
  roomName: string
  userId: string
  personName: string
  personTel: string
  startTime: string
  endTime: string
  renovationCompany: string
  personMain: string
  personMainTel: string
  isPostpone: 'Y' | 'N'
  postponeTime?: string
  remark: string
  state: number
  stateName: string
  isViolation: 'Y' | 'N'
}

/** 装修申请查询参数 */
export interface RenovationQueryParams {
  page: number
  row: number
  communityId: string
  roomName?: string
  state?: string
}

/** 装修记录 */
export interface RenovationRecord {
  recordId: string
  rId: string
  communityId: string
  roomId: string
  roomName: string
  state: number
  stateName: string
  staffName: string
  remark: string
  createTime: string
  isTrue?: string
}

/** 装修记录查询参数 */
export interface RenovationRecordQueryParams {
  page: number
  row: number
  communityId: string
  rId: string
  roomName?: string
  roomId?: string
}

/** 装修记录详情媒体 */
export interface RenovationRecordMedia {
  detailId: string
  recordId: string
  relTypeCd: 19000 | 21000
  url: string
  remark?: string
}

/** 装修审核/验收参数 */
export interface RenovationExaminePayload {
  communityId: string
  rId: string
  roomId: string
  roomName: string
  userId: string
  startTime: string
  endTime: string
  remark: string
  detailType: '1001'
  state: number
  examineRemark: string
}

/** 新增装修跟踪记录参数 */
export interface SaveRenovationRecordPayload {
  rId: string
  roomId: string
  roomName: string
  state: number
  stateName: string
  photos: string[]
  videoName?: string
  remark: string
  detailType: '1001'
  communityId: string
  examineRemark?: string
  isTrue: string
}

/** 装修状态字典 */
export const RENOVATION_STATE_OPTIONS = [
  { name: '全部', statusCd: '' },
  { name: '待审核', statusCd: '1000' },
  { name: '审核不通过', statusCd: '2000' },
  { name: '施工中', statusCd: '3000' },
  { name: '待验收', statusCd: '4000' },
  { name: '验收通过', statusCd: '5000' },
  { name: '验收不通过', statusCd: '6000' },
] as const

/** 业主角色选项 */
export const OWNER_ROLE_OPTIONS = [
  { label: '家庭成员', value: '3' },
  { label: '租客', value: '2' },
  { label: '公司员工', value: '4' },
  { label: '其他', value: '99' },
] as const
