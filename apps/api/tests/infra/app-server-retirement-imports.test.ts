import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

const apiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const workspaceRoot = path.resolve(apiRoot, "../..");
const apiServerRoot = path.join(apiRoot, "server");
const appServerRoot = path.join(workspaceRoot, "apps/app/server");
const adminServerRoot = path.join(workspaceRoot, "apps/admin/server");
const appNitroRuntimeTestsRoot = path.join(workspaceRoot, "apps/app/src/tests/nitro-runtime");

describe("app server retirement import boundaries", () => {
	test("api server source does not import retired frontend server roots or frontend aliases", () => {
		const offenders: string[] = [];

		for (const file of listTypeScriptFiles(apiServerRoot)) {
			const source = readFileSync(file, "utf8");

			for (const specifier of extractModuleSpecifiers(source)) {
				if (isForbiddenApiSpecifier(file, specifier)) {
					offenders.push(`${toWorkspacePath(file)} -> ${specifier}`);
				}
			}
		}

		expect(offenders).toEqual([]);
	});

	test("app nitro runtime tests no longer scan apps/app/server as their runtime root", () => {
		const offenders: string[] = [];

		for (const file of listTypeScriptFiles(appNitroRuntimeTestsRoot)) {
			const source = readFileSync(file, "utf8");
			const relativeFile = toWorkspacePath(file);

			if (source.includes("process.cwd()") && /\bserver\b/u.test(source)) {
				offenders.push(`${relativeFile} -> process.cwd()/server`);
			}

			for (const specifier of extractModuleSpecifiers(source)) {
				if (specifier.includes("../../../server") || specifier.includes("../../server")) {
					offenders.push(`${relativeFile} -> ${specifier}`);
				}
			}

			if (source.includes("server/modules") || source.includes("server/shared/runtime")) {
				offenders.push(`${relativeFile} -> old app server source reference`);
			}
		}

		expect(offenders).toEqual([]);
	});
});

function listTypeScriptFiles(directory: string): string[] {
	if (!existsSync(directory)) {
		return [];
	}

	const files: string[] = [];

	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const fullPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...listTypeScriptFiles(fullPath));
			continue;
		}

		if (entry.isFile() && fullPath.endsWith(".ts")) {
			files.push(fullPath);
		}
	}

	return files;
}

function extractModuleSpecifiers(source: string): string[] {
	const specifiers: string[] = [];
	const patterns = [
		/(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/gu,
		/import\(\s*["']([^"']+)["']\s*\)/gu,
	] as const;

	for (const pattern of patterns) {
		for (const match of source.matchAll(pattern)) {
			specifiers.push(match[1] ?? "");
		}
	}

	return specifiers.filter(Boolean);
}

function isForbiddenApiSpecifier(importer: string, specifier: string): boolean {
	const normalizedSpecifier = specifier.replace(/\\/gu, "/");
	if (normalizedSpecifier.startsWith("@/")) {
		return true;
	}
	if (normalizedSpecifier.includes("apps/app/server") || normalizedSpecifier.includes("apps/admin/server")) {
		return true;
	}
	if (!normalizedSpecifier.startsWith(".")) {
		return false;
	}

	const resolved = path.resolve(path.dirname(importer), specifier);
	return isPathInside(resolved, appServerRoot) || isPathInside(resolved, adminServerRoot);
}

function isPathInside(candidate: string, parent: string): boolean {
	const relative = path.relative(parent, candidate);
	return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function toWorkspacePath(file: string): string {
	return path.relative(workspaceRoot, file).replace(/\\/gu, "/");
}
