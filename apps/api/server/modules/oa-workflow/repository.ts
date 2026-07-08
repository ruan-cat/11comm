import { formatDateTime } from "../../utils/format-date";
import type {
	OaWorkflowComment,
	OaWorkflowFlow,
	OaWorkflowFormDataListResult,
	OaWorkflowFormDataQuery,
	OaWorkflowFormDataRecord,
	OaWorkflowFormMeta,
	OaWorkflowFormSchema,
	OaWorkflowNextTask,
	OaWorkflowRepository,
	OaWorkflowTaskListQuery,
} from "./types";

export function createOaWorkflowRepository(): OaWorkflowRepository {
	return new InMemoryOaWorkflowRepository();
}

const WORKFLOW_STATE_NAME_MAP: Record<string, string> = {
	1001: "申请",
	1002: "待审核",
	1003: "退回",
	1004: "委托",
	1005: "办结",
};

const workflowFlows: OaWorkflowFlow[] = [
	{ flowId: "FLOW_001", flowName: "请假申请", undoCount: 0, flowType: "1001" },
	{ flowId: "FLOW_002", flowName: "采购审批", undoCount: 0, flowType: "1001" },
	{ flowId: "FLOW_003", flowName: "用印申请", undoCount: 0, flowType: "1001" },
];

const formSchemaMap: Record<string, OaWorkflowFormSchema> = {
	FLOW_001: {
		components: [
			{ type: "text", text: "请假信息" },
			{
				type: "textfield",
				key: "applicantName",
				label: "申请人",
				description: "请输入申请人",
				validate: { required: true },
			},
			{
				type: "textdate",
				key: "startDate",
				label: "开始日期",
				value: "请选择",
				validate: { required: true },
			},
			{
				type: "textdate",
				key: "endDate",
				label: "结束日期",
				value: "请选择",
				validate: { required: true },
			},
			{
				type: "radio",
				key: "leaveType",
				label: "请假类型",
				valueIndex: 0,
				values: [
					{ value: "annual", label: "年假" },
					{ value: "sick", label: "病假" },
					{ value: "other", label: "其他" },
				],
				validate: { required: true },
			},
			{
				type: "textarea",
				key: "reason",
				label: "请假原因",
				description: "请输入请假原因",
				validate: { required: true },
			},
			{ type: "button", label: "提交申请", action: "submit" },
			{ type: "button", label: "重置", action: "reset" },
		],
	},
	FLOW_002: {
		components: [
			{ type: "text", text: "采购审批信息" },
			{
				type: "textfield",
				key: "applicantName",
				label: "申请人",
				description: "请输入申请人",
				validate: { required: true },
			},
			{
				type: "textfield",
				key: "itemName",
				label: "采购物品",
				description: "请输入采购物品",
				validate: { required: true },
			},
			{
				type: "number",
				key: "amount",
				label: "采购金额",
				description: "请输入采购金额",
				validate: { required: true },
			},
			{
				type: "select",
				key: "priority",
				label: "优先级",
				valueIndex: 0,
				values: [
					{ value: "normal", label: "普通" },
					{ value: "urgent", label: "紧急" },
				],
			},
			{
				type: "textarea",
				key: "reason",
				label: "采购说明",
				description: "请输入采购说明",
				validate: { required: true },
			},
			{ type: "button", label: "提交申请", action: "submit" },
			{ type: "button", label: "重置", action: "reset" },
		],
	},
	FLOW_003: {
		components: [
			{ type: "text", text: "用印申请信息" },
			{
				type: "textfield",
				key: "applicantName",
				label: "申请人",
				description: "请输入申请人",
				validate: { required: true },
			},
			{
				type: "textfield",
				key: "documentName",
				label: "文件名称",
				description: "请输入文件名称",
				validate: { required: true },
			},
			{
				type: "checkbox",
				key: "stampType",
				label: "印章类型",
				values: [{ value: "公章", label: "公章" }],
			},
			{
				type: "textarea",
				key: "reason",
				label: "用印说明",
				description: "请输入用印说明",
				validate: { required: true },
			},
			{ type: "button", label: "提交申请", action: "submit" },
			{ type: "button", label: "重置", action: "reset" },
		],
	},
};

class InMemoryOaWorkflowRepository implements OaWorkflowRepository {
	private readonly workflowCommentsMap: Record<string, OaWorkflowComment[]> = {
		OA_001: [
			{
				staffName: "流程发起人",
				startTime: formatDateTime("2026-07-06T09:00:00"),
				endTime: formatDateTime("2026-07-06T09:05:00"),
				context: "提交申请",
			},
		],
		OA_002: [
			{
				staffName: "流程发起人",
				startTime: formatDateTime("2026-07-04T09:00:00"),
				endTime: formatDateTime("2026-07-04T09:10:00"),
				context: "提交申请",
			},
			{
				staffName: "部门主管",
				startTime: formatDateTime("2026-07-05T09:00:00"),
				endTime: formatDateTime("2026-07-05T09:15:00"),
				context: "审核通过",
			},
		],
		OA_003: [
			{
				staffName: "流程发起人",
				startTime: formatDateTime("2026-07-07T09:00:00"),
				endTime: formatDateTime("2026-07-07T09:20:00"),
				context: "提交申请",
			},
			{
				staffName: "部门主管",
				startTime: formatDateTime("2026-07-07T21:00:00"),
				endTime: formatDateTime("2026-07-07T21:08:00"),
				context: "转交处理",
			},
		],
	};

	private readonly workflowRecords: OaWorkflowFormDataRecord[] = [
		{
			id: "OA_001",
			flowId: "FLOW_001",
			state: "1002",
			stateName: "待审核",
			createUserId: "USER_001",
			createUserName: "张三",
			createTime: formatDateTime("2026-07-06T09:00:00"),
			taskId: "TASK_001",
			startUserId: "USER_001",
			business: "oaWorkflow",
			files: [],
			formData: {
				applicantName: "张三",
				startDate: "2026-07-09",
				endDate: "2026-07-10",
				leaveType: "annual",
				reason: "外出办事",
			},
		},
		{
			id: "OA_002",
			flowId: "FLOW_002",
			state: "1005",
			stateName: "办结",
			createUserId: "USER_002",
			createUserName: "李四",
			createTime: formatDateTime("2026-07-04T09:00:00"),
			taskId: "TASK_002",
			startUserId: "USER_002",
			business: "purchaseApply",
			files: [
				{
					fileName: "采购清单.xlsx",
					realFileName: "https://example.com/mock-files/purchase.xlsx",
				},
			],
			formData: {
				applicantName: "李四",
				itemName: "打印机耗材",
				amount: "1200",
				priority: "normal",
				reason: "本月办公耗材补充",
			},
		},
		{
			id: "OA_003",
			flowId: "FLOW_003",
			state: "1004",
			stateName: "委托",
			createUserId: "USER_003",
			createUserName: "王五",
			createTime: formatDateTime("2026-07-07T09:00:00"),
			taskId: "TASK_003",
			startUserId: "USER_003",
			business: "allocation",
			files: [],
			formData: {
				applicantName: "王五",
				documentName: "供应商合同",
				stampType: "公章",
				reason: "合同盖章走流程",
			},
		},
	];

	async getWorkflowFlows(): Promise<OaWorkflowFlow[]> {
		return structuredClone(
			workflowFlows.map((flow) => ({
				...flow,
				undoCount: this.calcFlowUndoCount(flow.flowId),
			})),
		);
	}

	async getForm(flowId: string): Promise<OaWorkflowFormMeta | undefined> {
		const flow = workflowFlows.find((item) => item.flowId === flowId);
		const formSchema = formSchemaMap[flowId];
		if (!flow || !formSchema) {
			return undefined;
		}

		return structuredClone({
			flowId: flow.flowId,
			flowName: flow.flowName,
			formJson: JSON.stringify(formSchema),
		});
	}

	async getFormData(params: OaWorkflowFormDataQuery): Promise<OaWorkflowFormDataListResult> {
		let records = this.workflowRecords.filter((item) => item.flowId === params.flowId);
		if (params.id) {
			records = records.filter((item) => item.id === params.id);
		}

		const pagination = createPaginationResponse(records, params.page, params.row);
		return structuredClone({
			data: pagination.list,
			total: pagination.total,
		});
	}

	async getUndoList(params: OaWorkflowTaskListQuery): Promise<OaWorkflowFormDataListResult> {
		const list = this.workflowRecords.filter(
			(item) => item.flowId === params.flowId && (item.state === "1002" || item.state === "1004"),
		);
		const pagination = createPaginationResponse(list, params.page, params.row);
		return structuredClone({
			data: pagination.list,
			total: pagination.total,
		});
	}

	async getFinishList(params: OaWorkflowTaskListQuery): Promise<OaWorkflowFormDataListResult> {
		const list = this.workflowRecords.filter(
			(item) => item.flowId === params.flowId && (item.state === "1003" || item.state === "1005"),
		);
		const pagination = createPaginationResponse(list, params.page, params.row);
		return structuredClone({
			data: pagination.list,
			total: pagination.total,
		});
	}

	async getComments(id: string): Promise<OaWorkflowComment[]> {
		return structuredClone(this.workflowCommentsMap[id] ?? []);
	}

	async getWorkflowImage(): Promise<string> {
		return "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4////fwAJ+wP+LkY3WQAAAABJRU5ErkJggg==";
	}

	async getNextTask(): Promise<OaWorkflowNextTask[]> {
		return structuredClone([
			{
				assignee: "-2",
				next: true,
				back: true,
				backIndex: true,
				exit: true,
			},
		]);
	}

	async getNextDealUser(): Promise<OaWorkflowNextTask[]> {
		return this.getNextTask();
	}

	async getFormDataRecord(id: string): Promise<OaWorkflowFormDataRecord | undefined> {
		return structuredClone(this.workflowRecords.find((item) => item.id === id));
	}

	private calcFlowUndoCount(flowId: string): number {
		return this.workflowRecords.filter(
			(record) => record.flowId === flowId && (record.state === "1002" || record.state === "1004"),
		).length;
	}
}

function createPaginationResponse<T>(data: T[], page: number, row: number) {
	const normalizedPage = Number.isFinite(page) && page > 0 ? page : 1;
	const normalizedRow = Number.isFinite(row) && row > 0 ? row : 10;
	const start = (normalizedPage - 1) * normalizedRow;
	const end = start + normalizedRow;
	return {
		list: data.slice(start, end),
		total: data.length,
	};
}

export function getWorkflowStateNameMap(): Record<string, string> {
	return WORKFLOW_STATE_NAME_MAP;
}
