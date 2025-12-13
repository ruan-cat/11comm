/**
 * 批量修复 test-data 导入
 * 将所有从 test-data 的导入替换为从 @01s-11comm/type 导入
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const adminBasePath = join(process.cwd(), "apps", "admin", "src", "pages");

/** 需要修复的文件列表 */
const filesToFix = [
	{
		path: "operation-team/system-manage/system-config/components/form.ts",
		find: 'export { 配置类型Options, 配置分组Options, 状态Options } from "../test-data";',
		replace: 'export { 配置类型Options, 配置分组Options } from "@01s-11comm/type";\nexport { 状态Options } from "@01s-11comm/type";',
	},
	{
		path: "operation-team/system-manage/initialize-cell/components/form.ts",
		find: 'export { 单元格类型Options, 状态Options } from "../test-data";',
		replace: 'export { 单元格类型Options } from "@01s-11comm/type";\nexport { 状态Options } from "@01s-11comm/type";',
	},
	{
		path: "operation-team/system-manage/community-configuration/components/form.ts",
		find: 'export { type 小区配置表单_VO } from "../test-data";',
		replace: 'export { type 小区配置表单_VO } from "@01s-11comm/type";',
	},
	{
		path: "property-manage/community-manage/property-register/components/form.ts",
		find: 'export type { 产权登记表单_VO } from "../test-data";\nexport { defaultForm } from "../test-data";',
		replace: 'export type { 产权登记表单_VO } from "@01s-11comm/type";\nexport { defaultForm } from "@01s-11comm/type";',
	},
	{
		path: "operation-team/merchant-manage/merchant-info/components/form.ts",
		find: 'export { 商户类型选项, 经营状态选项 } from "../test-data";',
		replace: 'export { 商户类型选项, 经营状态选项 } from "@01s-11comm/type";',
	},
	{
		path: "property-manage/house-property-manage/invoice-title/components/form.ts",
		find: 'export { 发票类型选项 } from "../test-data";',
		replace: 'export { 发票类型选项, defaultForm } from "@01s-11comm/type";',
	},
	{
		path: "property-manage/patrol-manage/item/components/form.ts",
		find: 'export type { 巡检项目表单_VO } from "../test-data";',
		replace: 'export type { 巡检项目表单_VO } from "@01s-11comm/type";',
	},
];

/** 处理单个文件 */
function processFile(filePath: string, findStr: string, replaceStr: string) {
	const fullPath = join(adminBasePath, filePath);

	try {
		const content = readFileSync(fullPath, "utf-8");

		if (content.includes(findStr)) {
			const newContent = content.replace(findStr, replaceStr);
			writeFileSync(fullPath, newContent, "utf-8");
			console.log(`✅ 更新文件: ${filePath}`);
		} else {
			console.log(`⚠️  文件中未找到指定内容: ${filePath}`);
		}
	} catch (error) {
		console.error(`❌ 处理文件失败 ${filePath}:`, error.message);
	}
}

/** 主函数 */
function main() {
	console.log("开始批量修复 test-data 导入...\n");

	for (const { path, find, replace } of filesToFix) {
		processFile(path, find, replace);
	}

	console.log("\n✨ 所有 test-data 导入修复完成！");
}

main();
