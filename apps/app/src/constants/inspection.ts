import type { ColumnItem } from 'wot-design-uni/components/wd-picker-view/types'

/** 巡检任务状态 */
export const INSPECTION_STATES: ColumnItem[] = [
  { value: '20200405', label: '待开始' },
  { value: '20200406', label: '进行中' },
  { value: '20200407', label: '已完成' },
  { value: '20200408', label: '待补检' },
]

/** 巡检方式 */
export const INSPECTION_SIGN_TYPES: ColumnItem[] = [
  { value: 'GPS', label: '移动定位' },
  { value: 'QRCODE', label: '二维码扫描' },
  { value: 'MANUAL', label: '手动签到' },
]

/** 巡检项标题类型 */
export const INSPECTION_TITLE_TYPES: ColumnItem[] = [
  { value: '1001', label: '单选' },
  { value: '2002', label: '多选' },
  { value: '3003', label: '文本' },
]

/** 巡检情况 */
export const INSPECTION_PATROL_TYPES: ColumnItem[] = [
  { value: '10001', label: '正常' },
  { value: '10002', label: '异常' },
]
