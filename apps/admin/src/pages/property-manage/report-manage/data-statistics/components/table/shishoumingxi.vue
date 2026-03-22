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
	DataStatisticsActualCollectionDetailsListItem,
	DataStatisticsActualCollectionDetailsQueryParams,
} from "@01s-11comm/type";

const tableDataItem: DataStatisticsActualCollectionDetailsListItem = {
	house: "11-0-07",
	owner: "gugugaga(114514)",
	actualCollection: "114514",
	propertyFee: "物业费(2077-1-1~2077-8-8)",
	deposit: "1(2077-01-01~2077-08-08)=199",
	parkingFee: "0",
	gasFee: "0",
	heatingFee: "0",
	maintenanceFee: "0",
	serviceFee: "0",
	other: "0",
	waterFee: "居民生活费(2077-01-01~2077-02-02)",
	electricityFee: "0",
	rent: "0",
	commonAreaFee: "0",
};

/** 表格数据 */
const tableData = ref<DataStatisticsActualCollectionDetailsListItem[]>(
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
		label: "实收",
		prop: "actualCollection",
		width: 100,
		fixed: true,
	},
	{
		label: "物业费",
		prop: "propertyFee",
		width: 100,
		fixed: true,
	},
	{
		label: "押金",
		prop: "deposit",
		width: 100,
		fixed: true,
	},
	{
		label: "停车费",
		prop: "parkingFee",
		width: 100,
		fixed: true,
	},
	{
		label: "煤气费",
		prop: "gasFee",
		width: 100,
		fixed: true,
	},
	{
		label: "取暖费",
		prop: "heatingFee",
		width: 100,
		fixed: true,
	},
	{
		label: "维修费",
		prop: "maintenanceFee",
		width: 100,
		fixed: true,
	},
	{
		label: "服务费",
		prop: "serviceFee",
		width: 100,
		fixed: true,
	},
	{
		label: "其他",
		prop: "other",
		width: 100,
		fixed: true,
	},
	{
		label: "水费",
		prop: "waterFee",
		width: 100,
		fixed: true,
	},
	{
		label: "电费",
		prop: "electricityFee",
		width: 100,
		fixed: true,
	},
	{
		label: "租金",
		prop: "rent",
		width: 100,
		fixed: true,
	},
	{
		label: "公摊费",
		prop: "commonAreaFee",
		width: 100,
		fixed: true,
	},
]);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & DataStatisticsActualCollectionDetailsQueryParams = {
	houseNumber: "",
	ownerName: "",
	phoneNumber: "",
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
	//房屋编号
	{
		label: transformI18n($t("propertyManage_reportManage.report.houseNumber")),
		prop: "houseNumber",
		valueType: "input",
	},
	//业主名称
	{
		label: transformI18n($t("propertyManage_reportManage.report.employerName")),
		prop: "ownerName",
		valueType: "input",
	},
	//手机号
	{
		label: transformI18n($t("propertyManage_reportManage.report.phoneNumber")),
		prop: "phoneNumber",
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
	title: "实收统计",
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
