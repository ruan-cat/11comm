<script lang="ts" setup>
definePage({
	meta: {
		title: "数据统计",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.dataStatistics"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { title } from "process";
import feeclass from "./components/class/feeclass.vue";
import orderclass from "./components/class/orderclass.vue";
import entryoutclass from "./components/class/entryoutclass.vue";
import otherclass from "./components/class/otherclass.vue";
import type { TabsPaneContext } from "element-plus";
// import * as TableComponents from "./components/table";

// export default {
//   components: {
//     ...TableComponents,
//   },
// };
import shishoutongji from "./components/table/shishoutongji.vue";
import shishoumingxi from "./components/table/shishoumingxi.vue";
import shoukuanfangshi from "./components/table/shoukuanfangshi.vue";
import qianfeitongji from "./components/table/qianfeitongji.vue";
import qianfeimingxi from "./components/table/qianfeimingxi.vue";
import shoujiaoqingkuang from "./components/table/shoujiaoqingkuang.vue";
import yueshishoumingxi from "./components/table/yueshishoumingxi.vue";
import yueqianfeimingxi from "./components/table/yueqianfeimingxi.vue";

//elmentplus分页
const activeName = ref("first");

const handleClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event);
};

interface 报表管理_数据统计 {
	房屋: string;
	业主: string;
	欠费: string;
	实收: string;
	物业费: string;
	押金: string;
	停车费: string;
	煤气费: string;
	取暖费: string;
	维修费: string;
	服务费: string;
	其他: string;
	水费: string;
	电费: string;
	租金: string;
	公摊费: string;
}

const tableDataItem: 报表管理_数据统计 = {
	房屋: "20250530-112725-101",
	业主: "20250530业主(13555555555)",
	欠费: "1000",
	实收: "0",
	物业费: "111.00",
	押金: "0",
	停车费: "0",
	煤气费: "0",
	取暖费: "0",
	维修费: "0",
	服务费: "0",
	其他: "0",
	水费: "0",
	电费: "0",
	租金: "0",
	公摊费: "0",
};

/** 表格数据 */
const tableData = ref<报表管理_数据统计[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);
// 表格列配置
const columns = ref<TableColumnList>([
	{
		label: "房屋",
		prop: "房屋",
		width: 60,
		fixed: true,
	},
	{
		label: "业主",
		prop: "业主",
		width: 120,
	},
	{
		label: "欠费",
		prop: "欠费",
		width: 160,
	},
	{
		label: "实收",
		prop: "实收",
		width: 120,
	},
	{
		label: "物业费",
		prop: "物业费",
		width: 180,
	},
	{
		label: "押金",
		prop: "押金",
		width: 180,
	},
	{
		label: "停车费",
		prop: "停车费",
		width: 100,
	},
	{
		label: "煤气费",
		prop: "结束时间",
		width: 80,
	},
	{
		label: "取暖费",
		prop: "取暖费",
		width: 80,
	},
	{
		label: "服务费",
		prop: "服务费",
		width: 80,
	},
	{
		label: "其他",
		prop: "其他费",
		width: 80,
	},
	{
		label: "水费",
		prop: "水费",
		width: 80,
	},
	{
		label: "电费",
		prop: "电费",
		width: 80,
	},
	{
		label: "租金",
		prop: "租金",
		width: 80,
	},
	{
		label: "公摊费",
		prop: "公摊费",
		width: 80,
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
	title: "数据统计",
	columns: columns.value,
});

interface 报表管理_费用明细表_VO {
	开始事件?: string;
	结束时间?: string;
	小区?: string;
}
/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 报表管理_费用明细表_VO = {
	开始事件: "",
	结束时间: "",
	小区: "",
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
		<!-- 横向排列的容器 -->
		<div class="module-container">
			<feeclass />
			<orderclass />
			<entryoutclass />
			<otherclass />
		</div>
		<!-- {{ plusSearchModel }} -->

		<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
			<el-tab-pane label="实收统计" name="first"><shishoutongji /> </el-tab-pane>
			<el-tab-pane label="实收明细" name="second"><shishoumingxi /> </el-tab-pane>
			<el-tab-pane label="收款方式统计" name="third"><shoukuanfangshi /> </el-tab-pane>
			<el-tab-pane label="欠费统计" name="fourth"><qianfeitongji /> </el-tab-pane>
			<el-tab-pane label="欠费明细" name="fifth"><qianfeimingxi /> </el-tab-pane>
			<el-tab-pane label="收缴情况" name="sixth"><shoujiaoqingkuang /> </el-tab-pane>
			<el-tab-pane label="月实收明细" name="seventh"><yueshishoumingxi /> </el-tab-pane>
			<el-tab-pane label="月欠费明细" name="eighth"><yueqianfeimingxi /> </el-tab-pane>
		</el-tabs>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
/* 横向排列的容器 */
.module-container {
	display: flex; /* 启用 Flex 布局 */
	gap: 20px; /* 组件之间的间隔 */

	justify-content: space-between; /* 左右对齐，中间均匀分布 */
	margin-bottom: 20px; /* 下方留出空间 */
}

/* 可选：统一设置每个模块的宽度 */
.module-container > * {
	flex: 1 1 22%; /* 每个模块最小宽度 22%，自动扩展 */
	min-width: 100px; /* 最小宽度限制 */
}
.demo-tabs > .el-tabs__content {
	padding: 32px;
	color: #6b778c;
	font-size: 32px;
	font-weight: 600;
}
</style>
