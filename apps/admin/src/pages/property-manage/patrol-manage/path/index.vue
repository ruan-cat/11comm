<script lang="ts" setup>
definePage({
	meta: {
		title: "巡检路线",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.patrolManage.path"),
	},
});
import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 巡检路线_列表数据 {
	巡检点ID: string;
	巡检点名称: string;
	巡检点类型: string;
	巡检位置: string;
	开始时间: string;
	结束时间: string;
	排序: string;
	操作: string;
}

const tableDataItem: 巡检路线_列表数据 = {
	巡检点ID: "巡检点ID",
	巡检点名称: "巡检点名称",
	巡检点类型: "巡检点类型",
	巡检位置: "巡检位置",
	开始时间: "开始时间",
	结束时间: "结束时间",
	排序: "排序",
	操作: "操作",
};

/** 表格数据 */
const tableData = ref<巡检路线_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "巡检点ID",
		prop: "巡检点ID",
		width: 120,
		fixed: true,
	},
	{
		label: "巡检点名称",
		prop: "巡检点名称",
		width: 120,
	},
	{
		label: "巡检点类型",
		prop: "巡检点类型",
		width: 120,
	},
	{
		label: "巡检位置",
		prop: "巡检位置",
		width: 120,
	},
	{
		label: "开始时间",
		prop: "开始时间",
		width: 120,
	},
	{
		label: "结束时间",
		prop: "结束时间",
		width: 120,
	},
	{
		label: "排序",
		prop: "排序",
		width: 120,
	},
	{
		label: transformI18n($t("common.table.operation")),
		minWidth: 240,
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
	title: "巡检路线",
	columns: columns.value,
});

interface 巡检路线_列表查询_VO {
	巡检路线?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 巡检路线_列表查询_VO = {
	巡检路线: "",
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
		label: transformI18n($t("propertyManage_inspectionManage.inspection.inspectionRoute")),
		prop: "巡检路线",
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

function handleReSearch() {
	console.log("重新搜索");
}

async function handleSearch() {
	console.log("搜索");
}
</script>
<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

		<!-- {{ plusSearchModel }} -->

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
						<ElButton type="info"> {{ transformI18n($t("common.buttons.info")) }} </ElButton>
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
