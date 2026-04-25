/**
 * form-section-title 组件类型定义
 */

/** 表单分区标题组件属性 */
export interface FormSectionTitleProps {
  /** 标题文本 */
  title: string
  /** 标题背景样式 */
  background?: 'default' | 'transparent'
  /** 是否显示必填标记 */
  required?: boolean
  /** 是否启用呼吸动效 */
  animated?: boolean
  /**
   * 图标名称
   * - 支持 wot-design-uni 内置图标名称（如 'star'、'home'）
   * - 支持 UnoCSS Iconify 图标类名（如 'i-carbon-star-filled'）
   * - 当以 'i-' 开头时，自动识别为 Iconify 图标
   */
  icon?: string
  /** 图标的自定义类名（用于设置颜色等样式） */
  iconClass?: string
  /** 副标题/描述文本 */
  subtitle?: string
}
