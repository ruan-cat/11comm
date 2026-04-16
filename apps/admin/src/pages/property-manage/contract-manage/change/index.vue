<script lang="ts" setup>
definePage({
	meta: {
		// 合同变更
		title: "property-manage_contract-manage.contract-change.pageTitle",
		icon: "mdi:swap-horizontal",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.contractManage.change"),
	},
});

import { computed, h, ref } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { ElMessage, ElMessageBox } from "element-plus";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useDoBeforeClose } from "@/composables/use-dialog-do-before-close";
import { useMode, type Mode } from "@/composables/use-mode";
import {
	createChange,
	deleteChange,
	getChangeDetail,
	updateChange,
	useChangeListQuery,
} from "@/api/property-manage/contract-manage/change";
import type { ContractChangeFormProps } from "./components/form";
import { defaultForm } from "./components/form";
import ContractChangeForm from "./components/form.vue";
import { createExistingChangeAttachmentDraft } from "./utils/attachment";
import {
	type AttachmentDetailItem,
	type ChangeCreatePayload,
	type ChangeListItem,
	type ChangeQueryParams,
	type ChangeUpdatePayload,
	type ContractChangeDetailVO,
	type ContractChangeFormVO,
	type JsonVO,
	contractTypeOptions,
} from "@01s-11comm/type";

type ChangeFormRow =
	| (ChangeListItem & { attachments?: AttachmentDetailItem[] })
	| (Partial<ContractChangeDetailVO> & { attachments?: AttachmentDetailItem[] });

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const changePageMessageKeys = {
	deleteConfirmMessage: "property-manage_contract-manage.contract-change.dialogs.deleteConfirmMessage",
	deleteConfirmTitle: "property-manage_contract-manage.contract-change.dialogs.deleteConfirmTitle",
	deleteConfirmButton: "property-manage_contract-manage.contract-change.actions.confirmDelete",
	saveSuccess: "property-manage_contract-manage.contract-change.messages.saveSuccess",
	deleteSuccess: "property-manage_contract-manage.contract-change.messages.deleteSuccess",
} as const;

const statusTextMap = computed(() => ({
	待审核: transformI18n($t("property-manage_contract-manage.contract-change.form.options.statuses.pending")),
	审核中: transformI18n($t("property-manage_contract-manage.contract-change.form.options.statuses.reviewing")),
	已通过: transformI18n($t("property-manage_contract-manage.contract-change.form.options.statuses.approved")),
	已拒绝: transformI18n($t("property-manage_contract-manage.contract-change.form.options.statuses.rejected")),
	已撤回: transformI18n($t("property-manage_contract-manage.contract-change.form.options.statuses.withdrawn")),
}));

function translateStatusLabel(value?: string | null) {
	if (!value) return "";
	return statusTextMap.value[value] ?? value;
}

const translatedContractTypeOptions = computed(() => contractTypeOptions);

/**
 * 表格搜索栏双向绑定的变量原始数据
 * @description
 * 为了满足搜索栏组件的校验需求，这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ChangeQueryParams> = {
	contractName: "",
	contractNumber: "",
	contractType: undefined,
	partyA: "",
	partyB: "",
};

/** 表格搜索栏重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量，双向绑定的变量，响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.fields.contractName")),
		prop: "contractName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.fields.contractNumber")),
		prop: "contractNumber",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.fields.contractType")),
		prop: "contractType",
		valueType: "select",
		options: translatedContractTypeOptions.value,
	},
]);

/** 表格搜索栏组件配置 */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 使用 TanStack Query 获取数据 */
const {
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useChangeListQuery(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 搜索处理函数 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-change.fields.contractName")),
		),
		prop: "contractName",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-change.fields.contractNumber")),
		),
		prop: "contractNumber",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-change.fields.contractType")),
		),
		prop: "contractType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-change.fields.partyA")),
		),
		prop: "partyA",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-change.fields.partyB")),
		),
		prop: "partyB",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-change.fields.changeType")),
		),
		prop: "changeType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-change.fields.changer")),
		),
		prop: "changer",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-change.fields.applyTime")),
		),
		prop: "applyTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-change.fields.description")),
		),
		prop: "description",
		width: 200,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-change.fields.status")),
		),
		prop: "status",
		width: 100,
		cellRenderer: ({ row }) => translateStatusLabel(row.status),
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
	title: transformI18n($t("property-manage_contract-manage.contract-change.tableTitle")),
	columns: columns.value,
}));

/** 表单组件实例引用 */
const contractChangeFormInstance = ref<InstanceType<typeof ContractChangeForm> | null>(null);

/** 模式相关状态管理 */
const { modeText, setMode, isInfo } = useMode();

/** 快速新增时的默认变更类型 */
const quickCreateChangeTypeMap = {
	subject: "合同主体",
	period: "服务期限",
	asset: "服务内容",
} as const;

/**
 * 统一拆包 JsonVO 响应。
 * @description
 * 合同变更页面同时兼容直接业务数据和 `JsonVO<T>` 包装结构，这里负责收敛成纯数据对象。
 */
function unwrapJsonVO<T>(response: T | JsonVO<T>) {
	if (response && typeof response === "object" && "data" in response) {
		return (response as JsonVO<T>).data;
	}

	return response as T;
}

/**
 * 归一化既有附件草稿。
 * @description
 * 列表行或详情接口返回的附件需要进入表单层继续参与增删改，这里统一转换成附件草稿结构。
 */
function normalizeAttachmentDrafts(row?: ChangeFormRow) {
	if (!Array.isArray(row?.attachments)) {
		return [];
	}

	return row.attachments.map((item) => createExistingChangeAttachmentDraft(item as AttachmentDetailItem));
}

/**
 * 构造合同变更表单初始值。
 * @description
 * 根据当前弹窗模式合并默认值、详情数据和附件草稿，确保新增态与编辑态共用同一套表单结构。
 */
function buildFormData({
	mode,
	row,
	initialChangeType,
}: {
	mode: Mode;
	row?: ChangeFormRow;
	initialChangeType?: ContractChangeFormVO["changeType"];
}) {
	const detailRow = row as Partial<ContractChangeDetailVO> | undefined;
	const attachments = normalizeAttachmentDrafts(row);

	if (mode === "add") {
		return cloneDeep({
			...defaultForm,
			changeType: initialChangeType ?? defaultForm.changeType,
			attachments,
		}) as ContractChangeFormVO & { id?: string };
	}

	return cloneDeep({
		...defaultForm,
		id: detailRow?.id || "",
		contractName: row?.contractName || "",
		contractNumber: row?.contractNumber || "",
		contractType: row?.contractType || "",
		partyA: detailRow?.partyA || row?.partyA || "",
		partyAContact: detailRow?.partyAContact || "",
		partyAPhone: detailRow?.partyAPhone || "",
		partyB: detailRow?.partyB || row?.partyB || "",
		partyBContact: detailRow?.partyBContact || "",
		partyBPhone: detailRow?.partyBPhone || "",
		handler: detailRow?.handler || row?.changer || "",
		handlerPhone: detailRow?.handlerPhone || "",
		contractAmount: detailRow?.contractAmount || "",
		startTime: detailRow?.startTime || "",
		endTime: detailRow?.endTime || "",
		signingTime: detailRow?.signingTime || "",
		changeType: detailRow?.changeType || row?.changeType || initialChangeType || defaultForm.changeType,
		changer: detailRow?.changer || row?.changer || "",
		description: detailRow?.description || row?.description || "",
		beforeChange: detailRow?.beforeChange || "",
		afterChange: detailRow?.afterChange || "",
		attachments,
	}) as ContractChangeFormVO & { id?: string };
}

/**
 * 拉取合同变更详情。
 * @description
 * 详情接口返回 `JsonVO` 时，先在页面层拆包，再交给表单弹窗和详情查看逻辑复用。
 */
async function fetchChangeDetail(id: string) {
	const response = await getChangeDetail({ id });
	return unwrapJsonVO<ContractChangeDetailVO>(response);
}

/** 打开弹框函数 */
/**
 * 打开合同变更弹窗。
 * @description
 * 负责新增、编辑、详情三种模式下的详情拉取、表单初始化、弹窗装配和最终提交调用。
 */
async function openDialog({
	mode,
	row,
	initialChangeType,
}: {
	mode: Mode;
	row?: ChangeFormRow;
	initialChangeType?: ContractChangeFormVO["changeType"];
}) {
	setMode(mode);

	const detailRow = row?.id && mode !== "add" ? await fetchChangeDetail(row.id).catch(() => null) : null;

	/** 业务对象 */
	const formData = buildFormData({
		mode,
		row: (detailRow ?? row) as ChangeFormRow | undefined,
		initialChangeType,
	});

	/** 表单组件需要的 props */
	const formProps: ContractChangeFormProps = {
		form: formData as ContractChangeFormVO & { id?: string },
		defaultValues: formData as ContractChangeFormVO & { id?: string },
		mode,
	};

	const defaultValues = formProps.defaultValues;

	addDialog({
		title: () => `${modeText.value}${transformI18n($t("property-manage_contract-manage.contract-change.pageTitle"))}`,
		props: formProps,
		contentRenderer: () =>
			h(ContractChangeForm, {
				ref: contractChangeFormInstance,
				...formProps,
				mode,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = contractChangeFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = contractChangeFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			...(isInfo.value
				? []
				: [
						{
							label: () => transformI18n($t("common.buttons.reset")),
							type: "warning" as const,
							btnClick: () => {
								/** 手动重置表单 */
								contractChangeFormInstance.value?.plusFormInstance?.handleReset();
							},
						},
						{
							label: () => transformI18n($t("common.buttons.submit")),
							type: "success" as const,
							btnClick: async ({ dialog: { options, index }, button }) => {
								/** 提交表单时，校验 */
								const result = await contractChangeFormInstance.value?.plusFormInstance?.handleSubmit();
								if (!result) {
									return;
								}

								const payload = contractChangeFormInstance.value?.collectSubmitPayload?.();
								if (!payload) {
									return;
								}

								button.btn.loading = true;

								try {
									if (mode === "add") {
										await createChange(payload as ChangeCreatePayload);
									} else {
										await updateChange(payload as ChangeUpdatePayload);
									}

									ElMessage.success(transformI18n($t(changePageMessageKeys.saveSuccess)));
									closeDialog(options, index);
									await doFetch();
								} finally {
									button.btn.loading = false;
								}
							},
						},
					]),
		],
	});
}

function handleOpenAdd(initialChangeType?: ContractChangeFormVO["changeType"]) {
	void openDialog({ mode: "add", initialChangeType });
}

function handleOpenEdit(row: ChangeFormRow) {
	void openDialog({ mode: "edit", row });
}

function handleOpenInfo(row: ChangeFormRow) {
	void openDialog({ mode: "info", row });
}

/**
 * 删除合同变更记录。
 * @description
 * 页面层负责执行删除确认、调用删除接口，并在成功后同步刷新列表与提示消息。
 */
async function handleDelete(row: ChangeFormRow) {
	try {
		await ElMessageBox.confirm(
			transformI18n($t(changePageMessageKeys.deleteConfirmMessage)),
			transformI18n($t(changePageMessageKeys.deleteConfirmTitle)),
			{
				type: "warning",
				confirmButtonText: transformI18n($t(changePageMessageKeys.deleteConfirmButton)),
				cancelButtonText: transformI18n($t("common.buttons.cancel")),
			},
		);
	} catch {
		return;
	}

	await deleteChange({ ids: [row.id ?? ""] });
	ElMessage.success(transformI18n($t(changePageMessageKeys.deleteSuccess)));
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
				<ElButton type="primary" @click="handleOpenAdd(quickCreateChangeTypeMap.subject)">
					{{ transformI18n($t("property-manage_contract-manage.contract-change.subjectChange")) }}
				</ElButton>
				<ElButton type="primary" @click="handleOpenAdd(quickCreateChangeTypeMap.period)">
					{{ transformI18n($t("property-manage_contract-manage.contract-change.termadjustment")) }}
				</ElButton>
				<ElButton type="primary" @click="handleOpenAdd(quickCreateChangeTypeMap.asset)">
					{{ transformI18n($t("property-manage_contract-manage.contract-change.assetchange")) }}
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
						<ElButton type="info" @click="handleOpenInfo(row)">
							{{ transformI18n($t("property-manage_contract-manage.contract-change.details")) }}
						</ElButton>
						<ElButton type="warning" @click="handleOpenEdit(row)">
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
