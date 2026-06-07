import { test, describe } from "vitest";
import { afterEach, beforeEach, expect, vi } from "vitest";

vi.mock("nitro/h3", async (importOriginal) => {
	const actual = await importOriginal<typeof import("nitro/h3")>();
	return {
		...actual,
		getMethod: vi.fn(),
		getQuery: vi.fn(),
		getRequestURL: vi.fn(),
		readBody: vi.fn(),
		setResponseStatus: vi.fn((event: Record<string, any>, statusCode: number) => {
			event.res ??= {};
			event.res.statusCode = statusCode;
		}),
	};
});

vi.mock("../../server/shared/runtime/observability", () => ({
	apiLogger: {
		info: vi.fn(),
		error: vi.fn(),
	},
	logApiRequest: vi.fn(),
	logApiError: vi.fn(),
}));

const { getMethod, getQuery, getRequestURL, readBody, setResponseStatus } = await import("nitro/h3");
const legacyDispatchHandler = (await import("../../server/handlers/legacy-dispatch")).default;

const mockedGetMethod = vi.mocked(getMethod);
const mockedGetQuery = vi.mocked(getQuery);
const mockedGetRequestURL = vi.mocked(getRequestURL);
const mockedReadBody = vi.mocked(readBody);
const mockedSetResponseStatus = vi.mocked(setResponseStatus);

const fallbackBaseUrlSnapshot = process.env.PHASE7_LEGACY_APP_FALLBACK_BASE_URL;
const fallbackEnabledSnapshot = process.env.PHASE7_LEGACY_APP_FALLBACK_ENABLED;
const detailedErrorsSnapshot = process.env.NITRO_PUBLIC_ENABLE_DETAILED_ERRORS;

describe("legacy-dispatch fallback drill", () => {
	beforeEach(() => {
		process.env.PHASE7_LEGACY_APP_FALLBACK_BASE_URL = "http://127.0.0.1:9";
		delete process.env.PHASE7_LEGACY_APP_FALLBACK_ENABLED;
		process.env.NITRO_PUBLIC_ENABLE_DETAILED_ERRORS = "false";
		mockedGetMethod.mockReset();
		mockedGetQuery.mockReset();
		mockedGetRequestURL.mockReset();
		mockedReadBody.mockReset();
		mockedSetResponseStatus.mockClear();
	});

	afterEach(() => {
		restoreOptionalEnv("PHASE7_LEGACY_APP_FALLBACK_BASE_URL", fallbackBaseUrlSnapshot);
		restoreOptionalEnv("PHASE7_LEGACY_APP_FALLBACK_ENABLED", fallbackEnabledSnapshot);
		restoreOptionalEnv("NITRO_PUBLIC_ENABLE_DETAILED_ERRORS", detailedErrorsSnapshot);
		vi.restoreAllMocks();
	});

	test("registered exact legacy endpoint is served by apps/api registry when fallback is unreachable", async () => {
		process.env.PHASE7_LEGACY_APP_FALLBACK_ENABLED = "0";
		const fetchSpy = vi.spyOn(globalThis, "fetch");
		mockLegacyGetRequest("/app/floor.queryFloors", { communityId: "COMM_001", page: 1, row: 2 });

		const response = await legacyDispatchHandler(createEvent());

		expect(fetchSpy).not.toHaveBeenCalled();
		expect(mockedSetResponseStatus).not.toHaveBeenCalled();
		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
				page: 1,
				pageSize: 2,
				hasMore: expect.any(Boolean),
			},
		});
		const data = response.data as { list: Array<{ communityId: string }> };
		expect(data.list).toHaveLength(2);
		expect(data.list.every((floor) => floor.communityId === "COMM_001")).toBe(true);
	});

	test("unregistered app legacy endpoint fails closed without fetch when fallback is disabled", async () => {
		process.env.PHASE7_LEGACY_APP_FALLBACK_ENABLED = "0";
		const fetchSpy = vi.spyOn(globalThis, "fetch");
		mockLegacyGetRequest("/app/task815.unregisteredFallbackProbe");

		const response = await legacyDispatchHandler(createEvent());

		expect(fetchSpy).not.toHaveBeenCalled();
		expect(mockedSetResponseStatus).toHaveBeenCalledWith(expect.any(Object), 404);
		expect(response).toMatchObject({
			code: 404,
			msg: "Endpoint not found: GET /app/task815.unregisteredFallbackProbe",
			data: null,
			errorCode: "ENDPOINT_NOT_FOUND",
		});
	});

	test.each([
		["/app/profile.changeCommunity", { communityId: "COMM_002" }, "profile.changeCommunity"],
		["/app/profile.changePassword", { oldPwd: "old-password", newPwd: "new-password" }, "profile.changePassword"],
		["/app/visit.auditVisit", { visitId: "VISIT_00001", state: "1" }, "visit.auditVisit"],
		["/app/workorder/create", { workId: "WO_001" }, "workorder/create"],
		["/app/workorder/update", { workId: "WO_001" }, "workorder/update"],
		["/app/workorder/start", { workId: "WO_001" }, "workorder/start"],
		["/app/workorder/complete", { workId: "WO_001" }, "workorder/complete"],
		["/app/workorder/audit", { workId: "WO_001" }, "workorder/audit"],
		["/app/workorder/cancel", { workId: "WO_001" }, "workorder/cancel"],
		["/app/workorder/copy/finish", { workId: "WO_001" }, "workorder/copy/finish"],
		[
			"/app/inspection.submitInspection",
			{ taskId: "TASK_001", taskDetailId: "DETAIL_TASK_001_001", photos: ["https://example.test/a.png"] },
			"inspection.submitInspection",
		],
		["/app/inspection.transferTask", { taskId: "TASK_001", staffName: "王巡检" }, "inspection.transferTask"],
		["/app/meter.saveMeterWater", { objId: "ROOM_0001", meterType: "1010" }, "meter.saveMeterWater"],
		["/app/meter.saveFloorShareReading", { fsmId: "FSM_0001", state: "W" }, "meter.saveFloorShareReading"],
		["/app/meter.auditFloorShareReading", { readingId: "FSR_0001", state: "C" }, "meter.auditFloorShareReading"],
		["/app/activities.likeActivity", { activitiesId: "ACT_001" }, "activities.likeActivity"],
		["/app/activities.increaseView", { activitiesId: "ACT_001" }, "activities.increaseView"],
		["/app/activities.updateStatus", { activitiesId: "ACT_001", status: "ONGOING" }, "activities.updateStatus"],
		["/app/activities.updateLike", { activitiesId: "ACT_001" }, "activities.updateLike"],
		["/app/activities.updateCollect", { activitiesId: "ACT_001" }, "activities.updateCollect"],
		["/app/activities.saveActivities", { title: "Blocked activity mutation" }, "activities.saveActivities"],
		["/app/activities.updateActivities", { activitiesId: "ACT_001" }, "activities.updateActivities"],
		["/app/activities.deleteActivities", { activitiesId: "ACT_001" }, "activities.deleteActivities"],
		[
			"/app/itemRelease.auditItemRelease",
			{ irId: "IR_00001", flowId: "FLOW_00001", taskId: "TASK_00001", auditCode: "1100" },
			"itemRelease.auditItemRelease",
		],
		[
			"/app/couponProperty.writeOffCouponPropertyUser",
			{ couponQrcode: "CPN100000" },
			"couponProperty.writeOffCouponPropertyUser",
		],
		[
			"/app/integral.useIntegral",
			{ ownerName: "积分业主01", ownerTel: "13800000001", integral: 10 },
			"integral.useIntegral",
		],
		[
			"/app/reserveOrder.saveReserveGoodsConfirmOrder",
			{ timeId: "RSV200000" },
			"reserveOrder.saveReserveGoodsConfirmOrder",
		],
	])("guarded exact endpoint is served by apps/api when fallback is disabled: %s", async (path, body, action) => {
		process.env.PHASE7_LEGACY_APP_FALLBACK_ENABLED = "0";
		const fetchSpy = vi.spyOn(globalThis, "fetch");
		mockLegacyPostRequest(path, body);

		const response = await legacyDispatchHandler(createEvent());

		expect(fetchSpy).not.toHaveBeenCalled();
		expect(mockedSetResponseStatus).not.toHaveBeenCalled();
		expect(response).toMatchObject({
			code: 409,
			msg: expect.stringContaining(action),
			data: null,
			errorCode: "PHASE7_MUTATION_GUARDED",
		});
	});

	test.each([
		["/app/maintenance.startMaintenanceTask", { taskId: "MT_001" }, "maintenance.startMaintenanceTask"],
		["/app/maintenance.completeMaintenanceTask", { taskId: "MT_001" }, "maintenance.completeMaintenanceTask"],
		[
			"/app/maintenance.submitMaintenanceSingle",
			{ taskDetailId: "MTD_MT_001_01", result: "OK" },
			"maintenance.submitMaintenanceSingle",
		],
		[
			"/app/maintenance.transferMaintenanceTask",
			{ taskId: "MT_001", staffId: "STAFF_002" },
			"maintenance.transferMaintenanceTask",
		],
	])(
		"guarded maintenance endpoint keeps the legacy maintenance envelope when fallback is disabled: %s",
		async (path, body, action) => {
			process.env.PHASE7_LEGACY_APP_FALLBACK_ENABLED = "0";
			const fetchSpy = vi.spyOn(globalThis, "fetch");
			mockLegacyPostRequest(path, body);

			const response = await legacyDispatchHandler(createEvent());

			expect(fetchSpy).not.toHaveBeenCalled();
			expect(mockedSetResponseStatus).not.toHaveBeenCalled();
			expect(response).toMatchObject({
				success: false,
				code: "409",
				message: expect.stringContaining(action),
				data: null,
				errorCode: "PHASE7_MUTATION_GUARDED",
				timestamp: expect.any(Number),
			});
			expect(response).not.toHaveProperty("msg");
		},
	);

	test.each([
		[
			"/app/feeDiscount/queryFeeDiscount",
			{ discountType: "3003", communityId: "COMM_001" },
			{ discountId: "DISCOUNT_001" },
		],
		["/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail", { ardrId: "ARDR_001" }, { ardrId: "ARDR_001" }],
	])(
		"readonly property-application exact endpoint is served by apps/api when fallback is disabled: %s",
		async (path, query, expectedItem) => {
			process.env.PHASE7_LEGACY_APP_FALLBACK_ENABLED = "0";
			const fetchSpy = vi.spyOn(globalThis, "fetch");
			mockLegacyGetRequest(path, query);

			const response = await legacyDispatchHandler(createEvent());

			expect(fetchSpy).not.toHaveBeenCalled();
			expect(mockedSetResponseStatus).not.toHaveBeenCalled();
			expect(response).toMatchObject({
				code: 0,
				msg: expect.any(String),
				data: expect.arrayContaining([expect.objectContaining(expectedItem)]),
			});
		},
	);

	test.each([
		[
			"/app/itemRelease.getItemRelease",
			{ irId: "IR_00001" },
			{
				list: [expect.objectContaining({ irId: "IR_00001" })],
				total: 1,
				page: 1,
				pageSize: 1,
				hasMore: false,
			},
		],
		[
			"/app/itemRelease.getItemReleaseRes",
			{ irId: "IR_00001", page: 1, row: 20 },
			{
				list: [expect.objectContaining({ resId: expect.any(String), resName: expect.any(String), amount: 1 })],
				total: 1,
				page: 1,
				pageSize: 20,
				hasMore: false,
			},
		],
		[
			"/app/itemRelease.queryOaWorkflowUser",
			{ id: "IR_00001", flowId: "IGNORED_FLOW", communityId: "IGNORED_COMMUNITY", page: 1, row: 1 },
			{
				list: [expect.objectContaining({ staffName: expect.any(String), context: expect.any(String) })],
				total: 2,
				page: 1,
				pageSize: 1,
				hasMore: true,
			},
		],
		[
			"/app/itemRelease.queryUndoItemReleaseV2",
			{ page: 1 },
			{
				list: expect.arrayContaining([
					expect.objectContaining({ irId: "IR_00001", flowId: "FLOW_00001", action: "Audit" }),
				]),
				total: 18,
				page: 1,
				pageSize: 10,
				hasMore: true,
			},
		],
		[
			"/app/itemRelease.queryFinishItemReleaseV2",
			{ page: 1 },
			{
				list: expect.arrayContaining([
					expect.objectContaining({ irId: "IR_F_00001", flowId: "FLOW_F_00001", action: "View" }),
				]),
				total: 12,
				page: 1,
				pageSize: 10,
				hasMore: true,
			},
		],
	])(
		"readonly item-release exact endpoint is served by apps/api when fallback is disabled: %s",
		async (path, query, expectedData) => {
			process.env.PHASE7_LEGACY_APP_FALLBACK_ENABLED = "0";
			const fetchSpy = vi.spyOn(globalThis, "fetch");
			mockLegacyGetRequest(path, query);

			const response = await legacyDispatchHandler(createEvent());

			expect(fetchSpy).not.toHaveBeenCalled();
			expect(mockedSetResponseStatus).not.toHaveBeenCalled();
			expect(response).toMatchObject({
				code: 0,
				msg: expect.any(String),
				data: expectedData,
			});
		},
	);

	test.each([
		[
			"/app/iot/listChargeMachineBmoImpl",
			{ communityId: "COMM_001", machineNameLike: "1" },
			{ machineId: "MACHINE_001" },
		],
		[
			"/app/iot/listChargeMachineOrderBmoImpl",
			{ communityId: "UNKNOWN_COMMUNITY", machineId: "MACHINE_001" },
			{ orderId: "CHARGE_ORDER_001" },
		],
		[
			"/app/iot/listChargeMachinePortBmoImpl",
			{ communityId: "COMM_001", machineId: "MACHINE_001" },
			{ portId: "PORT_001" },
		],
		[
			"/app/machine/listMachineRecords",
			{ page: 1, row: 10, communityId: "UNKNOWN_COMMUNITY" },
			{ logId: "OPEN_LOG_001" },
		],
	])(
		"readonly charge-machine exact endpoint is served by apps/api when fallback is disabled: %s",
		async (path, query, expectedItem) => {
			process.env.PHASE7_LEGACY_APP_FALLBACK_ENABLED = "0";
			const fetchSpy = vi.spyOn(globalThis, "fetch");
			mockLegacyGetRequest(path, query);

			const response = await legacyDispatchHandler(createEvent());

			expect(fetchSpy).not.toHaveBeenCalled();
			expect(mockedSetResponseStatus).not.toHaveBeenCalled();
			expect(response).toMatchObject({
				code: 0,
				msg: expect.any(String),
				data: {
					list: expect.arrayContaining([expect.objectContaining(expectedItem)]),
				},
			});
		},
	);

	test.each([
		["/app/dict.queryPayTypes", {}, expect.any(Array)],
		[
			"/app/ownerRepair.getRepairStatistics",
			{ ignored: "yes" },
			expect.objectContaining({ total: expect.any(Number), statusStats: expect.any(Object) }),
		],
		[
			"/app/ownerRepair.listRepairStaffRecords",
			{ repairId: "REPAIR_001" },
			expect.objectContaining({
				staffRecords: expect.arrayContaining([expect.objectContaining({ repairId: "REPAIR_001" })]),
			}),
		],
		[
			"/app/ownerRepair.listRepairStaffs",
			{ repairType: "1001" },
			expect.objectContaining({
				staffs: expect.arrayContaining([expect.objectContaining({ staffId: expect.any(String) })]),
			}),
		],
		[
			"/app/repair.listRepairTypeUsers",
			{ repairType: "1001" },
			expect.objectContaining({
				users: expect.arrayContaining([expect.objectContaining({ userId: expect.any(String) })]),
			}),
		],
		[
			"/app/resourceStore.listResources",
			{ rstId: "RST_001_01" },
			expect.objectContaining({
				resources: expect.arrayContaining([expect.objectContaining({ resTypeName: "水管类" })]),
				total: expect.any(Number),
			}),
		],
	])(
		"readonly repair exact endpoint is served by apps/api when fallback is disabled: %s",
		async (path, query, expectedData) => {
			process.env.PHASE7_LEGACY_APP_FALLBACK_ENABLED = "0";
			const fetchSpy = vi.spyOn(globalThis, "fetch");
			mockLegacyGetRequest(path, query);

			const response = await legacyDispatchHandler(createEvent());

			expect(fetchSpy).not.toHaveBeenCalled();
			expect(mockedSetResponseStatus).not.toHaveBeenCalled();
			expect(response).toMatchObject({
				code: 0,
				msg: expect.any(String),
				data: expectedData,
			});
		},
	);

	test.each([
		[
			"/app/couponProperty.listCouponPropertyUserDetail",
			{ page: 1, row: 2, couponQrcode: "CPN10000" },
			expect.objectContaining({
				list: expect.arrayContaining([expect.objectContaining({ couponQrcode: expect.stringContaining("CPN10000") })]),
				total: expect.any(Number),
				page: 1,
				pageSize: 2,
			}),
		],
		[
			"/app/integral.listIntegralSetting",
			{},
			expect.arrayContaining([
				expect.objectContaining({ settingId: expect.any(String), onceMaxIntegral: expect.any(Number) }),
			]),
		],
		[
			"/app/integral.listIntegralUserDetail",
			{ page: 1, row: 1, ownerTel: "13800000001" },
			expect.objectContaining({
				list: [expect.objectContaining({ ownerTel: expect.stringContaining("13800000001") })],
				total: expect.any(Number),
				page: 1,
				pageSize: 1,
			}),
		],
		[
			"/app/reserveOrder.listReserveGoodsConfirmOrder",
			{ page: 1, row: 2, reserveQrcode: "RSV20000" },
			expect.objectContaining({
				list: expect.arrayContaining([expect.objectContaining({ reserveQrcode: expect.stringContaining("RSV20000") })]),
				total: expect.any(Number),
				page: 1,
				pageSize: 2,
			}),
		],
		[
			"/app/staff.listStaffs",
			{ communityId: "COMM_001" },
			expect.arrayContaining([expect.objectContaining({ userId: expect.any(String), userName: expect.any(String) })]),
		],
		[
			"/app/inspection.getTodayReport",
			{ communityId: "COMM_001", queryTime: "2026-06-06" },
			expect.arrayContaining([
				expect.objectContaining({ staffId: expect.any(String), finishCount: expect.any(Number) }),
			]),
		],
		[
			"/app/inspection.listInspectionItemTitles",
			{ itemId: "ITEM_001", page: 1, row: 2 },
			expect.objectContaining({
				list: expect.arrayContaining([expect.objectContaining({ titleId: expect.any(String) })]),
				total: 3,
				page: 1,
				pageSize: 2,
			}),
		],
		[
			"/app/inspection.listInspectionTasks",
			{ page: 1, row: 2, moreState: "20200405" },
			expect.objectContaining({
				list: expect.arrayContaining([expect.objectContaining({ taskId: expect.any(String), state: "20200405" })]),
				total: 3,
				page: 1,
				pageSize: 2,
			}),
		],
		[
			"/app/inspection.listInspectionTaskDetails",
			{ taskId: "TASK_001", state: "20200406" },
			expect.objectContaining({
				list: expect.arrayContaining([
					expect.objectContaining({ taskDetailId: "DETAIL_TASK_001_001", state: "20200406" }),
				]),
				total: 1,
				page: 1,
				pageSize: 100,
			}),
		],
	])(
		"readonly inspection exact endpoint is served by apps/api when fallback is disabled: %s",
		async (path, query, expectedData) => {
			process.env.PHASE7_LEGACY_APP_FALLBACK_ENABLED = "0";
			const fetchSpy = vi.spyOn(globalThis, "fetch");
			mockLegacyGetRequest(path, query);

			const response = await legacyDispatchHandler(createEvent());

			expect(fetchSpy).not.toHaveBeenCalled();
			expect(mockedSetResponseStatus).not.toHaveBeenCalled();
			expect(response).toMatchObject({
				code: 0,
				msg: expect.any(String),
				data: expectedData,
			});
		},
	);

	test.each([
		[
			"/app/maintenance.listMaintenanceTasks",
			{ communityId: "COMM_001", status: "10001", page: 1, row: 2 },
			expect.objectContaining({
				list: [expect.objectContaining({ communityId: "COMM_001", status: "10001" })],
				total: expect.any(Number),
				page: 1,
				pageSize: 2,
			}),
		],
		[
			"/app/maintenance.queryMaintenanceTask",
			{ taskId: "MT_001" },
			expect.objectContaining({ task: expect.objectContaining({ taskId: "MT_001" }) }),
		],
		[
			"/app/maintenance.listMaintenanceTaskDetails",
			{ taskId: "MT_001" },
			expect.objectContaining({
				items: expect.arrayContaining([
					expect.objectContaining({ taskId: "MT_001", taskDetailId: expect.any(String) }),
				]),
			}),
		],
	])(
		"readonly maintenance exact endpoint is served by apps/api when fallback is disabled: %s",
		async (path, query, expectedData) => {
			process.env.PHASE7_LEGACY_APP_FALLBACK_ENABLED = "0";
			const fetchSpy = vi.spyOn(globalThis, "fetch");
			mockLegacyGetRequest(path, query);

			const response = await legacyDispatchHandler(createEvent());

			expect(fetchSpy).not.toHaveBeenCalled();
			expect(mockedSetResponseStatus).not.toHaveBeenCalled();
			expect(response).toMatchObject({
				success: true,
				code: "0",
				message: expect.any(String),
				data: expectedData,
				timestamp: expect.any(Number),
			});
			expect(response).not.toHaveProperty("msg");
		},
	);

	test.each([
		[
			"/app/meter.queryFeeTypes",
			{},
			expect.arrayContaining([expect.objectContaining({ id: "888800010015", name: "水费" })]),
		],
		[
			"/app/meter.queryFeeTypesItems",
			{ feeTypeCd: "888800010015" },
			expect.arrayContaining([expect.objectContaining({ configId: "CFG_WATER_001" })]),
		],
		[
			"/app/meter.listMeterType",
			{},
			expect.arrayContaining([expect.objectContaining({ typeId: "2020", typeName: "水表" })]),
		],
		[
			"/app/meter.listMeterWaters",
			{ page: 1, row: 2, roomNum: "1-", communityId: "UNKNOWN_COMMUNITY" },
			expect.objectContaining({
				list: expect.arrayContaining([expect.objectContaining({ objName: expect.stringContaining("1-") })]),
				total: 20,
				page: 1,
				pageSize: 2,
			}),
		],
		[
			"/app/meter.queryPreMeterWater",
			{ objId: "ROOM_0001", meterType: "1010" },
			expect.objectContaining({
				curDegrees: 108,
				curReadingTime: expect.any(String),
			}),
		],
		[
			"/app/meter.listFloorShareReading",
			{ page: 1, row: 2, communityId: "UNKNOWN_COMMUNITY", fsmId: "FSM_0001", state: "W" },
			expect.objectContaining({
				list: expect.any(Array),
				total: 28,
				page: 1,
				pageSize: 2,
			}),
		],
		[
			"/app/meter.listFloorShareMeter",
			{ page: 1, row: 1, fsmId: "FSM_0002", communityId: "UNKNOWN_COMMUNITY" },
			expect.objectContaining({
				list: [expect.objectContaining({ fsmId: "FSM_0002" })],
				total: 1,
				page: 1,
				pageSize: 1,
			}),
		],
	])(
		"readonly meter exact endpoint is served by apps/api when fallback is disabled: %s",
		async (path, query, expectedData) => {
			process.env.PHASE7_LEGACY_APP_FALLBACK_ENABLED = "0";
			const fetchSpy = vi.spyOn(globalThis, "fetch");
			mockLegacyGetRequest(path, query);

			const response = await legacyDispatchHandler(createEvent());

			expect(fetchSpy).not.toHaveBeenCalled();
			expect(mockedSetResponseStatus).not.toHaveBeenCalled();
			expect(response).toMatchObject({
				code: 0,
				msg: "查询成功",
				data: expectedData,
			});
		},
	);

	test("unregistered app legacy endpoint reaches fallback and returns legacy failure when fallback is unreachable", async () => {
		const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("fallback unavailable"));
		mockLegacyGetRequest("/app/task815.unregisteredFallbackProbe");

		const response = await legacyDispatchHandler(createEvent());

		expect(fetchSpy).toHaveBeenCalledTimes(1);
		expect(String(fetchSpy.mock.calls[0]?.[0])).toBe("http://127.0.0.1:9/app/task815.unregisteredFallbackProbe");
		expect(mockedSetResponseStatus).toHaveBeenCalledWith(expect.any(Object), 404);
		expect(response).toMatchObject({
			code: 404,
			msg: "Endpoint not found: GET /app/task815.unregisteredFallbackProbe",
			data: null,
			errorCode: "ENDPOINT_NOT_FOUND",
		});
	});
});

function mockLegacyGetRequest(path: string, query: Record<string, unknown> = {}) {
	mockedGetMethod.mockReturnValue("GET");
	mockedGetQuery.mockReturnValue(query);
	mockedGetRequestURL.mockReturnValue(new URL(`http://apps-api.test${path}`));
}

function mockLegacyPostRequest(path: string, body: Record<string, unknown> = {}, query: Record<string, unknown> = {}) {
	mockedGetMethod.mockReturnValue("POST");
	mockedGetQuery.mockReturnValue(query);
	mockedGetRequestURL.mockReturnValue(new URL(`http://apps-api.test${path}`));
	mockedReadBody.mockResolvedValue(body);
}

function createEvent() {
	return {
		req: {
			headers: new Headers({ "x-request-id": "fallback-drill-request" }),
		},
		res: {
			headers: new Headers(),
		},
		context: {},
	} as any;
}

function restoreOptionalEnv(name: string, value: string | undefined) {
	if (value === undefined) {
		delete process.env[name];
		return;
	}
	process.env[name] = value;
}
