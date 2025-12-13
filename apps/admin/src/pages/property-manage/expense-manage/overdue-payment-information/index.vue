<script lang="ts" setup>
definePage({
	meta: {
		title: "欠费信息",
		icon: "mdi:alert-circle-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.overduePaymentInformation"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type OverduePaymentInformationFormProps, defaultForm, type 欠费信息表单_VO } from "./components/form";
import OverduePaymentInformationForm from "./components/form.vue";
import { useMode, type Mode } from "@/composables/use-mode";

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const overduePaymentInformationFormInstance = ref<InstanceType<typeof OverduePaymentInformationForm> | null>(null);

/** 模拟异步操作函数 */
const [isLoadingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 欠费信息_列表查询_VO = {
	收费对象: "",
	业主名称: "",
	手机号: "",
	开始时间: "",
	结束时间: "",
	欠费时间范围: ["", ""],
	更新时间范围: ["", ""],
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 表格数据 */
const tableData = ref<欠费信息_列表数据[]>([]);

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		// 根据搜索条件过滤数据
		if (plusSearchModel.value.收费对象) {
			filteredData = filteredData.filter((item) => item.收费对象 === plusSearchModel.value.收费对象);
		}
		if (plusSearchModel.value.业主名称) {
			filteredData = filteredData.filter((item) => item.业主名称.includes(plusSearchModel.value.业主名称!));
		}
		if (plusSearchModel.value.手机号) {
			filteredData = filteredData.filter((item) => item.手机号.includes(plusSearchModel.value.手机号!));
		}
		if (plusSearchModel.value.开始时间 && plusSearchModel.value.结束时间) {
			filteredData = filteredData.filter((item) => {
				const itemStartTime = new Date(item.开始时间).getTime();
				const itemEndTime = new Date(item.结束时间).getTime();
				const startTime = new Date(String(plusSearchModel.value.开始时间)).getTime();
				const endTime = new Date(String(plusSearchModel.value.结束时间)).getTime();
				return itemStartTime >= startTime && itemEndTime <= endTime;
			});
		}
		if (plusSearchModel.value.更新时间范围) {
			const [startTime, endTime] = plusSearchModel.value.更新时间范围;
			if (startTime && endTime) {
				filteredData = filteredData.filter((item) => {
					const updateTime = new Date(item.更新时间).getTime();
					const start = new Date(String(startTime)).getTime();
					const end = new Date(String(endTime)).getTime();
					return updateTime >= start && updateTime <= end;
				});
			}
		}

		/** 更新总数 */
		pagination.value.total = filteredData.length;

		/** 分页处理 */
		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;
		tableData.value = filteredData.slice(startIndex, endIndex);

		/** 更新表格配置 */
		pureTableProps.value.data = tableData.value.map((item) => ({
			...item,
			欠费时间段: `${item.开始时间} 至 ${item.结束时间}`,
		}));
	} catch (error) {
		console.error("加载数据失败:", error);
		/** TODO: 显示错误提示 */
	}
}

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "收费对象",
		prop: "收费对象",
		width: 100,
	},
	{
		label: "业主名称",
		prop: "业主名称",
		width: 120,
	},
	{
		label: "手机号",
		prop: "手机号",
		width: 140,
	},
	{
		label: "欠费时间段",
		prop: "欠费时间段",
		width: 200,
	},
	{
		label: "合计金额",
		prop: "合计",
		width: 120,
	},
	{
		label: "更新时间",
		prop: "更新时间",
		width: 180,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 280,
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
	// 收费对象
	{
		label: "收费对象",
		prop: "收费对象",
		valueType: "select",
		options: 收费对象Options,
	},
	// 业主名称
	{
		label: "业主名称",
		prop: "业主名称",
		valueType: "input",
	},
	// 手机号
	{
		label: "手机号",
		prop: "手机号",
		valueType: "input",
	},
	// 欠费时间范围
	{
		label: "欠费时间范围",
		prop: "欠费时间范围",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
			onChange(value: string[] | null) {
				plusSearchModel.value.开始时间 = value?.[0] ?? "";
				plusSearchModel.value.结束时间 = value?.[1] ?? "";
			},
			onClear() {
				plusSearchModel.value.开始时间 = "";
				plusSearchModel.value.结束时间 = "";
			},
		},
	},
	// 更新时间范围
	{
		label: "更新时间范围",
		prop: "更新时间范围",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
		},
	},
]);

/** 表格搜索栏组件 配置 */
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
	title: "欠费信息",
	columns: columns.value,
});

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: 欠费信息_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}欠费信息`;

	/** 业务对象 */
	const 欠费信息表单数据: 欠费信息表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					收费对象: row?.收费对象 || "",
					业主名称: row?.业主名称 || "",
					手机号: row?.手机号 || "",
					欠费时间范围: [row?.开始时间 || "", row?.结束时间 || ""],
					欠费金额: row?.合计 || "",
					缴费状态: "未缴费",
					联系地址: "",
					欠费说明: "",
				})
			: cloneDeep({
					...defaultForm,
					收费对象: row?.收费对象 || "",
					业主名称: row?.业主名称 || "",
					手机号: row?.手机号 || "",
					欠费时间范围: [row?.开始时间 || "", row?.结束时间 || ""],
					欠费金额: row?.合计 || "",
					缴费状态: "未缴费",
					联系地址: "",
					欠费说明: "",
				});

	/** 表单组件需要的props */
	const formProps: OverduePaymentInformationFormProps = {
		form: 欠费信息表单数据,
		defaultValues: 欠费信息表单数据,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(OverduePaymentInformationForm, {
				ref: overduePaymentInformationFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = overduePaymentInformationFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = overduePaymentInformationFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button: _button }) => {
					overduePaymentInformationFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await overduePaymentInformationFormInstance.value?.plusFormInstance?.handleSubmit();
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
function handleOperationClick(operation: string, row: 欠费信息_列表数据) {
	switch (operation) {
		case "欠费缴费":
			// 可以添加缴费相关的逻辑
			console.log("欠费缴费操作", row);
			break;
		case "查看详情":
			openDialog({ mode: "info", row });
			break;
		case "查看费用":
			// 可以添加查看费用明细的逻辑
			console.log("查看费用操作", row);
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
				<ElButton type="primary">
					欠费缴费
				</ElButton>
				<ElButton type="info">
					导出欠费清单
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
						<ElButton type="warning" @click="handleOperationClick('欠费缴费', row)">
							欠费缴费
						</ElButton>
						<ElButton type="info" @click="handleOperationClick('查看详情', row)">
							查看详情
						</ElButton>
						<ElButton type="primary" @click="handleOperationClick('查看费用', row)">
							查看费用
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
