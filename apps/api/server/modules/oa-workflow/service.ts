import type {
	OaWorkflowComment,
	OaWorkflowFlow,
	OaWorkflowFormDataListResult,
	OaWorkflowFormDataQuery,
	OaWorkflowFormDataRecord,
	OaWorkflowFormMeta,
	OaWorkflowNextTask,
	OaWorkflowRepository,
	OaWorkflowTaskListQuery,
} from "./types";

export interface OaWorkflowService {
	getWorkflowFlows: () => Promise<OaWorkflowFlow[]>;
	getForm: (flowId: string) => Promise<OaWorkflowFormMeta | undefined>;
	getFormData: (params: OaWorkflowFormDataQuery) => Promise<OaWorkflowFormDataListResult>;
	getUndoList: (params: OaWorkflowTaskListQuery) => Promise<OaWorkflowFormDataListResult>;
	getFinishList: (params: OaWorkflowTaskListQuery) => Promise<OaWorkflowFormDataListResult>;
	getComments: (id: string) => Promise<OaWorkflowComment[]>;
	getWorkflowImage: () => Promise<string>;
	getNextTask: () => Promise<OaWorkflowNextTask[]>;
	getNextDealUser: () => Promise<OaWorkflowNextTask[]>;
	getFormDataRecord: (id: string) => Promise<OaWorkflowFormDataRecord | undefined>;
}

export function createOaWorkflowService(repository: OaWorkflowRepository): OaWorkflowService {
	return {
		getWorkflowFlows: () => repository.getWorkflowFlows(),
		getForm: (flowId) => repository.getForm(flowId),
		getFormData: (params) => repository.getFormData(params),
		getUndoList: (params) => repository.getUndoList(params),
		getFinishList: (params) => repository.getFinishList(params),
		getComments: (id) => repository.getComments(id),
		getWorkflowImage: () => repository.getWorkflowImage(),
		getNextTask: () => repository.getNextTask(),
		getNextDealUser: () => repository.getNextDealUser(),
		getFormDataRecord: (id) => repository.getFormDataRecord(id),
	};
}
