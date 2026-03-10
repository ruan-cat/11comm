<script lang="ts" setup>
definePage({
	meta: {
		// 菜单组
		title: "devTeam.menuManage.group.pageTitle",
		icon: "mdi:group",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.menuManage.group"),
	},
});

import { ref, computed } from "vue";
import { transformI18n } from "@/plugins/i18n";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { defaultPureTableIndexColumn } from "@/config/constant";
import { useI18n } from "vue-i18n";
import { type MenuGroupListItem, type MenuGroupQueryParams, menuGroupStatusOptions } from "@01s-11comm/type";
import { useMenuGroupListQuery } from "@/api/dev-team/menu-manage/group";

const { t } = useI18n();

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<MenuGroupQueryParams> = {
	groupId: "",
	groupName: "",
	groupCode: "",
	status: undefined,
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
} = useMenuGroupListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: transformI18n($t("devTeam.menuManage.group.fields.groupId")),
		prop: "groupId",
		width: 120,
		fixed: true,
	},
	{
		label: transformI18n($t("devTeam.menuManage.group.fields.groupName")),
		prop: "groupName",
		width: 150,
	},
	{
		label: transformI18n($t("devTeam.menuManage.group.fields.groupCode")),
		prop: "groupCode",
		width: 150,
	},
	{
		label: transformI18n($t("devTeam.menuManage.group.fields.sortNo")),
		prop: "sortNo",
		width: 80,
	},
	{
		label: transformI18n($t("devTeam.menuManage.group.fields.status")),
		prop: "status",
		width: 100,
	},
	{
		label: transformI18n($t("devTeam.menuManage.group.fields.description")),
		prop: "description",
		minWidth: 200,
		showOverflowTooltip: true,
	},
	{
		label: transformI18n($t("devTeam.menuManage.group.fields.createTime")),
		prop: "createTime",
		width: 160,
	},
	{
		label: transformI18n($t("devTeam.menuManage.group.fields.updateTime")),
		prop: "updateTime",
		width: 160,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n(t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: transformI18n($t("devTeam.menuManage.group.pageTitle")),
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 组编号
	{
		label: transformI18n($t("devTeam.menuManage.group.fields.groupId")),
		prop: "groupId",
		valueType: "input",
	},

	// 组名称
	{
		label: transformI18n($t("devTeam.menuManage.group.fields.groupName")),
		prop: "groupName",
		valueType: "input",
	},

	// 组编码
	{
		label: transformI18n($t("devTeam.menuManage.group.fields.groupCode")),
		prop: "groupCode",
		valueType: "input",
	},

	// 状态
	{
		label: transformI18n($t("devTeam.menuManage.group.fields.status")),
		prop: "status",
		valueType: "select",
		options: menuGroupStatusOptions,
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
				<ElButton type="primary"> {{ transformI18n(t("common.buttons.add")) }} </ElButton>
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
						<ElButton type="warning"> {{ transformI18n(t("common.buttons.edit")) }} </ElButton>
						<ElButton type="danger"> {{ transformI18n(t("common.buttons.del")) }} </ElButton>
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
