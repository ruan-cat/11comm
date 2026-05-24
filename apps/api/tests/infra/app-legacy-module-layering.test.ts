import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

import { runtimeEndpointDefinitions, runtimeEndpointManifest } from "../../server/shared/runtime/runtime-endpoints";

const moduleRoot = fileURLToPath(new URL("../../server/modules/", import.meta.url));
const sharedRuntimeRoot = fileURLToPath(new URL("../../server/shared/runtime/", import.meta.url));

const appLegacyModules = [
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
		const expectedMethod = module.readonly ? `method: ["GET", "POST"]` : `method: "POST"`;

		expect(endpointSource).toContain(`export const ${module.definitionsName}: EndpointDefinition[] = [`);
		expect(endpointSource).toContain('import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";');
		for (const url of module.endpoints) {
			expect(endpointSource).toContain(`url: "${url}"`);
		}
		expect(
			endpointSource.match(/method:/g),
			`${module.name} should declare one method field per endpoint`,
		).toHaveLength(module.endpoints.length);
		expect(endpointSource.match(new RegExp(escapeRegExp(expectedMethod), "g"))).toHaveLength(module.endpoints.length);
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
		({ ownerModule, phase, cutoverStatus, readonly, endpoints }) => {
			for (const url of endpoints) {
				const definition = runtimeEndpointDefinitions.find((item) => item.url === url);
				const manifest = runtimeEndpointManifest.find((item) => item.url === url && item.ownerModule === ownerModule);

				expect(definition, `${url} should be registered in runtimeEndpointDefinitions`).toMatchObject({
					url,
					method: readonly ? ["GET", "POST"] : "POST",
					handler: expect.any(Function),
				});
				expect(manifest, `${url} should be registered in runtimeEndpointManifest`).toMatchObject({
					url,
					method: readonly ? ["GET", "POST"] : "POST",
					phase,
					ownerModule,
					targetClient: "app",
					routeKind: "app-legacy",
					responseContract: "{ code, msg, data }",
					cutoverStatus,
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
