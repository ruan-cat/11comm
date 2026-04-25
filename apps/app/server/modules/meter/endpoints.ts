import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { MeterModuleRepository } from './repository.ts'
import { successResponse } from '../../shared/runtime/response-builder.ts'
import { meterMockRepository } from './repository.ts'

/** 创建 `meter` 模块的共享 endpoint 定义。 */
export function createMeterEndpointDefinitions(
  repository: MeterModuleRepository = meterMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/meter.listMeterWaters',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getMeterReadings({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        roomNum: asOptionalString(params.roomNum),
      }), '查询成功'),
    },
    {
      url: '/app/meter.queryFeeTypes',
      method: ['GET', 'POST'],
      handler: () => successResponse(repository.getFeeTypes(), '查询成功'),
    },
    {
      url: '/app/meter.queryFeeTypesItems',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(
        repository.getFeeConfigItems(asOptionalString(params.feeTypeCd) || ''),
        '查询成功',
      ),
    },
    {
      url: '/app/meter.listMeterType',
      method: ['GET', 'POST'],
      handler: () => successResponse(repository.getMeterTypes(), '查询成功'),
    },
    {
      url: '/app/meter.queryPreMeterWater',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getPreMeterWater({
        objId: asOptionalString(params.objId) || '',
        meterType: asOptionalString(params.meterType) || '',
      }), '查询成功'),
    },
    {
      url: '/app/meter.saveMeterWater',
      method: 'POST',
      handler: ({ body }) => successResponse({
        success: repository.saveMeterWater(body || {}),
      }, '提交成功'),
    },
    {
      url: '/app/meter.listFloorShareReading',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getFloorShareReadings({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
      }), '查询成功'),
    },
    {
      url: '/app/meter.listFloorShareMeter',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getFloorShareMeters({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        fsmId: asOptionalString(params.fsmId),
      }), '查询成功'),
    },
    {
      url: '/app/meter.saveFloorShareReading',
      method: 'POST',
      handler: ({ body }) => successResponse({
        success: repository.saveFloorShareReading(body || {}),
      }, '提交成功'),
    },
    {
      url: '/app/meter.auditFloorShareReading',
      method: 'POST',
      handler: ({ body }) => successResponse({
        success: repository.auditFloorShareReading({
          readingId: asOptionalString(body?.readingId) || '',
          state: asOptionalString(body?.state),
          auditRemark: asOptionalString(body?.auditRemark),
        }),
      }, '审核成功'),
    },
  ]
}

/** 默认供 shared registry 直接注册的 meter 端点集合。 */
export const meterEndpointDefinitions = createMeterEndpointDefinitions()

/** meter 当前没有 legacy URL 冲突，可直接进入 Nitro 优先层。 */
export const meterRuntimeEndpointDefinitions = meterEndpointDefinitions

/** 把未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}
