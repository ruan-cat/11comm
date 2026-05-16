import { defineHandler, readBody, setResponseStatus } from "nitro/h3";
import { getRepairRuntime } from "../../../../../modules/repair/runtime";
import { adminFailure, adminSuccess } from "../../../../../shared/runtime/response-builder";
import { toOptionalTrimmedString } from "../../../../../utils/string";

export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as Record<string, unknown>;
		const { service } = getRepairRuntime(event);

		const pageIndex = Number(body.page || body.pageIndex || 1);
		const pageSize = Number(body.pageSize || 10);

		const result = await service.listOwnerRepairs({
			page: pageIndex,
			row: pageSize,
			communityId: "COMM_001",
			keyword: toOptionalTrimmedString(body.keyword),
		});

		const list = result.list.map((item) => ({
			id: item.repairId,
			repairId: item.repairId,
			workOrderNumber: item.workOrderNumber,
			reporter: item.repairName,
			repairPhone: item.tel,
			location: item.address,
			repairType: item.repairTypeName,
			issueLevel: "normal",
			returnRequired: true,
			status: item.statusCd,
			statusName: item.statusName,
			createTime: item.createTime,
			updateTime: item.updateTime,
			remark: item.context,
		}));

		return adminSuccess({
			list,
			total: result.total,
			pageIndex,
			pageSize,
			totalPages: Math.ceil(result.total / pageSize),
		});
	} catch (error) {
		setResponseStatus(event, 500);
		return adminFailure("查询失败", error);
	}
});
