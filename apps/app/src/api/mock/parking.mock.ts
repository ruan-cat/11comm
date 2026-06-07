/**
 * 车辆管理 Mock 接口。
 *
 * 这里维护 app 本地 mock 数据和处理器，用于断开对旧内置 Nitro server 的依赖。
 */

import type {
  BarrierMachine,
  CarInoutDetail,
  CarInoutPayment,
  OwnerCar,
  ParkingArea,
  ParkingCoupon,
  TempCarInArea,
} from '../../types/parking'
import { createPaginationResponse, defineUniAppMock, errorResponse, formatDateTime, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

interface ParkingMachine extends BarrierMachine {
  paNum: string
}

const parkingAreas: ParkingArea[] = [
  { paId: 'PA_001', num: 'P1', name: '一期地下停车场' },
  { paId: 'PA_002', num: 'P2', name: '二期地面停车场' },
]

const parkingMachines: ParkingMachine[] = [
  {
    machineId: 'M_001',
    machineCode: 'MC_001',
    machineName: 'P1 入口道闸',
    boxId: 'BOX_001',
    direction: '3306',
    status: 'online',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    paNum: 'P1',
  },
  {
    machineId: 'M_002',
    machineCode: 'MC_002',
    machineName: 'P1 出口道闸',
    boxId: 'BOX_002',
    direction: '3307',
    status: 'online',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
    paNum: 'P1',
  },
  {
    machineId: 'M_003',
    machineCode: 'MC_003',
    machineName: 'P2 入口道闸',
    boxId: 'BOX_003',
    direction: '3306',
    status: 'online',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    paNum: 'P2',
  },
  {
    machineId: 'M_004',
    machineCode: 'MC_004',
    machineName: 'P2 出口道闸',
    boxId: 'BOX_004',
    direction: '3307',
    status: 'online',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
    paNum: 'P2',
  },
]

const ownerCars: OwnerCar[] = [
  {
    carId: 'CAR_0001',
    carNum: '粤B12345',
    ownerName: '张三',
    link: '13800000001',
    roomName: '1栋101室',
    areaNum: 'P1',
    num: 'P-001',
    state: '1001',
    stateName: '正常',
    leaseType: 'H',
    leaseTypeName: '月租车',
    startTime: formatDateTime('2026-01-01 00:00:00'),
    endTime: formatDateTime('2026-12-31 23:59:59'),
  },
  {
    carId: 'CAR_0002',
    carNum: '粤B23456',
    ownerName: '李四',
    link: '13800000002',
    roomName: '2栋202室',
    areaNum: 'P1',
    num: 'P-002',
    state: '1001',
    stateName: '正常',
    leaseType: 'H',
    leaseTypeName: '月租车',
    startTime: formatDateTime('2026-02-01 00:00:00'),
    endTime: formatDateTime('2026-12-31 23:59:59'),
  },
  {
    carId: 'CAR_0003',
    carNum: '粤B34567',
    ownerName: '王五',
    link: '13800000003',
    roomName: '3栋303室',
    areaNum: 'P2',
    num: 'P-003',
    state: '2000',
    stateName: '已释放',
    leaseType: 'T',
    leaseTypeName: '临时车',
    startTime: formatDateTime('2026-03-01 00:00:00'),
    endTime: formatDateTime('2026-06-30 23:59:59'),
  },
]

const carInoutDetails: CarInoutDetail[] = [
  {
    inoutId: 'IO_0001',
    carNum: '粤B12345',
    stateName: '在场',
    paNum: 'P1',
    carTypeName: '月租车',
    inTime: formatDateTime('2026-06-06 08:30:00'),
    openTime: '',
    payCharge: 0,
    hours: 2,
    min: 10,
    remark: '系统记录',
    photoJpg: 'https://picsum.photos/seed/car-1/240/180',
  },
  {
    inoutId: 'IO_0002',
    carNum: '粤B88888',
    stateName: '已离场',
    paNum: 'P1',
    carTypeName: '临时车',
    inTime: formatDateTime('2026-06-05 14:00:00'),
    openTime: formatDateTime('2026-06-05 16:45:00'),
    payCharge: 18,
    hours: 2,
    min: 45,
    remark: '系统记录',
    photoJpg: 'https://picsum.photos/seed/car-2/240/180',
  },
  {
    inoutId: 'IO_0003',
    carNum: '粤B34567',
    stateName: '在场',
    paNum: 'P2',
    carTypeName: '临时车',
    inTime: formatDateTime('2026-06-06 09:15:00'),
    openTime: '',
    payCharge: 12,
    hours: 1,
    min: 30,
    remark: '系统记录',
    photoJpg: 'https://picsum.photos/seed/car-3/240/180',
  },
]

const carInoutPayments: CarInoutPayment[] = [
  {
    inoutId: 'IO_0002',
    carNum: '粤B88888',
    stateName: '已支付',
    inTime: formatDateTime('2026-06-05 14:00:00'),
    createTime: formatDateTime('2026-06-05 16:45:00'),
    payTypeName: '扫码支付',
    payCharge: 18,
    realCharge: 18,
  },
  {
    inoutId: 'IO_0004',
    carNum: '粤B66666',
    stateName: '已支付',
    inTime: formatDateTime('2026-06-04 09:20:00'),
    createTime: formatDateTime('2026-06-04 11:10:00'),
    payTypeName: '现金',
    payCharge: 10,
    realCharge: 10,
  },
]

const tempCars: TempCarInArea[] = carInoutDetails.map(item => ({
  inoutId: item.inoutId,
  paId: item.paNum === 'P1' ? 'PA_001' : 'PA_002',
  carNum: item.carNum,
  payCharge: item.payCharge,
  hours: item.hours,
  min: item.min,
}))

const parkingCoupons: ParkingCoupon[] = [
  { pccId: 'PCC_001', couponName: '停车优惠券A', typeCd: '2002', value: 5, state: '1001' },
  { pccId: 'PCC_002', couponName: '停车优惠券B', typeCd: '1001', value: 30, state: '1001' },
  { pccId: 'PCC_003', couponName: '停车优惠券C', typeCd: '3003', value: 8, state: '1001' },
]

export default defineUniAppMock([
  {
    url: '/app/owner.queryOwnerCars',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const page = asPositiveNumber(params.page, 1)
      const row = asPositiveNumber(params.row, 10)
      const carNumLike = asOptionalString(params.carNumLike)
      const ownerName = asOptionalString(params.ownerName)
      const memberCarNumLike = asOptionalString(params.memberCarNumLike)
      const num = asOptionalString(params.num)
      const link = asOptionalString(params.link)
      const list = ownerCars.filter((item) => {
        const matchCarNum = !carNumLike || item.carNum.includes(carNumLike)
        const matchOwner = !ownerName || item.ownerName.includes(ownerName)
        const matchMemberCarNum = !memberCarNumLike || item.carNum.includes(memberCarNumLike)
        const matchNum = !num || item.num?.includes(num)
        const matchLink = !link || item.link.includes(link)

        return matchCarNum && matchOwner && matchMemberCarNum && matchNum && matchLink
      })

      return successResponse(createPaginationResponse(list, page, row), '查询成功')
    },
  },
  {
    url: '/app/parkingArea.listParkingAreas',
    method: ['GET', 'POST'],
    body: () => successResponse(cloneValue(parkingAreas), '查询成功'),
  },
  {
    url: '/app/machine.listParkingAreaMachines',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const paNum = asOptionalString(params.paNum)
      const list = parkingMachines
        .filter(machine => !paNum || machine.paNum === paNum)
        .map(({ paNum: _paNum, ...machine }) => machine)

      return successResponse(list, '查询成功')
    },
  },
  {
    url: '/app/machine/openDoor',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      if (!asOptionalString(params.machineCode)) {
        return errorResponse('machineCode 不能为空', '400')
      }

      return successResponse({ success: true }, '开闸成功')
    },
  },
  {
    url: '/app/machine/closeDoor',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      if (!asOptionalString(params.machineCode)) {
        return errorResponse('machineCode 不能为空', '400')
      }

      return successResponse({ success: true }, '关闸成功')
    },
  },
  {
    url: '/app/machine.customCarInOutCmd',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const type = asOptionalString(params.type)
      if (!asOptionalString(params.carNum) || !type) {
        return errorResponse('参数不完整', '400')
      }

      return successResponse({ success: true }, type === '1101' ? '车辆进场成功' : '车辆出场成功')
    },
  },
  {
    url: '/app/carInout.listCarInParkingAreaCmd',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const carNum = asOptionalString(params.carNum)
      const paId = asOptionalString(params.paId)
      const list = tempCars.filter((item) => {
        const matchCarNum = !carNum || item.carNum.includes(carNum)
        const matchParkingArea = !paId || item.paId === paId

        return matchCarNum && matchParkingArea
      })

      return successResponse(cloneValue(list), '查询成功')
    },
  },
  {
    url: '/app/parkingCoupon.listParkingCouponCar',
    method: ['GET', 'POST'],
    body: () => successResponse(cloneValue(parkingCoupons), '查询成功'),
  },
  {
    url: '/app/tempCarFee.getTempCarFeeOrder',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const couponCount = asOptionalString(params.pccIds)?.split(',').filter(Boolean).length || 0
      const amount = Number(Math.max(0, 20 - couponCount * 3).toFixed(2))

      return successResponse({ amount }, '计算成功')
    },
  },
  {
    url: '/app/carInoutDetail.listCarInoutDetail',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const page = asPositiveNumber(params.page, 1)
      const row = asPositiveNumber(params.row, 10)
      const paNum = asOptionalString(params.paNum)
      const list = carInoutDetails.filter(item => !paNum || item.paNum === paNum)

      return successResponse(createPaginationResponse(list, page, row), '查询成功')
    },
  },
  {
    url: '/app/carInoutPayment.listCarInoutPayment',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const page = asPositiveNumber(params.page, 1)
      const row = asPositiveNumber(params.row, 10)

      return successResponse(createPaginationResponse(carInoutPayments, page, row), '查询成功')
    },
  },
  {
    url: '/app/machine.getBarrierCloudVideo',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const machineId = asOptionalString(params.machineId)
      const machine = machineId ? parkingMachines.find(item => item.machineId === machineId) : undefined
      if (!machine) {
        return errorResponse('设备不存在', '404')
      }

      return successResponse({ url: machine.videoUrl }, '查询成功')
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

/** 克隆返回值，避免调用方篡改本地 fixture。 */
function cloneValue<T>(value: T): T {
  return structuredClone(value)
}
