import type {
  FeeConfigItem,
  FeeTypeItem,
  FloorShareMeter,
  FloorShareReading,
  MeterReading,
  MeterTypeItem,
} from '../../../src/types/meter.ts'
import {
  createPaginationResponse,
  formatDateTime,
  generateId,
} from '../../shared/runtime/common-utils.ts'

export interface MeterModuleRepository {
  auditFloorShareReading: (data: { auditRemark?: string, readingId: string, state?: string }) => boolean
  getFeeConfigItems: (feeTypeCd: string) => FeeConfigItem[]
  getFeeTypes: () => FeeTypeItem[]
  getFloorShareMeters: (params: { fsmId?: string, page: number, row: number }) => ReturnType<typeof createPaginationResponse<FloorShareMeter>>
  getFloorShareReadings: (params: { page: number, row: number }) => ReturnType<typeof createPaginationResponse<FloorShareReading>>
  getMeterReadings: (params: { page: number, roomNum?: string, row: number }) => ReturnType<typeof createPaginationResponse<MeterReading>>
  getMeterTypes: () => MeterTypeItem[]
  getPreMeterWater: (params: { meterType: string, objId: string }) => { curDegrees: number, curReadingTime: string }
  saveFloorShareReading: (data: {
    curDegrees?: number
    curReadingTime?: string
    fsmId?: string
    preDegrees?: number
    preReadingTime?: string
  }) => boolean
  saveMeterWater: (data: {
    curDegrees?: number
    curReadingTime?: string
    meterType?: string
    objId?: string
    objName?: string
    preDegrees?: number
    preReadingTime?: string
    remark?: string
  }) => boolean
}

/** 创建 `meter` 模块的 mock 内存仓储。 */
export function createMeterMockRepository(): MeterModuleRepository {
  return new MeterDatabase()
}

const feeTypes: FeeTypeItem[] = [
  { id: '888800010015', name: '水费' },
  { id: '888800010016', name: '电费' },
  { id: '888800010009', name: '燃气费' },
]

const feeConfigsMap: Record<string, FeeConfigItem[]> = {
  888800010015: [
    { configId: 'CFG_WATER_001', feeName: '居民生活用水' },
    { configId: 'CFG_WATER_002', feeName: '商业用水' },
  ],
  888800010016: [
    { configId: 'CFG_POWER_001', feeName: '居民生活用电' },
    { configId: 'CFG_POWER_002', feeName: '公共照明用电' },
  ],
  888800010009: [
    { configId: 'CFG_GAS_001', feeName: '居民燃气' },
  ],
}

const meterTypes: MeterTypeItem[] = [
  { typeId: '1010', typeName: '电表' },
  { typeId: '2020', typeName: '水表' },
  { typeId: '3030', typeName: '燃气表' },
]

/** meter 模块的 mock 内存仓储实现。 */
class MeterDatabase implements MeterModuleRepository {
  private readonly floorShareMeters: FloorShareMeter[] = []
  private readonly floorShareReadings: FloorShareReading[] = []
  private readonly meterReadings: MeterReading[] = []

  constructor() {
    this.initData()
  }

  getMeterReadings(params: { page: number, roomNum?: string, row: number }) {
    let list = [...this.meterReadings]
    if (params.roomNum) {
      const roomNum = params.roomNum.trim()
      list = list.filter(item => item.objName.includes(roomNum))
    }

    return cloneValue(createPaginationResponse(list, params.page, params.row))
  }

  getFeeTypes(): FeeTypeItem[] {
    return cloneValue(feeTypes)
  }

  getFeeConfigItems(feeTypeCd: string): FeeConfigItem[] {
    return cloneValue(feeConfigsMap[feeTypeCd] || [])
  }

  getMeterTypes(): MeterTypeItem[] {
    return cloneValue(meterTypes)
  }

  getPreMeterWater(params: { meterType: string, objId: string }) {
    const found = this.meterReadings.find(item =>
      item.objId === params.objId && item.meterType === params.meterType)

    return cloneValue({
      curDegrees: found?.curDegrees || 0,
      curReadingTime: found?.curReadingTime || formatDateTime(),
    })
  }

  saveMeterWater(data: {
    curDegrees?: number
    curReadingTime?: string
    meterType?: string
    objId?: string
    objName?: string
    preDegrees?: number
    preReadingTime?: string
    remark?: string
  }): boolean {
    this.meterReadings.unshift({
      readingId: generateId('MR'),
      objId: `${data.objId || ''}`,
      objName: `${data.objName || ''}`,
      meterType: `${data.meterType || '2020'}`,
      meterTypeName: meterTypes.find(item => item.typeId === `${data.meterType || '2020'}`)?.typeName || '水表',
      preDegrees: Number(data.preDegrees || 0),
      curDegrees: Number(data.curDegrees || 0),
      preReadingTime: `${data.preReadingTime || formatDateTime()}`,
      curReadingTime: `${data.curReadingTime || formatDateTime()}`,
      remark: `${data.remark || ''}`,
    })

    return true
  }

  getFloorShareReadings(params: { page: number, row: number }) {
    return cloneValue(createPaginationResponse(this.floorShareReadings, params.page, params.row))
  }

  getFloorShareMeters(params: { fsmId?: string, page: number, row: number }) {
    let list = [...this.floorShareMeters]
    if (params.fsmId) {
      list = list.filter(item => item.fsmId === params.fsmId)
    }

    return cloneValue(createPaginationResponse(list, params.page, params.row))
  }

  saveFloorShareReading(data: {
    curDegrees?: number
    curReadingTime?: string
    fsmId?: string
    preDegrees?: number
    preReadingTime?: string
  }): boolean {
    const meter = this.floorShareMeters.find(item => item.fsmId === `${data.fsmId || ''}`)
    this.floorShareReadings.unshift({
      readingId: generateId('FSR'),
      fsmId: `${data.fsmId || ''}`,
      floorNum: meter?.floorNum || '-',
      meterTypeName: meter?.meterTypeName || '-',
      preDegrees: Number(data.preDegrees || 0),
      curDegrees: Number(data.curDegrees || 0),
      preReadingTime: `${data.preReadingTime || formatDateTime()}`,
      curReadingTime: `${data.curReadingTime || formatDateTime()}`,
      state: 'W',
      stateName: '待审核',
      auditRemark: '',
    })

    return true
  }

  auditFloorShareReading(data: { auditRemark?: string, readingId: string, state?: string }): boolean {
    const reading = this.floorShareReadings.find(item => item.readingId === data.readingId)
    if (reading) {
      reading.state = data.state === 'F' ? 'F' : 'C'
      reading.stateName = data.state === 'F' ? '已拒绝' : '已通过'
      reading.auditRemark = `${data.auditRemark || ''}`
    }

    return true
  }

  /** 初始化抄表种子数据。 */
  private initData() {
    this.meterReadings.push(...Array.from({ length: 60 }).map((_, index) => {
      const meterType = meterTypes[index % meterTypes.length]
      const floor = (index % 12) + 1
      const unit = (index % 4) + 1
      const room = String((index % 24) + 1).padStart(2, '0')
      const pre = 100 + index * 3
      const cur = pre + 8 + (index % 5)

      return {
        readingId: `MR_${String(index + 1).padStart(5, '0')}`,
        objId: `ROOM_${String(index + 1).padStart(4, '0')}`,
        objName: `${floor}-${unit}-${room}`,
        meterType: meterType.typeId,
        meterTypeName: meterType.typeName,
        preDegrees: pre,
        curDegrees: cur,
        preReadingTime: formatDateTime(Date.now() - (index + 2) * 86400000),
        curReadingTime: formatDateTime(Date.now() - (index + 1) * 86400000),
        remark: '系统抄表记录',
      } satisfies MeterReading
    }))

    this.floorShareMeters.push(...Array.from({ length: 16 }).map((_, index) => {
      const meterType = meterTypes[index % 2]
      return {
        fsmId: `FSM_${String(index + 1).padStart(4, '0')}`,
        floorNum: `${(index % 8) + 1}`,
        meterNum: `GSB-${String(index + 11).padStart(3, '0')}`,
        meterType: meterType.typeId,
        meterTypeName: meterType.typeName,
        curDegree: 1200 + index * 11,
        curReadingTime: formatDateTime(Date.now() - index * 86400000),
      } satisfies FloorShareMeter
    }))

    this.floorShareReadings.push(...Array.from({ length: 28 }).map((_, index) => {
      const meter = this.floorShareMeters[index % this.floorShareMeters.length]
      const pre = meter.curDegree + index
      const cur = pre + 12 + (index % 6)
      const state: FloorShareReading['state'] = index % 4 === 0 ? 'W' : 'C'

      return {
        readingId: `FSR_${String(index + 1).padStart(4, '0')}`,
        fsmId: meter.fsmId,
        floorNum: meter.floorNum,
        meterTypeName: meter.meterTypeName,
        preDegrees: pre,
        curDegrees: cur,
        preReadingTime: formatDateTime(Date.now() - (index + 2) * 86400000),
        curReadingTime: formatDateTime(Date.now() - (index + 1) * 86400000),
        state,
        stateName: state === 'W' ? '待审核' : '已通过',
        auditRemark: state === 'W' ? '' : '审核通过',
      } satisfies FloorShareReading
    }))
  }
}

/** 默认供运行时直接复用的 meter 仓储实例。 */
export const meterMockRepository = createMeterMockRepository()

/** 克隆仓储返回值，避免外部篡改内部引用。 */
function cloneValue<T>(value: T): T {
  return structuredClone(value)
}
