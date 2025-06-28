<script lang="ts" setup>
definePage({
	meta: {
		title: "车位申请",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.parkingManage.carportApply"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 车位申请_列表数据 {
	申请ID: string;
	车牌号: string;
	停车位: string;
	汽车品牌: string;
	车辆类型: string;
	颜色: string;
	起租时间: string;
	结租时间: string;
	申请人: string;
	手机号: string;
	审核结果: string;
	操作: string;
}

const tableDataItem: 车位申请_列表数据 = {
	申请ID: "申请ID",
	车牌号: "车牌号",
	停车位: "停车位",
	汽车品牌: "汽车品牌",
	车辆类型: "车辆类型",
	颜色: "颜色",
	起租时间: "起租时间",
	结租时间: "结租时间",
	申请人: "申请人",
	手机号: "手机号",
	审核结果: "审核结果",
	操作: "操作",
};

/** 表格数据 */
const tableData = ref<车位申请_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "申请ID",
		prop: "申请ID",
		width: 120,
		fixed: true,
	},
	{
		label: "车牌号",
		prop: "车牌号",
		width: 120,
	},
	{
		label: "停车位",
		prop: "停车位",
		width: 120,
	},
	{
		label: "汽车品牌",
		prop: "汽车品牌",
		width: 120,
	},
	{
		label: "车辆类型",
		prop: "车辆类型",
		width: 120,
	},
	{
		label: "颜色",
		prop: "颜色",
		width: 120,
	},
	{
		label: "起租时间",
		prop: "起租时间",
		width: 120,
	},
	{
		label: "结租时间",
		prop: "结租时间",
		width: 120,
	},
	{
		label: "申请人",
		prop: "申请人",
		width: 120,
	},
	{
		label: "手机号",
		prop: "手机号",
		width: 120,
	},
	{
		label: "审核结果",
		prop: "审核结果",
		width: 120,
	},
	{
		label: "操作",
		prop: "操作",
		width: 120,
	},
	{
		// label: transformI18n($t("common.table.operation")),
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
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
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "车位申请",
	columns: columns.value,
});
interface 车位申请_列表查询_VO {
	申请ID: string;
	车牌号: string;
	停车位: string;
	汽车品牌: string;
	车辆类型: string;
	颜色: string;
	起租时间: string;
	结租时间: string;
	申请人: string;
	手机号: string;
	审核结果: string;
	操作: string;
}

// function handleReSearch() {
// 	console.log("重新搜索");
// }
/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */

const plusSearchModelRef: FieldValues & 车位申请_列表查询_VO = {
	申请ID: "",
	车牌号: "",
	停车位: "",
	汽车品牌: "",
	车辆类型: "",
	颜色: "",
	起租时间: "",
	结租时间: "",
	申请人: "",
	手机号: "",
	审核结果: "",
	操作: "",
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
	// 车牌号
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseNumber")),
		prop: "车牌号",
		valueType: "input",
	},

	// 汽车品牌
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.contacts")),
		prop: "汽车品牌",
		valueType: "input",
	},

	// 联系电话
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.phone")),
		prop: "联系电话",
		valueType: "input",
	},

	// 选择状态
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseState")),
		prop: "选择状态",
		valueType: "select",
		options: [
			{
				label: "待审核",
				value: "待审核",
			},
			{
				label: "待缴费",
				value: "待缴费",
			},
			{
				label: "完成",
				value: "完成",
			},
			{
				label: "申请失败",
				value: "申请失败",
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
