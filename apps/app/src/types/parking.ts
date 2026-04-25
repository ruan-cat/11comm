/**
 * 车辆管理模块类型定义
 */

/** 业主车辆 */
export interface OwnerCar {
  carId: string
  carNum: string
  ownerName: string
  link: string
  roomName?: string
  areaNum?: string
  num?: string
  state: string
  stateName: string
  leaseType: string
  leaseTypeName: string
  startTime?: string
  endTime?: string
}

/** 业主车辆查询参数 */
export interface OwnerCarQueryParams {
  page: number
  row: number
  communityId: string
  carNumLike?: string
  ownerName?: string
  memberCarNumLike?: string
  num?: string
  link?: string
  carTypeCds?: string
}

/** 停车场 */
export interface ParkingArea {
  paId: string
  num: string
  name: string
}

/** 道闸设备 */
export interface BarrierMachine {
  machineId: string
  machineCode: string
  machineName: string
  boxId: string
  direction: '3306' | '3307'
  status: string
  videoUrl: string
}

/** 出入场记录 */
export interface CarInoutDetail {
  inoutId: string
  carNum: string
  stateName: string
  paNum: string
  carTypeName: string
  inTime: string
  openTime?: string
  payCharge: number
  hours: number
  min: number
  remark: string
  photoJpg?: string
}

/** 收费记录 */
export interface CarInoutPayment {
  inoutId: string
  carNum: string
  stateName: string
  inTime: string
  createTime: string
  payTypeName: string
  payCharge: number
  realCharge: number
}

/** 在场临时车费用 */
export interface TempCarInArea {
  inoutId: string
  paId: string
  carNum: string
  payCharge: number
  hours: number
  min: number
}

/** 停车优惠券 */
export interface ParkingCoupon {
  pccId: string
  couponName: string
  typeCd: '1001' | '2002' | '3003' | '4004'
  value: number
  state: '1001' | '2000'
}

/** 手工进出场参数 */
export interface CustomCarInOutPayload {
  machineId: string
  machineCode: string
  communityId: string
  paId: string
  paNum: string
  boxId: string
  carNum: string
  remark?: string
  type: '1101' | '1102'
  payCharge?: number
  amount?: number
  payType?: string
  inoutId?: string
  pccIds?: string[]
}
