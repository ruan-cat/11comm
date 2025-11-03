<script lang="ts" setup>
definePage({
	meta: {
		title: "巡检计划",
		icon: "mdi:calendar-check",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.patrolManage.plan"),
	},
});

import { ref, computed, onMounted, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import { useToggle } from "@vueuse/core";
import { tableData as mockTableData, 状态Options, type 巡检计划_列表数据, type 巡检计划_列表查询_VO, type 巡检计划表单_VO } from "./test-data";
import { type PatrolPlanFormProps, defaultForm } from "./components/form";
import PatrolPlanForm from "./components/form.vue";

/** 表格数据 */
const tableData = ref<巡检计划_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "计划名称",
		prop: "计划名称",
		width: 120,
	},
	{
		label: "计划路线",
		prop: "计划路线",
		width: 120,
	},
	{
		label: "计划周期",
		prop: "计划周期",
		width: 120,
	},
	{
		label: "签到方式",
		prop: "签到方式",
		width: 120,
	},
	{
		label: "日期范围",
		prop: "日期范围",
		width: 120,
	},
	{
		label: "时间范围",
		prop: "时间范围",
		width: 120,
	},
	{
		label: "任务提前(分钟)",
		prop: "任务提前(分钟)",
		width: 120,
	},
	{
		label: "制定人",
		prop: "制定人",
		width: 120,
	},
	{
		label: "制定时间",
		prop: "制定时间",
		width: 120,
	},
	{
		label: "状态",
		prop: "状态",
		width: 120,
	},
	{
		label: "巡检人员",
		prop: "巡检人员",
		width: 120,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);
/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: 0,
});

/** 处理页数变化 */
async function handlePageSizeChange(pageSize: number) {
	pagination.value.pageSize = pageSize;
	await loadTableData();
}
/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
	await loadTableData();
}

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.计划ID) {
			filteredData = filteredData.filter((item) => item.计划名称.includes(plusSearchModel.value.计划ID!));
		}
		if (plusSearchModel.value.计划名称) {
			filteredData = filteredData.filter((item) => item.计划名称.includes(plusSearchModel.value.计划名称!));
		}
		if (plusSearchModel.value.巡检人) {
			filteredData = filteredData.filter((item) => item.巡检人员.includes(plusSearchModel.value.巡检人!));
		}
		if (plusSearchModel.value.巡检状态) {
			filteredData = filteredData.filter((item) => item.状态 === plusSearchModel.value.巡检状态);
		}

		/** 更新总数 */
		pagination.value.total = filteredData.length;

		/** 分页处理 */
		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;
		tableData.value = filteredData.slice(startIndex, endIndex);

		/** 更新表格配置 */
		pureTableProps.value.data = tableData.value;
	} catch (error) {
		console.error("加载数据失败:", error);
		/** TODO: 显示错误提示 */
	}
}

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "巡检计划",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 巡检计划_列表查询_VO = {
	计划ID: "",
	计划名称: "",
	巡检人: "",
	巡检状态: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "计划ID",
		prop: "计划ID",
		valueType: "input",
	},
	{
		label: "计划名称",
		prop: "计划名称",
		valueType: "input",
	},
	{
		label: "巡检人",
		prop: "巡检人",
		valueType: "input",
	},
	{
		label: "状态",
		prop: "巡检状态",
		valueType: "select",
		options: 状态Options,
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
async function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 执行搜索 */
async function handleSearch() {
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const patrolPlanFormInstance = ref<InstanceType<typeof PatrolPlanForm> | null>(null);

const [isLoadingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: 巡检计划_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}巡检计划`;

	/** 业务对象 */
	const 巡检计划表单_VO: 巡检计划表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value && row
			? cloneDeep({
					...defaultForm,
					计划名称: row?.计划名称 || "",
					计划路线: row?.计划路线 || "",
					计划周期: row?.计划周期 || "",
					签到方式: row?.签到方式 || "二维码",
					日期范围: row?.日期范围 || "",
					时间范围: row?.时间范围 || { 开始时间: "", 结束时间: "" },
					"任务提前(分钟)": row?.["任务提前(分钟)"] || "",
					制定人: row?.制定人 || "",
					制定时间: row?.制定时间 || "",
					状态: row?.状态 || "启用",
					巡检人员: row?.巡检人员 || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: PatrolPlanFormProps = {
		form: 巡检计划表单_VO,
		defaultValues: 巡检计划表单_VO,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(PatrolPlanForm, {
				ref: patrolPlanFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = patrolPlanFormInstance.value!.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = patrolPlanFormInstance.value!.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index } }) => {
					patrolPlanFormInstance.value!.plusFormInstance.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await patrolPlanFormInstance.value!.plusFormInstance.handleSubmit();
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
	await loadTableData();
});
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" @reset="handleReSearch" />

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })"> {{ transformI18n($t("common.buttons.add")) }} </ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })"> {{ transformI18n($t("common.buttons.edit")) }} </ElButton>
						<ElButton type="info"> {{ transformI18n($t("common.buttons.info")) }} </ElButton>
						<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
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
