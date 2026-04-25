import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { ParkingModuleRepository } from './repository.ts'
import { errorResponse, successResponse } from '../../shared/runtime/response-builder.ts'
import { parkingMockRepository } from './repository.ts'

/** 创建 `parking` 模块的共享 endpoint 定义。 */
export function createParkingEndpointDefinitions(
  repository: ParkingModuleRepository = parkingMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/owner.queryOwnerCars',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getOwnerCars({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        carNumLike: asOptionalString(params.carNumLike),
        ownerName: asOptionalString(params.ownerName),
        memberCarNumLike: asOptionalString(params.memberCarNumLike),
        num: asOptionalString(params.num),
        link: asOptionalString(params.link),
      }), '查询成功'),
    },
    {
      url: '/app/parkingArea.listParkingAreas',
      method: ['GET', 'POST'],
      handler: () => successResponse(repository.getParkingAreas(), '查询成功'),
    },
    {
      url: '/app/machine.listParkingAreaMachines',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(
        repository.getMachines(asOptionalString(params.paNum)),
        '查询成功',
      ),
    },
    {
      url: '/app/machine/openDoor',
      method: 'POST',
      handler: ({ body }) => {
        if (!asOptionalString(body?.machineCode)) {
          return errorResponse('machineCode 不能为空', '400')
        }

        return successResponse({ success: true }, '开闸成功')
      },
    },
    {
      url: '/app/machine/closeDoor',
      method: 'POST',
      handler: ({ body }) => {
        if (!asOptionalString(body?.machineCode)) {
          return errorResponse('machineCode 不能为空', '400')
        }

        return successResponse({ success: true }, '关闸成功')
      },
    },
    {
      url: '/app/machine.customCarInOutCmd',
      method: 'POST',
      handler: ({ body }) => {
        if (!asOptionalString(body?.carNum) || !asOptionalString(body?.type)) {
          return errorResponse('参数不完整', '400')
        }

        return successResponse(
          { success: true },
          asOptionalString(body?.type) === '1101' ? '车辆进场成功' : '车辆出场成功',
        )
      },
    },
    {
      url: '/app/carInout.listCarInParkingAreaCmd',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getTempCars({
        carNum: asOptionalString(params.carNum),
        paId: asOptionalString(params.paId),
      }), '查询成功'),
    },
    {
      url: '/app/parkingCoupon.listParkingCouponCar',
      method: ['GET', 'POST'],
      handler: () => successResponse(repository.listCoupons(), '查询成功'),
    },
    {
      url: '/app/tempCarFee.getTempCarFeeOrder',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getTempCarFeeOrder({
        pccIds: asOptionalString(params.pccIds),
      }), '计算成功'),
    },
    {
      url: '/app/carInoutDetail.listCarInoutDetail',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getVehicleInoutDetails({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        paNum: asOptionalString(params.paNum),
      }), '查询成功'),
    },
    {
      url: '/app/carInoutPayment.listCarInoutPayment',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getPayments({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        paNum: asOptionalString(params.paNum),
      }), '查询成功'),
    },
    {
      url: '/app/machine.getBarrierCloudVideo',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const machineId = asOptionalString(params.machineId)
        const video = machineId ? repository.getBarrierVideo(machineId) : undefined
        if (!video) {
          return errorResponse('设备不存在', '404')
        }

        return successResponse(video, '查询成功')
      },
    },
  ]
}

/** 默认供 shared registry 直接注册的 parking 端点集合。 */
export const parkingEndpointDefinitions = createParkingEndpointDefinitions()

/** parking 当前没有 legacy URL 冲突，可直接进入 Nitro 优先层。 */
export const parkingRuntimeEndpointDefinitions = parkingEndpointDefinitions

/** 把未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}
