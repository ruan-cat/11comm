/**
 * 车辆管理 API
 */

import type { PaginationResponse } from '@/types/api'
import type {
  BarrierMachine,
  CarInoutDetail,
  CarInoutPayment,
  CustomCarInOutPayload,
  OwnerCar,
  OwnerCarQueryParams,
  ParkingArea,
  ParkingCoupon,
  TempCarInArea,
} from '@/types/parking'
import { http } from '@/http/alova'

/** 查询业主车辆 */
export function queryOwnerCars(params: OwnerCarQueryParams) {
  return http.Get<PaginationResponse<OwnerCar>>('/app/owner.queryOwnerCars', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 查询停车场 */
export function listParkingAreas(params: { page: number, row: number, communityId: string }) {
  return http.Get<ParkingArea[]>('/app/parkingArea.listParkingAreas', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 查询停车场设备 */
export function listParkingAreaMachines(params: { page: number, row: number, communityId: string, paNum: string }) {
  return http.Get<BarrierMachine[]>('/app/machine.listParkingAreaMachines', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 开闸 */
export function openDoor(data: { communityId: string, machineCode: string }) {
  return http.Post<{ success: boolean }>('/app/machine/openDoor', data, {
    meta: { ignoreAuth: true },
  })
}

/** 关闸 */
export function closeDoor(data: { communityId: string, machineCode: string }) {
  return http.Post<{ success: boolean }>('/app/machine/closeDoor', data, {
    meta: { ignoreAuth: true },
  })
}

/** 手工进出场 */
export function customCarInOut(data: CustomCarInOutPayload) {
  return http.Post<{ success: boolean }>('/app/machine.customCarInOutCmd', data, {
    meta: { ignoreAuth: true },
  })
}

/** 查询在场车辆 */
export function listCarInParkingArea(params: {
  page: number
  row: number
  communityId: string
  paId: string
  paNum: string
  carNum: string
}) {
  return http.Get<TempCarInArea[]>('/app/carInout.listCarInParkingAreaCmd', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 查询可用优惠券 */
export function listParkingCouponCar(params: {
  paId: string
  page: number
  row: number
  state: string
  carNum: string
  communityId: string
}) {
  return http.Get<ParkingCoupon[]>('/app/parkingCoupon.listParkingCouponCar', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 计算优惠后费用 */
export function getTempCarFeeOrder(params: {
  paId: string
  pccIds: string
  carNum: string
  communityId: string
}) {
  return http.Get<{ amount: number }>('/app/tempCarFee.getTempCarFeeOrder', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 查询出入场明细 */
export function listCarInoutDetail(params: { page: number, row: number, communityId: string, paNum: string }) {
  return http.Get<PaginationResponse<CarInoutDetail>>('/app/carInoutDetail.listCarInoutDetail', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 查询收费明细 */
export function listCarInoutPayment(params: { page: number, row: number, communityId: string, paNum: string }) {
  return http.Get<PaginationResponse<CarInoutPayment>>('/app/carInoutPayment.listCarInoutPayment', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 获取道闸视频地址 */
export function getBarrierCloudVideo(params: { machineId: string, communityId: string }) {
  return http.Get<{ url: string }>('/app/machine.getBarrierCloudVideo', {
    params,
    meta: { ignoreAuth: true },
  })
}
