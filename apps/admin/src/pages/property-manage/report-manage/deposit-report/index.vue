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
/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: mockTableData.length,
});

/** 表格数据 */
const tableData = ref<押金报表_表格数据[]>([]);

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

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

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
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

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

/** 加载表格数据 */
async function loadTableData() {
	let filteredData = mockTableData;

	if (plusSearchModel.value.楼栋) {
		filteredData = filteredData.filter((item) => item.楼栋 === plusSearchModel.value.楼栋);
	}

	if (plusSearchModel.value.单元) {
		filteredData = filteredData.filter((item) => item.单元 === plusSearchModel.value.单元);
	}

	if (plusSearchModel.value.房屋编号) {
		filteredData = filteredData.filter((item) => item.房号.includes(plusSearchModel.value.房屋编号!));
	}

	if (plusSearchModel.value.费用id) {
		filteredData = filteredData.filter((item) => item.费用ID.includes(plusSearchModel.value.费用id!));
	}

	if (plusSearchModel.value.费用项目名称) {
		filteredData = filteredData.filter((item) => item.费用项 === plusSearchModel.value.费用项目名称);
	}

	if (plusSearchModel.value.收费状态) {
		filteredData = filteredData.filter((item) => item.状态 === plusSearchModel.value.收费状态);
	}

	if (plusSearchModel.value.收费对象类型) {
		filteredData = filteredData.filter((item) => item.付费对象类型 === plusSearchModel.value.收费对象类型);
	}

	if (plusSearchModel.value.退费状态) {
		filteredData = filteredData.filter((item) => item.退费状态 === plusSearchModel.value.退费状态);
	}

	if (plusSearchModel.value.费用创建开始时间 && plusSearchModel.value.费用创建结束时间) {
		const start = dayjs(plusSearchModel.value.费用创建开始时间);
		const end = dayjs(plusSearchModel.value.费用创建结束时间);
		filteredData = filteredData.filter((item) => {
			const createdAt = dayjs(item.创建时间);
			return createdAt.isAfter(start) && createdAt.isBefore(end);
		});
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
