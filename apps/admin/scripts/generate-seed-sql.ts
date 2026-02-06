import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { IdMapRegistry, seedModuleConfigs, SeedModuleConfig, SqlStatement } from "../server/db/seed-sql";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEED_DIR = path.resolve(__dirname, "../drizzle/seed");

async function main() {
	const args = process.argv.slice(2);
	const specificModule = args.find((arg) => arg.startsWith("--module="))?.split("=")[1];
	const listModules = args.includes("--list-modules");

	// Handle --list-modules
	if (listModules) {
		console.log("📋 可用模块列表:\n");
		seedModuleConfigs.forEach((config) => {
			const deps = config.dependencies.length > 0 ? ` (依赖: ${config.dependencies.join(", ")})` : "";
			console.log(`  [${config.id}] ${config.name.padEnd(15)} - ${config.displayName}${deps}`);
		});
		return;
	}

	// 1. Determine Target Modules
	let targetConfigs: SeedModuleConfig[] = [];
	if (specificModule) {
		targetConfigs = seedModuleConfigs.filter((m) => m.name === specificModule || m.id === specificModule);
		if (targetConfigs.length === 0) {
			console.error(`❌ 未找到模块: ${specificModule}`);
			process.exit(1);
		}
	} else {
		// Full Run: Target all modules
		targetConfigs = seedModuleConfigs;

		// WIPE Directory for Full Run to prevent stale files
		if (fs.existsSync(SEED_DIR)) {
			console.log("🧹 清理旧的 Seed 文件...");
			try {
				fs.rmSync(SEED_DIR, { recursive: true, force: true });
			} catch (e) {
				console.warn("⚠️ 清理目录失败 (可能文件被占用), 尝试继续...", e);
			}
		}
	}

	// Ensure seed directory exists
	if (!fs.existsSync(SEED_DIR)) {
		fs.mkdirSync(SEED_DIR, { recursive: true });
	}

	const idMap = new IdMapRegistry();
	const allTables = new Set<string>();

	console.log("🚀 开始生成 Seed SQL...");
	if (specificModule) {
		console.log(`🎯 目标模块: ${targetConfigs.map((c) => c.id).join(", ")}`);
	} else {
		console.log(`📦 生成所有模块 (${seedModuleConfigs.length} 个)`);
	}

	// 2. Iterate ALL modules in order
	// We must run ALL generators to ensure IdMap is populated consistently,
	// even if we only want to write output for a specific module.
	for (const config of seedModuleConfigs) {
		const isTarget = targetConfigs.some((t) => t.id === config.id);

		// Log status
		if (isTarget) {
			console.log(`\n📦 处理模块: [${config.id}] ${config.displayName}`);
		}

		let statements: SqlStatement[] = [];
		try {
			// Always generate to populate IdMap
			statements = await config.generator(idMap);
		} catch (error) {
			console.error(`❌ 生成模块 [${config.id}] 失败:`, error);
			process.exit(1);
		}

		// If not a target, skip writing
		if (!isTarget) {
			continue;
		}

		if (statements.length === 0) {
			console.log(`   ⚠️ 模块 [${config.id}] 未生成任何 SQL`);
			continue;
		}

		// Collect tables for clean script
		statements.forEach((s) => allTables.add(s.table));

		// Generate SQL content
		const fileContent = [
			`-- Module: ${config.id} (${config.displayName})`,
			`-- Generated at: ${new Date().toISOString()}`,
			"",
			...statements.map((s) => {
				// Use a unique marker for splitting to strictly avoid issues with semicolons in data
				return `-- Table: ${s.table} (${s.recordCount} records)\n${s.sql};\n/* STATEMENT_END */\n`;
			}),
		].join("\n");

		const filePath = path.join(SEED_DIR, `${config.id}.sql`);
		fs.writeFileSync(filePath, fileContent, "utf-8");
		console.log(`   💾 已写入文件: ${path.basename(filePath)}`);
	}

	// 3. Generate _clean.sql
	// Only generate if we actually touched something, or if full run
	if (allTables.size > 0) {
		console.log("\n🧹 生成清理脚本 _clean.sql...");
		const tables = Array.from(allTables);
		const cleanSql = [
			"-- Auto-generated clean script",
			"",
			...tables.map((t) => `TRUNCATE TABLE "${t}" RESTART IDENTITY CASCADE;\n/* STATEMENT_END */`),
			"",
		].join("\n");

		fs.writeFileSync(path.join(SEED_DIR, "_clean.sql"), cleanSql, "utf-8");
		console.log(`   💾 已写入 _clean.sql`);
	}

	console.log("\n✨ Seed SQL 生成完成!");
}

main().catch(console.error);
