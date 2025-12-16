<script lang="ts" setup>
definePage({
	meta: {
		title: "补打收据",
		icon: "mdi:receipt-text-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.reprintVoucher"),
	},
});

import { ref, computed, onMounted, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import type { ReprintVoucherFormProps } from "./components/form";
import ReprintVoucherForm from "./components/form.vue";
import type { ReprintVoucherListItem, ReprintVoucherQueryParams, ReprintVoucherFormVO } from "@01s-11comm/type";
import { feeTypeOptions } from "@01s-11comm/type";
import { useMode, type Mode } from "@/composables/use-mode";

/** 默认表单数据 */
const defaultForm: ReprintVoucherFormVO = {
	receiptId: "",
	receiptNumber: "",
	feeType: "",
	feeItem: "",
	house: "",
	owner: "",
	parkingSpace: "",
	totalAmount: "",
	paymentTime: "",
	printCopies: 1,
	printRemark: "",
};

/** 模拟表格数据 */
const mockTableData: ReprintVoucherListItem[] = [
	{
		id: "1",
		name: "收据001",
		status: "启用",
		createTime: "2024-01-01 10:00:00",
		updateTime: "2024-01-01 10:00:00",
	},
	{
		id: "2",
		name: "收据002",
		status: "禁用",
		createTime: "2024-01-02 11:00:00",
		updateTime: "2024-01-02 11:00:00",
	},
];

/** 表格数据 */
const tableData = ref<ReprintVoucherListItem[]>([]);

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

const plusSearchModelRef: FieldValues & ReprintVoucherQueryParams = {
	name: "",
	status: "",
	pageIndex: 1,
	pageSize: 10,
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
		let filteredData = [...mockTableData];

		// 根据名称过滤
		if (plusSearchModel.value.name?.trim()) {
			filteredData = filteredData.filter((item) =>
				item.name.includes(plusSearchModel.value.name!.trim())
			);
		}

		// 根据状态过滤
		if (plusSearchModel.value.status) {
			filteredData = filteredData.filter((item) =>
				item.status === plusSearchModel.value.status
			);
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
		label: "名称",
		prop: "name",
		width: 120,
	},
	{
		label: "状态",
		prop: "status",
		width: 100,
	},
	{
		label: "创建时间",
		prop: "createTime",
		width: 180,
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
		prop: "receiptNumber",
		valueType: "input",
	},
	{
		label: "费用类型",
		prop: "feeType",
		valueType: "select",
		options: feeTypeOptions,
	},
	{
		label: "房屋",
		prop: "house",
		valueType: "input",
	},
	{
		label: "业主",
		prop: "owner",
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
function openDialog(params: { mode: Mode; row?: ReprintVoucherListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const formData: ReprintVoucherFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					receiptId: row?.id || "",
					receiptNumber: row?.name || "",
					feeType: "",
					feeItem: "",
					house: "",
					owner: "",
					parkingSpace: "",
					totalAmount: "",
					paymentTime: row?.createTime || "",
					printCopies: 1,
					printRemark: "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: ReprintVoucherFormProps = {
		form: formData,
		defaultValues: formData,
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
