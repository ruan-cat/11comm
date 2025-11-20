<script lang="ts" setup>
definePage({
	meta: {
		title: "修改密码记录",
		icon: "mdi:lock-reset",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.systemManage.changePassword"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import {
	type 密码修改记录_列表数据,
	type 密码修改记录_列表查询_VO,
	tableData as allTableData,
	用户角色Options,
	部门Options,
	修改方式Options,
	操作状态Options,
	是否成功Options,
} from "./test-data";

/** 表格数据 */
const tableData = ref<密码修改记录_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "用户名",
		prop: "用户名",
		width: 120,
		fixed: true,
	},
	{
		label: "真实姓名",
		prop: "真实姓名",
		width: 100,
	},
	{
		label: "用户角色",
		prop: "用户角色",
		width: 120,
	},
	{
		label: "所属部门",
		prop: "所属部门",
		width: 100,
	},
	{
		label: "联系电话",
		prop: "联系电话",
		width: 120,
	},
	{
		label: "修改时间",
		prop: "修改时间",
		width: 160,
	},
	{
		label: "修改IP地址",
		prop: "修改IP地址",
		width: 130,
	},
	{
		label: "修改地点",
		prop: "修改地点",
		minWidth: 150,
	},
	{
		label: "修改方式",
		prop: "修改方式",
		width: 120,
	},
	{
		label: "操作状态",
		prop: "操作状态",
		width: 100,
	},
	{
		label: "是否成功",
		prop: "是否成功",
		width: 100,
	},
	{
		label: "失败原因",
		prop: "失败原因",
		minWidth: 180,
	},
	{
		label: "操作人",
		prop: "操作人",
		width: 100,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 200,
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
		if (plusSearchModel.value.用户角色) {
			filteredData = filteredData.filter((item) => item.用户角色 === plusSearchModel.value.用户角色);
		}
		if (plusSearchModel.value.所属部门) {
			filteredData = filteredData.filter((item) => item.所属部门 === plusSearchModel.value.所属部门);
		}
		if (plusSearchModel.value.修改方式) {
			filteredData = filteredData.filter((item) => item.修改方式 === plusSearchModel.value.修改方式);
		}
		if (plusSearchModel.value.操作状态) {
			filteredData = filteredData.filter((item) => item.操作状态 === plusSearchModel.value.操作状态);
		}
		if (plusSearchModel.value.是否成功) {
			filteredData = filteredData.filter((item) => item.是否成功 === plusSearchModel.value.是否成功);
		}
		if (plusSearchModel.value.修改开始时间 && plusSearchModel.value.修改结束时间) {
			filteredData = filteredData.filter((item) => {
				const modifyTime = new Date(item.修改时间).getTime();
				const startTime = new Date(plusSearchModel.value.修改开始时间!).getTime();
				const endTime = new Date(plusSearchModel.value.修改结束时间!).getTime();
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
	用户角色: "",
	所属部门: "",
	修改方式: "",
	操作状态: "",
	是否成功: "",
	修改开始时间: "",
	修改结束时间: "",
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

	// 用户角色
	{
		label: "用户角色",
		prop: "用户角色",
		valueType: "select",
		options: 用户角色Options,
	},

	// 所属部门
	{
		label: "所属部门",
		prop: "所属部门",
		valueType: "select",
		options: 部门Options,
	},

	// 修改方式
	{
		label: "修改方式",
		prop: "修改方式",
		valueType: "select",
		options: 修改方式Options,
	},

	// 操作状态
	{
		label: "操作状态",
		prop: "操作状态",
		valueType: "select",
		options: 操作状态Options,
	},

	// 是否成功
	{
		label: "是否成功",
		prop: "是否成功",
		valueType: "select",
		options: 是否成功Options,
	},

	// 修改时间范围
	{
		label: "修改时间范围",
		prop: "修改时间范围",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
			onChange(value: string[] | null) {
				plusSearchModel.value.修改开始时间 = value?.[0] ?? "";
				plusSearchModel.value.修改结束时间 = value?.[1] ?? "";
			},
			onClear() {
				plusSearchModel.value.修改开始时间 = "";
				plusSearchModel.value.修改结束时间 = "";
			},
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

const { modeText, setMode, isAdd, isEdit } = useMode();

const [isLoadingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 查看详情 */
function viewDetails(row: 密码修改记录_列表数据) {
	console.log("查看详情", row);
	// TODO: 实现查看详情功能
}

/** 导出记录 */
function exportRecords() {
	console.log("导出记录");
	// TODO: 实现导出功能
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
				<ElButton type="success" @click="exportRecords">
					{{ transformI18n($t("common.buttons.export")) }}
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
						<ElButton type="info" @click="viewDetails(row)">
							{{ transformI18n($t("common.buttons.detail")) }}
						</ElButton>
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