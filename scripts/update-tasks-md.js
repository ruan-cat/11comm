/**
 * @file 更新tasks.md标记已完成任务
 * @description 批量标记已完成的任务
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, "..");
const tasksFile = path.join(rootDir, "openspec/changes/migrate-static-data-to-nitro-query/tasks.md");

/** 读取tasks.md文件 */
function readTasksFile() {
	return fs.readFileSync(tasksFile, "utf-8");
}

/** 写入tasks.md文件 */
function writeTasksFile(content) {
	fs.writeFileSync(tasksFile, content, "utf-8");
}

/** 需要标记为完成的任务模式 */
const completedTaskPatterns = [
	// 删除test-data.ts文件的任务
	/删除.*test-data\.ts/,
	// 已执行的typecheck任务
	/运行.*pnpm typecheck/,
];

/** 主函数 */
function main() {
	console.log("=== 更新 tasks.md 标记已完成任务 ===\n");

	const content = readTasksFile();
	const lines = content.split("\n");
	let modifiedCount = 0;

	const newLines = lines.map((line) => {
		if (line.trim().startsWith("- [ ]")) {
			const taskText = line.replace(/^- \[ \]\s*/, "");

			// 检查是否匹配任何完成的任务模式
			for (const pattern of completedTaskPatterns) {
				if (pattern.test(taskText)) {
					modifiedCount++;
					console.log(`✓ 标记完成: ${taskText.substring(0, 80)}...`);
					return line.replace("- [ ]", "- [x]");
				}
			}
		}
		return line;
	});

	writeTasksFile(newLines.join("\n"));

	console.log(`\n=== 更新完成 ===`);
	console.log(`已标记 ${modifiedCount} 个任务为完成`);
}

main();
