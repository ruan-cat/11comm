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

import { ref } from "vue";
import { type RefreshCacheListItem, type RefreshCacheQueryParams } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useRefreshCacheListQuery } from "@/api/dev-team/cache-manage/refresh-cache";
import { useI18nConfig } from "@/composables/use-i18n-config";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const plusSearchModelRef: FieldValues & Partial<RefreshCacheQueryParams> = {
	cacheId: "",
	cacheCode: "",
	cacheName: "",
};

const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

const {
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useRefreshCacheListQuery(plusSearchDefaultValues);

const columns = computed<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.cacheManage.refreshCache.fields.cacheCode"))),
		prop: "cacheCode",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.cacheManage.refreshCache.fields.cacheName"))),
		prop: "cacheName",
		minWidth: 150,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.cacheManage.refreshCache.fields.cacheKey"))),
		prop: "cacheKey",
		minWidth: 200,
		showOverflowTooltip: true,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.cacheManage.refreshCache.fields.cacheType"))),
		prop: "cacheType",
		minWidth: 110,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.cacheManage.refreshCache.fields.cacheGroup"))),
		prop: "cacheGroup",
		minWidth: 110,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("devTeam.cacheManage.refreshCache.fields.expireTimeSeconds")),
		),
		prop: "expireTime",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.cacheManage.refreshCache.fields.status"))),
		prop: "status",
		minWidth: 90,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.cacheManage.refreshCache.fields.refreshPolicy"))),
		prop: "refreshPolicy",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 120,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("devTeam.cacheManage.refreshCache.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.cacheId")),
		prop: "cacheId",
		valueType: "input",
	},
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.cacheCode")),
		prop: "cacheCode",
		valueType: "input",
	},
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.cacheName")),
		prop: "cacheName",
		valueType: "input",
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	});
}

function handleClearCache(row: RefreshCacheListItem) {
	console.log(transformI18n($t("devTeam.cacheManage.refreshCache.buttons.refresh")), row);
}
</script>

<template>
	<section :key="locale" class="index-root">
		<PlusSearch
			:key="locale"
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			:search-text="plusSearchButtonTexts.searchText"
			:reset-text="plusSearchButtonTexts.resetText"
			@search="handleSearch"
			@reset="handleReSearch"
		/>

		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
			<template #buttons>
				<ElButton type="primary">
					{{ transformI18n($t("common.buttons.add")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
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
