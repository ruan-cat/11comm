/**
 * 抄表模块类型定义
 */

/** 抄表记录 */
export interface MeterReading {
  readingId: string
  objId: string
  objName: string
  meterType: string
  meterTypeName: string
  preDegrees: number
  curDegrees: number
  preReadingTime: string
  curReadingTime: string
  remark?: string
}

/** 抄表类型 */
export interface MeterTypeItem {
  typeId: string
  typeName: string
}

/** 费用类型 */
export interface FeeTypeItem {
  id: string
  name: string
}

/** 费用配置 */
export interface FeeConfigItem {
  configId: string
  feeName: string
}

/** 公摊表 */
export interface FloorShareMeter {
  fsmId: string
  floorNum: string
  meterNum: string
  meterType: string
  meterTypeName: string
  curDegree: number
  curReadingTime: string
}

/** 公摊抄表记录 */
export interface FloorShareReading {
  readingId: string
  fsmId: string
  floorNum: string
  meterTypeName: string
  preDegrees: number
  curDegrees: number
  preReadingTime: string
  curReadingTime: string
  state: 'W' | 'C' | 'F'
  stateName: string
  auditRemark?: string
}
