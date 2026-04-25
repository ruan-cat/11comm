/**
 * OA 工作流模块 API
 */

import type {
  OaWorkflowAuditReq,
  OaWorkflowComment,
  OaWorkflowFlow,
  OaWorkflowFormDataRecord,
  OaWorkflowFormMeta,
  OaWorkflowNextTask,
  SaveOaWorkflowFormDataReq,
  UpdateOaWorkflowFormDataReq,
} from '@/types/oa-workflow'
import { http } from '@/http/alova'

/** 查询工作流定义 */
export function queryOaWorkflow(params: {
  page: number
  row: number
  state?: string
  flowType?: string
}) {
  return http.Get<{ data: OaWorkflowFlow[] }>('/app/oa/workflow/query', {
    params,
  })
}

/** 查询工作流表单定义 */
export function queryOaWorkflowForm(params: {
  page: number
  row: number
  flowId: string
}) {
  return http.Get<{ data: OaWorkflowFormMeta[] }>('/app/oa/workflow/form/query', {
    params,
  })
}

/** 保存工作流表单数据 */
export function saveOaWorkflowFormData(data: SaveOaWorkflowFormDataReq) {
  return http.Post<{ id: string }>('/app/oa/workflow/form/save', data)
}

/** 更新工作流表单数据 */
export function updateOaWorkflowFormData(data: UpdateOaWorkflowFormDataReq) {
  return http.Post<{ success: boolean }>('/app/oa/workflow/form/update', data)
}

/** 查询工作流表单数据 */
export function queryOaWorkflowFormData(params: {
  page: number
  row: number
  flowId: string
  id?: string
}) {
  return http.Get<{ data: OaWorkflowFormDataRecord[] }>('/app/oa/workflow/form/data/query', {
    params,
  })
}

/** 查询用户待办工作流 */
export function queryOaWorkflowUserTaskFormData(params: {
  page: number
  row: number
  flowId: string
}) {
  return http.Get<{ data: OaWorkflowFormDataRecord[] }>('/app/oa/workflow/task/undo/query', {
    params,
  })
}

/** 查询用户已办工作流 */
export function queryOaWorkflowUserHisTaskFormData(params: {
  page: number
  row: number
  flowId: string
}) {
  return http.Get<{ data: OaWorkflowFormDataRecord[] }>('/app/oa/workflow/task/his/query', {
    params,
  })
}

/** 查询工作流流转记录 */
export function queryOaWorkflowUser(params: {
  page: number
  row: number
  flowId: string
  id: string
}) {
  return http.Get<{ data: OaWorkflowComment[] }>('/app/oa/workflow/user/query', {
    params,
  })
}

/** 查询流程图 */
export function listRunWorkflowImage(params: {
  businessKey: string
  communityId?: string
}) {
  return http.Get<{ data: string }>('/app/oa/workflow/image/run', {
    params,
  })
}

/** 查询下一步流程动作 */
export function getNextTask(params: {
  taskId: string
  flowId: string
  id: string
}) {
  return http.Get<{ data: OaWorkflowNextTask[] }>('/app/oa/workflow/task/next', {
    params,
  })
}

/** OA 工作流审核 */
export function auditOaWorkflow(data: OaWorkflowAuditReq) {
  return http.Post<{ success: boolean }>('/app/oa/workflow/audit', data)
}

/** 查询下一处理人（通用审核） */
export function queryNextDealUser(params: {
  taskId: string
  flowId: string
  id: string
  startUserId?: string
}) {
  return http.Get<{ data: OaWorkflowNextTask[] }>('/app/oa/workflow/undo/next-deal-user', {
    params,
  })
}

/** 通用审核提交 */
export function auditUndo(data: OaWorkflowAuditReq & { business?: string }) {
  return http.Post<{ success: boolean }>('/app/oa/workflow/undo/audit', data)
}
