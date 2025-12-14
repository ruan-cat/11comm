<script lang="ts" setup>
definePage({
	meta: {
		title: "到期合同",
		icon: "mdi:calendar-alert",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.contractManage.expire"),
	},
});

import { ref, computed, onMounted, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { addDialog, closeDialog, updateDialog, closeAllDialog } from "@/components/ReDialog";
import { useMode, type Mode } from "@/composables/use-mode";
import { type ContractExpireFormProps, defaultForm, type ContractExpireFormVO } from "./components/form";
import ContractExpireForm from "./components/form.vue";
import { useExpireListQuery } from "@/api/property-manage/contract-manage/expire";
import { type ExpireListItem, type ExpireQueryParams, 合同类型Options, 处理状态Options } from "@01s-11comm/type";
import { useToggle } from "@vueuse/core";
import { cloneDeep } from "lodash-es";
import { consola } from "consola";
import { defaultAddDialogParams } from "@/config/constant";
import { useDoBeforeClose } from "@/composables/use-dialog-do-before-close";

const contractExpireFormInstance = ref<InstanceType<typeof ContractExpireForm> | null>(null);

/** 使用 TanStack Query 获取数据 */
const { tableData, total, pageIndex, pageSize, isLoading, queryParams, updateParams, resetParams, refetch } =
	useExpireListQuery();

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "合同名称",
		prop: "contractName",
		width: 160,
	},
	{
		label: "合同编号",
		prop: "contractNumber",
		width: 140,
	},
	{
		label: "合同类型",
		prop: "contractType",
		width: 120,
	},
	{
		label: "甲方",
		prop: "partyA",
		width: 140,
	},
	{
		label: "乙方",
		prop: "partyB",
		width: 140,
	},
	{
		label: "合同金额",
		prop: "contractAmount",
		width: 120,
	},
	{
		label: "到期时间",
		prop: "endTime",
		width: 160,
	},
	{
		label: "处理状态",
		prop: "processingStatus",
		width: 100,
		formatter: (row: ExpireListItem) => {
			const statusMap = {
				未处理: "未处理",
				处理中: "处理中",
				已续签: "已续签",
				已终止: "已终止",
				已延期: "已延期",
			};
			return statusMap[row.processingStatus] || row.processingStatus;
		},
	},
	{
		label: "处理人",
		prop: "processor",
		width: 100,
	},
	{
		label: "处理时间",
		prop: "processTime",
		width: 160,
	},
	{
		label: "备注",
		prop: "remark",
		width: 200,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "到期合同",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ExpireQueryParams> = {
	contractName: "",
	contractNumber: "",
	contractType: "",
	processingStatus: "",
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
		label: "合同名称",
		prop: "contractName",
		valueType: "input",
	},
	{
		label: "合同编号",
		prop: "contractNumber",
		valueType: "input",
	},
	{
		label: "合同类型",
		prop: "contractType",
		valueType: "select",
		options: 合同类型Options,
	},
	{
		label: "处理状态",
		prop: "processingStatus",
		valueType: "select",
		options: 处理状态Options,
	},
]);

/** 分页配置 */
const pagination = computed<PaginationProps>(() => ({
	...defaultPagination,
	pageSize: pageSize.value,
	currentPage: pageIndex.value,
	total: total.value,
}));

/** 处理页数变化 */
function handlePageSizeChange(newPageSize: number) {
	pageSize.value = newPageSize;
}

/** 处理页码变化 即后端的 pageIndex */
function handleCurrentPageChange(currentPage: number) {
	pageIndex.value = currentPage;
}

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
	loading: isLoading.value,
});

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	} as Partial<ExpireQueryParams>);
}

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: ExpireListItem;
}

/** 模式控制 */
const { mode, modeText, setMode, isAdd, isEdit } = useMode();

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
	const title = `${modeText.value}合同到期处理`;

	/** 业务对象 */
	const contractExpireFormVO: ContractExpireFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					contractName: row?.contractName || "",
					contractNumber: row?.contractNumber || "",
					contractType: row?.contractType || "采购合同",
					partyA: row?.partyA || "",
					partyB: row?.partyB || "",
					partyAContact: "", // Missing in list item, using default
					partyAPhone: "", // Missing in list item, using default
					partyBContact: "", // Missing in list item, using default
					partyBPhone: "", // Missing in list item, using default
					handler: row?.handler || "",
					handlerPhone: "", // Missing in list item, using default
					contractAmount: row?.contractAmount || "",
					startTime: row?.startTime || "",
					endTime: row?.endTime || "",
					signingTime: row?.signingTime || "",
					processingType: "续签", // Default or derived
					processor: row?.processor || "",
					description: "", // Missing in list item
				} as ContractExpireFormVO)
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: ContractExpireFormProps = {
		form: contractExpireFormVO,
		defaultValues: contractExpireFormVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,

		contentRenderer: () =>
			h(ContractExpireForm, {
				ref: contractExpireFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = contractExpireFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = contractExpireFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					contractExpireFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await contractExpireFormInstance.value.plusFormInstance.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						await refetch();
					}
				},
			},
		],
	});
}

onMounted(async () => {
	// TanStack Query will auto-fetch on mount
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
						<ElButton type="info" @click="openDialog({ mode: 'add', row })">
							续签处理
						</ElButton>
						<ElButton type="danger" @click="openDialog({ mode: 'add', row })">
							终止处理
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
