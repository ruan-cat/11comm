<script lang="ts" setup>
definePage({
	meta: {
		title: "修改密码",
		icon: "mdi:key",
		rank: getRouteRank("settingManage.systemManage.changePassword"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import {
	type 密码修改记录_列表数据,
	type 密码修改记录_列表查询_VO,
	修改类型选项,
	修改状态选项,
	部门选项,
	tableData as allTableData,
} from "./test-data";

/** 表格数据 */
const tableData = ref<密码修改记录_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "记录ID",
		prop: "记录ID",
		width: 120,
		fixed: true,
	},
	{
		label: "用户名",
		prop: "用户名",
		width: 120,
	},
	{
		label: "真实姓名",
		prop: "真实姓名",
		width: 120,
	},
	{
		label: "所属部门",
		prop: "所属部门",
		width: 120,
	},
	{
		label: "修改时间",
		prop: "修改时间",
		width: 180,
	},
	{
		label: "修改IP",
		prop: "修改IP",
		width: 130,
	},
	{
		label: "修改类型",
		prop: "修改类型",
		width: 140,
	},
	{
		label: "操作人",
		prop: "操作人",
		width: 120,
	},
	{
		label: "状态",
		prop: "状态",
		width: 100,
	},
	{
		label: "备注",
		prop: "备注",
		minWidth: 200,
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
	title: "密码修改记录",
	columns: columns.value,
});

/** 加载表格数据 */
async function loadTableData() {
	try {
		// TODO: 替换为真实的API调用
		// 当前使用模拟数据和本地搜索过滤
		let filteredData = allTableData;

		// 根据搜索条件过滤数据
		if (plusSearchModel.value.用户名) {
			filteredData = filteredData.filter((item) => item.用户名.includes(plusSearchModel.value.用户名!));
		}
		if (plusSearchModel.value.真实姓名) {
			filteredData = filteredData.filter((item) => item.真实姓名.includes(plusSearchModel.value.真实姓名!));
		}
		if (plusSearchModel.value.所属部门) {
			filteredData = filteredData.filter((item) => item.所属部门 === plusSearchModel.value.所属部门);
		}
		if (plusSearchModel.value.修改时间) {
			filteredData = filteredData.filter((item) => item.修改时间.includes(plusSearchModel.value.修改时间!));
		}
		if (plusSearchModel.value.修改类型) {
			filteredData = filteredData.filter((item) => item.修改类型 === plusSearchModel.value.修改类型);
		}
		if (plusSearchModel.value.状态) {
			filteredData = filteredData.filter((item) => item.状态 === plusSearchModel.value.状态);
		}
		if (
			plusSearchModel.value.修改时间范围 &&
			plusSearchModel.value.修改时间范围[0] &&
			plusSearchModel.value.修改时间范围[1]
		) {
			filteredData = filteredData.filter((item) => {
				const modifyTime = new Date(item.修改时间).getTime();
				const startTime = new Date(plusSearchModel.value.修改时间范围![0]).getTime();
				const endTime = new Date(plusSearchModel.value.修改时间范围![1]).getTime();
				return modifyTime >= startTime && modifyTime <= endTime;
			});
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
const plusSearchModelRef: FieldValues & 密码修改记录_列表查询_VO = {
	用户名: "",
	真实姓名: "",
	所属部门: "",
	修改时间: "",
	修改类型: "",
	状态: "",
	修改时间范围: ["", ""],
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
	// 用户名
	{
		label: "用户名",
		prop: "用户名",
		valueType: "input",
	},

	// 真实姓名
	{
		label: "真实姓名",
		prop: "真实姓名",
		valueType: "input",
	},

	// 所属部门
	{
		label: "所属部门",
		prop: "所属部门",
		valueType: "select",
		options: 部门选项,
	},

	// 修改类型
	{
		label: "修改类型",
		prop: "修改类型",
		valueType: "select",
		options: 修改类型选项,
	},

	// 状态
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		options: 修改状态选项,
	},

	// 修改时间
	{
		label: "修改时间",
		prop: "修改时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},

	{
		label: "修改时间范围",
		prop: "修改时间范围",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
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
						<ElButton type="info"> 详情 </ElButton>
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
