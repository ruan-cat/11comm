<script lang="ts" setup>
definePage({
	meta: {
		title: "业务受理",
		icon: "mdi:briefcase",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.communityManage.handingBusiness"),
	},
});

import { ref, computed, onMounted } from "vue";
import { ElMessageBox } from "element-plus";
import { transformI18n } from "@/plugins/i18n";
import {
	type 业务受理_列表数据,
	type 业务受理_列表查询_VO,
	tableData as mockTableData,
} from "./test-data";
import type { HandingBusinessFormProps, 业务受理表单_VO } from "./components/form";
import { defaultForm, 列表数据转表单数据, 费用类型Options, 状态Options } from "./components/form";
import HandingBusinessForm from "./components/form.vue";

const handingBusinessFormInstance = ref<InstanceType<typeof HandingBusinessForm> | null>(null);

/** 表格数据 */
const tableData = ref<业务受理_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "费用项目",
		prop: "费用项目",
		width: 120,
	},
	{
		label: "费用标识",
		prop: "费用标识",
		width: 120,
	},
	{
		label: "费用类型",
		prop: "费用类型",
		width: 120,
	},
	{
		label: "应收金额",
		prop: "应收金额",
		width: 120,
	},
	{
		label: "建账时间",
		prop: "建账时间",
		width: 160,
	},
	{
		label: "应收时间段",
		prop: "应收时间段",
		width: 180,
	},
	{
		label: "说明",
		prop: "说明",
		width: 120,
	},
	{
		label: "状态",
		prop: "状态",
		width: 120,
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
	title: "业务受理",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 业务受理_列表查询_VO = {
	费用项目: "",
	费用标识: "",
	费用类型: "",
	状态: "",
	建账开始时间: "",
	建账结束时间: "",
	建账时间范围: ["", ""],
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
	// 费用项目
	{
		label: "费用项目",
		prop: "费用项目",
		valueType: "input",
	},

	// 费用标识
	{
		label: "费用标识",
		prop: "费用标识",
		valueType: "input",
	},

	// 费用类型
	{
		label: "费用类型",
		prop: "费用类型",
		valueType: "select",
		options: 费用类型Options,
	},

	// 状态
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		options: 状态Options,
	},

	// 建账时间范围
	{
		label: "建账时间范围",
		prop: "建账时间范围",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
			onChange(value: string[] | null) {
				plusSearchModel.value.建账开始时间 = value?.[0] ?? "";
				plusSearchModel.value.建账结束时间 = value?.[1] ?? "";
			},
			onClear() {
				plusSearchModel.value.建账开始时间 = "";
				plusSearchModel.value.建账结束时间 = "";
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

/** 加载表格数据 */
async function loadTableData() {
	try {
		// TODO: 替换为真实的API调用
		// 当前使用模拟数据和本地搜索过滤
		let filteredData = mockTableData;

		// 根据搜索条件过滤数据
		if (plusSearchModel.value.费用项目) {
			filteredData = filteredData.filter((item) => item.费用项目.includes(plusSearchModel.value.费用项目!));
		}
		if (plusSearchModel.value.费用标识) {
			filteredData = filteredData.filter((item) => item.费用标识.includes(plusSearchModel.value.费用标识!));
		}
		if (plusSearchModel.value.费用类型) {
			filteredData = filteredData.filter((item) => item.费用类型 === plusSearchModel.value.费用类型);
		}
		if (plusSearchModel.value.状态) {
			filteredData = filteredData.filter((item) => item.状态 === plusSearchModel.value.状态);
		}
		if (plusSearchModel.value.建账开始时间) {
			filteredData = filteredData.filter((item) => item.建账时间 >= plusSearchModel.value.建账开始时间!);
		}
		if (plusSearchModel.value.建账结束时间) {
			filteredData = filteredData.filter((item) => item.建账时间 <= plusSearchModel.value.建账结束时间!);
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
		// TODO: 显示错误提示
	}
}

/** 重置搜索条件并重新加载数据 */
async function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 执行搜索 */
async function handleSearch() {
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 业务受理_列表数据;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

const [isLoadingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}业务受理`;

	/** 业务对象 */
	const 业务受理表单_VO: 业务受理表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value && row
			? 列表数据转表单数据(row)
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: HandingBusinessFormProps = {
		form: 业务受理表单_VO,
		defaultValues: 业务受理表单_VO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,

		contentRenderer: () =>
			h(HandingBusinessForm, {
				ref: handingBusinessFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = handingBusinessFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = handingBusinessFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					handingBusinessFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await handingBusinessFormInstance.value.plusFormInstance.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						await loadTableData();
					}
				},
			},
		],
	});
}

/** 删除单个业务受理 */
async function handleDelete(row: 业务受理_列表数据) {
	try {
		await ElMessageBox.confirm(
			`确认删除业务受理记录：${row.费用标识} - ${row.费用项目}？`,
			"删除确认",
			{
				confirmButtonText: transformI18n($t("common.buttons.del")),
				cancelButtonText: transformI18n($t("common.buttons.cancel")),
				type: "warning",
			},
		);

		// TODO: 调用删除API
		// 模拟删除操作
		await new Promise((resolve) => setTimeout(resolve, 300));

		// 刷新表格数据
		await loadTableData();
	} catch (error) {
		if (error !== "cancel") {
			// TODO: 显示错误提示
		}
	}
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
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("common.buttons.add")) }}
				</ElButton>
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
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.view")) }}
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
