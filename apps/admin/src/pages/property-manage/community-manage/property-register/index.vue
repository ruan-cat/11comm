<script lang="ts" setup>
definePage({
	meta: {
		title: "产权登记",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.communityManage.propertyRegister"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 产权登记_列表数据 {
	房屋产权ID: string;
	房屋ID: string;
	房屋编号: string;
	姓名: string;
	联系方式: string;
	身份证号: string;
	地址: string;
	状态: string;
}

const tableDataItem: 产权登记_列表数据 = {
	房屋产权ID: "房屋产权ID",
	房屋ID: "房屋ID",
	房屋编号: "房屋编号",
	姓名: "姓名",
	联系方式: "联系方式",
	身份证号: "身份证号",
	地址: "地址",
	状态: "状态",
};

/** 表格数据 */
const tableData = ref<产权登记_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "房屋产权ID",
		prop: "房屋产权ID",
		width: 120,
		fixed: true,
	},
	{
		label: "房屋ID",
		prop: "房屋ID",
		width: 120,
	},
	{
		label: "房屋编号",
		prop: "房屋编号",
		width: 120,
	},
	{
		label: "姓名",
		prop: "姓名",
		width: 120,
	},
	{
		label: "联系方式",
		prop: "联系方式",
		width: 120,
	},
	{
		label: "身份证号",
		prop: "身份证号",
		width: 120,
	},
	{
		label: "地址",
		prop: "地址",
		width: 120,
	},
	{
		label: "状态",
		prop: "状态",
		width: 120,
	},
	{
		label: transformI18n($t("common.table.operation")),
		minWidth: 240,
		fixed: "right",
		slot: "operation",
	},
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

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "产权登记",
	columns: columns.value,
});

interface 产权登记_列表查询_VO {
	房屋ID?: string;
	房屋编号?: string;
	姓名?: string;
	联系方式?: string;
	身份证号?: string;
	地址?: string;
	审核状态?: string;
	楼栋?: string;
	单元?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 产权登记_列表查询_VO = {
	房屋ID: "",
	房屋编号: "",
	姓名: "",
	联系方式: "",
	身份证号: "",
	地址: "",
	审核状态: "",
	楼栋: "",
	单元: "",
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
	// 房屋ID
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.houseID")),
		prop: "房屋ID",
		valueType: "input",
	},

	// 房屋编号
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.houseNumber")),
		prop: "房屋编号",
		valueType: "input",
	},

	// 姓名
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.name")),
		prop: "姓名",
		valueType: "input",
	},

	// 联系方式
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.contactWay")),
		prop: "联系方式",
		valueType: "input",
	},

	// 身份证号
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.idNumber")),
		prop: "身份证号",
		valueType: "input",
	},

	// 地址
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.address")),
		prop: "地址",
		valueType: "input",
	},

	// 审核状态
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.auditStatus")),
		prop: "审核状态",
		valueType: "select",
		options: [
			{
				label: "未审核",
				value: "未审核",
			},
			{
				label: "审核通过",
				value: "审核通过",
			},
			{
				label: "审核不通过",
				value: "审核不通过",
			},
		],
	},

	// 楼栋
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.building")),
		prop: "楼栋",
		valueType: "select",
		options: [
			{
				label: "一楼",
				value: "一楼",
			},
			{
				label: "二楼",
				value: "二楼",
			},
			{
				label: "三楼",
				value: "三楼",
			},
		],
	},

	// 单元
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.unit")),
		prop: "单元",
		valueType: "select",
		options: [
			{
				label: "一单元",
				value: "一单元",
			},
			{
				label: "二单元",
				value: "二单元",
			},
			{
				label: "三单元",
				value: "三单元",
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
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

		<!-- {{ plusSearchModel }} -->

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary"> {{ transformI18n($t("common.buttons.add")) }} </ElButton>
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
