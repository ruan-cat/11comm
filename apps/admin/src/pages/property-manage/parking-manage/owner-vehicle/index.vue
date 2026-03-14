<script lang="ts" setup>
definePage({
	meta: {
		// 业主车辆
		title: "property-manage_parking-manage.owner-vehicle.pageTitle",
		icon: "mdi:car",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.parkingManage.ownerVehicle"),
	},
});

import { ref, h } from "vue";
import consola from "consola";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { defaultAddDialogParams } from "@/config/constant";
import { cloneDeep } from "@pureadmin/utils";

import { useOwnerVehicleListQuery } from "@/api/property-manage/parking-manage/owner-vehicle";
import { useMode, type Mode } from "@/composables/use-mode";
import { parkingSpaceStatusOptions } from "@01s-11comm/type";
import type { OwnerVehicleListItem, OwnerVehicleQueryParams } from "@01s-11comm/type";
import { type OwnerVehicleFormProps, defaultForm } from "./components/form";
import OwnerVehicleForm from "./components/form.vue";

const { locale, withLocale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

/** 模式控制 */
const { modeText, setMode, isAdd } = useMode();

/** 表单组件实例 */
const ownerVehicleFormInstance = ref<InstanceType<typeof OwnerVehicleForm> | null>(null);

const translatedParkingSpaceStatusOptions = withLocale(() =>
	parkingSpaceStatusOptions.map((option) => ({
		...option,
		label: transformI18n($t(`property-manage_parking-manage.owner-vehicle.options.parkingSpaceStatus.${option.value}`)),
	})),
);

/** 模拟异步操作函数 */
const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

// 1. 表格搜索栏配置
/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<OwnerVehicleQueryParams> = {
	licensePlate: "",
	parkingSpaceNumber: "",
	parkingSpaceStatus: "",
	ownerName: "",
	contactInfo: "",
	memberPlateNumber: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用 TanStack Query 获取数据 */
const {
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useOwnerVehicleListQuery(plusSearchDefaultValues);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	/** 车牌号 */
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.search.licensePlate")),
		prop: "licensePlate",
		valueType: "input",
	},
	/** 车位编号 */
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.search.parkingSpaceNumber")),
		prop: "parkingSpaceNumber",
		valueType: "input",
	},
	/** 车位状态 */
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.search.parkingSpaceStatus")),
		prop: "parkingSpaceStatus",
		valueType: "select",
		options: translatedParkingSpaceStatusOptions.value,
	},
	/** 业主名称 */
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.search.ownerName")),
		prop: "ownerName",
		valueType: "input",
	},
	/** 联系方式 */
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.search.contactInfo")),
		prop: "contactInfo",
		valueType: "input",
	},
	/** 成员车牌号 */
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.search.memberPlateNumber")),
		prop: "memberPlateNumber",
		valueType: "input",
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/** 表格列配置 */
const columns = withLocale<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.owner-vehicle.fields.licensePlate")),
		),
		prop: "licensePlate",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.owner-vehicle.fields.memberVehicle")),
		),
		prop: "memberVehicle",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.owner-vehicle.fields.houseNumber")),
		),
		prop: "houseNumber",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.owner-vehicle.fields.licensePlateType")),
		),
		prop: "licensePlateType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.owner-vehicle.fields.vehicleType")),
		),
		prop: "vehicleType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.owner-vehicle.fields.color")),
		),
		prop: "color",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.owner-vehicle.fields.owner")),
		),
		prop: "owner",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.owner-vehicle.fields.parkingSpace")),
		),
		prop: "parkingSpace",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.owner-vehicle.fields.validityPeriod")),
		),
		prop: "validityPeriod",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.owner-vehicle.fields.status")),
		),
		prop: "status",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.owner-vehicle.fields.remark")),
		),
		prop: "remark",
		width: 120,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_parking-manage.owner-vehicle.tableTitle")),
	columns: columns.value,
}));

/** 打开弹框 */
function openDialog({ mode, row }: { mode: Mode; row?: OwnerVehicleListItem }) {
	setMode(mode);

	/** 业务对象 */
	const ownerVehicleFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				...row,
			});

	/** 表单组件需要的props */
	const formProps: OwnerVehicleFormProps = {
		form: ownerVehicleFormVO,
		defaultValues: ownerVehicleFormVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_parking-manage.owner-vehicle.dialogs.addTitle"))
				: transformI18n($t("property-manage_parking-manage.owner-vehicle.dialogs.editTitle")),
		props: formProps,

		contentRenderer: () =>
			h(OwnerVehicleForm, {
				ref: ownerVehicleFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = ownerVehicleFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = ownerVehicleFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					ownerVehicleFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await ownerVehicleFormInstance.value?.plusFormInstance?.handleSubmit();
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
</script>

<template>
	<section :key="locale" class="index-root">
		<PlusSearch
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
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
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
