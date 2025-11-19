<script lang="ts" setup>
definePage({
	meta: {
		title: "菜单项",
		icon: "mdi:format-list-text",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.menuManage.item"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import {
	type 菜单项_列表数据,
	type 菜单项_列表查询_VO,
	tableData as allTableData,
} from "./test-data";

/** 表格数据 */
const tableData = ref<菜单项_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "菜单编号",
		prop: "菜单编号",
		width: 120,
		fixed: true,
	},
	{
		label: "菜单名称",
		prop: "菜单名称",
		width: 150,
	},
	{
		label: "父级菜单",
		prop: "父级菜单",
		width: 120,
	},
	{
		label: "菜单类型",
		prop: "菜单类型",
		width: 100,
	},
	{
		label: "路由路径",
		prop: "路由路径",
		minWidth: 200,
	},
	{
		label: "组件路径",
		prop: "组件路径",
		minWidth: 200,
	},
	{
		label: "权限标识",
		prop: "权限标识",
		width: 150,
	},
	{
		label: "排序",
		prop: "排序",
		width: 80,
	},
	{
		label: "状态",
		prop: "状态",
		width: 100,
	},
	{
		label: "是否外链",
		prop: "是否外链",
		width: 100,
	},
	{
		label: "是否缓存",
		prop: "是否缓存",
		width: 100,
	},
	{
		label: "是否隐藏",
		prop: "是否隐藏",
		width: 100,
	},
	{
		label: "创建时间",
		prop: "创建时间",
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
	title: "菜单项",
	columns: columns.value,
});

/** 加载表格数据 */
async function loadTableData() {
	try {
		// TODO: 替换为真实的API调用
		// 当前使用模拟数据和本地搜索过滤
		let filteredData = allTableData;

		// 根据搜索条件过滤数据
		if (plusSearchModel.value.菜单编号) {
			filteredData = filteredData.filter((item) => item.菜单编号.includes(plusSearchModel.value.菜单编号!));
		}
		if (plusSearchModel.value.菜单名称) {
			filteredData = filteredData.filter((item) => item.菜单名称.includes(plusSearchModel.value.菜单名称!));
		}
		if (plusSearchModel.value.父级菜单) {
			filteredData = filteredData.filter((item) => item.父级菜单.includes(plusSearchModel.value.父级菜单!));
		}
		if (plusSearchModel.value.菜单类型) {
			filteredData = filteredData.filter((item) => item.菜单类型 === plusSearchModel.value.菜单类型);
		}
		if (plusSearchModel.value.状态) {
			filteredData = filteredData.filter((item) => item.状态 === plusSearchModel.value.状态);
		}
		if (plusSearchModel.value.是否外链) {
			filteredData = filteredData.filter((item) => item.是否外链 === plusSearchModel.value.是否外链);
		}
		if (plusSearchModel.value.是否缓存) {
			filteredData = filteredData.filter((item) => item.是否缓存 === plusSearchModel.value.是否缓存);
		}
		if (plusSearchModel.value.是否隐藏) {
			filteredData = filteredData.filter((item) => item.是否隐藏 === plusSearchModel.value.是否隐藏);
		}

		// 更新总数
		pagination.value.total = filteredData.length;

		// 分页处理
		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;
		tableData.value = filteredData.slice(startIndex, endIndex);

		// 更新表格配置
		pureTableProps.value.data = tableData.value;
	} catch (error) {
		console.error("加载数据失败:", error);
		// TODO: 显示错误提示
	}
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 菜单项_列表查询_VO = {
	菜单编号: "",
	菜单名称: "",
	父级菜单: "",
	菜单类型: "",
	状态: "",
	是否外链: "",
	是否缓存: "",
	是否隐藏: "",
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
	// 菜单编号
	{
		label: "菜单编号",
		prop: "菜单编号",
		valueType: "input",
	},

	// 菜单名称
	{
		label: "菜单名称",
		prop: "菜单名称",
		valueType: "input",
	},

	// 父级菜单
	{
		label: "父级菜单",
		prop: "父级菜单",
		valueType: "input",
	},

	// 菜单类型
	{
		label: "菜单类型",
		prop: "菜单类型",
		valueType: "select",
		options: 菜单类型选项,
	},

	// 状态
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		options: 状态选项,
	},

	// 是否外链
	{
		label: "是否外链",
		prop: "是否外链",
		valueType: "select",
		options: 是否选项,
	},

	// 是否缓存
	{
		label: "是否缓存",
		prop: "是否缓存",
		valueType: "select",
		options: 是否选项,
	},

	// 是否隐藏
	{
		label: "是否隐藏",
		prop: "是否隐藏",
		valueType: "select",
		options: 是否选项,
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

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary"> {{ transformI18n($t("common.buttons.add")) }} </ElButton>
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
						<ElButton type="warning"> {{ transformI18n($t("common.buttons.edit")) }} </ElButton>
						<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
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
