<script lang="ts" setup>
definePage({
	meta: {
		title: "到期合同",
		icon: "f7:menu",
		roles: ["物业团队"],
	},
});

import { ref, computed, watch, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { addDialog, closeDialog, updateDialog, closeAllDialog } from "@/components/ReDialog";
import AddForm from "./components/addForm.vue";
import { defaultForm } from "./components/addForm";

interface 业务受理_列表数据 {
	合同名称: string;
	合同编号: string;
	合同类型: string;
	甲方: string;
	乙方: string;
	变更类型: string;
	变更人: string;
	申请时间: string;
	说明: string;
	状态: string;
}

const tableDataItem: 业务受理_列表数据 = {
	合同名称: "合同名称",
	合同编号: "合同编号",
	合同类型: "合同类型",
	甲方: "甲方",
	乙方: "乙方",
	变更类型: "变更类型",
	变更人: "变更人",
	申请时间: "申请时间",
	说明: "说明",
	状态: "状态",
};

/** 表格数据 */
const tableData = ref<业务受理_列表数据[]>(
	Array(10)
		.fill(null)
		.map(() => ({
			合同名称: `合同-${Math.floor(Math.random() * 1000)}`,
			合同编号: `HT-${Date.now().toString(36).toUpperCase().substring(4)}`,
			合同类型: ["采购合同", "销售合同", "服务合同", "租赁合同"][Math.floor(Math.random() * 4)],
			甲方: ["XX科技有限公司", "XX网络技术有限公司", "XX软件开发有限公司"][Math.floor(Math.random() * 3)],
			乙方: ["XX信息技术服务公司", "XX系统集成有限公司", "XX数据服务中心"][Math.floor(Math.random() * 3)],
			变更类型: ["合同金额", "服务期限", "服务内容", "付款方式", "合同主体"][Math.floor(Math.random() * 5)],
			变更人: ["张三", "李四", "王五", "赵六", "钱七"][Math.floor(Math.random() * 5)],
			申请时间: `2023-${Math.floor(Math.random() * 6 + 1)
				.toString()
				.padStart(2, "0")}-${Math.floor(Math.random() * 28 + 1)
				.toString()
				.padStart(2, "0")} ${Math.floor(Math.random() * 24)
				.toString()
				.padStart(2, "0")}:${Math.floor(Math.random() * 60)
				.toString()
				.padStart(2, "0")}`,
			说明: ["因业务调整，修改服务内容", "更新付款周期", "调整服务期限", "新增功能模块", "修改验收标准"][
				Math.floor(Math.random() * 5)
			],
			状态: ["待审核", "审核中", "已通过", "已拒绝", "已撤回"][Math.floor(Math.random() * 5)],
		})),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "合同名称",
		prop: "合同名称",
		width: 160,
		fixed: true,
	},
	{
		label: "合同编号",
		prop: "合同编号",
		width: 140,
	},
	{
		label: "合同类型",
		prop: "合同类型",
		width: 120,
	},
	{
		label: "甲方",
		prop: "甲方",
		width: 140,
	},
	{
		label: "乙方",
		prop: "乙方",
		width: 140,
	},
	{
		label: "变更类型",
		prop: "变更类型",
		width: 120,
	},
	{
		label: "变更人",
		prop: "变更人",
		width: 100,
	},
	{
		label: "申请时间",
		prop: "申请时间",
		width: 160,
	},
	{
		label: "说明",
		prop: "说明",
		width: 200,
	},
	{
		label: "状态",
		prop: "状态",
		width: 100,
		formatter: (row: 业务受理_列表数据) => {
			const statusMap = {
				待审核: "待审核",
				审核中: "审核中",
				已通过: "已通过",
				已拒绝: "已拒绝",
				已撤回: "已撤回",
			};
			return statusMap[row.状态] || row.状态;
		},
	},
	{
		label: transformI18n($t("common.table.operation")),
		minWidth: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "到期合同",
	columns: columns.value,
});

/**
 * 表格搜索栏数据模型
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
interface 合同类型_列表查询_VO {
	合同名称?: string;
	输入合同编号?: string;
	选择合同类型?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 合同类型_列表查询_VO = {
	合同名称: "",
	输入合同编号: "",
	选择合同类型: "",
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
		label: "合同名称",
		prop: "合同名称",
		valueType: "input",
	},

	{
		label: "输入合同编号",
		prop: "输入合同编号",
		valueType: "input",
	},

	{
		label: transformI18n($t("property-manage_contract-manage.contract-type.addpeopleplaceholder")),
		prop: "审核类型",
		valueType: "select",
		options: [
			{
				label: "类型1",
				value: "类型1",
			},
			{
				label: "类型2",
				value: "类型2",
			},
		],
	},
]);

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: 1000,
});

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	border: true,
	stripe: true,
	adaptive: true,
	highlightCurrentRow: true,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
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

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

function handleReSearch() {
	console.log("重新搜索");
}

async function handleSearch() {
	console.log("搜索");
}

function onBaseClick() {
	addDialog({
		title: "基础用法",
		contentRenderer: () => h(AddForm),
	});
}
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

		<!-- {{ plusSearchModel }} -->

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
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
						<ElButton type="warning" @click="onBaseClick">
							{{ transformI18n($t("property-manage_contract-manage.expired-contract.renewal")) }}
						</ElButton>
						<ElButton type="danger">
							{{ transformI18n($t("property-manage_contract-manage.expired-contract.termination")) }}
						</ElButton>
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
