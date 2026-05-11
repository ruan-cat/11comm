import { defineHandler, readBody, setResponseStatus } from "nitro/h3";
import { getFeeRuntime } from "../../../../../modules/fee/runtime";
import { adminFailure } from "../../../../../shared/runtime/response-builder";
import { toOptionalTrimmedString } from "../../../../../utils/string";

export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as Record<string, unknown>;
		const { adminAdapter } = getFeeRuntime(event);

		return await adminAdapter.listRefundReviews({
			page: Number(body.page || body.pageIndex || 1),
			pageIndex: Number(body.pageIndex || body.page || 1),
			pageSize: Number(body.pageSize || 20),
			applicant: toOptionalTrimmedString(body.applicant),
			status: toOptionalTrimmedString(body.status),
			sortBy: toOptionalTrimmedString(body.sortBy) as "createTime" | "updateTime" | undefined,
			sortOrder: toOptionalTrimmedString(body.sortOrder) as "asc" | "desc" | undefined,
		});
	} catch (error) {
		setResponseStatus(event, 500);
		return adminFailure("查询失败", error);
	}
});
