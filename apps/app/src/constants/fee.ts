import type { ColumnItem } from 'wot-design-uni/components/wd-picker-view/types'

/** 费用名称字典 */
export const FEE_NAME_OPTIONS: ColumnItem[] = [
  { value: '物业管理费', label: '物业管理费' },
  { value: '垃圾处理费', label: '垃圾处理费' },
  { value: '公共区域维护费', label: '公共区域维护费' },
  { value: '水电公摊费', label: '水电公摊费' },
  { value: '安保服务费', label: '安保服务费' },
]

/** 支付方式字典 */
export const FEE_PAY_METHOD_OPTIONS: ColumnItem[] = [
  { value: '微信支付', label: '微信支付' },
  { value: '支付宝', label: '支付宝' },
  { value: '银行卡', label: '银行卡' },
  { value: '现金', label: '现金' },
  { value: '转账', label: '转账' },
]
