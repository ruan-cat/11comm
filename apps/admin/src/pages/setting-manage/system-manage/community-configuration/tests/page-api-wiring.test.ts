import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

/** 页面接线测试通过读取源码校验正式 API hook 和弹窗提交链路，避免重新引入 mock 延迟逻辑。 */
const pageSourcePath = resolve(__dirname, "../index.vue");
const formSourcePath = resolve(__dirname, "../components/form.ts");
const formVueSourcePath = resolve(__dirname, "../components/form.vue");

const realFields = [
	"csId",
	"communityId",
	"communityName",
	"settingName",
	"settingValue",
	"settingType",
	"statusCd",
	"remark",
	"operator",
];

const requiredCreatePayloadFields = ["csId", "communityId", "communityName", "settingName", "settingType", "statusCd"];
const removedMockTokens = ["test" + "Async", "sl" + "eep", "con" + "sola", "use" + "Toggle"];
const forbiddenTokens = ["http://", "https://"];

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

function extractAsyncFunctionBlock(source: string, functionName: string) {
	const functionStart = source.indexOf(`async function ${functionName}`);
	expect(functionStart).toBeGreaterThanOrEqual(0);

	return extractBraceBlock(source, functionStart);
}

function extractFunctionBlock(source: string, functionName: string) {
	const functionStart = source.indexOf(`function ${functionName}`);
	expect(functionStart).toBeGreaterThanOrEqual(0);

	return extractBraceBlock(source, functionStart);
}

function extractSubmitButtonBlock(source: string) {
	const labelStart = source.indexOf('label: () => transformI18n($t("common.buttons.submit"))');
	expect(labelStart).toBeGreaterThanOrEqual(0);

	const btnClickStart = source.indexOf("btnClick: async", labelStart);
	expect(btnClickStart).toBeGreaterThanOrEqual(0);

	const handlerStart = source.indexOf("=> {", btnClickStart);
	expect(handlerStart).toBeGreaterThanOrEqual(0);

	return extractBraceBlock(source, handlerStart);
}

function extractFooterButtonBlock(source: string, labelKey: string) {
	const labelStart = source.indexOf(`label: () => transformI18n($t("${labelKey}"))`);
	expect(labelStart).toBeGreaterThanOrEqual(0);

	const btnClickStart = source.indexOf("btnClick:", labelStart);
	expect(btnClickStart).toBeGreaterThanOrEqual(0);

	const handlerStart = source.indexOf("=> {", btnClickStart);
	expect(handlerStart).toBeGreaterThanOrEqual(0);

	return extractBraceBlock(source, handlerStart);
}

function extractDialogBeforeCloseBlock(source: string) {
	const blockStart = source.indexOf("async doBeforeClose");
	expect(blockStart).toBeGreaterThanOrEqual(0);

	const bodyStart = source.indexOf(") {", blockStart);
	expect(bodyStart).toBeGreaterThanOrEqual(0);

	return extractBraceBlock(source, bodyStart);
}

describe("community-configuration page api wiring", () => {
	test("search form only exposes community-configuration filters supported by apps/api", () => {
		const source = readFileSync(pageSourcePath, "utf8");
		const modelStart = source.indexOf("const plusSearchModelRef");
		const modelEnd = source.indexOf("const plusSearchDefaultValues", modelStart);
		const columnsStart = source.indexOf("const plusSearchColumns");
		const columnsEnd = source.indexOf("const plusSearchProps", columnsStart);
		expect(modelStart).toBeGreaterThanOrEqual(0);
		expect(modelEnd).toBeGreaterThan(modelStart);
		expect(columnsStart).toBeGreaterThanOrEqual(0);
		expect(columnsEnd).toBeGreaterThan(columnsStart);

		const searchModelBlock = source.slice(modelStart, modelEnd);
		const searchColumnsBlock = source.slice(columnsStart, columnsEnd);

		expect(searchModelBlock).toContain("settingName");
		expect(searchModelBlock).toContain("settingType");
		expect(searchModelBlock).not.toContain("communityName");
		expect(searchModelBlock).not.toContain("statusCd");

		expect(searchColumnsBlock).toContain('prop: "settingName"');
		expect(searchColumnsBlock).toContain('prop: "settingType"');
		expect(searchColumnsBlock).not.toContain('prop: "communityName"');
		expect(searchColumnsBlock).not.toContain('prop: "statusCd"');
	});

	test("页面 add/detail/edit/delete 动作必须接真实 community-configuration caller", () => {
		const source = readFileSync(pageSourcePath, "utf8");
		const viewDetailsBlock = extractFunctionBlock(source, "viewCommunityConfigurationDetails");
		const editBlock = extractFunctionBlock(source, "editCommunityConfiguration");
		const deleteBlock = extractAsyncFunctionBlock(source, "deleteCommunityConfigurationRow");

		expect(source).toMatch(/openDialog\(\s*{\s*mode:\s*["']add["']/);

		expect(viewDetailsBlock).toMatch(/openDialog\(\s*{\s*mode:\s*["']info["']/);
		expect(viewDetailsBlock).not.toContain("createCommunityConfiguration");
		expect(viewDetailsBlock).not.toContain("updateCommunityConfiguration");
		expect(viewDetailsBlock).not.toContain("deleteCommunityConfiguration(");

		expect(editBlock).toMatch(/openDialog\(\s*{\s*mode:\s*["']edit["']/);
		expect(editBlock).not.toContain("createCommunityConfiguration");
		expect(editBlock).not.toContain("deleteCommunityConfiguration(");

		expect(deleteBlock).toContain("ElMessageBox.confirm");
		expect(deleteBlock).toContain("await deleteCommunityConfiguration");
		expect(deleteBlock).toContain("await doFetch()");
		expect(deleteBlock).not.toContain("createCommunityConfiguration");
		expect(deleteBlock).not.toContain("updateCommunityConfiguration");

		expect(source).toMatch(/<ElButton type="primary" @click="openDialog\({ mode: 'add' }\)">/);
		expect(source).toMatch(/<ElButton type="info" @click="viewCommunityConfigurationDetails\(row\)">/);
		expect(source).toMatch(/<ElButton type="warning" @click="editCommunityConfiguration\(row\)">/);
		expect(source).toMatch(/<ElButton type="danger" @click="deleteCommunityConfigurationRow\(row\)">/);

		for (const token of removedMockTokens) {
			expect(source).not.toContain(token);
		}
		for (const token of forbiddenTokens) {
			expect(source).not.toContain(token);
		}
	});

	test("弹窗提交 add/edit 必须调用 create/update 并刷新列表，detail/info 模式不提交", () => {
		const source = readFileSync(pageSourcePath, "utf8");
		const submitButtonBlock = extractSubmitButtonBlock(source);

		expect(submitButtonBlock).toMatch(/if\s*\(\s*isInfo\.value\s*\)\s*{\s*return;/);
		expect(submitButtonBlock).toMatch(/if\s*\(\s*isAdd\.value\s*\)\s*{\s*await createCommunityConfiguration/);
		expect(submitButtonBlock).toMatch(
			/}\s*else if\s*\(\s*isEdit\.value\s*&&\s*row\?\.id\s*\)\s*{\s*await updateCommunityConfiguration/,
		);
		expect(submitButtonBlock).toMatch(/closeDialog\(\s*options,\s*index\s*\);\s*await doFetch\(\)/);
		for (const token of removedMockTokens) {
			expect(submitButtonBlock).not.toContain(token);
		}
	});

	test("payload 和表单字段必须对齐 sm_community_configurations 真实字段", () => {
		const pageSource = readFileSync(pageSourcePath, "utf8");
		const formSource = readFileSync(formSourcePath, "utf8");
		const formVueSource = readFileSync(formVueSourcePath, "utf8");

		expect(formSource).toContain("CommunityConfigurationFormData");
		expect(pageSource).toContain("CommunityConfigurationFormData");

		for (const field of realFields) {
			expect(formSource).toContain(`${field}:`);
			expect(formVueSource).toContain(`prop: "${field}"`);
			expect(pageSource).toContain(`${field}:`);
		}

		for (const field of requiredCreatePayloadFields) {
			expect(formSource).toMatch(new RegExp(`${field}:\\s*""|${field}:\\s*"0"`));
			expect(formVueSource).toMatch(new RegExp(`prop: "${field}"[\\s\\S]*required: true`));
		}
	});

	test("弹窗关闭、取消和提交必须共用 helper 解包 CommunityConfigurationFormData", () => {
		const source = readFileSync(pageSourcePath, "utf8");
		const helperBlock = extractFunctionBlock(source, "getCurrentCommunityConfigurationFormData");
		const beforeCloseBlock = extractDialogBeforeCloseBlock(source);
		const cancelButtonBlock = extractFooterButtonBlock(source, "common.buttons.cancel");
		const submitButtonBlock = extractSubmitButtonBlock(source);

		expect(helperBlock).toMatch(/CommunityConfigurationFormData\s*\|\s*undefined/);
		expect(helperBlock).toContain("communityConfigurationFormInstance.value?.formComputed");
		expect(helperBlock).toMatch(/typeof\s+formComputed\s*===\s*["']object["']/);
		expect(helperBlock).toMatch(/["']value["']\s+in\s+formComputed/);
		expect(helperBlock).toMatch(/const\s+payload\s*=/);
		expect(helperBlock).toMatch(/cloneDeep\(\s*payload\s*\)\s*as\s*CommunityConfigurationFormData/);

		expect(beforeCloseBlock).toContain("const formData = getCurrentCommunityConfigurationFormData()");
		expect(beforeCloseBlock).toContain("formComputed: formData");
		expect(beforeCloseBlock).toContain("await useDoBeforeClose");
		expect(beforeCloseBlock).not.toContain("communityConfigurationFormInstance.value?.formComputed");

		expect(cancelButtonBlock).toContain("const formData = getCurrentCommunityConfigurationFormData()");
		expect(cancelButtonBlock).toContain("formComputed: formData");
		expect(cancelButtonBlock).toContain("await useDoBeforeClose");
		expect(cancelButtonBlock).not.toContain("communityConfigurationFormInstance.value?.formComputed");

		expect(submitButtonBlock).toContain("const formData = getCurrentCommunityConfigurationFormData()");
		expect(submitButtonBlock).toContain("await createCommunityConfiguration(formData)");
		expect(submitButtonBlock).toContain("...formData");
		expect(submitButtonBlock).not.toContain("communityConfigurationFormInstance.value?.formComputed");
		expect(submitButtonBlock).not.toContain("formComputed.value");
	});
});
