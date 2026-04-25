/**
 * repair-list-search-bar 组件类型定义
 */

/** 维修列表搜索栏组件属性 */
export interface RepairListSearchBarProps {
  /** 搜索关键词（v-model） */
  modelValue: string
  /** 选中的状态值（v-model:selectedState） */
  selectedState?: string
  /** 是否使用状态筛选功能 */
  isUseStateOptions?: boolean
  /** 搜索框占位符 */
  placeholder?: string
  /** 最大输入长度 */
  maxlength?: number
  /** 总记录数（用于显示"共 X 条记录"） */
  total?: number
}

/** 状态选项接口 */
export interface StateOption {
  /** 显示标签 */
  label: string
  /** 选项值 */
  value: string
}
