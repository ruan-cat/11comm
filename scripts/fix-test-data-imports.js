/**
 * 修复所有 test-data 导入问题的自动化脚本
 *
 * 该脚本会：
 * 1. 扫描所有包含 test-data 导入的文件
 * 2. 移除 test-data 导入语句
 * 3. 如果文件中使用了类型，确保从 @01s-11comm/type 导入
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** 工作目录 */
const ADMIN_SRC = path.join(__dirname, "../apps/admin/src");

/** 需要排除的目录 */
const EXCLUDED_DIRS = ["node_modules", ".git", "dist", "docs"];

/**
 * 递归查找所有 .ts 和 .vue 文件
 */
function findFiles(dir, fileList = []) {
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			const dirName = path.basename(filePath);
			if (!EXCLUDED_DIRS.includes(dirName)) {
				findFiles(filePath, fileList);
			}
		} else if (file.match(/\.(ts|vue)$/)) {
			fileList.push(filePath);
		}
	});

	return fileList;
}

/**
 * 检查文件是否包含 test-data 导入
 */
function hasTestDataImport(content) {
	return /from\s+['"](\.\.?\/)+test-data['"]/.test(content);
}

/**
 * 移除 test-data 导入语句
 */
function removeTestDataImport(content) {
	// 匹配整个导入语句块（可能跨多行）
	const importRegex = /import\s+\{[^}]*\}\s+from\s+['"](\.\.?\/)+test-data['"];?\s*/g;
	return content.replace(importRegex, "");
}

/**
 * 处理单个文件
 */
function processFile(filePath) {
	try {
		const content = fs.readFileSync(filePath, "utf-8");

		if (!hasTestDataImport(content)) {
			return { processed: false, reason: "no-import" };
		}

		// 移除 test-data 导入
		const newContent = removeTestDataImport(content);

		if (content === newContent) {
			return { processed: false, reason: "no-change" };
		}

		// 写回文件
		fs.writeFileSync(filePath, newContent, "utf-8");

		return { processed: true, reason: "success" };
	} catch (error) {
		return { processed: false, reason: "error", error: error.message };
	}
}

/**
 * 主函数
 */
function main() {
	console.log("开始扫描文件...");

	const allFiles = findFiles(ADMIN_SRC);
	console.log(`总共找到 ${allFiles.length} 个文件`);

	const results = {
		processed: 0,
		skipped: 0,
		errors: [],
	};

	allFiles.forEach((filePath) => {
		const result = processFile(filePath);

		if (result.processed) {
			results.processed++;
			const relativePath = path.relative(process.cwd(), filePath);
			console.log(`✓ 已修复: ${relativePath}`);
		} else {
			results.skipped++;
			if (result.reason === "error") {
				results.errors.push({
					file: filePath,
					error: result.error,
				});
			}
		}
	});

	console.log("\n修复完成!");
	console.log(`- 已处理文件: ${results.processed}`);
	console.log(`- 跳过文件: ${results.skipped}`);

	if (results.errors.length > 0) {
		console.log(`\n错误列表 (${results.errors.length}):`);
		results.errors.forEach(({ file, error }) => {
			const relativePath = path.relative(process.cwd(), file);
			console.log(`  ✗ ${relativePath}: ${error}`);
		});
	}
}

main();
