<script lang="ts" setup>
definePage({
	meta: {
		// 楼栋结构图
		title: "propertyManage_communityManage.building-space-structure-diagram.pageTitle",
		icon: "mdi:domain",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.communityManage.buildingSpaceStructureDiagram"),
	},
});

import { h, ref } from "vue";
import { ElMessageBox } from "element-plus";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { $t, i18n, transformI18n } from "@/plugins/i18n";
import { useBuildingSpaceStructureDiagramListQuery } from "@/api/property-manage/community-manage/building-space-structure-diagram";
import type { BuildingSpaceStructureDiagramFormProps } from "./components/form";
import { defaultForm } from "./components/form";
import type {
	BuildingSpaceStructureDiagramFormVO,
	BuildingSpaceStructureDiagramListItem,
	BuildingSpaceStructureDiagramQueryParams,
} from "@01s-11comm/type";
import BuildingSpaceStructureDiagramForm from "./components/form.vue";

const { locale, withLocale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const plusSearchModelRef: FieldValues & Partial<BuildingSpaceStructureDiagramQueryParams> = {
	buildingId: "",
	buildingName: "",
	buildingStructure: "",
	status: "",
	constructionYear: "",
};

const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

const {
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useBuildingSpaceStructureDiagramListQuery(plusSearchDefaultValues);

const buildingSpaceStructureDiagramFormInstance = ref<InstanceType<typeof BuildingSpaceStructureDiagramForm> | null>(
	null,
);
const { setMode, isAdd, isEdit } = useMode();
const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	await sleep(1300);
	setIsLoadingT(false);
}

const buildingStructureLabelKeyMap = {
	钢筋混凝土结构:
		"propertyManage_communityManage.building-space-structure-diagram.options.structure.reinforcedConcrete",
	钢结构: "propertyManage_communityManage.building-space-structure-diagram.options.structure.steel",
	砖混结构: "propertyManage_communityManage.building-space-structure-diagram.options.structure.brickConcrete",
	框架结构: "propertyManage_communityManage.building-space-structure-diagram.options.structure.frame",
	剪力墙结构: "propertyManage_communityManage.building-space-structure-diagram.options.structure.shearWall",
} as const;

const buildingStatusLabelKeyMap = {
	正常使用: "propertyManage_communityManage.building-space-structure-diagram.options.status.normal",
	装修中: "propertyManage_communityManage.building-space-structure-diagram.options.status.renovating",
	维修中: "propertyManage_communityManage.building-space-structure-diagram.options.status.repairing",
	待验收: "propertyManage_communityManage.building-space-structure-diagram.options.status.pendingAcceptance",
	已停用: "propertyManage_communityManage.building-space-structure-diagram.options.status.disabled",
} as const;

function translateOptionLabel<T extends Record<string, string>>(value: string | undefined | null, labelMap: T) {
	if (!value) {
		return value ?? "";
	}

	const key = labelMap[value as keyof T];
	return key ? transformI18n($t(key)) : value;
}

const buildingStructureOptions = withLocale(() =>
	Object.entries(buildingStructureLabelKeyMap).map(([value, key]) => ({
		label: transformI18n($t(key)),
		value,
	})),
);

const buildingStatusOptions = withLocale(() =>
	Object.entries(buildingStatusLabelKeyMap).map(([value, key]) => ({
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
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.buildingId")),
		),
		prop: "buildingId",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.buildingName")),
		),
		prop: "buildingName",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.totalFloors")),
		),
		prop: "totalFloors",
		minWidth: 110,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.totalHouseholds")),
		),
		prop: "totalHouseholds",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.buildingArea")),
		),
		prop: "buildingArea",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.buildingStructure")),
		),
		prop: "buildingStructure",
		minWidth: 150,
		cellRenderer: ({ row }) => translateOptionLabel(row.buildingStructure, buildingStructureLabelKeyMap),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.constructionYear")),
		),
		prop: "constructionYear",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.status")),
		),
		prop: "status",
		minWidth: 120,
		cellRenderer: ({ row }) => translateOptionLabel(row.status, buildingStatusLabelKeyMap),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.lastUpdateTime")),
		),
		prop: "lastUpdateTime",
		minWidth: 170,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.personInCharge")),
		),
		prop: "personInCharge",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.contactPhone")),
		),
		prop: "contactPhone",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 300,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("propertyManage_communityManage.building-space-structure-diagram.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.buildingId")),
		prop: "buildingId",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.placeholders.buildingId"),
			),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.buildingName")),
		prop: "buildingName",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.placeholders.buildingName"),
			),
		},
	},
	{
		label: transformI18n(
			$t("propertyManage_communityManage.building-space-structure-diagram.fields.buildingStructure"),
		),
		prop: "buildingStructure",
		valueType: "select",
		options: buildingStructureOptions.value,
		fieldProps: {
			placeholder: transformI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.placeholders.buildingStructure"),
			),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.status")),
		prop: "status",
		valueType: "select",
		options: buildingStatusOptions.value,
		fieldProps: {
			placeholder: transformI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.placeholders.status"),
			),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.constructionYear")),
		prop: "constructionYear",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.placeholders.constructionYear"),
			),
		},
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

function openDialog({ mode, row }: { mode: Mode; row?: BuildingSpaceStructureDiagramListItem }) {
	setMode(mode);

	const formVO: BuildingSpaceStructureDiagramFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				buildingId: row?.buildingId || "",
				buildingName: row?.buildingName || "",
				totalFloors: row?.totalFloors || 0,
				totalHouseholds: row?.totalHouseholds || 0,
				buildingArea: row?.buildingArea || 0,
				buildingStructure: row?.buildingStructure || "",
				constructionYear: row?.constructionYear || "",
				drawingPath: row?.drawingPath || "",
				status: row?.status || "正常使用",
				personInCharge: row?.personInCharge || "",
				contactPhone: row?.contactPhone || "",
				remarks: row?.remarks || "",
			});

	const props: BuildingSpaceStructureDiagramFormProps = {
		form: formVO,
		defaultValues: formVO,
		mode,
	};

	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("propertyManage_communityManage.building-space-structure-diagram.dialogs.addTitle"))
				: transformI18n($t("propertyManage_communityManage.building-space-structure-diagram.dialogs.editTitle")),
		props,
		contentRenderer: () =>
			h(BuildingSpaceStructureDiagramForm, {
				ref: buildingSpaceStructureDiagramFormInstance,
				...props,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = buildingSpaceStructureDiagramFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = buildingSpaceStructureDiagramFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					buildingSpaceStructureDiagramFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await buildingSpaceStructureDiagramFormInstance.value?.plusFormInstance?.handleSubmit();
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

async function handleDelete(row: BuildingSpaceStructureDiagramListItem) {
	try {
		await ElMessageBox.confirm(
			i18n.global.t($t("propertyManage_communityManage.building-space-structure-diagram.dialogs.confirmDelete"), {
				buildingId: row.buildingId,
				buildingName: row.buildingName,
			}),
			transformI18n($t("propertyManage_communityManage.building-space-structure-diagram.dialogs.deleteTitle")),
			{
				confirmButtonText: transformI18n($t("common.buttons.del")),
				cancelButtonText: transformI18n($t("common.buttons.cancel")),
				type: "warning",
			},
		);

		await doFetch();
	} catch {}
}

function viewDrawing(row: BuildingSpaceStructureDiagramListItem) {
	console.log("view drawing", row.drawingPath);
}

function downloadDrawing(row: BuildingSpaceStructureDiagramListItem) {
	console.log("download drawing", row.drawingPath);
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
						<ElButton type="info" @click="viewDrawing(row)">
							{{
								transformI18n($t("propertyManage_communityManage.building-space-structure-diagram.buttons.viewDrawing"))
							}}
						</ElButton>
						<ElButton type="info" @click="downloadDrawing(row)">
							{{
								transformI18n(
									$t("propertyManage_communityManage.building-space-structure-diagram.buttons.downloadDrawing"),
								)
							}}
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
