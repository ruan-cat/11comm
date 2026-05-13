import { defineHandler, readBody, setResponseStatus } from "nitro/h3";
import { getFeeRuntime } from "../../../../../modules/fee/runtime";
import { adminFailure } from "../../../../../shared/runtime/response-builder";
import { toOptionalTrimmedString } from "../../../../../utils/string";

export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as Record<string, unknown>;
		const { adminAdapter } = getFeeRuntime(event);

		return await adminAdapter.listRepairReportsSummaryTable({
			pageIndex: Number(body.pageIndex || body.page || 1),
			pageSize: Number(body.pageSize || 20),
			repairType: toOptionalTrimmedString(body.repairType),
			repairStatus: toOptionalTrimmedString(body.repairStatus),
			urgencyLevel: toOptionalTrimmedString(body.urgencyLevel),
			community: toOptionalTrimmedString(body.community),
			statisticsStartTime: toOptionalTrimmedString(body.statisticsStartTime),
			statisticsEndTime: toOptionalTrimmedString(body.statisticsEndTime),
		});
	} catch (error) {
		setResponseStatus(event, 500);
		return adminFailure("查询失败", error);
	}
});
