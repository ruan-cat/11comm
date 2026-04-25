/**
 * OA 工作流模块类型定义
 */

/** 工作流状态编码 */
export type OaWorkflowStateCode = '1001' | '1002' | '1003' | '1004' | '1005'

/** 工作流定义 */
export interface OaWorkflowFlow {
  /** 流程ID */
  flowId: string
  /** 流程名称 */
  flowName: string
  /** 待办数量 */
  undoCount: number
  /** 流程类型 */
  flowType: string
}

/** 表单字段类型 */
export type OaWorkflowFieldType
  = | 'text'
    | 'textfield'
    | 'number'
    | 'textarea'
    | 'textdate'
    | 'textdatetime'
    | 'radio'
    | 'select'
    | 'checkbox'
    | 'button'

/** 表单字段校验配置 */
export interface OaWorkflowFieldValidate {
  /** 是否必填 */
  required?: boolean
}

/** 表单字段选项 */
export interface OaWorkflowFieldOption {
  /** 选项值 */
  value: string
  /** 选项标签 */
  label: string
}

/** 工作流表单字段 */
export interface OaWorkflowFormField {
  /** 字段类型 */
  type: OaWorkflowFieldType
  /** 标题文本（type=text时使用） */
  text?: string
  /** 字段标签 */
  label?: string
  /** 字段key */
  key?: string
  /** 占位描述 */
  description?: string
  /** 按钮动作 */
  action?: 'submit' | 'reset'
  /** 默认值 */
  value?: string
  /** 选项索引 */
  valueIndex?: number
  /** 选择项 */
  values?: OaWorkflowFieldOption[]
  /** 校验配置 */
  validate?: OaWorkflowFieldValidate
}

/** 工作流表单 */
export interface OaWorkflowFormSchema {
  /** 表单组件列表 */
  components: OaWorkflowFormField[]
}

/** 工作流表单定义 */
export interface OaWorkflowFormMeta {
  /** 流程ID */
  flowId: string
  /** 流程名称 */
  flowName: string
  /** 表单JSON串 */
  formJson: string
}

/** 附件信息 */
export interface OaWorkflowFileAttachment {
  /** 显示文件名 */
  fileName: string
  /** 实际下载地址 */
  realFileName: string
}

/** 工作流表单数据记录 */
export interface OaWorkflowFormDataRecord {
  /** 记录ID */
  id: string
  /** 流程ID */
  flowId: string
  /** 状态编码 */
  state: OaWorkflowStateCode
  /** 状态名称 */
  stateName: string
  /** 创建人ID */
  createUserId: string
  /** 创建人名称 */
  createUserName: string
  /** 创建时间 */
  createTime: string
  /** 任务ID */
  taskId: string
  /** 发起人ID */
  startUserId: string
  /** 业务类型 */
  business: string
  /** 附件列表 */
  files?: OaWorkflowFileAttachment[]
  /** 动态表单数据 */
  formData: Record<string, string>
}

/** 工作流流转记录 */
export interface OaWorkflowComment {
  /** 处理人 */
  staffName: string
  /** 开始时间 */
  startTime: string
  /** 结束时间 */
  endTime?: string
  /** 处理意见 */
  context?: string
}

/** 下一步任务信息 */
export interface OaWorkflowNextTask {
  /** 下一处理人 */
  assignee: string
  /** 是否可办理 */
  next?: boolean
  /** 是否可退回 */
  back?: boolean
  /** 是否可退回发起人 */
  backIndex?: boolean
  /** 是否可结束 */
  exit?: boolean
}

/** 审核动作 */
export interface OaWorkflowAuditAction {
  /** 动作标签 */
  label: string
  /** 动作值 */
  value: '1100' | '1200' | '1300' | '1400' | '1500'
}

/** 提交流程表单请求 */
export interface SaveOaWorkflowFormDataReq {
  /** 流程ID */
  flowId: string
  /** 文件名 */
  fileName?: string
  /** 实际文件地址 */
  realFileName?: string
  /** 表单字段值 */
  formData: Record<string, string>
}

/** 编辑流程表单请求 */
export interface UpdateOaWorkflowFormDataReq extends SaveOaWorkflowFormDataReq {
  /** 记录ID */
  id: string
}

/** 工作流审核请求 */
export interface OaWorkflowAuditReq {
  /** 流程ID */
  flowId: string
  /** 记录ID */
  id: string
  /** 任务ID */
  taskId: string
  /** 审核动作 */
  auditCode: '1100' | '1200' | '1300' | '1400' | '1500'
  /** 审核意见 */
  auditMessage: string
  /** 下一处理人 */
  staffId?: string
}
