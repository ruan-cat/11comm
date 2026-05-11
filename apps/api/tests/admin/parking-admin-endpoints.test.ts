import { describe, expect, test, vi } from "vitest";

import { getParkingRuntime } from "../../server/modules/parking/runtime";

import carportApplyListHandler from "../../server/routes/api/property-manage/parking-manage/carport-apply/list.post";
import carportInfoListHandler from "../../server/routes/api/property-manage/parking-manage/carport-info/list.post";
import ownerVehicleListHandler from "../../server/routes/api/property-manage/parking-manage/owner-vehicle/list.post";
import parkingLotListHandler from "../../server/routes/api/property-manage/parking-manage/parking-lot/list.post";

vi.mock("nitro/h3", async (importOriginal) => {
	const actual = await importOriginal<typeof import("nitro/h3")>();
	return {
		...actual,
		readBody: vi.fn(),
	};
});

const { readBody } = await import("nitro/h3");
const mockedReadBody = vi.mocked(readBody);

describe("parking admin readonly endpoints", () => {
	test("serves the four parking list contracts through the admin adapter fallback", async () => {
		const runtime = getParkingRuntime();

		const carportApply = await runtime.adminAdapter.listCarportApplications({ pageIndex: 1, pageSize: 10 });
		const carportInfo = await runtime.adminAdapter.listCarports({ pageIndex: 1, pageSize: 10 });
		const ownerVehicle = await runtime.adminAdapter.listOwnerVehicles({ pageIndex: 1, pageSize: 10 });
		const parkingLot = await runtime.adminAdapter.listParkingLots({ pageIndex: 1, pageSize: 10 });

		for (const response of [carportApply, carportInfo, ownerVehicle, parkingLot]) {
			expect(response).toMatchObject({
				success: true,
				code: 200,
				message: expect.any(String),
				data: {
					list: [],
					total: 0,
					pageIndex: 1,
					pageSize: 10,
					totalPages: 0,
				},
			});
			expect(response).not.toHaveProperty("msg");
		}
	});

	test("admin routes read request bodies and use the parking fallback runtime", async () => {
		mockedReadBody.mockResolvedValue({ pageIndex: 2, pageSize: 5 });

		const carportApply = await carportApplyListHandler({ context: {} } as any);
		const carportInfo = await carportInfoListHandler({ context: {} } as any);
		const ownerVehicle = await ownerVehicleListHandler({ context: {} } as any);
		const parkingLot = await parkingLotListHandler({ context: {} } as any);

		for (const response of [carportApply, carportInfo, ownerVehicle, parkingLot]) {
			expect(response).toMatchObject({
				success: true,
				code: 200,
				data: {
					list: [],
					total: 0,
					pageIndex: 2,
					pageSize: 5,
				},
			});
		}
		expect(mockedReadBody).toHaveBeenCalledTimes(4);
	});
});
