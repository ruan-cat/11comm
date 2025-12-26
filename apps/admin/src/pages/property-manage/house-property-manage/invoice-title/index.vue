<script lang="ts" setup>
definePage({
	meta: {
		title: "发票抬头",
		icon: "mdi:receipt",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.invoiceTitle"),
	},
});

import { ref, computed } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import type { InvoiceTitleListItem, InvoiceTitleQueryParams, InvoiceTitleFormVO } from "@01s-11comm/type";
import { invoiceTitleTypeOptions } from "@01s-11comm/type";
import { useInvoiceTitleListQuery } from "@/api/property-manage/house-property-manage/invoice-title";
import { defaultForm } from "./components/form";

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<InvoiceTitleQueryParams> = {
	ownerName: "",
	invoiceType: "",
	invoiceTitle: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useInvoiceTitleListQuery(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "业主名称",
		prop: "ownerName",
		valueType: "input",
	},

	{
		label: "发票类型",
		prop: "invoiceType",
		valueType: "select",
		options: invoiceTitleTypeOptions,
	},

	{
		label: "发票名头",
		prop: "invoiceTitle",
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

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "编号",
		prop: "code",
		width: 120,
	},
	{
		label: "业主名称",
		prop: "ownerName",
		width: 120,
	},
	{
		label: "发票类型",
		prop: "invoiceType",
		width: 120,
	},
	{
		label: "发票名头",
		prop: "invoiceTitle",
		width: 160,
	},
	{
		label: "纳税人识别号",
		prop: "taxpayerId",
		width: 160,
	},
	{
		label: "地址",
		prop: "address",
		width: 180,
	},
	{
		label: "电话",
		prop: "phone",
		width: 120,
	},
	{
		label: "开户行及账号",
		prop: "bankAccount",
		width: 200,
	},
	{
		label: "备注",
		prop: "remark",
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

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "发票抬头",
	columns: columns.value,
});

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
function openDialog(params: { mode: Mode; row?: InvoiceTitleListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}发票抬头`;

	/** 业务对象 */
	const formData: InvoiceTitleFormVO = isAdd.value
		? structuredClone(defaultForm)
		: structuredClone({
				...defaultForm,
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
						await doFetch();
					}
				},
			},
		],
	});
}
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

		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
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
					:loading="isFetching"
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
