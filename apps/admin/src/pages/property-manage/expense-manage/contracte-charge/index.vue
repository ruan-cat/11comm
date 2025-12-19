<script lang="ts" setup>
definePage({
	meta: {
		title: "合同收费",
		icon: "mdi:file-document-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.contracteCharge"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";

import { type ContracteChargeFormProps, defaultForm, type ContracteChargeFormVO } from "./components/form";
import ContracteChargeForm from "./components/form.vue";
import { useContracteChargeListQuery } from "@/api/property-manage/expense-manage/contracte-charge";
import { type ContracteChargeListItem, type ContracteChargeQueryParams, contractTypeOptions } from "@01s-11comm/type";
import { useToggle } from "@vueuse/core";
import { cloneDeep } from "lodash-es";
import { consola } from "consola";
import { defaultAddDialogParams } from "@/config/constant";

import { addDialog, closeDialog } from "@/components/ReDialog";
import { h } from "vue";

/** 使用 TanStack Query 获取数据 */
useContracteChargeListQuery();

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "合同编号",
		prop: "contractNumber",
		width: 120,
	},
	{
		label: "父合同编号",
		prop: "parentContractNumber",
		width: 120,
	},
	{
		label: "合同名称",
		prop: "contractName",
		width: 120,
	},
	{
		label: "合同类型",
		prop: "contractType",
		width: 120,
	},
	{
		label: "乙方",
		prop: "partyB",
		width: 120,
	},
	{
		label: "合同金额",
		prop: "contractAmount",
		width: 120,
	},
	{
		label: "开始时间",
		prop: "startTime",
		width: 200,
	},
	{
		label: "结束时间",
		prop: "endTime",
		width: 200,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 290,
		fixed: "right",
		slot: "operation",
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
	loading: isFetching.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "合同收费",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ContracteChargeQueryParams> = {
	contractNumber: "",
	contractName: "",
	contractType: "",
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
		label: "合同编号",
		prop: "contractNumber",
		valueType: "input",
	},

	// 合同名称
	{
		label: "合同名称",
		prop: "contractName",
		valueType: "input",
	},
	// 合同类型
	{
		label: "合同类型",
		prop: "contractType",
		valueType: "select",
		options: contractTypeOptions,
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
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	});
}

// 弹框相关功能
const contracteChargeFormInstance = ref<InstanceType<typeof ContracteChargeForm> | null>(null);
/** 模式控制 */
const { mode, modeText, setMode, isAdd, isEdit } = useMode();

const [isFetchingT, setIsLoadingT] = useToggle(false);

/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: ContracteChargeListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}合同收费`;

	/** 业务对象 */
	const 业务对象: ContracteChargeFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					feeType: "物业费", // Default or map from row
					chargeItem: row?.contractName || "",
					contractStatus: "待审核", // Default or map from row
					billingStartTime: row?.startTime || "",
					billingEndTime: row?.endTime || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: ContracteChargeFormProps = {
		form: 业务对象,
		defaultValues: 业务对象,
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
			h(ContracteChargeForm, {
				ref: contracteChargeFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = contracteChargeFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** console.log(options, index, button); */
					const formComputed = contracteChargeFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					/** 手动重置表单 */
					contracteChargeFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await contracteChargeFormInstance.value.plusFormInstance.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						await doFetch();
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
						<ElButton type="info"> 缴费 </ElButton>
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info"> 查看费用 </ElButton>
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
