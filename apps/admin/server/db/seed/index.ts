import { config } from "@dotenvx/dotenvx";
import { execSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import consola from "consola";
import { sql } from "drizzle-orm";
import { getDb } from "../index";
import { registry } from "./modules/_registry";
import { runSeed } from "./runner";

config({ path: ".env" });
config({ path: ".env.vercel.local" });

const isReset = process.argv.includes("--reset");

async function main() {
	const db = await getDb();
	if (!db) {
		consola.fatal("Failed to connect to database. Check your .env file.");
		process.exit(1);
	}

	if (isReset) {
		await resetAndSeed(db);
	} else {
		await runSeed(db, registry);
	}
}

/**
 * 核弹级重置：DROP 全部 → 清除迁移 → 重建表结构 → 填充数据
 */
async function resetAndSeed(db: Awaited<ReturnType<typeof getDb>>) {
	consola.warn("=== NUCLEAR RESET MODE ===");
	consola.warn("This will DROP all tables, reset migrations, and rebuild from schema.");

	// Step 1: Drop all tables
	consola.info("Step 1/4: Dropping all tables...");
	await db!.execute(sql`DROP SCHEMA public CASCADE`);
	await db!.execute(sql`CREATE SCHEMA public`);
	await db!.execute(sql`GRANT ALL ON SCHEMA public TO PUBLIC`);
	consola.success("All tables dropped");

	// Step 2: Clear local migration files
	consola.info("Step 2/4: Clearing local migration files...");
	const drizzleDir = resolve(import.meta.dirname, "../../../drizzle");

	if (existsSync(drizzleDir)) {
		rmSync(drizzleDir, { recursive: true, force: true });
		consola.success(`Cleared ${drizzleDir}`);
	}

	// Step 3: Push schema to DB
	consola.info("Step 3/4: Pushing schema to database...");
	const adminRoot = resolve(import.meta.dirname, "../../..");
	execSync("npx drizzle-kit push --force", {
		cwd: adminRoot,
		stdio: "inherit",
	});
	consola.success("Schema pushed to database");

	// Step 4: Seed data (need fresh db connection after schema rebuild)
	consola.info("Step 4/4: Seeding data...");
	const freshDb = await getDb();
	if (!freshDb) {
		consola.fatal("Failed to reconnect to database after reset.");
		process.exit(1);
	}
	await runSeed(freshDb, registry);

	consola.success("=== NUCLEAR RESET COMPLETE ===");
}

main().catch((err) => {
	consola.fatal("Seed failed:", err);
	process.exit(1);
});
