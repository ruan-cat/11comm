import { test, describe } from "vitest";
import { expect } from "vitest";

import { runtimeEndpointManifest } from "../../server/shared/runtime/runtime-endpoints";
import endpointsHandler from "../../server/routes/__nitro/endpoints.get";

const operationTeamAdminListEndpoints = [
	"/api/operation-team/data-manage/community-information/list",
	"/api/operation-team/data-manage/property-company/list",
	"/api/operation-team/data-manage/property-management-company/list",
	"/api/operation-team/system-manage/change-password/list",
	"/api/operation-team/system-manage/system-config/list",
	"/api/operation-team/system-manage/register-protocol/list",
	"/api/operation-team/system-manage/community-configuration/list",
	"/api/operation-team/system-manage/initialize-cell/list",
	"/api/operation-team/merchant-manage/merchant-info/list",
	"/api/operation-team/merchant-manage/merchant-admin/list",
	"/api/operation-team/report-configuration/report-info/list",
	"/api/operation-team/report-configuration/report-group/list",
	"/api/operation-team/report-configuration/report-component/list",
] as const;

const expenseManageAdminListEndpoints = [
	"/api/property-manage/expense-manage/cancel-fee/list",
	"/api/property-manage/expense-manage/contracte-charge/list",
	"/api/property-manage/expense-manage/discount-apply/list",
	"/api/property-manage/expense-manage/discount-setting/list",
	"/api/property-manage/expense-manage/discount-type/list",
	"/api/property-manage/expense-manage/expense-summary-table/list",
	"/api/property-manage/expense-manage/meter-reading-type/list",
	"/api/property-manage/expense-manage/overdue-payment-information/list",
	"/api/property-manage/expense-manage/payment-review/list",
	"/api/property-manage/expense-manage/refund-review/list",
	"/api/property-manage/expense-manage/reminder-for-overdue-payments/list",
	"/api/property-manage/expense-manage/reprint-voucher/list",
	"/api/property-manage/expense-manage/vehicle-charge/list",
	"/api/property-manage/expense-manage/water-and-electricity-meter-reading/list",
] as const;

const reportManageAdminListEndpoints = [
	"/api/property-manage/report-manage/arrears-details-list/list",
	"/api/property-manage/report-manage/data-statistics/list",
	"/api/property-manage/report-manage/deposit-report/list",
	"/api/property-manage/report-manage/expense-summary-table/list",
	"/api/property-manage/report-manage/fee-reminder/list",
	"/api/property-manage/report-manage/no-charge-house/list",
	"/api/property-manage/report-manage/outstanding-fees-analysis/list",
	"/api/property-manage/report-manage/owner-payment-details/list",
	"/api/property-manage/report-manage/patrol-report/list",
	"/api/property-manage/report-manage/repair-report-form/list",
	"/api/property-manage/report-manage/repair-reports-summary-table/list",
	"/api/property-manage/report-manage/statement-expenses/list",
] as const;

const patrolAdminListEndpoints = [
	"/api/property-manage/patrol-manage/detail/list",
	"/api/property-manage/patrol-manage/item/list",
	"/api/property-manage/patrol-manage/path/list",
	"/api/property-manage/patrol-manage/plan/list",
	"/api/property-manage/patrol-manage/point/list",
	"/api/property-manage/patrol-manage/task/list",
] as const;

const parkingAdminListEndpoints = [
	"/api/property-manage/parking-manage/carport-apply/list",
	"/api/property-manage/parking-manage/carport-info/list",
	"/api/property-manage/parking-manage/owner-vehicle/list",
	"/api/property-manage/parking-manage/parking-lot/list",
] as const;

const communityManageAdminListEndpoints = [
	"/api/property-manage/community-manage/building-space-structure-diagram/list",
	"/api/property-manage/community-manage/handing-business/list",
	"/api/property-manage/community-manage/house-decoration/list",
	"/api/property-manage/community-manage/my/list",
	"/api/property-manage/community-manage/notice/list",
	"/api/property-manage/community-manage/parking-space-structure-diagram/list",
	"/api/property-manage/community-manage/property-register/list",
] as const;

const housePropertyManageAdminListEndpoints = [
	"/api/property-manage/house-property-manage/house/list",
	"/api/property-manage/house-property-manage/invoice/list",
	"/api/property-manage/house-property-manage/invoice-title/list",
	"/api/property-manage/house-property-manage/owner-account/list",
	"/api/property-manage/house-property-manage/owner-information/list",
	"/api/property-manage/house-property-manage/owner-member/list",
	"/api/property-manage/house-property-manage/owners-committee/list",
	"/api/property-manage/house-property-manage/reserve-venue/list",
	"/api/property-manage/house-property-manage/reserve-venue-order/list",
	"/api/property-manage/house-property-manage/site-management/list",
] as const;

describe("phase7 endpoint manifest", () => {
	test("contains migrated app legacy slices without widening unrelated modules", () => {
		const urls = runtimeEndpointManifest.map((item) => item.url);

		expect(urls).toContain("/app/fee.listFee");
		expect(urls).toContain("/app/payment.nativeQrcodePayment");
		expect(urls).toContain("/app/reportFeeMonthStatistics.queryReportFeeSummary");
		expect(urls).toContain("/app/ownerRepair.listOwnerRepairs");
		expect(urls).toContain("/app/ownerRepair.queryOwnerRepair");
		expect(urls).toContain("/app/ownerRepair.saveOwnerRepair");
		expect(urls).toContain("/app/repairSetting.listRepairSettings");
		expect(urls).toContain("/app/dict.queryRepairStates");
		expect(urls).toContain("/callComponent/core/list");
		expect(urls).toContain("/callComponent/ownerRepair.appraiseRepair");
		expect(urls).toContain("/app/floor.queryFloors");
		expect(urls).toContain("/app/floor.queryFloorDetail");
		for (const url of expenseManageAdminListEndpoints) {
			expect(urls).toContain(url);
		}
		for (const url of reportManageAdminListEndpoints) {
			expect(urls).toContain(url);
		}
		for (const url of operationTeamAdminListEndpoints) {
			expect(urls).toContain(url);
		}
		for (const url of patrolAdminListEndpoints) {
			expect(urls).toContain(url);
		}
		for (const url of parkingAdminListEndpoints) {
			expect(urls).toContain(url);
		}
		for (const url of communityManageAdminListEndpoints) {
			expect(urls).toContain(url);
		}
		for (const url of housePropertyManageAdminListEndpoints) {
			expect(urls).toContain(url);
		}
		expect(urls).not.toContain("/app/ownerRepair.repairDispatch");
		expect(urls).not.toContain("/app/ownerRepair.listStaffRepairs");
		expect(urls).not.toContain("/app/resourceStore.listResourceStores");
		expect(urls).not.toContain("/app/resourceStore.listResources");
		expect(urls).not.toContain("/app/owner.queryOwnerCars");
		expect(urls).not.toContain("/app/machine/listMachineRecords");
	});

	test("exposes readonly endpoint manifest without database configuration", async () => {
		const response = await endpointsHandler({ context: {}, res: { headers: new Headers() } } as any);

		expect(response).toMatchObject({
			success: true,
			service: "@01s-11comm/api",
			phase: "phase3-infra",
			data: expect.arrayContaining([
				expect.objectContaining({
					url: "/app/fee.listFee",
					ownerModule: "fee",
					phase: "phase2-fee-payment-report",
				}),
				expect.objectContaining({
					url: "/app/ownerRepair.listOwnerRepairs",
					ownerModule: "repair",
					phase: "phase4a-repair-minimal",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/ownerRepair.queryOwnerRepair",
					ownerModule: "repair",
					phase: "phase4a-repair-minimal",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/repairSetting.listRepairSettings",
					ownerModule: "repair",
					phase: "phase4a-repair-minimal",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/dict.queryRepairStates",
					ownerModule: "repair",
					phase: "phase4a-repair-minimal",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/ownerRepair.saveOwnerRepair",
					ownerModule: "repair",
					phase: "phase4a-repair-minimal",
					cutoverStatus: "blocked-for-execution",
				}),
				expect.objectContaining({
					url: "/app/floor.queryFloors",
					method: ["GET", "POST"],
					ownerModule: "floor",
					phase: "phase7-batch2-floor",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/floor.queryFloorDetail",
					method: ["GET", "POST"],
					ownerModule: "floor",
					phase: "phase7-batch2-floor",
					cutoverStatus: "app-shadow-allowlist",
				}),
				...expenseManageAdminListEndpoints.map((url) =>
					expect.objectContaining({
						url,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "fee",
						phase: "phase7-expense-manage-admin-list",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				...reportManageAdminListEndpoints.map((url) =>
					expect.objectContaining({
						url,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "fee-report",
						phase: "phase7-report-manage-admin-list",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				expect.objectContaining({
					url: "/api/property-manage/repairs-manage/repairs-have-done/list",
					targetClient: "admin",
					routeKind: "admin-canonical",
					ownerModule: "repair",
					phase: "phase4a-repair-minimal",
				}),
				expect.objectContaining({
					url: "/api/property-manage/repairs-manage/return-visit/list",
					targetClient: "admin",
					routeKind: "admin-canonical",
					ownerModule: "repair",
					phase: "phase4a-repair-minimal",
				}),
				expect.objectContaining({
					url: "/api/property-manage/repairs-manage/phone-report-repairs/list",
					targetClient: "admin",
					routeKind: "admin-canonical",
					ownerModule: "repair",
					phase: "phase4a-repair-minimal",
				}),
				expect.objectContaining({
					url: "/api/property-manage/repairs-manage/mandatory-return-issue/list",
					targetClient: "admin",
					routeKind: "admin-canonical",
					ownerModule: "repair",
					phase: "phase4a-repair-minimal",
				}),
				...operationTeamAdminListEndpoints.map((url) =>
					expect.objectContaining({
						url,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "operation",
						phase: "phase7-operation-team-admin-list",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				...patrolAdminListEndpoints.map((url) =>
					expect.objectContaining({
						url,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "patrol",
						phase: "phase7-patrol-parking-admin-list",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				...parkingAdminListEndpoints.map((url) =>
					expect.objectContaining({
						url,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "parking",
						phase: "phase7-patrol-parking-admin-list",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				...communityManageAdminListEndpoints.map((url) =>
					expect.objectContaining({
						url,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "community",
						phase: "phase7-community-manage-admin-list",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				...housePropertyManageAdminListEndpoints.map((url) =>
					expect.objectContaining({
						url,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "house-property",
						phase: "phase7-house-property-manage-admin-list",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
			]),
		});
	});
});
