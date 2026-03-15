<script lang="ts" setup>
definePage({
	meta: {
		// 巡检点
		title: "property-manage_patrol-manage.point.pageTitle",
		icon: "mdi:map-marker-check",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.patrolManage.point"),
	},
});

import { ref, h } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { type PatrolPointFormProps, defaultForm } from "./components/form";
import type { PointListItem, PointQueryParams, PatrolPointFormVO } from "@01s-11comm/type";
import PatrolPointForm from "./components/form.vue";
import { usePointListQuery } from "@/api/property-manage/patrol-manage/point";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

/** 模式控制 */
const { modeText, setMode, isAdd } = useMode();

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.point.fields.taskDetailId"))),
		prop: "taskDetailId",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.point.fields.patrolPointName")),
		),
		prop: "patrolPointName",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.point.fields.patrolPlanName")),
		),
		prop: "patrolPlanName",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.point.fields.patrolRouteName")),
		),
		prop: "patrolRouteName",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.point.fields.patrolPersonTime")),
		),
		prop: "patrolPersonTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.point.fields.patrolPointTime")),
		),
		prop: "patrolPointTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.point.fields.actualPatrolTime")),
		),
		prop: "actualPatrolTime",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.point.fields.actualCheckInStatus")),
		),
		prop: "actualCheckInStatus",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.point.fields.planPatrolPerson")),
		),
		prop: "planPatrolPerson",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.point.fields.actualPatrolPerson")),
		),
		prop: "actualPatrolPerson",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.point.fields.patrolMethod"))),
		prop: "patrolMethod",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.point.fields.taskStatus"))),
		prop: "taskStatus",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.point.fields.patrolPointStatus")),
		),
		prop: "patrolPointStatus",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.point.fields.patrolSituation")),
		),
		prop: "patrolSituation",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.point.fields.patrolPhotos"))),
		prop: "patrolPhotos",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.point.fields.createTime"))),
		prop: "createTime",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.point.fields.locationInfo"))),
		prop: "locationInfo",
		width: 160,
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
	title: transformI18n($t("property-manage_patrol-manage.point.tableTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<PointQueryParams> = {
	patrolPerson: "",
	patrolStartTime: "",
	patrolEndTime: "",
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
} = usePointListQuery(plusSearchDefaultValues);

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
		label: transformI18n($t("property-manage_patrol-manage.point.fields.patrolPerson")),
		prop: "patrolPerson",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.point.fields.patrolStartTime")),
		prop: "patrolStartTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.point.fields.patrolEndTime")),
		prop: "patrolEndTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},
]);

/** 表格搜索栏组件 配置 */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 表单组件实例 */
const patrolPointFormInstance = ref<InstanceType<typeof PatrolPointForm> | null>(null);

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
function openDialog(params: { mode: Mode; row?: PointListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const patrolPointFormData: PatrolPointFormVO = isAdd.value
		? structuredClone(defaultForm)
		: structuredClone({
				...defaultForm,
				...row,
			});

	/** 表单组件需要的props */
	const formProps: PatrolPointFormProps = {
		form: patrolPointFormData,
		defaultValues: patrolPointFormData,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_patrol-manage.point.dialogs.addTitle"))
				: transformI18n($t("property-manage_patrol-manage.point.dialogs.editTitle")),
		props: formProps,
		contentRenderer: () =>
			h(PatrolPointForm, {
				ref: patrolPointFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = patrolPointFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = patrolPointFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					patrolPointFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await patrolPointFormInstance.value?.plusFormInstance?.handleSubmit();
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

<style lang="scss" scoped></style>
