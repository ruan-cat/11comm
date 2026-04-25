import type { ColumnItem } from 'wot-design-uni/components/wd-picker-view/types'

/** 空置房申请类型 */
export const PROPERTY_APPLY_TYPE_OPTIONS: ColumnItem[] = [{ value: '1001', label: '空置房申请' }]

/** 空置房申请状态 */
export const PROPERTY_APPLICATION_STATE_OPTIONS: ColumnItem[] = [
  { value: '0', label: '待提交' },
  { value: '1', label: '待验房' },
  { value: '2', label: '待审核' },
  { value: '3', label: '验房不通过' },
  { value: '4', label: '审批通过' },
  { value: '5', label: '审批不通过' },
  { value: '6', label: '已取消' },
]

/** 空置房记录状态 */
export const PROPERTY_RECORD_STATE_OPTIONS: ColumnItem[] = [
  { value: '1', label: '待验房' },
  { value: '2', label: '待审核' },
  { value: '3', label: '验房不通过' },
  { value: '4', label: '审批通过' },
  { value: '5', label: '审批不通过' },
  { value: '6', label: '已取消' },
]

/** 关联文件类型（图片/视频） */
export const PROPERTY_RELATION_TYPE_OPTIONS: ColumnItem[] = [
  { value: '19000', label: '图片' },
  { value: '21000', label: '视频' },
]

/** 费用折扣类型 */
export const PROPERTY_DISCOUNT_TYPE_OPTIONS: ColumnItem[] = [{ value: '3003', label: '空置房优惠' }]
