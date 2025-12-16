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

import type { WorkingSchedule, WorkingScheduleListQuery, ScheduleType } from "@01s-11comm/type";
import { useWorkingScheduleListQuery } from "@/api/setting-manage/organize-manage/working-schedule";

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

// 使用排班表列表查询 Hook
const {
	tableData,
	total,
	pageIndex,
	pageSize,
	isLoading,
	updateParams,
	refetch,
} = useWorkingScheduleListQuery();

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
const pagination = computed<PaginationProps>(() => ({
	...defaultPagination,
	pageSize: pageSize.value,
	currentPage: pageIndex.value,
	total: total.value,
}));

/** 表格组件 配置 */
const pureTableProps = computed<PureTableProps>(() => ({
	...defaultPureTableProps,
	data: tableData.value,
	columns: columns.value,
	pagination: pagination.value,
	loading: isLoading.value,
}));

// 表格操作栏配置
const pureTableBarProps = ref<PureTableBarProps>({
	title: "排班管理",
	columns: columns.value,
});

// PlusSearch 搜索表单数据接口
interface ScheduleSearchForm {
	name?: string;
	type?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & ScheduleSearchForm = {
	name: "",
	type: "",
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
		prop: "name",
		valueType: "input",
	},
	{
		label: "排班类型",
		prop: "type",
		valueType: "select",
		options: [
			{ label: "早班", value: "morning" },
			{ label: "中班", value: "afternoon" },
			{ label: "晚班", value: "evening" },
			{ label: "夜班", value: "night" },
			{ label: "全天", value: "全天" },
		],
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

/** 重置搜索条件并重新加载数据 */
async function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	updateParams({
		name: undefined,
		type: undefined,
		pageIndex: 1,
	});
}

/** 执行搜索 */
async function handleSearch() {
	updateParams({
		name: plusSearchModel.value.name,
		type: plusSearchModel.value.type as ScheduleType | undefined,
		pageIndex: 1,
	});
}

/** 处理页数变化 */
async function handlePageSizeChange(val: number) {
	pageSize.value = val;
}

/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(val: number) {
	pageIndex.value = val;
}

function handleAddSchedule() {
	console.log("添加排班");
}

function handleEditSchedule(row: WorkingSchedule) {
	console.log("编辑排班:", row);
}

function handleDeleteSchedule(row: WorkingSchedule) {
	console.log("删除排班:", row);
}

function handleExportSchedule() {
	console.log("导出排班表");
}

// ========== 生命周期 ==========
onMounted(async () => {
	// 数据由 useWorkingScheduleListQuery 自动加载
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
						<ElButton type="warning" @click="handleEditSchedule(row)">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger" @click="handleDeleteSchedule(row)">
							{{ transformI18n($t("common.buttons.del")) }}
						</ElButton>
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
