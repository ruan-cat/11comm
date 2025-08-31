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

const outstandingTotal = ref<number>(114514);

interface 报表管理_月实收明细 {
	房屋: string;
	业主: string;
	欠费: string;
	实收: string;
	费用名称: string;
	实收时间段: string;
	收银员: string;
	交费时间: string;
}

const tableDataItem: 报表管理_月实收明细 = {
	房屋: "001-1-1010",
	业主: "gugugaga(13912341234)",
	欠费: "123.123",
	实收: "物业费 (114514)(2077-10-1~2077-11-11)=1234",
	费用名称: "物业费gugugaga",
	实收时间段: "2077-5",
	收银员: "gugugaga",
	交费时间: "2077-05-01 15:30:55",
};

/** 表格数据 */
const tableData = ref<报表管理_月实收明细[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);
// 表格列配置
const columns = ref<TableColumnList>([
	{
		label: "房屋",
		prop: "房屋",
		width: 100,
		fixed: true,
	},
	{
		label: "业主",
		prop: "业主",
		width: 100,
		fixed: true,
	},
	{
		label: "实收",
		prop: "实收",
		width: 100,
		fixed: true,
	},
	{
		label: "费用名称",
		prop: "费用名称",
		width: 100,
		fixed: true,
	},
	{
		label: "实收时间段",
		prop: "实收时间段",
		width: 100,
		fixed: true,
	},
	{
		label: "收银员",
		prop: "收银员",
		width: 100,
		fixed: true,
	},
	{
		label: "交费时间",
		prop: "交费时间",
		width: 100,
		fixed: true,
	},
	// {
	// 	label: transformI18n($t("table.operation")),
	// 	minWidth: 160,
	// 	fixed: "right",
	// 	slot: "operation",
	// },
]);
interface 报表管理_月实收明细_VO {
	楼栋?: string;
	开始时间?: string;
	结束时间?: string;
}
/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 报表管理_月实收明细_VO = {
	楼栋: "",
	开始时间: "",
	结束时间: "",
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
	//楼栋
	{
		label: transformI18n($t("propertyManage_reportManage.report.build")),
		prop: "楼栋",
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
const pureTableProps = ref<PureTableProps>({
	border: true,
	stripe: true,
	adaptive: true,
	highlightCurrentRow: true,
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
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				/>
				<div>总欠费:{{ outstandingTotal }}</div>
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
