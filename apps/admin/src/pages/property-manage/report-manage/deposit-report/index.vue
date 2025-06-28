<script lang="ts" setup>
definePage({
	meta: {
		title: "押金报表",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.depositReport"),
	},
});
import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 房屋装修_列表数据 {
	房屋: string;
	联系人: string;
	联系电话: string;
	装修时间: string;
	申请时间: string;
	装修单位: string;
	负责人电话: string;
	状态: string;
	是否延期: string;
	延期时间: string;
	是否违规: string;
	违规说明: string;
	备注: string;
}

const tableDataItem: 房屋装修_列表数据 = {
	房屋: "房屋",
	联系人: "联系人",
	联系电话: "联系电话",
	装修时间: "装修时间",
	申请时间: "申请时间",
	装修单位: "装修单位",
	负责人电话: "负责人电话",
	状态: "状态",
	是否延期: "是否延期",
	延期时间: "延期时间",
	是否违规: "是否违规",
	违规说明: "违规说明",
	备注: "备注",
};

/** 表格数据 */
const tableData = ref<房屋装修_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "费用ID",
		prop: "费用ID",
		width: 120,
		fixed: true,
	},
	{
		label: "房号",
		prop: "房号",
		width: 120,
	},
	{
		label: "业主",
		prop: "业主",
		width: 120,
	},
	{
		label: "费用类型",
		prop: "费用类型",
		width: 120,
	},
	{
		label: "费用项",
		prop: "费用项",
		width: 120,
	},
	{
		label: "费用开始时间",
		prop: "费用开始时间",
		width: 120,
	},
	{
		label: "费用结束时间",
		prop: "费用结束时间",
		width: 120,
	},
	{
		label: "创建时间",
		prop: "创建时间",
		width: 120,
	},
	{
		label: "付费对象类型",
		prop: "付费对象类型",
		width: 120,
	},
	{
		label: "付款方ID",
		prop: "付款方ID",
		width: 120,
	},
	{
		label: "应收金额",
		prop: "应收金额",
		width: 120,
	},
	{
		label: "状态",
		prop: "状态",
		width: 120,
	},
	{
		label: "退费状态",
		prop: "退费状态",
		width: 120,
	},
	{
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
	title: "房屋装修",
	columns: columns.value,
});

interface 房屋装修_列表查询_VO {
	房屋编号?: string;
	联系人?: string;
	联系电话?: string;
	房屋状态?: string;
	延期状态?: string;
	装修时间?: string;
	装修申请开始时间?: string;
	装修申请结束时间?: string;
	装修时间范围?: [string, string];
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 房屋装修_列表查询_VO = {
	房屋编号: "",
	联系人: "",
	联系电话: "",
	房屋状态: "",
	延期状态: "",
	装修时间: "",
	装修申请开始时间: "",
	装修申请结束时间: "",
	装修时间范围: ["", ""],
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
	// 选择楼栋
	{
		label: "楼栋",
		prop: "楼栋",
		valueType: "select",
		options: [
			{
				label: "楼栋1",
				value: "楼栋1",
			},
			{
				label: "楼栋2",
				value: "楼栋2",
			},
		],
	},
	// 选择单元
	{
		label: "单元",
		prop: "单元",
		valueType: "select",
		options: [
			{
				label: "单元1",
				value: "单元1",
			},
			{
				label: "单元2",
				value: "单元2",
			},
		],
	},
	// 填写房屋编号
	{
		label: "房屋编号",
		prop: "房屋编号",
		valueType: "input",
	},
	// 输入费用id
	{
		label: "费用id",
		prop: "费用id",
		valueType: "input",
	},
	// 选择费用项目名称
	{
		label: "费用项目名称",
		prop: "费用项目名称",
		valueType: "select",
		options: [
			{
				label: "测试1",
				value: "测试1",
			},
			{
				label: "测试2",
				value: "测试2",
			},
		],
	},
	// 选择收费状态
	{
		label: "收费状态",
		prop: "收费状态",
		valueType: "select",
		options: [
			{
				label: "测试1",
				value: "测试1",
			},
			{
				label: "测试2",
				value: "测试2",
			},
		],
	},
	// 选择收费对象类型
	{
		label: "收费对象类型",
		prop: "收费对象类型",
		valueType: "select",
		options: [
			{
				label: "测试1",
				value: "测试1",
			},
			{
				label: "测试2",
				value: "测试2",
			},
		],
	},
	// 选择费用创建开始时间
	{
		label: "费用创建开始时间",
		prop: "费用创建开始时间",
		valueType: "date-picker",
	},
	// 选择费用创建结束时间
	{
		label: "费用创建结束时间",
		prop: "费用创建结束时间",
		valueType: "date-picker",
	},
	// 选择退费状态
	{
		label: "退费状态",
		prop: "退费状态",
		valueType: "select",
		options: [
			{
				label: "测试1",
				value: "测试1",
			},
			{
				label: "测试2",
				value: "测试2",
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

function handleOpenBuildingDialog() {
	console.log("打开楼栋选择对话框");
}

const uncharged = ref({
	未收费: 0,
	已收费: 0,
	已退费: 0,
	退费中: 0,
	退费失败: 0,
});
</script>

<template>
	<section class="index-root">
		<h2>押金报表</h2>
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch">
			<template #plus-field-楼栋="{ model }">
				<div class="flex items-center">
					<!-- TODO: 这里楼栋插槽选择、搜索框需要api，没写，先挂这儿 -->
					<!--  <el-select v-model="model.value" style="width: 200px"> -->
					<!-- <el-option v-for="item in model.options" :key="item.value" :label="item.label" :value="item.value" /> -->
					<!--  </el-select> -->
					<el-button type="primary" class="ml-2" @click="handleOpenBuildingDialog"> 选择楼栋 </el-button>
				</div>
			</template>
		</PlusSearch>

		<!-- {{ plusSearchModel }} -->

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary"> {{ transformI18n($t("导出")) }} </ElButton>
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
				<div class="flex items-center">
					<el-text class="mx-1">小计</el-text>
					<el-text class="mx-1" size="small">未收费{{ uncharged.未收费 }}</el-text>
					<el-text class="mx-1" size="small">已收费{{ uncharged.已收费 }}</el-text>
					<el-text class="mx-1" size="small">已退费{{ uncharged.已退费 }}</el-text>
					<el-text class="mx-1" size="small">退费中{{ uncharged.退费中 }}</el-text>
					<el-text class="mx-1" size="small">退费失败{{ uncharged.退费失败 }}</el-text>
				</div>
			</template>
		</PureTableBar>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
