<script lang="ts" setup>
definePage({
	meta: {
		// 发票
		title: "property-manage_house-property-manage.invoice.pageTitle",
		icon: "mdi:receipt",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.invoice"),
	},
});

import { ref, h } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { cloneDeep } from "@pureadmin/utils";
import { useMode, type Mode } from "@/composables/use-mode";
import type { InvoiceListItem, InvoiceQueryParams, InvoiceFormVO } from "@01s-11comm/type";
import { invoiceTypeOptions, invoiceAuditStatusOptions } from "@01s-11comm/type";
import { useInvoiceListQuery } from "@/api/property-manage/house-property-manage/invoice";
import { type InvoiceFormProps, defaultForm } from "./components/form";
import InvoiceForm from "./components/form.vue";

const { locale, withLocale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const invoiceFormInstance = ref<InstanceType<typeof InvoiceForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<InvoiceQueryParams> = {
	code: "",
	invoiceType: "",
	ownerName: "",
	applicant: "",
	auditStatus: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice.search.code")),
		prop: "code",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice.search.invoiceType")),
		prop: "invoiceType",
		valueType: "select",
		options: invoiceTypeOptions,
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice.search.ownerName")),
		prop: "ownerName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice.search.applicant")),
		prop: "applicant",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice.search.auditStatus")),
		prop: "auditStatus",
		valueType: "select",
		options: invoiceAuditStatusOptions,
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = searchProps(plusSearchDefaultValues);

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
} = useInvoiceListQuery(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/** 表格列配置 */
const columns = withLocale<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.invoice.fields.code")),
		),
		prop: "编号",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.invoice.fields.invoiceType")),
		),
		prop: "发票类型",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.invoice.fields.ownerName")),
		),
		prop: "业主名称",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.invoice.fields.applicant")),
		),
		prop: "申请人",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.invoice.fields.invoiceTitle")),
		),
		prop: "发票名头",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.invoice.fields.taxpayerId")),
		),
		prop: "纳税人识别号",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.invoice.fields.applicationAmount")),
		),
		prop: "申请金额",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.invoice.fields.invoiceNumber")),
		),
		prop: "发票号",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.invoice.fields.auditStatus")),
		),
		prop: "发审核状态",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.invoice.fields.applicationTime")),
		),
		prop: "申请时间",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_house-property-manage.invoice.tableTitle")),
	columns: columns.value,
}));

// 模式控制
const { modeText, setMode, isAdd } = useMode();

/** 测试异步操作 */
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
function openDialog(params: { mode: Mode; row?: InvoiceListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const formData: InvoiceFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				code: row?.code || "",
				invoiceType: row?.invoiceType || "",
				ownerName: row?.ownerName || "",
				applicant: row?.applicant || "",
				invoiceTitle: row?.invoiceTitle || "",
				taxpayerId: row?.taxpayerId || "",
				applicationAmount: row?.applicationAmount || "",
				invoiceNumber: row?.invoiceNumber || "",
				auditStatus: row?.auditStatus || "",
				applicationTime: row?.applicationTime || "",
			});

	/** 表单组件需要的props */
	const formProps: InvoiceFormProps = {
		form: formData,
		defaultValues: formData,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_house-property-manage.invoice.dialogs.addTitle"))
				: transformI18n($t("property-manage_house-property-manage.invoice.dialogs.editTitle")),
		props,
		contentRenderer: () =>
			h(InvoiceForm, {
				ref: invoiceFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = invoiceFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = invoiceFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					invoiceFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await invoiceFormInstance.value?.plusFormInstance?.handleSubmit();
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
	<section :key="locale" class="index-root">
		<PlusSearch
			:key="locale"
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			:search-text="plusSearchButtonTexts.searchText"
			:reset-text="plusSearchButtonTexts.resetText"
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
