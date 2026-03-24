<script lang="ts" setup>
definePage({
	meta: {
		// 欠费信息
		title: "property-manage_expense-manage.overdue-payment-information.pageTitle",
		icon: "mdi:alert-circle-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.overduePaymentInformation"),
	},
});

import { ref, h } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { type OverduePaymentInformationFormProps, defaultForm } from "./components/form";
import type { OverduePaymentInformationFormVO } from "@01s-11comm/type";
import OverduePaymentInformationForm from "./components/form.vue";
import { useMode, type Mode } from "@/composables/use-mode";
import { useOverduePaymentInformationListQuery } from "@/api/property-manage/expense-manage/overdue-payment-information";
import {
	type OverduePaymentInformationListItem,
	type OverduePaymentInformationQueryParams,
	chargeObjectOptions,
} from "@01s-11comm/type";
import { consola } from "consola";
import { defaultAddDialogParams } from "@/config/constant";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { cloneDeep } from "@pureadmin/utils";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

/** 模式控制 */
const { setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const overduePaymentInformationFormInstance = ref<InstanceType<typeof OverduePaymentInformationForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues &
	Partial<OverduePaymentInformationQueryParams> & { 欠费时间范围?: [string, string] } = {
	chargeObject: "",
	ownerName: "",
	phoneNumber: "",
	startTime: "",
	endTime: "",
	欠费时间范围: ["", ""],
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
} = useOverduePaymentInformationListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.overdue-payment-information.fields.chargeObject")),
		),
		prop: "chargeObject",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.overdue-payment-information.fields.ownerName")),
		),
		prop: "ownerName",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.overdue-payment-information.fields.phoneNumber")),
		),
		prop: "phoneNumber",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.overdue-payment-information.fields.overdueTimePeriod")),
		),
		prop: "startTime",
		width: 200,
		formatter: (row: OverduePaymentInformationListItem) => `${row.startTime} 至 ${row.endTime}`,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.overdue-payment-information.fields.totalAmount")),
		),
		prop: "totalAmount",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.overdue-payment-information.fields.updateTime")),
		),
		prop: "updateTime",
		width: 180,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 280,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_expense-manage.overdue-payment-information.tableTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 收费对象
	{
		label: transformI18n($t("property-manage_expense-manage.overdue-payment-information.search.chargeObject")),
		prop: "chargeObject",
		valueType: "select",
		options: chargeObjectOptions,
	},
	// 业主名称
	{
		label: transformI18n($t("property-manage_expense-manage.overdue-payment-information.search.ownerName")),
		prop: "ownerName",
		valueType: "input",
	},
	// 手机号
	{
		label: transformI18n($t("property-manage_expense-manage.overdue-payment-information.search.phoneNumber")),
		prop: "phoneNumber",
		valueType: "input",
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
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: OverduePaymentInformationListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const overduePaymentInformationFormVO: OverduePaymentInformationFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					chargeObject: row?.chargeObject || "",
					ownerName: row?.ownerName || "",
					phoneNumber: row?.phoneNumber || "",
					startTime: row?.startTime || "",
					endTime: row?.endTime || "",
					overdueTimeRange: [row?.startTime || "", row?.endTime || ""],
					overdueAmount: row?.totalAmount || "",
					paymentStatus: "未缴费",
					contactAddress: "",
					overdueDescription: "",
				} as OverduePaymentInformationFormVO)
			: cloneDeep({
					...defaultForm,
					chargeObject: row?.chargeObject || "",
					ownerName: row?.ownerName || "",
					phoneNumber: row?.phoneNumber || "",
					startTime: row?.startTime || "",
					endTime: row?.endTime || "",
					overdueTimeRange: [row?.startTime || "", row?.endTime || ""],
					overdueAmount: row?.totalAmount || "",
					paymentStatus: "未缴费",
					contactAddress: "",
					overdueDescription: "",
				} as OverduePaymentInformationFormVO);

	/** 表单组件需要的props */
	const formProps: OverduePaymentInformationFormProps = {
		form: overduePaymentInformationFormVO,
		defaultValues: overduePaymentInformationFormVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_expense-manage.overdue-payment-information.dialogs.addTitle"))
				: transformI18n($t("property-manage_expense-manage.overdue-payment-information.dialogs.editTitle")),
		props: formProps,
		contentRenderer: () =>
			h(OverduePaymentInformationForm, {
				ref: overduePaymentInformationFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = overduePaymentInformationFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = overduePaymentInformationFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button: _button }) => {
					overduePaymentInformationFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await overduePaymentInformationFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
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
function handleOperationClick(operation: string, row: OverduePaymentInformationListItem) {
	switch (operation) {
		case "欠费缴费":
			console.log("欠费缴费操作", row);
			break;
		case "查看详情":
			openDialog({ mode: "info", row });
			break;
		case "查看费用":
			console.log("查看费用操作", row);
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
				<ElButton type="primary">
					{{ transformI18n($t("property-manage_expense-manage.overdue-payment-information.button.overduePayment")) }}
				</ElButton>
				<ElButton type="info">
					{{ transformI18n($t("property-manage_expense-manage.overdue-payment-information.button.exportOverdueList")) }}
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
						<ElButton type="warning" @click="handleOperationClick('欠费缴费', row)">
							{{
								transformI18n($t("property-manage_expense-manage.overdue-payment-information.button.overduePayment"))
							}}
						</ElButton>
						<ElButton type="info" @click="handleOperationClick('查看详情', row)">
							{{ transformI18n($t("property-manage_expense-manage.overdue-payment-information.button.viewDetails")) }}
						</ElButton>
						<ElButton type="primary" @click="handleOperationClick('查看费用', row)">
							{{ transformI18n($t("property-manage_expense-manage.overdue-payment-information.button.viewFee")) }}
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
