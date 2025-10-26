<script lang="ts" setup>
definePage({
	meta: {
		title: "缴费审核",
		icon: "mdi:check-circle-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.paymentReview"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import {
	type 缴费审核_列表数据,
	type 缴费审核_列表查询_VO,
	审核状态Options,
	费用项目Options,
	tableData as mockTableData,
} from "./test-data";

import { type 缴费审核FormProps, defaultForm, type 缴费审核_表单数据 } from "./components/form";
import 缴费审核Form from "./components/form.vue";

/** 表单组件实例 */
const 缴费审核FormInstance = ref<InstanceType<typeof 缴费审核Form> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 缴费审核_列表查询_VO = {
	房屋: "",
	费用项目: "",
	审核状态: "",
	缴费时间范围: ["", ""],
};
/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);
/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 表格数据 */
const tableData = ref<缴费审核_列表数据[]>([]);

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.房屋) {
			filteredData = filteredData.filter((item) => item.房屋.includes(plusSearchModel.value.房屋!));
		}
		if (plusSearchModel.value.费用项目) {
			filteredData = filteredData.filter((item) => item.费用项目 === plusSearchModel.value.费用项目);
		}
		if (plusSearchModel.value.审核状态) {
			filteredData = filteredData.filter((item) => item.审核状态 === plusSearchModel.value.审核状态);
		}
		if (plusSearchModel.value.缴费时间范围) {
			const [startTime, endTime] = plusSearchModel.value.缴费时间范围;
			filteredData = filteredData.filter((item) => {
				const paymentTime = new Date(item.缴费时间).getTime();
				const start = new Date(startTime).getTime();
				const end = new Date(endTime).getTime();
				return paymentTime >= start && paymentTime <= end;
			});
		}

		/** 更新总数 */
		pagination.value.total = filteredData.length;

		/** 分页处理 */
		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;
		tableData.value = filteredData.slice(startIndex, endIndex);

		/** 更新表格配置 */
		pureTableProps.value.data = tableData.value;
	} catch (error) {
		console.error("加载数据失败:", error);
		/** TODO: 显示错误提示 */
	}
}

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "房屋",
		prop: "房屋",
		width: 100,
	},
	{
		label: "费用项目",
		prop: "费用项目",
		width: 100,
	},
	{
		label: "付费周期",
		prop: "付费周期",
		width: 120,
	},
	{
		label: "应付金额",
		prop: "应付金额",
		width: 100,
	},
	{
		label: "实付金额",
		prop: "实付金额",
		width: 100,
	},
	{
		label: "操作员工",
		prop: "操作员工",
		width: 100,
	},
	{
		label: "缴费时间",
		prop: "缴费时间",
		width: 180,
	},
	{
		label: "审核状态",
		prop: "审核状态",
		width: 100,
	},
	{
		label: "缴费备注",
		prop: "缴费备注",
		width: 150,
	},
	{
		label: "审核说明",
		prop: "审核说明",
		width: 150,
	},
	{
		label: "详情",
		prop: "详情",
		width: 150,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 320,
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

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 房屋 */
	{
		label: "房屋",
		prop: "房屋",
		valueType: "input",
	},
	/** 费用项目 */
	{
		label: "费用项目",
		prop: "费用项目",
		valueType: "select",
		options: 费用项目Options,
	},
	/** 审核状态 */
	{
		label: "审核状态",
		prop: "审核状态",
		valueType: "select",
		options: 审核状态Options,
	},
	/** 缴费时间范围 */
	{
		label: "缴费时间范围",
		prop: "缴费时间范围",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
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

/** 表格配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "缴费审核",
	columns: columns.value,
});

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 缴费审核_列表数据;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

/** 测试异步函数 */
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
	const title = `${modeText.value}缴费审核`;

	/** 业务对象 */
	const 缴费审核表单_VO: 缴费审核_表单数据 = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? {
					...defaultForm,
					房屋: row?.房屋 || "",
					费用项目: row?.费用项目 || "",
					付费周期: row?.付费周期 || "",
					缴费起始时间: row?.缴费起始时间 || "",
					缴费结束时间: row?.缴费结束时间 || "",
					应付金额: row?.应付金额 || "",
					实付金额: row?.实付金额 || "",
					操作员工: row?.操作员工 || "",
					缴费时间: row?.缴费时间 || "",
					审核状态: row?.审核状态 || "",
					审核说明: row?.审核说明 || "",
					缴费备注: row?.缴费备注 || "",
					详情: row?.详情 || "",
				}
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const props: 缴费审核FormProps = {
		form: 缴费审核表单_VO,
		defaultValues: 缴费审核表单_VO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,

		contentRenderer: () =>
			h(缴费审核Form, {
				ref: 缴费审核FormInstance,
				...props,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = 缴费审核FormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// console.log(options, index, button);
					const formComputed = 缴费审核FormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					缴费审核FormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await 缴费审核FormInstance.value.plusFormInstance.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
					}
				},
			},
		],
	});
}

/** 操作按钮点击处理 */
function handleOperationClick(operation: string, row: 缴费审核_列表数据) {
	switch (operation) {
		case "查看详情":
			openDialog({ mode: "info", row });
			break;
		case "审核通过":
			openDialog({ mode: "edit", row });
			break;
		case "审核拒绝":
			openDialog({ mode: "edit", row });
			break;
		default:
			console.log(`${operation} 操作`, row);
	}
}

onMounted(async () => {
	await loadTableData();
});
</script>

<template>
	<section class="index-root">
		<PlusSearch
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			@search="handleSearch"
			@reset="handleReSearch"
		/>

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary" @click="handleOperationClick('批量审核', {} as 缴费审核_列表数据)">
					{{ transformI18n($t("批量审核")) }}
				</ElButton>
				<ElButton type="info" @click="handleOperationClick('导出审核记录', {} as 缴费审核_列表数据)">
					{{ transformI18n($t("导出审核记录")) }}
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
						<ElButton type="primary" v-if="row.审核状态 === '待审核'" @click="handleOperationClick('审核通过', row)">
							审核通过
						</ElButton>
						<ElButton type="primary" v-if="row.审核状态 === '待审核'" @click="handleOperationClick('审核拒绝', row)">
							审核拒绝
						</ElButton>
						<ElButton type="info" @click="handleOperationClick('查看详情', row)"> 查看详情 </ElButton>
						<ElButton type="info" @click="handleOperationClick('查看凭证', row)"> 查看凭证 </ElButton>
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
