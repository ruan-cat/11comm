<script lang="ts" setup>
definePage({
	meta: {
		// 到期合同
		title: "property-manage_contract-manage.expired-contract.pageTitle",
		icon: "mdi:calendar-alert",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.contractManage.expire"),
	},
});

import { ref, onMounted, h } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useMode, type Mode } from "@/composables/use-mode";
import {
	type ContractExpireFormVO,
	type ExpireListItem,
	type ExpireQueryParams,
	contractTypeOptions,
	handlingStatusOptions,
} from "@01s-11comm/type";
import { type ContractExpireFormProps, defaultForm } from "./components/form";
import ContractExpireForm from "./components/form.vue";
import { useExpireListQuery } from "@/api/property-manage/contract-manage/expire";
import { useToggle } from "@vueuse/core";
import { consola } from "consola";
import { defaultAddDialogParams } from "@/config/constant";
import { cloneDeep } from "@pureadmin/utils";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const statusTextMap = computed(() => ({
	未处理: transformI18n($t("property-manage_contract-manage.expired-contract.options.processingStatuses.unprocessed")),
	处理中: transformI18n($t("property-manage_contract-manage.expired-contract.options.processingStatuses.processing")),
	已续签: transformI18n($t("property-manage_contract-manage.expired-contract.options.processingStatuses.renewed")),
	已终止: transformI18n($t("property-manage_contract-manage.expired-contract.options.processingStatuses.terminated")),
	已延期: transformI18n($t("property-manage_contract-manage.expired-contract.options.processingStatuses.delayed")),
}));

function translateStatusLabel(value?: string | null) {
	if (!value) return "";
	return statusTextMap.value[value] ?? value;
}

const translatedContractTypeOptions = computed(() =>
	contractTypeOptions.map((item) => ({
		...item,
		label: transformI18n(
			$t(
				`property-manage_contract-manage.expired-contract.form.options.contractTypes.${
					item.value === "采购合同"
						? "purchase"
						: item.value === "销售合同"
							? "sales"
							: item.value === "服务合同"
								? "service"
								: item.value === "租赁合同"
									? "lease"
									: item.value === "劳务合同"
										? "labor"
										: item.value === "技术合同"
											? "technology"
											: "purchase"
				}`,
			),
		),
	})),
);

const translatedHandlingStatusOptions = computed(() =>
	handlingStatusOptions.map((item) => ({
		...item,
		label: transformI18n(
			$t(
				`property-manage_contract-manage.expired-contract.options.processingStatuses.${
					item.value === "未处理"
						? "unprocessed"
						: item.value === "处理中"
							? "processing"
							: item.value === "已续签"
								? "renewed"
								: item.value === "已终止"
									? "terminated"
									: item.value === "已延期"
										? "delayed"
										: "unprocessed"
				}`,
			),
		),
	})),
);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ExpireQueryParams> = {
	contractName: "",
	contractNumber: "",
	contractType: undefined,
	partyA: "",
	partyB: "",
	processingStatus: undefined,
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
} = useExpireListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.expired-contract.fields.contractName")),
		),
		prop: "contractName",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.expired-contract.fields.contractNumber")),
		),
		prop: "contractNumber",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.expired-contract.fields.contractType")),
		),
		prop: "contractType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.expired-contract.fields.partyA")),
		),
		prop: "partyA",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.expired-contract.fields.partyB")),
		),
		prop: "partyB",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.expired-contract.fields.contractAmount")),
		),
		prop: "contractAmount",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.expired-contract.fields.endTime")),
		),
		prop: "endTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.expired-contract.fields.processingStatus")),
		),
		prop: "processingStatus",
		width: 100,
		cellRenderer: ({ row }) => translateStatusLabel(row.processingStatus),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.expired-contract.fields.processor")),
		),
		prop: "processor",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.expired-contract.fields.processTime")),
		),
		prop: "processTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.expired-contract.fields.remark")),
		),
		prop: "remark",
		width: 200,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件配置 */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_contract-manage.expired-contract.tableTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏组件表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.fields.contractName")),
		prop: "contractName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.fields.contractNumber")),
		prop: "contractNumber",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.fields.contractType")),
		prop: "contractType",
		valueType: "select",
		options: translatedContractTypeOptions.value,
	},
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.fields.partyA")),
		prop: "partyA",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.fields.partyB")),
		prop: "partyB",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.fields.processingStatus")),
		prop: "processingStatus",
		valueType: "select",
		options: translatedHandlingStatusOptions.value,
	},
]);

/** 表格搜索栏组件配置 */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/** 弹框相关功能 */
const contractExpireFormInstance = ref<InstanceType<typeof ContractExpireForm> | null>(null);
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

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: ExpireListItem;
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

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
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_contract-manage.expired-contract.dialogs.addTitle"))
				: transformI18n($t("property-manage_contract-manage.expired-contract.dialogs.editTitle")),
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
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = contractExpireFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					contractExpireFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await contractExpireFormInstance.value.plusFormInstance.handleSubmit();
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
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info" @click="openDialog({ mode: 'add', row })">
							{{ transformI18n($t("property-manage_contract-manage.expired-contract.renewalProcess")) }}
						</ElButton>
						<ElButton type="danger" @click="openDialog({ mode: 'add', row })">
							{{ transformI18n($t("property-manage_contract-manage.expired-contract.terminationProcess")) }}
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
