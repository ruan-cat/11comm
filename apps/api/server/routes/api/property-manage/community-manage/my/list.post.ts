import { defineHandler, readBody, setResponseStatus } from "nitro/h3";
import { getCommunityRuntime } from "../../../../../modules/community/runtime";
import { adminFailure } from "../../../../../shared/runtime/response-builder";
import { toOptionalTrimmedString } from "../../../../../utils/string";

export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as Record<string, unknown>;
		const { adminAdapter } = getCommunityRuntime(event);

		return await adminAdapter.listMyCommunities({
			page: Number(body.page || body.pageIndex || 1),
			pageIndex: Number(body.pageIndex || body.page || 1),
			pageSize: Number(body.pageSize || 20),
			province: toOptionalTrimmedString(body.province),
			city: toOptionalTrimmedString(body.city),
			district: toOptionalTrimmedString(body.district),
			communityName: toOptionalTrimmedString(body.communityName),
			communityCode: toOptionalTrimmedString(body.communityCode),
			status: toOptionalTrimmedString(body.status),
		});
	} catch (error) {
		setResponseStatus(event, 500);
		return adminFailure("查询失败", error);
	}
});
