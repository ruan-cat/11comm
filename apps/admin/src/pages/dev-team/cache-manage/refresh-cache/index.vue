<script lang="ts" setup>
definePage({
    meta: {
        title: "刷新缓存",
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

/** 使用 TanStack Query 获取数据 */
const {
    tableData,
    total,
    pageIndex,
    pageSize,
    isFetching,
    updateParams,
    resetParams,
    doFetch,
} = useRefreshCacheListQuery();

/** 表格列配置 */
const columns = ref<TableColumnList>([
    defaultPureTableIndexColumn,
    {
        label: "缓存ID",
        prop: "cacheId",
        minWidth: 120,
    },
    {
        label: "缓存编码",
        prop: "cacheCode",
        minWidth: 150,
    },
    {
        label: "名称",
        prop: "cacheName",
        minWidth: 150,
    },
    {
        /** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
        headerRenderer: () => transformI18n($t("common.table.operation")),
        width: 120,
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
const pureTableProps = ref<PureTableProps>({
    ...defaultPureTableProps,
    data: tableData.value,
    columns: [],
    pagination: pagination.value,
    loading: isFetching.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
    title: "缓存信息",
    columns: columns.value,
});

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
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
    // 缓存ID
    {
        label: "缓存ID",
        prop: "cacheId",
        valueType: "input",
    },

    // 缓存编码
    {
        label: "缓存编码",
        prop: "cacheCode",
        valueType: "input",
    },

    // 缓存名称
    {
        label: "缓存名称",
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
    plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
    resetParams();
}

/** 执行搜索 */
function handleSearch() {
    updateParams({
        ...plusSearchModel.value,
        pageIndex: 1,
    } as Partial<RefreshCacheQueryParams>);
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
                    :columns="dynamicColumns"
                    :size="size"
                    @page-size-change="handlePageSizeChange"
                    @page-current-change="handleCurrentPageChange"
                >
                    <template #operation="{ row }">
                        <ElButton type="info" @click="handleClearCache(row)">刷新缓存</ElButton>
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