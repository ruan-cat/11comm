<script lang="ts" setup>
definePage({
	meta: {
		// 菜单项
		title: "devTeam.menuManage.item.pageTitle",
		icon: "mdi:format-list-text",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.menuManage.item"),
	},
});

import { ref, computed } from "vue";
import { transformI18n } from "@/plugins/i18n";
import type { FieldValues, PlusColumn } from "plus-pro-components";

import { defaultPureTableIndexColumn } from "@/config/constant";
import { useI18n } from "vue-i18n";
import {
	type MenuItemListItem,
	type MenuItemQueryParams,
	menuTypeOptions,
	menuItemStatusOptions,
	booleanOptions,
} from "@01s-11comm/type";
import { useMenuItemListQuery } from "@/api/dev-team/menu-manage/item";

const { t } = useI18n();

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
} = useMenuItemListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.menuId")),
		prop: "menuId",
		width: 120,
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.menuName")),
		prop: "menuName",
		width: 150,
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.parentMenu")),
		prop: "parentMenu",
		width: 120,
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.menuType")),
		prop: "menuType",
		width: 100,
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.routePath")),
		prop: "routePath",
		minWidth: 200,
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.componentPath")),
		prop: "componentPath",
		minWidth: 200,
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.permissionKey")),
		prop: "permissionKey",
		width: 150,
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.sortNo")),
		prop: "sortNo",
		width: 80,
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.status")),
		prop: "status",
		width: 100,
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.isExternal")),
		prop: "isExternal",
		width: 100,
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.isCached")),
		prop: "isCached",
		width: 100,
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.isHidden")),
		prop: "isHidden",
		width: 100,
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.createTime")),
		prop: "createTime",
		width: 160,
	},
	{
		/** @see https://vscode.dev/github.com/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n(t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: transformI18n(t("devTeam.menuManage.item.pageTitle")),
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 菜单编号
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.menuId")),
		prop: "menuId",
		valueType: "input",
	},

	// 菜单名称
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.menuName")),
		prop: "menuName",
		valueType: "input",
	},

	// 父级菜单
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.parentMenu")),
		prop: "parentMenu",
		valueType: "input",
	},

	// 菜单类型
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.menuType")),
		prop: "menuType",
		valueType: "select",
		options: menuTypeOptions,
	},

	// 状态
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.status")),
		prop: "status",
		valueType: "select",
		options: menuItemStatusOptions,
	},

	// 是否外链
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.isExternal")),
		prop: "isExternal",
		valueType: "select",
		options: booleanOptions,
	},

	// 是否缓存
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.isCached")),
		prop: "isCached",
		valueType: "select",
		options: booleanOptions,
	},

	// 是否隐藏
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.isHidden")),
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
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
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
				<ElButton type="primary">
					{{ transformI18n(t("common.buttons.add")) }}
				</ElButton>
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
						<ElButton type="warning">
							{{ transformI18n(t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger">
							{{ transformI18n(t("common.buttons.del")) }}
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
