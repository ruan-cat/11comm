<script lang="ts" setup>
definePage({
	meta: {
		title: "商户信息",
		icon: "f7:menu",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.merchantManage.merchantInfo"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 商户信息_列表数据 {
	商户名称: string;
	商户地址: string;
	联系电话: string;
	商户类型: string;
	企业法人: string;
	成立日期: string;
}

const tableDataItem: 商户信息_列表数据 = {
	商户名称: "商户名称",
	商户地址: "商户地址",
	联系电话: "联系电话",
	商户类型: "商户类型",
	企业法人: "企业法人",
	成立日期: "成立日期",
};

/** 表格数据 */
const tableData = ref<商户信息_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "商户名称",
		prop: "商户名称",
		width: 150,
		fixed: true,
	},
	{
		label: "商户地址",
		prop: "商户地址",
		width: 200,
	},
	{
		label: "联系电话",
		prop: "联系电话",
		width: 120,
	},
	{
		label: "商户类型",
		prop: "商户类型",
		width: 120,
	},
	{
		label: "企业法人",
		prop: "企业法人",
		width: 120,
	},
	{
		label: "成立日期",
		prop: "成立日期",
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
	title: "商户信息",
	columns: columns.value,
});

interface 商户信息_列表查询_VO {
	商户名称?: string;
	商户类型?: string;
	联系电话?: string;
}

/** 表格搜索栏 双向绑定的变量 */
const plusSearchModelRef: FieldValues & 商户信息_列表查询_VO = {
	商户名称: "",
	商户类型: "",
	联系电话: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 表格搜索栏组件 表单配置 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 商户名称
	{
		label: "商户名称",
		prop: "商户名称",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入商户名称",
		},
	},

	// 商户类型
	{
		label: "商户类型",
		prop: "商户类型",
		valueType: "select",
		fieldProps: {
			placeholder: "请选择商户类型",
		},
		options: [
			{
				label: "餐饮",
				value: "餐饮",
			},
			{
				label: "零售",
				value: "零售",
			},
			{
				label: "服务",
				value: "服务",
			},
			{
				label: "娱乐",
				value: "娱乐",
			},
			{
				label: "其他",
				value: "其他",
			},
		],
	},

	// 联系电话
	{
		label: "联系电话",
		prop: "联系电话",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入联系电话",
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
	title: "查询条件",
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
				<!-- @vue-ignore -->
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
	padding: 20px;
}
</style>
