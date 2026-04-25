import type { EndpointDefinition, EndpointDispatchContext } from '../../shared/runtime/endpoint-registry.ts'
import type { RepairModuleRepository } from './repository.ts'
import { errorResponse, successResponse } from '../../shared/runtime/response-builder.ts'
import { repairMockRepository } from './repository.ts'

/** 与其他 legacy mock 存在重复 URL 的 repair 端点。 */
export const repairLegacyConflictUrls = new Set([
  '/callComponent/core/list',
  '/app/resourceStoreType.listResourceStoreTypes',
])

/** 创建 `repair` 模块的共享 endpoint 定义。 */
export function createRepairEndpointDefinitions(
  repository: RepairModuleRepository = repairMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/ownerRepair.listOwnerRepairs',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const result = repository.list(toRepairListParams(params))
        return successResponse({
          ownerRepairs: result.list,
          total: result.total,
          page: result.page,
          row: result.pageSize,
        }, '查询成功')
      },
    },
    {
      url: '/app/ownerRepair.listStaffRepairs',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const result = repository.listDispatch({
          page: Number(params.page) || 1,
          row: Number(params.row) || 10,
          communityId: String(params.communityId || ''),
          keyword: asOptionalString(params.keyword),
          statusCd: asOptionalString(params.statusCd || params.status),
        })

        return successResponse({
          ownerRepairs: result.list,
          total: result.list.length,
          page: result.page,
          row: result.pageSize,
        }, '查询成功')
      },
    },
    {
      url: '/app/ownerRepair.listStaffFinishRepairs',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const result = repository.listFinish({
          page: Number(params.page) || 1,
          row: Number(params.row) || 10,
          communityId: String(params.communityId || ''),
          keyword: asOptionalString(params.keyword),
        } as any)

        return successResponse({
          ownerRepairs: result.list,
          total: result.total,
          page: result.page,
          row: result.pageSize,
        }, '查询成功')
      },
    },
    {
      url: '/app/ownerRepair.queryOwnerRepair',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const repairId = requireString(params, 'repairId', '维修工单ID不能为空')
        if (!repairId) {
          return errorResponse('维修工单ID不能为空', '400')
        }

        const repair = repository.getById(repairId)
        if (!repair) {
          return errorResponse('维修工单不存在', '404')
        }

        return successResponse({ ownerRepair: repair }, '查询成功')
      },
    },
    {
      url: '/app/ownerRepair.saveOwnerRepair',
      method: 'POST',
      handler: ({ body }) => {
        const validationError = validateCreateRepairBody(body || {})
        if (validationError) {
          return validationError
        }

        const createdRepair = repository.create(body || {})
        return successResponse({ ownerRepair: createdRepair }, '创建维修工单成功')
      },
    },
    {
      url: '/app/ownerRepair.updateOwnerRepair',
      method: 'POST',
      handler: ({ body }) => {
        const repairId = requireString(body, 'repairId', '维修工单ID不能为空')
        if (!repairId) {
          return errorResponse('维修工单ID不能为空', '400')
        }

        const updatedRepair = repository.update(repairId, body || {})
        if (!updatedRepair) {
          return errorResponse('维修工单不存在', '404')
        }

        return successResponse({ ownerRepair: updatedRepair }, '更新维修工单成功')
      },
    },
    {
      url: '/app/ownerRepair.repairDispatch',
      method: 'POST',
      handler: ({ body }) => {
        const repairId = requireString(body, 'repairId', '维修工单ID不能为空')
        if (!repairId) {
          return errorResponse('维修工单ID不能为空', '400')
        }

        const action = requireString(body, 'action', '操作类型不能为空')
        if (!action) {
          return errorResponse('操作类型不能为空', '400')
        }

        if (!body?.staffId && action !== 'RETURN') {
          return errorResponse('维修师傅不能为空', '400')
        }

        const repair = repository.transfer(repairId, action, asOptionalString(body?.staffName))
        if (!repair) {
          return errorResponse('维修工单不存在', '404')
        }

        const message = action === 'DISPATCH'
          ? '派单成功'
          : action === 'TRANSFER'
            ? '转单成功'
            : '退单成功'

        return successResponse({ success: true }, message)
      },
    },
    {
      url: '/app/ownerRepair.repairFinish',
      method: 'POST',
      handler: ({ body }) => {
        const repairId = requireString(body, 'repairId', '维修工单ID不能为空')
        if (!repairId) {
          return errorResponse('维修工单ID不能为空', '400')
        }

        if (!body?.feeFlag) {
          return errorResponse('请选择维修类型', '400')
        }

        if (!body?.context) {
          return errorResponse('请填写处理意见', '400')
        }

        const repair = repository.finish(repairId, Number(body.totalPrice || 0))
        if (!repair) {
          return errorResponse('维修工单不存在', '404')
        }

        return successResponse({ success: true }, '办结工单成功')
      },
    },
    {
      url: '/app/ownerRepair.repairEnd',
      method: 'POST',
      handler: ({ body }) => {
        const repairId = requireString(body, 'repairId', '维修工单ID不能为空')
        if (!repairId) {
          return errorResponse('维修工单ID不能为空', '400')
        }

        const repair = repository.end(repairId)
        if (!repair) {
          return errorResponse('维修工单不存在', '404')
        }

        return successResponse({ success: true }, '结束订单成功')
      },
    },
    {
      url: '/callComponent/ownerRepair.appraiseRepair',
      method: 'POST',
      handler: ({ body }) => {
        const repairId = requireString(body, 'repairId', '维修工单ID不能为空')
        if (!repairId) {
          return errorResponse('维修工单ID不能为空', '400')
        }

        const comment = requireString(body, 'context', '请填写评价内容')
        if (!comment) {
          return errorResponse('请填写评价内容', '400')
        }

        const repair = repository.setAppraise(repairId, comment)
        if (!repair) {
          return errorResponse('维修工单不存在', '404')
        }

        return successResponse({ success: true }, '评价成功')
      },
    },
    {
      url: '/app/repair.replyRepairAppraise',
      method: 'POST',
      handler: ({ body }) => {
        const repairId = requireString(body, 'repairId', '维修工单ID不能为空')
        if (!repairId) {
          return errorResponse('维修工单ID不能为空', '400')
        }

        if (!body?.reply) {
          return errorResponse('请填写回复内容', '400')
        }

        const repair = repository.replyAppraise(repairId)
        if (!repair) {
          return errorResponse('维修工单不存在', '404')
        }

        return successResponse({ success: true }, '回复成功')
      },
    },
    {
      url: '/app/ownerRepair.listRepairStaffs',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const staffs = repository.listRepairStaffs(asOptionalString(params.repairType))
        return successResponse({ staffs }, '查询成功')
      },
    },
    {
      url: '/app/repair.listRepairTypeUsers',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const users = repository.listRepairTypeUsers(asOptionalString(params.repairType))
        return successResponse({ users }, '查询成功')
      },
    },
    {
      url: '/app/resourceStore.listUserStorehouses',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const result = repository.listUserStorehouses({
          keyword: asOptionalString(params.keyword),
          page: Number(params.page) || 1,
          row: Number(params.row) || 20,
        })

        return successResponse(result, '查询成功')
      },
    },
    {
      url: '/app/ownerRepair.getRepairStatistics',
      method: ['GET', 'POST'],
      handler: () => successResponse(repository.getStatistics(), '获取统计数据成功'),
    },
    {
      url: '/app/resourceStoreType.listResourceStoreTypes',
      method: ['GET', 'POST'],
      handler: ({ params }) =>
        successResponse(repository.listResourceStoreTypes(asOptionalString(params.parentId)), '查询成功'),
    },
    {
      url: '/app/repairSetting.listRepairSettings',
      method: ['GET', 'POST'],
      handler: ({ params }) =>
        successResponse(repository.listRepairSettings({
          publicArea: asOptionalString(params.publicArea),
          page: Number(params.page) || 1,
          row: Number(params.row) || 10,
        }), '查询成功'),
    },
    {
      url: '/callComponent/core/list',
      method: ['GET', 'POST'],
      handler: ({ params }) =>
        successResponse({ data: repository.listDict(asOptionalString(params.domain)) }, '查询成功'),
    },
    {
      url: '/app/ownerRepair.repairStart',
      method: 'POST',
      handler: ({ body }) => {
        const repairId = requireString(body, 'repairId', '维修工单ID不能为空')
        if (!repairId) {
          return errorResponse('维修工单ID不能为空', '400')
        }

        const repair = repository.start(repairId)
        if (!repair) {
          return errorResponse('维修工单不存在', '404')
        }

        return successResponse({ success: true }, '开始维修成功')
      },
    },
    {
      url: '/app/ownerRepair.repairStop',
      method: 'POST',
      handler: ({ body }) => {
        const repairId = requireString(body, 'repairId', '维修工单ID不能为空')
        if (!repairId) {
          return errorResponse('维修工单ID不能为空', '400')
        }

        const repair = repository.stop(repairId)
        if (!repair) {
          return errorResponse('维修工单不存在', '404')
        }

        return successResponse({ success: true }, '暂停维修成功')
      },
    },
    {
      url: '/app/ownerRepair.grabbingRepair',
      method: 'POST',
      handler: ({ body }) => {
        const repairId = requireString(body, 'repairId', '维修工单ID不能为空')
        if (!repairId) {
          return errorResponse('维修工单ID不能为空', '400')
        }

        if (!body?.staffId) {
          return errorResponse('维修师傅不能为空', '400')
        }

        const currentRepair = repository.getById(repairId)
        if (!currentRepair) {
          return errorResponse('维修工单不存在', '404')
        }

        if (currentRepair.statusCd !== '10001') {
          return errorResponse('该工单已被抢单', '400')
        }

        repository.grab(repairId, asOptionalString(body?.staffName))
        return successResponse({ success: true }, '抢单成功')
      },
    },
    {
      url: '/app/dict.queryRepairStates',
      method: ['GET', 'POST'],
      handler: () => successResponse(repository.listRepairStates(), '查询成功'),
    },
    {
      url: '/app/ownerRepair.listRepairStaffRecords',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const repairId = requireString(params, 'repairId', '维修工单ID不能为空')
        if (!repairId) {
          return errorResponse('维修工单ID不能为空', '400')
        }

        const repair = repository.getById(repairId)
        if (!repair) {
          return errorResponse('维修工单不存在', '404')
        }

        return successResponse({ staffRecords: repository.listRepairStaffRecords(repairId) }, '查询成功')
      },
    },
    {
      url: '/app/dict.queryPayTypes',
      method: ['GET', 'POST'],
      handler: () => successResponse(repository.listPayTypes(), '查询成功'),
    },
    {
      url: '/app/resourceStore.listResources',
      method: ['GET', 'POST'],
      handler: ({ params }) =>
        successResponse(repository.listResources(asOptionalString(params.rstId)), '查询成功'),
    },
  ]
}

/** 默认供 shared registry 直接注册的 repair 端点集合。 */
export const repairEndpointDefinitions = createRepairEndpointDefinitions()

/** 仅将不与 legacy 兼容层冲突的 repair 端点放到 Nitro 显式优先层。 */
export const repairRuntimeEndpointDefinitions = repairEndpointDefinitions.filter(
  definition => !repairLegacyConflictUrls.has(definition.url),
)

/** 统一转换 repair 列表查询参数。 */
function toRepairListParams(params: EndpointDispatchContext['params']) {
  return {
    page: Number(params.page) || 1,
    row: Number(params.row) || 10,
    communityId: String(params.communityId || ''),
    statusCd: asOptionalString(params.statusCd || params.status),
    repairType: asOptionalString(params.repairType),
    keyword: asOptionalString(params.keyword),
    startDate: asOptionalString(params.startDate),
    endDate: asOptionalString(params.endDate),
    assignedWorker: asOptionalString(params.assignedWorker),
  } as any
}

/** 从参数对象中读取必填字符串。 */
function requireString(source: Record<string, any> | undefined, key: string, _message: string): string | undefined {
  const value = source?.[key]
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}

/** 把未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}

/** 校验创建维修工单所需字段。 */
function validateCreateRepairBody(body: Record<string, any>) {
  if (!asOptionalString(body.title)) {
    return errorResponse('维修标题不能为空', '400')
  }

  if (!asOptionalString(body.context)) {
    return errorResponse('维修描述不能为空', '400')
  }

  if (!asOptionalString(body.repairName)) {
    return errorResponse('业主姓名不能为空', '400')
  }

  if (!asOptionalString(body.tel)) {
    return errorResponse('联系电话不能为空', '400')
  }

  if (!asOptionalString(body.address)) {
    return errorResponse('维修地址不能为空', '400')
  }

  return undefined
}
