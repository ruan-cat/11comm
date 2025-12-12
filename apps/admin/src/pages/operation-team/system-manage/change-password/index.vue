<script lang="ts" setup>
definePage({
	meta: {
		title: "修改密码记录",
		icon: "mdi:lock-reset",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.systemManage.changePassword"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import {
	type ChangePasswordRecordListItem,
	type ChangePasswordRecordQueryParams,
	userRoleOptions,
	departmentOptions,
	changeMethodOptions,
	changePasswordStatusOptions,
	changePasswordSuccessOptions,
} from "@01s-11comm/type";
import { useChangePasswordRecordListQuery } from "@/api/operation-team/system-manage/change-password";

/** 使用 TanStack Query 获取数据 */
const { tableData, total, pageIndex, pageSize, isLoading, queryParams, updateParams, resetParams, refetch } =
	useChangePasswordRecordListQuery();

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "用户名",
		prop: "username",
		width: 120,
		fixed: true,
	},
	{
		label: "真实姓名",
		prop: "realName",
		width: 100,
	},
	{
		label: "用户角色",
		prop: "userRole",
		width: 120,
	},
	{
		label: "所属部门",
		prop: "department",
		width: 100,
	},
	{
		label: "联系电话",
		prop: "phone",
		width: 120,
	},
	{
		label: "修改时间",
		prop: "changeTime",
		width: 160,
	},
	{
		label: "修改IP地址",
		prop: "ipAddress",
		width: 130,
	},
	{
		label: "修改地点",
		prop: "location",
		minWidth: 150,
	},
	{
		label: "修改方式",
		prop: "changeMethod",
		width: 120,
	},
	{
		label: "操作状态",
		prop: "status",
		width: 100,
	},
	{
		label: "是否成功",
		prop: "success",
		width: 100,
	},
	{
		label: "失败原因",
		prop: "failureReason",
		minWidth: 180,
	},
	{
		label: "操作人",
		prop: "operator",
		width: 100,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 200,
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
	title: "密码修改记录",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ChangePasswordRecordQueryParams> & { changeTimeRange: [string, string] } = {
	username: "",
	realName: "",
	userRole: undefined,
	department: undefined,
	changeMethod: undefined,
	status: undefined,
	success: undefined,
	startTime: "",
	endTime: "",
	changeTimeRange: ["", ""],
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
	// 用户名
	{
		label: "用户名",
		prop: "username",
		valueType: "input",
	},

	// 真实姓名
	{
		label: "真实姓名",
		prop: "realName",
		valueType: "input",
	},

	// 用户角色
	{
		label: "用户角色",
		prop: "userRole",
		valueType: "select",
		options: userRoleOptions,
	},

	// 所属部门
	{
		label: "所属部门",
		prop: "department",
		valueType: "select",
		options: departmentOptions,
	},

	// 修改方式
	{
		label: "修改方式",
		prop: "changeMethod",
		valueType: "select",
		options: changeMethodOptions,
	},

	// 操作状态
	{
		label: "操作状态",
		prop: "status",
		valueType: "select",
		options: changePasswordStatusOptions,
	},

	// 是否成功
	{
		label: "是否成功",
		prop: "success",
		valueType: "select",
		options: changePasswordSuccessOptions,
	},

	// 修改时间范围
	{
		label: "修改时间范围",
		prop: "changeTimeRange",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
			onChange(value: string[] | null) {
				plusSearchModel.value.startTime = value?.[0] ?? "";
				plusSearchModel.value.endTime = value?.[1] ?? "";
			},
			onClear() {
				plusSearchModel.value.startTime = "";
				plusSearchModel.value.endTime = "";
			},
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
	} as Partial<ChangePasswordRecordQueryParams>);
}

/** 查看详情 */
function viewDetails(row: ChangePasswordRecordListItem) {
	console.log("查看详情", row);
	// TODO: 实现查看详情功能
}

/** 导出记录 */
function exportRecords() {
	console.log("导出记录");
	// TODO: 实现导出功能
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
				<ElButton type="primary"> {{ transformI18n($t("common.buttons.add")) }} </ElButton>
				<ElButton type="success" @click="exportRecords">
					{{ transformI18n($t("common.buttons.export")) }}
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
						<ElButton type="info" @click="viewDetails(row)">
							{{ transformI18n($t("common.buttons.detail")) }}
						</ElButton>
						<ElButton type="warning"> {{ transformI18n($t("common.buttons.edit")) }} </ElButton>
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
