<script lang="ts" setup>
definePage({
	meta: {
		title: "小区公示",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.communityManage.notice"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 小区公示_列表数据 {
	头部照片: string;
	公示标题: string;
	公示类型: string;
	公示时间: string;
	发布人: string;
}

const tableDataItem: 小区公示_列表数据 = {
	头部照片: "头部照片",
	公示标题: "公示标题",
	公示类型: "公示类型",
	公示时间: "公示时间",
	发布人: "发布人",
};

/** 表格数据 */
const tableData = ref<小区公示_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "头部照片",
		prop: "头部照片",
		width: 120,
		fixed: true,
	},
	{
		label: "公示标题",
		prop: "公示标题",
		width: 120,
	},
	{
		label: "公示类型",
		prop: "公示类型",
		width: 120,
	},
	{
		label: "公示时间",
		prop: "公示时间",
		width: 120,
	},
	{
		label: "发布人",
		prop: "发布人",
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
	title: "小区公示",
	columns: columns.value,
});

interface 小区公示_列表查询_VO {
	公示标题?: string;
	公示类型?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 小区公示_列表查询_VO = {
	公示标题: "",
	公示类型: "",
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
	// 公示标题
	{
		label: transformI18n($t("propertyManage_communityManage.notice.publicityTitle")),
		prop: "公示标题",
		valueType: "input",
	},

	// 公示类型
	{
		label: transformI18n($t("propertyManage_communityManage.notice.publicityType")),
		prop: "公示类型",
		valueType: "select",
		options: [
			{
				label: "公共收益",
				value: "公共收益",
			},
			{
				label: "规章制度",
				value: "规章制度",
			},
			{
				label: "政策相关",
				value: "政策相关",
			},
		],
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 2,
});

async function handleReSearch() {
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
