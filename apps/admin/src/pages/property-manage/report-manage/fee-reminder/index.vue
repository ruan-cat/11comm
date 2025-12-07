<script lang="ts" setup>
definePage({
	meta: {
		title: "费用提醒",
		icon: "mdi:bell-alert",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.feeReminder"),
	},
});

import dayjs from "dayjs";
import { transformI18n } from "@/plugins/i18n";
import ExpirationReminders from "./components/Expiration-reminders.vue";
import PrepaymentReminders from "./components/Prepayment-reminders.vue";
import {
	tableData as mockTableData,
	type 费用提醒_搜索_VO,
	type 费用提醒_表格数据,
	费用项Options,
	小区Options,
	提醒类型Options,
} from "./test-data";

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: mockTableData.length,
});

/** 表格数据 */
const tableData = ref<费用提醒_表格数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "房屋编号/合同名称",
		prop: "房屋编号合同名称",
		minWidth: 200,
	},
	{
		label: "业主名称",
		prop: "业主名称",
		minWidth: 160,
	},
	{
		label: "业主手机号",
		prop: "业主手机号",
		minWidth: 160,
	},
	{
		label: "费用项",
		prop: "费用项",
		minWidth: 140,
	},
	{
		label: "小区",
		prop: "小区",
		minWidth: 140,
	},
	{
		label: "提醒类型",
		prop: "提醒类型",
		minWidth: 140,
	},
	{
		label: "到期时间",
		prop: "到期时间",
		minWidth: 180,
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
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "费用提醒",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 费用提醒_搜索_VO = {
	房屋编号合同名称: "",
	业主名称: "",
	业主手机号: "",
	费用项: "",
	小区: "",
	提醒类型: "",
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
	{
		label: "房屋编号/合同名称",
		prop: "房屋编号合同名称",
		valueType: "input",
	},
	{
		label: "业主名称",
		prop: "业主名称",
		valueType: "input",
	},
	{
		label: "业主手机号",
		prop: "业主手机号",
		valueType: "input",
	},
	{
		label: "费用项",
		prop: "费用项",
		valueType: "select",
		options: 费用项Options,
	},
	{
		label: "小区",
		prop: "小区",
		valueType: "select",
		options: 小区Options,
	},
	{
		label: "提醒类型",
		prop: "提醒类型",
		valueType: "select",
		options: 提醒类型Options,
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

/** 加载表格数据 */
async function loadTableData() {
	let filteredData = mockTableData;

	if (plusSearchModel.value.房屋编号合同名称) {
		filteredData = filteredData.filter((item) =>
			item.房屋编号合同名称.includes(plusSearchModel.value.房屋编号合同名称!),
		);
	}

	if (plusSearchModel.value.业主名称) {
		filteredData = filteredData.filter((item) => item.业主名称.includes(plusSearchModel.value.业主名称!));
	}

	if (plusSearchModel.value.业主手机号) {
		filteredData = filteredData.filter((item) => item.业主手机号.includes(plusSearchModel.value.业主手机号!));
	}

	if (plusSearchModel.value.费用项) {
		filteredData = filteredData.filter((item) => item.费用项 === plusSearchModel.value.费用项);
	}

	if (plusSearchModel.value.小区) {
		filteredData = filteredData.filter((item) => item.小区 === plusSearchModel.value.小区);
	}

	if (plusSearchModel.value.提醒类型) {
		filteredData = filteredData.filter((item) => item.提醒类型 === plusSearchModel.value.提醒类型);
	}

	pagination.value.total = filteredData.length;

	const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
	const endIndex = startIndex + pagination.value.pageSize;
	tableData.value = filteredData.slice(startIndex, endIndex);

	pureTableProps.value.data = tableData.value;
	pureTableProps.value.pagination = pagination.value;
}

/** 重置搜索条件并重新加载数据 */
async function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 执行搜索 */
async function handleSearch() {
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 处理页数变化 */
async function handlePageSizeChange(pageSize: number) {
	pagination.value.pageSize = pageSize;
	await loadTableData();
}

/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
	await loadTableData();
}

onMounted(async () => {
	await loadTableData();
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

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="info" @click="handleReSearch">
					{{ transformI18n($t("common.buttons.pureReload")) }}
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
						<ElButton type="info">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
					</template>
				</PureTable>
			</template>
		</PureTableBar>

		<div>
			预缴费提醒
			<ExpirationReminders />
		</div>
		<div>
			到期提醒
			<PrepaymentReminders />
		</div>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
