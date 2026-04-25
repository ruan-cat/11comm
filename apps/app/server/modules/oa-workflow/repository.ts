import type {
  OaWorkflowAuditReq,
  OaWorkflowComment,
  OaWorkflowFlow,
  OaWorkflowFormDataRecord,
  OaWorkflowFormMeta,
  OaWorkflowFormSchema,
  OaWorkflowNextTask,
  OaWorkflowStateCode,
  SaveOaWorkflowFormDataReq,
  UpdateOaWorkflowFormDataReq,
} from '../../../src/types/oa-workflow.ts'
import dayjs from 'dayjs'
import {
  createPaginationResponse,
  formatDateTime,
  generateChineseName,
  generateId,
} from '../../shared/runtime/common-utils.ts'

export interface OaWorkflowModuleRepository {
  getComments: (id: string) => OaWorkflowComment[]
  getFinishList: (params: { flowId: string, page: number, row: number }) => { data: OaWorkflowFormDataRecord[], total: number }
  getForm: (flowId: string) => OaWorkflowFormMeta | undefined
  getFormData: (params: { flowId: string, id?: string, page: number, row: number }) => { data: OaWorkflowFormDataRecord[], total: number }
  getNextTask: () => OaWorkflowNextTask[]
  getUndoList: (params: { flowId: string, page: number, row: number }) => { data: OaWorkflowFormDataRecord[], total: number }
  getWorkflowFlows: () => OaWorkflowFlow[]
  getWorkflowImage: () => string
  saveFormData: (body: SaveOaWorkflowFormDataReq) => { id: string } | undefined
  submitAudit: (body: OaWorkflowAuditReq) => boolean
  updateFormData: (body: UpdateOaWorkflowFormDataReq) => boolean
}

/** 创建 `oa-workflow` 模块的 mock 内存仓储。 */
export function createOaWorkflowMockRepository(): OaWorkflowModuleRepository {
  return new OaWorkflowDatabase()
}

const WORKFLOW_STATE_NAME_MAP: Record<OaWorkflowStateCode, string> = {
  1001: '申请',
  1002: '待审核',
  1003: '退回',
  1004: '委托',
  1005: '办结',
}

const workflowFlows: OaWorkflowFlow[] = [
  { flowId: 'FLOW_001', flowName: '请假申请', undoCount: 0, flowType: '1001' },
  { flowId: 'FLOW_002', flowName: '采购审批', undoCount: 0, flowType: '1001' },
  { flowId: 'FLOW_003', flowName: '用印申请', undoCount: 0, flowType: '1001' },
]

const formSchemaMap: Record<string, OaWorkflowFormSchema> = {
  FLOW_001: {
    components: [
      { type: 'text', text: '请假信息' },
      { type: 'textfield', key: 'applicantName', label: '申请人', description: '请输入申请人', validate: { required: true } },
      { type: 'textdate', key: 'startDate', label: '开始日期', value: '请选择', validate: { required: true } },
      { type: 'textdate', key: 'endDate', label: '结束日期', value: '请选择', validate: { required: true } },
      {
        type: 'radio',
        key: 'leaveType',
        label: '请假类型',
        valueIndex: 0,
        values: [
          { value: 'annual', label: '年假' },
          { value: 'sick', label: '病假' },
          { value: 'other', label: '其他' },
        ],
        validate: { required: true },
      },
      { type: 'textarea', key: 'reason', label: '请假原因', description: '请输入请假原因', validate: { required: true } },
      { type: 'button', label: '提交申请', action: 'submit' },
      { type: 'button', label: '重置', action: 'reset' },
    ],
  },
  FLOW_002: {
    components: [
      { type: 'text', text: '采购审批信息' },
      { type: 'textfield', key: 'applicantName', label: '申请人', description: '请输入申请人', validate: { required: true } },
      { type: 'textfield', key: 'itemName', label: '采购物品', description: '请输入采购物品', validate: { required: true } },
      { type: 'number', key: 'amount', label: '采购金额', description: '请输入采购金额', validate: { required: true } },
      {
        type: 'select',
        key: 'priority',
        label: '优先级',
        valueIndex: 0,
        values: [
          { value: 'normal', label: '普通' },
          { value: 'urgent', label: '紧急' },
        ],
      },
      { type: 'textarea', key: 'reason', label: '采购说明', description: '请输入采购说明', validate: { required: true } },
      { type: 'button', label: '提交申请', action: 'submit' },
      { type: 'button', label: '重置', action: 'reset' },
    ],
  },
  FLOW_003: {
    components: [
      { type: 'text', text: '用印申请信息' },
      { type: 'textfield', key: 'applicantName', label: '申请人', description: '请输入申请人', validate: { required: true } },
      { type: 'textfield', key: 'documentName', label: '文件名称', description: '请输入文件名称', validate: { required: true } },
      {
        type: 'checkbox',
        key: 'stampType',
        label: '印章类型',
        values: [{ value: '公章', label: '公章' }],
      },
      { type: 'textarea', key: 'reason', label: '用印说明', description: '请输入用印说明', validate: { required: true } },
      { type: 'button', label: '提交申请', action: 'submit' },
      { type: 'button', label: '重置', action: 'reset' },
    ],
  },
}

/** oa-workflow 模块的 mock 内存仓储实现。 */
class OaWorkflowDatabase implements OaWorkflowModuleRepository {
  private readonly workflowCommentsMap: Record<string, OaWorkflowComment[]> = {
    OA_001: [
      {
        staffName: '流程发起人',
        startTime: formatDateTime(dayjs().subtract(2, 'day')),
        endTime: formatDateTime(dayjs().subtract(2, 'day').add(5, 'minute')),
        context: '提交申请',
      },
    ],
    OA_002: [
      {
        staffName: '流程发起人',
        startTime: formatDateTime(dayjs().subtract(4, 'day')),
        endTime: formatDateTime(dayjs().subtract(4, 'day').add(10, 'minute')),
        context: '提交申请',
      },
      {
        staffName: '部门主管',
        startTime: formatDateTime(dayjs().subtract(3, 'day')),
        endTime: formatDateTime(dayjs().subtract(3, 'day').add(15, 'minute')),
        context: '审核通过',
      },
    ],
    OA_003: [
      {
        staffName: '流程发起人',
        startTime: formatDateTime(dayjs().subtract(1, 'day')),
        endTime: formatDateTime(dayjs().subtract(1, 'day').add(20, 'minute')),
        context: '提交申请',
      },
      {
        staffName: '部门主管',
        startTime: formatDateTime(dayjs().subtract(12, 'hour')),
        endTime: formatDateTime(dayjs().subtract(12, 'hour').add(8, 'minute')),
        context: '转交处理',
      },
    ],
  }

  private readonly workflowRecords: OaWorkflowFormDataRecord[] = [
    {
      id: 'OA_001',
      flowId: 'FLOW_001',
      state: '1002',
      stateName: '待审核',
      createUserId: 'USER_001',
      createUserName: '张三',
      createTime: formatDateTime(dayjs().subtract(2, 'day')),
      taskId: 'TASK_001',
      startUserId: 'USER_001',
      business: 'oaWorkflow',
      files: [],
      formData: {
        applicantName: '张三',
        startDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        endDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
        leaveType: 'annual',
        reason: '外出办事',
      },
    },
    {
      id: 'OA_002',
      flowId: 'FLOW_002',
      state: '1005',
      stateName: '办结',
      createUserId: 'USER_002',
      createUserName: '李四',
      createTime: formatDateTime(dayjs().subtract(4, 'day')),
      taskId: 'TASK_002',
      startUserId: 'USER_002',
      business: 'purchaseApply',
      files: [
        {
          fileName: '采购清单.xlsx',
          realFileName: 'https://example.com/mock-files/purchase.xlsx',
        },
      ],
      formData: {
        applicantName: '李四',
        itemName: '打印机耗材',
        amount: '1200',
        priority: 'normal',
        reason: '本月办公耗材补充',
      },
    },
    {
      id: 'OA_003',
      flowId: 'FLOW_003',
      state: '1004',
      stateName: '委托',
      createUserId: 'USER_003',
      createUserName: '王五',
      createTime: formatDateTime(dayjs().subtract(1, 'day')),
      taskId: 'TASK_003',
      startUserId: 'USER_003',
      business: 'allocation',
      files: [],
      formData: {
        applicantName: '王五',
        documentName: '供应商合同',
        stampType: '公章',
        reason: '合同盖章走流程',
      },
    },
  ]

  getWorkflowFlows(): OaWorkflowFlow[] {
    return cloneValue(workflowFlows.map(flow => ({
      ...flow,
      undoCount: this.calcFlowUndoCount(flow.flowId),
    })))
  }

  getForm(flowId: string): OaWorkflowFormMeta | undefined {
    const flow = workflowFlows.find(item => item.flowId === flowId)
    const formSchema = formSchemaMap[flowId]
    if (!flow || !formSchema) {
      return undefined
    }

    return {
      flowId: flow.flowId,
      flowName: flow.flowName,
      formJson: JSON.stringify(formSchema),
    }
  }

  getFormData(params: { flowId: string, id?: string, page: number, row: number }) {
    let records = this.workflowRecords.filter(item => item.flowId === params.flowId)
    if (params.id) {
      records = records.filter(item => item.id === params.id)
    }

    const pagination = createPaginationResponse(records, params.page, params.row)
    return cloneValue({
      data: pagination.list,
      total: pagination.total,
    })
  }

  saveFormData(body: SaveOaWorkflowFormDataReq): { id: string } | undefined {
    const flow = workflowFlows.find(item => item.flowId === body.flowId)
    if (!flow) {
      return undefined
    }

    const newId = generateId('OA')
    const newTaskId = generateId('TASK')
    const currentTime = formatDateTime()

    this.workflowRecords.unshift({
      id: newId,
      flowId: body.flowId,
      state: '1001',
      stateName: '申请',
      createUserId: 'CURRENT_USER',
      createUserName: generateChineseName(),
      createTime: currentTime,
      taskId: newTaskId,
      startUserId: 'CURRENT_USER',
      business: 'oaWorkflow',
      files: body.fileName && body.realFileName
        ? [{ fileName: body.fileName, realFileName: body.realFileName }]
        : [],
      formData: body.formData,
    })

    this.workflowCommentsMap[newId] = [
      {
        staffName: '流程发起人',
        startTime: currentTime,
        endTime: currentTime,
        context: '提交申请',
      },
    ]

    return { id: newId }
  }

  updateFormData(body: UpdateOaWorkflowFormDataReq): boolean {
    const target = this.workflowRecords.find(item => item.id === body.id)
    if (!target) {
      return false
    }

    target.formData = body.formData
    target.files = body.fileName && body.realFileName
      ? [{ fileName: body.fileName, realFileName: body.realFileName }]
      : target.files

    return true
  }

  getUndoList(params: { flowId: string, page: number, row: number }) {
    const list = this.workflowRecords.filter(item =>
      item.flowId === params.flowId && (item.state === '1002' || item.state === '1004'))
    const pagination = createPaginationResponse(list, params.page, params.row)

    return cloneValue({
      data: pagination.list,
      total: pagination.total,
    })
  }

  getFinishList(params: { flowId: string, page: number, row: number }) {
    const list = this.workflowRecords.filter(item =>
      item.flowId === params.flowId && (item.state === '1003' || item.state === '1005'))
    const pagination = createPaginationResponse(list, params.page, params.row)

    return cloneValue({
      data: pagination.list,
      total: pagination.total,
    })
  }

  getComments(id: string): OaWorkflowComment[] {
    return cloneValue(this.workflowCommentsMap[id] || [])
  }

  getWorkflowImage(): string {
    return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4////fwAJ+wP+LkY3WQAAAABJRU5ErkJggg=='
  }

  getNextTask(): OaWorkflowNextTask[] {
    return [
      {
        assignee: '-2',
        next: true,
        back: true,
        backIndex: true,
        exit: true,
      },
    ]
  }

  submitAudit(body: OaWorkflowAuditReq): boolean {
    const target = this.workflowRecords.find(item => item.id === body.id)
    if (!target) {
      return false
    }

    const nextState = mapAuditCodeToState(body.auditCode)
    target.state = nextState
    target.stateName = WORKFLOW_STATE_NAME_MAP[nextState]

    const currentTime = formatDateTime()
    if (!this.workflowCommentsMap[target.id]) {
      this.workflowCommentsMap[target.id] = []
    }

    this.workflowCommentsMap[target.id].push({
      staffName: body.staffId ? `处理人-${body.staffId}` : '当前处理人',
      startTime: currentTime,
      endTime: currentTime,
      context: body.auditMessage,
    })

    return true
  }

  /** 计算流程当前待办数。 */
  private calcFlowUndoCount(flowId: string): number {
    return this.workflowRecords.filter(record =>
      record.flowId === flowId && (record.state === '1002' || record.state === '1004')).length
  }
}

/** 默认供运行时直接复用的 oa-workflow 仓储实例。 */
export const oaWorkflowMockRepository = createOaWorkflowMockRepository()

/** 根据审核动作映射流程状态。 */
function mapAuditCodeToState(auditCode: OaWorkflowAuditReq['auditCode']): OaWorkflowStateCode {
  const mapper: Record<OaWorkflowAuditReq['auditCode'], OaWorkflowStateCode> = {
    1100: '1002',
    1200: '1003',
    1300: '1004',
    1400: '1003',
    1500: '1005',
  }

  return mapper[auditCode]
}

/** 克隆仓储返回值，避免外部篡改内部引用。 */
function cloneValue<T>(value: T): T {
  return structuredClone(value)
}
