<script lang="ts" setup>
definePage({
	meta: {
		title: "补打收据",
		icon: "mdi:receipt-text-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.reprintVoucher"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import {
	type 补打收据_列表数据,
	type 补打收据_列表查询_VO,
	type 补打收据表单_VO,
	费用类型Options,
	tableData as mockTableData,
} from "./test-data";
import { type ReprintVoucherFormProps, defaultForm } from "./components/form";
import ReprintVoucherForm from "./components/form.vue";
import { useMode, type Mode } from "@/composables/use-mode";

/** 表格数据 */
const tableData = ref<补打收据_列表数据[]>([]);

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const reprintVoucherFormInstance = ref<InstanceType<typeof ReprintVoucherForm> | null>(null);

/** 模拟异步操作函数 */
const [isLoadingT, setIsLoadingT] = useToggle(false);
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
const plusSearchModelRef: FieldValues & 补打收据_列表查询_VO = {
	收据编号: "",
	费用类型: "",
	房屋: "",
	业主: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

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
		let filteredData = mockTableData;

		if (plusSearchModel.value.收据编号) {
			filteredData = filteredData.filter((item) => item.收据编号.includes(plusSearchModel.value.收据编号!));
		}
		if (plusSearchModel.value.费用类型) {
			filteredData = filteredData.filter((item) => item.费用类型 === plusSearchModel.value.费用类型);
		}
		if (plusSearchModel.value.房屋) {
			filteredData = filteredData.filter((item) => item.房屋.includes(plusSearchModel.value.房屋!));
		}
		if (plusSearchModel.value.业主) {
			filteredData = filteredData.filter((item) => item.业主.includes(plusSearchModel.value.业主!));
		}

		pagination.value.total = filteredData.length;
		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;
		tableData.value = filteredData.slice(startIndex, endIndex);
		pureTableProps.value.data = tableData.value;
	} catch (error) {
		console.error("加载数据失败:", error);
	}
}

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "收据编号",
		prop: "收据编号",
		width: 120,
	},
	{
		label: "费用类型",
		prop: "费用类型",
		width: 100,
	},
	{
		label: "费用项",
		prop: "费用项",
		width: 150,
	},
	{
		label: "房屋",
		prop: "房屋",
		width: 100,
	},
	{
		label: "业主",
		prop: "业主",
		width: 100,
	},
	{
		label: "车位",
		prop: "车位",
		width: 100,
	},
	{
		label: "总金额",
		prop: "总金额",
		width: 100,
	},
	{
		label: "缴费时间",
		prop: "缴费时间",
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

/** 处理页码变化 */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
	await loadTableData();
}

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "收据编号",
		prop: "收据编号",
		valueType: "input",
	},
	{
		label: "费用类型",
		prop: "费用类型",
		valueType: "select",
		options: 费用类型Options,
	},
	{
		label: "房屋",
		prop: "房屋",
		valueType: "input",
	},
	{
		label: "业主",
		prop: "业主",
		valueType: "input",
	},
]);

/** 表格配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置 */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "补打收据",
	columns: columns.value,
});

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: 补打收据_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const 补打收据表单_VO: 补打收据表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					收据ID: row?.收据ID || "",
					收据编号: row?.收据编号 || "",
					费用类型: row?.费用类型 || "",
					费用项: row?.费用项 || "",
					房屋: row?.房屋 || "",
					业主: row?.业主 || "",
					车位: row?.车位 || "",
					总金额: row?.总金额 || "",
					缴费时间: row?.缴费时间 || "",
					打印份数: 1,
					打印备注: "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: ReprintVoucherFormProps = {
		form: 补打收据表单_VO,
		defaultValues: 补打收据表单_VO,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	/** 弹框标题 */
	const title = `${modeText.value}补打收据`;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,
		contentRenderer: () =>
			h(ReprintVoucherForm, {
				ref: reprintVoucherFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = reprintVoucherFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = reprintVoucherFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					reprintVoucherFormInstance.value.plusFormInstance.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await reprintVoucherFormInstance.value.plusFormInstance.handleSubmit();
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
					{{ transformI18n($t("common.buttons.batchReprint")) }}
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
						<ElButton type="primary" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="danger">
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
