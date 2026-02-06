import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { IdMapRegistry, seedModuleConfigs, SeedModuleConfig, SqlStatement } from "../server/db/seed-sql";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEED_DIR = path.resolve(__dirname, "../drizzle/seed");

// Ensure seed directory exists
if (!fs.existsSync(SEED_DIR)) {
	fs.mkdirSync(SEED_DIR, { recursive: true });
}

async function main() {
	const args = process.argv.slice(2);
	const specificModule = args.find((arg) => arg.startsWith("--module="))?.split("=")[1];
	const cleanOnly = args.includes("--clean-only");
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

	const idMap = new IdMapRegistry();
	const allTables = new Set<string>();

	console.log("🚀 开始生成 Seed SQL...");
	console.log("Configs loaded:", seedModuleConfigs.length);

	// 1. Determine modules to run
	let modulesToRun = seedModuleConfigs;
	if (specificModule) {
		modulesToRun = seedModuleConfigs.filter((m) => m.name === specificModule || m.id === specificModule);
		if (modulesToRun.length === 0) {
			console.error(`❌ 未找到模块: ${specificModule}`);
			process.exit(1);
		}

		// 2. Check dependencies
		for (const module of modulesToRun) {
			for (const dep of module.dependencies) {
				const depFile = seedModuleConfigs.find((m) => m.name === dep);
				if (!depFile) continue;

				const depFilePath = path.join(SEED_DIR, `${depFile.id}.sql`);
				if (!fs.existsSync(depFilePath)) {
					console.error(`❌ 错误: 模块 [${module.name}] 依赖 [${dep}] 模块，但文件 ${depFile.id}.sql 不存在`);
					console.error(`   请先生成依赖模块: pnpm db:generate-seed --module=${dep}`);
					process.exit(1);
				}
			}
		}
	}

	// 2. Run generators
	for (const config of modulesToRun) {
		console.log(`\n📦 处理模块: [${config.id}] ${config.displayName}`);
		try {
			const statements = await config.generator(idMap);

			if (statements.length === 0) {
				console.log(`   ⚠️ 模块 [${config.id}] 未生成任何 SQL`);
				continue;
			}

			// Collect tables for clean script
			statements.forEach((s) => allTables.add(s.table));

			// Generate SQL content
			const fileContent = [
				`-- Module: ${config.id} (${config.displayName})`,
				"",
				...statements.map((s) => {
					// Use a unique marker for splitting to strictly avoid issues with semicolons in data
					return `-- Table: ${s.table} (${s.recordCount} records)\n${s.sql};\n/* STATEMENT_END */\n`;
				}),
			].join("\n");

			const filePath = path.join(SEED_DIR, `${config.id}.sql`);
			fs.writeFileSync(filePath, fileContent, "utf-8");
			console.log(`   💾 已写入文件: ${path.basename(filePath)}`);
		} catch (error) {
			console.error(`❌ 处理模块 [${config.id}] 失败:`, error);
			process.exit(1);
		}
	}

	// 3. Generate _clean.sql
	// We want to clean specific tables, preferably in reverse dependency order.
	// Since we don't have perfect dependency graph here, we'll list all tables found.
	// Users might want to manual clean.
	// Actually, to fully clean, we should TRUNCATE all known tables.
	// For now, let's write a clean script for the tables we touched.

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
