<script lang="ts" setup>
definePage({
	meta: {
		// 初始化单元格
		title: "operationTeam.systemManage.initializeCell.pageTitle",
		icon: "mdi:home-import-outline",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.systemManage.initializeCell"),
	},
});

import { h, ref } from "vue";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import type {
	CellStatus,
	CellType,
	InitializeCellFormVO,
	InitializeCellListItem,
	InitializeCellQueryParams,
} from "@01s-11comm/type";
import { cellTypeOptions, initializeCellStatusOptions } from "@01s-11comm/type";
import { useInitializeCellListQuery } from "@/api/operation-team/system-manage/initialize-cell";
import { type InitializeCellFormProps, defaultForm } from "./components/form";
import InitializeCellForm from "./components/form.vue";

const { locale, withLocale, createHeaderRenderer, searchProps } = useI18nConfig();

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

function translateFromRecord(record: Record<string, string>, value?: string | null) {
	if (!value) {
		return "";
	}
	return record[value] ?? value;
}

const cellTypeTextMap = withLocale(() => ({
	住宅单元: renderI18n($t("operationTeam.systemManage.initializeCell.options.cellTypes.residential")),
	商业单元: renderI18n($t("operationTeam.systemManage.initializeCell.options.cellTypes.commercial")),
	车库单元: renderI18n($t("operationTeam.systemManage.initializeCell.options.cellTypes.garage")),
	办公单元: renderI18n($t("operationTeam.systemManage.initializeCell.options.cellTypes.office")),
	会所单元: renderI18n($t("operationTeam.systemManage.initializeCell.options.cellTypes.club")),
	物业单元: renderI18n($t("operationTeam.systemManage.initializeCell.options.cellTypes.property")),
	运动单元: renderI18n($t("operationTeam.systemManage.initializeCell.options.cellTypes.sports")),
	教育单元: renderI18n($t("operationTeam.systemManage.initializeCell.options.cellTypes.education")),
	医疗单元: renderI18n($t("operationTeam.systemManage.initializeCell.options.cellTypes.medical")),
	仓储单元: renderI18n($t("operationTeam.systemManage.initializeCell.options.cellTypes.storage")),
	文化单元: renderI18n($t("operationTeam.systemManage.initializeCell.options.cellTypes.culture")),
}));

const statusTextMap = withLocale(() => ({
	待初始化: renderI18n($t("operationTeam.systemManage.initializeCell.options.statuses.pending")),
	初始化中: renderI18n($t("operationTeam.systemManage.initializeCell.options.statuses.inProgress")),
	已完成: renderI18n($t("operationTeam.systemManage.initializeCell.options.statuses.completed")),
	初始化失败: renderI18n($t("operationTeam.systemManage.initializeCell.options.statuses.failed")),
}));

const cellTypeValueMap = {
	住宅单元: "ResidentialUnit",
	商业单元: "CommercialUnit",
	车库单元: "GarageUnit",
	办公单元: "OfficeUnit",
	会所单元: "ClubUnit",
	物业单元: "PropertyUnit",
	运动单元: "SportsUnit",
	教育单元: "EducationUnit",
	医疗单元: "MedicalUnit",
	仓储单元: "StorageUnit",
	文化单元: "CultureUnit",
} as const satisfies Record<string, CellType>;

const statusValueMap = {
	待初始化: "Uninitialized",
	未初始化: "Uninitialized",
	初始化中: "Initializing",
	已完成: "Initialized",
	已初始化: "Initialized",
	初始化失败: "InitializationFailed",
} as const satisfies Record<string, CellStatus>;

function translateCellTypeLabel(value?: string | null) {
	return translateFromRecord(cellTypeTextMap.value, value);
}

function translateStatusLabel(value?: string | null) {
	return translateFromRecord(statusTextMap.value, value);
}

function normalizeCellTypeValue(value?: string): CellType {
	const mapped = value ? cellTypeValueMap[value as keyof typeof cellTypeValueMap] : undefined;
	return mapped ?? "ResidentialUnit";
}

function normalizeStatusValue(value?: string): CellStatus {
	const mapped = value ? statusValueMap[value as keyof typeof statusValueMap] : undefined;
	return mapped ?? "Uninitialized";
}

const translatedSearchCellTypeOptions = withLocale(() =>
	cellTypeOptions.map((item) => ({
		...item,
		label: translateCellTypeLabel(String(item.value)),
	})),
);

const translatedSearchStatusOptions = withLocale(() =>
	initializeCellStatusOptions.map((item) => ({
		...item,
		label: translateStatusLabel(String(item.value)),
	})),
);

const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

const initializeCellFormInstance = ref<InstanceType<typeof InitializeCellForm> | null>(null);

const plusSearchModelRef: FieldValues & Partial<InitializeCellQueryParams> = {
	cellName: "",
	cellType: undefined,
	buildingName: "",
	status: undefined,
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
} = useInitializeCellListQuery(plusSearchDefaultValues);

const { setMode, isAdd, isEdit, isInfo } = useMode();

const columns = withLocale<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.initializeCell.fields.cellId"))),
		prop: "cellId",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.initializeCell.fields.cellName"))),
		prop: "cellName",
		minWidth: 160,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.initializeCell.fields.cellType"))),
		prop: "cellType",
		width: 120,
		cellRenderer: ({ row }) => translateCellTypeLabel(row.cellType),
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.initializeCell.fields.buildingName"))),
		prop: "buildingName",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.initializeCell.fields.floor"))),
		prop: "floor",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.initializeCell.fields.unitNumber"))),
		prop: "unitNumber",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.initializeCell.fields.households"))),
		prop: "houseCount",
		width: 80,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.initializeCell.fields.status"))),
		prop: "status",
		width: 100,
		cellRenderer: ({ row }) => translateStatusLabel(row.status),
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.initializeCell.fields.description"))),
		prop: "description",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.initializeCell.fields.createTime"))),
		prop: "createTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.initializeCell.fields.updateTime"))),
		prop: "updateTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: renderI18n($t("operationTeam.systemManage.initializeCell.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n($t("operationTeam.systemManage.initializeCell.fields.cellName")),
		prop: "cellName",
		valueType: "input",
	},
	{
		label: renderI18n($t("operationTeam.systemManage.initializeCell.fields.cellType")),
		prop: "cellType",
		valueType: "select",
		options: translatedSearchCellTypeOptions.value,
	},
	{
		label: renderI18n($t("operationTeam.systemManage.initializeCell.fields.buildingName")),
		prop: "buildingName",
		valueType: "input",
	},
	{
		label: renderI18n($t("operationTeam.systemManage.initializeCell.fields.status")),
		prop: "status",
		valueType: "select",
		options: translatedSearchStatusOptions.value,
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

function openDialog(params: { mode: Mode; row?: InitializeCellListItem }) {
	const { mode, row } = params;
	setMode(mode);

	const formVO: InitializeCellFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value || isInfo.value
			? structuredClone({
					...defaultForm,
					cellName: row?.cellName || "",
					cellType: normalizeCellTypeValue(row?.cellType),
					buildingId: row?.buildingId || "",
					buildingName: row?.buildingName || "",
					floor: row?.floor ? String(row.floor) : "",
					unitNumber: row?.unitNumber || "",
					households: row?.houseCount || 0,
					status: normalizeStatusValue(row?.status),
					description: row?.description || "",
				})
			: structuredClone(defaultForm);

	const formProps: InitializeCellFormProps = {
		form: formVO,
		defaultValues: formVO,
	};

	const defaultValues = formProps.defaultValues;

	const title = isAdd.value
		? () => renderI18n($t("operationTeam.systemManage.initializeCell.dialogs.addTitle"))
		: isEdit.value
			? () => renderI18n($t("operationTeam.systemManage.initializeCell.dialogs.editTitle"))
			: () => renderI18n($t("operationTeam.systemManage.initializeCell.dialogs.infoTitle"));

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
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
				label: () => renderI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = initializeCellFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => renderI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					initializeCellFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => renderI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await initializeCellFormInstance.value?.plusFormInstance?.handleSubmit();
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

async function handleDelete(row: InitializeCellListItem) {
	try {
		consola.log("删除初始化单元格:", row.cellId);
		await sleep(1000);
		doFetch();
	} catch (error) {
		console.error("删除失败:", error);
	}
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
