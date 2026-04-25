/**
 * z-paging-loading 组件类型定义
 */

/** wd-loading 组件的加载器类型 */
export type WdLoadingType = 'outline' | 'ring'

/** z-paging-loading 组件属性 */
export interface ZPagingLoadingProps {
  /** 图标名称 */
  icon?: string
  /** 图标的自定义类名(用于指定具体图标和颜色) */
  iconClass?: string
  /** 图标大小 */
  iconSize?: string
  /** 加载器大小 */
  loadingSize?: string
  /** 加载器类型，只支持 'outline' 和 'ring' */
  loadingType?: WdLoadingType
  /** 主要文案 */
  primaryText?: string
  /** 次要文案 */
  secondaryText?: string
}
