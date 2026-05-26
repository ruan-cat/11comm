import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

/** 页面接线测试通过读取源码校验正式 API hook、顶部卡片刷新和弹窗提交链路。 */
const pageSourcePath = resolve(__dirname, "../index.vue");
const formSourcePath = resolve(__dirname, "../components/form.ts");
const formVueSourcePath = resolve(__dirname, "../components/form.vue");

const realFields = ["protocolType", "protocolTitle", "protocolContent", "version", "status"];
const displayOnlyFields = ["title", "content"];
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

describe("register-protocol page api wiring", () => {
	test("页面 add/info/edit/delete 动作必须接真实 register-protocol caller", () => {
		const source = readFileSync(pageSourcePath, "utf8");
		const viewDetailsBlock = extractFunctionBlock(source, "viewRegisterProtocolDetails");
		const editBlock = extractFunctionBlock(source, "editRegisterProtocol");
		const deleteBlock = extractAsyncFunctionBlock(source, "deleteRegisterProtocolRow");

		expect(source).toMatch(/openDialog\(\s*{\s*mode:\s*["']add["']/);

		expect(viewDetailsBlock).toMatch(/openDialog\(\s*{\s*mode:\s*["']info["']/);
		expect(viewDetailsBlock).not.toContain("createRegisterProtocol");
		expect(viewDetailsBlock).not.toContain("updateRegisterProtocol");
		expect(viewDetailsBlock).not.toContain("deleteRegisterProtocol(");

		expect(editBlock).toMatch(/openDialog\(\s*{\s*mode:\s*["']edit["']/);
		expect(editBlock).not.toContain("createRegisterProtocol");
		expect(editBlock).not.toContain("deleteRegisterProtocol(");

		expect(deleteBlock).toContain("ElMessageBox.confirm");
		expect(deleteBlock).toContain("await deleteRegisterProtocol");
		expect(deleteBlock).toContain("await doFetch()");
		expect(deleteBlock).not.toContain("createRegisterProtocol");
		expect(deleteBlock).not.toContain("updateRegisterProtocol");

		expect(source).toMatch(/<ElButton type="primary" @click="openDialog\({ mode: 'add' }\)">/);
		expect(source).toMatch(/<ElButton type="info" @click="viewRegisterProtocolDetails\(row\)">/);
		expect(source).toMatch(/<ElButton type="warning" @click="editRegisterProtocol\(row\)">/);
		expect(source).toMatch(/<ElButton type="danger" @click="deleteRegisterProtocolRow\(row\)">/);

		for (const token of removedMockTokens) {
			expect(source).not.toContain(token);
		}
		for (const token of forbiddenTokens) {
			expect(source).not.toContain(token);
		}
	});

	test("弹窗提交 add/edit 必须调用 create/update 并刷新列表，info 模式不提交", () => {
		const source = readFileSync(pageSourcePath, "utf8");
		const submitButtonBlock = extractSubmitButtonBlock(source);

		expect(submitButtonBlock).toMatch(/if\s*\(\s*isInfo\.value\s*\)\s*{\s*return;/);
		expect(submitButtonBlock).toMatch(/if\s*\(\s*isAdd\.value\s*\)\s*{\s*await createRegisterProtocol/);
		expect(submitButtonBlock).toMatch(
			/}\s*else if\s*\(\s*isEdit\.value\s*&&\s*row\?\.id\s*\)\s*{\s*await updateRegisterProtocol/,
		);
		expect(submitButtonBlock).toMatch(/closeDialog\(\s*options,\s*index\s*\);\s*await doFetch\(\)/);
		for (const token of removedMockTokens) {
			expect(submitButtonBlock).not.toContain(token);
		}
	});

	test("payload 和表单字段必须对齐 sm_register_protocols 真实字段", () => {
		const pageSource = readFileSync(pageSourcePath, "utf8");
		const formSource = readFileSync(formSourcePath, "utf8");
		const formVueSource = readFileSync(formVueSourcePath, "utf8");

		expect(formSource).toContain("RegisterProtocolFormData");
		expect(pageSource).toContain("RegisterProtocolFormData");

		for (const field of realFields) {
			expect(formSource).toContain(`${field}:`);
			expect(formVueSource).toContain(`prop: "${field}"`);
			expect(pageSource).toContain(`${field}:`);
		}

		for (const field of displayOnlyFields) {
			expect(formSource).not.toContain(`${field}:`);
			expect(formVueSource).not.toContain(`prop: "${field}"`);
		}

		expect(pageSource).toContain("row?.protocolTitle || row?.title");
		expect(pageSource).toContain("row?.protocolContent || row?.content");
		expect(formVueSource).toMatch(/prop: "protocolTitle"[\s\S]*required: true/);
		expect(formVueSource).toMatch(/prop: "protocolContent"[\s\S]*required: true/);
		expect(formVueSource).toMatch(/prop: "status"[\s\S]*required: true/);
		expect(formVueSource).toMatch(/props\.mode === "info"/);
	});

	test("弹窗关闭、取消和提交必须共用 helper 解包 RegisterProtocolFormData", () => {
		const source = readFileSync(pageSourcePath, "utf8");
		const helperBlock = extractFunctionBlock(source, "getCurrentRegisterProtocolFormData");
		const beforeCloseBlock = extractDialogBeforeCloseBlock(source);
		const cancelButtonBlock = extractFooterButtonBlock(source, "common.buttons.cancel");
		const submitButtonBlock = extractSubmitButtonBlock(source);

		expect(helperBlock).toMatch(/RegisterProtocolFormData\s*\|\s*undefined/);
		expect(helperBlock).toContain("registerProtocolFormInstance.value?.formComputed");
		expect(helperBlock).toMatch(/typeof\s+formComputed\s*===\s*["']object["']/);
		expect(helperBlock).toMatch(/["']value["']\s+in\s+formComputed/);
		expect(helperBlock).toMatch(/const\s+payload\s*=/);
		expect(helperBlock).toMatch(/cloneDeep\(\s*payload\s*\)\s*as\s*RegisterProtocolFormData/);

		expect(beforeCloseBlock).toContain("const formData = getCurrentRegisterProtocolFormData()");
		expect(beforeCloseBlock).toContain("formComputed: formData");
		expect(beforeCloseBlock).toContain("await useDoBeforeClose");
		expect(beforeCloseBlock).not.toContain("registerProtocolFormInstance.value?.formComputed");

		expect(cancelButtonBlock).toContain("const formData = getCurrentRegisterProtocolFormData()");
		expect(cancelButtonBlock).toContain("formComputed: formData");
		expect(cancelButtonBlock).toContain("await useDoBeforeClose");
		expect(cancelButtonBlock).not.toContain("registerProtocolFormInstance.value?.formComputed");

		expect(submitButtonBlock).toContain("const formData = getCurrentRegisterProtocolFormData()");
		expect(submitButtonBlock).toContain("await createRegisterProtocol(formData)");
		expect(submitButtonBlock).toContain("...formData");
		expect(submitButtonBlock).not.toContain("registerProtocolFormInstance.value?.formComputed");
		expect(submitButtonBlock).not.toContain("formComputed.value");
	});
});
