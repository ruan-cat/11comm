<script lang="ts" setup>
definePage({
	meta: {
		title: "巡检点",
		icon: "mdi:map-marker-check",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.patrolManage.point"),
	},
});

import { ref, computed, h } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import { type PatrolPointFormProps, defaultForm, type PatrolPointFormVO } from "./components/form";
import { type PointListItem, type PointQueryParams } from "@01s-11comm/type";
import PatrolPointForm from "./components/form.vue";
import { usePointListQuery } from "@/api/property-manage/patrol-manage/point";

/** 模式控制 */
const { modeText, setMode, isAdd } = useMode();

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "任务详情ID",
		prop: "taskDetailId",
		width: 120,
	},
	{
		label: "巡检点名称",
		prop: "patrolPointName",
		width: 120,
	},
	{
		label: "巡检计划名称",
		prop: "patrolPlanName",
		width: 120,
	},
	{
		label: "巡检路线名称",
		prop: "patrolRouteName",
		width: 120,
	},
	{
		label: "巡检人开始/结束时间",
		prop: "patrolPersonTime",
		width: 160,
	},
	{
		label: "巡检点开始/结束时间",
		prop: "patrolPointTime",
		width: 160,
	},
	{
		label: "实际巡检时间",
		prop: "actualPatrolTime",
		width: 120,
	},
	{
		label: "实际签到状态",
		prop: "actualCheckInStatus",
		width: 120,
	},
	{
		label: "计划巡检人",
		prop: "planPatrolPerson",
		width: 120,
	},
	{
		label: "实际巡检人",
		prop: "actualPatrolPerson",
		width: 120,
	},
	{
		label: "巡检方式",
		prop: "patrolMethod",
		width: 120,
	},
	{
		label: "任务状态",
		prop: "taskStatus",
		width: 120,
	},
	{
		label: "巡检点状态",
		prop: "patrolPointStatus",
		width: 120,
	},
	{
		label: "巡检情况",
		prop: "patrolSituation",
		width: 120,
	},
	{
		label: "巡检照片",
		prop: "patrolPhotos",
		width: 120,
	},
	{
		label: "创建时间",
		prop: "createTime",
		width: 120,
	},
	{
		label: "位置信息",
		prop: "locationInfo",
		width: 160,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

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
		label: "巡检人",
		prop: "patrolPerson",
		valueType: "input",
	},
	{
		label: "巡检开始时间",
		prop: "patrolStartTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},
	{
		label: "巡检结束时间",
		prop: "patrolEndTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
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

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "巡检点",
	columns: columns.value,
});

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

	/** 弹框标题 */
	const title = `${modeText.value}巡检点`;

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
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
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = patrolPointFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					patrolPointFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
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
