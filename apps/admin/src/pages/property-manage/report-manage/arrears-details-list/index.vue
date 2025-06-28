<script lang="ts" setup>
definePage({
	meta: {
		title: "欠费明细表",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.arrearsDetailsList"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { title } from "process";

const smallTotal = ref<number>(0); // 小计欠费
const largeTotal = ref<number>(0); // 大计欠费

interface 报表管理_欠费明细表 {
	费用编号: string;
	房号: string;
	业主: string;
	业主电话: string;
	面积: string;
	费用项: string;
	开始时间: string;
	结束时间: string;
	欠费时长: string;
	欠费金额: string;
}

const tableDataItem: 报表管理_欠费明细表 = {
	费用编号: "1",
	房号: "000010000(陕A12345)",
	业主: "林先生",
	业主电话: "13888888888",
	面积: "111.00",
	费用项: "居民水费",
	开始时间: "2025-05-25",
	结束时间: "2025-06-24",
	欠费时长: "30天",
	欠费金额: "500.00",
};

/** 表格数据 */
const tableData = ref<报表管理_欠费明细表[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);
// 表格列配置
const columns = ref<TableColumnList>([
	{
		label: "费用编号",
		prop: "费用编号",
		width: 60,
		fixed: true,
	},
	{
		label: "房号",
		prop: "房号",
		width: 120,
	},
	{
		label: "业主",
		prop: "业主",
		width: 160,
	},
	{
		label: "业主电话",
		prop: "业主电话",
		width: 120,
	},
	{
		label: "面积",
		prop: "面积",
		width: 60,
	},
	{
		label: "费用项",
		prop: "费用项",
		width: 180,
	},
	{
		label: "开始时间",
		prop: "开始时间",
		width: 80,
	},
	{
		label: "结束时间",
		prop: "结束时间",
		width: 120,
	},
	{
		label: "欠费时长(天)",
		prop: "欠费时长",
		width: 120,
	},
	{
		label: "欠费金额",
		prop: "欠费金额",
		width: 120,
	},
	// {
	// 	label: transformI18n($t("table.operation")),
	// 	minWidth: 240,
	// 	fixed: "right",
	// 	slot: "operation",
	// },
]);

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
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

// 表格操作栏组件配置
const pureTableBarProps = ref<PureTableBarProps>({
	title: "欠费明细表",
	columns: columns.value,
});

interface 报表管理_欠费明细表_VO {
	费用大类?: string;
	填写房屋编号?: string;
	开始事件?: string;
	结束时间?: string;
	小区?: string;
	填写业主名称?: string;
}
/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 报表管理_欠费明细表_VO = {
	费用大类: "",
	填写房屋编号: "",
	开始事件: "",
	结束时间: "",
	小区: "",
	填写业主名称: "",
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
	//费用大类
	{
		label: transformI18n($t("费用大类")),
		prop: "费用大类",
		valueType: "select",
		options: [
			{
				label: "物业费",
				value: "物业费",
			},
			{
				label: "押金",
				value: "押金",
			},
			{
				label: "停车费",
				value: "停车费",
			},
			{
				label: "煤气费",
				value: "煤气费",
			},
			{
				label: "服务费",
				value: "服务费",
			},
			{
				label: "其他",
				value: "其他",
			},
			{
				label: "水费",
				value: "水费",
			},
			{
				label: "电费",
				value: "电费",
			},
			{
				label: "公摊费",
				value: "公摊费",
			},
			{
				label: "系统费用",
				value: "系统费用",
			},
			{
				label: "租金",
				value: "租金",
			},
		],
	},
	//房屋编号
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseNumber")),
		prop: "填写房屋编号",
		valueType: "input",
	},
	// 开始时间
	{
		label: transformI18n($t("propertyManage_reportManage.report.startTime")),
		prop: "开始时间",
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
		prop: "结束时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},
	//小区
	{
		label: transformI18n($t("propertyManage_reportManage.report.cell")),
		prop: "小区",
		valueType: "select",
		options: [
			{
				label: "小区1",
				value: "小区1",
			},
			{
				label: "小区2",
				value: "小区2",
			},
			{
				label: "小区3",
				value: "小区3",
			},
		],
	},
	//业主名称
	{
		label: transformI18n($t("propertyManage_reportManage.report.employerName")),
		prop: "填写业主名称",
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
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleReSearch" />

		<!-- {{ plusSearchModel }} -->
		<div>
			<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
				<template #buttons>
					<ElButton type="primary"> {{ transformI18n($t("propertyManage_reportManage.report.derived")) }} </ElButton>
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
						<template #operation="{}">
							<ElButton type="warning"> {{ transformI18n($t("common.buttons.edit")) }} </ElButton>
							<ElButton type="info"> {{ transformI18n($t("common.buttons.info")) }} </ElButton>
							<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
						</template>
					</PureTable>
				</template>
			</PureTableBar>
			<div>
				<div>小计 欠费 : {{ smallTotal }} 元</div>
				<div>大计 欠费 : {{ largeTotal }} 元</div>
				<div>费用开始时间：所创建费用的计费起始时间</div>
				<div>欠费时长（天）：押金费用项欠费时长是费用开始时间到当天的天数</div>
				<div>除押金外的费用项欠费时长是费用的开始时间到费用的结束时间的天数</div>
				<div>欠费金额：欠费周期内应缴费用</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
