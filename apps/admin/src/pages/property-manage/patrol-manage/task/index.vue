<script lang="ts" setup>
definePage({
	meta: {
		// 巡检任务
		title: "property-manage_patrol-manage.task.pageTitle",
		icon: "mdi:clipboard-list-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.patrolManage.task"),
	},
});

import { ref, computed, h } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { type PatrolTaskFormProps, defaultForm } from "./components/form";
import type { TaskListItem, TaskQueryParams, PatrolTaskFormVO } from "@01s-11comm/type";
import { taskStatusOptions } from "@01s-11comm/type";
import PatrolTaskForm from "./components/form.vue";
import { useTaskListQuery } from "@/api/property-manage/patrol-manage/task";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

/** 模式控制 */
const { modeText, setMode, isAdd } = useMode();

/** 表单组件实例 */
const patrolTaskFormInstance = ref<InstanceType<typeof PatrolTaskForm> | null>(null);

const translatedTaskStatusOptions = computed(() =>
	taskStatusOptions.map((option) => ({
		...option,
		label: transformI18n($t(`property-manage_patrol-manage.task.options.status.${option.value}`)),
	})),
);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.task.fields.taskCode"))),
		prop: "taskCode",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.task.fields.planName"))),
		prop: "planName",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.task.fields.patrolPersonTime")),
		),
		prop: "patrolPersonTime",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.task.fields.actualPatrolTime")),
		),
		prop: "actualPatrolTime",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.task.fields.planPatrolPerson")),
		),
		prop: "planPatrolPerson",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.task.fields.currentPatrolPerson")),
		),
		prop: "currentPatrolPerson",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.task.fields.transferDescription")),
		),
		prop: "transferDescription",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.task.fields.patrolMethod"))),
		prop: "patrolMethod",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.task.fields.status"))),
		prop: "status",
		width: 100,
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
	title: transformI18n($t("property-manage_patrol-manage.task.tableTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<TaskQueryParams> = {
	executor: "",
	patrolStartTime: "",
	patrolEndTime: "",
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
} = useTaskListQuery(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_patrol-manage.task.search.executor")),
		prop: "executor",
		valueType: "input",
	},

	{
		label: transformI18n($t("property-manage_patrol-manage.task.search.patrolStartTime")),
		prop: "patrolStartTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},

	{
		label: transformI18n($t("property-manage_patrol-manage.task.search.patrolEndTime")),
		prop: "patrolEndTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},

	{
		label: transformI18n($t("property-manage_patrol-manage.task.search.status")),
		prop: "status",
		valueType: "select",
		options: translatedTaskStatusOptions.value,
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 测试异步操作函数 */
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
function openDialog(params: { mode: Mode; row?: TaskListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const patrolTaskFormVO: PatrolTaskFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				...row,
			});
	const defaultValues = cloneDeep(patrolTaskFormVO);

	/** 表单组件需要的props */
	const formProps: PatrolTaskFormProps = {
		form: patrolTaskFormVO,
		defaultValues,
	};

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_patrol-manage.task.dialogs.addTitle"))
				: transformI18n($t("property-manage_patrol-manage.task.dialogs.editTitle")),
		props: formProps,
		contentRenderer: () =>
			h(PatrolTaskForm, {
				ref: patrolTaskFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = patrolTaskFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = patrolTaskFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					patrolTaskFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await patrolTaskFormInstance.value?.plusFormInstance?.handleSubmit();
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
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
					</template>
				</PureTable>
			</template>
		</PureTableBar>
	</section>
</template>
