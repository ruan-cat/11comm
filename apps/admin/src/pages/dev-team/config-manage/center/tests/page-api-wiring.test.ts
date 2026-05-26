import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

/** 页面接线测试通过读取源码校验正式 API hook 和弹窗提交链路，避免重新引入 mock 延迟逻辑。 */
const pageSourcePath = resolve(__dirname, "../index.vue");
const dialogSourcePath = resolve(__dirname, "../components/dialog.ts");
const formSourcePath = resolve(__dirname, "../components/form.ts");

/** 提取源码中的完整代码块，供后续断言聚焦单个业务动作。 */
function extractBraceBlock(source: string, blockStart: number) {
	const openBraceIndex = source.indexOf("{", blockStart);
	expect(openBraceIndex).toBeGreaterThanOrEqual(0);

	let depth = 0;
	for (let index = openBraceIndex; index < source.length; index++) {
		const char = source[index];
		if (char === "{") {
			depth++;
		}
		if (char === "}") {
			depth--;
			if (depth === 0) {
				return source.slice(blockStart, index + 1);
			}
		}
	}

	throw new Error("未找到完整代码块");
}

/** 定位页面上的异步动作函数，确保详情、复制、启停和删除分别接入正确接口。 */
function extractAsyncFunctionBlock(source: string, functionName: string) {
	const functionStart = source.indexOf(`async function ${functionName}`);
	expect(functionStart).toBeGreaterThanOrEqual(0);

	return extractBraceBlock(source, functionStart);
}

/** 提取弹窗提交按钮逻辑，校验 add/edit/info 三种模式的 CUD 分流。 */
function extractSubmitButtonBlock(source: string) {
	const labelStart = source.indexOf('label: () => transformI18n($t("common.buttons.submit"))');
	expect(labelStart).toBeGreaterThanOrEqual(0);

	const btnClickStart = source.indexOf("btnClick: async", labelStart);
	expect(btnClickStart).toBeGreaterThanOrEqual(0);

	const handlerStart = source.indexOf("=> {", btnClickStart);
	expect(handlerStart).toBeGreaterThanOrEqual(0);

	return extractBraceBlock(source, handlerStart);
}

describe("config-manage center page api wiring", () => {
	test("页面详情、复制、启停、删除动作必须接真实 center API", () => {
		const source = readFileSync(pageSourcePath, "utf8");
		const viewDetailsBlock = extractAsyncFunctionBlock(source, "viewDetails");
		const copyConfigBlock = extractAsyncFunctionBlock(source, "copyConfig");
		const toggleStatusBlock = extractAsyncFunctionBlock(source, "toggleStatus");
		const deleteConfigBlock = extractAsyncFunctionBlock(source, "deleteConfig");

		expect(viewDetailsBlock).toContain("await getConfigCenterDetail");
		expect(viewDetailsBlock).toMatch(/openDialog\(\s*{\s*mode:\s*["']info["']/);
		expect(viewDetailsBlock).not.toContain("updateConfigCenter");
		expect(viewDetailsBlock).not.toContain("deleteConfigCenter");

		expect(copyConfigBlock).toContain("await getConfigCenterDetail");
		expect(copyConfigBlock).toMatch(/openDialog\(\s*{\s*mode:\s*["']add["'][\s\S]*onSubmitted:\s*doFetch/);
		expect(copyConfigBlock).not.toContain("updateConfigCenter");
		expect(copyConfigBlock).not.toContain("deleteConfigCenter");

		expect(toggleStatusBlock).toContain("await updateConfigCenter");
		expect(toggleStatusBlock).toContain("await doFetch()");
		expect(toggleStatusBlock).not.toContain("deleteConfigCenter");

		expect(deleteConfigBlock).toContain("ElMessageBox.confirm");
		expect(deleteConfigBlock).toContain("await deleteConfigCenter");
		expect(deleteConfigBlock).toContain("await doFetch()");
		expect(deleteConfigBlock).not.toContain("updateConfigCenter");

		expect(source).toMatch(/openDialog\(\s*{\s*mode:\s*["']edit["'][\s\S]*onSubmitted:\s*doFetch/);
		expect(source).toContain('prop: "createdBy"');
		expect(source).not.toMatch(/\bcreator:\s*String/);
		expect(source).not.toContain("console.log");
	});

	test("弹窗提交 add/edit 必须调用 create/update 并刷新列表", () => {
		const source = readFileSync(dialogSourcePath, "utf8");
		const submitButtonBlock = extractSubmitButtonBlock(source);

		expect(submitButtonBlock).toMatch(/if\s*\(\s*isInfo\.value\s*\)\s*{\s*return;/);
		expect(submitButtonBlock).toMatch(/if\s*\(\s*isAdd\.value\s*\)\s*{\s*await createConfigCenter/);
		expect(submitButtonBlock).toMatch(/}\s*else if\s*\(\s*row\?\.id\s*\)\s*{\s*await updateConfigCenter/);
		expect(submitButtonBlock).toMatch(/closeDialog\(\s*options,\s*index\s*\);\s*await params\.onSubmitted\?\.\(\)/);
		expect(source).not.toContain("testAsync");
		expect(source).not.toContain("simulate async submit");
		expect(source).not.toContain("sleep(1300)");
	});

	test("弹窗默认配置类型必须使用选项值而不是中文 label", () => {
		const source = readFileSync(formSourcePath, "utf8");

		expect(source).toContain('configType: "system"');
		expect(source).not.toContain('configType: "系统配置"');
	});
});
