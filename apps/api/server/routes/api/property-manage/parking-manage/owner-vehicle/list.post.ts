import { defineHandler, readBody, setResponseStatus } from "nitro/h3";
import { getParkingRuntime } from "../../../../../modules/parking/runtime";
import { adminFailure } from "../../../../../shared/runtime/response-builder";
import { toOptionalTrimmedString } from "../../../../../utils/string";

export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as Record<string, unknown>;
		const { adminAdapter } = getParkingRuntime(event);

		return await adminAdapter.listOwnerVehicles({
			pageIndex: Number(body.pageIndex ?? body.page ?? 1),
			pageSize: Number(body.pageSize ?? 20),
			licensePlate: toOptionalTrimmedString(body.licensePlate),
			parkingSpaceNumber: toOptionalTrimmedString(body.parkingSpaceNumber),
			parkingSpaceStatus: toOptionalTrimmedString(body.parkingSpaceStatus),
			ownerName: toOptionalTrimmedString(body.ownerName),
			contactInfo: toOptionalTrimmedString(body.contactInfo),
			memberPlateNumber: toOptionalTrimmedString(body.memberPlateNumber),
			carBrand: toOptionalTrimmedString(body.carBrand),
			vehicleType: toOptionalTrimmedString(body.vehicleType),
		});
	} catch (error) {
		setResponseStatus(event, 500);
		return adminFailure("查询失败", error);
	}
});
