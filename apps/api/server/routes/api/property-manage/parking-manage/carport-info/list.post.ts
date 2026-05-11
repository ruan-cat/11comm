import { defineHandler, readBody, setResponseStatus } from "nitro/h3";
import { getParkingRuntime } from "../../../../../modules/parking/runtime";
import { adminFailure } from "../../../../../shared/runtime/response-builder";
import { toOptionalTrimmedString } from "../../../../../utils/string";

export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as Record<string, unknown>;
		const { adminAdapter } = getParkingRuntime(event);

		return await adminAdapter.listCarports({
			pageIndex: Number(body.pageIndex ?? body.page ?? 1),
			pageSize: Number(body.pageSize ?? 20),
			parkingLot: toOptionalTrimmedString(body.parkingLot),
			parkingSpace: toOptionalTrimmedString(body.parkingSpace),
			parkingSpaceStatus: toOptionalTrimmedString(body.parkingSpaceStatus),
			parkingSpaceType: toOptionalTrimmedString(body.parkingSpaceType),
			ownerName: toOptionalTrimmedString(body.ownerName),
			contactPhone: toOptionalTrimmedString(body.contactPhone),
			vehicleNumber: toOptionalTrimmedString(body.vehicleNumber),
		});
	} catch (error) {
		setResponseStatus(event, 500);
		return adminFailure("查询失败", error);
	}
});
