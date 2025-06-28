<script lang="ts" setup>
definePage({
	meta: {
		title: "费用项设置",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.expenseItemSetting"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

import { type ExpenseItemSettingFormProps, defaultForm } from "./components/form";
import ExpenseItemSettingForm from "./components/form.vue";

const expenseItemSettingFormInstance = ref<InstanceType<typeof ExpenseItemSettingForm> | null>(null);

interface 费用项设置_列表数据 {
	编号: string;
	费用类型: string;
	收费项目: string;
	费用标识: string;
	付费类型: string;
	缴费周期: string;
	公式: string;
	计费单价: string;
	附加固定费用: string;
	账户抵扣: string;
	状态: string;
}

const tableDataItem: 费用项设置_列表数据 = {
	编号: "922025052375641554",
	费用类型: "物业费",
	收费项目: "物业费历史欠费",
	费用标识: "一次性费用",
	付费类型: "预付费",
	缴费周期: "1",
	公式: "建筑面积*单价+附加费",
	计费单价: "250",
	附加固定费用: "0.0",
	账户抵扣: "是",
	状态: "启用",
};

/** 表格数据 */
const tableData = ref<费用项设置_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "编号",
		prop: "编号",
		width: 120,
		fixed: true,
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
		label: "附加/固定费用(单位:元",
		prop: "附加/固定费用(单位:元",
		width: 120,
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
	title: "费用项",
	columns: columns.value,
});

interface 费用项设置_列表查询_VO {
	费用项ID?: string;
	收费项目?: string;
	费用标识?: string;
	付费类型?: string;
	账户抵扣?: string;
	自定义费用?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
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
		options: [
			{
				label: "周期性付费",
				value: "周期性付费",
			},
			{
				label: "一次性付费",
				value: "一次性付费",
			},
		],
	},

	// 付费类型
	{
		label: transformI18n($t("propertyManage_expensesManage.expenses-setup.expensesType")),
		prop: "付费类型",
		valueType: "select",
		options: [
			{
				label: "预付费",
				value: "预付费",
			},
			{
				label: "后付费",
				value: "后付费",
			},
		],
	},
	//账户抵扣
	{
		label: transformI18n($t("propertyManage_expensesManage.expenses-setup.expensesAmount")),
		prop: "账户抵扣",
		valueType: "select",
		options: [
			{
				label: "是",
				value: "是",
			},
			{
				label: "否",
				value: "否",
			},
		],
	},
	//自定义费用
	{
		label: transformI18n($t("propertyManage_expensesManage.expenses-setup.expensesAmountType")),
		prop: "自定义费用",
		valueType: "select",
		options: [
			{
				label: "默认费用",
				value: "默认费用",
			},
			{
				label: "自定义付费",
				value: "自定义付费",
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
	showNumber: 3,
});

async function handleReSearch() {
	console.log("重新搜索");
}

async function handleSearch() {
	console.log("搜索");
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 费用项设置_列表数据;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

const [isLoadingT, setIsLoadingT] = useToggle(false);
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

	/** 表单组件需要的props */
	const formProps: ExpenseItemSettingFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	const testEditProps: ExpenseItemSettingFormProps = {
		form: {
			...defaultForm,
			费用类型: "水费",
			收费项目: "水费历史欠费",
			费用标识: "周期性费用",
			付费类型: "预付费",
			计费单价: "230.1",
			账户抵扣: "是",
			状态: "启用",
		},
		// @ts-ignore
		defaultValues: cloneDeep(row),
	};

	/** 弹框组件所需的变量 */
	const props = isAdd.value
		? formProps
		: {
				form: isEdit.value ? testEditProps.form : cloneDeep(row),
				defaultValues: cloneDeep(row),
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
				...formProps,
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
					// console.log(options, index, button);
					const formComputed = expenseItemSettingFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					expenseItemSettingFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
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
