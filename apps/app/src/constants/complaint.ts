import type { ColumnItem } from 'wot-design-uni/components/wd-picker-view/types'

/** 投诉类型 */
export const COMPLAINT_TYPE_OPTIONS: ColumnItem[] = [
  { value: '噪音投诉', label: '噪音投诉' },
  { value: '卫生问题', label: '卫生问题' },
  { value: '设施损坏', label: '设施损坏' },
  { value: '服务态度', label: '服务态度' },
  { value: '收费问题', label: '收费问题' },
  { value: '其他投诉', label: '其他投诉' },
]

/** 投诉状态 */
export const COMPLAINT_STATUS_OPTIONS: ColumnItem[] = [
  { value: 'SUBMITTED', label: '已提交' },
  { value: 'PROCESSING', label: '处理中' },
  { value: 'RESOLVED', label: '已解决' },
  { value: 'CLOSED', label: '已关闭' },
]
