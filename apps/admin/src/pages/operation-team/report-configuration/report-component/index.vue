<script lang="ts" setup>
definePage({
	meta: {
		title: "报表组件",
		icon: "mdi:chart-pie",
		roles: ["开发团队"],
		rank: getRouteRank("operationTeam.reportConfiguration.reportComponent"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import {
	type ReportComponentListItem,
	type ReportComponentQueryParams,
	componentTypeOptions,
	queryMethodOptions,
	type ComponentType,
	type QueryMethod,
} from "@01s-11comm/type";
import { useReportComponentListQuery } from "@/api/operation-team/report-configuration/report-component";
import { type ReportComponentFormProps, defaultForm } from "./components/form";
import type { ReportComponentFormVO } from "@01s-11comm/type";
import ReportComponentForm from "./components/form.vue";

const reportComponentFormInstance = ref<InstanceType<typeof ReportComponentForm> | null>(null);

/** 搜索栏双向绑定变量 */
const plusSearchModelRef: FieldValues & Partial<ReportComponentQueryParams> = {
	componentId: "",
	componentName: "",
	componentType: undefined,
	queryMethod: undefined,
};

/** 重置功能用的默认值 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 响应式搜索变量 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
	pureTableProps,
} = useReportComponentListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "组件ID",
		prop: "componentId",
		width: 120,
	},
	{
		label: "组件名称",
		prop: "componentName",
		width: 150,
	},
	{
		label: "组件类型",
		prop: "componentType",
		width: 120,
	},
	{
		label: "查询方式",
		prop: "queryMethod",
		width: 120,
	},
	{
		label: "描述",
		prop: "description",
		minWidth: 200,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 160,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格组件 配置 */
/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "报表组件",
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 组件ID
	{
		label: "组件ID",
		prop: "componentId",
		valueType: "input",
	},
	// 组件名称
	{
		label: "组件名称",
		prop: "componentName",
		valueType: "input",
	},
	// 组件类型
	{
		label: "组件类型",
		prop: "componentType",
		valueType: "select",
		options: componentTypeOptions,
	},
	// 查询方式
	{
		label: "查询方式",
		prop: "queryMethod",
		valueType: "select",
		options: queryMethodOptions,
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

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: ReportComponentListItem;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

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
	const title = `${modeText.value}报表组件`;

	/** 业务对象 */
	const reportComponentFormVO: ReportComponentFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					componentName: row?.componentName || "",
					componentType: (row?.componentType || "数据卡片") as ComponentType,
					queryMethod: (row?.queryMethod || "sql") as QueryMethod,
					sql: row?.sql || "",
					java: row?.java || "",
					description: row?.description || "",
				})
			: structuredClone(defaultForm);

	/** 表单组件需要的props */
	const props: ReportComponentFormProps = {
		form: reportComponentFormVO,
		defaultValues: reportComponentFormVO,
	};

	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,
		contentRenderer: () =>
			h(ReportComponentForm, {
				ref: reportComponentFormInstance,
				...props,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = reportComponentFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = reportComponentFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					reportComponentFormInstance.value.plusFormInstance.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await reportComponentFormInstance.value.plusFormInstance.handleSubmit();
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
	<section class="index-root">
		<PlusSearch
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
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
