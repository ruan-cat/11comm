<script lang="ts" setup>
definePage({
	meta: {
		// 物业公司
		title: "operation-team_data-manage.property-management-company.pageTitle",
		icon: "mdi:office-building",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.dataManage.propertyManagementCompany"),
	},
});

import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { h, ref } from "vue";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { $t, transformI18n } from "@/plugins/i18n";
import { useGotoDetailsPage } from "@/composables/use-goto-details-page";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import type {
	PropertyCompanyListItem,
	PropertyCompanyQueryParams,
	PropertyManagementCompanyFormVO,
} from "@01s-11comm/type";
import { usePropertyCompanyListQuery } from "@/api/operation-team/data-manage/property-company";
import { type PropertyManagementCompanyFormProps, defaultForm } from "./components/form";
import PropertyManagementCompanyForm from "./components/form.vue";

const { locale, withLocale, createHeaderRenderer, searchProps } = useI18nConfig();

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

const plusSearchModelRef: FieldValues & Partial<PropertyCompanyQueryParams> = {
	companyId: "",
	companyName: "",
	phone: "",
};

const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

const {
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
	pureTableProps,
} = usePropertyCompanyListQuery(plusSearchDefaultValues);

const companyTypeLabelMap = {
	state_owned: "operation-team_data-manage.property-management-company.options.companyTypes.stateOwned",
	private: "operation-team_data-manage.property-management-company.options.companyTypes.private",
} as const;

const serviceLevelLabelMap = {
	level_1: "operation-team_data-manage.property-management-company.options.serviceLevels.level1",
	level_2: "operation-team_data-manage.property-management-company.options.serviceLevels.level2",
	level_3: "operation-team_data-manage.property-management-company.options.serviceLevels.level3",
} as const;

const operationStatusLabelMap = {
	operating: "operation-team_data-manage.property-management-company.options.operationStatuses.operating",
	suspended: "operation-team_data-manage.property-management-company.options.operationStatuses.suspended",
	cancelled: "operation-team_data-manage.property-management-company.options.operationStatuses.cancelled",
} as const;

function translateCompanyTypeLabel(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = companyTypeLabelMap[value as keyof typeof companyTypeLabelMap];
	return key ? renderI18n($t(key)) : value;
}

function translateServiceLevelLabel(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = serviceLevelLabelMap[value as keyof typeof serviceLevelLabelMap];
	return key ? renderI18n($t(key)) : value;
}

function translateOperationStatusLabel(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = operationStatusLabelMap[value as keyof typeof operationStatusLabelMap];
	return key ? renderI18n($t(key)) : value;
}

const propertyManagementCompanyFormInstance = ref<InstanceType<typeof PropertyManagementCompanyForm> | null>(null);

const columns = withLocale<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("operation-team_data-manage.property-management-company.fields.companyId")),
		),
		prop: "companyId",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("operation-team_data-manage.property-management-company.fields.companyName")),
		),
		prop: "companyName",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("operation-team_data-manage.property-management-company.fields.address")),
		),
		prop: "address",
		minWidth: 250,
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("operation-team_data-manage.property-management-company.fields.administrator")),
		),
		prop: "administrator",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("operation-team_data-manage.property-management-company.fields.phone")),
		),
		prop: "phone",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("operation-team_data-manage.property-management-company.fields.legalRepresentative")),
		),
		prop: "legalRepresentative",
		width: 110,
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("operation-team_data-manage.property-management-company.fields.establishmentDate")),
		),
		prop: "establishmentDate",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("operation-team_data-manage.property-management-company.fields.landmark")),
		),
		prop: "landmark",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("operation-team_data-manage.property-management-company.fields.communityCount")),
		),
		prop: "communityCount",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("operation-team_data-manage.property-management-company.fields.companyType")),
		),
		prop: "companyType",
		width: 100,
		cellRenderer: ({ row }) => translateCompanyTypeLabel(row.companyType),
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("operation-team_data-manage.property-management-company.fields.serviceLevel")),
		),
		prop: "serviceLevel",
		width: 100,
		cellRenderer: ({ row }) => translateServiceLevelLabel(row.serviceLevel),
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("operation-team_data-manage.property-management-company.fields.operationStatus")),
		),
		prop: "operationStatus",
		width: 110,
		cellRenderer: ({ row }) => translateOperationStatusLabel(row.operationStatus),
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("operation-team_data-manage.property-management-company.fields.createTime")),
		),
		prop: "createTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("common.table.operation"))),
		width: 390,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: renderI18n($t("operation-team_data-manage.property-management-company.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n($t("operation-team_data-manage.property-management-company.fields.companyId")),
		prop: "companyId",
		valueType: "input",
		fieldProps: {
			placeholder: renderI18n($t("operation-team_data-manage.property-management-company.fields.companyId")),
		},
	},
	{
		label: renderI18n($t("operation-team_data-manage.property-management-company.fields.companyName")),
		prop: "companyName",
		valueType: "input",
		fieldProps: {
			placeholder: renderI18n($t("operation-team_data-manage.property-management-company.fields.companyName")),
		},
	},
	{
		label: renderI18n($t("operation-team_data-manage.property-management-company.fields.phone")),
		prop: "phone",
		valueType: "input",
		fieldProps: {
			placeholder: renderI18n($t("operation-team_data-manage.property-management-company.fields.phone")),
		},
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues, {
	searchText: renderI18n($t("common.buttons.search")),
	resetText: renderI18n($t("common.buttons.reset")),
});

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

const { setMode, isAdd, isEdit } = useMode();
const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	await sleep(1300);
	setIsLoadingT(false);
}

function openDialog(params: { mode: Mode; row?: PropertyCompanyListItem }) {
	const { mode, row } = params;
	setMode(mode);

	const formVO: PropertyManagementCompanyFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					code: row?.companyId || "",
					name: row?.companyName || "",
					address: row?.address || "",
					phone: row?.phone || "",
					administrator: row?.administrator || "",
					legalRepresentative: row?.legalRepresentative || "",
					establishmentDate: row?.establishmentDate || "",
					landmark: row?.landmark || "",
					communityCount: row?.communityCount || 0,
					companyType: row?.companyType || "",
					serviceLevel: row?.serviceLevel || "",
					operationStatus: row?.operationStatus || "",
					remarks: row?.remarks || "",
				})
			: cloneDeep(defaultForm);

	const props: PropertyManagementCompanyFormProps = {
		form: formVO,
		defaultValues: formVO,
		mode,
	};

	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? renderI18n($t("operation-team_data-manage.property-management-company.dialogs.addTitle"))
				: renderI18n($t("operation-team_data-manage.property-management-company.dialogs.editTitle")),
		props,
		contentRenderer: () =>
			h(PropertyManagementCompanyForm, {
				ref: propertyManagementCompanyFormInstance,
				...props,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = propertyManagementCompanyFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => renderI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = propertyManagementCompanyFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => renderI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					propertyManagementCompanyFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => renderI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await propertyManagementCompanyFormInstance.value?.plusFormInstance?.handleSubmit();
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

const { gotoDetailPage } = useGotoDetailsPage();

function gotoManageCommunityPage(row: PropertyCompanyListItem) {
	gotoDetailPage({
		name: "operation-team-data-manage--detail-page-manage-community-[id]",
		params: {
			id: row.companyId,
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
				<!-- @vue-ignore -->
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:loading="isFetching"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger">
							{{ transformI18n($t("common.buttons.del")) }}
						</ElButton>
						<ElButton type="info" @click="gotoManageCommunityPage(row)">
							{{ transformI18n($t("operation-team_data-manage.property-management-company.manageCommunity")) }}
						</ElButton>
						<ElButton type="info">
							{{ transformI18n($t("common.buttons.pureLogin")) }}
						</ElButton>
						<ElButton type="info">
							{{ transformI18n($t("operation-team_data-manage.property-management-company.limitLogin")) }}
						</ElButton>
						<ElButton type="info">
							{{ transformI18n($t("common.buttons.resetPassword")) }}
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
