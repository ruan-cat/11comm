import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../server/db";
import { sql } from "drizzle-orm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEED_DIR = path.resolve(__dirname, "../drizzle/seed");

async function main() {
	const args = process.argv.slice(2);
	const clean = args.includes("--clean") || args.includes("--clean-only");
	const cleanOnly = args.includes("--clean-only");
	const specificModule = args.find((arg) => arg.startsWith("--module="))?.split("=")[1];

	if (!fs.existsSync(SEED_DIR)) {
		console.error(`❌ Seed directory not found: ${SEED_DIR}`);
		process.exit(1);
	}

	const files = fs.readdirSync(SEED_DIR).sort();
	let sqlFiles = files.filter((f) => f.endsWith(".sql") && f !== "_clean.sql");
	const cleanFile = files.find((f) => f === "_clean.sql");

	// Filter by module if specified
	if (specificModule) {
		const moduleFiles = specificModule
			.split(",")
			.map((m) => {
				// Support both module name and ID
				const matchingFile = sqlFiles.find((f) => {
					const baseName = f.replace(".sql", "");
					return baseName === m || baseName.endsWith(`-${m}`);
				});
				return matchingFile;
			})
			.filter(Boolean);

		if (moduleFiles.length === 0) {
			console.error(`❌ 未找到模块: ${specificModule}`);
			process.exit(1);
		}

		sqlFiles = moduleFiles as string[];
		console.log(`📋 只导入模块: ${sqlFiles.join(", ")}`);
	}

	console.log("🚀 开始执行 Seed SQL...");

	// 1. Clean if requested
	if (clean && cleanFile) {
		console.log(`\n🧹 执行清理脚本: ${cleanFile}`);
		const filePath = path.join(SEED_DIR, cleanFile);
		const content = fs.readFileSync(filePath, "utf-8");

		// Split into statements? Or execute as one block?
		// Drizzle/Neon-http might support multi-statement?
		// Neon HTTP driver typically supports single statement or requires splitting?
		// Let's assume execute accepts full script or we split by ';'.
		// Safe approach: split.
		// However, blocks like BEGIN ... COMMIT are one statement?
		// Neon HTTP client `neon(url)` returns a function that executes SQL.
		// It accepts `sql(query, params)`.
		// It supports multi-statement queries usually.
		try {
			await db.execute(sql.raw(content));
			console.log(`   ✅ 清理完成`);
		} catch (e) {
			console.error(`   ❌ 清理失败:`, e);
			if (cleanOnly) process.exit(1);
		}
	}

	if (cleanOnly) {
		console.log("\n✨ 清理仅模式完成");
		return;
	}

	// 2. Execute seed files
	for (const file of sqlFiles) {
		console.log(`\n📦 执行文件: ${file}`);
		const filePath = path.join(SEED_DIR, file);
		const content = fs.readFileSync(filePath, "utf-8");

		try {
			await db.execute(sql.raw(content));
			console.log(`   ✅ 执行成功`);
		} catch (e) {
			console.error(`   ❌ 执行失败: ${file}`, e);
			process.exit(1);
		}
	}

	console.log("\n✨ Database Seed 完成!");
}

main().catch(console.error);
