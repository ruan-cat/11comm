<script lang="ts" setup>
definePage({
	meta: {
		title: "押金报表",
		icon: "mdi:bank",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.depositReport"),
	},
});

import dayjs from "dayjs";
import { transformI18n } from "@/plugins/i18n";
import type {
  DepositReportListItem,
  DepositReportQueryParams
} from "@01s-11comm/type";
import { useDepositReportListQuery } from "@/api/property-manage/report-manage/deposit-report";

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "费用ID",
		prop: "费用ID",
		minWidth: 140,
	},
	{
		label: "房号",
		prop: "房号",
		minWidth: 140,
	},
	{
		label: "业主",
		prop: "业主",
		minWidth: 180,
	},
	{
		label: "费用类型",
		prop: "费用类型",
		minWidth: 140,
	},
	{
		label: "费用项",
		prop: "费用项",
		minWidth: 160,
	},
	{
		label: "费用开始时间",
		prop: "费用开始时间",
		minWidth: 180,
	},
	{
		label: "费用结束时间",
		prop: "费用结束时间",
		minWidth: 180,
	},
	{
		label: "创建时间",
		prop: "创建时间",
		minWidth: 180,
	},
	{
		label: "付费对象类型",
		prop: "付费对象类型",
		minWidth: 160,
	},
	{
		label: "付款方ID",
		prop: "付款方ID",
		minWidth: 140,
	},
	{
		label: "应收金额",
		prop: "应收金额",
		minWidth: 140,
	},
	{
		label: "状态",
		prop: "状态",
		minWidth: 140,
	},
	{
		label: "退费状态",
		prop: "退费状态",
		minWidth: 140,
	},
	{
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "押金报表",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 押金报表_搜索_VO = {
	楼栋: "",
	单元: "",
	房屋编号: "",
	费用id: "",
	费用项目名称: "",
	收费状态: "",
	收费对象类型: "",
	费用创建开始时间: "",
	费用创建结束时间: "",
	退费状态: "",
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
} = useDepositReportListQuery(plusSearchDefaultValues);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "楼栋",
		prop: "楼栋",
		valueType: "select",
		options: buildingOptions,
	},
	{
		label: "单元",
		prop: "单元",
		valueType: "select",
		options: unitOptions,
	},
	{
		label: "房屋编号",
		prop: "房屋编号",
		valueType: "input",
	},
	{
		label: "费用ID",
		prop: "费用id",
		valueType: "input",
	},
	{
		label: "费用项目名称",
		prop: "费用项目名称",
		valueType: "select",
		options: 费用项目名称Options,
	},
	{
		label: "收费状态",
		prop: "收费状态",
		valueType: "select",
		options: 收费状态Options,
	},
	{
		label: "收费对象类型",
		prop: "收费对象类型",
		valueType: "select",
		options: 收费对象类型Options,
	},
	{
		label: "费用创建开始时间",
		prop: "费用创建开始时间",
		valueType: "date-picker",
	},
	{
		label: "费用创建结束时间",
		prop: "费用创建结束时间",
		valueType: "date-picker",
	},
	{
		label: "退费状态",
		prop: "退费状态",
		valueType: "select",
		options: 退费状态Options,
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
				<ElButton type="info" @click="doFetch">
					{{ transformI18n($t("common.buttons.pureReload")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					:loading="isFetching"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="info"> {{ transformI18n($t("common.buttons.info")) }} </ElButton>
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
