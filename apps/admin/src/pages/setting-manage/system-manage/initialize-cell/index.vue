<script lang="ts" setup>
definePage({
	meta: {
		// 初始化小区
		title: "settingManage.systemManage.initializeCell.pageTitle",
		icon: "mdi:home-import-outline",
		roles: ["开发团队"],
		rank: getRouteRank("settingManage.systemManage.initializeCell"),
	},
});

import { h, ref } from "vue";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { type FormatFormProps, defaultForm as formatDefaultForm } from "./components/format-form";
import FormatForm from "./components/format-form.vue";
import { type InitializeCommunityFormProps, defaultForm } from "./components/form";
import InitializeCellForm from "./components/form.vue";
import type {
	InitializeCommunityFormVO,
	InitializeCommunityListItem,
	InitializeCommunityQueryParams,
} from "@01s-11comm/type";
import { useInitializeCommunityListQuery } from "@/api/setting-manage/system-manage/initialize-cell";

const { locale, withLocale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

function translateFromRecord(record: Record<string, string>, value?: string | null) {
	if (!value) {
		return "";
	}
	return record[value] ?? value;
}

const initItemTextMap = withLocale(() => ({
	初始化楼栋: transformI18n($t("settingManage.systemManage.initializeCell.options.items.building")),
	初始化房屋: transformI18n($t("settingManage.systemManage.initializeCell.options.items.house")),
	初始化车位: transformI18n($t("settingManage.systemManage.initializeCell.options.items.parking")),
}));

const initStatusTextMap = withLocale(() => ({
	已完成: transformI18n($t("settingManage.systemManage.initializeCell.options.statuses.completed")),
	初始化中: transformI18n($t("settingManage.systemManage.initializeCell.options.statuses.inProgress")),
	待初始化: transformI18n($t("settingManage.systemManage.initializeCell.options.statuses.pending")),
}));

function translateInitItemLabel(value?: string | null) {
	return translateFromRecord(initItemTextMap.value, value);
}

function translateInitStatusLabel(value?: string | null) {
	return translateFromRecord(initStatusTextMap.value, value);
}

const translatedInitItemOptions = withLocale(() => [
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.options.items.building")),
		value: "初始化楼栋",
	},
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.options.items.house")),
		value: "初始化房屋",
	},
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.options.items.parking")),
		value: "初始化车位",
	},
]);

const translatedInitStatusOptions = withLocale(() => [
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.options.statuses.pending")),
		value: "待初始化",
	},
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.options.statuses.inProgress")),
		value: "初始化中",
	},
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.options.statuses.completed")),
		value: "已完成",
	},
]);

const initializeCellFormInstance = ref<InstanceType<typeof InitializeCellForm> | null>(null);
const formatFormInstance = ref<InstanceType<typeof FormatForm> | null>(null);

const plusSearchModelRef: FieldValues & Partial<InitializeCommunityQueryParams> = {
	initItem: "",
	initStatus: "",
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
} = useInitializeCommunityListQuery(plusSearchDefaultValues);

const columns = withLocale<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.systemManage.initializeCell.fields.initItem"))),
		prop: "initItem",
		minWidth: 150,
		cellRenderer: ({ row }) => translateInitItemLabel(row.initItem),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.systemManage.initializeCell.fields.initStatus"))),
		prop: "initStatus",
		width: 120,
		cellRenderer: ({ row }) => translateInitStatusLabel(row.initStatus),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.systemManage.initializeCell.fields.configParams"))),
		prop: "configParams",
		minWidth: 220,
		cellRenderer: ({ row }) => JSON.stringify(row.configParams ?? {}),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 210,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("settingManage.systemManage.initializeCell.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.fields.initItem")),
		prop: "initItem",
		valueType: "select",
		options: translatedInitItemOptions.value,
	},
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.fields.initStatus")),
		prop: "initStatus",
		valueType: "select",
		options: translatedInitStatusOptions.value,
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
const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

function openDialog(params: { mode: Mode; row?: InitializeCommunityListItem }) {
	const { mode, row } = params;
	setMode(mode);

	const configParams = (row?.configParams as Record<string, unknown> | undefined) ?? {};
	const formVO = structuredClone({
		...defaultForm,
		initItem: row?.initItem || "",
		initStatus: row?.initStatus || "",
		configParams: row?.configParams ?? {},
		communityId: String(configParams.communityId ?? ""),
		communityName: String(configParams.communityName ?? ""),
		nearbyLandmark: String(configParams.nearbyLandmark ?? ""),
		cityCode: String(configParams.cityCode ?? ""),
		status: String(configParams.status ?? "启用"),
	}) as InitializeCommunityFormVO;

	const addFormVO = structuredClone({
		...defaultForm,
		communityId: "",
		communityName: "",
		nearbyLandmark: "",
		cityCode: "",
		status: "启用",
	}) as InitializeCommunityFormVO;

	const resolvedForm = isAdd.value ? addFormVO : formVO;
	const formProps: InitializeCommunityFormProps = {
		form: resolvedForm,
		defaultValues: structuredClone(resolvedForm),
	};

	const title = isAdd.value
		? () => transformI18n($t("settingManage.systemManage.initializeCell.dialogs.addTitle"))
		: isEdit.value
			? () => transformI18n($t("settingManage.systemManage.initializeCell.dialogs.editTitle"))
			: () => transformI18n($t("settingManage.systemManage.initializeCell.dialogs.infoTitle"));

	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		width: "600px",
		contentRenderer: () =>
			h(InitializeCellForm, {
				ref: initializeCellFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = initializeCellFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = initializeCellFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					initializeCellFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await initializeCellFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						await doFetch();
						consola.success(transformI18n($t("settingManage.systemManage.initializeCell.messages.operateSuccess")));
					}
				},
			},
		],
	});
}

function openFormatDialog(row: InitializeCommunityListItem) {
	const formProps: FormatFormProps = {
		form: structuredClone(formatDefaultForm),
		defaultValues: structuredClone(formatDefaultForm),
		initItem: row.initItem,
		initStatus: row.initStatus || "",
	};

	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () => transformI18n($t("settingManage.systemManage.initializeCell.dialogs.formatTitle")),
		props: formProps,
		width: "500px",
		contentRenderer: () =>
			h(FormatForm, {
				ref: formatFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = formatFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("settingManage.systemManage.initializeCell.buttons.mistake")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = formatFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("settingManage.systemManage.initializeCell.buttons.confirmFormat")),
				type: "danger",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await formatFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						consola.success(transformI18n($t("settingManage.systemManage.initializeCell.messages.formatSuccess")));
					}
				},
			},
		],
	});
}

function handleFormat(row: InitializeCommunityListItem) {
	openFormatDialog(row);
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
				<!-- @vue-ignore -->
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
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("settingManage.systemManage.initializeCell.buttons.view")) }}
						</ElButton>
						<ElButton type="info" @click="handleFormat(row)">
							{{ transformI18n($t("settingManage.systemManage.initializeCell.buttons.format")) }}
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
