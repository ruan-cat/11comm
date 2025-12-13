/**
 * @file 移除test-data导入的脚本
 * @description 批量移除已删除的test-data文件的导入语句
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, "..");
const pagesDir = path.join(rootDir, "apps/admin/src/pages");

/** 查找所有包含test-data导入的文件 */
function findFilesWithTestDataImports() {
	try {
		const command = `grep -r "from.*test-data" "${pagesDir}" --include="*.ts" --include="*.vue" -l`;
		const output = execSync(command, { encoding: "utf-8" });
		return output.trim().split("\n").filter(Boolean);
	} catch (error) {
		// grep找不到结果时会返回错误码1
		if (error.status === 1) {
			return [];
		}
		throw error;
	}
}

/** 移除文件中的test-data导入和相关类型引用 */
function removeTestDataImports(filePath) {
	const content = fs.readFileSync(filePath, "utf-8");
	const lines = content.split("\n");
	let modified = false;
	const newLines = [];
	let importLinesToRemove = [];

	// 第一遍：标记需要删除的导入行
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		// 匹配 import ... from './test-data' 或 '../test-data'
		if (line.match(/import\s+.*from\s+['"]\.*\/test-data['"]/)) {
			importLinesToRemove.push(i);
			modified = true;
			console.log(`  - 删除导入: ${line.trim()}`);
		}
	}

	// 第二遍：重新构建文件内容，跳过标记的行
	for (let i = 0; i < lines.length; i++) {
		if (!importLinesToRemove.includes(i)) {
			newLines.push(lines[i]);
		}
	}

	if (modified) {
		fs.writeFileSync(filePath, newLines.join("\n"), "utf-8");
		return true;
	}

	return false;
}

/** 主函数 */
function main() {
	console.log("=== 开始移除 test-data 导入 ===\n");

	const files = findFilesWithTestDataImports();

	if (files.length === 0) {
		console.log("没有找到包含 test-data 导入的文件");
		return;
	}

	console.log(`找到 ${files.length} 个文件包含 test-data 导入\n`);

	let modifiedCount = 0;

	files.forEach((file, index) => {
		const relativePath = path.relative(rootDir, file);
		console.log(`[${index + 1}/${files.length}] 处理: ${relativePath}`);

		try {
			if (removeTestDataImports(file)) {
				modifiedCount++;
			}
		} catch (error) {
			console.error(`  ✗ 处理失败: ${error.message}`);
		}
	});

	console.log(`\n=== 处理完成 ===`);
	console.log(`总计: ${files.length} 个文件`);
	console.log(`已修改: ${modifiedCount} 个文件`);
	console.log(`\n注意: 这只是删除了导入语句，代码中可能还有类型引用需要手动修复`);
}

main();
