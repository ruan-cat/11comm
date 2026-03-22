<script lang="ts" setup>
definePage({
	meta: {
		title: "数据统计",
		icon: "f7:menu",
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { title } from "process";
import type {
	DataStatisticsMonthlyArrearsDetailsListItem,
	DataStatisticsMonthlyArrearsDetailsQueryParams,
} from "@01s-11comm/type";

const realTotal = ref<number>(0);

const tableDataItem: DataStatisticsMonthlyArrearsDetailsListItem = {
	house: "001-1-1010",
	owner: "gugugaga(13912341234)",
	feeName: "物业费gugugaga",
	arrearsPeriod: "2077-5",
	arrearsAmount: "114514.11",
};

/** 表格数据 */
const tableData = ref<DataStatisticsMonthlyArrearsDetailsListItem[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);
// 表格列配置
const columns = ref<TableColumnList>([
	{
		label: "房屋",
		prop: "house",
		width: 100,
		fixed: true,
	},
	{
		label: "业主",
		prop: "owner",
		width: 100,
		fixed: true,
	},
	{
		label: "费用名称",
		prop: "feeName",
		width: 100,
		fixed: true,
	},
	{
		label: "欠费时间段",
		prop: "arrearsPeriod",
		width: 100,
		fixed: true,
	},
	{
		label: "欠费金额",
		prop: "arrearsAmount",
		width: 100,
		fixed: true,
	},
]);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & DataStatisticsMonthlyArrearsDetailsQueryParams = {
	building: "",
	startTime: "",
	endTime: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */

const plusSearchColumns = computed<PlusColumn[]>(() => [
	//楼栋
	{
		label: transformI18n($t("propertyManage_reportManage.report.build")),
		prop: "building",
		valueType: "select",
		options: [
			{
				label: "楼栋1",
				value: "楼栋1",
			},
			{
				label: "楼栋2",
				value: "楼栋2",
			},
			{
				label: "楼栋3",
				value: "楼栋3",
			},
		],
	},
	// 开始时间
	{
		label: transformI18n($t("propertyManage_reportManage.report.startTime")),
		prop: "startTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},
	// 结束时间
	{
		label: transformI18n($t("propertyManage_reportManage.report.endTime")),
		prop: "endTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
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

async function handleReSearch() {
	console.log("重新搜索");
}
async function handleSearch() {
	console.log("搜索");
}

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

/** 表格配置 */
const pureTableProps = ref<ListPureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

// 表格操作栏组件配置
const pureTableBarProps = ref<PureTableBarProps>({
	title: "月欠费明细",
	columns: columns.value,
});
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />
		<!-- {{ plusSearchModel }} -->
		<PureTableBar :="pureTableBarProps">
			<template #buttons>
				<ElButton type="primary"> {{ transformI18n($t("propertyManage_reportManage.report.derived")) }} </ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				/>
				<div>总实收:{{ realTotal }}</div>
			</template>
		</PureTableBar>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
.demo-tabs > .el-tabs__content {
	padding: 32px;
	color: #6b778c;
	font-size: 32px;
	font-weight: 600;
}
</style>
