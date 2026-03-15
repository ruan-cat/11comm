<script lang="ts" setup>
definePage({
	meta: {
		// 抄表类型
		title: "property-manage_expense-manage.meter-reading-type.pageTitle",
		icon: "mdi:gauge",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.meterReadingType"),
	},
});

import { h, ref, computed } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { cloneDeep } from "@pureadmin/utils";
import { useMode, type Mode } from "@/composables/use-mode";

import { type MeterTypeFormProps, defaultForm } from "./components/form";
import type { MeterReadingTypeFormVO } from "@01s-11comm/type";
import MeterTypeForm from "./components/form.vue";
import { useMeterReadingTypeListQuery } from "@/api/property-manage/expense-manage/meter-reading-type";
import {
	type MeterReadingTypeListItem,
	type MeterReadingTypeQueryParams,
	meterReadingTypeStatusOptions,
} from "@01s-11comm/type";
import { useToggle } from "@vueuse/core";
import { consola } from "consola";
import { defaultAddDialogParams } from "@/config/constant";

import { addDialog, closeDialog } from "@/components/ReDialog";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const meterTypeFormInstance = ref<InstanceType<typeof MeterTypeForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<MeterReadingTypeQueryParams> = {
	name: "",
	description: "",
	status: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
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
} = useMeterReadingTypeListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.meter-reading-type.fields.name")),
		),
		prop: "name",
		width: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.meter-reading-type.fields.description")),
		),
		prop: "description",
		width: 300,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.meter-reading-type.fields.status")),
		),
		prop: "status",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.meter-reading-type.fields.createTime")),
		),
		prop: "createTime",
		width: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.meter-reading-type.fields.remark")),
		),
		prop: "remark",
		width: 200,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 名称 */
	{
		label: transformI18n($t("property-manage_expense-manage.meter-reading-type.search.name")),
		prop: "name",
		valueType: "input",
	},
	/** 说明 */
	{
		label: transformI18n($t("property-manage_expense-manage.meter-reading-type.search.description")),
		prop: "description",
		valueType: "input",
	},
	/** 状态 */
	{
		label: transformI18n($t("property-manage_expense-manage.meter-reading-type.search.status")),
		prop: "status",
		valueType: "select",
		options: meterReadingTypeStatusOptions,
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
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/** 表格操作栏组件 配置  */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_expense-manage.meter-reading-type.tableTitle")),
	columns: columns.value,
}));

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
function openDialog(params: { mode: Mode; row?: MeterReadingTypeListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const formVO: MeterReadingTypeFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					name: row?.name || "",
					description: row?.description || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: MeterTypeFormProps = {
		form: formVO,
		defaultValues: formVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_expense-manage.meter-reading-type.dialogs.addTitle"))
				: transformI18n($t("property-manage_expense-manage.meter-reading-type.dialogs.editTitle")),
		props: formProps,

		contentRenderer: () =>
			h(MeterTypeForm, {
				ref: meterTypeFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = meterTypeFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = meterTypeFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					meterTypeFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await meterTypeFormInstance.value?.plusFormInstance?.handleSubmit();
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
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("common.buttons.add")) }}
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
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
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
