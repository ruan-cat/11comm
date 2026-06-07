import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { config } from "@dotenvx/dotenvx";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);

/** seed 脚本位于 server/db/seed，向上三级就是 apps/api 包根目录。 */
const apiRoot = resolve(currentDir, "../../..");

export const apiSeedDatabaseUrlKeys = [
	"comm_admin_11__DATABASE_URL",
	"NITRO_DATABASE_URL",
	"DATABASE_URL",
	"POSTGRES_URL",
	"POSTGRES_PRISMA_URL",
	"VERCEL_POSTGRES_URL",
] as const;

export type SeedPlanMode = "dry-run" | "blocked";

export interface SeedPlan {
	mode: SeedPlanMode;
	willWrite: false;
	databaseUrlConfigured: boolean;
	sourcePackage: "@01s-11comm/api";
	message: string;
}

export interface SeedPlanOptions {
	args: string[];
	env: NodeJS.ProcessEnv | Record<string, string | undefined>;
}

export interface SeedCliOptions extends SeedPlanOptions {
	stdout?: (message: string) => void;
	stderr?: (message: string) => void;
}

export function createSeedPlan(options: SeedPlanOptions): SeedPlan {
	const dryRun = options.args.includes("--dry-run");
	const execute = options.args.includes("--execute");
	const databaseUrlConfigured = Boolean(resolveSeedDatabaseUrl(options.env));
	const sourcePackage = "@01s-11comm/api" as const;

	if (dryRun) {
		return {
			mode: "dry-run",
			willWrite: false,
			databaseUrlConfigured,
			sourcePackage,
			message: `${sourcePackage} seed dry-run: no database writes will be executed. This entry is package-local to apps/api and does not import admin legacy seed code.`,
		};
	}

	if (!execute) {
		return {
			mode: "blocked",
			willWrite: false,
			databaseUrlConfigured,
			sourcePackage,
			message: `${sourcePackage} seed blocked: pass --dry-run for a read-only plan, or pass --execute with a configured database URL after a live seed implementation is added.`,
		};
	}

	if (!databaseUrlConfigured) {
		return {
			mode: "blocked",
			willWrite: false,
			databaseUrlConfigured,
			sourcePackage,
			message: `${sourcePackage} seed blocked: configure one of ${apiSeedDatabaseUrlKeys.join(", ")} before any live seed can run.`,
		};
	}

	return {
		mode: "blocked",
		willWrite: false,
		databaseUrlConfigured,
		sourcePackage,
		message: `${sourcePackage} seed blocked: live seed writes are not implemented yet, so no Neon writes were performed.`,
	};
}

export async function runSeedCli(options: SeedCliOptions): Promise<number> {
	const plan = createSeedPlan(options);
	const write = plan.mode === "dry-run" ? (options.stdout ?? console.log) : (options.stderr ?? console.error);

	write(plan.message);

	return plan.mode === "dry-run" ? 0 : 1;
}

function resolveSeedDatabaseUrl(env: NodeJS.ProcessEnv | Record<string, string | undefined>): string | undefined {
	for (const key of apiSeedDatabaseUrlKeys) {
		const value = env[key]?.trim();
		if (value) {
			return value;
		}
	}

	return undefined;
}

function loadSeedEnvFiles(): void {
	if (process.env.NODE_ENV === "test" || process.env.VITEST) {
		return;
	}

	for (const envFilePath of [join(apiRoot, ".env"), join(apiRoot, ".env.vercel.local")]) {
		if (existsSync(envFilePath)) {
			config({ path: envFilePath });
		}
	}
}

function isDirectCliImport(): boolean {
	const entry = process.argv[1];
	return Boolean(entry && pathToFileURL(resolve(entry)).href === import.meta.url);
}

if (isDirectCliImport()) {
	loadSeedEnvFiles();
	process.exitCode = await runSeedCli({
		args: process.argv.slice(2),
		env: process.env,
	});
}
