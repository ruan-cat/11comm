<script lang="ts" setup>
definePage({
	meta: {
		title: "配置中心",
		icon: "mdi:cog",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.configManage.center"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type 配置中心_列表数据, type 配置中心_列表查询_VO, tableData as mockTableData, 配置类型选项, 配置状态选项 } from "./test-data";
import { openDialog } from "./components/dialog";

/** 表格数据 */
const tableData = ref<配置中心_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "配置项名称",
		prop: "配置项名称",
		width: 150,
		fixed: true,
	},
	{
		label: "配置类型",
		prop: "配置类型",
		width: 120,
	},
	{
		label: "配置键名",
		prop: "配置键名",
		width: 200,
	},
	{
		label: "配置值",
		prop: "配置值",
		width: 150,
	},
	{
		label: "默认值",
		prop: "默认值",
		width: 150,
	},
	{
		label: "配置描述",
		prop: "配置描述",
		minWidth: 200,
		showOverflowTooltip: true,
	},
	{
		label: "状态",
		prop: "状态",
		width: 80,
	},
	{
		label: "排序号",
		prop: "排序号",
		width: 80,
	},
	{
		label: "备注",
		prop: "备注",
		minWidth: 150,
		showOverflowTooltip: true,
	},
	{
		label: "创建时间",
		prop: "创建时间",
		width: 160,
	},
	{
		label: "更新时间",
		prop: "更新时间",
		width: 160,
	},
	{
		label: "创建人",
		prop: "创建人",
		width: 100,
	},
	{
		/** @see https://vscode.dev/github.com/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
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
	title: "配置中心",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 配置中心_列表查询_VO = {
	配置项名称: "",
	配置类型: "",
	状态: "",
	配置键名: "",
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
	// 配置项名称
	{
		label: "配置项名称",
		prop: "配置项名称",
		valueType: "input",
	},

	// 配置类型
	{
		label: "配置类型",
		prop: "配置类型",
		valueType: "select",
		options: 配置类型选项,
	},

	// 状态
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		options: 配置状态选项,
	},

	// 配置键名
	{
		label: "配置键名",
		prop: "配置键名",
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

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.配置项名称) {
			filteredData = filteredData.filter((item) => item.配置项名称.includes(plusSearchModel.value.配置项名称!));
		}
		if (plusSearchModel.value.配置类型) {
			filteredData = filteredData.filter((item) => item.配置类型 === plusSearchModel.value.配置类型);
		}
		if (plusSearchModel.value.状态) {
			filteredData = filteredData.filter((item) => item.状态 === plusSearchModel.value.状态);
		}
		if (plusSearchModel.value.配置键名) {
			filteredData = filteredData.filter((item) => item.配置键名.includes(plusSearchModel.value.配置键名!));
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

/** 查看详情 */
function viewDetails(row: 配置中心_列表数据) {
	console.log("查看详情", row);
	// TODO: 实现查看详情功能，可以打开一个只读的弹框显示完整信息
}

/** 复制配置 */
function copyConfig(row: 配置中心_列表数据) {
	console.log("复制配置", row);
	// TODO: 实现复制配置功能，可以基于当前配置创建新的配置
	// 预填充表单数据，但修改配置键名等唯一字段
}

/** 切换状态 */
function toggleStatus(row: 配置中心_列表数据) {
	console.log("切换状态", row);
	// TODO: 实现状态切换功能
	// 可以直接调用API或打开确认弹框
	const newStatus = row.状态 === '启用' ? '禁用' : '启用';
	console.log(`将配置 ${row.配置项名称} 状态从 ${row.状态} 切换为 ${newStatus}`);
}

/** 删除配置 */
function deleteConfig(row: 配置中心_列表数据) {
	console.log("删除配置", row);
	// TODO: 实现删除功能，应该显示确认弹框
	// 确认后调用删除API并刷新列表
	console.log(`确认删除配置: ${row.配置项名称} (${row.配置键名})`);
}

/** 导出配置 */
function exportConfig() {
	console.log("导出配置");
	// TODO: 实现导出功能
	// 可以导出当前搜索结果或全部配置
}

/** 导入配置 */
function importConfig() {
	console.log("导入配置");
	// TODO: 实现导入功能
	// 可以打开文件选择弹框，支持Excel、JSON等格式
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
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("common.buttons.add")) }}
				</ElButton>
				<ElButton type="success" @click="exportConfig">
					{{ transformI18n($t("common.buttons.export")) }}
				</ElButton>
				<ElButton type="warning" @click="importConfig">
					{{ transformI18n($t("common.buttons.import")) }}
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
						<ElButton type="primary" size="small" @click="viewDetails(row)">
							{{ transformI18n($t("common.buttons.view")) }}
						</ElButton>
						<ElButton type="warning" size="small" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info" size="small" @click="copyConfig(row)">
							{{ transformI18n($t("common.buttons.copy")) }}
						</ElButton>
						<ElButton :type="row.状态 === '启用' ? 'warning' : 'success'" size="small" @click="toggleStatus(row)">
							{{ row.状态 === '启用' ? '禁用' : '启用' }}
						</ElButton>
						<ElButton type="danger" size="small" @click="deleteConfig(row)">
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
