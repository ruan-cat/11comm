import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

/** 页面接线测试通过读取源码校验正式 API hook 和弹窗提交链路，避免重新引入 mock 密码表单字段。 */
const pageSourcePath = resolve(__dirname, "../index.vue");
const formSourcePath = resolve(__dirname, "../components/form.ts");
const formVueSourcePath = resolve(__dirname, "../components/form.vue");

const realFields = [
	"username",
	"realName",
	"department",
	"changeTime",
	"changeIp",
	"changeType",
	"operator",
	"status",
	"remark",
];

const removedMockTokens = ["testAsync", "sleep(1300)", "consola", "useToggle", "simulate"];
const forbiddenFieldProps = ["password", "oldPassword", "newPassword", "confirmPassword"];

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

/** 定位页面上的异步动作函数，确保删除动作接入真实接口并刷新列表。 */
function extractAsyncFunctionBlock(source: string, functionName: string) {
	const functionStart = source.indexOf(`async function ${functionName}`);
	expect(functionStart).toBeGreaterThanOrEqual(0);

	return extractBraceBlock(source, functionStart);
}

/** 定位普通函数块，主要用于校验详情/编辑入口和表单 payload 解包 helper。 */
function extractFunctionBlock(source: string, functionName: string) {
	const functionStart = source.indexOf(`function ${functionName}`);
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

/** 提取指定 footer 按钮逻辑，校验取消流程仍使用统一的表单快照。 */
function extractFooterButtonBlock(source: string, labelKey: string) {
	const labelStart = source.indexOf(`label: () => transformI18n($t("${labelKey}"))`);
	expect(labelStart).toBeGreaterThanOrEqual(0);

	const btnClickStart = source.indexOf("btnClick:", labelStart);
	expect(btnClickStart).toBeGreaterThanOrEqual(0);

	const handlerStart = source.indexOf("=> {", btnClickStart);
	expect(handlerStart).toBeGreaterThanOrEqual(0);

	return extractBraceBlock(source, handlerStart);
}

/** 提取弹窗关闭前逻辑，校验关闭保护使用同一份解包后的表单数据。 */
function extractDialogBeforeCloseBlock(source: string) {
	const blockStart = source.indexOf("async doBeforeClose");
	expect(blockStart).toBeGreaterThanOrEqual(0);

	const bodyStart = source.indexOf(") {", blockStart);
	expect(bodyStart).toBeGreaterThanOrEqual(0);

	return extractBraceBlock(source, bodyStart);
}

describe("change-password page api wiring", () => {
	test("页面 add/detail/edit/delete 动作必须接真实 change-password caller", () => {
		const source = readFileSync(pageSourcePath, "utf8");
		const viewDetailsBlock = extractFunctionBlock(source, "viewChangePasswordRecordDetails");
		const editBlock = extractFunctionBlock(source, "editChangePasswordRecord");
		const deleteBlock = extractAsyncFunctionBlock(source, "deleteChangePasswordRecordRow");

		expect(source).toMatch(/openDialog\(\s*{\s*mode:\s*["']add["']/);

		expect(viewDetailsBlock).toMatch(/openDialog\(\s*{\s*mode:\s*["']info["']/);
		expect(viewDetailsBlock).not.toContain("createChangePasswordRecord");
		expect(viewDetailsBlock).not.toContain("updateChangePasswordRecord");
		expect(viewDetailsBlock).not.toContain("deleteChangePasswordRecord(");

		expect(editBlock).toMatch(/openDialog\(\s*{\s*mode:\s*["']edit["']/);
		expect(editBlock).not.toContain("createChangePasswordRecord");
		expect(editBlock).not.toContain("deleteChangePasswordRecord(");

		expect(deleteBlock).toContain("ElMessageBox.confirm");
		expect(deleteBlock).toContain("await deleteChangePasswordRecord");
		expect(deleteBlock).toContain("await doFetch()");
		expect(deleteBlock).not.toContain("createChangePasswordRecord");
		expect(deleteBlock).not.toContain("updateChangePasswordRecord");

		expect(source).toMatch(/<ElButton type="primary" @click="openDialog\({ mode: 'add' }\)">/);
		expect(source).toMatch(/<ElButton type="info" @click="viewChangePasswordRecordDetails\(row\)">/);
		expect(source).toMatch(/<ElButton type="warning" @click="editChangePasswordRecord\(row\)">/);
		expect(source).toMatch(/<ElButton type="danger" @click="deleteChangePasswordRecordRow\(row\)">/);

		for (const token of removedMockTokens) {
			expect(source).not.toContain(token);
		}
		expect(source).not.toContain("http://");
		expect(source).not.toContain("https://");
	});

	test("弹窗提交 add/edit 必须调用 create/update 并刷新列表，detail/info 模式不提交", () => {
		const source = readFileSync(pageSourcePath, "utf8");
		const submitButtonBlock = extractSubmitButtonBlock(source);

		expect(submitButtonBlock).toMatch(/if\s*\(\s*isInfo\.value\s*\)\s*{\s*return;/);
		expect(submitButtonBlock).toMatch(/if\s*\(\s*isAdd\.value\s*\)\s*{\s*await createChangePasswordRecord/);
		expect(submitButtonBlock).toMatch(
			/}\s*else if\s*\(\s*isEdit\.value\s*&&\s*row\?\.id\s*\)\s*{\s*await updateChangePasswordRecord/,
		);
		expect(submitButtonBlock).toMatch(/closeDialog\(\s*options,\s*index\s*\);\s*await doFetch\(\)/);
		for (const token of removedMockTokens) {
			expect(submitButtonBlock).not.toContain(token);
		}
	});

	test("payload 和表单字段必须对齐 sm_change_password_records 真实字段", () => {
		const pageSource = readFileSync(pageSourcePath, "utf8");
		const formSource = readFileSync(formSourcePath, "utf8");
		const formVueSource = readFileSync(formVueSourcePath, "utf8");

		expect(formSource).toContain("ChangePasswordRecordFormData");
		expect(pageSource).toContain("ChangePasswordRecordFormData");

		for (const field of realFields) {
			expect(formSource).toContain(`${field}:`);
			expect(formVueSource).toContain(`prop: "${field}"`);
			expect(pageSource).toContain(`${field}:`);
		}

		for (const field of forbiddenFieldProps) {
			expect(formSource).not.toContain(`${field}:`);
			expect(formVueSource).not.toContain(`prop: "${field}"`);
			expect(pageSource).not.toContain(`${field}:`);
		}
	});

	test("弹窗关闭、取消和提交必须共用 helper 解包 ChangePasswordRecordFormData", () => {
		const source = readFileSync(pageSourcePath, "utf8");
		const helperBlock = extractFunctionBlock(source, "getCurrentChangePasswordRecordFormData");
		const beforeCloseBlock = extractDialogBeforeCloseBlock(source);
		const cancelButtonBlock = extractFooterButtonBlock(source, "common.buttons.cancel");
		const submitButtonBlock = extractSubmitButtonBlock(source);

		expect(helperBlock).toMatch(/ChangePasswordRecordFormData\s*\|\s*undefined/);
		expect(helperBlock).toContain("changePasswordRecordFormInstance.value?.formComputed");
		expect(helperBlock).toMatch(/typeof\s+formComputed\s*===\s*["']object["']/);
		expect(helperBlock).toMatch(/["']value["']\s+in\s+formComputed/);
		expect(helperBlock).toMatch(/const\s+payload\s*=/);
		expect(helperBlock).toMatch(/cloneDeep\(\s*payload\s*\)\s*as\s*ChangePasswordRecordFormData/);

		expect(beforeCloseBlock).toContain("const formData = getCurrentChangePasswordRecordFormData()");
		expect(beforeCloseBlock).toContain("formComputed: formData");
		expect(beforeCloseBlock).toContain("await useDoBeforeClose");
		expect(beforeCloseBlock).not.toContain("changePasswordRecordFormInstance.value?.formComputed");

		expect(cancelButtonBlock).toContain("const formData = getCurrentChangePasswordRecordFormData()");
		expect(cancelButtonBlock).toContain("formComputed: formData");
		expect(cancelButtonBlock).toContain("await useDoBeforeClose");
		expect(cancelButtonBlock).not.toContain("changePasswordRecordFormInstance.value?.formComputed");

		expect(submitButtonBlock).toContain("const formData = getCurrentChangePasswordRecordFormData()");
		expect(submitButtonBlock).toContain("await createChangePasswordRecord(formData)");
		expect(submitButtonBlock).toContain("...formData");
		expect(submitButtonBlock).not.toContain("changePasswordRecordFormInstance.value?.formComputed");
		expect(submitButtonBlock).not.toContain("formComputed.value");
	});
});
