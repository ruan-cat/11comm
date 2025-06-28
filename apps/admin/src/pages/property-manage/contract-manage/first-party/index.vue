<script lang="ts" setup>
definePage({
	meta: {
		title: "合同甲方",
		icon: "f7:menu",
		roles: ["物业团队"],
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { addDialog, closeDialog, updateDialog, closeAllDialog } from "@/components/ReDialog";
import AddForm from "./components/addForm.vue";

interface 业务受理_列表数据 {
	甲方: string;
	甲方联系人: string;
	联系电话: string;
}

const tableDataItem: 业务受理_列表数据 = {
	甲方: "甲方",
	甲方联系人: "甲方联系人",
	联系电话: "联系电话",
};

/** 表格数据 */
const tableData = ref<业务受理_列表数据[]>(
	Array(10)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "甲方",
		prop: "甲方",
		width: 120,
		fixed: true,
	},
	{
		label: "甲方联系人",
		prop: "甲方联系人",
		width: 120,
	},
	{
		label: "联系电话",
		prop: "联系电话",
		width: 120,
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
	title: "合同甲方",
	columns: columns.value,
});

/**
 * 表格搜索栏数据模型
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
interface 合同类型_列表查询_VO {
	合同甲方?: string;
	合同甲方联系人?: string;
	合同甲方联系电话?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 合同类型_列表查询_VO = {
	合同甲方: "",
	合同甲方联系人: "",
	合同甲方联系电话: "",
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
	// 巡检人
	{
		label: "合同甲方",
		prop: "合同甲方",
		valueType: "input",
	},

	{
		label: "合同甲方联系人",
		prop: "合同甲方联系人",
		valueType: "input",
	},

	{
		label: "合同甲方联系电话",
		prop: "合同甲方联系电话",
		valueType: "input",
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
		contentRenderer: () => h("p", "添加合同类型"),
	});
}

function addPeopeleClick() {
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
			<template #buttons>
				<ElButton type="primary" @click="onBaseClick"> {{ transformI18n($t("common.buttons.add")) }} </ElButton>
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
						<ElButton type="warning" @click="addPeopeleClick">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
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
