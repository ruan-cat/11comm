import type { FeeDetailParams, FeeListParams, OweFeeParams } from '../../../src/types/fee.ts'
import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { FeeModuleRepository } from './repository.ts'
import { successResponse } from '../../shared/runtime/response-builder.ts'
import { feeMockRepository } from './repository.ts'

/** 创建 `fee` 模块的共享 endpoint 定义。 */
export function createFeeEndpointDefinitions(
  repository: FeeModuleRepository = feeMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/fee.listFee',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getFeeList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: asOptionalString(params.communityId) || 'COMM_001',
        roomId: asOptionalString(params.roomId),
        roomName: asOptionalString(params.roomName),
        feeType: asOptionalString(params.feeType),
        state: asOptionalString(params.state),
        ownerName: asOptionalString(params.ownerName),
        feeId: asOptionalString(params.feeId),
        payerObjId: asOptionalString(params.payerObjId),
      } satisfies FeeListParams), '查询费用列表成功'),
    },
    {
      url: '/app/fee.queryFeeDetail',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getFeeDetailList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 50,
        communityId: asOptionalString(params.communityId) || 'COMM_001',
        feeId: asOptionalString(params.feeId) || '',
      } satisfies FeeDetailParams), '查询费用详情成功'),
    },
    {
      url: '/app/feeApi/listOweFees',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getOweFees({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: asOptionalString(params.communityId) || 'COMM_001',
        roomId: asOptionalString(params.roomId),
        ownerId: asOptionalString(params.ownerId),
      } satisfies OweFeeParams), '查询欠费成功'),
    },
    {
      url: '/app/fee.saveRoomCreateFee',
      method: 'POST',
      handler: ({ body }) => successResponse(repository.saveRoomCreateFee(body || {}), '创建费用成功'),
    },
    {
      url: '/app/payment.nativeQrcodePayment',
      method: 'POST',
      handler: ({ body }) => successResponse(repository.createNativeQrcodePayment({
        roomId: asOptionalString(body?.roomId) || 'ROOM_001',
        communityId: asOptionalString(body?.communityId) || 'COMM_001',
        business: asOptionalString(body?.business),
        feeIds: asStringArray(body?.feeIds),
      }), '生成二维码成功'),
    },
    {
      url: '/app/oweFeeCallable.listOweFeeCallable',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getOweFeeCallableList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: asOptionalString(params.communityId) || 'COMM_001',
        payerObjId: asOptionalString(params.payerObjId),
      }), '查询欠费催缴成功'),
    },
    {
      url: '/app/oweFeeCallable.writeOweFeeCallable',
      method: 'POST',
      handler: ({ body }) => successResponse(repository.writeOweFeeCallable(body || {}), '登记欠费催缴成功'),
    },
    {
      url: '/app/iot/listChargeMachineBmoImpl',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getChargeMachineList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: asOptionalString(params.communityId) || 'COMM_001',
        machineNameLike: asOptionalString(params.machineNameLike),
        machineId: asOptionalString(params.machineId),
      }), '查询充电桩成功'),
    },
    {
      url: '/app/iot/listChargeMachineOrderBmoImpl',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getChargeMachineOrderList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: asOptionalString(params.communityId) || 'COMM_001',
        machineId: asOptionalString(params.machineId),
      }), '查询充电桩订单成功'),
    },
    {
      url: '/app/iot/listChargeMachinePortBmoImpl',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getChargeMachinePortList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: asOptionalString(params.communityId) || 'COMM_001',
        machineId: asOptionalString(params.machineId) || 'MACHINE_001',
      }), '查询充电桩插座成功'),
    },
    {
      url: '/app/reportFeeMonthStatistics.queryReportFeeSummary',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getFeeSummaryReport({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: asOptionalString(params.communityId) || 'COMM_001',
        feeTypeCd: asOptionalString(params.feeTypeCd),
        floorId: asOptionalString(params.floorId),
      }), '查询费用汇总成功'),
    },
    {
      url: '/app/reportFeeMonthStatistics/queryPayFeeDetail',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getPayFeeDetailReport({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: asOptionalString(params.communityId) || 'COMM_001',
        feeTypeCd: asOptionalString(params.feeTypeCd),
        floorId: asOptionalString(params.floorId),
        roomId: asOptionalString(params.roomId),
      }), '查询缴费明细成功'),
    },
    {
      url: '/app/reportFeeMonthStatistics.queryReportFeeDetailRoom',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getRoomFeeReport({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: asOptionalString(params.communityId) || 'COMM_001',
        feeTypeCd: asOptionalString(params.feeTypeCd),
        floorId: asOptionalString(params.floorId),
        roomId: asOptionalString(params.roomId),
      }), '查询房间费用成功'),
    },
    {
      url: '/app/dataReport.queryFeeDataReport',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getDataReport({
        communityId: asOptionalString(params.communityId) || 'COMM_001',
        reportCode: asOptionalString(params.reportCode) || 'FEE_REPORT',
      }), '查询数据报表成功'),
    },
    {
      url: '/app/machine/listMachineRecords',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getOpenDoorLogList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: asOptionalString(params.communityId) || 'COMM_001',
      }), '查询开门记录成功'),
    },
    {
      url: '/app/feeConfig.listFeeConfigs',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getFeeConfigList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 500,
        communityId: asOptionalString(params.communityId) || 'COMM_001',
        feeTypeCd: asOptionalString(params.feeTypeCd),
        isDefault: asOptionalString(params.isDefault),
        valid: params.valid === undefined ? undefined : Number(params.valid),
      }), '查询费用配置成功'),
    },
  ]
}

/** 默认供 shared registry 直接注册的 fee 端点集合。 */
export const feeEndpointDefinitions = createFeeEndpointDefinitions()

/**
 * fee 的详情旧 URL 与 property-application 共用，继续交给 legacy compatibility 合并处理。
 * 其他 fee URL 没有冲突，可以直接进入 Nitro 优先层。
 */
export const feeRuntimeEndpointDefinitions: EndpointDefinition[] = feeEndpointDefinitions.filter(
  definition => definition.url !== '/app/fee.queryFeeDetail',
)

/** 把未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}

/** 把未知值收敛为字符串数组。 */
function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(item => `${item}`).filter(Boolean)
  }

  if (typeof value === 'string') {
    return value.split(',').map(item => item.trim()).filter(Boolean)
  }

  return []
}
