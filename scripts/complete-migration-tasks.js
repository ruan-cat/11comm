/**
 * @file 完成 migrate-static-data-to-nitro-query 剩余任务的自动化脚本
 * @description 批量处理待完成的迁移任务
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

/** 获取所有待完成任务 */
function getPendingTasks(content) {
	const lines = content.split("\n");
	const pendingTasks = [];

	lines.forEach((line, index) => {
		if (line.trim().startsWith("- [ ]")) {
			pendingTasks.push({
				lineNumber: index,
				content: line,
				task: line.replace(/^- \[ \]\s*/, ""),
			});
		}
	});

	return pendingTasks;
}

/** 标记任务为完成 */
function markTaskComplete(content, taskLine) {
	return content.replace(taskLine, taskLine.replace("- [ ]", "- [x]"));
}

/** 删除test-data.ts文件 */
function deleteTestDataFiles() {
	const testDataFiles = [
		// dev-team
		"apps/admin/src/pages/dev-team/config-manage/center/test-data.ts",
		"apps/admin/src/pages/dev-team/config-manage/dictionary/test-data.ts",
		"apps/admin/src/pages/dev-team/config-manage/type/test-data.ts",
		"apps/admin/src/pages/dev-team/config-manage/item/test-data.ts",
		"apps/admin/src/pages/dev-team/menu-manage/catalog/test-data.ts",
		"apps/admin/src/pages/dev-team/menu-manage/group/test-data.ts",
		"apps/admin/src/pages/dev-team/menu-manage/item/test-data.ts",
		"apps/admin/src/pages/dev-team/cache-manage/refresh-cache/test-data.ts",
		// operation-team
		"apps/admin/src/pages/operation-team/data-manage/community-information/test-data.ts",
		"apps/admin/src/pages/operation-team/data-manage/property-management-company/test-data.ts",
		"apps/admin/src/pages/operation-team/merchant-manage/merchant-admin/test-data.ts",
		"apps/admin/src/pages/operation-team/merchant-manage/merchant-info/test-data.ts",
		"apps/admin/src/pages/operation-team/report-configuration/report-component/test-data.ts",
		"apps/admin/src/pages/operation-team/report-configuration/report-group/test-data.ts",
		"apps/admin/src/pages/operation-team/report-configuration/report-info/test-data.ts",
		"apps/admin/src/pages/operation-team/system-manage/change-password/test-data.ts",
		"apps/admin/src/pages/operation-team/system-manage/community-configuration/test-data.ts",
		"apps/admin/src/pages/operation-team/system-manage/initialize-cell/test-data.ts",
		"apps/admin/src/pages/operation-team/system-manage/register-protocol/test-data.ts",
		"apps/admin/src/pages/operation-team/system-manage/system-config/test-data.ts",
		// setting-manage
		"apps/admin/src/pages/setting-manage/organize-manage/data-permission/test-data.ts",
		"apps/admin/src/pages/setting-manage/organize-manage/org-info/test-data.ts",
		"apps/admin/src/pages/setting-manage/organize-manage/role-permission/test-data.ts",
		"apps/admin/src/pages/setting-manage/organize-manage/scheduling-setting/test-data.ts",
		"apps/admin/src/pages/setting-manage/organize-manage/shift-setting/test-data.ts",
		"apps/admin/src/pages/setting-manage/organize-manage/staff-info/test-data.ts",
		"apps/admin/src/pages/setting-manage/organize-manage/working-schedule/test-data.ts",
	];

	let deletedCount = 0;
	let notFoundCount = 0;

	testDataFiles.forEach((file) => {
		const filePath = path.join(rootDir, file);
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
			console.log(`✓ 已删除: ${file}`);
			deletedCount++;
		} else {
			console.log(`⚠ 文件不存在: ${file}`);
			notFoundCount++;
		}
	});

	console.log(`\n删除完成: ${deletedCount} 个文件已删除, ${notFoundCount} 个文件不存在`);
}

/** 主函数 */
function main() {
	console.log("=== 开始执行迁移任务完成脚本 ===\n");

	// 读取任务文件
	const content = readTasksFile();
	const pendingTasks = getPendingTasks(content);

	console.log(`发现 ${pendingTasks.length} 个待完成任务\n`);

	// 分类统计
	const taskCategories = {
		pageUpdate: pendingTasks.filter((t) => t.task.includes("更新 `src/pages")),
		settingManage: pendingTasks.filter((t) => t.task.includes("setting-manage") && !t.task.includes("删除")),
		deleteTestData: pendingTasks.filter((t) => t.task.includes("删除") && t.task.includes("test-data.ts")),
		codeCheck: pendingTasks.filter((t) => t.task.includes("修复") || t.task.includes("检查")),
		typecheck: pendingTasks.filter((t) => t.task.includes("typecheck")),
		documentation: pendingTasks.filter((t) => t.task.includes("更新") && (t.task.includes(".md") || t.task.includes("文档"))),
		testing: pendingTasks.filter((t) => t.task.includes("手动测试") || t.task.includes("验证")),
		others: [],
	};

	// 计算其他类别
	const categorizedCount =
		taskCategories.pageUpdate.length +
		taskCategories.settingManage.length +
		taskCategories.deleteTestData.length +
		taskCategories.codeCheck.length +
		taskCategories.typecheck.length +
		taskCategories.documentation.length +
		taskCategories.testing.length;

	taskCategories.others = pendingTasks.filter((t) => {
		return !Object.keys(taskCategories).some((key) => {
			if (key === "others") return false;
			return taskCategories[key].includes(t);
		});
	});

	console.log("任务分类统计:");
	console.log(`  - 页面更新任务 (*.5): ${taskCategories.pageUpdate.length}`);
	console.log(`  - setting-manage 迁移: ${taskCategories.settingManage.length}`);
	console.log(`  - 删除 test-data.ts: ${taskCategories.deleteTestData.length}`);
	console.log(`  - 代码检查/修复: ${taskCategories.codeCheck.length}`);
	console.log(`  - 类型检查: ${taskCategories.typecheck.length}`);
	console.log(`  - 文档更新: ${taskCategories.documentation.length}`);
	console.log(`  - 手动测试/验证: ${taskCategories.testing.length}`);
	console.log(`  - 其他任务: ${taskCategories.others.length}\n`);

	// 执行删除test-data.ts文件
	console.log("=== 执行删除 test-data.ts 文件 ===\n");
	deleteTestDataFiles();

	console.log("\n=== 脚本执行完成 ===");
	console.log("\n下一步建议:");
	console.log("1. 运行 pnpm -F @01s-11comm/admin typecheck 检查类型错误");
	console.log("2. 手动处理 setting-manage 模块的迁移（需要根据实际页面结构调整）");
	console.log("3. 手动更新页面文件使用新的查询 hook");
	console.log("4. 执行手动测试验证功能");
}

main();
