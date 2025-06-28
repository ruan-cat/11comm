<script lang="ts" setup>
definePage({
	meta: {
		title: "房屋管理",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.house"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 房屋管理_列表数据 {
	房屋: string;
	楼层: string;
	业主: string;
	类型: string;
	房屋面积: string;
	租金: string;
	房屋状态: string;
	有效期: string;
	业主成员: string;
	业主车辆: string;
	业主房屋: string;
	投诉: string;
	报修: string;
	房屋欠费: string;
	业主欠费: string;
	房屋合同: string;
}

const tableDataItem: 房屋管理_列表数据 = {
	房屋: "房屋",
	楼层: "楼层",
	业主: "业主",
	类型: "类型",
	房屋面积: "房屋面积",
	租金: "租金",
	房屋状态: "房屋状态",
	有效期: "有效期",
	业主成员: "业主成员",
	业主车辆: "业主车辆",
	业主房屋: "业主房屋",
	投诉: "投诉",
	报修: "报修",
	房屋欠费: "房屋欠费",
	业主欠费: "业主欠费",
	房屋合同: "房屋合同",
};

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{ label: "房屋", prop: "房屋", width: 120, fixed: true },
	{ label: "楼层", prop: "楼层", width: 100 },
	{ label: "业主", prop: "业主", width: 120 },
	{ label: "类型", prop: "类型", width: 100 },
	{ label: "房屋面积", prop: "房屋面积", width: 120 },
	{ label: "租金", prop: "租金", width: 100 },
	{ label: "房屋状态", prop: "房屋状态", width: 100 },
	{ label: "有效期", prop: "有效期", width: 120 },
	{ label: "业主成员", prop: "业主成员", width: 100 },
	{ label: "业主车辆", prop: "业主车辆", width: 100 },
	{ label: "业主房屋", prop: "业主房屋", width: 100 },
	{ label: "投诉", prop: "投诉", width: 100 },
	{ label: "报修", prop: "报修", width: 100 },
	{ label: "房屋欠费", prop: "房屋欠费", width: 100 },
	{ label: "业主欠费", prop: "业主欠费", width: 100 },
	{ label: "房屋合同", prop: "房屋合同", width: 120 },
	{
		label: transformI18n($t("common.table.operation")),
		minWidth: 180,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格数据 */
const tableData = ref<房屋管理_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

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

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "房屋管理",
	columns: columns.value,
});

interface 房屋管理_列表查询_VO {
	房屋编号?: string;
	房屋状态?: string;
	房屋类型?: string;
	楼栋单元?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 房屋管理_列表查询_VO = {
	房屋编号: "",
	房屋状态: "",
	房屋类型: "",
	楼栋单元: "",
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
	// 房屋编号
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseNumber")),
		prop: "房屋编号",
		valueType: "input",
	},

	// 房屋状态
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseState")),
		prop: "房屋状态",
		valueType: "select",
		options: [
			{
				label: "未销售",
				value: "未销售",
			},
			{
				label: "已入住",
				value: "已入住",
			},
			{
				label: "已交房",
				value: "已交房",
			},
			{
				label: "已装修",
				value: "已装修",
			},
			{
				label: "未入住",
				value: "未入住",
			},
			{
				label: "已出租",
				value: "已出租",
			},
			{
				label: "已出售",
				value: "已出售",
			},
			{
				label: "空闲",
				value: "空闲",
			},
			{
				label: "装修中",
				value: "装修中",
			},
		],
	},

	// 房屋类型
	{
		label: transformI18n($t("propertyManage_housePropertyManage.houses.type")),
		prop: "房屋类型",
		valueType: "select",
		options: [
			{
				label: "住宅",
				value: "住宅",
			},
			{
				label: "办公室",
				value: "办公室",
			},
			{
				label: "宿舍",
				value: "宿舍",
			},
			{
				label: "储物间",
				value: "储物间",
			},
		],
	},

	// 楼栋单元
	{
		label: transformI18n($t("propertyManage_housePropertyManage.houses.unionId")),
		prop: "楼栋单元",
		valueType: "select",
		options: [
			{
				label: "当前楼栋单元",
				value: "当前楼栋单元",
			},
			{
				label: "全部楼栋单元",
				value: "全部楼栋单元",
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
	showNumber: 4,
});

function handleReSearch() {
	console.log("重新搜索");
}
async function handleSearch() {
	console.log("搜索");
}
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />
		<!-- <PlusSearch></PlusSearch> -->
		<!-- <PlusSearch
			v-model="state"
			:columns="columns"
			:show-number="2"
			label-width="80"
			label-position="right"
			@change="handleChange"
			@search="handleSearch"
			@reset="handleRest"
		/> -->

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary"> {{ transformI18n($t("common.buttons.add")) }} </ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable :="pureTableProps" :columns="dynamicColumns" :size="size">
					<template #operation="{ row }">
						<ElButton type="warning"> {{ transformI18n($t("common.buttons.edit")) }} </ElButton>
						<ElButton type="info"> {{ transformI18n($t("common.buttons.info")) }} </ElButton>
						<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
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
