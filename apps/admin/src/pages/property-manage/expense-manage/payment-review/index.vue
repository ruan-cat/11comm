<script lang="ts" setup>
definePage({
	meta: {
		// 缴费审核
		title: "property-manage_expense-manage.payment-review.pageTitle",
		icon: "mdi:check-circle-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.paymentReview"),
	},
});

import { ref, h } from "vue";
import { sleep } from "@antfu/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { type PaymentReviewFormProps, defaultForm } from "./components/form";
import type { PaymentReviewFormVO } from "@01s-11comm/type";
import 缴费审核Form from "./components/form.vue";
import { useMode, type Mode } from "@/composables/use-mode";
import { usePaymentReviewListQuery } from "@/api/property-manage/expense-manage/payment-review";
import {
	type PaymentReviewListItem,
	type PaymentReviewQueryParams,
	expenseItemOptions,
	paymentReviewAuditStatusOptions,
} from "@01s-11comm/type";
import { useToggle } from "@vueuse/core";
import { consola } from "consola";
import { defaultAddDialogParams } from "@/config/constant";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { cloneDeep } from "@pureadmin/utils";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

/** 模式控制 */
const { setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const 缴费审核FormInstance = ref<InstanceType<typeof 缴费审核Form> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<PaymentReviewQueryParams> = {
	house: "",
	expenseItem: undefined,
	payStatus: undefined,
	auditStatus: undefined,
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

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
} = usePaymentReviewListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.payment-review.fields.house")),
		),
		prop: "house",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.payment-review.fields.expenseItem")),
		),
		prop: "expenseItem",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.payment-review.fields.paymentPeriod")),
		),
		prop: "paymentPeriod",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.payment-review.fields.payableAmount")),
		),
		prop: "payableAmount",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.payment-review.fields.paidAmount")),
		),
		prop: "paidAmount",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.payment-review.fields.operator")),
		),
		prop: "operator",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.payment-review.fields.paymentTime")),
		),
		prop: "paymentTime",
		width: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.payment-review.fields.auditStatus")),
		),
		prop: "auditStatus",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.payment-review.fields.paymentRemark")),
		),
		prop: "paymentRemark",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.payment-review.fields.auditDescription")),
		),
		prop: "auditDescription",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.payment-review.fields.details")),
		),
		prop: "details",
		width: 150,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 320,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_expense-manage.payment-review.tableTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 房屋 */
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.search.house")),
		prop: "house",
		valueType: "input",
	},
	/** 费用项目 */
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.search.expenseItem")),
		prop: "expenseItem",
		valueType: "select",
		options: expenseItemOptions,
	},
	/** 审核状态 */
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.search.auditStatus")),
		prop: "auditStatus",
		valueType: "select",
		options: paymentReviewAuditStatusOptions,
	},
	/** 缴费时间范围 */
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.search.paymentTimeRange")),
		prop: "缴费时间范围",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
			onChange(value: string[] | null) {
				plusSearchModel.value.paymentStartTime = value?.[0] ?? "";
				plusSearchModel.value.paymentEndTime = value?.[1] ?? "";
			},
			onClear() {
				plusSearchModel.value.paymentStartTime = "";
				plusSearchModel.value.paymentEndTime = "";
			},
		},
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	});
}

/** 测试异步函数 */
const [isFetchingT, setIsLoadingT] = useToggle(false);

/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: PaymentReviewListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const paymentReviewFormVO: PaymentReviewFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					house: row?.house || "",
					expenseItem: row?.expenseItem || "",
					paymentPeriod: row?.paymentPeriod || "",
					paymentStartTime: row?.paymentStartTime || "",
					paymentEndTime: row?.paymentEndTime || "",
					payableAmount: row?.payableAmount || "",
					paidAmount: row?.paidAmount || "",
					operator: row?.operator || "",
					paymentTime: row?.paymentTime || "",
					auditStatus: row?.auditStatus || "",
					auditDescription: row?.auditDescription || "",
					paymentRemark: row?.paymentRemark || "",
					details: row?.details || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: PaymentReviewFormProps = {
		form: paymentReviewFormVO,
		defaultValues: paymentReviewFormVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_expense-manage.payment-review.dialogs.addTitle"))
				: transformI18n($t("property-manage_expense-manage.payment-review.dialogs.editTitle")),
		props: formProps,

		contentRenderer: () =>
			h(缴费审核Form, {
				ref: 缴费审核FormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = 缴费审核FormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = 缴费审核FormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					缴费审核FormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await 缴费审核FormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						await doFetch();
					}
				},
			},
		],
	});
}

/** 操作按钮点击处理 */
function handleOperationClick(operation: string, row: PaymentReviewListItem) {
	switch (operation) {
		case "查看详情":
			openDialog({ mode: "info", row });
			break;
		case "审核通过":
			openDialog({ mode: "edit", row });
			break;
		case "审核拒绝":
			openDialog({ mode: "edit", row });
			break;
		case "批量审核":
			openDialog({ mode: "add" });
			break;
		case "导出审核记录":
			console.log(`${operation} 操作`, row);
			break;
		default:
			console.log(`${operation} 操作`, row);
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
				<ElButton type="primary" @click="handleOperationClick('批量审核', {} as PaymentReviewListItem)">
					{{ transformI18n($t("property-manage_expense-manage.payment-review.button.batchAudit")) }}
				</ElButton>
				<ElButton type="info" @click="handleOperationClick('导出审核记录', {} as PaymentReviewListItem)">
					{{ transformI18n($t("property-manage_expense-manage.payment-review.button.exportAuditRecord")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					:loading="isFetching"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton v-if="row.审核状态 === '待审核'" type="primary" @click="handleOperationClick('审核通过', row)">
							{{ transformI18n($t("property-manage_expense-manage.payment-review.button.auditApprove")) }}
						</ElButton>
						<ElButton v-if="row.审核状态 === '待审核'" type="primary" @click="handleOperationClick('审核拒绝', row)">
							{{ transformI18n($t("property-manage_expense-manage.payment-review.button.auditReject")) }}
						</ElButton>
						<ElButton type="info" @click="handleOperationClick('查看详情', row)">
							{{ transformI18n($t("property-manage_expense-manage.payment-review.button.viewDetails")) }}
						</ElButton>
						<ElButton type="info" @click="handleOperationClick('查看凭证', row)">
							{{ transformI18n($t("property-manage_expense-manage.payment-review.button.viewVoucher")) }}
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
