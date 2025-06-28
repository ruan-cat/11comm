<script lang="ts" setup>
definePage({
	meta: {
		title: "刷新缓存",
		icon: "f7:menu",
		showParent: true,
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.cacheManage.refreshCache"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 刷新缓存_缓存数据 {
	缓存ID: string;
	缓存编码: string;
	名称: string;
}

const tableDataItem: 刷新缓存_缓存数据 = {
	缓存ID: "缓存ID",
	缓存编码: "缓存编码",
	名称: "名称",
};

/** 表格数据 */
const tableData = ref<刷新缓存_缓存数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "缓存ID",
		prop: "缓存ID",
		width: 120,
		fixed: true,
	},
	{
		label: "缓存编码",
		prop: "缓存编码",
		width: 150,
	},
	{
		label: "名称",
		prop: "名称",
		width: 150,
	},
	{
		label: transformI18n($t("common.table.operation")),
		minWidth: 120,
		fixed: "right",
		slot: "operation",
	},
]);

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: 1000,
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

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "缓存信息",
	columns: columns.value,
});

interface 刷新缓存_列表查询_VO {
	缓存ID?: string;
	缓存编码?: string;
	缓存名称?: string;
}

/** 表格搜索栏 双向绑定的变量 */
const plusSearchModelRef: FieldValues & 刷新缓存_列表查询_VO = {
	缓存ID: "",
	缓存编码: "",
	缓存名称: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 表格搜索栏组件 表单配置 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 缓存ID
	{
		label: "缓存ID",
		prop: "缓存ID",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入缓存id",
		},
	},

	// 缓存编码
	{
		label: "缓存编码",
		prop: "缓存编码",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入缓存编码",
		},
	},

	// 缓存名称
	{
		label: "缓存名称",
		prop: "缓存名称",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入缓存名称",
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
	title: "查询条件",
});

async function handleReSearch() {
	console.log("重新搜索");
}

async function handleSearch() {
	console.log("搜索");
}

// 删除缓存处理函数
const handleClearCache = (row) => {
	// 实现删除缓存的逻辑
	console.log("刷新缓存:", row);
};
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary"> {{ transformI18n($t("common.buttons.add")) }} </ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore -->
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="danger" @click="handleClearCache(row)">刷新缓存</ElButton>
					</template>
				</PureTable>
			</template>
		</PureTableBar>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
	padding: 20px;
}
</style>
