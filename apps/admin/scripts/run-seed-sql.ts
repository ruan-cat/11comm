import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getDb } from "../server/db";
import { sql } from "drizzle-orm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEED_DIR = path.resolve(__dirname, "../drizzle/seed");

/**
 * Executes SQL content by splitting it into statements and running them sequentially.
 * We cannot use transactions here because the Drizzle Neon HTTP driver is stateless and
 * does not support sessions/transactions in the traditional sense, and its batch API
 * requires specific usage.
 *
 * We split statements to avoid "NeonDbError: cannot insert multiple commands into a prepared statement".
 */
async function executeSqlContent(content: string, sourceName: string) {
	// DANGER: Do NOT strictly remove comments with regex, as it might kill strings containing '--'
	// const cleanContent = content.replace(/--.*$/gm, ""); // REMOVED

	let statements: string[] = [];

	// Robust splitting using our marker
	if (content.includes("/* STATEMENT_END */")) {
		statements = content
			.split("/* STATEMENT_END */")
			.map((s) => s.trim())
			.filter((s) => s.length > 0);
	} else {
		// Fallback for legacy files (still dangerous if data has semicolons)
		console.warn(`[${sourceName}] No STATEMENT_END marker found, falling back to semicolon splitting.`);
		statements = content
			.split(";")
			.map((s) => s.trim())
			.filter((s) => s.length > 0);
	}

	if (statements.length === 0) return;

	// 获取数据库实例
	const db = await getDb();
	if (!db) {
		throw new Error("无法获取数据库连接，请检查环境变量配置");
	}

	// Execute sequentially
	for (const stmt of statements) {
		// Skip explicit BEGIN/COMMIT transaction controls if they exist as standalone statements
		// (Though we removed them from generator, keeping this check doesn't hurt)
		const upperStmt = stmt.toUpperCase();
		if (upperStmt === "BEGIN" || upperStmt === "COMMIT" || upperStmt === "BEGIN;" || upperStmt === "COMMIT;") {
			continue;
		}

		// Execute the statement
		try {
			await db.execute(sql.raw(stmt));
		} catch (e) {
			console.error(`Error executing statement in ${sourceName}:`);
			console.error(stmt.substring(0, 100) + (stmt.length > 100 ? "..." : ""));
			throw e;
		}
	}
}

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

		try {
			await executeSqlContent(content, cleanFile);
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
			await executeSqlContent(content, file);
			console.log(`   ✅ 执行成功`);
		} catch (e) {
			console.error(`   ❌ 执行失败: ${file}`, e);
			process.exit(1);
		}
	}

	console.log("\n✨ Database Seed 完成!");
}

main().catch(console.error);
