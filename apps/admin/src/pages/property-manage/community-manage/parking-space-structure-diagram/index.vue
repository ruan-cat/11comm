<script lang="ts" setup>
definePage({
	meta: {
		// 车位结构图
		title: "propertyManage_communityManage.parking-space-structure-diagram.pageTitle",
		icon: "mdi:garage",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.communityManage.parkingSpaceStructureDiagram"),
	},
});

import { h, ref } from "vue";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { $t, transformI18n } from "@/plugins/i18n";
import { useParkingSpaceStructureDiagramListQuery } from "@/api/property-manage/community-manage/parking-space-structure-diagram";
import type { ParkingSpaceStructureDiagramFormProps } from "./components/form";
import { defaultForm } from "./components/form";
import type {
	ParkingSpaceStructureDiagramFormVO,
	ParkingSpaceStructureDiagramListItem,
	ParkingSpaceStructureDiagramQueryParams,
} from "@01s-11comm/type";
import ParkingSpaceStructureDiagramForm from "./components/form.vue";

const { locale, withLocale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

const plusSearchModelRef: FieldValues & Partial<ParkingSpaceStructureDiagramQueryParams> = {
	parkingSpaceNumber: "",
	parkingSpaceStatus: "",
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
} = useParkingSpaceStructureDiagramListQuery(plusSearchDefaultValues);

const parkingSpaceStructureDiagramFormInstance = ref<InstanceType<typeof ParkingSpaceStructureDiagramForm> | null>(null);
const { gotoDetailPage } = useGotoDetailsPage();
const { setMode, isAdd } = useMode();
const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	await sleep(1300);
	setIsLoadingT(false);
}

const parkingSpaceTypeLabelKeyMap = {
	地下车位: "propertyManage_communityManage.parking-space-structure-diagram.options.type.underground",
	地面车位: "propertyManage_communityManage.parking-space-structure-diagram.options.type.ground",
	子母车位: "propertyManage_communityManage.parking-space-structure-diagram.options.type.childMother",
	无障碍车位: "propertyManage_communityManage.parking-space-structure-diagram.options.type.accessible",
	机械车位: "propertyManage_communityManage.parking-space-structure-diagram.options.type.mechanical",
} as const;

const parkingSpaceStatusLabelKeyMap = {
	空闲: "propertyManage_communityManage.parking-space-structure-diagram.options.status.idle",
	已售: "propertyManage_communityManage.parking-space-structure-diagram.options.status.sold",
	已租: "propertyManage_communityManage.parking-space-structure-diagram.options.status.rented",
	维修中: "propertyManage_communityManage.parking-space-structure-diagram.options.status.maintaining",
	其他: "propertyManage_communityManage.parking-space-structure-diagram.options.status.other",
} as const;

const orientationLabelKeyMap = {
	靠墙: "propertyManage_communityManage.parking-space-structure-diagram.options.orientation.wall",
	中间: "propertyManage_communityManage.parking-space-structure-diagram.options.orientation.middle",
	靠柱: "propertyManage_communityManage.parking-space-structure-diagram.options.orientation.column",
	露天: "propertyManage_communityManage.parking-space-structure-diagram.options.orientation.outdoor",
	机械车位: "propertyManage_communityManage.parking-space-structure-diagram.options.orientation.mechanical",
} as const;

const floorAreaLabelKeyMap = {
	地下1层: "propertyManage_communityManage.parking-space-structure-diagram.options.floorArea.b1",
	地下2层: "propertyManage_communityManage.parking-space-structure-diagram.options.floorArea.b2",
	地下3层: "propertyManage_communityManage.parking-space-structure-diagram.options.floorArea.b3",
	地面层: "propertyManage_communityManage.parking-space-structure-diagram.options.floorArea.ground",
	架空层: "propertyManage_communityManage.parking-space-structure-diagram.options.floorArea.elevated",
} as const;

const booleanLabelKeyMap = {
	是: "propertyManage_communityManage.parking-space-structure-diagram.options.boolean.yes",
	否: "propertyManage_communityManage.parking-space-structure-diagram.options.boolean.no",
} as const;

function translateOptionLabel<T extends Record<string, string>>(value: string | undefined | null, labelMap: T) {
	if (!value) {
		return value ?? "";
	}

	const key = labelMap[value as keyof T];
	return key ? renderI18n($t(key)) : value;
}

const parkingSpaceStatusOptions = withLocale(() =>
	Object.entries(parkingSpaceStatusLabelKeyMap).map(([value, key]) => ({
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
		headerRenderer: createHeaderRenderer(
			renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.parkingSpaceNumber")),
		),
		prop: "parkingSpaceNumber",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.parkingSpaceType")),
		),
		prop: "parkingSpaceType",
		minWidth: 130,
		cellRenderer: ({ row }) => translateOptionLabel(row.parkingSpaceType, parkingSpaceTypeLabelKeyMap),
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.parkingSpaceLocation")),
		),
		prop: "parkingSpaceLocation",
		minWidth: 170,
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.parkingSpaceArea")),
		),
		prop: "parkingSpaceArea",
		minWidth: 110,
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.parkingSpaceStatus")),
		),
		prop: "parkingSpaceStatus",
		minWidth: 120,
		cellRenderer: ({ row }) => translateOptionLabel(row.parkingSpaceStatus, parkingSpaceStatusLabelKeyMap),
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.ownerName")),
		),
		prop: "ownerName",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.contactPhone")),
		),
		prop: "contactPhone",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.licensePlateNumber")),
		),
		prop: "licensePlateNumber",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.vehicleBrand")),
		),
		prop: "vehicleBrand",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.purchaseTime")),
		),
		prop: "purchaseTime",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.expiryTime")),
		),
		prop: "expiryTime",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.monthlyRent")),
		),
		prop: "monthlyRent",
		minWidth: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.managementFee")),
		),
		prop: "managementFee",
		minWidth: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.parkingSpaceOrientation")),
		),
		prop: "parkingSpaceOrientation",
		minWidth: 120,
		cellRenderer: ({ row }) => translateOptionLabel(row.parkingSpaceOrientation, orientationLabelKeyMap),
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.floorArea")),
		),
		prop: "floorArea",
		minWidth: 120,
		cellRenderer: ({ row }) => translateOptionLabel(row.floorArea, floorAreaLabelKeyMap),
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.hasEvChargingPile")),
		),
		prop: "hasEvChargingPile",
		minWidth: 120,
		cellRenderer: ({ row }) => translateOptionLabel(row.hasEvChargingPile ? "是" : "否", booleanLabelKeyMap),
	},
	{
		headerRenderer: createHeaderRenderer(
			renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.chargingPilePower")),
		),
		prop: "chargingPilePower",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("common.table.operation"))),
		width: 260,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n(
			$t("propertyManage_communityManage.parking-space-structure-diagram.fields.parkingSpaceNumber"),
		),
		prop: "parkingSpaceNumber",
		valueType: "input",
		fieldProps: {
			placeholder: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.placeholders.parkingSpaceNumber"),
			),
		},
	},
	{
		label: renderI18n(
			$t("propertyManage_communityManage.parking-space-structure-diagram.fields.parkingSpaceStatus"),
		),
		prop: "parkingSpaceStatus",
		valueType: "select",
		options: parkingSpaceStatusOptions.value,
		fieldProps: {
			placeholder: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.placeholders.parkingSpaceStatus"),
			),
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

function openDialog({ mode, row }: { mode: Mode; row?: ParkingSpaceStructureDiagramListItem }) {
	setMode(mode);

	const formData: ParkingSpaceStructureDiagramFormVO =
		isAdd.value || !row
			? cloneDeep(defaultForm)
			: cloneDeep({
					...defaultForm,
					parkingSpaceNumber: row.parkingSpaceNumber || "",
					parkingSpaceType: row.parkingSpaceType || "",
					parkingSpaceLocation: row.parkingSpaceLocation || "",
					parkingSpaceArea: row.parkingSpaceArea || "",
					parkingSpaceStatus: row.parkingSpaceStatus || "",
					ownerName: row.ownerName || "",
					contactPhone: row.contactPhone || "",
					licensePlateNumber: row.licensePlateNumber || "",
					vehicleBrand: row.vehicleBrand || "",
					purchaseTime: row.purchaseTime || "",
					expiryTime: row.expiryTime || "",
					monthlyRent: row.monthlyRent || 0,
					managementFee: row.managementFee || 0,
					parkingSpaceOrientation: row.parkingSpaceOrientation || "",
					floorArea: row.floorArea || "",
					hasEvChargingPile: row.hasEvChargingPile ? "是" : "否",
					chargingPilePower: row.chargingPilePower || "",
					remark: row.remark || "",
				});

	const props: ParkingSpaceStructureDiagramFormProps = {
		form: formData,
		defaultValues: formData,
		mode,
	};

	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.dialogs.addTitle"))
				: renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.dialogs.editTitle")),
		props,
		contentRenderer: () =>
			h(ParkingSpaceStructureDiagramForm, {
				ref: parkingSpaceStructureDiagramFormInstance,
				...props,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = parkingSpaceStructureDiagramFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => renderI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = parkingSpaceStructureDiagramFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => renderI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					parkingSpaceStructureDiagramFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => renderI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await parkingSpaceStructureDiagramFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						await doFetch();
					}
				},
			},
		],
	});
}

function gotoParkingSpaceDetailPage(row: ParkingSpaceStructureDiagramListItem) {
	gotoDetailPage({
		name: "property-manage-community-manage--detail-page",
		params: {
			id: row.id,
		},
	});
}

function exportParkingSpaceStructure() {
	console.log("export parking structure");
}

function refreshParkingSpaceStatus() {
	console.log("refresh parking status");
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
				<ElButton type="info" @click="refreshParkingSpaceStatus">
					{{ transformI18n($t("propertyManage_communityManage.parking-space-structure-diagram.buttons.refreshStatus")) }}
				</ElButton>
				<ElButton type="warning" @click="exportParkingSpaceStructure">
					{{ transformI18n($t("propertyManage_communityManage.parking-space-structure-diagram.buttons.exportStructure")) }}
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
						<ElButton type="info" @click="gotoParkingSpaceDetailPage(row)">
							{{ transformI18n($t("propertyManage_communityManage.parking-space-structure-diagram.buttons.viewDetail")) }}
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
	padding: 0;
}
</style>
