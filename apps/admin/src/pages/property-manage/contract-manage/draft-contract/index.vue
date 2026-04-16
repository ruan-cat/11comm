<script lang="ts" setup>
definePage({
	meta: {
		// 草稿合同
		title: "property-manage_contract-manage.draft-contract.pageTitle",
		icon: "mdi:file-edit",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.contractManage.draftContract"),
	},
});

import { computed, h, ref } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { ElMessage, ElMessageBox } from "element-plus";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useDoBeforeClose } from "@/composables/use-dialog-do-before-close";
import { defaultAddDialogParams } from "@/config/constant";
import { useMode, type Mode } from "@/composables/use-mode";
import { useDraftContractListQuery } from "@/api/property-manage/contract-manage/draft-contract";
import type { ContractDraftFormProps } from "./components/form";
import { defaultForm } from "./components/form";
import ContractDraftForm from "./components/form.vue";
import ContractDraftDetail from "./components/detail.vue";
import {
	fetchDraftContractDetail,
	useDraftContractCreateMutation,
	useDraftContractDeleteMutation,
	useDraftContractUpdateMutation,
} from "./api";
import { buildDraftContractCreatePayload, buildDraftContractFormValue, buildDraftContractUpdatePayload } from "./utils";
import type {
	ContractDraftDetailVO,
	ContractDraftFormVO,
	DraftContractListItem,
	DraftContractQueryParamsType,
} from "@01s-11comm/type";
import { contractTypeOptions } from "@01s-11comm/type";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const draftContractMessageKeys = {
	blockingUpload: "property-manage_contract-manage.draft-contract.messages.blockingUpload",
	saveSuccess: "property-manage_contract-manage.draft-contract.messages.saveSuccess",
	deleteSuccess: "property-manage_contract-manage.draft-contract.messages.deleteSuccess",
	deleteConfirmTitle: "property-manage_contract-manage.draft-contract.dialogs.deleteConfirmTitle",
	deleteConfirmMessage: "property-manage_contract-manage.draft-contract.dialogs.deleteConfirmMessage",
} as const;

const contractDraftFormInstance = ref<InstanceType<typeof ContractDraftForm> | null>(null);

/**
 * 表格搜索栏双向绑定的变量原始数据
 * @description
 * 用于初始化搜索栏、重置搜索栏，以及作为响应式搜索条件的基准值。
 */
const plusSearchModelRef: FieldValues & Partial<DraftContractQueryParamsType> = {
	contractName: "",
	contractNumber: "",
	contractType: undefined,
	handler: "",
};

/** 表格搜索栏默认值快照 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏双向绑定的响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 查询列表的 TanStack Query 数据状态 */
const {
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useDraftContractListQuery(plusSearchDefaultValues);

const createDraftContractMutation = useDraftContractCreateMutation();
const updateDraftContractMutation = useDraftContractUpdateMutation();
const deleteDraftContractMutation = useDraftContractDeleteMutation();

/** 当前对话框模式 */

const { mode, setMode, isAdd } = useMode();

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
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
		cellRenderer: ({ row }) => {
			const draftRow = row as DraftContractListItem | undefined;
			const status = draftRow?.status ?? "";
			const statusLabelMap: Record<string, string> = {
				draft: "property-manage_contract-manage.draft-contract.options.status.draft",
				pending_review: "property-manage_contract-manage.draft-contract.options.status.approving",
				effective: "property-manage_contract-manage.draft-contract.options.status.effective",
				terminated: "property-manage_contract-manage.draft-contract.options.status.terminated",
			};
			const key = statusLabelMap[status];
			return key ? transformI18n($t(key)) : status;
		},
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 260,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格工具栏配置 */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_contract-manage.draft-contract.tableTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏列配置
 * @description
 * 这里定义搜索项的标签、字段名和控件类型。
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
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

/** 表格搜索栏 props */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 重置搜索栏并刷新列表 */
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 根据当前搜索条件查询列表 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

interface OpenDialogParams {
	mode: Mode;
	row?: DraftContractListItem;
}

/**
 * 生成起草合同弹窗标题。
 * @description
 * 根据信息态、创建态和编辑态统一映射对应的 i18n 文案，避免在弹窗配置里重复分支判断。
 */
function buildDialogTitle(currentMode: Mode) {
	if (currentMode === "info") {
		return transformI18n($t("common.buttons.info"));
	}

	return currentMode === "add"
		? transformI18n($t("property-manage_contract-manage.draft-contract.dialogs.addTitle"))
		: transformI18n($t("property-manage_contract-manage.draft-contract.dialogs.editTitle"));
}

/**
 * 打开起草合同弹窗。
 * @description
 * 统一处理新增、编辑、详情三种模式下的详情拉取、表单默认值准备、弹窗挂载和提交保存流程。
 */
async function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	const detail = row?.id ? await fetchDraftContractDetail(row.id).catch(() => null) : null;

	if (mode === "info") {
		const dialogDetail: ContractDraftDetailVO | null = detail ?? null;

		addDialog({
			...defaultAddDialogParams,
			title: () => transformI18n($t("common.buttons.info")),
			width: "68%",
			contentRenderer: () => h(ContractDraftDetail, { detail: dialogDetail, loading: false }),
			footerButtons: [
				{
					label: () => transformI18n($t("common.buttons.cancel")),
					type: "info",
					btnClick: ({ dialog: { options, index } }) => {
						closeDialog(options, index);
					},
				},
			],
		});

		return;
	}

	/** 当前表单值 */
	const contractDraftFormVO: ContractDraftFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep(buildDraftContractFormValue(detail ?? row));

	/** 传入表单组件的 props */
	const formProps: ContractDraftFormProps = {
		form: contractDraftFormVO,
		defaultValues: contractDraftFormVO,
		detailAttachments: detail?.attachments ?? [],
		mode,
	};

	/** 关闭弹窗前用于脏值对比的默认快照 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () => buildDialogTitle(mode),
		width: "72%",
		props: formProps,
		contentRenderer: () =>
			h(ContractDraftForm, {
				ref: contractDraftFormInstance,
				...formProps,
				mode,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = contractDraftFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = contractDraftFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					contractDraftFormInstance.value?.plusFormInstance?.handleReset();
					contractDraftFormInstance.value?.resetUploadState?.();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					if (contractDraftFormInstance.value?.getHasBlockingUpload?.()) {
						ElMessage.warning(transformI18n($t(draftContractMessageKeys.blockingUpload)));
						return;
					}

					const res = await contractDraftFormInstance.value?.plusFormInstance?.handleSubmit();
					if (!res) {
						return;
					}

					button.btn.loading = true;

					const formComputed = contractDraftFormInstance.value?.formComputed as ContractDraftFormVO;
					const attachmentState = contractDraftFormInstance.value?.getAttachmentSubmitState?.();

					try {
						if (isAdd.value) {
							await createDraftContractMutation.mutateAsync(buildDraftContractCreatePayload(formComputed));
						} else {
							await updateDraftContractMutation.mutateAsync(
								buildDraftContractUpdatePayload({
									id: detail?.id ?? row?.id ?? "",
									form: formComputed,
									retainAttachmentIds: attachmentState?.retainAttachmentIds ?? [],
									deleteAttachmentIds: attachmentState?.deleteAttachmentIds ?? [],
								}),
							);
						}

						ElMessage.success(transformI18n($t(draftContractMessageKeys.saveSuccess)));
						closeDialog(options, index);
						await doFetch();
					} finally {
						button.btn.loading = false;
					}
				},
			},
		],
	});
}

/**
 * 删除起草合同记录。
 * @description
 * 页面层先执行二次确认，再调用删除接口并刷新列表，避免误删后界面状态与服务端数据脱节。
 */
async function handleDelete(row: DraftContractListItem) {
	try {
		await ElMessageBox.confirm(
			transformI18n($t(draftContractMessageKeys.deleteConfirmMessage)),
			transformI18n($t(draftContractMessageKeys.deleteConfirmTitle)),
			{
				type: "warning",
				confirmButtonText: transformI18n($t("common.buttons.pureConfirm")),
				cancelButtonText: transformI18n($t("common.buttons.cancel")),
			},
		);
	} catch {
		return;
	}

	await deleteDraftContractMutation.mutateAsync({ ids: [row.id] });
	ElMessage.success(transformI18n($t(draftContractMessageKeys.deleteSuccess)));
	await doFetch();
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
