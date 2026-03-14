<script lang="ts" setup>
definePage({
	meta: {
		// 起草合同
		title: "property-manage_contract-manage.draft-contract.pageTitle",
		icon: "mdi:file-edit",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.contractManage.draftContract"),
	},
});

import { ref, h } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { sleep } from "@antfu/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { addDialog, closeDialog } from "@/components/ReDialog";
import {
	type ContractDraftFormVO,
	type DraftContractListItem,
	type DraftContractQueryParamsType,
	contractTypeOptions,
	draftContractStatusOptions,
} from "@01s-11comm/type";
import { type ContractDraftFormProps, defaultForm } from "./components/form";
import ContractDraftForm from "./components/form.vue";
import { useDraftContractListQuery } from "@/api/property-manage/contract-manage/draft-contract";
import { useMode, type Mode } from "@/composables/use-mode";
import { useToggle } from "@vueuse/core";
import { consola } from "consola";
import { defaultAddDialogParams } from "@/config/constant";

const { locale, withLocale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const contractDraftFormInstance = ref<InstanceType<typeof ContractDraftForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<DraftContractQueryParamsType> = {
	contractName: "",
	contractNumber: "",
	contractType: undefined,
	handler: "",
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
} = useDraftContractListQuery(plusSearchDefaultValues);

/** 模式控制 */
const { mode, modeText, setMode, isAdd, isEdit } = useMode();

/** 测试异步函数 */
const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

const statusLabelKeyMap = {
	草稿: "property-manage_contract-manage.draft-contract.options.status.draft",
	审批中: "property-manage_contract-manage.draft-contract.options.status.approving",
	已生效: "property-manage_contract-manage.draft-contract.options.status.effective",
	已终止: "property-manage_contract-manage.draft-contract.options.status.terminated",
} as const;

function translateStatusLabel(value?: string | null) {
	if (!value) return value ?? "";
	const key = statusLabelKeyMap[value as keyof typeof statusLabelKeyMap];
	return key ? transformI18n($t(key)) : value;
}

/** 表格列配置 */
const columns = withLocale<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.draft-contract.fields.contractName")),
		),
		prop: "contractName",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.draft-contract.fields.contractNumber")),
		),
		prop: "contractNumber",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.draft-contract.fields.parentContractNumber")),
		),
		prop: "parentContractNumber",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.draft-contract.fields.contractType")),
		),
		prop: "contractType",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.draft-contract.fields.handler")),
		),
		prop: "handler",
		width: 80,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.draft-contract.fields.contractAmount")),
		),
		prop: "contractAmount",
		width: 100,
		align: "right",
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.draft-contract.fields.startTime")),
		),
		prop: "startTime",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.draft-contract.fields.endTime")),
		),
		prop: "endTime",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.draft-contract.fields.status")),
		),
		prop: "status",
		width: 80,
		cellRenderer: ({ row }: { row: DraftContractListItem }) => {
			const label = translateStatusLabel(row.status);
			const colorMap: Record<string, string> = {
				草稿: "text-gray-500",
				审批中: "text-blue-500",
				已生效: "text-green-500",
				已终止: "text-red-500",
			};
			const cls = colorMap[row.status] || "";
			return h("span", { class: cls }, label);
		},
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_contract-manage.draft-contract.tableTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.contractName")),
		prop: "contractName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.contractNumber")),
		prop: "contractNumber",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.contractType")),
		prop: "contractType",
		valueType: "select",
		options: contractTypeOptions,
	},
	{
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.handler")),
		prop: "handler",
		valueType: "input",
	},
]);

/** 表格搜索栏组件 配置  */
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

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: DraftContractListItem;
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 业务对象 */
	const contractDraftFormVO: ContractDraftFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					contractName: row?.contractName || "",
					contractNumber: row?.contractNumber || "",
					contractType: row?.contractType || "",
					handler: row?.handler || "",
					contractAmount: row?.contractAmount || "",
					startTime: row?.startTime || "",
					endTime: row?.endTime || "",
					partyA: row?.partyA || "",
					partyAContact: "",
					partyAPhone: "",
					partyB: row?.partyB || "",
					partyBContact: "",
					partyBPhone: "",
					handlerPhone: "",
					signingTime: "",
					description: "",
					attachments: [],
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: ContractDraftFormProps = {
		form: contractDraftFormVO,
		defaultValues: contractDraftFormVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () => {
			if (isAdd.value) {
				return transformI18n($t("property-manage_contract-manage.draft-contract.dialogs.addTitle"));
			}
			return transformI18n($t("property-manage_contract-manage.draft-contract.dialogs.editTitle"));
		},
		props: formProps,

		contentRenderer: () =>
			h(ContractDraftForm, {
				ref: contractDraftFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = contractDraftFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = contractDraftFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					contractDraftFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await contractDraftFormInstance.value.plusFormInstance.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						await doFetch(); // 重新加载数据
					}
				},
			},
		],
	});
}

// 处理打印操作
function handlePrint(row: DraftContractListItem) {
	consola.log("打印合同:", row.contractName);
	// TODO: 实现打印功能
}

// 处理删除操作
function handleDelete(row: DraftContractListItem) {
	consola.log("删除合同:", row.contractName);
	// TODO: 实现删除功能
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
					{{ transformI18n($t("property-manage_contract-manage.draft-contract.add")) }}
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
						<ElButton type="info" @click="handlePrint(row)">
							{{ transformI18n($t("property-manage_contract-manage.draft-contract.print")) }}
						</ElButton>
						<ElButton type="danger" @click="handleDelete(row)">
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
