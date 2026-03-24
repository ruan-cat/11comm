<script lang="ts" setup>
definePage({
	meta: {
		// 优惠申请
		title: "property-manage_expense-manage.discount-apply.pageTitle",
		icon: "mdi:percent-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.discountApply"),
	},
});

import { ref } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { cloneDeep } from "@pureadmin/utils";
import { useMode, type Mode } from "@/composables/use-mode";

import { type DiscountApplyFormProps, defaultForm } from "./components/form";
import type { DiscountApplyFormVO } from "@01s-11comm/type";
import DiscountApplyForm from "./components/form.vue";
import { useDiscountApplyListQuery } from "@/api/property-manage/expense-manage/discount-apply";
import {
	type DiscountApplyListItem,
	type DiscountApplyQueryParams,
	applicationTypeOptions,
	usageStatusOptions,
} from "@01s-11comm/type";
import { useToggle } from "@vueuse/core";
import { consola } from "consola";
import { defaultAddDialogParams } from "@/config/constant";

import { addDialog, closeDialog } from "@/components/ReDialog";
import { h } from "vue";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<DiscountApplyQueryParams> = {
	house: "",
	discountName: "",
	applicationType: "",
	status: "",
	usageStatus: "",
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
} = useDiscountApplyListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{ ...defaultPureTableIndexColumn, headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))) },
	{
		prop: "house",
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.discount-apply.fields.house")),
		),
		width: 200,
	},
	{
		prop: "discountId",
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.discount-apply.fields.discountId")),
		),
		width: 120,
	},
	{
		prop: "discountName",
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.discount-apply.fields.discountName")),
		),
		width: 120,
	},
	{
		prop: "applicationType",
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.discount-apply.fields.applicationType")),
		),
		width: 120,
	},
	{
		prop: "applicant",
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.discount-apply.fields.applicant")),
		),
		width: 120,
	},
	{
		prop: "applicantPhone",
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.discount-apply.fields.applicantPhone")),
		),
		width: 120,
	},
	{
		prop: "startTime",
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.discount-apply.fields.startTime")),
		),
		width: 120,
	},
	{
		prop: "endTime",
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.discount-apply.fields.endTime")),
		),
		width: 120,
	},
	{
		prop: "status",
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.discount-apply.fields.status")),
		),
		width: 120,
	},
	{
		prop: "createTime",
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.discount-apply.fields.createTime")),
		),
		width: 120,
	},
	{
		prop: "usageStatus",
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.discount-apply.fields.usageStatus")),
		),
		width: 120,
	},
	{
		prop: "returnType",
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.discount-apply.fields.returnType")),
		),
		width: 120,
	},
	{
		prop: "returnAmount",
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.discount-apply.fields.returnAmount")),
		),
		width: 120,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_expense-manage.discount-apply.tableTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 房屋
	{
		label: transformI18n($t("property-manage_expense-manage.discount-apply.search.house")),
		prop: "house",
		valueType: "input",
	},
	// 申请类型
	{
		label: transformI18n($t("property-manage_expense-manage.discount-apply.search.applicationType")),
		prop: "applicationType",
		valueType: "select",
		options: applicationTypeOptions,
	},
	// 使用状态
	{
		label: transformI18n($t("property-manage_expense-manage.discount-apply.search.usageStatus")),
		prop: "usageStatus",
		valueType: "select",
		options: usageStatusOptions,
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

// 弹框相关功能
const DiscountApplyFormInstance = ref<InstanceType<typeof DiscountApplyForm> | null>(null);
/** 模式控制 */
const { setMode, isAdd, isEdit } = useMode();

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
function openDialog(params: { mode: Mode; row?: DiscountApplyListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = () =>
		isAdd.value
			? transformI18n($t("property-manage_expense-manage.discount-apply.dialogs.addTitle"))
			: transformI18n($t("property-manage_expense-manage.discount-apply.dialogs.editTitle"));

	/** 业务对象 */
	const formVO: DiscountApplyFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					house: row?.house || "",
					applicationType: (row?.applicationType as DiscountApplyFormVO["applicationType"]) || "空置房",
					expenseItem: row?.discountName || "",
					applicant: row?.applicant || "",
					applicantPhone: row?.applicantPhone || "",
					startTime: row?.startTime || "",
					endTime: row?.endTime || "",
					description: row?.discountName || "",
					material: "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: DiscountApplyFormProps = {
		form: formVO,
		defaultValues: formVO,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,
		contentRenderer: () =>
			h(DiscountApplyForm, {
				ref: DiscountApplyFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = DiscountApplyFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** console.log(options, index, button); */
					const formComputed = DiscountApplyFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					/** 手动重置表单 */
					DiscountApplyFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await DiscountApplyFormInstance.value?.plusFormInstance?.handleSubmit();
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
				<ElButton type="info">
					{{ transformI18n($t("property-manage_expense-manage.discount-apply.discountType")) }}
				</ElButton>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("property-manage_expense-manage.discount-apply.phoneApply")) }}
				</ElButton>
				<ElButton type="info">
					{{ transformI18n($t("property-manage_expense-manage.discount-apply.export")) }}
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
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="danger">
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
