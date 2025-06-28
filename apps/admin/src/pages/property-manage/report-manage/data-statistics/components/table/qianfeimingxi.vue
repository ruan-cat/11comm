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

interface 报表管理_欠费明细 {
	房屋: string;
	业主: string;
	欠费: string;
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

const tableDataItem: 报表管理_欠费明细 = {
	房屋: "11-0-07",
	业主: "20250530业主",
	欠费: "1234",
	物业费: "物业费 (114514)(2077-10-1~2077-11-11)=1234",
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
const tableData = ref<报表管理_欠费明细[]>(
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
		label: "物业费",
		prop: "物业费",
		width: 100,
		fixed: true,
	},
	{
		label: "押金",
		prop: "押金",
		width: 100,
		fixed: true,
	},
	{
		label: "停车费",
		prop: "停车费",
		width: 100,
		fixed: true,
	},
	{
		label: "煤气费",
		prop: "煤气费",
		width: 100,
		fixed: true,
	},
	{
		label: "取暖费",
		prop: "取暖费",
		width: 100,
		fixed: true,
	},
	{
		label: "维修费",
		prop: "维修费",
		width: 100,
		fixed: true,
	},
	{
		label: "服务费",
		prop: "服务费",
		width: 100,
		fixed: true,
	},
	{
		label: "其他",
		prop: "其他",
		width: 100,
		fixed: true,
	},
	{
		label: "水费",
		prop: "水费",
		width: 100,
		fixed: true,
	},
	{
		label: "电费",
		prop: "电费",
		width: 100,
		fixed: true,
	},
	{
		label: "租金",
		prop: "租金",
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
interface 报表管理_欠费明细_VO {
	房屋编号?: string;
	业主名称?: string;
	手机号?: string;
}
/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 报表管理_欠费明细_VO = {
	房屋编号: "",
	业主名称: "",
	手机号: "",
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
	//房屋编号
	{
		label: transformI18n($t("propertyManage_reportManage.report.houseNumber")),
		prop: "房屋编号",
		valueType: "input",
	},
	//业主名称
	{
		label: transformI18n($t("propertyManage_reportManage.report.employerName")),
		prop: "业主名称",
		valueType: "input",
	},
	//手机号
	{
		label: transformI18n($t("propertyManage_reportManage.report.phoneNumber")),
		prop: "手机号",
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
	title: "欠费明细",
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
