<script lang="ts" setup>
definePage({
	meta: {
		title: "小区信息",
		icon: "f7:menu",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.dataManage.communityInformation"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 我的小区_列表数据 {
	小区ID: string;
	小区名称: string;
	物业公司: string;
	附近地标: string;
	城市编码: string;
	创建时间: string;
	社区编码: string;
	状态: string;
}

const tableDataItem: 我的小区_列表数据 = {
	小区ID: "小区ID",
	小区名称: "小区名称",
	物业公司: "物业公司",
	附近地标: "附近地标",
	城市编码: "城市编码",
	创建时间: "创建时间",
	社区编码: "社区编码",
	状态: "状态",
};

/** 表格数据 */
const tableData = ref<我的小区_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "小区ID",
		prop: "小区ID",
		width: 120,
		fixed: true,
	},
	{
		label: "小区名称",
		prop: "小区名称",
		width: 120,
	},
	{
		label: "物业公司",
		prop: "物业公司",
		width: 120,
	},
	{
		label: "附近地标",
		prop: "附近地标",
		width: 120,
	},
	{
		label: "城市编码",
		prop: "城市编码",
		width: 120,
	},
	{
		label: "创建时间",
		prop: "创建时间",
		width: 120,
	},
	{
		label: "社区编码",
		prop: "社区编码",
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
	title: "我的小区",
	columns: columns.value,
});

interface 小区信息_列表查询_VO {
	小区ID?: string;
	小区名称?: string;
	省?: string;
	城市?: string;
	区县?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 小区信息_列表查询_VO = {
	小区ID: "",
	小区名称: "",
	省: "",
	城市: "",
	区县: "",
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
	// 小区ID
	{
		label: transformI18n($t("operation-team_data-manage.community-information.communityID")),
		prop: "小区ID",
		valueType: "input",
	},

	// 小区名称
	{
		label: transformI18n($t("operation-team_data-manage.community-information.communityName")),
		prop: "小区名称",
		valueType: "input",
	},

	// 省
	{
		label: transformI18n($t("operation-team_data-manage.community-information.province")),
		prop: "省",
		valueType: "select",
		options: [
			{
				label: "福建省",
				value: "福建省",
			},
			{
				label: "浙江省",
				value: "浙江省",
			},
			{
				label: "江苏省",
				value: "江苏省",
			},
		],
	},

	// 城市
	{
		label: transformI18n($t("operation-team_data-manage.community-information.city")),
		prop: "城市",
		valueType: "select",
		options: [
			{
				label: "福州市",
				value: "福州市",
			},
			{
				label: "厦门市",
				value: "厦门市",
			},
			{
				label: "漳州市",
				value: "漳州市",
			},
		],
	},

	// 区县
	{
		label: transformI18n($t("operation-team_data-manage.community-information.district")),
		prop: "区县",
		valueType: "select",
		options: [
			{
				label: "仓山区",
				value: "仓山区",
			},
			{
				label: "高新区",
				value: "高新区",
			},
			{
				label: "闽侯县",
				value: "闽侯县",
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
	showNumber: 5,
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
