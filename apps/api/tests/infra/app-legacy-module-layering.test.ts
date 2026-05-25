import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

import { runtimeEndpointDefinitions, runtimeEndpointManifest } from "../../server/shared/runtime/runtime-endpoints";

const moduleRoot = fileURLToPath(new URL("../../server/modules/", import.meta.url));
const sharedRuntimeRoot = fileURLToPath(new URL("../../server/shared/runtime/", import.meta.url));

interface AppLegacyModuleFixture {
	name: string;
	runtimeName: string;
	definitionsName: string;
	ownerModule: string;
	phase: string;
	cutoverStatus: string;
	readonly: boolean;
	endpoints: readonly string[];
	notCovered: readonly string[];
	methodByUrl?: Record<string, string>;
	phaseByUrl?: Record<string, string>;
	cutoverStatusByUrl?: Record<string, string>;
}

const appLegacyModules: readonly AppLegacyModuleFixture[] = [
	{
		name: "activity",
		runtimeName: "Activity",
		definitionsName: "activityLegacyEndpointDefinitions",
		ownerModule: "activity",
		phase: "phase7-activity-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: ["/app/activities.listActivitiess"],
		notCovered: [
			"/app/activities.saveActivities",
			"/app/activities.updateActivities",
			"/app/activities.deleteActivities",
			"/app/activities.increaseView",
			"/app/activities.likeActivity",
			"/app/activities.updateStatus",
			"/app/activities.updateLike",
			"/app/activities.updateCollect",
		],
	},
	{
		name: "appointment",
		runtimeName: "Appointment",
		definitionsName: "appointmentLegacyEndpointDefinitions",
		ownerModule: "appointment",
		phase: "phase7-appointment-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/communitySpace.listCommunitySpaceConfirmOrder",
			"/app/communitySpace.saveCommunitySpaceConfirmOrder",
		],
		methodByUrl: {
			"/app/communitySpace.saveCommunitySpaceConfirmOrder": `method: "POST"`,
		},
		cutoverStatusByUrl: {
			"/app/communitySpace.saveCommunitySpaceConfirmOrder": "blocked-for-execution",
		},
		phaseByUrl: {
			"/app/communitySpace.saveCommunitySpaceConfirmOrder": "phase7-appointment-guarded-write",
		},
		notCovered: ["db-backed-appointment-data", "appointment-confirm-write-read-back-rollback"],
	},
	{
		name: "complaint",
		runtimeName: "Complaint",
		definitionsName: "complaintLegacyEndpointDefinitions",
		ownerModule: "complaint",
		phase: "phase7-complaint-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/auditUser.listAuditComplaints",
			"/app/auditUser.listAuditHistoryComplaints",
			"/app/complaint.listComplaintEvent",
			"/app/complaintAppraise.listComplaintAppraise",
			"/app/complaint",
			"/app/complaint.auditComplaint",
			"/app/complaintAppraise.replyComplaintAppraise",
		],
		methodByUrl: {
			"/app/complaint": `method: "POST"`,
			"/app/complaint.auditComplaint": `method: "POST"`,
			"/app/complaintAppraise.replyComplaintAppraise": `method: "POST"`,
		},
		phaseByUrl: {
			"/app/complaint": "phase7-complaint-guarded-write",
			"/app/complaint.auditComplaint": "phase7-complaint-guarded-write",
			"/app/complaintAppraise.replyComplaintAppraise": "phase7-complaint-guarded-write",
		},
		cutoverStatusByUrl: {
			"/app/complaint": "blocked-for-execution",
			"/app/complaint.auditComplaint": "blocked-for-execution",
			"/app/complaintAppraise.replyComplaintAppraise": "blocked-for-execution",
		},
		notCovered: ["db-backed-complaint-data", "complaint-write-read-back-rollback"],
	},
	{
		name: "contact",
		runtimeName: "Contact",
		definitionsName: "contactLegacyEndpointDefinitions",
		ownerModule: "contact",
		phase: "phase7-contact-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/contact.listContacts",
			"/app/contact.getContactDetail",
			"/app/contact.getContactsByDepartment",
			"/app/contact.searchContacts",
			"/app/contact.getDepartments",
			"/app/contact.getFavoriteContacts",
			"/app/contact.getEmergencyContacts",
			"/app/contact.updateOnlineStatus",
		],
		methodByUrl: {
			"/app/contact.updateOnlineStatus": `method: "POST"`,
		},
		phaseByUrl: {
			"/app/contact.updateOnlineStatus": "phase7-contact-guarded-write",
		},
		cutoverStatusByUrl: {
			"/app/contact.updateOnlineStatus": "blocked-for-execution",
		},
		notCovered: [
			"db-backed-contact-data",
			"contact-update-online-status-read-back-rollback",
			"natural-app-h5-contact-page-network",
		],
	},
	{
		name: "room-unit",
		runtimeName: "RoomUnit",
		definitionsName: "roomUnitLegacyEndpointDefinitions",
		ownerModule: "room-unit",
		phase: "phase7-room-unit-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/room.queryRooms",
			"/app/room.queryRoomDetail",
			"/app/unit.queryUnits",
			"/app/unit.queryUnitDetail",
		],
		notCovered: ["db-backed-room-unit-data", "real-room-unit-primary-keys", "shadow-off-fallback"],
	},
	{
		name: "owner",
		runtimeName: "Owner",
		definitionsName: "ownerLegacyEndpointDefinitions",
		ownerModule: "owner",
		phase: "phase7-owner-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/owner.queryOwnerAndMembers",
			"/app/owner.saveRoomOwner",
			"/app/owner.editOwner",
			"/app/owner.deleteOwner",
		],
		methodByUrl: {
			"/app/owner.saveRoomOwner": `method: "POST"`,
			"/app/owner.editOwner": `method: "POST"`,
			"/app/owner.deleteOwner": `method: "POST"`,
		},
		phaseByUrl: {
			"/app/owner.saveRoomOwner": "phase7-owner-guarded-write",
			"/app/owner.editOwner": "phase7-owner-guarded-write",
			"/app/owner.deleteOwner": "phase7-owner-guarded-write",
		},
		cutoverStatusByUrl: {
			"/app/owner.saveRoomOwner": "blocked-for-execution",
			"/app/owner.editOwner": "blocked-for-execution",
			"/app/owner.deleteOwner": "blocked-for-execution",
		},
		notCovered: [
			"db-backed-owner-data",
			"owner-write-read-back-rollback",
			"production-app-h5-owner-network",
			"/app/owner.queryOwnerCars",
		],
	},
	{
		name: "profile",
		runtimeName: "Profile",
		definitionsName: "profileLegacyEndpointDefinitions",
		ownerModule: "profile",
		phase: "phase7-profile-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: ["/app/profile.getUserProfile", "/app/profile.listCommunities", "/app/profile.listAttendanceRecords"],
		notCovered: ["/app/profile.changeCommunity", "/app/profile.changePassword"],
	},
	{
		name: "purchase",
		runtimeName: "Purchase",
		definitionsName: "purchaseLegacyEndpointDefinitions",
		ownerModule: "purchase",
		phase: "phase7-purchase-guarded-write",
		cutoverStatus: "blocked-for-execution",
		readonly: false,
		endpoints: ["/app/purchase/updatePurchaseApply"],
		notCovered: [],
	},
	{
		name: "video",
		runtimeName: "Video",
		definitionsName: "videoLegacyEndpointDefinitions",
		ownerModule: "video",
		phase: "phase7-video-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: ["/app/video.listMonitorArea", "/app/video.listStaffMonitorMachine", "/app/video.getPlayVideoUrl"],
		notCovered: ["real-camera-platform", "db-backed-video-data", "video-stream-control"],
	},
	{
		name: "visit",
		runtimeName: "Visit",
		definitionsName: "visitLegacyEndpointDefinitions",
		ownerModule: "visit",
		phase: "phase7-visit-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: ["/app/visit.getVisit", "/app/visit.getVisitDetail"],
		notCovered: ["/app/visit.auditVisit"],
	},
	{
		name: "work-order",
		runtimeName: "WorkOrder",
		definitionsName: "workOrderLegacyEndpointDefinitions",
		ownerModule: "work-order",
		phase: "phase7-work-order-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/workorder/todo/list",
			"/app/workorder/detail",
			"/app/workorder/copy/list",
			"/app/workorder/task/list",
			"/app/workorder/task/items",
		],
		notCovered: [
			"/app/workorder/create",
			"/app/workorder/update",
			"/app/workorder/start",
			"/app/workorder/complete",
			"/app/workorder/audit",
			"/app/workorder/cancel",
			"/app/workorder/copy/finish",
		],
	},
] as const;

const requiredFiles = [
	"types.ts",
	"repository.ts",
	"service.ts",
	"runtime.ts",
	"legacy-adapter.ts",
	"legacy-endpoints.ts",
	"index.ts",
] as const;

describe("app legacy module layering", () => {
	test.each(appLegacyModules)("%s has the same module files as migrated app legacy modules", ({ name }) => {
		for (const file of requiredFiles) {
			expect(existsSync(join(moduleRoot, name, file)), `${name}/${file} should exist`).toBe(true);
		}
	});

	test.each(appLegacyModules)("%s endpoint handlers resolve adapters through runtime", ({ name, runtimeName }) => {
		const endpointSource = readFileSync(join(moduleRoot, name, "legacy-endpoints.ts"), "utf8");

		expect(endpointSource).toContain(`get${runtimeName}Runtime(event).legacyAdapter`);
		expect(endpointSource).not.toMatch(/const\s+legacyAdapter\s*=\s*createLegacy/);
		expect(endpointSource).not.toMatch(/from\s+["']\.\/legacy-adapter["']/);
		expect(endpointSource).not.toMatch(/from\s+["']\.\/service["']/);
		expect(endpointSource).not.toMatch(/from\s+["']\.\/repository["']/);
	});

	test.each(appLegacyModules)("%s endpoint definitions keep registration and input merge shape", (module) => {
		const endpointSource = readFileSync(join(moduleRoot, module.name, "legacy-endpoints.ts"), "utf8");
		const inputHelperSource = readFileSync(join(sharedRuntimeRoot, "legacy-endpoint-input.ts"), "utf8");

		expect(endpointSource).toContain(`export const ${module.definitionsName}: EndpointDefinition[] = [`);
		expect(endpointSource).toContain('import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";');
		for (const url of module.endpoints) {
			const expectedMethod =
				module.methodByUrl?.[url] ?? (module.readonly ? `method: ["GET", "POST"]` : `method: "POST"`);
			expect(endpointSource).toContain(`url: "${url}"`);
			expect(endpointSource).toContain(expectedMethod);
		}
		expect(
			endpointSource.match(/method:/g),
			`${module.name} should declare one method field per endpoint`,
		).toHaveLength(module.endpoints.length);
		expect(endpointSource.match(/mergeInput\(query, body\)/g)).toHaveLength(module.endpoints.length);
		expect(inputHelperSource).toContain(
			"export function mergeInput(query: unknown, body: unknown): Record<string, unknown>",
		);
		expect(inputHelperSource).toContain("...asRecord(query)");
		expect(inputHelperSource).toContain("...asRecord(body)");
		expect(inputHelperSource).toContain("export function asRecord(value: unknown): Record<string, unknown>");
		expect(inputHelperSource).toContain("Array.isArray(value)");
	});

	test.each(appLegacyModules)(
		"%s runtime wires repository, service, and legacy adapter once",
		({ name, runtimeName }) => {
			const runtimeSource = readFileSync(join(moduleRoot, name, "runtime.ts"), "utf8");

			expect(runtimeSource).toContain(`import { createLegacy${runtimeName}Adapter } from "./legacy-adapter";`);
			expect(runtimeSource).toContain(`export interface ${runtimeName}Runtime`);
			expect(runtimeSource).toContain(`repository: ${runtimeName}Repository;`);
			expect(runtimeSource).toContain(`service: ${runtimeName}Service;`);
			expect(runtimeSource).toContain(`legacyAdapter: ReturnType<typeof createLegacy${runtimeName}Adapter>;`);
			expect(runtimeSource).toContain(
				`const fallbackRuntime = create${runtimeName}Runtime(create${runtimeName}Repository());`,
			);
			expect(runtimeSource).toContain(
				`export function get${runtimeName}Runtime(_event?: H3Event): ${runtimeName}Runtime`,
			);
			expect(runtimeSource).toContain(`legacyAdapter: createLegacy${runtimeName}Adapter(service)`);
		},
	);

	test.each(appLegacyModules)("%s legacy adapter receives service injection", ({ name, runtimeName }) => {
		const adapterSource = readFileSync(join(moduleRoot, name, "legacy-adapter.ts"), "utf8");

		expect(adapterSource).toContain(`import type { ${runtimeName}Service } from "./service";`);
		expect(adapterSource).toContain(`createLegacy${runtimeName}Adapter(service: ${runtimeName}Service)`);
	});

	test.each(appLegacyModules)(
		"%s runtime definitions and manifest match the app legacy contract",
		({ ownerModule, phase, cutoverStatus, readonly, endpoints, methodByUrl, phaseByUrl, cutoverStatusByUrl }) => {
			for (const url of endpoints) {
				const definition = runtimeEndpointDefinitions.find((item) => item.url === url);
				const manifest = runtimeEndpointManifest.find((item) => item.url === url && item.ownerModule === ownerModule);
				const expectedMethod = methodByUrl?.[url] === `method: "POST"` ? "POST" : readonly ? ["GET", "POST"] : "POST";

				expect(definition, `${url} should be registered in runtimeEndpointDefinitions`).toMatchObject({
					url,
					method: expectedMethod,
					handler: expect.any(Function),
				});
				expect(manifest, `${url} should be registered in runtimeEndpointManifest`).toMatchObject({
					url,
					method: expectedMethod,
					phase: phaseByUrl?.[url] ?? phase,
					ownerModule,
					targetClient: "app",
					routeKind: "app-legacy",
					responseContract: "{ code, msg, data }",
					cutoverStatus: cutoverStatusByUrl?.[url] ?? cutoverStatus,
				});
			}
		},
	);

	test.each(appLegacyModules)(
		"%s does not register endpoints outside the readonly or guarded scope",
		({ ownerModule, endpoints, notCovered }) => {
			const registeredUrls = runtimeEndpointManifest
				.filter((item) => item.targetClient === "app" && item.ownerModule === ownerModule)
				.map((item) => item.url)
				.sort();

			expect(registeredUrls).toEqual([...endpoints].sort());
			for (const url of notCovered) {
				expect(runtimeEndpointManifest.some((item) => item.url === url)).toBe(false);
			}
		},
	);
});

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
