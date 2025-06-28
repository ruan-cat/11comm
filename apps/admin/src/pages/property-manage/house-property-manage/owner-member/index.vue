<script lang="ts" setup>
definePage({
	meta: {
		title: "业主成员",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.ownerMember"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 业主成员_列表数据 {
	成员人脸: string;
	名称: string;
	性别: string;
	类型: string;
	身份证: string;
	联系方式: string;
	家庭住址: string;
	创建人: string;
	备注: string;
	门禁钥匙: string;
}

const tableDataItem: 业主成员_列表数据 = {
	成员人脸: "成员人脸",
	名称: "名称",
	性别: "性别",
	类型: "类型",
	身份证: "身份证",
	联系方式: "联系方式",
	家庭住址: "家庭住址",
	创建人: "创建人",
	备注: "备注",
	门禁钥匙: "门禁钥匙",
};

/** 表格数据 */
const tableData = ref<业主成员_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{ label: "成员人脸", prop: "成员人脸", width: 120, fixed: true },
	{ label: "名称", prop: "名称", width: 120 },
	{ label: "性别", prop: "性别", width: 80 },
	{ label: "类型", prop: "类型", width: 100 },
	{ label: "身份证", prop: "身份证", width: 160 },
	{ label: "联系方式", prop: "联系方式", width: 120 },
	{ label: "家庭住址", prop: "家庭住址", width: 180 },
	{ label: "创建人", prop: "创建人", width: 100 },
	{ label: "备注", prop: "备注", width: 120 },
	{ label: "门禁钥匙", prop: "门禁钥匙", width: 100 },
	{
		label: transformI18n($t("common.table.operation")),
		minWidth: 180,
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
	title: "业主成员",
	columns: columns.value,
});

interface 业主信息_列表查询_VO {
	成员名称?: string;
	联系方式?: string;
	身份证?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 业主信息_列表查询_VO = {
	成员名称: "",
	联系方式: "",
	身份证: "",
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
	// 成员名称
	{
		label: transformI18n($t("propertyManage_housePropertyManage.owners-committee.name")),
		prop: "成员名称",
		valueType: "input",
	},

	// 联系电话
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.phone")),
		prop: "联系电话",
		valueType: "input",
	},

	// 身份证
	{
		label: transformI18n($t("propertyManage_housePropertyManage.houses.idCard")),
		prop: "身份证",
		valueType: "input",
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

function handleReSearch() {
	console.log("重新搜索");
}
async function handleSearch() {
	console.log("搜索");
}
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />
		<!-- <PlusSearch></PlusSearch> -->
		<!-- <PlusSearch
			v-model="state"
			:columns="columns"
			:show-number="2"
			label-width="80"
			label-position="right"
			@change="handleChange"
			@search="handleSearch"
			@reset="handleRest"
		/> -->

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary"> {{ transformI18n($t("common.buttons.add")) }} </ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable :="pureTableProps" :columns="dynamicColumns" :size="size">
					<template #operation="{ row }">
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
