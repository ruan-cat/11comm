<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type 员工关联_列表数据, type 员工关联_列表查询_VO, staffRelationTableData } from "../../test-data";

const tableRef = useTemplateRef("tableRef");

/** 表格数据 */
const tableData = ref<员工关联_列表数据[]>(staffRelationTableData);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "名称",
		prop: "名称",
		width: 120,
	},
	{
		label: "手机号",
		prop: "手机号",
		width: 150,
	},
	{
		label: "邮箱",
		prop: "邮箱",
		width: 200,
	},
	{
		label: "地址",
		prop: "地址",
		minWidth: 150,
	},
	{
		label: "性别",
		prop: "性别",
		width: 80,
	},
	{
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 160,
		fixed: "right",
		slot: "operation",
	},
]);

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: tableData.value.length,
});

/** 处理页数变化 */
async function handlePageSizeChange(pageSize: number) {
	pagination.value.pageSize = pageSize;
}

/** 处理页码变化 */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
}

/** 表格组件配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件配置 */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "员工关联",
	columns: columns.value,
});

/** 表格搜索栏双向绑定的变量 */
const plusSearchModelRef: FieldValues & 员工关联_列表查询_VO = {
	员工姓名: "",
	员工手机号: "",
};

/** 表格搜索栏重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 表格搜索栏组件表单配置 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "员工名称",
		prop: "员工名称",
		valueType: "input",
	},
	{
		label: "员工手机号",
		prop: "员工手机号",
		valueType: "input",
	},
]);

/** 表格搜索栏组件配置 */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 2,
});

async function handleReSearch() {
	console.log("重新搜索");
}

async function handleSearch() {
	console.log("搜索");
}

/** 删除操作 */
function handleDelete(row: 员工关联_列表数据) {
	console.log("删除员工关联", row);
}

/** 查看详情 */
function handleDetail(row: 员工关联_列表数据) {
	console.log("查看详情", row);
}

async function doResetTableAdaptive() {
	await nextTick();
	// @ts-ignore
	await tableRef.value.setAdaptive();
}

defineExpose({
	/** 重置表格自适应高度 */
	doResetTableAdaptive,
});

onMounted(async () => {});
</script>

<template>
	<section class="staff-relation-table-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<!--
          TODO: 先完成 单元授权 tab列表页的表格多选弹框功能 然后再复用代码 实现此处的业务逻辑
          还需要完成表格弹框业务
        -->
				<ElButton type="primary"> 关联员工 </ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable
					ref="tableRef"
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="danger" @click="handleDelete(row)"> 删除 </ElButton>
						<ElButton type="info" @click="handleDetail(row)"> 详情 </ElButton>
					</template>
				</PureTable>
			</template>
		</PureTableBar>
	</section>
</template>

<style lang="scss" scoped>
.staff-relation-table-root {
}
</style>
