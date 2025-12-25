<script lang="ts" setup>
definePage({
	meta: {
		title: "巡检明细",
		icon: "mdi:clipboard-text",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.patrolManage.detail"),
	},
});

import { ref, computed, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type PatrolDetailFormProps, defaultForm } from "./components/form";
import { type PatrolDetailFormVO } from "@01s-11comm/type";
import {
	type PatrolDetailListItem,
	type PatrolDetailQueryParams,
	patrolMethodOptions,
	taskStatusOptions,
	patrolPointStatusOptions,
} from "@01s-11comm/type";
import PatrolDetailForm from "./components/form.vue";
import { useDetailListQuery } from "@/api/property-manage/patrol-manage/detail";

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const patrolDetailFormInstance = ref<InstanceType<typeof PatrolDetailForm> | null>(null);

/** 模拟异步操作函数 */
const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

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
		label: "巡检人开始结束时间",
		prop: "patrolPersonStartEndTime",
		width: 160,
	},
	{
		label: "巡检点开始结束时间",
		prop: "patrolPointStartEndTime",
		width: 160,
	},
	{
		label: "实际巡检时间",
		prop: "actualPatrolTime",
		width: 150,
	},
	{
		label: "实际签到状态",
		prop: "actualCheckInStatus",
		width: 100,
	},
	{
		label: "计划巡检人",
		prop: "plannedPatrolPerson",
		width: 100,
	},
	{
		label: "实际巡检人",
		prop: "actualPatrolPerson",
		width: 100,
	},
	{
		label: "巡检方式",
		prop: "patrolMethod",
		width: 100,
	},
	{
		label: "任务状态",
		prop: "taskStatus",
		width: 100,
	},
	{
		label: "巡检点状态",
		prop: "patrolPointStatus",
		width: 100,
	},
	{
		label: "巡检情况",
		prop: "patrolSituation",
		width: 150,
	},
	{
		label: "巡检照片",
		prop: "patrolPhotos",
		width: 100,
	},
	{
		label: "创建时间",
		prop: "createTime",
		width: 160,
	},
	{
		label: "位置信息",
		prop: "locationInfo",
		width: 150,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "巡检明细",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<PatrolDetailQueryParams> = {
	patrolPerson: "",
	patrolStartTime: "",
	patrolEndTime: "",
	patrolMethod: "",
	taskStatus: "",
	patrolPointStatus: "",
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
} = useDetailListQuery(plusSearchDefaultValues);

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
	/** 巡检人 */
	{
		label: "巡检人",
		prop: "patrolPerson",
		valueType: "input",
	},

	/** 巡检开始时间 */
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

	/** 巡检结束时间 */
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

	/** 巡检方式 */
	{
		label: "巡检方式",
		prop: "patrolMethod",
		valueType: "select",
		options: patrolMethodOptions,
	},

	/** 任务状态 */
	{
		label: "任务状态",
		prop: "taskStatus",
		valueType: "select",
		options: taskStatusOptions,
	},

	/** 巡检点状态 */
	{
		label: "巡检点状态",
		prop: "patrolPointStatus",
		valueType: "select",
		options: patrolPointStatusOptions,
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

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: PatrolDetailListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const patrolDetailFormVO: PatrolDetailFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					patrolPointName: row?.patrolPointName || "",
					patrolPlanName: row?.patrolPlanName || "",
					patrolRouteName: row?.patrolRouteName || "",
					plannedPatrolPerson: row?.plannedPatrolPerson || "",
					patrolMethod: row?.patrolMethod || "步行巡检",
					location: row?.locationInfo || "",
					patrolSituation: row?.patrolSituation || "",
				})
			: structuredClone(defaultForm);

	/** 表单组件需要的props */
	const formProps: PatrolDetailFormProps = {
		form: patrolDetailFormVO,
		defaultValues: patrolDetailFormVO,
	};

	/** 弹框标题 */
	const title = `${modeText.value}巡检明细`;

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(PatrolDetailForm, {
				ref: patrolDetailFormInstance,
				...formProps,
				mode,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = patrolDetailFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = patrolDetailFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					patrolDetailFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await patrolDetailFormInstance.value?.plusFormInstance?.handleSubmit();
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
