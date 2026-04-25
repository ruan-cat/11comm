/**
 * repair-status-tag 组件类型定义
 * 维修状态标签组件的类型定义
 */

/** 维修状态标签类型 */
export type RepairStatusTagType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

/** 维修状态代码（与 statusCd 字段对应） */
export type RepairStatusCode = string

/** 维修状态标签组件属性 */
export interface RepairStatusTagProps {
  /** 工单状态代码（如：10001=待派单，10002=已派单，10003=处理中，10004=已完成，10005=已取消） */
  statusCd: RepairStatusCode
  /** 状态显示名称（可选，如果不传则自动根据 statusCd 获取） */
  statusName?: string
  /** 是否启用动效（默认为 true） */
  animated?: boolean
  /** 是否使用朴素样式（默认为 true） */
  plain?: boolean
}

/** 维修状态配置项 */
export interface RepairStatusConfig {
  /** 状态代码 */
  statusCd: RepairStatusCode
  /** 状态名称 */
  statusName: string
  /** 标签类型 */
  tagType: RepairStatusTagType
  /** 是否启用呼吸动效 */
  animated?: boolean
}

/** 状态类型映射表 */
export const REPAIR_STATUS_CONFIG_MAP: Record<RepairStatusCode, RepairStatusConfig> = {
  10001: {
    statusCd: '10001',
    statusName: '待派单',
    tagType: 'warning',
    animated: false,
  },
  10002: {
    statusCd: '10002',
    statusName: '已派单',
    tagType: 'info',
    animated: false,
  },
  10003: {
    statusCd: '10003',
    statusName: '处理中',
    tagType: 'primary',
    animated: true,
  },
  10004: {
    statusCd: '10004',
    statusName: '已完成',
    tagType: 'success',
    animated: false,
  },
  10005: {
    statusCd: '10005',
    statusName: '已取消',
    tagType: 'danger',
    animated: false,
  },
}
