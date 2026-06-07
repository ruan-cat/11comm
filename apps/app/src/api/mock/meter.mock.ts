/**
 * 抄表模块 Mock 接口。
 */

import type {
  FeeConfigItem,
  FeeTypeItem,
  FloorShareMeter,
  FloorShareReading,
  MeterReading,
  MeterTypeItem,
} from '../../types/meter'
import { createPaginationResponse, defineUniAppMock, formatDateTime, generateId, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

/** 费用类型 mock 数据。 */
const feeTypes: FeeTypeItem[] = [
  { id: '888800010015', name: '水费' },
  { id: '888800010016', name: '电费' },
  { id: '888800010009', name: '燃气费' },
]

/** 费用配置 mock 数据。 */
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

/** 抄表类型 mock 数据。 */
const meterTypes: MeterTypeItem[] = [
  { typeId: '1010', typeName: '电表' },
  { typeId: '2020', typeName: '水表' },
  { typeId: '3030', typeName: '燃气表' },
]

/** 普通抄表记录 mock 数据。 */
const meterReadings: MeterReading[] = Array.from({ length: 36 }, (_, index) => {
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
  }
})

/** 公摊表 mock 数据。 */
const floorShareMeters: FloorShareMeter[] = Array.from({ length: 12 }, (_, index) => {
  const meterType = meterTypes[index % 2]

  return {
    fsmId: `FSM_${String(index + 1).padStart(4, '0')}`,
    floorNum: `${(index % 8) + 1}`,
    meterNum: `GSB-${String(index + 11).padStart(3, '0')}`,
    meterType: meterType.typeId,
    meterTypeName: meterType.typeName,
    curDegree: 1200 + index * 11,
    curReadingTime: formatDateTime(Date.now() - index * 86400000),
  }
})

/** 公摊读数 mock 数据。 */
const floorShareReadings: FloorShareReading[] = Array.from({ length: 20 }, (_, index) => {
  const meter = floorShareMeters[index % floorShareMeters.length]
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
  }
})

export default defineUniAppMock([
  {
    url: '/app/meter.listMeterWaters',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const roomNum = asOptionalString(params.roomNum)
      const list = roomNum
        ? meterReadings.filter(item => item.objName.includes(roomNum))
        : meterReadings

      return successResponse(createPaginationResponse(list, asPositiveNumber(params.page, 1), asPositiveNumber(params.row, 10)), '查询成功')
    },
  },
  {
    url: '/app/meter.queryFeeTypes',
    method: ['GET', 'POST'],
    body: () => successResponse(feeTypes, '查询成功'),
  },
  {
    url: '/app/meter.queryFeeTypesItems',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const feeTypeCd = asOptionalString(getRequestParams(context).feeTypeCd) || ''

      return successResponse(feeConfigsMap[feeTypeCd] || [], '查询成功')
    },
  },
  {
    url: '/app/meter.listMeterType',
    method: ['GET', 'POST'],
    body: () => successResponse(meterTypes, '查询成功'),
  },
  {
    url: '/app/meter.queryPreMeterWater',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const objId = asOptionalString(params.objId) || ''
      const meterType = asOptionalString(params.meterType) || ''
      const found = meterReadings.find(item => item.objId === objId && item.meterType === meterType)

      return successResponse({
        curDegrees: found?.curDegrees || 0,
        curReadingTime: found?.curReadingTime || formatDateTime(),
      }, '查询成功')
    },
  },
  {
    url: '/app/meter.saveMeterWater',
    method: 'POST',
    body: (context: MockContext = {}) => {
      meterReadings.unshift({
        readingId: generateId('MR'),
        objId: asOptionalString(context.body?.objId) || '',
        objName: asOptionalString(context.body?.objName) || '',
        meterType: asOptionalString(context.body?.meterType) || '2020',
        meterTypeName: meterTypes.find(item => item.typeId === (asOptionalString(context.body?.meterType) || '2020'))?.typeName || '水表',
        preDegrees: Number(context.body?.preDegrees || 0),
        curDegrees: Number(context.body?.curDegrees || 0),
        preReadingTime: asOptionalString(context.body?.preReadingTime) || formatDateTime(),
        curReadingTime: asOptionalString(context.body?.curReadingTime) || formatDateTime(),
        remark: asOptionalString(context.body?.remark) || '',
      })

      return successResponse({ success: true }, '提交成功')
    },
  },
  {
    url: '/app/meter.listFloorShareReading',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)

      return successResponse(createPaginationResponse(floorShareReadings, asPositiveNumber(params.page, 1), asPositiveNumber(params.row, 10)), '查询成功')
    },
  },
  {
    url: '/app/meter.listFloorShareMeter',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const fsmId = asOptionalString(params.fsmId)
      const list = fsmId ? floorShareMeters.filter(item => item.fsmId === fsmId) : floorShareMeters

      return successResponse(createPaginationResponse(list, asPositiveNumber(params.page, 1), asPositiveNumber(params.row, 10)), '查询成功')
    },
  },
  {
    url: '/app/meter.saveFloorShareReading',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const fsmId = asOptionalString(context.body?.fsmId) || ''
      const meter = floorShareMeters.find(item => item.fsmId === fsmId)
      floorShareReadings.unshift({
        readingId: generateId('FSR'),
        fsmId,
        floorNum: meter?.floorNum || '-',
        meterTypeName: meter?.meterTypeName || '-',
        preDegrees: Number(context.body?.preDegrees || 0),
        curDegrees: Number(context.body?.curDegrees || 0),
        preReadingTime: asOptionalString(context.body?.preReadingTime) || formatDateTime(),
        curReadingTime: asOptionalString(context.body?.curReadingTime) || formatDateTime(),
        state: 'W',
        stateName: '待审核',
        auditRemark: '',
      })

      return successResponse({ success: true }, '提交成功')
    },
  },
  {
    url: '/app/meter.auditFloorShareReading',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const readingId = asOptionalString(context.body?.readingId) || ''
      const reading = floorShareReadings.find(item => item.readingId === readingId)
      if (reading) {
        reading.state = asOptionalString(context.body?.state) === 'F' ? 'F' : 'C'
        reading.stateName = reading.state === 'F' ? '已拒绝' : '已通过'
        reading.auditRemark = asOptionalString(context.body?.auditRemark) || ''
      }

      return successResponse({ success: true }, '审核成功')
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
