import type {
  RenovationExaminePayload,
  SaveRenovationRecordPayload,
} from '../../../src/types/property-management.ts'
import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { RenovationModuleRepository } from './repository.ts'
import { errorResponse, successResponse } from '../../shared/runtime/response-builder.ts'
import { renovationMockRepository } from './repository.ts'

/** 创建 `renovation` 模块的共享 endpoint 定义。 */
export function createRenovationEndpointDefinitions(
  repository: RenovationModuleRepository = renovationMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/roomRenovation/queryRoomRenovation',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.queryRenovations({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: asOptionalString(params.communityId) || 'COMM_001',
        roomName: asOptionalString(params.roomName),
        state: asOptionalString(params.state),
      }), '查询成功'),
    },
    {
      url: '/app/roomRenovation/updateRoomToExamine',
      method: 'POST',
      handler: ({ body }) => {
        const rId = asOptionalString(body?.rId)
        const state = body?.state === undefined || body?.state === null ? undefined : Number(body.state)
        if (!rId || state === undefined || Number.isNaN(state)) {
          return errorResponse('参数不完整', '400')
        }

        const success = repository.updateExamine({
          rId,
          state,
          examineRemark: asOptionalString(body?.examineRemark) || '',
        } satisfies Pick<RenovationExaminePayload, 'examineRemark' | 'rId' | 'state'>)

        if (!success) {
          return errorResponse('装修申请不存在', '404')
        }

        return successResponse({ success: true }, '审核成功')
      },
    },
    {
      url: '/app/roomRenovation/saveRoomRenovationDetail',
      method: 'POST',
      handler: ({ body }) => {
        const rId = asOptionalString(body?.rId)
        const state = body?.state === undefined || body?.state === null ? undefined : Number(body.state)
        if (!rId || state === undefined || Number.isNaN(state)) {
          return errorResponse('参数不完整', '400')
        }

        const success = repository.updateExamine({
          rId,
          state,
          examineRemark: asOptionalString(body?.examineRemark) || '',
        } satisfies Pick<RenovationExaminePayload, 'examineRemark' | 'rId' | 'state'>)

        if (!success) {
          return errorResponse('装修申请不存在', '404')
        }

        return successResponse({ success: true }, '验收成功')
      },
    },
    {
      url: '/app/roomRenovation/updateRoomRenovationState',
      method: 'POST',
      handler: ({ body }) => {
        const rId = asOptionalString(body?.rId)
        if (!rId) {
          return errorResponse('rId 不能为空', '400')
        }

        const success = repository.finishRenovation(rId)
        if (!success) {
          return errorResponse('装修申请不存在', '404')
        }

        return successResponse({ success: true }, '状态更新成功')
      },
    },
    {
      url: '/app/roomRenovation/queryRoomRenovationRecord',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const rId = asOptionalString(params.rId)
        if (!rId) {
          return errorResponse('rId 不能为空', '400')
        }

        return successResponse(repository.queryRecords({
          page: Number(params.page) || 1,
          row: Number(params.row) || 10,
          rId,
          communityId: asOptionalString(params.communityId) || 'COMM_001',
          roomName: asOptionalString(params.roomName),
          roomId: asOptionalString(params.roomId),
        }), '查询成功')
      },
    },
    {
      url: '/app/roomRenovation/queryRoomRenovationRecordDetail',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const recordId = asOptionalString(params.recordId)
        if (!recordId) {
          return errorResponse('recordId 不能为空', '400')
        }

        return successResponse(repository.getRecordMedia(recordId), '查询成功')
      },
    },
    {
      url: '/app/roomRenovation/updateRoomDecorationRecord',
      method: 'POST',
      handler: ({ body }) => {
        const rId = asOptionalString(body?.rId)
        const roomId = asOptionalString(body?.roomId)
        const roomName = asOptionalString(body?.roomName)
        const communityId = asOptionalString(body?.communityId)
        const remark = asOptionalString(body?.remark)
        if (!rId || !roomId || !roomName || !communityId || !remark) {
          return errorResponse('参数不完整', '400')
        }

        const success = repository.addRecord({
          rId,
          roomId,
          roomName,
          communityId,
          remark,
          detailType: '1001',
          state: Number(body?.state) || 3000,
          stateName: asOptionalString(body?.stateName) || '施工中',
          photos: Array.isArray(body?.photos) ? body.photos : [],
          videoName: asOptionalString(body?.videoName),
          examineRemark: asOptionalString(body?.examineRemark),
          isTrue: asOptionalString(body?.isTrue) || 'false',
        } satisfies SaveRenovationRecordPayload)

        if (!success) {
          return errorResponse('装修申请不存在', '404')
        }

        return successResponse({ success: true }, '添加成功')
      },
    },
    {
      url: '/app/roomRenovation/deleteRoomRenovationRecord',
      method: 'POST',
      handler: ({ body }) => {
        const recordId = asOptionalString(body?.recordId)
        if (!recordId) {
          return errorResponse('recordId 不能为空', '400')
        }

        const success = repository.deleteRecord(recordId)
        if (!success) {
          return errorResponse('记录不存在', '404')
        }

        return successResponse({ success: true }, '删除成功')
      },
    },
  ]
}

/** 默认供 shared registry 直接注册的 renovation 端点集合。 */
export const renovationEndpointDefinitions = createRenovationEndpointDefinitions()

/** renovation 当前没有 legacy URL 冲突，可直接进入 Nitro 优先层。 */
export const renovationRuntimeEndpointDefinitions = renovationEndpointDefinitions

/** 把未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}
