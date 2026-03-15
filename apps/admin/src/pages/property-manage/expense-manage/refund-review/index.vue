<script lang="ts" setup>
definePage({
	meta: {
		// 退费审核
		title: "property-manage_expense-manage.refund-review.pageTitle",
		icon: "mdi:cash-refund",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.refundReview"),
	},
});

import { ref, onMounted, h } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { cloneDeep } from "@pureadmin/utils";
import { type RefundReviewFormProps, defaultForm } from "./components/form";
import RefundReviewForm from "./components/form.vue";
import { useMode, type Mode } from "@/composables/use-mode";
import {
	type RefundReviewListItem,
	type RefundReviewFormVO,
	type RefundReviewQueryParams,
	feeTypeOptions,
	auditStatusOptions,
} from "@01s-11comm/type";
import { useRefundReviewListQuery } from "@/api/property-manage/expense-manage/refund-review";

const { locale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

/** 表单组件实例 */
const refundReviewFormInstance = ref<InstanceType<typeof RefundReviewForm> | null>(null);

/** 模拟异步操作函数 */
const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 * @important
 * 【必须使用 Partial 类型约束】类型定义必须为: FieldValues & Partial<{Page}QueryParams>
 * 【必须在 API Hook 之前声明】此变量必须在调用 use{Page}ListQuery 之前定义
 */
const plusSearchModelRef: FieldValues & Partial<RefundReviewQueryParams> = {
	refundOrderNumber: "",
	paymentOrderNumber: "",
	feeType: "",
	auditStatus: "",
};

/**
 * 表格搜索栏 重置功能用的默认数据
 * @important
 * 【必须在 API Hook 之前声明】此变量必须在调用 use{Page}ListQuery 之前定义
 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/**
 * 表格搜索栏变量 双向绑定的变量 响应式数据
 * @important
 * 【必须在 API Hook 之前声明】此变量必须在调用 use{Page}ListQuery 之前定义
 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useRefundReviewListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.refund-review.fields.refundOrderNumber")),
		),
		prop: "refundOrderNumber",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.refund-review.fields.paymentOrderNumber")),
		),
		prop: "paymentOrderNumber",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.refund-review.fields.feeType")),
		),
		prop: "feeType",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.refund-review.fields.payer")),
		),
		prop: "payer",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.refund-review.fields.payablePaidAmount")),
		),
		prop: "payablePaidAmount",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.refund-review.fields.applyTime")),
		),
		prop: "applyTime",
		width: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.refund-review.fields.refundReason")),
		),
		prop: "refundReason",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.refund-review.fields.applicant")),
		),
		prop: "applicant",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.refund-review.fields.auditStatus")),
		),
		prop: "auditStatus",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.refund-review.fields.auditor")),
		),
		prop: "auditor",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 280,
		fixed: "right",
		slot: "operation",
	},
]);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/** 表格搜索栏组件 配置  */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_expense-manage.refund-review.search.refundOrderNumber")),
		prop: "refundOrderNumber",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.refund-review.search.paymentOrderNumber")),
		prop: "paymentOrderNumber",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.refund-review.search.feeType")),
		prop: "feeType",
		valueType: "select",
		options: feeTypeOptions,
	},
	{
		label: transformI18n($t("property-manage_expense-manage.refund-review.search.auditStatus")),
		prop: "auditStatus",
		valueType: "select",
		options: auditStatusOptions,
	},
]);

/** 表格操作栏组件 配置 */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_expense-manage.refund-review.tableTitle")),
	columns: columns.value,
}));

/** 模式控制 */
const { setMode, isAdd, isEdit } = useMode();

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: RefundReviewListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const formData: RefundReviewFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					refundOrderNumber: row?.refundOrderNumber || "",
					paymentOrderNumber: row?.paymentOrderNumber || "",
					feeType: row?.feeType || "",
					payer: row?.payer || "",
					paymentPeriod: row?.paymentPeriod || "",
					payablePaidAmount: row?.payablePaidAmount || "",
					applyTime: row?.applyTime || "",
					refundReason: row?.refundReason || "",
					applicant: row?.applicant || "",
					auditStatus: row?.auditStatus || "",
					auditor: row?.auditor || "",
					auditRemark: "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: RefundReviewFormProps = {
		form: formData,
		defaultValues: formData,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	/** 弹框标题 */
	const title = () => {
		if (isAdd.value) {
			return transformI18n($t("property-manage_expense-manage.refund-review.dialogs.addTitle"));
		}
		if (isEdit.value) {
			return transformI18n($t("property-manage_expense-manage.refund-review.dialogs.editTitle"));
		}
		return transformI18n($t("property-manage_expense-manage.refund-review.dialogs.editTitle"));
	};

	addDialog({
		...defaultAddDialogParams,
		title,
		props,
		contentRenderer: () =>
			h(RefundReviewForm, {
				ref: refundReviewFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = refundReviewFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = refundReviewFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					refundReviewFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await refundReviewFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
					}
				},
			},
		],
	});
}

onMounted(async () => {
	// TanStack Query 会自动加载数据，无需手动调用
});
</script>

<template>
	<section :key="locale" class="index-root">
		<PlusSearch
			:key="locale"
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
					{{ transformI18n($t("common.buttons.batchAudit")) }}
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
						<ElButton type="info">{{
							transformI18n($t("property-manage_expense-manage.refund-review.button.overduePayment"))
						}}</ElButton>
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="info">{{
							transformI18n($t("property-manage_expense-manage.refund-review.button.viewFee"))
						}}</ElButton>
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
