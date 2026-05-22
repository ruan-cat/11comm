import { describe, expect, test } from "vitest";

import { createAdminContractAdapter } from "../../server/modules/contract/admin-adapter";
import { createInMemoryContractRepository } from "../../server/modules/contract/repository";
import { createContractService } from "../../server/modules/contract/service";
import { createAdminFeeAdapter } from "../../server/modules/fee/admin-adapter";
import { createInMemoryFeeRepository } from "../../server/modules/fee/repository";
import { createFeeService } from "../../server/modules/fee/service";
import { createEndpointRegistry, dispatchEndpoint } from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions, runtimeEndpointManifest } from "../../server/shared/runtime/runtime-endpoints";

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

const contractManageCoveredAdminListEndpoints = [
	"/api/property-manage/contract-manage/archive/list",
	"/api/property-manage/contract-manage/attachment/list",
	"/api/property-manage/contract-manage/clause/list",
	"/api/property-manage/contract-manage/change/list",
	"/api/property-manage/contract-manage/draft-contract/list",
	"/api/property-manage/contract-manage/expire/list",
	"/api/property-manage/contract-manage/first-party/list",
	"/api/property-manage/contract-manage/print/list",
	"/api/property-manage/contract-manage/review/list",
	"/api/property-manage/contract-manage/second-party/list",
	"/api/property-manage/contract-manage/template/list",
	"/api/property-manage/contract-manage/type/list",
] as const;

const contractManageChangeCrudEndpoints = [
	{ url: "/api/property-manage/contract-manage/change/create", method: "POST" },
	{ url: "/api/property-manage/contract-manage/change/detail", method: "POST" },
	{ url: "/api/property-manage/contract-manage/change/update", method: "POST" },
	{ url: "/api/property-manage/contract-manage/change/delete", method: "POST" },
] as const;

const contractManageDraftContractCrudEndpoints = [
	{ url: "/api/property-manage/contract-manage/draft-contract/create", method: "POST" },
	{ url: "/api/property-manage/contract-manage/draft-contract/detail", method: "POST" },
	{ url: "/api/property-manage/contract-manage/draft-contract/update", method: "POST" },
	{ url: "/api/property-manage/contract-manage/draft-contract/delete", method: "POST" },
] as const;

const devConfigManageCenterEndpoints = [
	{ url: "/api/dev-team/config-manage/center/list", method: "POST" },
	{ url: "/api/dev-team/config-manage/center/create", method: "POST" },
	{ url: "/api/dev-team/config-manage/center/detail", method: "GET" },
	{ url: "/api/dev-team/config-manage/center/update", method: "POST" },
	{ url: "/api/dev-team/config-manage/center/delete", method: "POST" },
] as const;

const devConfigManageDictionaryEndpoints = [
	{ url: "/api/dev-team/config-manage/dictionary/list", method: "POST" },
	{ url: "/api/dev-team/config-manage/dictionary/create", method: "POST" },
	{ url: "/api/dev-team/config-manage/dictionary/detail", method: "GET" },
	{ url: "/api/dev-team/config-manage/dictionary/update", method: "POST" },
	{ url: "/api/dev-team/config-manage/dictionary/delete", method: "POST" },
] as const;

const devConfigManageItemEndpoints = [
	{ url: "/api/dev-team/config-manage/item/list", method: "POST" },
	{ url: "/api/dev-team/config-manage/item/create", method: "POST" },
	{ url: "/api/dev-team/config-manage/item/detail", method: "GET" },
	{ url: "/api/dev-team/config-manage/item/update", method: "POST" },
	{ url: "/api/dev-team/config-manage/item/delete", method: "POST" },
] as const;

const devConfigManageTypeEndpoints = [
	{ url: "/api/dev-team/config-manage/type/list", method: "POST" },
	{ url: "/api/dev-team/config-manage/type/create", method: "POST" },
	{ url: "/api/dev-team/config-manage/type/detail", method: "GET" },
	{ url: "/api/dev-team/config-manage/type/update", method: "POST" },
	{ url: "/api/dev-team/config-manage/type/delete", method: "POST" },
] as const;

const settingSystemChangePasswordEndpoints = [
	{ url: "/api/setting-manage/system-manage/change-password/list", method: "POST" },
	{ url: "/api/setting-manage/system-manage/change-password/create", method: "POST" },
	{ url: "/api/setting-manage/system-manage/change-password/update", method: "POST" },
	{ url: "/api/setting-manage/system-manage/change-password/delete", method: "POST" },
] as const;

const settingSystemConfigEndpoints = [
	{ url: "/api/setting-manage/system-manage/system-config/list", method: "POST" },
	{ url: "/api/setting-manage/system-manage/system-config/create", method: "POST" },
	{ url: "/api/setting-manage/system-manage/system-config/update", method: "POST" },
	{ url: "/api/setting-manage/system-manage/system-config/delete", method: "POST" },
] as const;

const settingSystemCommunityConfigurationEndpoints = [
	{ url: "/api/setting-manage/system-manage/community-configuration/list", method: "POST" },
	{ url: "/api/setting-manage/system-manage/community-configuration/create", method: "POST" },
	{ url: "/api/setting-manage/system-manage/community-configuration/update", method: "POST" },
	{ url: "/api/setting-manage/system-manage/community-configuration/delete", method: "POST" },
] as const;

const settingSystemInitializeCellEndpoints = [
	{ url: "/api/setting-manage/system-manage/initialize-cell/list", method: "POST" },
	{ url: "/api/setting-manage/system-manage/initialize-cell/create", method: "POST" },
	{ url: "/api/setting-manage/system-manage/initialize-cell/update", method: "POST" },
	{ url: "/api/setting-manage/system-manage/initialize-cell/delete", method: "POST" },
] as const;

const settingSystemRegisterProtocolEndpoints = [
	{ url: "/api/setting-manage/system-manage/register-protocol/list", method: "POST" },
	{ url: "/api/setting-manage/system-manage/register-protocol/create", method: "POST" },
	{ url: "/api/setting-manage/system-manage/register-protocol/update", method: "POST" },
	{ url: "/api/setting-manage/system-manage/register-protocol/delete", method: "POST" },
] as const;

const settingOrganizeEdgeEndpoints = [
	{ url: "/api/setting-manage/organize-manage/org-info/tree", method: "POST" },
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

describe("phase7 apps-api dual client contracts", () => {
	test("endpoint manifest declares first admin canonical and app legacy contracts", () => {
		expectManifestEntry("/api/property-manage/expense-manage/house-charge/list", {
			targetClient: "admin",
			routeKind: "admin-canonical",
			responseContract: "JsonVO",
			cutoverStatus: "cut-to-apps-api",
		});
		expectManifestEntry("/api/property-manage/expense-manage/expense-item-setting/list", {
			targetClient: "admin",
			routeKind: "admin-canonical",
			responseContract: "JsonVO",
			cutoverStatus: "cut-to-apps-api",
		});
		expectManifestEntry("/api/property-manage/report-manage/payment-details-form/list", {
			targetClient: "admin",
			routeKind: "admin-canonical",
			responseContract: "JsonVO",
			ownerModule: "fee",
			phase: "phase2-fee-payment-report",
			cutoverStatus: "available-in-apps-api-not-caller-verified",
		});
		for (const url of expenseManageAdminListEndpoints) {
			expectManifestEntry(url, {
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "fee",
				phase: "phase7-expense-manage-admin-list",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const url of reportManageAdminListEndpoints) {
			expectManifestEntry(url, {
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "fee-report",
				phase: "phase7-report-manage-admin-list",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const url of contractManageCoveredAdminListEndpoints) {
			expectManifestEntry(url, {
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "contract",
				phase: "phase7-contract-manage-admin-list",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const endpoint of [...contractManageChangeCrudEndpoints, ...contractManageDraftContractCrudEndpoints]) {
			expectManifestEntry(endpoint.url, {
				method: endpoint.method,
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "contract",
				phase: "phase7-contract-manage-admin-crud",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const endpoint of devConfigManageCenterEndpoints) {
			expectManifestEntry(endpoint.url, {
				method: endpoint.method,
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "dev",
				phase: "phase7-dev-config-manage-admin-crud",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const endpoint of devConfigManageDictionaryEndpoints) {
			expectManifestEntry(endpoint.url, {
				method: endpoint.method,
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "dev",
				phase: "phase7-dev-config-manage-admin-crud",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const endpoint of devConfigManageItemEndpoints) {
			expectManifestEntry(endpoint.url, {
				method: endpoint.method,
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "dev",
				phase: "phase7-dev-config-manage-admin-crud",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const endpoint of devConfigManageTypeEndpoints) {
			expectManifestEntry(endpoint.url, {
				method: endpoint.method,
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "dev",
				phase: "phase7-dev-config-manage-admin-crud",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const endpoint of settingSystemChangePasswordEndpoints) {
			expectManifestEntry(endpoint.url, {
				method: endpoint.method,
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "setting",
				phase: "phase7-setting-system-manage-admin-crud",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const endpoint of settingSystemConfigEndpoints) {
			expectManifestEntry(endpoint.url, {
				method: endpoint.method,
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "setting",
				phase: "phase7-setting-system-manage-admin-crud",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const endpoint of settingSystemCommunityConfigurationEndpoints) {
			expectManifestEntry(endpoint.url, {
				method: endpoint.method,
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "setting",
				phase: "phase7-setting-system-manage-admin-crud",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const endpoint of settingSystemInitializeCellEndpoints) {
			expectManifestEntry(endpoint.url, {
				method: endpoint.method,
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "setting",
				phase: "phase7-setting-system-manage-admin-crud",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const endpoint of settingSystemRegisterProtocolEndpoints) {
			expectManifestEntry(endpoint.url, {
				method: endpoint.method,
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "setting",
				phase: "phase7-setting-system-manage-admin-crud",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const endpoint of settingOrganizeEdgeEndpoints) {
			expectManifestEntry(endpoint.url, {
				method: endpoint.method,
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "setting",
				phase: "phase7-setting-organize-manage-admin-edge",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const url of [
			"/api/property-manage/repairs-manage/repairs-todo/list",
			"/api/property-manage/repairs-manage/repairs-setting/list",
			"/api/property-manage/repairs-manage/issues/list",
			"/api/property-manage/repairs-manage/repairs-have-done/list",
			"/api/property-manage/repairs-manage/return-visit/list",
			"/api/property-manage/repairs-manage/phone-report-repairs/list",
			"/api/property-manage/repairs-manage/mandatory-return-issue/list",
		]) {
			expectManifestEntry(url, {
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "repair",
				phase: "phase4a-repair-minimal",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const url of operationTeamAdminListEndpoints) {
			expectManifestEntry(url, {
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "operation",
				phase: "phase7-operation-team-admin-list",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const url of patrolAdminListEndpoints) {
			expectManifestEntry(url, {
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "patrol",
				phase: "phase7-patrol-parking-admin-list",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const url of parkingAdminListEndpoints) {
			expectManifestEntry(url, {
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "parking",
				phase: "phase7-patrol-parking-admin-list",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const url of communityManageAdminListEndpoints) {
			expectManifestEntry(url, {
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "community",
				phase: "phase7-community-manage-admin-list",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const url of housePropertyManageAdminListEndpoints) {
			expectManifestEntry(url, {
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "house-property",
				phase: "phase7-house-property-manage-admin-list",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}

		expectManifestEntry("/app/fee.listFee", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "app-shadow-allowlist",
		});
		expectManifestEntry("/app/payment.nativeQrcodePayment", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "blocked-for-execution",
		});
		expectManifestEntry("/app/reportFeeMonthStatistics.queryReportFeeSummary", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "app-shadow-allowlist",
		});
	});

	test("admin canonical adapter returns JsonVO instead of app legacy envelope", async () => {
		const admin = createAdminFeeAdapter(createFeeService(createInMemoryFeeRepository()));

		const response = await admin.listHouseCharges({ pageIndex: 1, pageSize: 20 });

		expect(response).toMatchObject({
			success: true,
			code: 200,
			message: expect.any(String),
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
				pageIndex: 1,
				pageSize: 20,
			},
		});
		expect(response).not.toHaveProperty("msg");
	});

	test("contract-manage covered admin adapters return JsonVO instead of app legacy envelope", async () => {
		const admin = createAdminContractAdapter(createContractService(createInMemoryContractRepository()));

		for (const response of [
			await admin.listArchive({ pageIndex: 1, pageSize: 20 }),
			await admin.listAttachment({ pageIndex: 1, pageSize: 20 }),
			await admin.listClause({ pageIndex: 1, pageSize: 20 }),
			await admin.listChange({ pageIndex: 1, pageSize: 20 }),
			await admin.listDraftContract({ pageIndex: 1, pageSize: 20 }),
			await admin.listExpire({ pageIndex: 1, pageSize: 20 }),
			await admin.listFirstParty({ pageIndex: 1, pageSize: 20 }),
			await admin.listPrint({ pageIndex: 1, pageSize: 20 }),
			await admin.listReview({ pageIndex: 1, pageSize: 20 }),
			await admin.listSecondParty({ pageIndex: 1, pageSize: 20 }),
			await admin.listTemplate({ pageIndex: 1, pageSize: 20 }),
			await admin.listContractType({ pageIndex: 1, pageSize: 20 }),
		]) {
			expect(response).toMatchObject({
				success: true,
				code: 200,
				message: expect.any(String),
				data: {
					list: expect.any(Array),
					total: expect.any(Number),
					pageIndex: 1,
					pageSize: 20,
				},
			});
			expect(response).not.toHaveProperty("msg");
		}
	});

	test("contract-manage change and draft-contract CRUD adapters return JsonVO", async () => {
		const admin = createAdminContractAdapter(createContractService(createInMemoryContractRepository()));

		for (const response of [
			await admin.createChange({ contractId: "CONTRACT_001", changeType: "amount" }),
			await admin.updateChange({ id: "CHANGE_001", changeReason: "price adjusted" }),
			await admin.deleteChange({ id: "CHANGE_001" }),
			await admin.createDraftContract({ contractName: "Draft contract", contractNumber: "DRAFT_001" }),
			await admin.updateDraftContract({ id: "CONTRACT_DRAFT_001", contractName: "Draft contract v2" }),
			await admin.deleteDraftContract({ id: "CONTRACT_DRAFT_001" }),
		]) {
			expect(response).toMatchObject({
				success: true,
				code: 200,
				message: expect.any(String),
			});
			expect(response).not.toHaveProperty("msg");
		}
	});

	test("app legacy allowlist endpoint returns the old code msg data envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/fee.listFee",
			query: { page: 1, row: 5, communityId: "COMM_001" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
	});

	test("floor batch2 app legacy endpoint returns the old code msg data envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/floor.queryFloors",
			query: { page: 1, row: 5, communityId: "COMM_001" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
				page: 1,
				pageSize: 5,
				hasMore: true,
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
	});

	test("manifest marks repair readonly DB-wired endpoints as app shadow allowlisted", () => {
		expectManifestEntry("/app/ownerRepair.listOwnerRepairs", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "app-shadow-allowlist",
		});
		expectManifestEntry("/app/ownerRepair.queryOwnerRepair", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "app-shadow-allowlist",
		});
		expectManifestEntry("/app/repairSetting.listRepairSettings", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "app-shadow-allowlist",
		});
		expectManifestEntry("/app/dict.queryRepairStates", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "app-shadow-allowlist",
		});
	});

	test("manifest does not claim uncut or unavailable endpoints are cut over", () => {
		expectManifestEntry("/app/ownerRepair.saveOwnerRepair", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "blocked-for-execution",
		});
		expectManifestEntry("/callComponent/core/list", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "app-shadow-allowlist",
		});
		expectManifestEntry("/callComponent/ownerRepair.appraiseRepair", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "blocked-for-execution",
		});
		expectManifestEntry("/app/floor.queryFloors", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "app-shadow-allowlist",
		});
		expectManifestEntry("/app/floor.queryFloorDetail", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "app-shadow-allowlist",
		});

		const urls = runtimeEndpointManifest.map((item) => item.url);
		expect(urls).not.toContain("/api/property-manage/expense-manage/house-charge/create");
		expect(urls).not.toContain("/api/property-manage/expense-manage/house-charge/update");
		expect(urls).not.toContain("/api/property-manage/expense-manage/house-charge/delete");
	});

	test("manifest marks high-risk app legacy mutation actions as blocked for execution", () => {
		for (const url of [
			"/app/payment.nativeQrcodePayment",
			"/app/oweFeeCallable.writeOweFeeCallable",
			"/app/fee.saveRoomCreateFee",
			"/app/ownerRepair.saveOwnerRepair",
			"/callComponent/ownerRepair.appraiseRepair",
		]) {
			expectManifestEntry(url, {
				targetClient: "app",
				routeKind: "app-legacy",
				responseContract: "{ code, msg, data }",
				cutoverStatus: "blocked-for-execution",
			});
		}
	});
});

function expectManifestEntry(url: string, expected: Record<string, unknown>): void {
	expect(runtimeEndpointManifest).toEqual(
		expect.arrayContaining([
			expect.objectContaining({
				url,
				...expected,
			}),
		]),
	);
}
