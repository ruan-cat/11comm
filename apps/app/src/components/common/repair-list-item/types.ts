/**
 * repair-list-item 组件类型定义
 */

import type { RepairOrder } from '@/types/repair'

/** 维修列表项组件属性 */
export interface RepairListItemProps {
  /** 维修工单数据对象 */
  item: RepairOrder
}
