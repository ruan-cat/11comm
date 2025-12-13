<script lang="ts" setup>
definePage({
	meta: {
		title: "费用项设置",
		icon: "mdi:cog-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.expenseItemSetting"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type ExpenseItemSettingFormProps, defaultForm, type 费用项设置表单_VO } from "./components/form";
import ExpenseItemSettingForm from "./components/form.vue";

/** 表单组件实例 */
const expenseItemSettingFormInstance = ref<InstanceType<typeof ExpenseItemSettingForm> | null>(null);

/** 表格数据 */
const tableData = ref<费用项设置_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "编号",
		prop: "编号",
		width: 120,
	},
	{
		label: "费用类型",
		prop: "费用类型",
		width: 120,
	},
	{
		label: "收费项目",
		prop: "收费项目",
		width: 120,
	},
	{
		label: "费用标识",
		prop: "费用标识",
		width: 120,
	},
	{
		label: "付费类型",
		prop: "付费类型",
		width: 120,
	},
	{
		label: "缴费周期(单位:月)",
		prop: "缴费周期(单位:月)",
		width: 120,
	},
	{
		label: "公式",
		prop: "公式",
		width: 120,
	},
	{
		label: "计费单价(单位:元)",
		prop: "计费单价(单位:元)",
		width: 120,
	},
	{
		label: "附加/固定费用(单位:元)",
		prop: "附加固定费用",
		width: 140,
	},
	{
		label: "账户抵扣",
		prop: "账户抵扣",
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
	title: "费用项",
	columns: columns.value,
});

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = allTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.费用项ID) {
			filteredData = filteredData.filter((item) => item.编号.includes(plusSearchModel.value.费用项ID!));
		}
		if (plusSearchModel.value.收费项目) {
			filteredData = filteredData.filter((item) => item.收费项目.includes(plusSearchModel.value.收费项目!));
		}
		if (plusSearchModel.value.费用标识) {
			filteredData = filteredData.filter((item) => item.费用标识 === plusSearchModel.value.费用标识);
		}
		if (plusSearchModel.value.付费类型) {
			filteredData = filteredData.filter((item) => item.付费类型 === plusSearchModel.value.付费类型);
		}
		if (plusSearchModel.value.账户抵扣) {
			filteredData = filteredData.filter((item) => item.账户抵扣 === plusSearchModel.value.账户抵扣);
		}
		if (plusSearchModel.value.自定义费用) {
			filteredData = filteredData.filter((item) => item.费用标识 === plusSearchModel.value.自定义费用);
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

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 费用项设置_列表查询_VO = {
	费用项ID: "",
	收费项目: "",
	费用标识: "",
	付费类型: "",
	账户抵扣: "",
	自定义费用: "",
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
	// 费用项ID
	{
		label: transformI18n($t("propertyManage_expensesManage.expenses-setup.expensesID")),
		prop: "费用项ID",
		valueType: "input",
	},

	// 收费项目
	{
		label: transformI18n($t("propertyManage_expensesManage.expenses-setup.expensesItem")),
		prop: "收费项目",
		valueType: "input",
	},

	// 费用标识
	{
		label: transformI18n($t("propertyManage_expensesManage.expenses-setup.expensesUnit")),
		prop: "费用标识",
		valueType: "select",
		options: 费用标识Options,
	},

	// 付费类型
	{
		label: transformI18n($t("propertyManage_expensesManage.expenses-setup.expensesType")),
		prop: "付费类型",
		valueType: "select",
		options: 付费类型Options,
	},
	//账户抵扣
	{
		label: transformI18n($t("propertyManage_expensesManage.expenses-setup.expensesAmount")),
		prop: "账户抵扣",
		valueType: "select",
		options: 账户抵扣Options,
	},
	//自定义费用
	{
		label: transformI18n($t("propertyManage_expensesManage.expenses-setup.expensesAmountType")),
		prop: "自定义费用",
		valueType: "select",
		options: 自定义费用Options,
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
	row?: 费用项设置_列表数据;
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
	const title = `${modeText.value}费用项设置`;

	/** 业务对象 */
	const 费用项设置表单_VO: 费用项设置表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? {
					...defaultForm,
					费用类型: row?.费用类型 || "物业费",
					收费项目: row?.收费项目 || "",
					费用标识: row?.费用标识 || "周期性费用",
					付费类型: row?.付费类型 || "预付费",
					"缴费周期(单位:月)": row?.缴费周期 || "1",
					"预付期(单位:天)": row?.预付期 || "30",
					单位: row?.单位 || "元/平方米·月",
					账户抵扣: row?.账户抵扣 || "是",
					手机缴费: row?.手机缴费 || "是",
					进位方式: row?.进位方式 || "四舍五入",
					保留小数位: row?.保留小数位 || "2位",
					状态: row?.状态 || "启用",
					计算公式: row?.公式 || "",
					计费单价: row?.计费单价 || "",
					固定费用: row?.附加固定费用 || "",
				}
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const props: ExpenseItemSettingFormProps = {
		form: 费用项设置表单_VO,
		defaultValues: 费用项设置表单_VO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,

		contentRenderer: () =>
			h(ExpenseItemSettingForm, {
				ref: expenseItemSettingFormInstance,
				...props,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = expenseItemSettingFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** console.log(options, index, button); */
					const formComputed = expenseItemSettingFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					/** 手动重置表单 */
					expenseItemSettingFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await expenseItemSettingFormInstance.value.plusFormInstance.handleSubmit();
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
