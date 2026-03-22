<script lang="ts" setup>
definePage({
	meta: {
		// 小区信息
		title: "operation-team_data-manage.community-information.pageTitle",
		icon: "mdi:home-city",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.dataManage.communityInformation"),
	},
});

import { h, ref, computed } from "vue";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useMode, type Mode } from "@/composables/use-mode";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import {
	communityInformationStatusOptions,
	communitySearchOptions,
	type CommunityInformationFormVO,
	type CommunityInfoListItem,
	type CommunityInfoQueryParams,
} from "@01s-11comm/type";
import { useCommunityInfoListQuery } from "@/api/operation-team/data-manage/community-information";
import { type CommunityInformationFormProps, defaultForm } from "./components/form";
import CommunityInformationForm from "./components/form.vue";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const plusSearchModelRef: FieldValues & Partial<CommunityInfoQueryParams> = {
	communityId: "",
	communityName: "",
	province: "",
	city: "",
	district: "",
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
} = useCommunityInfoListQuery(plusSearchDefaultValues);

const provinceLabelMap = {
	北京市: $t("operation-team_data-manage.community-information.options.provinces.beijing"),
	上海市: $t("operation-team_data-manage.community-information.options.provinces.shanghai"),
	广州市: $t("operation-team_data-manage.community-information.options.provinces.guangzhou"),
	深圳市: $t("operation-team_data-manage.community-information.options.provinces.shenzhen"),
	杭州市: $t("operation-team_data-manage.community-information.options.provinces.hangzhou"),
} as const;

const cityLabelMap = {
	北京市: $t("operation-team_data-manage.community-information.options.cities.beijing"),
	上海市: $t("operation-team_data-manage.community-information.options.cities.shanghai"),
	广州市: $t("operation-team_data-manage.community-information.options.cities.guangzhou"),
	深圳市: $t("operation-team_data-manage.community-information.options.cities.shenzhen"),
	杭州市: $t("operation-team_data-manage.community-information.options.cities.hangzhou"),
	南京市: $t("operation-team_data-manage.community-information.options.cities.nanjing"),
	武汉市: $t("operation-team_data-manage.community-information.options.cities.wuhan"),
	成都市: $t("operation-team_data-manage.community-information.options.cities.chengdu"),
} as const;

const districtLabelMap = {
	朝阳区: $t("operation-team_data-manage.community-information.options.districts.chaoyang"),
	海淀区: $t("operation-team_data-manage.community-information.options.districts.haidian"),
	东城区: $t("operation-team_data-manage.community-information.options.districts.dongcheng"),
	西城区: $t("operation-team_data-manage.community-information.options.districts.xicheng"),
	丰台区: $t("operation-team_data-manage.community-information.options.districts.fengtai"),
} as const;

const statusLabelMap = {
	正常: $t("operation-team_data-manage.community-information.options.statuses.normal"),
	停用: $t("operation-team_data-manage.community-information.options.statuses.disabled"),
	筹建中: $t("operation-team_data-manage.community-information.options.statuses.preparing"),
	已交付: $t("operation-team_data-manage.community-information.options.statuses.delivered"),
	enabled: $t("operation-team_data-manage.community-information.options.statuses.enabled"),
	disabled: $t("operation-team_data-manage.community-information.options.statuses.disabled"),
} as const;

function translateProvinceLabel(value?: string | null) {
	if (!value) {
		return value ?? "";
	}
	const key = provinceLabelMap[value as keyof typeof provinceLabelMap];
	return key ? transformI18n(key) : value;
}

function translateCityLabel(value?: string | null) {
	if (!value) {
		return value ?? "";
	}
	const key = cityLabelMap[value as keyof typeof cityLabelMap];
	return key ? transformI18n(key) : value;
}

function translateDistrictLabel(value?: string | null) {
	if (!value) {
		return value ?? "";
	}
	const key = districtLabelMap[value as keyof typeof districtLabelMap];
	return key ? transformI18n(key) : value;
}

function translateStatusLabel(value?: string | null) {
	if (!value) {
		return value ?? "";
	}
	const key = statusLabelMap[value as keyof typeof statusLabelMap];
	return key ? transformI18n(key) : value;
}

const translatedProvinceOptions = computed(() =>
	communitySearchOptions.provinces.map((item) => ({
		...item,
		label: translateProvinceLabel(String(item.value)),
	})),
);

const translatedCityOptions = computed(() =>
	communitySearchOptions.cities.map((item) => ({
		...item,
		label: translateCityLabel(String(item.value)),
	})),
);

const translatedDistrictOptions = computed(() =>
	communitySearchOptions.districts.map((item) => ({
		...item,
		label: translateDistrictLabel(String(item.value)),
	})),
);

const translatedStatusOptions = computed(() =>
	communityInformationStatusOptions.map((item) => ({
		...item,
		label: translateStatusLabel(String(item.value)),
	})),
);

const columns = computed<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_data-manage.community-information.fields.communityId")),
		),
		prop: "communityId",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_data-manage.community-information.fields.communityName")),
		),
		prop: "communityName",
		minWidth: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_data-manage.community-information.fields.propertyCompany")),
		),
		prop: "propertyCompany",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_data-manage.community-information.fields.nearbyLandmark")),
		),
		prop: "nearbyLandmark",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_data-manage.community-information.fields.province")),
		),
		prop: "province",
		width: 100,
		cellRenderer: ({ row }) => translateProvinceLabel(row.province),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_data-manage.community-information.fields.city")),
		),
		prop: "city",
		width: 100,
		cellRenderer: ({ row }) => translateCityLabel(row.city),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_data-manage.community-information.fields.district")),
		),
		prop: "district",
		width: 100,
		cellRenderer: ({ row }) => translateDistrictLabel(row.district),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_data-manage.community-information.fields.contactPhone")),
		),
		prop: "contactPhone",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_data-manage.community-information.fields.administrator")),
		),
		prop: "administrator",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_data-manage.community-information.fields.status")),
		),
		prop: "status",
		width: 100,
		cellRenderer: ({ row }) => translateStatusLabel(row.status),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_data-manage.community-information.fields.createTime")),
		),
		prop: "createTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("operation-team_data-manage.community-information.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("operation-team_data-manage.community-information.fields.communityId")),
		prop: "communityId",
		valueType: "input",
	},
	{
		label: transformI18n($t("operation-team_data-manage.community-information.fields.communityName")),
		prop: "communityName",
		valueType: "input",
	},
	{
		label: transformI18n($t("operation-team_data-manage.community-information.fields.province")),
		prop: "province",
		valueType: "select",
		options: translatedProvinceOptions.value,
	},
	{
		label: transformI18n($t("operation-team_data-manage.community-information.fields.city")),
		prop: "city",
		valueType: "select",
		options: translatedCityOptions.value,
	},
	{
		label: transformI18n($t("operation-team_data-manage.community-information.fields.district")),
		prop: "district",
		valueType: "select",
		options: translatedDistrictOptions.value,
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

const { setMode, isAdd, isEdit, isInfo } = useMode();
const communityInformationFormInstance = ref<InstanceType<typeof CommunityInformationForm> | null>(null);
const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	await sleep(1300);
	setIsLoadingT(false);
}

function openDialog(params: { mode: Mode; row?: CommunityInfoListItem }) {
	const { mode, row } = params;
	setMode(mode);

	const formVO: CommunityInformationFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value || isInfo.value
			? cloneDeep({
					...defaultForm,
					communityId: row?.communityId || "",
					communityName: row?.communityName || "",
					propertyCompany: row?.propertyCompany || "",
					nearbyLandmark: row?.nearbyLandmark || "",
					cityCode: row?.cityCode || "",
					communityCode: row?.communityCode || "",
					status: String(row?.status || translatedStatusOptions.value[0]?.value || ""),
					province: row?.province || "",
					city: row?.city || "",
					district: row?.district || "",
					detailedAddress: row?.detailedAddress || row?.address || "",
					contactPhone: row?.contactPhone || "",
					administrator: row?.administrator || "",
					region: row?.region || "",
					address: row?.address || "",
					landArea: row?.landArea || 0,
					buildingArea: row?.buildingArea || 0,
					buildingCount: row?.buildingCount || 0,
					unitCount: row?.unitCount || 0,
					houseCount: row?.houseCount || 0,
					parkingCount: row?.parkingCount || 0,
					greenRate: row?.greenRate || 0,
					plotRatio: row?.plotRatio || 0,
					developer: row?.developer || "",
					establishedTime: row?.establishedTime || "",
				})
			: cloneDeep(defaultForm);

	const formProps: CommunityInformationFormProps = {
		form: formVO,
		defaultValues: formVO,
		mode,
	};
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("operation-team_data-manage.community-information.dialogs.addTitle"))
				: isEdit.value
					? transformI18n($t("operation-team_data-manage.community-information.dialogs.editTitle"))
					: transformI18n($t("operation-team_data-manage.community-information.dialogs.infoTitle")),
		props: formProps,
		contentRenderer: () =>
			h(CommunityInformationForm, {
				ref: communityInformationFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = communityInformationFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = communityInformationFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					communityInformationFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await communityInformationFormInstance.value?.plusFormInstance?.handleSubmit();
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
					:loading="isFetching"
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
