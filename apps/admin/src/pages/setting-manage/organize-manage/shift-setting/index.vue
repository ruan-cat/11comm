<script lang="ts" setup>
definePage({
	meta: {
		title: "班次设置",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("settingManage.organizeManage.shiftSetting"),
	},
});

import { ref, computed } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type 班次设置_列表数据, type 班次设置_列表查询_VO, shiftSettingTableData } from "./test-data";

/** 表格数据 */
const tableData = ref<班次设置_列表数据[]>(shiftSettingTableData);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "编号",
		prop: "编号",
		width: 200,
		fixed: true,
	},
	{
		label: "班次名称",
		prop: "班次名称",
		minWidth: 250,
	},
	{
		label: "时段",
		prop: "时段",
		minWidth: 180,
	},
	{
		label: "状态",
		prop: "状态",
		width: 100,
	},
	{
		label: "创建时间",
		prop: "创建时间",
		width: 180,
	},
	{
		label: "备注说明",
		prop: "备注说明",
		minWidth: 200,
	},
	{
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
	total: tableData.value.length,
});

/** 处理页数变化 */
async function handlePageSizeChange(pageSize: number) {
	pagination.value.pageSize = pageSize;
	// 做异步接口请求
}

/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
	// 做异步接口请求
}

/** 表格组件配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件配置 */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "班次信息",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 班次设置_列表查询_VO = {
	班次名称: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "班次名称",
		prop: "班次名称",
		valueType: "input",
	},
]);

/** 表格搜索栏组件 配置 */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 1,
});

async function handleReSearch() {
	console.log("重新搜索");
}

async function handleSearch() {
	console.log("搜索", plusSearchModel.value);
}

/** 新增操作 */
function handleAdd() {
	console.log("新增班次");
}

/** 修改操作 */
function handleEdit(row: 班次设置_列表数据) {
	console.log("修改班次", row);
}

/** 删除操作 */
function handleDelete(row: 班次设置_列表数据) {
	console.log("删除班次", row);
}

/** 停用/启用操作 */
function handleToggleStatus(row: 班次设置_列表数据) {
	const newStatus = row.状态 === "启用" ? "停止" : "启用";
	console.log(`${row.状态 === "启用" ? "停用" : "启用"}班次`, row);

	// 更新状态
	const index = tableData.value.findIndex((item) => item.编号 === row.编号);
	if (index > -1) {
		tableData.value[index].状态 = newStatus;
		message(`班次已${newStatus}`, { type: "success" });
	}
}

/** 文件操作 */
function handleFile() {
	console.log("文件操作");
}
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="info" @click="handleFile">
					{{ transformI18n($t("common.buttons.file")) }}
				</ElButton>
				<ElButton type="primary" @click="handleAdd">
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
						<ElButton type="warning" @click="handleEdit(row)">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger" @click="handleDelete(row)">
							{{ transformI18n($t("common.buttons.del")) }}
						</ElButton>
						<ElButton :type="row.状态 === '启用' ? 'info' : 'primary'" @click="handleToggleStatus(row)">
							{{ row.状态 === "启用" ? "停用" : "启用" }}
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
