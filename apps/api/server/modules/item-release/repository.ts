import type {
	ItemReleaseComment,
	ItemReleaseCommentQuery,
	ItemReleaseDetail,
	ItemReleaseDetailQuery,
	ItemReleaseResource,
	ItemReleaseResourceQuery,
	ItemReleaseTask,
	ItemReleaseTaskPaginationQuery,
} from "./types";

export interface ItemReleaseRepository {
	getItemRelease(query: ItemReleaseDetailQuery): Promise<ItemReleaseDetail[]>;
	getItemReleaseRes(query: ItemReleaseResourceQuery): Promise<ItemReleaseResource[]>;
	queryOaWorkflowUser(query: ItemReleaseCommentQuery): Promise<ItemReleaseComment[]>;
	queryUndoItemRelease(query: ItemReleaseTaskPaginationQuery): Promise<ItemReleaseTask[]>;
	queryFinishItemRelease(query: ItemReleaseTaskPaginationQuery): Promise<ItemReleaseTask[]>;
}

const itemReleaseDetails: ItemReleaseDetail[] = [
	{
		irId: "IR_00001",
		flowId: "FLOW_00001",
		typeName: "装修材料放行",
		applyCompany: "绿地装修服务部",
		applyPerson: "王明",
		applyTel: "13800000001",
		idCard: "440101199011010012",
		carNum: "粤A12001",
		passTime: "2026-06-06 10:00:00",
		remark: "放行申请说明",
		createUserId: "USER_0001",
	},
	{
		irId: "IR_F_00001",
		flowId: "FLOW_F_00001",
		typeName: "装修材料放行",
		applyCompany: "绿地装修服务部",
		applyPerson: "李华",
		applyTel: "13800000002",
		idCard: "440101199012010012",
		carNum: "粤A12002",
		passTime: "2026-06-05 10:00:00",
		remark: "历史放行记录",
		createUserId: "USER_0002",
	},
];

const itemReleaseResources: Record<string, ItemReleaseResource[]> = {
	IR_00001: [
		{
			resId: "RES_00001",
			resName: "release-resource-00001",
			amount: 1,
		},
	],
	IR_F_00001: [
		{
			resId: "RES_F_00001",
			resName: "release-resource-finished-00001",
			amount: 1,
		},
	],
};

const itemReleaseComments: Record<string, ItemReleaseComment[]> = {
	IR_00001: [
		{
			staffName: "audit-staff-00001",
			context: "item release approved",
			endTime: "2026-06-06 10:30:00",
		},
		{
			staffName: "audit-staff-00002",
			context: "resource detail confirmed",
		},
	],
	IR_F_00001: [
		{
			staffName: "audit-staff-f-00001",
			context: "finished item release approved",
			endTime: "2026-06-05 10:30:00",
		},
		{
			staffName: "audit-staff-f-00002",
			context: "finished resource detail confirmed",
		},
	],
};

const undoTasks: ItemReleaseTask[] = Array.from({ length: 18 }, (_, index) => {
	const sequence = index + 1;
	const padded = `${sequence}`.padStart(5, "0");

	return {
		irId: `IR_${padded}`,
		flowId: `FLOW_${padded}`,
		taskId: `TASK_${padded}`,
		typeName: "renovation material release",
		stateName: "pending audit",
		passTime: `2026-06-${`${sequence}`.padStart(2, "0")} 10:00:00`,
		amount: sequence,
		action: "Audit",
	};
});

const finishTasks: ItemReleaseTask[] = Array.from({ length: 12 }, (_, index) => {
	const sequence = index + 1;
	const padded = `${sequence}`.padStart(5, "0");

	return {
		irId: `IR_F_${padded}`,
		flowId: `FLOW_F_${padded}`,
		typeName: "renovation material release",
		stateName: "finished",
		passTime: `2026-05-${`${sequence}`.padStart(2, "0")} 10:00:00`,
		amount: sequence,
		action: "View",
	};
});

export function createItemReleaseRepository(): ItemReleaseRepository {
	return {
		async getItemRelease(query) {
			return cloneValue(itemReleaseDetails.filter((item) => item.irId === query.irId));
		},
		async getItemReleaseRes(query) {
			return cloneValue(itemReleaseResources[query.irId] ?? []);
		},
		async queryOaWorkflowUser(query) {
			return cloneValue(itemReleaseComments[query.id] ?? []);
		},
		async queryUndoItemRelease(_query) {
			return cloneValue(undoTasks);
		},
		async queryFinishItemRelease(_query) {
			return cloneValue(finishTasks);
		},
	};
}

function cloneValue<T>(value: T): T {
	return structuredClone(value);
}
