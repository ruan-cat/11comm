<script lang="ts" setup>
definePage({
	meta: {
		title: "修改密码",
		icon: "mdi:key",
		rank: getRouteRank("settingManage.systemManage.changePassword"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useChangePasswordRecordListQuery } from "@/api/setting-manage/system-manage/change-password";
import { cloneDeep } from "@pureadmin/utils";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import type { ChangePasswordRecordListQuery } from "@01s-11comm/type";
import {
	changePasswordRecordTypeOptions,
	changePasswordRecordStatusOptions,
	changePasswordRecordDepartmentOptions,
} from "@01s-11comm/type";

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ChangePasswordRecordListQuery> = {
	username: "",
	realName: "",
	department: "",
	changeTime: "",
	changeType: "",
	status: "",
	changeTimeRange: ["", ""],
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

// 使用密码修改记录列表查询 Hook
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useChangePasswordRecordListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "记录ID",
		prop: "id",
		width: 120,
		fixed: true,
	},
	{
		label: "用户名",
		prop: "username",
		width: 120,
	},
	{
		label: "真实姓名",
		prop: "realName",
		width: 120,
	},
	{
		label: "所属部门",
		prop: "department",
		width: 120,
	},
	{
		label: "修改时间",
		prop: "changeTime",
		width: 180,
	},
	{
		label: "修改IP",
		prop: "changeIp",
		width: 130,
	},
	{
		label: "修改类型",
		prop: "changeType",
		width: 140,
	},
	{
		label: "操作人",
		prop: "operator",
		width: 120,
	},
	{
		label: "状态",
		prop: "status",
		width: 100,
	},
	{
		label: "备注",
		prop: "remark",
		minWidth: 200,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "密码修改记录",
	columns: columns.value,
});

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

	// 所属部门
	{
		label: "所属部门",
		prop: "department",
		valueType: "select",
		options: changePasswordRecordDepartmentOptions,
	},

	// 修改类型
	{
		label: "修改类型",
		prop: "changeType",
		valueType: "select",
		options: changePasswordRecordTypeOptions,
	},

	// 状态
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: changePasswordRecordStatusOptions,
	},

	// 修改时间
	{
		label: "修改时间",
		prop: "changeTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},

	{
		label: "修改时间范围",
		prop: "changeTimeRange",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
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
async function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
async function handleSearch() {
	updateParams(plusSearchModel.value);
}

onMounted(async () => {
	// 数据自动加载
});
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
				<!-- 仅展示列表，无新增按钮 -->
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
						<ElButton type="info"> 详情 </ElButton>
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
