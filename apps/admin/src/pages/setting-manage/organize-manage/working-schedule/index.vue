<script lang="ts" setup>
definePage({
	meta: {
		title: "排班表",
		icon: "mdi:calendar",
		roles: ["物业团队"],
		rank: getRouteRank("settingManage.organizeManage.workingSchedule"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";

import { cloneDeep } from "@pureadmin/utils";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";

// TODO: 该代码需要被换成从 @01s-11comm/type 中导入的类型
// import {
// 	tableData as mockTableData,
// 	type WorkingSchedule,
// } from "@01s-11comm/type";

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

// 表格数据
// TODO: 改代码需要在执行重构时 取消注释并完成正常使用
// const tableData = ref<WorkingSchedule[]>(mockTableData);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "排班名称",
		prop: "name",
		width: 150,
	},
	{
		label: "排班类型",
		prop: "type",
		width: 120,
	},
	{
		label: "开始时间",
		prop: "startTime",
		width: 120,
	},
	{
		label: "结束时间",
		prop: "endTime",
		width: 120,
	},
	{
		label: "星期几",
		prop: "weekday",
		width: 100,
	},
	{
		label: "负责人",
		prop: "managerName",
		width: 120,
	},
	{
		label: "联系电话",
		prop: "phone",
		width: 140,
	},
	{
		label: "状态",
		prop: "enabled",
		width: 80,
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

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	// TODO: 改代码需要在执行重构时 取消注释并完成正常使用
	// data: tableData.value,
	data: [],
	columns: [],
	pagination: pagination.value,
});

// 表格操作栏配置
const pureTableBarProps = ref<PureTableBarProps>({
	title: "排班管理",
	columns: columns.value,
});

// PlusSearch 搜索表单数据接口
interface ScheduleSearchForm {
	scheduleName?: string;
	managerName?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & ScheduleSearchForm = {
	scheduleName: "",
	managerName: "",
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
		label: "排班名称",
		prop: "scheduleName",
		valueType: "input",
	},
	{
		label: "负责人",
		prop: "managerName",
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

// ========== 事件处理函数 ==========

// 测试异步函数
const [isLoadingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		// TODO: 改代码需要在执行重构时 取消注释并完成正常使用
		// let filteredData = [...tableData.value];
		let filteredData = [];

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.scheduleName) {
			filteredData = filteredData.filter((item) => item.name.includes(plusSearchModel.value.scheduleName!));
		}
		if (plusSearchModel.value.managerName) {
			filteredData = filteredData.filter((item) => item.managerName?.includes(plusSearchModel.value.managerName!));
		}

		/** 更新总数 */
		pagination.value.total = filteredData.length;

		/** 分页处理 */
		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;
		const paginatedData = filteredData.slice(startIndex, endIndex);

		/** 更新表格配置 */
		pureTableProps.value.data = paginatedData;
	} catch (error) {
		console.error("加载数据失败:", error);
		/** TODO: 显示错误提示 */
	}
}

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

function handleAddSchedule() {
	console.log("添加排班");
}

// TODO: 改代码需要在执行重构时 取消注释并完成正常使用
// function handleEditSchedule(row: WorkingSchedule) {
// 	console.log("编辑排班:", row);
// }

// TODO: 该代码需要被换成从 @01s-11comm/type 中导入的类型
// function handleDeleteSchedule(row: WorkingSchedule) {
// 	console.log("删除排班:", row);
// }

function handleExportSchedule() {
	console.log("导出排班表");
}

// ========== 生命周期 ==========
onMounted(async () => {
	// 加载表格数据
	await loadTableData();
});
</script>

<template>
	<section class="working-schedule-container">
		<!-- PlusSearch 搜索栏 -->
		<PlusSearch
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			@search="handleSearch"
			@reset="handleReSearch"
		/>

		<!-- 排班表格区域 -->
		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="info" @click="handleExportSchedule"> 导出 </ElButton>
				<ElButton type="primary" @click="handleAddSchedule">
					{{ transformI18n($t("common.buttons.add")) }}
				</ElButton>
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
						<!-- // TODO: 改代码需要在执行重构时 取消注释并完成正常使用 -->
						<!-- <ElButton type="warning" @click="handleEditSchedule(row)">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger" @click="handleDeleteSchedule(row)">
							{{ transformI18n($t("common.buttons.del")) }}
						</ElButton> -->
					</template>
				</PureTable>
			</template>
		</PureTableBar>
	</section>
</template>

<style lang="scss" scoped>
.working-schedule-container {
}
</style>
