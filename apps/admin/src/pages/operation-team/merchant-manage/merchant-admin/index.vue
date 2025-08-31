<script lang="ts" setup>
definePage({
	meta: {
		title: "商户管理员",
		icon: "f7:menu",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.merchantManage.merchantAdmin"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 商户管理员_列表数据 {
	物业名称: string;
	管理员: string;
	管理员电话: string;
	管理员ID: string;
	状态: string;
	创建时间: string;
}

const tableDataItem: 商户管理员_列表数据 = {
	物业名称: "物业名称",
	管理员: "管理员",
	管理员电话: "管理员电话",
	管理员ID: "管理员ID",
	状态: "状态",
	创建时间: "创建时间",
};

/** 表格数据 */
const tableData = ref<商户管理员_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "物业名称",
		prop: "物业名称",
		width: 150,
		fixed: true,
	},
	{
		label: "管理员",
		prop: "管理员",
		width: 120,
	},
	{
		label: "管理员电话",
		prop: "管理员电话",
		width: 120,
	},
	{
		label: "管理员ID",
		prop: "管理员ID",
		width: 120,
	},
	{
		label: "状态",
		prop: "状态",
		width: 100,
	},
	{
		label: "创建时间",
		prop: "创建时间",
		width: 150,
	},
	{
		label: transformI18n($t("common.common.table.operation")),
		minWidth: 280,
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
	title: "物业信息",
	columns: columns.value,
});

interface 商户管理员_列表查询_VO {
	物业名称?: string;
	管理员?: string;
	联系电话?: string;
}

/** 表格搜索栏 双向绑定的变量 */
const plusSearchModelRef: FieldValues & 商户管理员_列表查询_VO = {
	物业名称: "",
	管理员: "",
	联系电话: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 表格搜索栏组件 表单配置 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 物业名称
	{
		label: "物业名称",
		prop: "物业名称",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入物业名称",
		},
	},

	// 管理员
	{
		label: "管理员",
		prop: "管理员",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入管理员",
		},
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
						<ElButton type="primary">隶属小区</ElButton>
						<ElButton type="success">登录</ElButton>
						<ElButton type="danger">限制登录</ElButton>
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
