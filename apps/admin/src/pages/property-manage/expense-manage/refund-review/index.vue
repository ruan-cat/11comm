<script lang="ts" setup>
definePage({
	meta: {
		title: "退费审核",
		icon: "mdi:cash-refund",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.refundReview"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type RefundReviewFormProps, defaultForm } from "./components/form";
import RefundReviewForm from "./components/form.vue";
import { useMode, type Mode } from "@/composables/use-mode";
import type { RefundReviewListItem, RefundReviewFormVO } from "@01s-11comm/type";
import { feeTypeOptions, auditStatusOptions } from "@01s-11comm/type";

/** 退费审核_列表查询_VO */
interface RefundReviewQueryVO {
	refundOrderNumber: string;
	paymentOrderNumber: string;
	feeType: string;
	auditStatus: string;
}

/** 模拟表格数据 */
const mockTableData: RefundReviewListItem[] = [
	{
		id: "1",
		name: "退费审核1",
		status: "待审核",
		createTime: "2024-01-01 10:00:00",
		updateTime: "2024-01-01 10:00:00",
		refundOrderNumber: "TF202401010001",
		paymentOrderNumber: "JF202401010001",
		feeType: "物业费",
		payer: "张三",
		paymentPeriod: "2024-01 至 2024-12",
		payablePaidAmount: "1200.00",
		applyTime: "2024-01-15 14:30:00",
		refundReason: "多缴费用",
		applicant: "李四",
		auditStatus: "待审核",
		auditor: "",
	},
	{
		id: "2",
		name: "退费审核2",
		status: "已通过",
		createTime: "2024-01-02 09:00:00",
		updateTime: "2024-01-03 16:00:00",
		refundOrderNumber: "TF202401020002",
		paymentOrderNumber: "JF202401020002",
		feeType: "水费",
		payer: "王五",
		paymentPeriod: "2024-01 至 2024-03",
		payablePaidAmount: "350.00",
		applyTime: "2024-01-16 09:15:00",
		refundReason: "房屋退租",
		applicant: "王五",
		auditStatus: "已通过",
		auditor: "管理员",
	},
];

/** 表格数据 */
const tableData = ref<RefundReviewListItem[]>([]);

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const refundReviewFormInstance = ref<InstanceType<typeof RefundReviewForm> | null>(null);

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
const plusSearchModelRef: FieldValues & RefundReviewQueryVO = {
	refundOrderNumber: "",
	paymentOrderNumber: "",
	feeType: "",
	auditStatus: "",
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

		if (plusSearchModel.value.refundOrderNumber) {
			filteredData = filteredData.filter((item) => item.refundOrderNumber.includes(plusSearchModel.value.refundOrderNumber!));
		}
		if (plusSearchModel.value.paymentOrderNumber) {
			filteredData = filteredData.filter((item) => item.paymentOrderNumber.includes(plusSearchModel.value.paymentOrderNumber!));
		}
		if (plusSearchModel.value.feeType) {
			filteredData = filteredData.filter((item) => item.feeType === plusSearchModel.value.feeType);
		}
		if (plusSearchModel.value.auditStatus) {
			filteredData = filteredData.filter((item) => item.auditStatus === plusSearchModel.value.auditStatus);
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
		label: "退费单号",
		prop: "refundOrderNumber",
		width: 120,
	},
	{
		label: "缴费单号",
		prop: "paymentOrderNumber",
		width: 120,
	},
	{
		label: "费用类型",
		prop: "feeType",
		width: 100,
	},
	{
		label: "付费对象",
		prop: "payer",
		width: 100,
	},
	{
		label: "退费金额",
		prop: "payablePaidAmount",
		width: 100,
	},
	{
		label: "申请时间",
		prop: "applyTime",
		width: 180,
	},
	{
		label: "退费原因",
		prop: "refundReason",
		width: 100,
	},
	{
		label: "申请人",
		prop: "applicant",
		width: 100,
	},
	{
		label: "审核状态",
		prop: "auditStatus",
		width: 100,
	},
	{
		prop: "auditor",
		label: "审核人",
		width: 120,
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
		label: "退费单号",
		prop: "refundOrderNumber",
		valueType: "input",
	},
	{
		label: "缴费单号",
		prop: "paymentOrderNumber",
		valueType: "input",
	},
	{
		label: "费用类型",
		prop: "feeType",
		valueType: "select",
		options: feeTypeOptions,
	},
	{
		label: "审核状态",
		prop: "auditStatus",
		valueType: "select",
		options: auditStatusOptions,
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
	title: "退费审核",
	columns: columns.value,
});

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: RefundReviewListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const formData: RefundReviewFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					refundOrderNumber: row?.refundOrderNumber || "",
					paymentOrderNumber: row?.paymentOrderNumber || "",
					feeType: row?.feeType || "",
					payer: row?.payer || "",
					paymentPeriod: row?.paymentPeriod || "",
					payablePaidAmount: row?.payablePaidAmount || "",
					applyTime: row?.applyTime || "",
					refundReason: row?.refundReason || "",
					applicant: row?.applicant || "",
					auditStatus: row?.auditStatus || "",
					auditor: row?.auditor || "",
					auditRemark: "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: RefundReviewFormProps = {
		form: formData,
		defaultValues: formData,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	/** 弹框标题 */
	const title = `${modeText.value}退费审核`;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,
		contentRenderer: () =>
			h(RefundReviewForm, {
				ref: refundReviewFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = refundReviewFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = refundReviewFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					refundReviewFormInstance.value.plusFormInstance.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await refundReviewFormInstance.value.plusFormInstance.handleSubmit();
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
				<ElButton type="primary">
					{{ transformI18n($t("common.buttons.batchAudit")) }}
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
						<ElButton type="info">{{ transformI18n($t("欠费缴费")) }}</ElButton>
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="info">{{ transformI18n($t("查看费用")) }}</ElButton>
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
