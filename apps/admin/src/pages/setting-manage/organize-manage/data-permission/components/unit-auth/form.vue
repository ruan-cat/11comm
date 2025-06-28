<!--
  楼栋单元选择表单
  用于在弹框中选择楼栋单元
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { transformI18n } from "@/plugins/i18n";
import {
	UnitAuthFormProps,
	楼栋单元选择表单_VO,
	楼栋单元选择列表_VO,
	楼栋单元选择弹框搜索数据,
	楼栋单元搜索_VO,
} from "./form";

const props = defineProps<UnitAuthFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 楼栋单元选择表单_VO;

/** 表单组件实例 要求对外直接导出本表单实例 */
const plusFormInstance = useTemplateRef<any>("plusFormRef");

usePlusFormReset(plusFormInstance);

/**
 * 本表单组件 实际使用的表单对象
 * @description
 * 用强制类型转换 确保表单对象满足表单组件的类型要求
 *
 * 保守写法 重新克隆一个对象 避免直接修改外部传递的值
 */
const toRefForm = cloneDeep(props.form) as FieldValues & 楼栋单元选择表单_VO;

/**
 * 表单对象
 * @description
 * 本表单对象都来自于外部传递
 */
const form = ref(toRefForm);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 搜索表单 */
const searchForm = ref<楼栋单元搜索_VO>({
	楼栋编号: "",
	单元编号: "",
});

/** 搜索栏配置 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "输入楼栋编号",
		prop: "楼栋编号",
		valueType: "input",
	},
	{
		label: "输入单元编号",
		prop: "单元编号",
		valueType: "input",
	},
]);

/** 表格数据 */
const tableData = ref<楼栋单元选择列表_VO[]>(楼栋单元选择弹框搜索数据);

/** 过滤后的表格数据 */
const filteredTableData = computed(() => {
	return tableData.value.filter((item) => {
		const 楼栋匹配 = !searchForm.value.楼栋编号 || item.楼栋编号.includes(searchForm.value.楼栋编号);
		const 单元匹配 = !searchForm.value.单元编号 || item.单元编号.includes(searchForm.value.单元编号);
		return 楼栋匹配 && 单元匹配;
	});
});

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		type: "selection",
		width: 55,
	},
	{
		label: "楼栋编号",
		prop: "楼栋编号",
		minWidth: 200,
	},
	{
		label: "单元编号",
		prop: "单元编号",
		minWidth: 200,
	},
]);

/** 选中的表格行 */
const selectedRows = ref<楼栋单元选择列表_VO[]>([]);

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: filteredTableData.value.length,
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
	data: filteredTableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 搜索操作 */
function handleSearch() {
	pagination.value.total = filteredTableData.value.length;
	pagination.value.currentPage = 1;
}

/** 重置搜索 */
function handleReset() {
	searchForm.value = {
		楼栋编号: "",
		单元编号: "",
	};
	handleSearch();
}

/** 表格选择变化 */
function handleSelectionChange(selection: 楼栋单元选择列表_VO[]) {
	selectedRows.value = selection;
}

/** 获取选中的数据 */
function getSelectedData() {
	return selectedRows.value;
}

defineExpose({
	plusFormInstance,
	formComputed,
	getSelectedData,
});
</script>

<template>
	<div class="form-root">
		<!-- 搜索栏 -->
		<PlusSearch
			v-model="searchForm"
			:columns="plusSearchColumns"
			:show-number="2"
			@search="handleSearch"
			@reset="handleReset"
		/>

		<!-- 表格 -->
		<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
		<PureTable
			:="pureTableProps"
			:columns="columns"
			:data="filteredTableData"
			@selection-change="handleSelectionChange"
			@page-size-change="handlePageSizeChange"
			@page-current-change="handleCurrentPageChange"
		/>

		<!-- 隐藏的PlusForm组件，用于满足表单规范 -->
		<PlusForm
			ref="plusFormRef"
			v-model="form"
			:default-values="defaultValues"
			:columns="[]"
			:has-footer="false"
			style="display: none"
		/>
	</div>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
