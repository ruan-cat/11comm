import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

/** 页面接线测试通过读取源码校验正式 API hook 和弹窗提交链路，避免回退到旧字段。 */
const pageSourcePath = resolve(__dirname, "../index.vue");
const formSourcePath = resolve(__dirname, "../components/form.ts");
const formVueSourcePath = resolve(__dirname, "../components/form.vue");

const realFields = ["configKey", "configValue", "configType", "configDescription", "status"];
const displayOnlyFields = [
	"title",
	"subtitle",
	"shortName",
	"companyName",
	"logoUrl",
	"staticUrl",
	"defaultCommunityCode",
	"ownerTitle",
	"propertyMobileTitle",
	"qqMapKey",
	"mallUrl",
];
const legacyListAliasFields = ["description", "category"];
const removedMockTokens = ["test" + "Async", "sl" + "eep", "con" + "sola", "use" + "Toggle"];

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

	throw new Error("complete block not found");
}

function extractFunctionBlock(source: string, functionName: string) {
	const functionStart = source.indexOf(`function ${functionName}`);
	expect(functionStart).toBeGreaterThanOrEqual(0);

	return extractBraceBlock(source, functionStart);
}

function extractAsyncFunctionBlock(source: string, functionName: string) {
	const functionStart = source.indexOf(`async function ${functionName}`);
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

describe("system-config page api wiring", () => {
	test("page add/info/edit/delete actions must use real system-config callers", () => {
		const source = readFileSync(pageSourcePath, "utf8");
		const viewDetailsBlock = extractFunctionBlock(source, "viewSystemConfigDetails");
		const editBlock = extractFunctionBlock(source, "editSystemConfig");
		const deleteBlock = extractAsyncFunctionBlock(source, "deleteSystemConfigRow");

		expect(source).toMatch(/openDialog\(\s*{\s*mode:\s*["']add["']/);

		expect(viewDetailsBlock).toMatch(/openDialog\(\s*{\s*mode:\s*["']info["']/);
		expect(viewDetailsBlock).not.toContain("createSystemConfig");
		expect(viewDetailsBlock).not.toContain("updateSystemConfig");
		expect(viewDetailsBlock).not.toContain("deleteSystemConfig(");

		expect(editBlock).toMatch(/openDialog\(\s*{\s*mode:\s*["']edit["']/);
		expect(editBlock).not.toContain("createSystemConfig");
		expect(editBlock).not.toContain("deleteSystemConfig(");

		expect(deleteBlock).toContain("ElMessageBox.confirm");
		expect(deleteBlock).toContain("await deleteSystemConfig");
		expect(deleteBlock).toContain("await doFetch()");
		expect(deleteBlock).not.toContain("createSystemConfig");
		expect(deleteBlock).not.toContain("updateSystemConfig");

		expect(source).toMatch(/<ElButton type="primary" @click="openDialog\({ mode: 'add' }\)">/);
		expect(source).toMatch(/<ElButton type="info" @click="viewSystemConfigDetails\(row\)">/);
		expect(source).toMatch(/<ElButton type="warning" @click="editSystemConfig\(row\)">/);
		expect(source).toMatch(/<ElButton type="danger" @click="deleteSystemConfigRow\(row\)">/);

		for (const token of removedMockTokens) {
			expect(source).not.toContain(token);
		}
	});

	test("search form must send real system-config list filters", () => {
		const source = readFileSync(pageSourcePath, "utf8");
		const handleSearchBlock = extractFunctionBlock(source, "handleSearch");
		const handleReSearchBlock = extractFunctionBlock(source, "handleReSearch");

		expect(source).toContain("useSystemConfigListQuery");
		expect(source).toContain("} = useSystemConfigListQuery(plusSearchDefaultValues)");
		expect(source).toContain("type SystemConfigListQueryParams");
		expect(source).toContain("const plusSearchModelRef: FieldValues & Partial<SystemConfigListQueryParams>");
		expect(source).toContain('configKey: ""');
		expect(source).toContain('configType: ""');
		expect(source).toContain('status: ""');
		expect(source).toContain("const plusSearchColumns = computed<PlusColumn[]>");
		expect(source).toContain('prop: "configKey"');
		expect(source).toContain('prop: "configType"');
		expect(source).toContain('prop: "status"');
		expect(source).toContain("<PlusSearch");
		expect(source).toContain('@search="handleSearch"');
		expect(source).toContain('@reset="handleReSearch"');
		expect(handleSearchBlock).toContain("updateParams({ ...plusSearchModel.value, pageIndex: 1 })");
		expect(handleReSearchBlock).toContain("resetParams()");
	});

	test("dialog submit must call create/update and refresh list, while info mode does not submit", () => {
		const source = readFileSync(pageSourcePath, "utf8");
		const submitButtonBlock = extractSubmitButtonBlock(source);

		expect(submitButtonBlock).toMatch(/if\s*\(\s*isInfo\.value\s*\)\s*{\s*return;/);
		expect(submitButtonBlock).toMatch(/if\s*\(\s*isAdd\.value\s*\)\s*{\s*await createSystemConfig/);
		expect(submitButtonBlock).toMatch(
			/}\s*else if\s*\(\s*isEdit\.value\s*&&\s*row\?\.id\s*\)\s*{\s*await updateSystemConfig/,
		);
		expect(submitButtonBlock).toMatch(/closeDialog\(\s*options,\s*index\s*\);\s*await doFetch\(\)/);
		for (const token of removedMockTokens) {
			expect(submitButtonBlock).not.toContain(token);
		}
	});

	test("payload and form fields must match sm_system_configs real CUD fields", () => {
		const pageSource = readFileSync(pageSourcePath, "utf8");
		const formSource = readFileSync(formSourcePath, "utf8");
		const formVueSource = readFileSync(formVueSourcePath, "utf8");
		const toFormDataBlock = extractFunctionBlock(pageSource, "toFormData");

		expect(formSource).toContain("SystemConfigFormData");
		expect(pageSource).toContain("SystemConfigFormData");

		for (const field of realFields) {
			expect(formSource).toContain(`${field}:`);
			expect(formVueSource).toContain(`prop: "${field}"`);
			expect(toFormDataBlock).toContain(`${field}:`);
		}

		for (const field of displayOnlyFields) {
			expect(formSource).not.toContain(`${field}:`);
			expect(formVueSource).not.toContain(`prop: "${field}"`);
			expect(toFormDataBlock).not.toContain(`row?.${field}`);
		}

		for (const field of legacyListAliasFields) {
			expect(formSource).not.toContain(`${field}:`);
			expect(formVueSource).not.toContain(`prop: "${field}"`);
		}

		expect(toFormDataBlock).toContain("row?.configType ?? row?.category");
		expect(toFormDataBlock).toContain("row?.configDescription ?? row?.description");

		expect(formVueSource).toMatch(/prop: "configKey"[\s\S]*required: true/);
		expect(formVueSource).toMatch(/prop: "configValue"[\s\S]*required: true/);
		expect(formVueSource).toMatch(/prop: "configType"[\s\S]*required: true/);
		expect(formVueSource).toMatch(/prop: "status"[\s\S]*required: true/);
		expect(formVueSource).toMatch(/props\.mode === "info"/);
	});

	test("dialog close, cancel and submit must unwrap SystemConfigFormData through the shared helper", () => {
		const source = readFileSync(pageSourcePath, "utf8");
		const helperBlock = extractFunctionBlock(source, "getCurrentSystemConfigFormData");
		const beforeCloseBlock = extractDialogBeforeCloseBlock(source);
		const cancelButtonBlock = extractFooterButtonBlock(source, "common.buttons.cancel");
		const submitButtonBlock = extractSubmitButtonBlock(source);

		expect(helperBlock).toMatch(/SystemConfigFormData\s*\|\s*undefined/);
		expect(helperBlock).toContain("systemConfigFormInstance.value?.formComputed");
		expect(helperBlock).toMatch(/typeof\s+formComputed\s*===\s*["']object["']/);
		expect(helperBlock).toMatch(/["']value["']\s+in\s+formComputed/);
		expect(helperBlock).toMatch(/const\s+payload\s*=/);
		expect(helperBlock).toMatch(/cloneDeep\(\s*payload\s*\)\s*as\s*SystemConfigFormData/);

		expect(beforeCloseBlock).toContain("const formData = getCurrentSystemConfigFormData()");
		expect(beforeCloseBlock).toContain("formComputed: formData");
		expect(beforeCloseBlock).toContain("await useDoBeforeClose");
		expect(beforeCloseBlock).not.toContain("systemConfigFormInstance.value?.formComputed");

		expect(cancelButtonBlock).toContain("const formData = getCurrentSystemConfigFormData()");
		expect(cancelButtonBlock).toContain("formComputed: formData");
		expect(cancelButtonBlock).toContain("await useDoBeforeClose");
		expect(cancelButtonBlock).not.toContain("systemConfigFormInstance.value?.formComputed");

		expect(submitButtonBlock).toContain("const formData = getCurrentSystemConfigFormData()");
		expect(submitButtonBlock).toContain("await createSystemConfig(formData)");
		expect(submitButtonBlock).toContain("...formData");
		expect(submitButtonBlock).not.toContain("systemConfigFormInstance.value?.formComputed");
		expect(submitButtonBlock).not.toContain("formComputed.value");
	});
});
