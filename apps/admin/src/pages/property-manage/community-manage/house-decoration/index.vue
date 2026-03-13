<script lang="ts" setup>
definePage({
	meta: {
		// 房屋装修
		title: "propertyManage_communityManage.house-decoration.pageTitle",
		icon: "mdi:hammer",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.communityManage.houseDecoration"),
	},
});

import { h, ref } from "vue";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { $t, transformI18n } from "@/plugins/i18n";
import { useHouseDecorationListQuery } from "@/api/property-manage/community-manage/house-decoration";
import { defaultForm, type HouseDecorationFormProps } from "./components/form";
import type {
	HouseDecorationFormVO,
	HouseDecorationListItem,
	HouseDecorationQueryParams,
	HouseDecorationStatusType,
	IsDelayedType,
	IsViolatedType,
} from "@01s-11comm/type";
import HouseDecorationForm from "./components/form.vue";

const { locale, withLocale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const plusSearchModelRef: FieldValues & Partial<HouseDecorationQueryParams> = {
	houseNumber: "",
	contactName: "",
	contactPhone: "",
	status: undefined,
	isDelayed: undefined,
	decorationTime: "",
	applicationStartTime: "",
	applicationEndTime: "",
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
} = useHouseDecorationListQuery(plusSearchDefaultValues);

const houseDecorationFormInstance = ref<InstanceType<typeof HouseDecorationForm> | null>(null);
const { gotoDetailPage } = useGotoDetailsPage();
const { setMode, isAdd, isEdit } = useMode();
const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	await sleep(1300);
	setIsLoadingT(false);
}

const statusLabelKeyMap = {
	待审核: "propertyManage_communityManage.house-decoration.options.status.pending",
	审核不通过: "propertyManage_communityManage.house-decoration.options.status.rejected",
	装修中: "propertyManage_communityManage.house-decoration.options.status.inProgress",
	待验收: "propertyManage_communityManage.house-decoration.options.status.pendingAcceptance",
	验收成功: "propertyManage_communityManage.house-decoration.options.status.accepted",
	验收失败: "propertyManage_communityManage.house-decoration.options.status.failed",
} as const;

const booleanLabelKeyMap = {
	是: "propertyManage_communityManage.house-decoration.options.boolean.yes",
	否: "propertyManage_communityManage.house-decoration.options.boolean.no",
} as const;

function translateStatusLabel(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = statusLabelKeyMap[value as keyof typeof statusLabelKeyMap];
	return key ? transformI18n($t(key)) : value;
}

function translateBooleanLabel(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = booleanLabelKeyMap[value as keyof typeof booleanLabelKeyMap];
	return key ? transformI18n($t(key)) : value;
}

const decorationStatusOptions = withLocale(() =>
	Object.entries(statusLabelKeyMap).map(([value, key]) => ({
		label: transformI18n($t(key)),
		value,
	})),
);

const delayStatusOptions = withLocale(() =>
	Object.entries(booleanLabelKeyMap).map(([value, key]) => ({
		label: transformI18n($t(key)),
		value,
	})),
);

const columns = withLocale<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.house-decoration.fields.houseNumber"))),
		prop: "houseNumber",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.house-decoration.fields.contactName"))),
		prop: "contactName",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.house-decoration.fields.contactPhone"))),
		prop: "contactPhone",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.house-decoration.fields.decorationTime"))),
		prop: "decorationTime",
		minWidth: 170,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.house-decoration.fields.applicationTime"))),
		prop: "applicationTime",
		minWidth: 170,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.house-decoration.fields.decorationCompany"))),
		prop: "decorationCompany",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.house-decoration.fields.managerPhone"))),
		prop: "managerPhone",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.house-decoration.fields.status"))),
		prop: "status",
		minWidth: 120,
		cellRenderer: ({ row }) => translateStatusLabel(row.status),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.house-decoration.fields.isDelayed"))),
		prop: "isDelayed",
		minWidth: 120,
		cellRenderer: ({ row }) => translateBooleanLabel(row.isDelayed),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.house-decoration.fields.delayTime"))),
		prop: "delayTime",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.house-decoration.fields.isViolated"))),
		prop: "isViolated",
		minWidth: 120,
		cellRenderer: ({ row }) => translateBooleanLabel(row.isViolated),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.house-decoration.fields.violationDescription"))),
		prop: "violationDescription",
		minWidth: 200,
		showOverflowTooltip: true,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.house-decoration.fields.remarks"))),
		prop: "remarks",
		minWidth: 180,
		showOverflowTooltip: true,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 320,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("propertyManage_communityManage.house-decoration.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.fields.houseNumber")),
		prop: "houseNumber",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.house-decoration.form.placeholders.houseNumber")),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.fields.contactName")),
		prop: "contactName",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.house-decoration.form.placeholders.contactName")),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.fields.contactPhone")),
		prop: "contactPhone",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.house-decoration.form.placeholders.contactPhone")),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.fields.status")),
		prop: "status",
		valueType: "select",
		options: decorationStatusOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.house-decoration.form.placeholders.status")),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.fields.isDelayed")),
		prop: "isDelayed",
		valueType: "select",
		options: delayStatusOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.house-decoration.form.placeholders.isDelayed")),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.fields.decorationTime")),
		prop: "decorationTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
			placeholder: transformI18n($t("propertyManage_communityManage.house-decoration.form.placeholders.decorationTime")),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.fields.applicationTimeRange")),
		prop: "applicationStartTime",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
			startPlaceholder: transformI18n($t("propertyManage_communityManage.house-decoration.form.placeholders.applicationStartTime")),
			endPlaceholder: transformI18n($t("propertyManage_communityManage.house-decoration.form.placeholders.applicationEndTime")),
			onChange(value: string[] | null) {
				plusSearchModel.value.applicationStartTime = value?.[0] ?? "";
				plusSearchModel.value.applicationEndTime = value?.[1] ?? "";
			},
			onClear() {
				plusSearchModel.value.applicationStartTime = "";
				plusSearchModel.value.applicationEndTime = "";
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

function openDialog({ mode, row }: { mode: Mode; row?: HouseDecorationListItem }) {
	setMode(mode);

	const formVO: HouseDecorationFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				houseNumber: row?.houseNumber || "",
				contactName: row?.contactName || "",
				contactPhone: row?.contactPhone || "",
				decorationTime: row?.decorationTime || "",
				applicationTime: row?.applicationTime || "",
				decorationCompany: row?.decorationCompany || "",
				managerPhone: row?.managerPhone || "",
				status: (row?.status as HouseDecorationStatusType) || "待审核",
				isDelayed: (row?.isDelayed as IsDelayedType) || "否",
				delayTime: row?.delayTime || "",
				isViolated: (row?.isViolated as IsViolatedType) || "否",
				violationDescription: row?.violationDescription || "",
				remarks: row?.remarks || "",
			});

	const props: HouseDecorationFormProps = {
		form: formVO,
		defaultValues: formVO,
		mode,
	};

	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () => {
			if (isAdd.value) {
				return transformI18n($t("propertyManage_communityManage.house-decoration.dialogs.addTitle"));
			}

			if (isEdit.value) {
				return transformI18n($t("propertyManage_communityManage.house-decoration.dialogs.editTitle"));
			}

			return transformI18n($t("propertyManage_communityManage.house-decoration.dialogs.infoTitle"));
		},
		props,
		contentRenderer: () =>
			h(HouseDecorationForm, {
				ref: houseDecorationFormInstance,
				...props,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = houseDecorationFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = houseDecorationFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					houseDecorationFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await houseDecorationFormInstance.value?.plusFormInstance?.handleSubmit();
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

function gotoHouseDecorationPage(row: HouseDecorationListItem) {
	gotoDetailPage({
		name: "property-manage-community-manage--detail-page-house-decoration-[id]",
		params: {
			id: row.houseNumber,
		},
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
				<!-- @vue-ignore 忽略 treeProps 所需要的 checkStrictly 类型 -->
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					:loading="isFetching"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="info">
							{{ transformI18n($t("propertyManage_communityManage.house-decoration.buttons.decorationDone")) }}
						</ElButton>
						<ElButton type="info" @click="gotoHouseDecorationPage(row)">
							{{ transformI18n($t("propertyManage_communityManage.house-decoration.buttons.trackingRecord")) }}
						</ElButton>
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger">
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
