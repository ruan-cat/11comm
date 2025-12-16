// @ts-nocheck
import { tableData } from "../../data";
import { delay } from "@pureadmin/utils";
import { ref, onMounted, reactive } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import ThumbUp from "~icons/ri/thumb-up-line";
import Hearts from "~icons/ri/hearts-line";
import Empty from "./empty.svg?component";

const { tableData, total, pageIndex, pageSize, queryParams, updateParams, resetParams, refetch, isLoading } =
	useConfigCenterListQuery();

export function useColumns() {
	const dataList = tableData;
	const loading = isLoading;

	/** 表格列配置 */
	const columns = ref<TableColumnList>([
		defaultPureTableIndexColumn,
		{
			label: "配置项名称",
			prop: "configName",
			width: 150,
			fixed: true,
		},
		{
			label: "配置类型",
			prop: "configType",
			width: 120,
		},
		{
			label: "配置键名",
			prop: "configKey",
			width: 200,
		},
		{
			label: "配置值",
			prop: "configValue",
			width: 150,
		},
		{
			label: "默认值",
			prop: "defaultValue",
			width: 150,
		},
		{
			label: "配置描述",
			prop: "configDescription",
			minWidth: 200,
			showOverflowTooltip: true,
		},
		{
			label: "状态",
			prop: "status",
			width: 80,
		},
		{
			label: "排序号",
			prop: "sortOrder",
			width: 80,
		},
		{
			label: "备注",
			prop: "remark",
			minWidth: 150,
			showOverflowTooltip: true,
		},
		{
			label: "创建时间",
			prop: "createTime",
			width: 160,
		},
		{
			label: "更新时间",
			prop: "updateTime",
			width: 160,
		},
		{
			label: "创建人",
			prop: "creator",
			width: 100,
		},
		{
			/** @see https://vscode.dev/github.com/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
			headerRenderer: () => transformI18n($t("common.table.operation")),
			width: 200,
			fixed: "right",
			slot: "operation",
		},
	]);

	/** 分页配置 */
	const pagination = computed<PaginationProps>(() => ({
		...defaultPagination,
		pageSize: pageSize.value,
		currentPage: pageIndex.value,
		total: total.value,
	}));

	function onCurrentChange(page: number) {
		console.log("onCurrentChange", page);
		loading.value = true;
		delay(300).then(() => {
			loading.value = false;
		});
	}

	onMounted(() => {
		dataList.value = tableData;
		pagination.total = dataList.value.length;
		loading.value = false;
	});

	return {
		Empty,
		loading,
		columns,
		dataList,
		pagination,
		onCurrentChange,
	};
}
