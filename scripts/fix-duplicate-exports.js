/**
 * 修复重复导出的 defaultForm 问题
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** 需要重命名的文件和对应的新名称 */
const renames = [
	{
		file: "apps/type/src/business/property-manage/house-property-manage/invoice.ts",
		oldName: "defaultForm",
		newName: "invoiceDefaultForm",
	},
	{
		file: "apps/type/src/business/property-manage/house-property-manage/invoice-title.ts",
		oldName: "defaultForm",
		newName: "invoiceTitleDefaultForm",
	},
	{
		file: "apps/type/src/business/property-manage/house-property-manage/owner-account.ts",
		oldName: "defaultForm",
		newName: "ownerAccountDefaultForm",
	},
];

function main() {
	const root = path.join(__dirname, "..");

	renames.forEach(({ file, oldName, newName }) => {
		const filePath = path.join(root, file);

		if (!fs.existsSync(filePath)) {
			console.log(`跳过不存在的文件: ${file}`);
			return;
		}

		let content = fs.readFileSync(filePath, "utf-8");

		// 替换导出的常量名称
		const regex = new RegExp(`export const ${oldName}:`, "g");
		if (regex.test(content)) {
			content = content.replace(regex, `export const ${newName}:`);
			fs.writeFileSync(filePath, content, "utf-8");
			console.log(`✓ 已修复: ${file} (${oldName} -> ${newName})`);
		} else {
			console.log(`跳过: ${file} (未找到 ${oldName})`);
		}
	});

	console.log("\n修复完成!");
}

main();
