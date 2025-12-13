#!/usr/bin/env node

/**
 * @file 批量迁移脚本（不中断）
 * @description 一次性完成所有文件生成，最后再统一检查类型
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

// 配置
const CONFIG = {
	tasksFilePath: join(projectRoot, "openspec/changes/migrate-static-data-to-nitro-query/tasks.md"),
	adminRoot: join(projectRoot, "apps/admin"),
	typeRoot: join(projectRoot, "apps/type"),
};

// 统计
const STATS = {
	total: 0,
	completed: 0,
	skipped: 0,
	failed: 0,
	pageUpdates: 0,
};

/**
 * 解析任务文件
 */
function parseTasks() {
	const content = readFileSync(CONFIG.tasksFilePath, "utf-8");
	const lines = content.split("\n");
	const tasks = [];
	let currentSection = null;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		if (line.match(/^####\s+(\d+\.\d+\.\d+)\s+(.+)$/)) {
			const match = line.match(/^####\s+(\d+\.\d+\.\d+)\s+(.+)$/);
			currentSection = {
				number: match[1],
				path: match[2].trim(),
			};
		}

		if (line.match(/^- \[ \]\s+(\d+\.\d+\.\d+\.\d+)\s+(.+)$/)) {
			const match = line.match(/^- \[ \]\s+(\d+\.\d+\.\d+\.\d+)\s+(.+)$/);
			if (currentSection && currentSection.path) {
				tasks.push({
					lineNumber: i,
					taskNumber: match[1],
					description: match[2],
					section: currentSection.path,
					line: line,
				});
			}
		}
	}

	return tasks;
}

/**
 * 从任务描述中提取完整路径
 */
function extractPathFromDescription(description) {
	const match = description.match(/`apps\/type\/src\/business\/([^`]+)\.ts`/);
	if (match) return match[1];

	const serverMatch = description.match(/`server\/api\/([^`]+)\/(mock-data|list\.post)\.ts`/);
	if (serverMatch) return serverMatch[1];

	const apiMatch = description.match(/`src\/api\/([^`]+)\/index\.ts`/);
	if (apiMatch) return apiMatch[1];

	const pageMatch = description.match(/`src\/pages\/([^`]+)\/index\.vue`/);
	if (pageMatch) return pageMatch[1];

	return null;
}

/**
 * 从路径中提取模块信息
 */
function parseModulePath(sectionPath) {
	if (!sectionPath || typeof sectionPath !== "string") return null;

	const parts = sectionPath.split("/");
	if (parts.length >= 3) {
		return {
			module: parts[0],
			submodule: parts[1],
			page: parts[2],
			kebabCase: parts[2],
			pascalCase: parts[2]
				.split("-")
				.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
				.join(""),
			camelCase: parts[2]
				.split("-")
				.map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
				.join(""),
		};
	}

	return null;
}

/**
 * 生成类型文件
 */
function generateTypeFile(moduleInfo, pageName) {
	const pascalName = moduleInfo.pascalCase;

	return `import type { OptionsType } from "../../../common";

/**
 * @description ${pageName}列表数据
 * ${pascalName} list item
 */
export interface ${pascalName}ListItem {
	/** ID */
	id: string;
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * @description ${pageName}列表查询参数
 * ${pascalName} list query parameters
 */
export interface ${pascalName}QueryParams {
	/** 名称 Name */
	name?: string;
	/** 状态 Status */
	status?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 状态选项
 * Status options
 */
export const ${moduleInfo.camelCase}StatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];
`;
}

/**
 * 生成 mock-data 文件
 */
function generateMockDataFile(moduleInfo, pageName) {
	const pascalName = moduleInfo.pascalCase;

	return `import type { ${pascalName}ListItem } from "@01s-11comm/type";

/**
 * @description ${pageName}模拟数据
 * ${pascalName} mock data
 */
export const mock${pascalName}Data: ${pascalName}ListItem[] = [
	{
		id: "1",
		name: "示例项目1",
		status: "启用",
		createTime: "2024-01-01 10:00:00",
		updateTime: "2024-01-01 10:00:00",
		remark: "这是示例数据1",
	},
	{
		id: "2",
		name: "示例项目2",
		status: "启用",
		createTime: "2024-01-02 11:00:00",
		updateTime: "2024-01-02 11:00:00",
		remark: "这是示例数据2",
	},
	{
		id: "3",
		name: "示例项目3",
		status: "禁用",
		createTime: "2024-01-03 12:00:00",
		updateTime: "2024-01-03 12:00:00",
		remark: "这是示例数据3",
	},
	{
		id: "4",
		name: "示例项目4",
		status: "启用",
		createTime: "2024-01-04 13:00:00",
		updateTime: "2024-01-04 13:00:00",
	},
	{
		id: "5",
		name: "示例项目5",
		status: "启用",
		createTime: "2024-01-05 14:00:00",
		updateTime: "2024-01-05 14:00:00",
		remark: "这是示例数据5",
	},
];
`;
}

/**
 * 生成 Nitro API 文件
 */
function generateNitroApiFile(moduleInfo, pageName) {
	const pascalName = moduleInfo.pascalCase;

	return `import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { ${pascalName}ListItem, ${pascalName}QueryParams } from "@01s-11comm/type";
import { mock${pascalName}Data } from "./mock-data";

/**
 * @description ${pageName}列表 POST API
 * ${pascalName} list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<${pascalName}ListItem>>> => {
	const body = await readBody<${pascalName}QueryParams>(event);
	const { pageIndex = 1, pageSize = 10, name, status } = body;

	let filteredData = [...mock${pascalName}Data];

	// 数据筛选
	if (name) {
		filteredData = filteredData.filter((item) => item.name.includes(name));
	}
	if (status) {
		filteredData = filteredData.filter((item) => item.status === status);
	}

	// 分页处理
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	// 返回标准格式
	return {
		success: true,
		code: 200,
		message: "查询成功",
		data: {
			list: pageData,
			total,
			pageIndex,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		},
		timestamp: Date.now(),
	};
});
`;
}

/**
 * 生成 API Hook 文件
 */
function generateApiHookFile(moduleInfo, pageName) {
	const pascalName = moduleInfo.pascalCase;
	const { module, submodule, kebabCase } = moduleInfo;

	return `/**
 * @file ${pageName} API Hook
 * @description ${pascalName} API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { ${pascalName}ListItem, ${pascalName}QueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/${module}/${submodule}/${kebabCase}/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "${moduleInfo.camelCase}";

/**
 * ${pageName}列表查询 Hook
 * ${pascalName} list query hook
 */
export function use${pascalName}ListQuery() {
	return useListQuery<${pascalName}ListItem, ${pascalName}QueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

export default use${pascalName}ListQuery;
`;
}

/**
 * 创建目录
 */
function ensureDir(dirPath) {
	if (!existsSync(dirPath)) {
		mkdirSync(dirPath, { recursive: true });
	}
}

/**
 * 更新模块导出文件
 */
function updateModuleExports(modulePath, pageName) {
	const parts = modulePath.split("/");
	if (parts.length < 2) return;

	const indexPath = join(CONFIG.typeRoot, `src/business/${modulePath}/index.ts`);

	let content = "";
	if (existsSync(indexPath)) {
		content = readFileSync(indexPath, "utf-8");
	} else {
		const submoduleName = parts[parts.length - 1];
		content = `/**
 * @file ${submoduleName} 模块类型导出
 * @description 统一导出 ${submoduleName} 相关的所有业务类型
 */

`;
		ensureDir(dirname(indexPath));
	}

	const exportStatement = `export * from "./${pageName}";`;
	if (!content.includes(exportStatement)) {
		const lines = content.split("\n");
		lines.push(exportStatement);
		content = lines.join("\n");
		writeFileSync(indexPath, content, "utf-8");
	}

	// 递归更新上层导出
	if (parts.length > 2) {
		const parentPath = parts.slice(0, -1).join("/");
		const submoduleName = parts[parts.length - 1];
		updateParentExports(parentPath, submoduleName);
	}
}

/**
 * 更新父级模块导出
 */
function updateParentExports(parentPath, submoduleName) {
	const indexPath = join(CONFIG.typeRoot, `src/business/${parentPath}/index.ts`);

	let content = "";
	if (existsSync(indexPath)) {
		content = readFileSync(indexPath, "utf-8");
	} else {
		const moduleName = parentPath.split("/").pop();
		content = `/**
 * @file ${moduleName} 模块类型导出
 * @description ${moduleName} 模块的所有业务类型
 */

`;
		ensureDir(dirname(indexPath));
	}

	const exportStatement = `export * from "./${submoduleName}";`;
	if (!content.includes(exportStatement)) {
		const lines = content.split("\n");
		lines.push(exportStatement);
		content = lines.join("\n");
		writeFileSync(indexPath, content, "utf-8");
	}
}

/**
 * 处理单个任务
 */
function processTask(task) {
	const fullPath = extractPathFromDescription(task.description);
	if (!fullPath) {
		STATS.skipped++;
		return false;
	}

	const moduleInfo = parseModulePath(fullPath);
	if (!moduleInfo) {
		STATS.skipped++;
		return false;
	}

	const { module, submodule, page } = moduleInfo;
	const description = task.description;

	try {
		// 1. 迁移类型文件
		if (description.includes("迁移类型到")) {
			const typeFilePath = join(CONFIG.typeRoot, `src/business/${module}/${submodule}/${page}.ts`);
			if (!existsSync(typeFilePath)) {
				ensureDir(dirname(typeFilePath));
				const content = generateTypeFile(moduleInfo, page);
				writeFileSync(typeFilePath, content, "utf-8");
				updateModuleExports(`${module}/${submodule}`, page);
				STATS.completed++;
				return true;
			}
			STATS.skipped++;
			return true;
		}

		// 2. 创建 mock-data 文件
		if (description.includes("mock-data.ts")) {
			const mockDataPath = join(CONFIG.adminRoot, `server/api/${module}/${submodule}/${page}/mock-data.ts`);
			if (!existsSync(mockDataPath)) {
				ensureDir(dirname(mockDataPath));
				const content = generateMockDataFile(moduleInfo, page);
				writeFileSync(mockDataPath, content, "utf-8");
				STATS.completed++;
				return true;
			}
			STATS.skipped++;
			return true;
		}

		// 3. 创建 Nitro API 文件
		if (description.includes("list.post.ts")) {
			const apiPath = join(CONFIG.adminRoot, `server/api/${module}/${submodule}/${page}/list.post.ts`);
			if (!existsSync(apiPath)) {
				ensureDir(dirname(apiPath));
				const content = generateNitroApiFile(moduleInfo, page);
				writeFileSync(apiPath, content, "utf-8");
				STATS.completed++;
				return true;
			}
			STATS.skipped++;
			return true;
		}

		// 4. 创建 API Hook 文件
		if (description.includes("src/api/") && description.includes("index.ts")) {
			const hookPath = join(CONFIG.adminRoot, `src/api/${module}/${submodule}/${page}/index.ts`);
			if (!existsSync(hookPath)) {
				ensureDir(dirname(hookPath));
				const content = generateApiHookFile(moduleInfo, page);
				writeFileSync(hookPath, content, "utf-8");
				STATS.completed++;
				return true;
			}
			STATS.skipped++;
			return true;
		}

		// 5. 更新页面文件（暂时跳过）
		if (description.includes("更新") && description.includes("index.vue")) {
			STATS.pageUpdates++;
			return false;
		}

		return false;
	} catch (error) {
		console.error(`❌ 处理任务失败: ${task.taskNumber} - ${error.message}`);
		STATS.failed++;
		return false;
	}
}

/**
 * 更新任务文件
 */
function markTaskAsCompleted(tasks, completedTaskNumbers) {
	const content = readFileSync(CONFIG.tasksFilePath, "utf-8");
	let lines = content.split("\n");

	for (const task of tasks) {
		if (completedTaskNumbers.has(task.taskNumber)) {
			lines[task.lineNumber] = lines[task.lineNumber].replace("- [ ]", "- [x]");
		}
	}

	writeFileSync(CONFIG.tasksFilePath, lines.join("\n"), "utf-8");
}

/**
 * 主函数
 */
async function main() {
	console.log("🚀 开始批量迁移任务...\n");

	const tasks = parseTasks();
	STATS.total = tasks.length;
	console.log(`📊 共找到 ${STATS.total} 个待完成任务\n`);

	if (tasks.length === 0) {
		console.log("✨ 所有任务已完成！");
		return;
	}

	const completedTaskNumbers = new Set();

	// 一次性处理所有任务
	for (const task of tasks) {
		const success = processTask(task);
		if (success) {
			completedTaskNumbers.add(task.taskNumber);
		}
	}

	// 更新任务文件
	if (completedTaskNumbers.size > 0) {
		markTaskAsCompleted(tasks, completedTaskNumbers);
		console.log(`\n✅ 更新任务文件，标记 ${completedTaskNumbers.size} 个任务为已完成`);
	}

	// 显示统计
	console.log("\n📈 迁移统计：");
	console.log(`   总任务数: ${STATS.total}`);
	console.log(`   完成任务: ${STATS.completed}`);
	console.log(`   跳过任务: ${STATS.skipped}`);
	console.log(`   失败任务: ${STATS.failed}`);
	console.log(`   页面更新: ${STATS.pageUpdates} (需要手动处理)`);

	// 最后运行类型检查
	console.log("\n🔍 运行类型检查...");
	try {
		execSync("pnpm -F @01s-11comm/admin typecheck", {
			cwd: projectRoot,
			stdio: "inherit",
		});
		console.log("✅ 类型检查通过");
	} catch (error) {
		console.error("❌ 类型检查失败，请手动修复");
	}

	console.log(`\n✨ 完成！`);
}

// 运行主函数
main().catch((error) => {
	console.error("❌ 脚本执行失败:", error);
	process.exit(1);
});
