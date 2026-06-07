/**
 * 空置房申请 app 本地 Mock 接口。
 * 为了断开旧内置 Nitro server 依赖，本文件自带 fixture 与 handler。
 */

import type {
  ApplicationRecord,
  ApplicationRecordDetail,
  ApplicationState,
  CheckUpdateRequest,
  DeleteApplicationRecordRequest,
  DictInfo,
  FeeDetail,
  FeeDiscount,
  PropertyApplication,
  ReviewUpdateRequest,
  SaveApplicationRecordRequest,
} from '../../types/property-application'
import { createPaginationResponse, defineUniAppMock, errorResponse, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

const applyRooms: PropertyApplication[] = [
  {
    ardId: 'ARD_001',
    applyType: '1001',
    applyTypeName: '空置房申请',
    roomId: 'ROOM_001',
    roomName: '1栋101A室',
    communityId: 'COMM_001',
    createUserName: '张三',
    createUserTel: '13812345678',
    createRemark: '业主申请空置房费用减免',
    checkRemark: '验房通过，房屋状态良好',
    reviewRemark: '审批通过，同意给予费用减免',
    startTime: '2024-01-15 00:00:00',
    endTime: '2024-03-15 23:59:59',
    feeId: 'FEE_001',
    state: '4',
    stateName: '审批通过',
    urls: ['https://picsum.photos/400/300?random=room1'],
    createTime: '2024-01-10 10:30:00',
    updateTime: '2024-01-20 14:20:00',
  },
  {
    ardId: 'ARD_002',
    applyType: '1001',
    applyTypeName: '空置房申请',
    roomId: 'ROOM_002',
    roomName: '2栋202B室',
    communityId: 'COMM_001',
    createUserName: '李四',
    createUserTel: '13823456789',
    createRemark: '房屋长期空置，申请减免物业费',
    checkRemark: '验房通过，房屋设施完好',
    reviewRemark: '',
    startTime: '2024-02-01 00:00:00',
    endTime: '2024-04-01 23:59:59',
    feeId: 'FEE_002',
    state: '1',
    stateName: '待验房',
    urls: ['https://picsum.photos/400/300?random=room2'],
    createTime: '2024-01-25 09:15:00',
    updateTime: '2024-01-25 09:15:00',
  },
  {
    ardId: 'ARD_003',
    applyType: '1001',
    applyTypeName: '空置房申请',
    roomId: 'ROOM_003',
    roomName: '3栋303C室',
    communityId: 'COMM_001',
    createUserName: '王五',
    createUserTel: '13834567890',
    createRemark: '房屋装修期间空置，申请费用减免',
    checkRemark: '验房不通过，房屋存在损坏',
    reviewRemark: '',
    startTime: '2024-01-20 00:00:00',
    endTime: '2024-02-20 23:59:59',
    feeId: 'FEE_003',
    state: '3',
    stateName: '验房不通过',
    urls: ['https://picsum.photos/400/300?random=room3'],
    createTime: '2024-01-15 16:45:00',
    updateTime: '2024-01-18 11:30:00',
  },
]

const feeDiscounts: FeeDiscount[] = [
  {
    discountId: 'DISCOUNT_001',
    discountName: '季度空置房优惠',
    discountType: '3003',
    discountAmount: 200,
    communityId: 'COMM_001',
  },
  {
    discountId: 'DISCOUNT_002',
    discountName: '半年空置房优惠',
    discountType: '3003',
    discountAmount: 500,
    communityId: 'COMM_001',
  },
]

const feeDetails: FeeDetail[] = [
  {
    detailId: 'DETAIL_001',
    feeName: '物业管理费',
    receivedAmount: 300,
    createTime: '2024-01-15 00:00:00',
    checked: false,
    feeId: 'FEE_001',
    roomId: 'ROOM_001',
    communityId: 'COMM_001',
  },
  {
    detailId: 'DETAIL_002',
    feeName: '垃圾处理费',
    receivedAmount: 50,
    createTime: '2024-01-15 00:00:00',
    checked: false,
    feeId: 'FEE_001',
    roomId: 'ROOM_001',
    communityId: 'COMM_001',
  },
]

const records: ApplicationRecord[] = [
  {
    ardrId: 'ARDR_001',
    applicationId: 'ARD_001',
    roomId: 'ROOM_001',
    roomName: '1栋101A室',
    state: '4',
    stateName: '审批通过',
    remark: '完成最终审批，同意费用减免申请',
    createUserName: '管理员',
    createTime: '2024-01-20 14:20:00',
    communityId: 'COMM_001',
  },
  {
    ardrId: 'ARDR_002',
    applicationId: 'ARD_001',
    roomId: 'ROOM_001',
    roomName: '1栋101A室',
    state: '1',
    stateName: '待验房',
    remark: '开始验房流程',
    createUserName: '验房员',
    createTime: '2024-01-18 10:30:00',
    communityId: 'COMM_001',
  },
]

const recordDetails: ApplicationRecordDetail[] = [
  {
    ardrId: 'ARDR_001',
    applicationId: 'ARD_001',
    roomId: 'ROOM_001',
    roomName: '1栋101A室',
    relTypeCd: '19000',
    url: 'https://picsum.photos/400/300?random=record1',
    remark: '验房照片',
    createTime: '2024-01-18 10:30:00',
  },
  {
    ardrId: 'ARDR_002',
    applicationId: 'ARD_001',
    roomId: 'ROOM_001',
    roomName: '1栋101A室',
    relTypeCd: '21000',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    remark: '验房视频',
    createTime: '2024-01-18 10:35:00',
  },
]

const stateDictItems: DictInfo[] = [
  { statusCd: '1', name: '待验房' },
  { statusCd: '2', name: '待审核' },
  { statusCd: '3', name: '验房不通过' },
  { statusCd: '4', name: '审批通过' },
  { statusCd: '5', name: '审批不通过' },
]

export default defineUniAppMock([
  {
    url: '/app/applyRoomDiscount/queryApplyRoomDiscount',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const ardId = asOptionalString(params.ardId)

      if (ardId) {
        const applyRoom = applyRooms.find(item => item.ardId === ardId)

        if (!applyRoom) {
          return errorResponse('申请不存在', '404')
        }

        return successResponse({
          list: [cloneValue(applyRoom)],
          total: 1,
          page: asPositiveNumber(params.page, 1),
          pageSize: asPositiveNumber(params.row, 1),
          hasMore: false,
        }, '查询申请详情成功')
      }

      const list = applyRooms
        .filter(item => item.communityId === (asOptionalString(params.communityId) || 'COMM_001'))
        .filter(item => !params.roomName || item.roomName.includes(asOptionalString(params.roomName) || ''))
        .filter(item => !params.state || item.state === asOptionalString(params.state))

      return successResponse(createPaginationResponse(list, asPositiveNumber(params.page, 1), asPositiveNumber(params.row, 10)), '查询申请列表成功')
    },
  },
  {
    url: '/app/applyRoomDiscount/updateApplyRoomDiscount',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const body = context.body as Partial<CheckUpdateRequest> | undefined
      const applyRoom = applyRooms.find(item => item.ardId === body?.ardId)

      if (!applyRoom || !body) {
        return errorResponse('申请不存在', '404')
      }

      applyRoom.state = body.state as ApplicationState
      applyRoom.stateName = body.state === '2' ? '验房通过' : '验房不通过'
      applyRoom.checkRemark = body.checkRemark || ''
      applyRoom.startTime = body.startTime || applyRoom.startTime
      applyRoom.endTime = body.endTime || applyRoom.endTime
      applyRoom.updateTime = '2024-02-01 10:00:00'

      return successResponse(null, '验房更新成功')
    },
  },
  {
    url: '/app/applyRoomDiscount/updateReviewApplyRoomDiscount',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const body = context.body as Partial<ReviewUpdateRequest> | undefined
      const applyRoom = applyRooms.find(item => item.ardId === body?.ardId)

      if (!applyRoom || !body) {
        return errorResponse('申请不存在', '404')
      }

      applyRoom.state = body.state as ApplicationState
      applyRoom.stateName = body.state === '4' ? '审批通过' : '审批不通过'
      applyRoom.reviewRemark = body.reviewRemark || ''
      applyRoom.startTime = body.startTime || applyRoom.startTime
      applyRoom.endTime = body.endTime || applyRoom.endTime
      applyRoom.updateTime = '2024-02-01 10:30:00'

      return successResponse(null, '审核更新成功')
    },
  },
  {
    url: '/callComponent/core/list',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const list = params.name === 'apply_room_discount' && params.type === 'state' ? stateDictItems : []

      return successResponse(cloneValue(list), '查询字典成功')
    },
  },
  {
    url: '/app/feeDiscount/queryFeeDiscount',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const list = feeDiscounts
        .filter(item => item.discountType === (asOptionalString(params.discountType) || '3003'))
        .filter(item => item.communityId === (asOptionalString(params.communityId) || 'COMM_001'))

      return successResponse(cloneValue(list), '查询费用折扣成功')
    },
  },
  {
    url: '/app/fee.queryFeeDetail',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const list = feeDetails
        .filter(item => item.communityId === (asOptionalString(params.communityId) || 'COMM_001'))
        .filter(item => !params.feeId || item.feeId === asOptionalString(params.feeId))

      return successResponse({ feeDetails: cloneValue(list) }, '查询费用详情成功')
    },
  },
  {
    url: '/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const list = records
        .filter(item => item.communityId === (asOptionalString(params.communityId) || 'COMM_001'))
        .filter(item => !params.applicationId || item.applicationId === asOptionalString(params.applicationId))
        .filter(item => !params.roomId || item.roomId === asOptionalString(params.roomId))
        .filter(item => !params.roomName || item.roomName.includes(asOptionalString(params.roomName) || ''))

      return successResponse(createPaginationResponse(list, asPositiveNumber(params.page, 1), asPositiveNumber(params.row, 10)), '查询跟进记录列表成功')
    },
  },
  {
    url: '/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const list = recordDetails
        .filter(item => !params.ardrId || item.ardrId === asOptionalString(params.ardrId))
        .filter(item => !params.roomName || item.roomName.includes(asOptionalString(params.roomName) || ''))

      return successResponse(cloneValue(list), '查询跟进记录详情成功')
    },
  },
  {
    url: '/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const body = context.body as Partial<SaveApplicationRecordRequest> | undefined

      records.unshift({
        ardrId: `ARDR_${records.length + 1}`.padStart(8, '0'),
        applicationId: body?.applicationId || 'ARD_001',
        roomId: body?.roomId || 'ROOM_001',
        roomName: body?.roomName || '1栋101A室',
        state: body?.state || '1',
        stateName: body?.stateName || '待验房',
        remark: body?.remark || '新增跟进记录',
        createUserName: '当前用户',
        createTime: '2024-02-01 11:00:00',
        communityId: body?.communityId || 'COMM_001',
      })

      return successResponse(null, '保存跟进记录成功')
    },
  },
  {
    url: '/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord',
    method: ['POST', 'DELETE'],
    body: (context: MockContext = {}) => {
      const data = getRequestParams(context) as Partial<DeleteApplicationRecordRequest>
      const recordIndex = records.findIndex(item => item.ardrId === data.ardrId)

      if (recordIndex === -1) {
        return errorResponse('记录不存在', '404')
      }

      records.splice(recordIndex, 1)

      return successResponse(null, '删除跟进记录成功')
    },
  },
])

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

/** 克隆响应数据，避免外部调用改写本地 fixture。 */
function cloneValue<T>(value: T): T {
  return structuredClone(value)
}
