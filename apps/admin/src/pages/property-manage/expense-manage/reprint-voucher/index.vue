<script lang="ts" setup>
definePage({
	meta: {
		// 补打收据
		title: "property-manage_expense-manage.reprint-voucher.pageTitle",
		icon: "mdi:receipt-text-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.reprintVoucher"),
	},
});

import { ref, h } from "vue";
import { sleep } from "@antfu/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { type ReprintVoucherFormProps, defaultForm } from "./components/form";
import ReprintVoucherForm from "./components/form.vue";
import type { ReprintVoucherListItem, ReprintVoucherQueryParams } from "@01s-11comm/type";
import { feeTypeOptions } from "@01s-11comm/type";
import { useMode, type Mode } from "@/composables/use-mode";
import { useReprintVoucherListQuery } from "@/api/property-manage/expense-manage/reprint-voucher";
import { useToggle } from "@vueuse/core";
import { consola } from "consola";
import { defaultAddDialogParams } from "@/config/constant";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { cloneDeep } from "@pureadmin/utils";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

/** 模式控制 */
const { setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const reprintVoucherFormInstance = ref<InstanceType<typeof ReprintVoucherForm> | null>(null);

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
 */
const plusSearchModelRef: FieldValues & Partial<ReprintVoucherQueryParams> = {
	name: "",
	status: "",
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
} = useReprintVoucherListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.reprint-voucher.fields.name")),
		),
		prop: "name",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.reprint-voucher.fields.status")),
		),
		prop: "status",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.reprint-voucher.fields.createTime")),
		),
		prop: "createTime",
		width: 180,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置 */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_expense-manage.reprint-voucher.tableTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_expense-manage.reprint-voucher.search.receiptNumber")),
		prop: "receiptNumber",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.reprint-voucher.search.feeType")),
		prop: "feeType",
		valueType: "select",
		options: feeTypeOptions,
	},
	{
		label: transformI18n($t("property-manage_expense-manage.reprint-voucher.search.house")),
		prop: "house",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.reprint-voucher.search.owner")),
		prop: "owner",
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
function openDialog(params: { mode: Mode; row?: ReprintVoucherListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const formData = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					receiptId: row?.id || "",
					receiptNumber: row?.name || "",
					paymentTime: row?.createTime || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: ReprintVoucherFormProps = {
		form: formData,
		defaultValues: formData,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_expense-manage.reprint-voucher.dialogs.addTitle"))
				: transformI18n($t("property-manage_expense-manage.reprint-voucher.dialogs.editTitle")),
		props: formProps,
		contentRenderer: () =>
			h(ReprintVoucherForm, {
				ref: reprintVoucherFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = reprintVoucherFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = reprintVoucherFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					reprintVoucherFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await reprintVoucherFormInstance.value?.plusFormInstance?.handleSubmit();
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
					{{ transformI18n($t("common.buttons.batchReprint")) }}
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
						<ElButton type="primary" @click="openDialog({ mode: 'edit', row })">
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
