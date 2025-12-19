<script lang="ts" setup>
definePage({
	meta: {
		title: "发票抬头",
		icon: "mdi:receipt",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.invoiceTitle"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import type {
	InvoiceTitleListItem,
	InvoiceTitleQueryParams,
	发票抬头_列表数据,
	发票抬头_列表查询_VO,
	发票抬头表单_VO,
} from "@01s-11comm/type";
import { 发票类型选项, invoiceTitleDefaultForm } from "@01s-11comm/type";
import type { TableColumns } from "@pureadmin/table";
import type { PaginationProps } from "element-plus";

/** 表格数据 */
const tableData = ref<发票抬头_列表数据[]>([]);

/** 全部表格数据（用于本地搜索过滤） */
const allTableData = ref<发票抬头_列表数据[]>([
	// TODO: 替换为真实API数据
]);

/** 表格列配置 */
const columns = ref<TableColumns>([
	defaultPureTableIndexColumn,
	{
		label: "编号",
		prop: "编号",
		width: 120,
	},
	{
		label: "业主名称",
		prop: "业主名称",
		width: 120,
	},
	{
		label: "发票类型",
		prop: "发票类型",
		width: 120,
	},
	{
		label: "发票名头",
		prop: "发票名头",
		width: 160,
	},
	{
		label: "纳税人识别号",
		prop: "纳税人识别号",
		width: 160,
	},
	{
		label: "地址",
		prop: "地址",
		width: 180,
	},
	{
		label: "电话",
		prop: "电话",
		width: 120,
	},
	{
		label: "开户行及账号",
		prop: "开户行及账号",
		width: 200,
	},
	{
		label: "备注",
		prop: "备注",
		width: 150,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
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
	title: "发票抬头",
	columns: columns.value,
});

/** 加载表格数据 */
async function loadTableData() {
	try {
		// TODO: 替换为真实的API调用
		// 当前使用模拟数据和本地搜索过滤
		let filteredData = [...allTableData.value];

		// 根据搜索条件过滤数据
		if (plusSearchModel.value.ownerName) {
			filteredData = filteredData.filter((item) => item.ownerName.includes(plusSearchModel.value.ownerName!));
		}
		if (plusSearchModel.value.invoiceType) {
			filteredData = filteredData.filter((item) => item.invoiceType === plusSearchModel.value.invoiceType);
		}
		if (plusSearchModel.value.invoiceTitle) {
			filteredData = filteredData.filter((item) => item.invoiceTitle.includes(plusSearchModel.value.invoiceTitle!));
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

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 发票抬头_列表查询_VO = {
	ownerName: "",
	invoiceType: "",
	invoiceTitle: "",
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
		label: "业主名称",
		prop: "业主名称",
		valueType: "input",
	},

	{
		label: "发票类型",
		prop: "invoiceType",
		valueType: "select",
		options: 发票类型选项,
	},

	{
		label: "发票名头",
		prop: "发票名头",
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

// 模式控制
const { modeText, setMode, isAdd, isEdit } = useMode();

// 导入表单组件
import { type InvoiceTitleFormProps } from "./components/form";
import InvoiceTitleForm from "./components/form.vue";

const invoiceTitleFormInstance = ref<InstanceType<typeof InvoiceTitleForm> | null>(null);

/** 模拟异步操作函数 */
const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: 发票抬头_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}发票抬头`;

	/** 业务对象 */
	const formData: 发票抬头表单_VO = isAdd.value
		? cloneDeep(invoiceTitleDefaultForm)
		: cloneDeep({
				...invoiceTitleDefaultForm,
				ownerName: row?.ownerName || "",
				invoiceType: row?.invoiceType || "",
				invoiceTitle: row?.invoiceTitle || "",
				taxpayerId: row?.taxpayerId || "",
				address: row?.address || "",
				phone: row?.phone || "",
				bankAccount: row?.bankAccount || "",
				remark: row?.remark || "",
			});

	/** 表单组件需要的props */
	const formProps: InvoiceTitleFormProps = {
		form: formData,
		defaultValues: formData,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(InvoiceTitleForm, {
				ref: invoiceTitleFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = invoiceTitleFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = invoiceTitleFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					invoiceTitleFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await invoiceTitleFormInstance.value?.plusFormInstance?.handleSubmit();
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
