<script lang="ts" setup>
definePage({
	meta: {
		title: "报表组",
		icon: "mdi:group",
		roles: ["开发团队"],
		rank: getRouteRank("operationTeam.reportConfiguration.reportGroup"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useReportGroupListQuery } from "@/api/operation-team/report-configuration/report-group";
import { type ReportGroupFormProps, defaultForm, type 报表组表单_VO } from "./components/form";
import ReportGroupForm from "./components/form.vue";
import { useMode, type Mode } from "@/composables/use-mode";
import type { ReportGroupListItem, ReportGroupQueryParams } from "@01s-11comm/type";

const reportGroupFormInstance = ref<InstanceType<typeof ReportGroupForm> | null>(null);

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
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "组ID",
		prop: "groupId",
		width: 120,
	},
	{
		label: "组名称",
		prop: "name",
		width: 150,
	},
	{
		label: "组url",
		prop: "url",
		minWidth: 200,
	},
	{
		label: "描述",
		prop: "remark",
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

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "报表组",
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 组ID
	{
		label: "组ID",
		prop: "groupId",
		valueType: "input",
	},
	// 组名称
	{
		label: "组名称",
		prop: "name",
		valueType: "input",
	},
	// 组url
	{
		label: "组url",
		prop: "url",
		valueType: "input",
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
	row?: ReportGroupListItem;
}

/** 模式控制 */
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
	const title = `${modeText.value}报表组`;

	/** 业务对象 */
	const 报表组表单_VO: 报表组表单_VO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					组名称: row?.name || "",
					组url: row?.url || "",
					描述: row?.remark || "",
				})
			: structuredClone(defaultForm);

	/** 表单组件需要的props */
	const formProps: ReportGroupFormProps = {
		form: 报表组表单_VO,
		defaultValues: 报表组表单_VO,
	};

	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(ReportGroupForm, {
				ref: reportGroupFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = reportGroupFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = reportGroupFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					reportGroupFormInstance.value.plusFormInstance.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await reportGroupFormInstance.value.plusFormInstance.handleSubmit();
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
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

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
