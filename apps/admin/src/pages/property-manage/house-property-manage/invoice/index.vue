<script lang="ts" setup>
definePage({
	meta: {
		title: "发票",
		icon: "mdi:receipt",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.invoice"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import {
	defaultForm,
	type 发票_列表数据,
	type 发票_列表查询_VO,
	tableData as mockTableData,
	发票类型Options,
	审核状态Options,
} from "./test-data";
import { type InvoiceFormProps } from "./components/form";
import InvoiceForm from "./components/form.vue";
import { type 发票表单_VO } from "./test-data";

/** 表格数据 */
const tableData = ref<发票_列表数据[]>([]);

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: 0,
});

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "编号",
		prop: "编号",
		width: 120,
	},
	{
		label: "发票类型",
		prop: "发票类型",
		width: 120,
	},
	{
		label: "业主名称",
		prop: "业主名称",
		width: 120,
	},
	{
		label: "申请人",
		prop: "申请人",
		width: 120,
	},
	{
		label: "发票名头",
		prop: "发票名头",
		width: 120,
	},
	{
		label: "纳税人识别号",
		prop: "纳税人识别号",
		width: 120,
	},
	{
		label: "申请金额",
		prop: "申请金额",
		width: 120,
	},
	{
		label: "发票号",
		prop: "发票号",
		width: 120,
	},
	{
		label: "发审核状态",
		prop: "发审核状态",
		width: 120,
	},
	{
		label: "申请时间",
		prop: "申请时间",
		width: 120,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "发票",
	columns: columns.value,
});

/** 模式控制 */
const { modeText, setMode, isAdd } = useMode();

/** 表单组件实例 */
const invoiceFormInstance = ref<InstanceType<typeof InvoiceForm> | null>(null);

/** 测试异步操作 */
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
function openDialog(params: { mode: Mode; row?: 发票_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}发票`;

	/** 业务对象 */
	const 发票表单_VO: 发票表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				编号: row?.编号 || "",
				发票类型: row?.发票类型 || "",
				业主名称: row?.业主名称 || "",
				申请人: row?.申请人 || "",
				发票名头: row?.发票名头 || "",
				纳税人识别号: row?.纳税人识别号 || "",
				申请金额: row?.申请金额 || "",
				发票号: row?.发票号 || "",
				发审核状态: row?.发审核状态 || "",
				申请时间: row?.申请时间 || "",
			});

	/** 表单组件需要的props */
	const formProps: InvoiceFormProps = {
		form: 发票表单_VO,
		defaultValues: 发票表单_VO,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,
		contentRenderer: () =>
			h(InvoiceForm, {
				ref: invoiceFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = invoiceFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = invoiceFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					invoiceFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await invoiceFormInstance.value.plusFormInstance.handleSubmit();
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

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 发票_列表查询_VO = {
	编号: "",
	发票类型: "",
	业主名称: "",
	申请人: "",
	发审核状态: "",
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
	{
		label: "编号",
		prop: "编号",
		valueType: "input",
	},
	{
		label: "发票类型",
		prop: "发票类型",
		valueType: "select",
		options: 发票类型Options,
	},
	{
		label: "业主名称",
		prop: "业主名称",
		valueType: "input",
	},
	{
		label: "申请人",
		prop: "申请人",
		valueType: "input",
	},
	{
		label: "发审核状态",
		prop: "发审核状态",
		valueType: "select",
		options: 审核状态Options,
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
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.编号) {
			filteredData = filteredData.filter((item) => item.编号.includes(plusSearchModel.value.编号!));
		}
		if (plusSearchModel.value.发票类型) {
			filteredData = filteredData.filter((item) => item.发票类型 === plusSearchModel.value.发票类型);
		}
		if (plusSearchModel.value.业主名称) {
			filteredData = filteredData.filter((item) => item.业主名称.includes(plusSearchModel.value.业主名称!));
		}
		if (plusSearchModel.value.申请人) {
			filteredData = filteredData.filter((item) => item.申请人.includes(plusSearchModel.value.申请人!));
		}
		if (plusSearchModel.value.发审核状态) {
			filteredData = filteredData.filter((item) => item.发审核状态 === plusSearchModel.value.发审核状态);
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
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
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
