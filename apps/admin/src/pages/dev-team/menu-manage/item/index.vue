<script lang="ts" setup>
definePage({
	meta: {
		title: "菜单项",
		icon: "mdi:format-list-text",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.menuManage.item"),
	},
});

import { ref, computed } from "vue";
import { transformI18n } from "@/plugins/i18n";
import {
	type MenuItemListItem,
	type MenuItemQueryParams,
	menuTypeOptions,
	menuItemStatusOptions,
	booleanOptions,
} from "@01s-11comm/type";
import { useMenuItemListQuery } from "@/api/dev-team/menu-manage/item";

/** 使用 TanStack Query 获取数据 */
const { tableData, total, pageIndex, pageSize, isLoading, queryParams, updateParams, resetParams, refetch } =
	useMenuItemListQuery();

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "菜单编号",
		prop: "menuId",
		width: 120,
	},
	{
		label: "菜单名称",
		prop: "menuName",
		width: 150,
	},
	{
		label: "父级菜单",
		prop: "parentMenu",
		width: 120,
	},
	{
		label: "菜单类型",
		prop: "menuType",
		width: 100,
	},
	{
		label: "路由路径",
		prop: "routePath",
		minWidth: 200,
	},
	{
		label: "组件路径",
		prop: "componentPath",
		minWidth: 200,
	},
	{
		label: "权限标识",
		prop: "permissionKey",
		width: 150,
	},
	{
		label: "排序",
		prop: "sortNo",
		width: 80,
	},
	{
		label: "状态",
		prop: "status",
		width: 100,
	},
	{
		label: "是否外链",
		prop: "isExternal",
		width: 100,
	},
	{
		label: "是否缓存",
		prop: "isCached",
		width: 100,
	},
	{
		label: "是否隐藏",
		prop: "isHidden",
		width: 100,
	},
	{
		label: "创建时间",
		prop: "createTime",
		width: 160,
	},
	{
		/** @see https://vscode.dev/github.com/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
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
	loading: isLoading.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "菜单项",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<MenuItemQueryParams> = {
	menuId: "",
	menuName: "",
	parentMenu: "",
	menuType: undefined,
	status: undefined,
	isExternal: undefined,
	isCached: undefined,
	isHidden: undefined,
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
	// 菜单编号
	{
		label: "菜单编号",
		prop: "menuId",
		valueType: "input",
	},

	// 菜单名称
	{
		label: "菜单名称",
		prop: "menuName",
		valueType: "input",
	},

	// 父级菜单
	{
		label: "父级菜单",
		prop: "parentMenu",
		valueType: "input",
	},

	// 菜单类型
	{
		label: "菜单类型",
		prop: "menuType",
		valueType: "select",
		options: menuTypeOptions,
	},

	// 状态
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: menuItemStatusOptions,
	},

	// 是否外链
	{
		label: "是否外链",
		prop: "isExternal",
		valueType: "select",
		options: booleanOptions,
	},

	// 是否缓存
	{
		label: "是否缓存",
		prop: "isCached",
		valueType: "select",
		options: booleanOptions,
	},

	// 是否隐藏
	{
		label: "是否隐藏",
		prop: "isHidden",
		valueType: "select",
		options: booleanOptions,
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
	} as Partial<MenuItemQueryParams>);
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

		<PureTableBar :="pureTableBarProps" @refresh="refetch">
			<template #buttons>
				<ElButton type="primary">
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
						<ElButton type="warning">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger">
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
