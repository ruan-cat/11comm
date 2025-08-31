<script lang="ts" setup>
definePage({
	meta: {
		title: "商户信息",
		icon: "f7:menu",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.merchantManage.merchantInfo"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { ElMessage, ElMessageBox } from "element-plus";
import {
	type 商户信息_列表数据,
	type 商户信息_列表查询_VO,
	tableData as mockTableData,
	商户类型选项,
	经营状态选项,
} from "./test-data";

/** 表格数据 */
const tableData = ref<商户信息_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.merchantNumber")),
		prop: "商户编号",
		width: 120,
		fixed: true,
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.merchantName")),
		prop: "商户名称",
		minWidth: 150,
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.merchantAddress")),
		prop: "商户地址",
		minWidth: 200,
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.contactPhone")),
		prop: "联系电话",
		width: 130,
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.merchantType")),
		prop: "商户类型",
		width: 100,
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.enterpriseLegalPerson")),
		prop: "企业法人",
		width: 100,
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.establishDate")),
		prop: "成立日期",
		width: 110,
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.operatingStatus")),
		prop: "经营状态",
		width: 100,
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.belongCommunity")),
		prop: "所属小区",
		width: 150,
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.businessHours")),
		prop: "营业时间",
		width: 120,
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.businessArea")) + "(㎡)",
		prop: "经营面积",
		width: 120,
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.createTime")),
		prop: "创建时间",
		width: 160,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: 0,
});

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

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: transformI18n($t("operation-team_merchant-manage.merchant-info.merchantName")),
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 商户信息_列表查询_VO = {
	商户名称: "",
	商户类型: "",
	联系电话: "",
	经营状态: "",
	所属小区: "",
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
	// 商户名称
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.merchantName")),
		prop: "商户名称",
		valueType: "input",
	},

	// 商户类型
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.merchantType")),
		prop: "商户类型",
		valueType: "select",
		options: 商户类型选项,
	},

	// 联系电话
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.contactPhone")),
		prop: "联系电话",
		valueType: "input",
	},

	// 经营状态
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.operatingStatus")),
		prop: "经营状态",
		valueType: "select",
		options: 经营状态选项,
	},

	// 所属小区
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.belongCommunity")),
		prop: "所属小区",
		valueType: "input",
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 100,
	labelPosition: "right",
	showNumber: 3,
});

/** 加载表格数据 */
async function loadTableData() {
	try {
		// TODO: 替换为真实的API调用
		// 当前使用模拟数据和本地搜索过滤
		let filteredData = mockTableData;

		// 根据搜索条件过滤数据
		if (plusSearchModel.value.商户名称) {
			filteredData = filteredData.filter((item) => item.商户名称.includes(plusSearchModel.value.商户名称!));
		}
		if (plusSearchModel.value.商户类型) {
			filteredData = filteredData.filter((item) => item.商户类型 === plusSearchModel.value.商户类型);
		}
		if (plusSearchModel.value.联系电话) {
			filteredData = filteredData.filter((item) => item.联系电话.includes(plusSearchModel.value.联系电话!));
		}
		if (plusSearchModel.value.经营状态) {
			filteredData = filteredData.filter((item) => item.经营状态 === plusSearchModel.value.经营状态);
		}
		if (plusSearchModel.value.所属小区) {
			filteredData = filteredData.filter((item) => item.所属小区.includes(plusSearchModel.value.所属小区!));
		}

		// 更新总数
		pagination.value.total = filteredData.length;

		// 分页处理
		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;
		tableData.value = filteredData.slice(startIndex, endIndex);

		// 更新表格配置
		pureTableProps.value.data = tableData.value;
	} catch (error) {
		console.error("加载数据失败:", error);
		ElMessage.error("加载数据失败，请稍后重试");
	}
}

async function handleReSearch() {
	console.log("重新搜索");
	// 重置搜索条件并重新加载数据
	pagination.value.currentPage = 1;
	await loadTableData();
}

async function handleSearch() {
	console.log("搜索", plusSearchModel.value);
	// 根据搜索条件过滤数据
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 处理新增商户 */
function handleAdd() {
	console.log("新增商户");
	// TODO: 打开新增商户弹框
}

/** 处理编辑商户 */
function handleEdit(row: 商户信息_列表数据) {
	console.log("编辑商户", row);
	// TODO: 打开编辑商户弹框
}

/** 处理查看详情 */
function handleViewDetails(row: 商户信息_列表数据) {
	console.log("查看商户详情", row);
	// TODO: 跳转到商户详情页面或打开详情弹框
}

/** 处理删除商户 */
function handleDelete(row: 商户信息_列表数据) {
	console.log("删除商户", row);
	// TODO: 显示确认删除弹框
	ElMessageBox.confirm(`确定要删除商户"${row.商户名称}"吗？此操作不可撤销。`, "删除确认", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	})
		.then(async () => {
			// TODO: 调用删除API
			console.log("执行删除操作");
			ElMessage.success("删除成功");
			await loadTableData();
		})
		.catch(() => {
			ElMessage.info("已取消删除");
		});
}

onMounted(async () => {
	await loadTableData();
});
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary" @click="handleAdd"> {{ transformI18n($t("common.buttons.add")) }} </ElButton>
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
						<ElButton type="warning" @click="handleEdit(row)">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info" @click="handleViewDetails(row)">
							{{ transformI18n($t("operation-team_merchant-manage.merchant-info.viewDetails")) }}
						</ElButton>
						<ElButton type="danger" @click="handleDelete(row)">
							{{ transformI18n($t("common.buttons.del")) }}
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
