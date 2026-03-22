<script lang="ts" setup>
definePage({
	meta: {
		// 车位申请
		title: "property-manage_parking-manage.carport-apply.pageTitle",
		icon: "mdi:clipboard-text-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.parkingManage.carportApply"),
	},
});

import { ref, h } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { useMode, type Mode } from "@/composables/use-mode";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useCarportApplyListQuery } from "@/api/property-manage/parking-manage/carport-apply";
import { type CarportApplyFormProps, defaultForm } from "./components/form";
import CarportApplyForm from "./components/form.vue";
import type { CarportApplyListItem, CarportApplyQueryParams } from "@01s-11comm/type";
import { carBrandOptions, parkingSpaceStatusOptions } from "@01s-11comm/type";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

/** 表单组件实例 */
const carportApplyFormInstance = ref<InstanceType<typeof CarportApplyForm> | null>(null);

// 1. 表格搜索栏配置
const plusSearchModelRef: FieldValues & Partial<CarportApplyQueryParams> = {
	licensePlate: "",
	carBrand: "",
	phoneNumber: "",
	reviewResult: "",
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
} = useCarportApplyListQuery(plusSearchDefaultValues);

function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_parking-manage.carport-apply.fields.licensePlate")),
		prop: "licensePlate",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-apply.fields.carBrand")),
		prop: "carBrand",
		valueType: "select",
		options: carBrandOptions,
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-apply.fields.phoneNumber")),
		prop: "phoneNumber",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-apply.fields.reviewResult")),
		prop: "reviewResult",
		valueType: "select",
		options: parkingSpaceStatusOptions,
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
			transformI18n($t("property-manage_parking-manage.carport-apply.fields.applicationId")),
		),
		prop: "applicationId",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.carport-apply.fields.licensePlate")),
		),
		prop: "licensePlate",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.carport-apply.fields.parkingSpace")),
		),
		prop: "parkingSpace",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.carport-apply.fields.carBrand")),
		),
		prop: "carBrand",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.carport-apply.fields.vehicleType")),
		),
		prop: "vehicleType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.carport-apply.fields.color")),
		),
		prop: "color",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.carport-apply.fields.startLeaseTime")),
		),
		prop: "startLeaseTime",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.carport-apply.fields.endLeaseTime")),
		),
		prop: "endLeaseTime",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.carport-apply.fields.applicant")),
		),
		prop: "applicant",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.carport-apply.fields.phoneNumber")),
		),
		prop: "phoneNumber",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.carport-apply.fields.reviewResult")),
		),
		prop: "reviewResult",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_parking-manage.carport-apply.tableTitle")),
	columns: columns.value,
}));

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: CarportApplyListItem;
}

const { mode, modeText, setMode, isAdd } = useMode();

const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	const carportApplyFormVO = isAdd.value
		? structuredClone(defaultForm)
		: structuredClone({
				...defaultForm,
				...row,
			});

	const formProps: CarportApplyFormProps = {
		form: carportApplyFormVO,
		defaultValues: carportApplyFormVO,
	};

	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_parking-manage.carport-apply.dialogs.addTitle"))
				: transformI18n($t("property-manage_parking-manage.carport-apply.dialogs.editTitle")),
		props: formProps,

		contentRenderer: () =>
			h(CarportApplyForm, {
				ref: carportApplyFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = carportApplyFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = carportApplyFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					carportApplyFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await carportApplyFormInstance.value.plusFormInstance.handleSubmit();
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
