<script lang="ts" setup>
definePage({
	meta: {
		title: "合同收费",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.contracteCharge"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

import { type ContracteChargeFormProps, defaultForm } from "./components/form";
import ContracteChargeForm from "./components/form.vue";

const ContracteChargeFormInstance = ref<InstanceType<typeof ContracteChargeForm> | null>(null);

interface 合同收费_列表数据 {
	合同编号: string;
	父合同编号: string;
	合同名称: string;
	合同类型: string;
	乙方: string;
	合同金额: string;
	开始时间: string;
	结束时间: string;
}

const tableDataItem: 合同收费_列表数据 = {
	合同编号: "1234567890",
	父合同编号: "1234567890",
	合同名称: "物业服务合同",
	合同类型: "物业费合同",
	乙方: "某物业公司",
	合同金额: "10000.00",
	开始时间: "2025-01-01",
	结束时间: "2025-12-31",
};
/** 表格数据 */
const tableData = ref<合同收费_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);
/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "合同编号",
		prop: "合同编号",
		width: 120,
		fixed: true,
	},
	{
		label: "父合同编号",
		prop: "父合同编号",
		width: 120,
	},
	{
		label: "合同名称",
		prop: "合同名称",
		width: 120,
	},
	{
		label: "合同类型",
		prop: "合同类型",
		width: 120,
	},
	{
		label: "乙方",
		prop: "乙方",
		width: 120,
	},
	{
		label: "合同金额",
		prop: "合同金额",
		width: 120,
	},
	{
		label: "开始时间",
		prop: "开始时间",
		width: 200,
	},
	{
		label: "结束时间",
		prop: "结束时间",
		width: 200,
	},
	{
		// label: transformI18n($t("common.table.operation")),
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		minWidth: 290,
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
	...defaultPureTableProps, // 基础配置
	data: tableData.value, // 表格数据
	columns: [], // 动态列配置
	pagination: pagination.value, // 分页配置
});
/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "合同收费",
	columns: columns.value,
});
/** 表格搜索栏组件 配置  */
interface 合同收费_列表查询_VO {
	合同编号?: string;
	合同名称?: string;
	合同类型?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 合同收费_列表查询_VO = {
	合同编号: "",
	合同名称: "",
	合同类型: "",
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
	// 合同编号
	{
		label: transformI18n($t("propertyManage_expensesManage.contracte-charge.contractNumber")),
		prop: "合同编号",
		valueType: "input",
	},

	// 合同名称
	{
		label: transformI18n($t("propertyManage_expensesManage.contracte-charge.contractName")),
		prop: "合同名称",
		valueType: "input",
	},
	// 合同类型
	{
		label: transformI18n($t("propertyManage_expensesManage.contracte-charge.contractType")),
		prop: "合同类型",
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

async function handleReSearch() {
	console.log("重新搜索");
}

async function handleSearch() {
	console.log("搜索");
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 合同收费_列表数据;
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
	const title = `${modeText.value}合同收费`;

	/** 表单组件需要的props */
	const formProps: ContracteChargeFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	const testEditProps: ContracteChargeFormProps = {
		form: {
			...defaultForm,
			费用类型: "物业费",
			收费项目: "水费历史欠费",
			合同状态: "待审核",
			计费起始时间: "2023-01-01",
			计费结束时间: "2023-12-31",
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
			h(ContracteChargeForm, {
				ref: ContracteChargeFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = ContracteChargeFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// console.log(options, index, button);
					const formComputed = ContracteChargeFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					ContracteChargeFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await ContracteChargeFormInstance.value.plusFormInstance.handleSubmit();
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
		<!-- 表格搜索栏组件 -->
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />
		<!-- {{ plusSearchModel }} -->

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<!-- 表格操作栏组件 -->
			<template #buttons>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("common.buttons.add")) }}
				</ElButton>
			</template>

			<!-- 表格组件 -->
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
						<ElButton type="warning">{{
							transformI18n($t("propertyManage_expensesManage.contracte-charge.payFee"))
						}}</ElButton>
						<ElButton type="info"> {{ transformI18n($t("common.buttons.info")) }} </ElButton>
						<ElButton type="danger">
							{{ transformI18n($t("propertyManage_expensesManage.contracte-charge.viewFee")) }}
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
