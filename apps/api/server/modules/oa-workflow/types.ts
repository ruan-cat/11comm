/** OA 工作流模块类型定义 */

export type OaWorkflowStateCode = "1001" | "1002" | "1003" | "1004" | "1005";

export interface OaWorkflowFlow {
	flowId: string;
	flowName: string;
	undoCount: number;
	flowType: string;
}

export type OaWorkflowFieldType =
	| "text"
	| "textfield"
	| "number"
	| "textarea"
	| "textdate"
	| "textdatetime"
	| "radio"
	| "select"
	| "checkbox"
	| "button";

export interface OaWorkflowFieldValidate {
	required?: boolean;
}

export interface OaWorkflowFieldOption {
	value: string;
	label: string;
}

export interface OaWorkflowFormField {
	type: OaWorkflowFieldType;
	text?: string;
	label?: string;
	key?: string;
	description?: string;
	action?: "submit" | "reset";
	value?: string;
	valueIndex?: number;
	values?: OaWorkflowFieldOption[];
	validate?: OaWorkflowFieldValidate;
}

export interface OaWorkflowFormSchema {
	components: OaWorkflowFormField[];
}

export interface OaWorkflowFormMeta {
	flowId: string;
	flowName: string;
	formJson: string;
}

export interface OaWorkflowFileAttachment {
	fileName: string;
	realFileName: string;
}

export interface OaWorkflowFormDataRecord {
	id: string;
	flowId: string;
	state: OaWorkflowStateCode;
	stateName: string;
	createUserId: string;
	createUserName: string;
	createTime: string;
	taskId: string;
	startUserId: string;
	business: string;
	files?: OaWorkflowFileAttachment[];
	formData: Record<string, string>;
}

export interface OaWorkflowComment {
	staffName: string;
	startTime: string;
	endTime?: string;
	context?: string;
}

export interface OaWorkflowNextTask {
	assignee: string;
	next?: boolean;
	back?: boolean;
	backIndex?: boolean;
	exit?: boolean;
}

export interface OaWorkflowAuditReq {
	flowId: string;
	id: string;
	taskId: string;
	auditCode: "1100" | "1200" | "1300" | "1400" | "1500";
	auditMessage: string;
	staffId?: string;
}

export interface SaveOaWorkflowFormDataReq {
	flowId: string;
	fileName?: string;
	realFileName?: string;
	formData: Record<string, string>;
}

export interface UpdateOaWorkflowFormDataReq extends SaveOaWorkflowFormDataReq {
	id: string;
}

export interface OaWorkflowFormDataQuery {
	page: number;
	row: number;
	flowId: string;
	id?: string;
}

export interface OaWorkflowTaskListQuery {
	page: number;
	row: number;
	flowId: string;
}

export interface OaWorkflowFlowQuery {
	flowId?: string;
}

export interface OaWorkflowFormDataListResult {
	data: OaWorkflowFormDataRecord[];
	total: number;
}

export interface OaWorkflowRepository {
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
