<script lang="ts" setup>
definePage({
	meta: {
		title: "巡检任务",
		icon: "mdi:clipboard-list-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.patrolManage.task"),
	},
});

import { ref, computed, h, onMounted } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { cloneDeep } from "lodash-es";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import { type PatrolTaskFormProps, defaultForm, type 巡检任务表单_VO } from "./components/form";
import type { 巡检任务_列表数据 } from "@01s-11comm/type";
import PatrolTaskForm from "./components/form.vue";

/** 模式控制 */
const { modeText, setMode, isAdd } = useMode();

/** 表单组件实例 */
const patrolTaskFormInstance = ref<InstanceType<typeof PatrolTaskForm> | null>(null);

/** 模拟数据 */
const mockTableData: 巡检任务_列表数据[] = [
	{
		id: "1",
		name: "日常巡逻任务1",
		status: "执行中",
		createTime: "2024-01-01 08:00:00",
		updateTime: "2024-01-01 18:00:00",
		remark: "东区巡逻",
		任务编码: "PT202401010001",
		巡检计划: "日常巡逻计划",
		巡检人开始_结束时间: "08:00-18:00",
		实际巡检时间: "2024-01-01 09:30:00",
		计划巡检人: "张三",
		当前巡检人: "张三",
		转移描述: "正常巡逻",
		巡检方式: "二维码",
		巡检状态: "执行中",
	},
	{
		id: "2",
		name: "日常巡逻任务2",
		status: "已完成",
		createTime: "2024-01-01 08:00:00",
		updateTime: "2024-01-01 18:00:00",
		remark: "西区巡逻",
		任务编码: "PT202401010002",
		巡检计划: "日常巡逻计划",
		巡检人开始_结束时间: "08:00-18:00",
		实际巡检时间: "2024-01-01 17:45:00",
		计划巡检人: "李四",
		当前巡检人: "李四",
		转移描述: "正常巡逻",
		巡检方式: "NFC",
		巡检状态: "已完成",
	},
];

/** 表格数据 */
const tableData = ref<巡检任务_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "任务编码",
		prop: "任务编码",
		width: 120,
	},
	{
		label: "巡检计划",
		prop: "巡检计划",
		width: 120,
	},
	{
		label: "巡检人开始/结束时间",
		prop: "巡检人开始/结束时间",
		width: 150,
	},
	{
		label: "实际巡检时间",
		prop: "实际巡检时间",
		width: 150,
	},
	{
		label: "计划巡检人",
		prop: "计划巡检人",
		width: 120,
	},
	{
		label: "当前巡检人",
		prop: "当前巡检人",
		width: 120,
	},
	{
		label: "转移描述",
		prop: "转移描述",
		width: 120,
	},
	{
		label: "巡检方式",
		prop: "巡检方式",
		width: 100,
	},
	{
		label: "巡检状态",
		prop: "巡检状态",
		width: 100,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
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

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "巡检任务",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 巡检任务_列表查询_VO = {
	执行人: "",
	巡检开始时间: "",
	巡检结束时间: "",
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
		label: transformI18n($t("propertyManage_inspectionManage.inspection.executor")),
		prop: "执行人",
		valueType: "input",
	},

	{
		label: transformI18n($t("propertyManage_inspectionManage.inspection.inspectionStartTame")),
		prop: "巡检开始时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},

	{
		label: transformI18n($t("propertyManage_inspectionManage.inspection.inspectionCompletionTime")),
		prop: "巡检结束时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},

	{
		label: transformI18n($t("propertyManage_inspectionManage.inspection.inspectionStatus")),
		prop: "巡检状态",
		valueType: "select",
		options: 巡检状态Options,
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

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.执行人) {
			filteredData = filteredData.filter(
				(item) =>
					item.计划巡检人.includes(plusSearchModel.value.执行人!) ||
					item.当前巡检人.includes(plusSearchModel.value.执行人!),
			);
		}
		if (plusSearchModel.value.巡检开始时间) {
			filteredData = filteredData.filter((item) => item["巡检人开始/结束时间"] >= plusSearchModel.value.巡检开始时间!);
		}
		if (plusSearchModel.value.巡检结束时间) {
			filteredData = filteredData.filter((item) => item["巡检人开始/结束时间"] <= plusSearchModel.value.巡检结束时间!);
		}
		if (plusSearchModel.value.巡检状态) {
			filteredData = filteredData.filter((item) => item.巡检状态 === plusSearchModel.value.巡检状态);
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
function openDialog(params: { mode: Mode; row?: 巡检任务_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}巡检任务`;

	/** 业务对象 */
	const 巡检任务表单VO: 巡检任务表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				...row,
			});
	const defaultValues = cloneDeep(巡检任务表单VO);

	/** 表单组件需要的props */
	const formProps: PatrolTaskFormProps = {
		form: 巡检任务表单VO,
		defaultValues,
	};

	addDialog({
		...defaultAddDialogParams,
		title,
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
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = patrolTaskFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					patrolTaskFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await patrolTaskFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						await loadTableData();
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
		<PlusSearch
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			@search="handleSearch"
			@reset="handleReSearch"
		/>

		<PureTableBar v-bind="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("common.buttons.add")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable
					v-bind="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
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
