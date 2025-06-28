<script lang="ts" setup>
definePage({
	meta: {
		title: "车位信息",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.parkingManage.carportInfo"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 车位信息_列表数据 {
	停车场: string;
	车位: string;
	车位状态: string;
	车位类型: string;
	面积: string;
	操作: string;
}

const tableDataItem: 车位信息_列表数据 = {
	停车场: "停车场",
	车位: "车位",
	车位状态: "车位状态",
	车位类型: "车位类型",
	面积: "面积",
	操作: "操作",
};

/** 表格数据 */
const tableData = ref<车位信息_列表数据[]>(
	Array(25)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "停车场",
		prop: "停车场",
		width: 120,
		fixed: true,
	},
	{
		label: "车位",
		prop: "车位",
		width: 120,
	},
	{
		label: "车位状态",
		prop: "车位状态",
		width: 120,
	},
	{
		label: "车位类型",
		prop: "车位类型",
		width: 120,
	},
	{
		label: "面积",
		prop: "面积",
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
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "车位信息",
	columns: columns.value,
});

interface 车位信息_列表数据_VO {
	停车场?: string;
	车位?: string;
	车位状态?: string;
	车位类型?: string;
	面积?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */

const plusSearchModelRef: FieldValues & 车位信息_列表数据_VO = {
	停车场: "",
	车位: "",
	车位状态: "",
	车位类型: "",
	面积: "",
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
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseNumber")),
		prop: "停车场",
		valueType: "input",
	},

	// 联系人
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.contacts")),
		prop: "车位",
		valueType: "input",
	},

	// 联系电话
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.phone")),
		prop: "车位状态",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.phone")),
		prop: "车位类型",
		valueType: "input",
	},

	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.phone")),
		prop: "面积",
		valueType: "input",
	},
]);

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
