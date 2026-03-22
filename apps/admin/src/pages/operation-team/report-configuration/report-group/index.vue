<script lang="ts" setup>
definePage({
	meta: {
		// 报表组
		title: "operationTeam.reportConfiguration.reportGroup.pageTitle",
		icon: "mdi:group",
		roles: ["开发团队"],
		rank: getRouteRank("operationTeam.reportConfiguration.reportGroup"),
	},
});

import { ref, onMounted } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useReportGroupListQuery } from "@/api/operation-team/report-configuration/report-group";
import { type ReportGroupFormProps, defaultForm } from "./components/form";
import type { ReportGroupFormVO } from "@01s-11comm/type";
import ReportGroupForm from "./components/form.vue";
import { useMode, type Mode } from "@/composables/use-mode";
import type { ReportGroupListItem, ReportGroupQueryParams } from "@01s-11comm/type";

const reportGroupFormInstance = ref<InstanceType<typeof ReportGroupForm> | null>(null);
const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ReportGroupQueryParams> = {
	groupId: "",
	name: "",
	url: "",
};

/** 重置功能用的默认值 */
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
} = useReportGroupListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.reportConfiguration.reportGroup.fields.groupId")),
		),
		prop: "groupId",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.reportConfiguration.reportGroup.fields.name")),
		),
		prop: "name",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("operationTeam.reportConfiguration.reportGroup.fields.url"))),
		prop: "url",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.reportConfiguration.reportGroup.fields.remark")),
		),
		prop: "remark",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 160,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("operationTeam.reportConfiguration.reportGroup.pageTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("operationTeam.reportConfiguration.reportGroup.fields.groupId")),
		prop: "groupId",
		valueType: "input",
	},
	{
		label: transformI18n($t("operationTeam.reportConfiguration.reportGroup.fields.name")),
		prop: "name",
		valueType: "input",
	},
	{
		label: transformI18n($t("operationTeam.reportConfiguration.reportGroup.fields.url")),
		prop: "url",
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
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	});
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: ReportGroupListItem;
}

/** 模式控制 */
const { setMode, isAdd, isEdit } = useMode();

const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 业务对象 */
	const reportGroupFormVO: ReportGroupFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					name: row?.name || "",
					url: row?.url || "",
					remark: row?.remark || "",
				})
			: structuredClone(defaultForm);

	/** 表单组件需要的props */
	const formProps: ReportGroupFormProps = {
		form: reportGroupFormVO,
		defaultValues: reportGroupFormVO,
	};

	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () => {
			if (isAdd.value) return transformI18n($t("operationTeam.reportConfiguration.reportGroup.dialogs.addTitle"));
			if (isEdit.value) return transformI18n($t("operationTeam.reportConfiguration.reportGroup.dialogs.editTitle"));
			return transformI18n($t("operationTeam.reportConfiguration.reportGroup.dialogs.infoTitle"));
		},
		props: formProps,
		contentRenderer: () =>
			h(ReportGroupForm, {
				ref: reportGroupFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = reportGroupFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = reportGroupFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					reportGroupFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await reportGroupFormInstance.value?.plusFormInstance?.handleSubmit();
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
	// await loadTableData();
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
