import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

/** 页面接线测试通过读取源码校验正式 API hook 和弹窗提交链路，避免重新引入 mock 延迟逻辑。 */
const pageSourcePath = resolve(__dirname, "../index.vue");
const formSourcePath = resolve(__dirname, "../components/form.ts");
const formVueSourcePath = resolve(__dirname, "../components/form.vue");

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

/** 定位页面上的异步动作函数，确保详情、编辑和删除分别接入正确接口。 */
function extractAsyncFunctionBlock(source: string, functionName: string) {
	const functionStart = source.indexOf(`async function ${functionName}`);
	expect(functionStart).toBeGreaterThanOrEqual(0);

	return extractBraceBlock(source, functionStart);
}

/** 定位普通函数块，主要用于校验弹窗表单 payload 解包 helper。 */
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

/** 提取指定 footer 按钮逻辑，校验取消和重置仍复用统一的表单快照。 */
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

describe("config-manage item page api wiring", () => {
	test("页面详情、编辑、删除动作必须接真实 item API", () => {
		const source = readFileSync(pageSourcePath, "utf8");
		const viewDetailsBlock = extractAsyncFunctionBlock(source, "viewConfigItemDetails");
		const editConfigItemBlock = extractAsyncFunctionBlock(source, "editConfigItem");
		const deleteConfigItemBlock = extractAsyncFunctionBlock(source, "deleteConfigItemRow");

		expect(viewDetailsBlock).toContain("await getConfigItemDetail");
		expect(viewDetailsBlock).toMatch(/openDialog\(\s*{\s*mode:\s*["']info["']/);
		expect(viewDetailsBlock).not.toContain("createConfigItem");
		expect(viewDetailsBlock).not.toContain("updateConfigItem");
		expect(viewDetailsBlock).not.toContain("deleteConfigItem(");

		expect(editConfigItemBlock).toContain("await getConfigItemDetail");
		expect(editConfigItemBlock).toMatch(/openDialog\(\s*{\s*mode:\s*["']edit["']/);
		expect(editConfigItemBlock).not.toContain("createConfigItem");
		expect(editConfigItemBlock).not.toContain("deleteConfigItem(");

		expect(deleteConfigItemBlock).toContain("ElMessageBox.confirm");
		expect(deleteConfigItemBlock).toContain("await deleteConfigItem");
		expect(deleteConfigItemBlock).toContain("await doFetch()");
		expect(deleteConfigItemBlock).not.toContain("createConfigItem");
		expect(deleteConfigItemBlock).not.toContain("updateConfigItem");

		expect(source).toMatch(/<ElButton type="info" @click="viewConfigItemDetails\(row\)">/);
		expect(source).toMatch(/<ElButton type="warning" @click="editConfigItem\(row\)">/);
		expect(source).toMatch(/<ElButton type="danger" @click="deleteConfigItemRow\(row\)">/);
		expect(source).toContain('prop: "dictionaryId"');
		expect(source).toContain('prop: "itemName"');
		expect(source).toContain('prop: "itemCode"');
		expect(source).toContain('prop: "sortOrder"');
		expect(source).toContain('prop: "isDefault"');
		expect(source).not.toContain('prop: "configName"');
		expect(source).not.toContain('prop: "configCode"');
		expect(source).not.toContain('prop: "configType"');
		expect(source).not.toContain('prop: "configValue"');
		expect(source).not.toContain('prop: "description"');
		expect(source).not.toContain('prop: "isEnabled"');
		expect(source).not.toContain('prop: "creator"');
		expect(source).not.toContain("testAsync");
		expect(source).not.toContain("sleep(1300)");
		expect(source).not.toContain("consola");
	});

	test("弹窗提交 add/edit 必须调用 create/update 并刷新列表，info 模式不提交", () => {
		const source = readFileSync(pageSourcePath, "utf8");
		const submitButtonBlock = extractSubmitButtonBlock(source);

		expect(source).toMatch(/openDialog\(\s*{\s*mode:\s*["']add["']/);
		expect(submitButtonBlock).toMatch(/if\s*\(\s*isInfo\.value\s*\)\s*{\s*return;/);
		expect(submitButtonBlock).toMatch(/if\s*\(\s*isAdd\.value\s*\)\s*{\s*await createConfigItem/);
		expect(submitButtonBlock).toMatch(
			/}\s*else if\s*\(\s*isEdit\.value\s*&&\s*row\?\.id\s*\)\s*{\s*await updateConfigItem/,
		);
		expect(submitButtonBlock).toMatch(/closeDialog\(\s*options,\s*index\s*\);\s*await doFetch\(\)/);
		expect(source).not.toContain("useToggle");
		expect(source).not.toContain("testAsync");
		expect(source).not.toContain("simulate");
	});

	test("配置项表单字段必须对齐真实 dictionary item API", () => {
		const formSource = readFileSync(formSourcePath, "utf8");
		const formVueSource = readFileSync(formVueSourcePath, "utf8");

		expect(formSource).toContain("DictionaryItemFormData");
		expect(formSource).toContain("dictionaryId");
		expect(formSource).toContain("itemName");
		expect(formSource).toContain("itemCode");
		expect(formSource).toContain("sortOrder");
		expect(formSource).toContain("isDefault");
		expect(formSource).not.toContain("ConfigItemFormVO");
		expect(formSource).not.toContain("configItemName:");
		expect(formSource).not.toContain("configItemCode:");
		expect(formSource).not.toContain("configItemType:");
		expect(formSource).not.toContain("configItemValue:");
		expect(formSource).not.toContain("configItemDescription:");
		expect(formSource).not.toContain("isEnabled:");
		expect(formSource).not.toContain("remark:");

		expect(formVueSource).toContain('prop: "dictionaryId"');
		expect(formVueSource).toContain('prop: "itemName"');
		expect(formVueSource).toContain('prop: "itemCode"');
		expect(formVueSource).toContain('prop: "sortOrder"');
		expect(formVueSource).toContain('prop: "isDefault"');
		expect(formVueSource).not.toContain('prop: "configItemName"');
		expect(formVueSource).not.toContain('prop: "configItemCode"');
		expect(formVueSource).not.toContain('prop: "configItemType"');
		expect(formVueSource).not.toContain('prop: "configItemValue"');
		expect(formVueSource).not.toContain('prop: "configItemDescription"');
		expect(formVueSource).not.toContain('prop: "isEnabled"');
		expect(formVueSource).not.toContain('prop: "remark"');
	});

	test("弹窗关闭、取消和提交必须共用 helper 解包 DictionaryItemFormData", () => {
		const source = readFileSync(pageSourcePath, "utf8");
		const helperBlock = extractFunctionBlock(source, "getCurrentDictionaryItemFormData");
		const beforeCloseBlock = extractDialogBeforeCloseBlock(source);
		const cancelButtonBlock = extractFooterButtonBlock(source, "common.buttons.cancel");
		const submitButtonBlock = extractSubmitButtonBlock(source);

		expect(helperBlock).toMatch(/DictionaryItemFormData\s*\|\s*undefined/);
		expect(helperBlock).toContain("configItemFormInstance.value?.formComputed");
		expect(helperBlock).toMatch(/typeof\s+formComputed\s*===\s*["']object["']/);
		expect(helperBlock).toMatch(/["']value["']\s+in\s+formComputed/);
		expect(helperBlock).toMatch(/const\s+payload\s*=/);
		expect(helperBlock).toMatch(/cloneDeep\(\s*payload\s*\)\s*as\s*DictionaryItemFormData/);

		expect(beforeCloseBlock).toContain("const formData = getCurrentDictionaryItemFormData()");
		expect(beforeCloseBlock).toContain("formComputed: formData");
		expect(beforeCloseBlock).toContain("await useDoBeforeClose");
		expect(beforeCloseBlock).not.toContain("configItemFormInstance.value?.formComputed");
		expect(beforeCloseBlock).not.toContain("formComputed, index, options");

		expect(cancelButtonBlock).toContain("const formData = getCurrentDictionaryItemFormData()");
		expect(cancelButtonBlock).toContain("formComputed: formData");
		expect(cancelButtonBlock).toContain("await useDoBeforeClose");
		expect(cancelButtonBlock).not.toContain("configItemFormInstance.value?.formComputed");
		expect(cancelButtonBlock).not.toContain("formComputed, index, options");

		expect(submitButtonBlock).toContain("const formData = getCurrentDictionaryItemFormData()");
		expect(submitButtonBlock).toContain("await createConfigItem(formData)");
		expect(submitButtonBlock).toContain("...formData");
		expect(submitButtonBlock).not.toContain("configItemFormInstance.value?.formComputed");
		expect(submitButtonBlock).not.toContain("formComputed.value");
	});
});
