<script lang="ts" setup>
definePage({
	meta: {
		title: "房屋装修",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.communityManage.houseDecoration"),
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
		label: "房屋",
		prop: "房屋",
		width: 120,
		fixed: true,
	},
	{
		label: "联系人",
		prop: "联系人",
		width: 120,
	},
	{
		label: "联系电话",
		prop: "联系电话",
		width: 120,
	},
	{
		label: "装修时间",
		prop: "装修时间",
		width: 120,
	},
	{
		label: "申请时间",
		prop: "申请时间",
		width: 120,
	},
	{
		label: "装修单位",
		prop: "装修单位",
		width: 120,
	},
	{
		label: "负责人电话",
		prop: "负责人电话",
		width: 120,
	},
	{
		label: "状态",
		prop: "状态",
		width: 120,
	},
	{
		label: "是否延期",
		prop: "是否延期",
		width: 120,
	},
	{
		label: "延期时间",
		prop: "延期时间",
		width: 120,
	},
	{
		label: "是否违规",
		prop: "是否违规",
		width: 120,
	},
	{
		label: "违规说明",
		prop: "违规说明",
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
	// 房屋编号
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseNumber")),
		prop: "房屋编号",
		valueType: "input",
	},

	// 联系人
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.contacts")),
		prop: "联系人",
		valueType: "input",
	},

	// 联系电话
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.phone")),
		prop: "联系电话",
		valueType: "input",
	},

	// 房屋状态
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseState")),
		prop: "房屋状态",
		valueType: "select",
		options: [
			{
				label: "待审核",
				value: "待审核",
			},
			{
				label: "审核不通过",
				value: "审核不通过",
			},
			{
				label: "装修中",
				value: "装修中",
			},
			{
				label: "待验收",
				value: "待验收",
			},
			{
				label: "验收成功",
				value: "验收成功",
			},
			{
				label: "验收失败",
				value: "验收失败",
			},
		],
	},

	// 延期状态
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.deferredStatus")),
		prop: "延期状态",
		valueType: "select",
		options: [
			{
				label: "是",
				value: "是",
			},
			{
				label: "否",
				value: "否",
			},
		],
	},

	// 装修时间
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.renovationTime")),
		prop: "装修时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},

	{
		label: "装修时间范围",
		prop: "装修时间范围",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
			onChange(value: string[] | null) {
				plusSearchModel.value.装修申请开始时间 = value?.[0] ?? "";
				plusSearchModel.value.装修申请结束时间 = value?.[1] ?? "";
			},
			onClear() {
				plusSearchModel.value.装修申请开始时间 = "";
				plusSearchModel.value.装修申请结束时间 = "";
			},
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
});

async function handleReSearch() {
	console.log("重新搜索");
}

async function handleSearch() {
	console.log("搜索");
}

const { gotoDetailPage } = useGotoDetailsPage();

/** 跳转到 装修跟踪页面 */
function gotoHouseDecorationPage(row: 房屋装修_列表数据) {
	console.log("row", row);
	gotoDetailPage({
		name: "property-manage-community-manage--detail-page-house-decoration-[id]",
		params: {
			id: row.房屋,
		},
	});
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
						<ElButton type="info">
							{{ transformI18n($t("propertyManage_communityManage.house-decoration.decorationOk")) }}
						</ElButton>
						<ElButton type="info" @click="gotoHouseDecorationPage(row)">
							{{ transformI18n($t("propertyManage_communityManage.house-decoration.trackingRecord")) }}
						</ElButton>
						<ElButton type="warning"> {{ transformI18n($t("common.buttons.edit")) }} </ElButton>
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
