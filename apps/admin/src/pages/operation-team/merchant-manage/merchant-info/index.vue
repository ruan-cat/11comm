<script lang="ts" setup>
definePage({
	meta: {
		// 商户信息
		title: "operation-team_merchant-manage.merchant-info.pageTitle",
		icon: "mdi:storefront",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.merchantManage.merchantInfo"),
	},
});

import { h, ref, computed } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { ElMessage, ElMessageBox } from "element-plus";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { useMode, type Mode } from "@/composables/use-mode";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, i18n, transformI18n } from "@/plugins/i18n";
import {
	businessStatusOptions,
	merchantTypeOptions,
	type BusinessStatus,
	type MerchantInfoFormVO,
	type MerchantInfoListItem,
	type MerchantInfoQueryParams,
	type MerchantType,
} from "@01s-11comm/type";
import { useMerchantInfoListQuery } from "@/api/operation-team/merchant-manage/merchant-info";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { defaultForm, type MerchantInfoFormProps } from "./components/form";
import MerchantInfoForm from "./components/form.vue";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const merchantInfoFormInstance = ref<InstanceType<typeof MerchantInfoForm> | null>(null);

const plusSearchModelRef: FieldValues & Partial<MerchantInfoQueryParams> = {
	merchantName: "",
	merchantType: undefined,
	contactPhone: "",
	businessStatus: undefined,
	affiliatedCommunity: "",
};

const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

const {
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
	pureTableProps,
} = useMerchantInfoListQuery(plusSearchDefaultValues);

const merchantTypeLabelKeyMap = {
	餐饮服务: $t("operation-team_merchant-manage.merchant-info.options.merchantType.cateringService"),
	零售商店: $t("operation-team_merchant-manage.merchant-info.options.merchantType.retailStore"),
	生活服务: $t("operation-team_merchant-manage.merchant-info.options.merchantType.lifeService"),
	休闲娱乐: $t("operation-team_merchant-manage.merchant-info.options.merchantType.leisureEntertainment"),
	教育培训: $t("operation-team_merchant-manage.merchant-info.options.merchantType.educationTraining"),
	医疗健康: $t("operation-team_merchant-manage.merchant-info.options.merchantType.medicalHealth"),
	其他: $t("operation-team_merchant-manage.merchant-info.options.merchantType.other"),
	cateringService: $t("operation-team_merchant-manage.merchant-info.options.merchantType.cateringService"),
	retailStore: $t("operation-team_merchant-manage.merchant-info.options.merchantType.retailStore"),
	lifeService: $t("operation-team_merchant-manage.merchant-info.options.merchantType.lifeService"),
	leisureEntertainment: $t("operation-team_merchant-manage.merchant-info.options.merchantType.leisureEntertainment"),
	educationTraining: $t("operation-team_merchant-manage.merchant-info.options.merchantType.educationTraining"),
	medicalHealth: $t("operation-team_merchant-manage.merchant-info.options.merchantType.medicalHealth"),
	other: $t("operation-team_merchant-manage.merchant-info.options.merchantType.other"),
} as const;

const businessStatusLabelKeyMap = {
	正常营业: $t("operation-team_merchant-manage.merchant-info.options.businessStatus.normalOperation"),
	暂停营业: $t("operation-team_merchant-manage.merchant-info.options.businessStatus.suspendedOperation"),
	准备开业: $t("operation-team_merchant-manage.merchant-info.options.businessStatus.preparingToOpen"),
	已停业: $t("operation-team_merchant-manage.merchant-info.options.businessStatus.closed"),
	normalOperation: $t("operation-team_merchant-manage.merchant-info.options.businessStatus.normalOperation"),
	suspendedOperation: $t("operation-team_merchant-manage.merchant-info.options.businessStatus.suspendedOperation"),
	preparingToOpen: $t("operation-team_merchant-manage.merchant-info.options.businessStatus.preparingToOpen"),
	closed: $t("operation-team_merchant-manage.merchant-info.options.businessStatus.closed"),
} as const;

function translateMerchantType(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = merchantTypeLabelKeyMap[value as keyof typeof merchantTypeLabelKeyMap];
	return key ? transformI18n(key) : value;
}

function translateBusinessStatus(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = businessStatusLabelKeyMap[value as keyof typeof businessStatusLabelKeyMap];
	return key ? transformI18n(key) : value;
}

const translatedMerchantTypeOptions = computed(() =>
	merchantTypeOptions.map((option) => ({
		...option,
		label: translateMerchantType(String(option.value)),
	})),
);

const translatedBusinessStatusOptions = computed(() =>
	businessStatusOptions.map((option) => ({
		...option,
		label: translateBusinessStatus(String(option.value)),
	})),
);

const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_merchant-manage.merchant-info.fields.merchantId")),
		),
		prop: "merchantId",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_merchant-manage.merchant-info.fields.merchantName")),
		),
		prop: "merchantName",
		minWidth: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_merchant-manage.merchant-info.fields.merchantAddress")),
		),
		prop: "merchantAddress",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_merchant-manage.merchant-info.fields.contactPhone")),
		),
		prop: "contactPhone",
		width: 130,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_merchant-manage.merchant-info.fields.merchantType")),
		),
		prop: "merchantType",
		width: 100,
		cellRenderer: ({ row }) => translateMerchantType(row.merchantType),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_merchant-manage.merchant-info.fields.legalRepresentative")),
		),
		prop: "legalRepresentative",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_merchant-manage.merchant-info.fields.establishmentDate")),
		),
		prop: "establishmentDate",
		width: 110,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_merchant-manage.merchant-info.fields.businessStatus")),
		),
		prop: "businessStatus",
		width: 100,
		cellRenderer: ({ row }) => translateBusinessStatus(row.businessStatus),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_merchant-manage.merchant-info.fields.affiliatedCommunity")),
		),
		prop: "affiliatedCommunity",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_merchant-manage.merchant-info.fields.businessHours")),
		),
		prop: "businessHours",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_merchant-manage.merchant-info.fields.businessArea")),
		),
		prop: "businessArea",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_merchant-manage.merchant-info.fields.createTime")),
		),
		prop: "createTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 260,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("operation-team_merchant-manage.merchant-info.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.fields.merchantName")),
		prop: "merchantName",
		valueType: "input",
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.fields.merchantType")),
		prop: "merchantType",
		valueType: "select",
		options: translatedMerchantTypeOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-info.form.placeholders.merchantType")),
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.fields.contactPhone")),
		prop: "contactPhone",
		valueType: "input",
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.fields.businessStatus")),
		prop: "businessStatus",
		valueType: "select",
		options: translatedBusinessStatusOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-info.form.placeholders.businessStatus")),
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.fields.affiliatedCommunity")),
		prop: "affiliatedCommunity",
		valueType: "input",
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	});
}

const { setMode, isAdd, isEdit, isInfo } = useMode();
const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	await sleep(1300);
	setIsLoadingT(false);
}

function openDialog(params: { mode: Mode; row?: MerchantInfoListItem }) {
	const { mode, row } = params;
	setMode(mode);

	const formVO: MerchantInfoFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				merchantId: row?.merchantId || "",
				merchantName: row?.merchantName || "",
				merchantAddress: row?.merchantAddress || "",
				contactPhone: row?.contactPhone || "",
				merchantType: (row?.merchantType || "餐饮服务") as MerchantType,
				legalRepresentative: row?.legalRepresentative || "",
				establishmentDate: row?.establishmentDate || "",
				businessStatus: (row?.businessStatus || "正常营业") as BusinessStatus,
				affiliatedCommunity: row?.affiliatedCommunity || "",
				businessHours: row?.businessHours || "",
				businessArea: row?.businessArea || "",
				businessLicenseNo: row?.businessLicenseNo || "",
				bankName: row?.bankName || "",
				bankAccount: row?.bankAccount || "",
				contactMobile: row?.contactMobile || "",
				remarks: row?.remarks || "",
			});

	const formProps: MerchantInfoFormProps = {
		form: formVO,
		defaultValues: cloneDeep(formVO),
		mode,
	};

	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () => {
			if (isAdd.value) {
				return transformI18n($t("operation-team_merchant-manage.merchant-info.dialogs.addTitle"));
			}

			if (isEdit.value) {
				return transformI18n($t("operation-team_merchant-manage.merchant-info.dialogs.editTitle"));
			}

			if (isInfo.value) {
				return transformI18n($t("operation-team_merchant-manage.merchant-info.dialogs.infoTitle"));
			}

			return transformI18n($t("operation-team_merchant-manage.merchant-info.dialogs.title"));
		},
		props: formProps,
		contentRenderer: () =>
			h(MerchantInfoForm, {
				ref: merchantInfoFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = merchantInfoFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = merchantInfoFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					merchantInfoFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await merchantInfoFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						doFetch();
					}
				},
			},
		],
	});
}

function handleAdd() {
	openDialog({ mode: "add" });
}

function handleEdit(row: MerchantInfoListItem) {
	openDialog({ mode: "edit", row });
}

function handleViewDetails(row: MerchantInfoListItem) {
	openDialog({ mode: "info", row });
}

async function handleDelete(row: MerchantInfoListItem) {
	try {
		await ElMessageBox.confirm(
			i18n.global.t($t("operation-team_merchant-manage.merchant-info.dialogs.confirmDelete"), {
				name: row.merchantName,
			}),
			transformI18n($t("operation-team_merchant-manage.common.dialogs.confirmTitle")),
			{
				confirmButtonText: transformI18n($t("common.buttons.pureConfirm")),
				cancelButtonText: transformI18n($t("common.buttons.cancel")),
				type: "warning",
			},
		);

		ElMessage.success(transformI18n($t("operation-team_merchant-manage.merchant-info.messages.deleted")));
		doFetch();
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
				<ElButton type="primary" @click="handleAdd">
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
						<ElButton type="warning" @click="handleEdit(row)">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info" @click="handleViewDetails(row)">
							{{ transformI18n($t("operation-team_merchant-manage.merchant-info.buttons.viewDetails")) }}
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
