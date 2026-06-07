/**
 * OA 工作流模块 Mock 接口。
 *
 * 这是 app 本地 mock，专门用于断开旧内置 Nitro server 依赖。
 */

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
} from '../../types/oa-workflow'
import { createPaginationResponse, defineUniAppMock, errorResponse, formatDateTime, generateId, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

const stateNameMap: Record<OaWorkflowStateCode, string> = {
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

const workflowRecords: OaWorkflowFormDataRecord[] = [
  {
    id: 'OA_001',
    flowId: 'FLOW_001',
    state: '1002',
    stateName: stateNameMap[1002],
    createUserId: 'USER_001',
    createUserName: '张三',
    createTime: formatDateTime(Date.now() - 2 * 86400000),
    taskId: 'TASK_001',
    startUserId: 'USER_001',
    business: 'oaWorkflow',
    files: [],
    formData: {
      applicantName: '张三',
      startDate: '2026-06-08',
      endDate: '2026-06-09',
      leaveType: 'annual',
      reason: '外出办事',
    },
  },
  {
    id: 'OA_002',
    flowId: 'FLOW_002',
    state: '1005',
    stateName: stateNameMap[1005],
    createUserId: 'USER_002',
    createUserName: '李四',
    createTime: formatDateTime(Date.now() - 4 * 86400000),
    taskId: 'TASK_002',
    startUserId: 'USER_002',
    business: 'purchaseApply',
    files: [{ fileName: '采购清单.xlsx', realFileName: 'https://example.com/mock-files/purchase.xlsx' }],
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
    stateName: stateNameMap[1004],
    createUserId: 'USER_003',
    createUserName: '王五',
    createTime: formatDateTime(Date.now() - 86400000),
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

const workflowCommentsMap: Record<string, OaWorkflowComment[]> = {
  OA_001: [
    {
      staffName: '流程发起人',
      startTime: formatDateTime(Date.now() - 2 * 86400000),
      endTime: formatDateTime(Date.now() - 2 * 86400000 + 5 * 60000),
      context: '提交申请',
    },
  ],
  OA_002: [
    {
      staffName: '流程发起人',
      startTime: formatDateTime(Date.now() - 4 * 86400000),
      endTime: formatDateTime(Date.now() - 4 * 86400000 + 10 * 60000),
      context: '提交申请',
    },
    {
      staffName: '部门主管',
      startTime: formatDateTime(Date.now() - 3 * 86400000),
      endTime: formatDateTime(Date.now() - 3 * 86400000 + 15 * 60000),
      context: '审核通过',
    },
  ],
  OA_003: [
    {
      staffName: '流程发起人',
      startTime: formatDateTime(Date.now() - 86400000),
      endTime: formatDateTime(Date.now() - 86400000 + 20 * 60000),
      context: '提交申请',
    },
    {
      staffName: '部门主管',
      startTime: formatDateTime(Date.now() - 12 * 3600000),
      endTime: formatDateTime(Date.now() - 12 * 3600000 + 8 * 60000),
      context: '转交处理',
    },
  ],
}

export default defineUniAppMock([
  {
    url: '/app/oa/workflow/query',
    method: ['GET', 'POST'],
    body: () => successResponse({ data: getWorkflowFlows() }, '查询成功'),
  },
  {
    url: '/app/oa/workflow/form/query',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const flowId = asOptionalString(getRequestParams(context).flowId)
      const form = flowId ? getForm(flowId) : undefined
      if (!form) {
        return errorResponse('流程或表单不存在', '404')
      }

      return successResponse({ data: [form] }, '查询成功')
    },
  },
  {
    url: '/app/oa/workflow/form/data/query',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)

      return successResponse(getFormData({
        page: asPositiveNumber(params.page, 1),
        row: asPositiveNumber(params.row, 10),
        flowId: asOptionalString(params.flowId) || '',
        id: asOptionalString(params.id),
      }), '查询成功')
    },
  },
  {
    url: '/app/oa/workflow/form/save',
    method: 'POST',
    body: (context: MockContext = {}) => saveFormData(normalizeSaveFormDataReq(context.body || {})),
  },
  {
    url: '/app/oa/workflow/form/update',
    method: 'POST',
    body: (context: MockContext = {}) => updateFormData(normalizeUpdateFormDataReq(context.body || {})),
  },
  {
    url: '/app/oa/workflow/task/undo/query',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)

      return successResponse(getTaskList({
        page: asPositiveNumber(params.page, 1),
        row: asPositiveNumber(params.row, 10),
        flowId: asOptionalString(params.flowId) || '',
        states: ['1002', '1004'],
      }), '查询成功')
    },
  },
  {
    url: '/app/oa/workflow/task/his/query',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)

      return successResponse(getTaskList({
        page: asPositiveNumber(params.page, 1),
        row: asPositiveNumber(params.row, 10),
        flowId: asOptionalString(params.flowId) || '',
        states: ['1003', '1005'],
      }), '查询成功')
    },
  },
  {
    url: '/app/oa/workflow/user/query',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => successResponse({
      data: workflowCommentsMap[asOptionalString(getRequestParams(context).id) || ''] || [],
    }, '查询成功'),
  },
  {
    url: '/app/oa/workflow/image/run',
    method: ['GET', 'POST'],
    body: () => successResponse({
      data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4////fwAJ+wP+LkY3WQAAAABJRU5ErkJggg==',
    }, '查询成功'),
  },
  {
    url: '/app/oa/workflow/task/next',
    method: ['GET', 'POST'],
    body: () => successResponse({ data: createNextTask() }, '查询成功'),
  },
  {
    url: '/app/oa/workflow/audit',
    method: 'POST',
    body: (context: MockContext = {}) => auditWorkflow(normalizeAuditReq(context.body || {})),
  },
  {
    url: '/app/oa/workflow/undo/next-deal-user',
    method: ['GET', 'POST'],
    body: () => successResponse({ data: createNextTask() }, '查询成功'),
  },
  {
    url: '/app/oa/workflow/undo/audit',
    method: 'POST',
    body: (context: MockContext = {}) => auditWorkflow(normalizeAuditReq(context.body || {})),
  },
])

/** 生成流程列表时动态补齐待办数量。 */
function getWorkflowFlows(): OaWorkflowFlow[] {
  return workflowFlows.map(flow => ({
    ...flow,
    undoCount: workflowRecords.filter(record =>
      record.flowId === flow.flowId && ['1002', '1004'].includes(record.state)).length,
  }))
}

/** 根据流程生成表单元数据。 */
function getForm(flowId: string): OaWorkflowFormMeta | undefined {
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

/** 查询流程表单数据，保持旧接口的 data/total 响应层。 */
function getFormData(params: { flowId: string, id?: string, page: number, row: number }) {
  let records = workflowRecords.filter(item => item.flowId === params.flowId)
  if (params.id) {
    records = records.filter(item => item.id === params.id)
  }

  const pagination = createPaginationResponse(records, params.page, params.row)

  return {
    data: pagination.list,
    total: pagination.total,
  }
}

/** 保存新流程记录。 */
function saveFormData(body: SaveOaWorkflowFormDataReq) {
  if (!body.flowId) {
    return errorResponse('flowId 不能为空', '400')
  }

  if (!body.formData || Object.keys(body.formData).length === 0) {
    return errorResponse('表单内容不能为空', '400')
  }

  const flow = workflowFlows.find(item => item.flowId === body.flowId)
  if (!flow) {
    return errorResponse('流程不存在', '404')
  }

  const id = generateId('OA')
  const currentTime = formatDateTime()

  workflowRecords.unshift({
    id,
    flowId: body.flowId,
    state: '1001',
    stateName: stateNameMap[1001],
    createUserId: 'CURRENT_USER',
    createUserName: '当前用户',
    createTime: currentTime,
    taskId: generateId('TASK'),
    startUserId: 'CURRENT_USER',
    business: 'oaWorkflow',
    files: body.fileName && body.realFileName
      ? [{ fileName: body.fileName, realFileName: body.realFileName }]
      : [],
    formData: body.formData,
  })

  workflowCommentsMap[id] = [
    {
      staffName: '流程发起人',
      startTime: currentTime,
      endTime: currentTime,
      context: '提交申请',
    },
  ]

  return successResponse({ id }, '提交成功')
}

/** 更新本地 mock 中的流程记录。 */
function updateFormData(body: UpdateOaWorkflowFormDataReq) {
  const target = workflowRecords.find(item => item.id === body.id)
  if (!target) {
    return errorResponse('记录不存在', '404')
  }

  target.formData = body.formData || {}
  target.files = body.fileName && body.realFileName
    ? [{ fileName: body.fileName, realFileName: body.realFileName }]
    : target.files

  return successResponse({ success: true }, '保存成功')
}

function getTaskList(params: { flowId: string, page: number, row: number, states: OaWorkflowStateCode[] }) {
  const list = workflowRecords.filter(item =>
    item.flowId === params.flowId && params.states.includes(item.state))
  const pagination = createPaginationResponse(list, params.page, params.row)

  return {
    data: pagination.list,
    total: pagination.total,
  }
}

function createNextTask(): OaWorkflowNextTask[] {
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

function auditWorkflow(body: OaWorkflowAuditReq) {
  const target = workflowRecords.find(item => item.id === body.id)
  if (!target) {
    return errorResponse('记录不存在', '404')
  }

  const nextState = mapAuditCodeToState(body.auditCode)
  target.state = nextState
  target.stateName = stateNameMap[nextState]

  const currentTime = formatDateTime()
  workflowCommentsMap[target.id] = workflowCommentsMap[target.id] || []
  workflowCommentsMap[target.id].push({
    staffName: body.staffId ? `处理人${body.staffId}` : '当前处理人',
    startTime: currentTime,
    endTime: currentTime,
    context: body.auditMessage,
  })

  return successResponse({ success: true }, '提交成功')
}

function normalizeSaveFormDataReq(body: Record<string, unknown>): SaveOaWorkflowFormDataReq {
  return {
    flowId: asOptionalString(body.flowId) || '',
    fileName: asOptionalString(body.fileName),
    realFileName: asOptionalString(body.realFileName),
    formData: normalizeStringRecord(body.formData),
  }
}

function normalizeUpdateFormDataReq(body: Record<string, unknown>): UpdateOaWorkflowFormDataReq {
  return {
    ...normalizeSaveFormDataReq(body),
    id: asOptionalString(body.id) || '',
  }
}

function normalizeAuditReq(body: Record<string, unknown>): OaWorkflowAuditReq {
  return {
    flowId: asOptionalString(body.flowId) || '',
    id: asOptionalString(body.id) || '',
    taskId: asOptionalString(body.taskId) || '',
    auditCode: normalizeAuditCode(body.auditCode),
    auditMessage: asOptionalString(body.auditMessage) || '',
    staffId: asOptionalString(body.staffId),
  }
}

function normalizeStringRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, asOptionalString(item) || '']),
  )
}

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

function normalizeAuditCode(value: unknown): OaWorkflowAuditReq['auditCode'] {
  const code = asOptionalString(value)
  if (code === '1200' || code === '1300' || code === '1400' || code === '1500') {
    return code
  }

  return '1100'
}

/** 合并 Vite mock 的 query、body 与 params。 */
function getRequestParams(context: MockContext): Record<string, unknown> {
  return {
    ...(context.query || {}),
    ...(context.body || {}),
    ...(context.params || {}),
  }
}

function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}

function asPositiveNumber(value: unknown, fallback: number): number {
  const numberValue = Number(asOptionalString(value))

  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : fallback
}
