import { defineHandler, readBody, setResponseStatus } from "nitro/h3";
import { getRepairRuntime } from "../../../../../modules/repair/runtime";
import { adminFailure } from "../../../../../shared/runtime/response-builder";
import { toOptionalTrimmedString } from "../../../../../utils/string";

export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as Record<string, unknown>;
		const { adminAdapter } = getRepairRuntime(event);

		return await adminAdapter.listRepairsHaveDone({
			pageIndex: Number(body.page || body.pageIndex || 1),
			pageSize: Number(body.pageSize || 10),
			workOrderNumber: toOptionalTrimmedString(body.workOrderNumber),
			reporter: toOptionalTrimmedString(body.reporter),
			repairPhone: toOptionalTrimmedString(body.repairPhone),
			repairType: toOptionalTrimmedString(body.repairType),
			maintenanceType: toOptionalTrimmedString(body.maintenanceType),
			repairStatus: toOptionalTrimmedString(body.repairStatus),
			sortBy: toOptionalTrimmedString(body.sortBy) as any,
			sortOrder: toOptionalTrimmedString(body.sortOrder) as any,
		});
	} catch (error) {
		setResponseStatus(event, 500);
		return adminFailure("查询失败", error);
	}
});
