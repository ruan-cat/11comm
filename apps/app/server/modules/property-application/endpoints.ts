import type {
  CheckUpdateRequest,
  DeleteApplicationRecordRequest,
  ReviewUpdateRequest,
  SaveApplicationRecordRequest,
} from '../../../src/types/property-application.ts'
import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { PropertyApplicationModuleRepository } from './repository.ts'
import { errorResponse, successResponse } from '../../shared/runtime/response-builder.ts'
import { propertyApplicationMockRepository } from './repository.ts'

const propertyApplicationLegacyConflictUrls = new Set([
  '/callComponent/core/list',
  '/app/fee.queryFeeDetail',
])

/** 创建 `property-application` 模块的共享 endpoint 定义。 */
export function createPropertyApplicationEndpointDefinitions(
  repository: PropertyApplicationModuleRepository = propertyApplicationMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/applyRoomDiscount/queryApplyRoomDiscount',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const ardId = asOptionalString(params.ardId)
        if (ardId) {
          const applyRoom = repository.getApplicationById(ardId)
          if (!applyRoom) {
            return errorResponse('申请不存在', '404')
          }

          return successResponse({
            list: [applyRoom],
            total: 1,
            page: Number(params.page) || 1,
            pageSize: Number(params.row) || 1,
            hasMore: false,
          }, '查询申请详情成功')
        }

        return successResponse(repository.getApplicationList({
          page: Number(params.page) || 1,
          row: Number(params.row) || 10,
          communityId: asOptionalString(params.communityId) || '',
          roomName: asOptionalString(params.roomName),
          state: asOptionalString(params.state),
        }), '查询申请列表成功')
      },
    },
    {
      url: '/app/applyRoomDiscount/updateApplyRoomDiscount',
      method: 'POST',
      handler: ({ body }) => {
        const success = repository.updateCheckInfo(body as CheckUpdateRequest)
        if (!success) {
          return errorResponse('申请不存在', '404')
        }

        return successResponse(null, '验房更新成功')
      },
    },
    {
      url: '/app/applyRoomDiscount/updateReviewApplyRoomDiscount',
      method: 'POST',
      handler: ({ body }) => {
        const success = repository.updateReviewInfo(body as ReviewUpdateRequest)
        if (!success) {
          return errorResponse('申请不存在', '404')
        }

        return successResponse(null, '审核更新成功')
      },
    },
    {
      url: '/callComponent/core/list',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getDictInfo({
        name: asOptionalString(params.name) || '',
        type: asOptionalString(params.type) || '',
      }), '查询字典成功'),
    },
    {
      url: '/app/feeDiscount/queryFeeDiscount',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getFeeDiscountList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 100,
        discountType: (asOptionalString(params.discountType) || '3003') as '3003',
        communityId: asOptionalString(params.communityId) || 'COMM_001',
      }), '查询费用折扣成功'),
    },
    {
      url: '/app/fee.queryFeeDetail',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getFeeDetailList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 50,
        communityId: asOptionalString(params.communityId) || 'COMM_001',
        feeId: asOptionalString(params.feeId) || '',
      }), '查询费用详情成功'),
    },
    {
      url: '/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getRecordList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: asOptionalString(params.communityId) || '',
        applicationId: asOptionalString(params.applicationId) || '',
        roomId: asOptionalString(params.roomId) || '',
        roomName: asOptionalString(params.roomName) || '',
      }), '查询跟踪记录列表成功'),
    },
    {
      url: '/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getRecordDetailList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: asOptionalString(params.communityId) || '',
        ardrId: asOptionalString(params.ardrId) || '',
        roomName: asOptionalString(params.roomName) || '',
      }), '查询跟踪记录详情成功'),
    },
    {
      url: '/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord',
      method: 'POST',
      handler: ({ body }) => {
        const success = repository.saveRecord(body as SaveApplicationRecordRequest)
        if (!success) {
          return errorResponse('保存失败', '500')
        }

        return successResponse(null, '保存跟踪记录成功')
      },
    },
    {
      url: '/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord',
      method: ['POST', 'DELETE'],
      handler: ({ params, body }) => {
        const requestData = {
          ardrId: asOptionalString(body?.ardrId) || asOptionalString(params.ardrId) || '',
          communityId: asOptionalString(body?.communityId) || asOptionalString(params.communityId) || '',
          roomName: asOptionalString(body?.roomName) || asOptionalString(params.roomName) || '',
          applicationId: asOptionalString(body?.applicationId) || asOptionalString(params.applicationId) || '',
          roomId: asOptionalString(body?.roomId) || asOptionalString(params.roomId) || '',
          state: asOptionalString(body?.state) || asOptionalString(params.state) || '',
          stateName: asOptionalString(body?.stateName) || asOptionalString(params.stateName) || '',
        } satisfies DeleteApplicationRecordRequest

        const success = repository.deleteRecord(requestData)
        if (!success) {
          return errorResponse('记录不存在', '404')
        }

        return successResponse(null, '删除跟踪记录成功')
      },
    },
  ]
}

/** 默认供 shared registry 直接注册的 property-application 端点集合。 */
export const propertyApplicationEndpointDefinitions = createPropertyApplicationEndpointDefinitions()

/**
 * 进入 Nitro 优先层的 property-application 端点集合。
 *
 * 两个重复旧 URL 继续交由 legacy compatibility 处理，
 * 避免覆盖 `repair` / `fee` 等模块的合并语义。
 */
export const propertyApplicationRuntimeEndpointDefinitions = propertyApplicationEndpointDefinitions.filter(
  definition => !propertyApplicationLegacyConflictUrls.has(definition.url),
)

/** 把未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}
