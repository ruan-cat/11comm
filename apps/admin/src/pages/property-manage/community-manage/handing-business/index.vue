<script lang="ts" setup>
definePage({
	meta: {
		// 业务受理
		title: "propertyManage_communityManage.handing-business.pageTitle",
		icon: "mdi:briefcase",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.communityManage.handingBusiness"),
	},
});

import { h, ref } from "vue";
import { ElMessageBox, ElTag } from "element-plus";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { $t, i18n, transformI18n } from "@/plugins/i18n";
import { useHandingBusinessListQuery } from "@/api/property-manage/community-manage/handing-business";
import type { HandingBusinessFormProps } from "./components/form";
import { defaultForm } from "./components/form";
import type { HandingBusinessFormVO, HandingBusinessListItem, HandingBusinessQueryParams } from "@01s-11comm/type";
import { handingBusinessListDataToFormData as listDataToFormData } from "@01s-11comm/type";
import HandingBusinessForm from "./components/form.vue";

const { locale, withLocale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

const plusSearchModelRef: FieldValues &
	Partial<HandingBusinessQueryParams> & {
		accountCreationTimeRange?: string[];
	} = {
		feeItem: "",
		feeId: "",
		feeType: undefined,
		status: undefined,
		accountCreationStartTime: "",
		accountCreationEndTime: "",
	};

const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

const {
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useHandingBusinessListQuery(plusSearchDefaultValues);

const handingBusinessFormInstance = ref<InstanceType<typeof HandingBusinessForm> | null>(null);
const { setMode, isAdd, isEdit } = useMode();
const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	await sleep(1300);
	setIsLoadingT(false);
}

const feeTypeLabelKeyMap = {
	periodic: "propertyManage_communityManage.handing-business.options.feeType.periodic",
	temporary: "propertyManage_communityManage.handing-business.options.feeType.temporary",
	deposit: "propertyManage_communityManage.handing-business.options.feeType.deposit",
	penalty: "propertyManage_communityManage.handing-business.options.feeType.penalty",
} as const;

const statusLabelKeyMap = {
	pending: "propertyManage_communityManage.handing-business.options.status.pending",
	paid: "propertyManage_communityManage.handing-business.options.status.paid",
	overdue: "propertyManage_communityManage.handing-business.options.status.overdue",
	reduced: "propertyManage_communityManage.handing-business.options.status.reduced",
	voided: "propertyManage_communityManage.handing-business.options.status.voided",
} as const;

function translateOptionLabel<T extends Record<string, string>>(value: string | undefined | null, labelMap: T) {
	if (!value) {
		return value ?? "";
	}

	const key = labelMap[value as keyof T];
	return key ? renderI18n($t(key)) : value;
}

const feeTypeOptions = withLocale(() =>
	Object.entries(feeTypeLabelKeyMap).map(([value, key]) => ({
		label: renderI18n($t(key)),
		value,
	})),
);

const statusOptions = withLocale(() =>
	Object.entries(statusLabelKeyMap).map(([value, key]) => ({
		label: renderI18n($t(key)),
		value,
	})),
);

const columns = withLocale<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(renderI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("propertyManage_communityManage.handing-business.fields.feeItem"))),
		prop: "feeItem",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("propertyManage_communityManage.handing-business.fields.feeId"))),
		prop: "feeId",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("propertyManage_communityManage.handing-business.fields.feeType"))),
		prop: "feeType",
		minWidth: 130,
		cellRenderer: ({ row }) => translateOptionLabel(row.feeType, feeTypeLabelKeyMap),
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("propertyManage_communityManage.handing-business.fields.amountReceivable")),
		),
		prop: "amountReceivable",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("propertyManage_communityManage.handing-business.fields.accountCreationTime")),
		),
		prop: "accountCreationTime",
		minWidth: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("propertyManage_communityManage.handing-business.fields.receivablePeriod")),
		),
		prop: "receivablePeriod",
		minWidth: 160,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("propertyManage_communityManage.handing-business.fields.description"))),
		prop: "description",
		minWidth: 220,
		showOverflowTooltip: true,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("propertyManage_communityManage.handing-business.fields.status"))),
		prop: "status",
		minWidth: 120,
		cellRenderer: ({ row }) => {
			const statusTypeMap: Record<string, "warning" | "success" | "danger" | "info"> = {
				pending: "warning",
				paid: "success",
				overdue: "danger",
				reduced: "info",
				voided: "info",
			};

			return h(ElTag, { type: statusTypeMap[row.status] ?? "info" }, () =>
				translateOptionLabel(row.status, statusLabelKeyMap),
			);
		},
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("common.table.operation"))),
		width: 260,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: renderI18n($t("propertyManage_communityManage.handing-business.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n($t("propertyManage_communityManage.handing-business.fields.feeItem")),
		prop: "feeItem",
		valueType: "input",
		fieldProps: {
			placeholder: renderI18n($t("propertyManage_communityManage.handing-business.form.placeholders.feeItem")),
		},
	},
	{
		label: renderI18n($t("propertyManage_communityManage.handing-business.fields.feeId")),
		prop: "feeId",
		valueType: "input",
		fieldProps: {
			placeholder: renderI18n($t("propertyManage_communityManage.handing-business.form.placeholders.feeId")),
		},
	},
	{
		label: renderI18n($t("propertyManage_communityManage.handing-business.fields.feeType")),
		prop: "feeType",
		valueType: "select",
		options: feeTypeOptions.value,
		fieldProps: {
			placeholder: renderI18n($t("propertyManage_communityManage.handing-business.form.placeholders.feeType")),
		},
	},
	{
		label: renderI18n($t("propertyManage_communityManage.handing-business.fields.status")),
		prop: "status",
		valueType: "select",
		options: statusOptions.value,
		fieldProps: {
			placeholder: renderI18n($t("propertyManage_communityManage.handing-business.form.placeholders.status")),
		},
	},
	{
		label: renderI18n($t("propertyManage_communityManage.handing-business.fields.accountCreationTimeRange")),
		prop: "accountCreationTimeRange",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
			startPlaceholder: renderI18n(
				$t("propertyManage_communityManage.handing-business.form.placeholders.accountCreationStartTime"),
			),
			endPlaceholder: renderI18n(
				$t("propertyManage_communityManage.handing-business.form.placeholders.accountCreationEndTime"),
			),
			onChange(value: string[] | null) {
				plusSearchModel.value.accountCreationStartTime = value?.[0] ?? "";
				plusSearchModel.value.accountCreationEndTime = value?.[1] ?? "";
			},
			onClear() {
				plusSearchModel.value.accountCreationStartTime = "";
				plusSearchModel.value.accountCreationEndTime = "";
			},
		},
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	});
}

function openDialog({ mode, row }: { mode: Mode; row?: HandingBusinessListItem }) {
	setMode(mode);

	const formVO: HandingBusinessFormVO =
		isAdd.value || !row ? cloneDeep(defaultForm) : cloneDeep(listDataToFormData(row));

	const formProps: HandingBusinessFormProps = {
		form: formVO,
		defaultValues: formVO,
		mode,
	};

	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () => {
			if (isAdd.value) {
				return renderI18n($t("propertyManage_communityManage.handing-business.dialogs.addTitle"));
			}

			if (isEdit.value) {
				return renderI18n($t("propertyManage_communityManage.handing-business.dialogs.editTitle"));
			}

			return renderI18n($t("propertyManage_communityManage.handing-business.dialogs.infoTitle"));
		},
		props: formProps,
		contentRenderer: () =>
			h(HandingBusinessForm, {
				ref: handingBusinessFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = handingBusinessFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => renderI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = handingBusinessFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			...(mode === "info"
				? []
				: ([
						{
							label: () => renderI18n($t("common.buttons.reset")),
							type: "warning",
							btnClick: () => {
								handingBusinessFormInstance.value?.plusFormInstance?.handleReset();
							},
						},
						{
							label: () => renderI18n($t("common.buttons.submit")),
							type: "success",
							btnClick: async ({ dialog: { options, index }, button }) => {
								const res = await handingBusinessFormInstance.value?.plusFormInstance?.handleSubmit();
								if (res) {
									button.btn.loading = true;
									await testAsync();
									button.btn.loading = false;
									closeDialog(options, index);
									await doFetch();
								}
							},
						},
					] as any)),
		],
	});
}

async function handleDelete(row: HandingBusinessListItem) {
	try {
		await ElMessageBox.confirm(
			i18n.global.t($t("propertyManage_communityManage.handing-business.dialogs.confirmDelete"), {
				feeId: row.feeId,
				feeItem: row.feeItem,
			}),
			renderI18n($t("propertyManage_communityManage.handing-business.dialogs.deleteTitle")),
			{
				confirmButtonText: renderI18n($t("common.buttons.del")),
				cancelButtonText: renderI18n($t("common.buttons.cancel")),
				type: "warning",
			},
		);

		await doFetch();
	} catch {}
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
				<!-- @vue-ignore 忽略 treeProps 所需要的 checkStrictly 类型 -->
				<PureTable
					:="pureTableProps"
					:loading="isFetching"
					:columns="dynamicColumns"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.info")) }}
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
