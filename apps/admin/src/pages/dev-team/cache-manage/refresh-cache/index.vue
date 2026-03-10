<script lang="ts" setup>
definePage({
	meta: {
		// 刷新缓存
		title: "devTeam.cacheManage.refreshCache.pageTitle",
		icon: "mdi:refresh",
		showParent: true,
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.cacheManage.refreshCache"),
	},
});

import { ref, computed } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type RefreshCacheListItem, type RefreshCacheQueryParams } from "@01s-11comm/type";
import { useRefreshCacheListQuery } from "@/api/dev-team/cache-manage/refresh-cache";

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<RefreshCacheQueryParams> = {
	cacheId: "",
	cacheCode: "",
	cacheName: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useRefreshCacheListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.cacheCode")),
		prop: "cacheCode",
		minWidth: 140,
	},
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.cacheName")),
		prop: "cacheName",
		minWidth: 150,
	},
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.cacheKey")),
		prop: "cacheKey",
		minWidth: 200,
		showOverflowTooltip: true,
	},
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.cacheType")),
		prop: "cacheType",
		minWidth: 110,
	},
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.cacheGroup")),
		prop: "cacheGroup",
		minWidth: 110,
	},
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.expireTimeSeconds")),
		prop: "expireTime",
		minWidth: 120,
	},
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.status")),
		prop: "status",
		minWidth: 90,
	},
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.refreshPolicy")),
		prop: "refreshPolicy",
		minWidth: 120,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 120,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: transformI18n($t("devTeam.cacheManage.refreshCache.tableTitle")),
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 缓存ID
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.cacheId")),
		prop: "cacheId",
		valueType: "input",
	},

	// 缓存编码
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.cacheCode")),
		prop: "cacheCode",
		valueType: "input",
	},

	// 缓存名称
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.cacheName")),
		prop: "cacheName",
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

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	});
}

/** 刷新缓存处理函数 */
const handleClearCache = (row: RefreshCacheListItem) => {
	// 实现刷新缓存的逻辑
	console.log("刷新缓存:", row);
};
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
				<ElButton type="primary"> {{ transformI18n($t("common.buttons.add")) }} </ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable
					:="pureTableProps"
					:loading="isFetching"
					:columns="dynamicColumns"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="info" @click="handleClearCache(row)">
							{{ transformI18n($t("devTeam.cacheManage.refreshCache.buttons.refresh")) }}
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
