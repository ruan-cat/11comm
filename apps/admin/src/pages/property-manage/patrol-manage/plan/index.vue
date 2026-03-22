<script lang="ts" setup>
definePage({
	meta: {
		// 巡检计划
		title: "property-manage_patrol-manage.plan.pageTitle",
		icon: "mdi:calendar-check",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.patrolManage.plan"),
	},
});

import { h, ref, computed } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { type PatrolPlanFormProps, defaultForm } from "./components/form";
import PatrolPlanForm from "./components/form.vue";
import { usePlanListQuery } from "@/api/property-manage/patrol-manage/plan";
import type { PlanListItem, PlanQueryParams } from "@01s-11comm/type";
import { planStatusOptions } from "@01s-11comm/type";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.plan.fields.planName"))),
		prop: "planName",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.plan.fields.routeName"))),
		prop: "routeName",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.plan.fields.planCycle"))),
		prop: "planCycle",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.plan.fields.checkInMethod"))),
		prop: "checkInMethod",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.plan.fields.dateRange"))),
		prop: "dateRange",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.plan.fields.timeRange"))),
		prop: "timeRange",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.plan.fields.taskAdvanceMinutes")),
		),
		prop: "taskAdvanceMinutes",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.plan.fields.creator"))),
		prop: "creator",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.plan.fields.createTime"))),
		prop: "createTime",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.plan.fields.status"))),
		prop: "status",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.plan.fields.patrolPerson"))),
		prop: "patrolPerson",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置 */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_patrol-manage.plan.tableTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<PlanQueryParams> = {
	planId: "",
	planName: "",
	patrolPerson: "",
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
} = usePlanListQuery(plusSearchDefaultValues);

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
		label: transformI18n($t("property-manage_patrol-manage.plan.fields.planId")),
		prop: "planId",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.plan.fields.planName")),
		prop: "planName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.plan.fields.patrolPerson")),
		prop: "patrolPerson",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.plan.fields.status")),
		prop: "status",
		valueType: "select",
		options: planStatusOptions,
	},
]);

/** 表格搜索栏组件 配置 */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 模式控制 */
const { modeText, setMode, isAdd } = useMode();

/** 表单组件实例 */
const patrolPlanFormInstance = ref<InstanceType<typeof PatrolPlanForm> | null>(null);

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
function openDialog(params: { mode: Mode; row?: PlanListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const patrolPlanFormVO = isAdd.value
		? structuredClone(defaultForm)
		: structuredClone({
				...defaultForm,
				...row,
			});

	/** 表单组件需要的props */
	const formProps: PatrolPlanFormProps = {
		form: patrolPlanFormVO,
		defaultValues: patrolPlanFormVO,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_patrol-manage.plan.dialogs.addTitle"))
				: transformI18n($t("property-manage_patrol-manage.plan.dialogs.editTitle")),
		props: formProps,
		contentRenderer: () =>
			h(PatrolPlanForm, {
				ref: patrolPlanFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = patrolPlanFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = patrolPlanFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index } }) => {
					patrolPlanFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await patrolPlanFormInstance.value?.plusFormInstance?.handleSubmit();
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

<style lang="scss" scoped>
.index-root {
	/* 巡检计划列表页面根容器 */
}
</style>
