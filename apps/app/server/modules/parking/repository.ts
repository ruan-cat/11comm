import type {
  BarrierMachine,
  CarInoutDetail,
  CarInoutPayment,
  OwnerCar,
  ParkingArea,
  ParkingCoupon,
  TempCarInArea,
} from '../../../src/types/parking.ts'
import {
  createPaginationResponse,
  formatDateTime,
  generateChineseName,
  generatePhoneNumber,
} from '../../shared/runtime/common-utils.ts'

interface ParkingMachine extends BarrierMachine {
  paNum: string
}

export interface ParkingModuleRepository {
  getBarrierVideo: (machineId: string) => { url: string } | undefined
  getMachines: (paNum?: string) => BarrierMachine[]
  getOwnerCars: (params: {
    carNumLike?: string
    link?: string
    memberCarNumLike?: string
    num?: string
    ownerName?: string
    page: number
    row: number
  }) => ReturnType<typeof createPaginationResponse<OwnerCar>>
  getParkingAreas: () => ParkingArea[]
  getPayments: (params: { paNum?: string, page: number, row: number }) => ReturnType<typeof createPaginationResponse<CarInoutPayment>>
  getTempCarFeeOrder: (params: { pccIds?: string }) => { amount: number }
  getTempCars: (params: { carNum?: string, paId?: string }) => TempCarInArea[]
  getVehicleInoutDetails: (params: { paNum?: string, page: number, row: number }) => ReturnType<typeof createPaginationResponse<CarInoutDetail>>
  listCoupons: () => ParkingCoupon[]
}

/** 创建 `parking` 模块的 mock 内存仓储。 */
export function createParkingMockRepository(): ParkingModuleRepository {
  return new ParkingDatabase()
}

/** parking 模块的 mock 内存仓储实现。 */
class ParkingDatabase implements ParkingModuleRepository {
  private readonly coupons: ParkingCoupon[] = []
  private readonly inouts: CarInoutDetail[] = []
  private readonly machines: ParkingMachine[] = []
  private readonly ownerCars: OwnerCar[] = []
  private readonly parkingAreas: ParkingArea[] = []
  private readonly payments: CarInoutPayment[] = []
  private readonly tempInArea: TempCarInArea[] = []

  constructor() {
    this.initData()
  }

  getOwnerCars(params: {
    carNumLike?: string
    link?: string
    memberCarNumLike?: string
    num?: string
    ownerName?: string
    page: number
    row: number
  }) {
    let list = [...this.ownerCars]

    if (params.carNumLike) {
      list = list.filter(item => item.carNum.includes(params.carNumLike))
    }

    if (params.ownerName) {
      list = list.filter(item => item.ownerName.includes(params.ownerName))
    }

    if (params.memberCarNumLike) {
      list = list.filter(item => item.carNum.includes(params.memberCarNumLike))
    }

    if (params.num) {
      list = list.filter(item => item.num?.includes(params.num))
    }

    if (params.link) {
      list = list.filter(item => item.link.includes(params.link))
    }

    return cloneValue(createPaginationResponse(list, params.page, params.row))
  }

  getParkingAreas(): ParkingArea[] {
    return cloneValue(this.parkingAreas)
  }

  getMachines(paNum?: string): BarrierMachine[] {
    let list = [...this.machines]
    if (paNum) {
      list = list.filter(item => item.paNum === paNum)
    }

    return cloneValue(list.map(({ paNum: _paNum, ...machine }) => machine))
  }

  getTempCars(params: { carNum?: string, paId?: string }): TempCarInArea[] {
    let list = [...this.tempInArea]
    if (params.carNum) {
      list = list.filter(item => item.carNum.includes(params.carNum))
    }
    if (params.paId) {
      list = list.filter(item => item.paId === params.paId)
    }

    return cloneValue(list)
  }

  listCoupons(): ParkingCoupon[] {
    return cloneValue(this.coupons)
  }

  getTempCarFeeOrder(params: { pccIds?: string }): { amount: number } {
    const couponCount = params.pccIds
      ? params.pccIds.split(',').filter(Boolean).length
      : 0

    return {
      amount: Number(Math.max(0, 20 - couponCount * 3).toFixed(2)),
    }
  }

  getVehicleInoutDetails(params: { paNum?: string, page: number, row: number }) {
    let list = [...this.inouts]
    if (params.paNum) {
      list = list.filter(item => item.paNum === params.paNum)
    }

    return cloneValue(createPaginationResponse(list, params.page, params.row))
  }

  getPayments(params: { paNum?: string, page: number, row: number }) {
    const list = [...this.payments]
    if (params.paNum) {
      return cloneValue(createPaginationResponse(list, params.page, params.row))
    }

    return cloneValue(createPaginationResponse(list, params.page, params.row))
  }

  getBarrierVideo(machineId: string): { url: string } | undefined {
    const machine = this.machines.find(item => item.machineId === machineId)
    if (!machine) {
      return undefined
    }

    return { url: machine.videoUrl }
  }

  /** 初始化停车业务种子数据。 */
  private initData() {
    this.parkingAreas.push(
      { paId: 'PA_001', num: 'P1', name: '一期地下停车场' },
      { paId: 'PA_002', num: 'P2', name: '二期地面停车场' },
    )

    this.machines.push(
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
    )

    for (let index = 1; index <= 40; index += 1) {
      const plate = `粤B${Math.floor(10000 + Math.random() * 89999)}`
      const owner = generateChineseName()
      const pa = this.parkingAreas[index % this.parkingAreas.length]

      this.ownerCars.push({
        carId: `CAR_${String(index).padStart(4, '0')}`,
        carNum: plate,
        ownerName: owner,
        link: generatePhoneNumber(),
        roomName: `${Math.floor(index / 3) + 1}栋${(index % 6) + 1}${String((index % 20) + 1).padStart(2, '0')}室`,
        areaNum: pa.num,
        num: `P-${String(index).padStart(3, '0')}`,
        state: index % 7 === 0 ? '2000' : '1001',
        stateName: index % 7 === 0 ? '已释放' : '正常',
        leaseType: index % 4 === 0 ? 'T' : 'H',
        leaseTypeName: index % 4 === 0 ? '临时车' : '月租车',
        startTime: formatDateTime(Date.now() - index * 86400000),
        endTime: formatDateTime(Date.now() + index * 86400000),
      })

      this.inouts.push({
        inoutId: `IO_${String(index).padStart(4, '0')}`,
        carNum: plate,
        stateName: index % 2 === 0 ? '在场' : '已离场',
        paNum: pa.num,
        carTypeName: index % 4 === 0 ? '临时车' : '月租车',
        inTime: formatDateTime(Date.now() - index * 3600000),
        openTime: index % 2 === 0 ? '' : formatDateTime(Date.now() - index * 2400000),
        payCharge: Number((Math.random() * 30 + 5).toFixed(2)),
        hours: Math.floor(Math.random() * 5) + 1,
        min: Math.floor(Math.random() * 60),
        remark: '系统记录',
        photoJpg: `https://picsum.photos/seed/car-${index}/240/180`,
      })

      this.payments.push({
        inoutId: `IO_${String(index).padStart(4, '0')}`,
        carNum: plate,
        stateName: '已支付',
        inTime: formatDateTime(Date.now() - index * 3600000),
        createTime: formatDateTime(Date.now() - index * 1800000),
        payTypeName: index % 3 === 0 ? '现金' : '扫码支付',
        payCharge: Number((Math.random() * 30 + 5).toFixed(2)),
        realCharge: Number((Math.random() * 28 + 3).toFixed(2)),
      })
    }

    this.tempInArea.push(...this.inouts.slice(0, 12).map(item => ({
      inoutId: item.inoutId,
      paId: item.paNum === 'P1' ? 'PA_001' : 'PA_002',
      carNum: item.carNum,
      payCharge: item.payCharge,
      hours: item.hours,
      min: item.min,
    })))

    this.coupons.push(
      { pccId: 'PCC_001', couponName: '停车优惠券A', typeCd: '2002', value: 5, state: '1001' },
      { pccId: 'PCC_002', couponName: '停车优惠券B', typeCd: '1001', value: 30, state: '1001' },
      { pccId: 'PCC_003', couponName: '停车优惠券C', typeCd: '3003', value: 8, state: '1001' },
    )
  }
}

/** 默认供运行时直接复用的 parking 仓储实例。 */
export const parkingMockRepository = createParkingMockRepository()

/** 克隆仓储返回值，避免外部篡改内部引用。 */
function cloneValue<T>(value: T): T {
  return structuredClone(value)
}
