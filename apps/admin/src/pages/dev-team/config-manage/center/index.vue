<script lang="ts" setup>
definePage({
	meta: {
		title: "配置中心",
		icon: "mdi:cog",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.configManage.center"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";
import {
	type ConfigCenterListItem,
	type ConfigCenterQueryParams,
	configTypeOptions,
	configStatusOptions,
} from "@01s-11comm/type";
import { openDialog } from "./components/dialog";
import { useConfigCenterListQuery } from "@/api/dev-team/config-manage/center";

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ConfigCenterQueryParams> = {
	configName: "",
	configType: "",
	status: "",
	configKey: "",
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
		prop: "configName",
		valueType: "input",
	},

	// 配置类型
	{
		label: "配置类型",
		prop: "configType",
		valueType: "select",
		options: configTypeOptions,
	},

	// 状态
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: configStatusOptions,
	},

	// 配置键名
	{
		label: "配置键名",
		prop: "configKey",
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

/** 使用 TanStack Query 获取数据 */
const { tableData, total, pageIndex, pageSize, isLoading, queryParams, updateParams, resetParams, doFetch } =
	useConfigCenterListQuery(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
	// doFetch();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
	// doFetch();
}

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "配置项名称",
		prop: "configName",
		width: 150,
		fixed: true,
	},
	{
		label: "配置类型",
		prop: "configType",
		width: 120,
	},
	{
		label: "配置键名",
		prop: "configKey",
		width: 200,
	},
	{
		label: "配置值",
		prop: "configValue",
		width: 150,
	},
	{
		label: "默认值",
		prop: "defaultValue",
		width: 150,
	},
	{
		label: "配置描述",
		prop: "configDescription",
		minWidth: 200,
		showOverflowTooltip: true,
	},
	{
		label: "状态",
		prop: "status",
		width: 80,
	},
	{
		label: "排序号",
		prop: "sortOrder",
		width: 80,
	},
	{
		label: "备注",
		prop: "remark",
		minWidth: 150,
		showOverflowTooltip: true,
	},
	{
		label: "创建时间",
		prop: "createTime",
		width: 160,
	},
	{
		label: "更新时间",
		prop: "updateTime",
		width: 160,
	},
	{
		label: "创建人",
		prop: "creator",
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
const pagination = computed<PaginationProps>(() => ({
	...defaultPagination,
	pageSize: pageSize.value,
	currentPage: pageIndex.value,
	total: total.value,
}));

/** 处理页数变化 */
function handlePageSizeChange(newPageSize: number) {
	pageSize.value = newPageSize;
}

/** 处理页码变化 即后端的 pageIndex */
function handleCurrentPageChange(currentPage: number) {
	pageIndex.value = currentPage;
}

/** 表格组件 配置 */
const pureTableProps = computed<PureTableProps>(() => ({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
	loading: isLoading.value,
}));

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "配置中心",
	columns: columns.value,
});

/** 查看详情 */
function viewDetails(row: ConfigCenterListItem) {
	console.log("查看详情", row);
	// TODO: 实现查看详情功能，可以打开一个只读的弹框显示完整信息
}

/** 复制配置 */
function copyConfig(row: ConfigCenterListItem) {
	console.log("复制配置", row);
	// TODO: 实现复制配置功能，可以基于当前配置创建新的配置
	// 预填充表单数据，但修改配置键名等唯一字段
}

/** 切换状态 */
function toggleStatus(row: ConfigCenterListItem) {
	console.log("切换状态", row);
	// TODO: 实现状态切换功能
	// 可以直接调用API或打开确认弹框
	const newStatus = row.status === "启用" ? "禁用" : "启用";
	console.log(`将配置 ${row.configName} 状态从 ${row.status} 切换为 ${newStatus}`);
}

/** 删除配置 */
function deleteConfig(row: ConfigCenterListItem) {
	console.log("删除配置", row);
	// TODO: 实现删除功能，应该显示确认弹框
	// 确认后调用删除API并刷新列表
	console.log(`确认删除配置: ${row.configName} (${row.configKey})`);
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
				<ElButton type="success" @click="exportConfig"> 导出 </ElButton>
				<ElButton type="warning" @click="importConfig"> 导入 </ElButton>
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
						<ElButton type="primary" @click="viewDetails(row)">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info" @click="copyConfig(row)"> 复制 </ElButton>
						<ElButton :type="row.status === '启用' ? 'warning' : 'success'" @click="toggleStatus(row)">
							{{ row.status === "启用" ? "禁用" : "启用" }}
						</ElButton>
						<ElButton type="danger" @click="deleteConfig(row)">
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
