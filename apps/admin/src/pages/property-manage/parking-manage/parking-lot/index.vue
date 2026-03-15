<script lang="ts" setup>
definePage({
	meta: {
		// 停车场管理
		title: "property-manage_parking-manage.parking-lot.pageTitle",
		icon: "mdi:parking",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.parkingManage.parkingLot"),
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

import { useParkingLotListQuery } from "@/api/property-manage/parking-manage/parking-lot";
import { useMode, type Mode } from "@/composables/use-mode";
import type { ParkingLotListItem, ParkingLotQueryParams, ParkingLotFormVO } from "@01s-11comm/type";
import { type ParkingLotFormProps, defaultForm } from "./components/form";
import ParkingLotForm from "./components/form.vue";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const ParkingLotFormInstance = ref<InstanceType<typeof ParkingLotForm> | null>(null);

const { modeText, setMode, isAdd } = useMode();

const translatedParkingLotTypeOptions = computed(() => [
	{
		label: transformI18n($t("property-manage_parking-manage.parking-lot.options.parkingLotType.surface")),
		value: "地面停车场",
	},
	{
		label: transformI18n($t("property-manage_parking-manage.parking-lot.options.parkingLotType.underground")),
		value: "地下停车场",
	},
	{
		label: transformI18n($t("property-manage_parking-manage.parking-lot.options.parkingLotType.multilevel")),
		value: "立体停车场",
	},
	{
		label: transformI18n($t("property-manage_parking-manage.parking-lot.options.parkingLotType.roadside")),
		value: "路边停车位",
	},
]);

const translatedParkingSpaceTypeOptions = computed(() => [
	{
		label: transformI18n($t("property-manage_parking-manage.parking-lot.options.parkingSpaceType.standard")),
		value: "标准车位",
	},
	{
		label: transformI18n($t("property-manage_parking-manage.parking-lot.options.parkingSpaceType.large")),
		value: "大型车位",
	},
	{
		label: transformI18n($t("property-manage_parking-manage.parking-lot.options.parkingSpaceType.accessible")),
		value: "无障碍车位",
	},
	{
		label: transformI18n($t("property-manage_parking-manage.parking-lot.options.parkingSpaceType.charging")),
		value: "充电桩车位",
	},
	{
		label: transformI18n($t("property-manage_parking-manage.parking-lot.options.parkingSpaceType.visitor")),
		value: "访客车位",
	},
]);

const [isFetchingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
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
const plusSearchModelRef: FieldValues & Partial<ParkingLotQueryParams> = {
	parkingLotNumber: "",
	parkingLotType: "underground",
	parkingSpaceType: "standard",
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
} = useParkingLotListQuery(plusSearchDefaultValues);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 停车场编号 */
	{
		label: transformI18n($t("property-manage_parking-manage.parking-lot.search.parkingLotNumber")),
		prop: "parkingLotNumber",
		valueType: "input",
	},
	/** 停车场类型 */
	{
		label: transformI18n($t("property-manage_parking-manage.parking-lot.search.parkingLotType")),
		prop: "parkingLotType",
		valueType: "select",
		options: translatedParkingLotTypeOptions.value,
	},
	/** 车位类型 */
	{
		label: transformI18n($t("property-manage_parking-manage.parking-lot.search.parkingSpaceType")),
		prop: "parkingSpaceType",
		valueType: "select",
		options: translatedParkingSpaceTypeOptions.value,
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
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.parking-lot.fields.parkingLotNumber")),
		),
		prop: "parkingLotNumber",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.parking-lot.fields.parkingLotType")),
		),
		prop: "parkingLotType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.parking-lot.fields.parkingSpaceType")),
		),
		prop: "parkingSpaceType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.parking-lot.fields.externalCode")),
		),
		prop: "externalCode",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_parking-manage.parking-lot.fields.remark"))),
		prop: "remark",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_parking-manage.parking-lot.fields.createTime")),
		),
		prop: "createTime",
		width: 160,
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
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_parking-manage.parking-lot.tableTitle")),
	columns: columns.value,
}));

/** 打开弹框 */
function openDialog({ mode, row }: { mode: Mode; row?: ParkingLotListItem }) {
	setMode(mode);

	/** 业务对象 */
	const parkingLotFormVO: ParkingLotFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				...row,
				parkingLotType: row?.parkingLotType || defaultForm.parkingLotType,
				parkingSpaceType: row?.parkingSpaceType || defaultForm.parkingSpaceType,
			});

	/** 表单组件需要的props */
	const formProps: ParkingLotFormProps = {
		form: parkingLotFormVO,
		defaultValues: parkingLotFormVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_parking-manage.parking-lot.dialogs.addTitle"))
				: transformI18n($t("property-manage_parking-manage.parking-lot.dialogs.editTitle")),
		props: formProps,

		contentRenderer: () =>
			h(ParkingLotForm, {
				ref: ParkingLotFormInstance,
				...formProps,
				mode,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = ParkingLotFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = ParkingLotFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					ParkingLotFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await ParkingLotFormInstance.value?.plusFormInstance?.handleSubmit();
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
