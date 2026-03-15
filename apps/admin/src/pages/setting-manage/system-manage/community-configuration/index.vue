<script lang="ts" setup>
definePage({
	meta: {
		// 小区配置
		title: "settingManage.systemManage.communityConfiguration.pageTitle",
		icon: "mdi:cog",
		roles: ["物业团队"],
		rank: getRouteRank("settingManage.systemManage.communityConfiguration"),
	},
});

import { computed, h, ref } from "vue";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import type {
	CommunityConfiguration,
	CommunityConfigurationListQuery,
	SettingCommunityConfigFormVO,
} from "@01s-11comm/type";
import { communityConfigStatusOptions, settingTypeOptions } from "@01s-11comm/type";
import { useCommunityConfigurationListQuery } from "@/api/setting-manage/system-manage/community-configuration";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { type CommunityConfigurationFormProps, defaultForm } from "./components/form";
import CommunityConfigurationForm from "./components/form.vue";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

function translateFromRecord(record: Record<string, string>, value?: string | null) {
	if (!value) {
		return "";
	}
	return record[value] ?? value;
}

const settingTypeTextMap = computed(() => ({
	系统设置: transformI18n($t("settingManage.systemManage.communityConfiguration.options.settingTypes.system")),
	业务设置: transformI18n($t("settingManage.systemManage.communityConfiguration.options.settingTypes.business")),
	界面设置: transformI18n($t("settingManage.systemManage.communityConfiguration.options.settingTypes.ui")),
	功能设置: transformI18n($t("settingManage.systemManage.communityConfiguration.options.settingTypes.feature")),
	安全设置: transformI18n($t("settingManage.systemManage.communityConfiguration.options.settingTypes.security")),
}));

const statusTextMap = computed(() => ({
	启用: transformI18n($t("settingManage.systemManage.communityConfiguration.options.statuses.enabled")),
	禁用: transformI18n($t("settingManage.systemManage.communityConfiguration.options.statuses.disabled")),
	待审核: transformI18n($t("settingManage.systemManage.communityConfiguration.options.statuses.pending")),
}));

function translateSettingTypeLabel(value?: string | null) {
	return translateFromRecord(settingTypeTextMap.value, value);
}

function translateCommunityStatusLabel(value?: string | null) {
	return translateFromRecord(statusTextMap.value, value);
}

const translatedSettingTypeOptions = computed(() =>
	settingTypeOptions.map((item) => ({
		...item,
		label: translateSettingTypeLabel(String(item.value)),
	})),
);

const translatedCommunityStatusOptions = computed(() =>
	communityConfigStatusOptions.map((item) => ({
		...item,
		label: translateCommunityStatusLabel(String(item.label)),
	})),
);

const plusSearchModelRef: FieldValues & Partial<CommunityConfigurationListQuery> = {
	communityName: "",
	settingName: "",
	settingType: "",
	statusCd: "",
};

const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useCommunityConfigurationListQuery(plusSearchDefaultValues);

const columns = computed<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.communityConfiguration.fields.communityName")),
		),
		prop: "communityName",
		width: 150,
		fixed: true,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.communityConfiguration.fields.settingName")),
		),
		prop: "settingName",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.communityConfiguration.fields.settingValue")),
		),
		prop: "settingValue",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.communityConfiguration.fields.settingType")),
		),
		prop: "settingType",
		width: 120,
		cellRenderer: ({ row }) => translateSettingTypeLabel(row.settingType),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.communityConfiguration.fields.status")),
		),
		prop: "statusText",
		width: 100,
		cellRenderer: ({ row }) => translateCommunityStatusLabel(row.statusText),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.communityConfiguration.fields.remark")),
		),
		prop: "remark",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.communityConfiguration.fields.createTime")),
		),
		prop: "createTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.communityConfiguration.fields.updateTime")),
		),
		prop: "updateTime",
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
	title: transformI18n($t("settingManage.systemManage.communityConfiguration.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("settingManage.systemManage.communityConfiguration.fields.communityName")),
		prop: "communityName",
		valueType: "input",
	},
	{
		label: transformI18n($t("settingManage.systemManage.communityConfiguration.fields.settingName")),
		prop: "settingName",
		valueType: "input",
	},
	{
		label: transformI18n($t("settingManage.systemManage.communityConfiguration.fields.settingType")),
		prop: "settingType",
		valueType: "select",
		options: translatedSettingTypeOptions.value,
	},
	{
		label: transformI18n($t("settingManage.systemManage.communityConfiguration.fields.dataStatus")),
		prop: "statusCd",
		valueType: "select",
		options: translatedCommunityStatusOptions.value,
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

const { setMode, isAdd, isEdit, isInfo } = useMode();
const communityConfigurationFormInstance = ref<InstanceType<typeof CommunityConfigurationForm> | null>(null);
const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

const defaultAddDialogParams = {
	width: "50%",
	draggable: true,
	fullscreenIcon: true,
	closeOnClickModal: false,
	contentRenderer: () => h("div"),
};

function openDialog(params: { mode: Mode; row?: CommunityConfiguration }) {
	const { mode, row } = params;
	setMode(mode);

	const formVO: SettingCommunityConfigFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value || isInfo.value
			? structuredClone({
					...defaultForm,
					csId: row?.csId || "",
					communityId: row?.communityId || "",
					communityName: row?.communityName || "",
					settingName: row?.settingName || "",
					settingValue: row?.settingValue || "",
					settingType: row?.settingType || "",
					statusCd: row?.statusCd || "0",
					remark: row?.remark || "",
				})
			: structuredClone(defaultForm);

	const formProps: CommunityConfigurationFormProps = {
		form: formVO,
		defaultValues: formVO,
	};

	const title = isAdd.value
		? () => transformI18n($t("settingManage.systemManage.communityConfiguration.dialogs.addTitle"))
		: isEdit.value
			? () => transformI18n($t("settingManage.systemManage.communityConfiguration.dialogs.editTitle"))
			: () => transformI18n($t("settingManage.systemManage.communityConfiguration.dialogs.infoTitle"));

	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(CommunityConfigurationForm, {
				ref: communityConfigurationFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = communityConfigurationFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = communityConfigurationFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					communityConfigurationFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await communityConfigurationFormInstance.value?.plusFormInstance?.handleSubmit();
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
