import { defineHandler, readBody, setResponseStatus } from "nitro/h3";
import { getParkingRuntime } from "../../../../../modules/parking/runtime";
import { adminFailure } from "../../../../../shared/runtime/response-builder";
import { toOptionalTrimmedString } from "../../../../../utils/string";

export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as Record<string, unknown>;
		const { adminAdapter } = getParkingRuntime(event);

		return await adminAdapter.listCarportApplications({
			pageIndex: Number(body.pageIndex ?? body.page ?? 1),
			pageSize: Number(body.pageSize ?? 20),
			applicant: toOptionalTrimmedString(body.applicant),
			carportType: toOptionalTrimmedString(body.carportType),
			status: toOptionalTrimmedString(body.status),
			licensePlate: toOptionalTrimmedString(body.licensePlate),
			carBrand: toOptionalTrimmedString(body.carBrand),
			phoneNumber: toOptionalTrimmedString(body.phoneNumber),
			reviewResult: toOptionalTrimmedString(body.reviewResult),
		});
	} catch (error) {
		setResponseStatus(event, 500);
		return adminFailure("查询失败", error);
	}
});
