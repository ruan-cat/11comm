<script lang="ts" setup>
definePage({
	meta: {
		// 车位信息
		title: "property-manage_parking-manage.carport-info.pageTitle",
		icon: "mdi:garage",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.parkingManage.carportInfo"),
	},
});

import { ref, h } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useCarportInfoListQuery } from "@/api/property-manage/parking-manage/carport-info";
import { type CarportInfoFormProps, defaultForm } from "./components/form";
import CarportInfoForm from "./components/form.vue";
import { useMode, type Mode } from "@/composables/use-mode";
import { parkingSpaceStatusOptions, parkingSpaceTypeOptions, parkingLotOptions } from "@01s-11comm/type";
import type { CarportInfoListItem, CarportInfoQueryParams } from "@01s-11comm/type";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const carportInfoFormInstance = ref<InstanceType<typeof CarportInfoForm> | null>(null);

const plusSearchModelRef: FieldValues & Partial<CarportInfoQueryParams> = {
	parkingLot: "",
	parkingSpace: "",
	parkingSpaceStatus: "",
	parkingSpaceType: "",
	ownerName: "",
	contactPhone: "",
	vehicleNumber: "",
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
} = useCarportInfoListQuery(plusSearchDefaultValues);

function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_parking-manage.carport-info.fields.parkingLot")),
		prop: "parkingLot",
		valueType: "select",
		options: parkingLotOptions,
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-info.fields.parkingSpace")),
		prop: "parkingSpace",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-info.fields.parkingSpaceStatus")),
		prop: "parkingSpaceStatus",
		valueType: "select",
		options: parkingSpaceStatusOptions,
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-info.fields.parkingSpaceType")),
		prop: "parkingSpaceType",
		valueType: "select",
		options: parkingSpaceTypeOptions,
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-info.fields.ownerName")),
		prop: "ownerName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-info.fields.contactPhone")),
		prop: "contactPhone",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-info.fields.vehicleNumber")),
		prop: "vehicleNumber",
		valueType: "input",
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.carport-info.fields.parkingLot")),
		),
		prop: "parkingLot",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.carport-info.fields.parkingSpace")),
		),
		prop: "parkingSpace",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.carport-info.fields.parkingSpaceStatus")),
		),
		prop: "parkingSpaceStatus",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.carport-info.fields.parkingSpaceType")),
		),
		prop: "parkingSpaceType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_parking-manage.carport-info.fields.area"))),
		prop: "area",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.carport-info.fields.ownerName")),
		),
		prop: "ownerName",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.carport-info.fields.contactPhone")),
		),
		prop: "contactPhone",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.carport-info.fields.vehicleNumber")),
		),
		prop: "vehicleNumber",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.carport-info.fields.purchaseDate")),
		),
		prop: "purchaseDate",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.carport-info.fields.expiryDate")),
		),
		prop: "expiryDate",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.carport-info.fields.monthlyRent")),
		),
		prop: "monthlyRent",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.carport-info.fields.remark")),
		),
		prop: "remark",
		minWidth: 150,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_parking-manage.carport-info.tableTitle")),
	columns: columns.value,
}));

const { mode, modeText, setMode, isAdd } = useMode();

const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

function openDialog({ mode, row }: { mode: Mode; row?: CarportInfoListItem }) {
	setMode(mode);

	const carportInfoFormVO = isAdd.value
		? structuredClone(defaultForm)
		: structuredClone({
				...defaultForm,
				...row,
			});

	const formProps: CarportInfoFormProps = {
		form: carportInfoFormVO,
		defaultValues: carportInfoFormVO,
	};

	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_parking-manage.carport-info.dialogs.addTitle"))
				: transformI18n($t("property-manage_parking-manage.carport-info.dialogs.editTitle")),
		props: formProps,
		contentRenderer: () =>
			h(CarportInfoForm, {
				ref: carportInfoFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = carportInfoFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = carportInfoFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					carportInfoFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await carportInfoFormInstance.value?.plusFormInstance?.handleSubmit();
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
