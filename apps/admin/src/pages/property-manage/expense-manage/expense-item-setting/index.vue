<script lang="ts" setup>
definePage({
	meta: {
		// 费用项设置
		title: "property-manage_expense-manage.expense-item-setting.pageTitle",
		icon: "mdi:cog-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.expenseItemSetting"),
	},
});

import { ref } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { cloneDeep } from "@pureadmin/utils";
import { type ExpenseItemSettingFormProps, defaultForm } from "./components/form";
import type {
	ExpenseItemSettingFormVO,
	ExpenseItemFeeType as FeeType,
	ExpenseItemIdentifierType as ExpenseIdentifierType,
	ExpenseItemPaymentType as PaymentType,
	ExpenseItemAccountDeductionType as AccountDeductionType,
	ExpenseItemMobilePaymentType as MobilePaymentType,
	ExpenseItemRoundingModeType as RoundingModeType,
	ExpenseItemDecimalPlacesType as DecimalPlacesType,
} from "@01s-11comm/type";
import ExpenseItemSettingForm from "./components/form.vue";
import {
	createExpenseItemSetting,
	deleteExpenseItemSetting,
	getExpenseItemSettingDetail,
	updateExpenseItemSetting,
	useExpenseItemSettingListQuery,
	type ExpenseItemSettingCreatePayload,
	type ExpenseItemSettingDetailVO,
} from "@/api/property-manage/expense-manage/expense-item-setting";
import {
	type ExpenseItemSettingListItem,
	type ExpenseItemSettingQueryParams,
	expenseIdentifierOptions,
	paymentTypeOptions,
	accountDeductionOptions,
} from "@01s-11comm/type";
import { defaultAddDialogParams } from "@/config/constant";

import { useMode, type Mode } from "@/composables/use-mode";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { h } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

/** 表单组件实例 */
const expenseItemSettingFormInstance = ref<InstanceType<typeof ExpenseItemSettingForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ExpenseItemSettingQueryParams> = {
	code: "",
	name: "",
	status: undefined,
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用 TanStack Query 获取数据 */
const {
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useExpenseItemSettingListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.code")),
		),
		prop: "code",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.feeType")),
		),
		prop: "feeType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.expenseItem")),
		),
		prop: "expenseItem",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.expenseIdentifier")),
		),
		prop: "expenseIdentifier",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.paymentType")),
		),
		prop: "paymentType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.paymentCycle")),
		),
		prop: "paymentCycle",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.formula")),
		),
		prop: "formula",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.billingUnitPrice")),
		),
		prop: "billingUnitPrice",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.fixedFee")),
		),
		prop: "fixedFee",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.accountDeduction")),
		),
		prop: "accountDeduction",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.status")),
		),
		prop: "status",
		width: 120,
	},

	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_expense-manage.expense-item-setting.tableTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 费用项ID
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.code")),
		prop: "code",
		valueType: "input",
	},

	// 收费项目
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.expenseItem")),
		prop: "expenseItem",
		valueType: "input",
	},

	// 费用标识
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.expenseIdentifier")),
		prop: "expenseIdentifier",
		valueType: "select",
		options: expenseIdentifierOptions,
	},

	// 付费类型
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.paymentType")),
		prop: "paymentType",
		valueType: "select",
		options: paymentTypeOptions,
	},
	//账户抵扣
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.accountDeduction")),
		prop: "accountDeduction",
		valueType: "select",
		options: accountDeductionOptions,
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	});
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: ExpenseItemSettingListItem;
}

const { mode, setMode, isAdd, isEdit } = useMode();

function buildExpenseItemSettingPayload(
	form: ExpenseItemSettingFormVO,
	row?: ExpenseItemSettingListItem,
): ExpenseItemSettingCreatePayload {
	const code = row?.code || createExpenseItemSettingCode();

	return {
		code,
		feeType: form.feeType,
		expenseItem: form.expenseItem,
		expenseIdentifier: code,
		paymentType: toApiPaymentType(form.paymentType),
		paymentCycle: form.paymentCycle,
		prepaymentPeriod: form.prepaymentPeriod,
		unit: form.unit,
		accountDeduction: toEnabledFlag(form.accountDeduction),
		mobilePayment: toEnabledFlag(form.mobilePayment),
		roundingMode: toApiRoundingMode(form.roundingMode),
		decimalPlaces: toApiDecimalPlaces(form.decimalPlaces),
		status: toApiStatus(form.status),
		formula: form.formula,
		billingUnitPrice: form.billingUnitPrice,
		fixedFee: form.fixedFee,
	};
}

function createExpenseItemSettingCode(): string {
	return `FEE_${Date.now()}`;
}

function toEnabledFlag(value: string): "enabled" | "disabled" {
	return value === "否" ? "disabled" : "enabled";
}

function toApiStatus(value: string): "enabled" | "disabled" {
	return value === "禁用" || value === "disabled" ? "disabled" : "enabled";
}

function toApiPaymentType(value: string): string {
	if (value === "后付费") {
		return "postpaid";
	}

	return "prepaid";
}

function toApiRoundingMode(value: string): "round" | "ceil" | "floor" {
	if (value === "向上取整") {
		return "ceil";
	}
	if (value === "向下取整") {
		return "floor";
	}

	return "round";
}

function toApiDecimalPlaces(value: string): number {
	if (value === "取整") {
		return 0;
	}

	const matched = value.match(/\d+/);
	return matched ? Number(matched[0]) : 2;
}

function toFormVO(item?: ExpenseItemSettingDetailVO | ExpenseItemSettingListItem | null): ExpenseItemSettingFormVO {
	if (!item) {
		return cloneDeep(defaultForm);
	}

	return {
		...cloneDeep(defaultForm),
		feeType: toFormFeeType(item.feeType),
		expenseItem: item.expenseItem || "",
		expenseIdentifier: toFormExpenseIdentifier(item.expenseIdentifier),
		paymentType: toFormPaymentType(item.paymentType),
		paymentCycle: item.paymentCycle || "1",
		prepaymentPeriod: "30",
		unit: "元/平方米·月",
		accountDeduction: toFormYesNo(item.accountDeduction),
		mobilePayment: toFormYesNo("mobilePayment" in item ? item.mobilePayment : undefined),
		roundingMode: toFormRoundingMode("roundingMode" in item ? item.roundingMode : undefined),
		decimalPlaces: toFormDecimalPlaces("decimalPlaces" in item ? item.decimalPlaces : undefined),
		status: toFormStatus(item.status),
		formula: item.formula || "",
		billingUnitPrice: item.billingUnitPrice || "",
		fixedFee: item.fixedFee || "",
	};
}

function toFormFeeType(value: string): FeeType {
	if (value === "PROPERTY") {
		return "物业费";
	}

	return (value || "物业费") as FeeType;
}

function toFormExpenseIdentifier(value: string): ExpenseIdentifierType {
	if (value === "一次性费用") {
		return "一次性费用";
	}

	return "周期性费用";
}

function toFormPaymentType(value: string): PaymentType {
	if (value === "postpaid" || value === "后付费") {
		return "后付费";
	}

	return "预付费";
}

function toFormYesNo(value: unknown): "是" | "否" {
	return value === false || value === "disabled" || value === "否" ? "否" : "是";
}

function toFormRoundingMode(value: unknown): RoundingModeType {
	if (value === "ceil" || value === "向上取整") {
		return "向上取整";
	}
	if (value === "floor" || value === "向下取整") {
		return "向下取整";
	}

	return "四舍五入";
}

function toFormDecimalPlaces(value: unknown): DecimalPlacesType {
	const normalized = String(value ?? "2");
	if (normalized === "0" || normalized === "取整") {
		return "取整";
	}

	return `${normalized.replace(/\D/g, "") || "2"}位` as DecimalPlacesType;
}

function toFormStatus(value: string): string {
	return value === "disabled" || value === "禁用" ? "禁用" : "启用";
}

function getErrorMessage(error: unknown, fallback: string): string {
	if (error && typeof error === "object") {
		const record = error as {
			message?: string;
			response?: { data?: { message?: string; data?: { reason?: string } } };
			data?: { reason?: string };
		};

		return (
			record.response?.data?.data?.reason ||
			record.response?.data?.message ||
			record.data?.reason ||
			record.message ||
			fallback
		);
	}

	return fallback;
}

/** 打开弹框 */
async function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	const detail =
		isEdit.value && row?.id
			? await getExpenseItemSettingDetail({ id: row.id })
					.then((response) => response.data)
					.catch(() => row)
			: null;

	/** 业务对象 */
	const formVO: ExpenseItemSettingFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? toFormVO(detail ?? row)
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const props: ExpenseItemSettingFormProps = {
		form: formVO,
		defaultValues: formVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_expense-manage.expense-item-setting.dialogs.addTitle"))
				: transformI18n($t("property-manage_expense-manage.expense-item-setting.dialogs.editTitle")),
		props,

		contentRenderer: () =>
			h(ExpenseItemSettingForm, {
				ref: expenseItemSettingFormInstance,
				...props,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = expenseItemSettingFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** console.log(options, index, button); */
					const formComputed = expenseItemSettingFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					/** 手动重置表单 */
					expenseItemSettingFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await expenseItemSettingFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
						try {
							const formComputed = expenseItemSettingFormInstance.value?.formComputed;
							if (!formComputed) {
								return;
							}

							const formValue =
								typeof formComputed === "object" && "value" in formComputed ? formComputed.value : formComputed;
							const payload = buildExpenseItemSettingPayload(formValue as ExpenseItemSettingFormVO, row);
							if (isAdd.value) {
								await createExpenseItemSetting(payload);
								ElMessage.success("创建成功");
							} else if (row?.id) {
								await updateExpenseItemSetting({ ...payload, id: row.id });
								ElMessage.success("更新成功");
							}

							closeDialog(options, index);
							await doFetch();
						} catch (error) {
							ElMessage.error(getErrorMessage(error, "保存失败"));
						} finally {
							button.btn.loading = false;
						}
					}
				},
			},
		],
	});
}

async function handleDelete(row: ExpenseItemSettingListItem) {
	try {
		await ElMessageBox.confirm("当前后端策略不支持真实删除，将仅验证删除策略响应。是否继续？", "删除策略验证", {
			type: "warning",
		});

		const response = await deleteExpenseItemSetting({ id: row.id });
		const reason = response.data?.reason || response.message || "当前收费项目设置不支持删除";
		ElMessage.warning(reason);
	} catch (error) {
		if (String(getErrorMessage(error, "")).includes("cancel")) {
			return;
		}
		ElMessage.error(getErrorMessage(error, "删除策略验证失败"));
	}
}
</script>

<template>
	<section :key="locale" class="index-root">
		<PlusSearch
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			:search-text="plusSearchButtonTexts.searchText"
			:reset-text="plusSearchButtonTexts.resetText"
			@search="handleSearch"
			@reset="handleReSearch"
		/>

		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
			<template #buttons>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("common.buttons.add")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					:loading="isFetching"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info"> {{ transformI18n($t("common.buttons.info")) }} </ElButton>
						<ElButton type="danger" @click="handleDelete(row)">
							{{ transformI18n($t("common.buttons.del")) }}
						</ElButton>
					</template>
				</PureTable>
			</template>
		</PureTableBar>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
