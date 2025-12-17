<script lang="ts" setup>
definePage({
	meta: {
		title: "缴费审核",
		icon: "mdi:check-circle-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.paymentReview"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type PaymentReviewFormProps, defaultForm, type PaymentReviewFormVO } from "./components/form";
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
import { cloneDeep } from "lodash-es";
import { consola } from "consola";
import { defaultAddDialogParams } from "@/config/constant";

import { addDialog, closeDialog } from "@/components/ReDialog";
import { h } from "vue";

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const 缴费审核FormInstance = ref<InstanceType<typeof 缴费审核Form> | null>(null);

/** 使用 TanStack Query 获取数据 */
const { tableData, total, pageIndex, pageSize, isLoading, queryParams, updateParams, resetParams, refetch } =
	usePaymentReviewListQuery();

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "房屋",
		prop: "house",
		width: 100,
	},
	{
		label: "费用项目",
		prop: "expenseItem",
		width: 100,
	},
	{
		label: "付费周期",
		prop: "paymentPeriod",
		width: 120,
	},
	{
		label: "应付金额",
		prop: "payableAmount",
		width: 100,
	},
	{
		label: "实付金额",
		prop: "paidAmount",
		width: 100,
	},
	{
		label: "操作员工",
		prop: "operator",
		width: 100,
	},
	{
		label: "缴费时间",
		prop: "paymentTime",
		width: 180,
	},
	{
		label: "审核状态",
		prop: "auditStatus",
		width: 100,
	},
	{
		label: "缴费备注",
		prop: "paymentRemark",
		width: 150,
	},
	{
		label: "审核说明",
		prop: "auditDescription",
		width: 150,
	},
	{
		label: "详情",
		prop: "details",
		width: 150,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 320,
		fixed: "right",
		slot: "operation",
	},
]);

/** 分页配置 */
const pagination = computed<PaginationProps>(() => ({
	...defaultPagination,
	pageSize: pageSize.value,
	currentPage: pageIndex.value,
	total: total.value,
}));

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
	} as Partial<PaymentReviewQueryParams>);
}

/** 处理页数变化 */
function handlePageSizeChange(newPageSize: number) {
	pageSize.value = newPageSize;
}

/** 处理页码变化 即后端的 pageIndex */
function handleCurrentPageChange(currentPage: number) {
	pageIndex.value = currentPage;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<PaymentReviewQueryParams> & { 缴费时间范围?: [string, string] } = {
	house: "",
	expenseItem: "",
	auditStatus: "",
	paymentStartTime: "",
	paymentEndTime: "",
	缴费时间范围: ["", ""],
};
/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);
/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 房屋 */
	{
		label: "房屋",
		prop: "house",
		valueType: "input",
	},
	/** 费用项目 */
	{
		label: "费用项目",
		prop: "expenseItem",
		valueType: "select",
		options: expenseItemOptions,
	},
	/** 审核状态 */
	{
		label: "审核状态",
		prop: "auditStatus",
		valueType: "select",
		options: paymentReviewAuditStatusOptions,
	},
	/** 缴费时间范围 */
	{
		label: "缴费时间范围",
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
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

/** 表格配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
	loading: isLoading.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "缴费审核",
	columns: columns.value,
});

/** 测试异步函数 */
const [isLoadingT, setIsLoadingT] = useToggle(false);

/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: PaymentReviewListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}缴费审核`;

	/** 业务对象 */
	const paymentReviewFormVO: PaymentReviewFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? {
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
				}
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
		title,
		props: formProps,

		contentRenderer: () =>
			h(缴费审核Form, {
				ref: 缴费审核FormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = 缴费审核FormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = 缴费审核FormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					缴费审核FormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await 缴费审核FormInstance.value.plusFormInstance.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						await refetch();
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
			// 导出功能，暂时不处理
			console.log(`${operation} 操作`, row);
			break;
		default:
			console.log(`${operation} 操作`, row);
	}
}

onMounted(async () => {
	// TanStack Query will auto-fetch on mount
});
</script>
<template>
	<section class="index-root">
		<PlusSearch
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			@search="handleSearch"
			@reset="handleReSearch"
		/>

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary" @click="handleOperationClick('批量审核', {} as PaymentReviewListItem)">
					{{ transformI18n($t("批量审核")) }}
				</ElButton>
				<ElButton type="info" @click="handleOperationClick('导出审核记录', {} as PaymentReviewListItem)">
					{{ transformI18n($t("导出审核记录")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton v-if="row.审核状态 === '待审核'" type="primary" @click="handleOperationClick('审核通过', row)">
							审核通过
						</ElButton>
						<ElButton v-if="row.审核状态 === '待审核'" type="primary" @click="handleOperationClick('审核拒绝', row)">
							审核拒绝
						</ElButton>
						<ElButton type="info" @click="handleOperationClick('查看详情', row)"> 查看详情 </ElButton>
						<ElButton type="info" @click="handleOperationClick('查看凭证', row)"> 查看凭证 </ElButton>
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
