<script lang="ts" setup>
definePage({
	meta: {
		// 房屋管理
		title: "property-manage_house-property-manage.house.pageTitle",
		icon: "mdi:home-city",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.house"),
	},
});

import { ref, h } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { cloneDeep } from "@pureadmin/utils";
import { useMode, type Mode } from "@/composables/use-mode";
import type { HouseManagementFormVO, HouseListItem, HouseQueryParams } from "@01s-11comm/type";
import { buildingUnitOptions, houseTypeOptions, houseStatusOptions } from "@01s-11comm/type";
import { type HouseManageFormProps, defaultForm } from "./components/form";
import HouseManageForm from "./components/form.vue";
import { useHouseListQuery } from "@/api/property-manage/house-property-manage/house";

const { locale, withLocale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const houseManageFormInstance = ref<InstanceType<typeof HouseManageForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<HouseQueryParams> = {
	houseCode: "",
	houseStatus: undefined,
	houseType: undefined,
	buildingUnit: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useHouseListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = withLocale<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.house.fields.houseCode")),
		),
		prop: "houseCode",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_house-property-manage.house.fields.floor"))),
		prop: "floor",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_house-property-manage.house.fields.owner"))),
		prop: "owner",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.house.fields.houseType")),
		),
		prop: "houseType",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.house.fields.houseArea")),
		),
		prop: "houseArea",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_house-property-manage.house.fields.rent"))),
		prop: "rent",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.house.fields.houseStatus")),
		),
		prop: "houseStatus",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.house.fields.validUntil")),
		),
		prop: "validUntil",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.house.fields.ownerMembers")),
		),
		prop: "ownerMembers",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.house.fields.ownerVehicles")),
		),
		prop: "ownerVehicles",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.house.fields.ownerHouses")),
		),
		prop: "ownerHouses",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.house.fields.complaints")),
		),
		prop: "complaints",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.house.fields.repairs")),
		),
		prop: "repairs",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.house.fields.houseArrears")),
		),
		prop: "houseArrears",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.house.fields.ownerArrears")),
		),
		prop: "ownerArrears",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.house.fields.houseContract")),
		),
		prop: "houseContract",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_house-property-manage.house.tableTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_house-property-manage.house.search.houseCode")),
		prop: "houseCode",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.house.search.houseStatus")),
		prop: "houseStatus",
		valueType: "select",
		options: houseStatusOptions,
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.house.search.houseType")),
		prop: "houseType",
		valueType: "select",
		options: houseTypeOptions,
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.house.search.buildingUnit")),
		prop: "buildingUnit",
		valueType: "select",
		options: buildingUnitOptions,
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

const { modeText, setMode, isAdd } = useMode();

const [isFetchingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: HouseListItem }) {
	const { mode, row } = params;
	setMode(mode);

	const formData: HouseManagementFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				house: row?.houseCode || "",
				floor: String(row?.floor ?? ""),
				owner: row?.owner || "",
				type: row?.houseType || "",
				houseArea: row?.houseArea || "",
				rent: row?.rent || "",
				houseStatus: row?.houseStatus || "",
				validUntil: row?.validUntil || "",
			});

	const props: HouseManageFormProps = {
		form: formData,
		defaultValues: formData,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_house-property-manage.house.dialogs.addTitle"))
				: transformI18n($t("property-manage_house-property-manage.house.dialogs.editTitle")),
		props,

		contentRenderer: () =>
			h(HouseManageForm, {
				ref: houseManageFormInstance,
				...props,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = houseManageFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// console.log(options, index, button);
					const formComputed = houseManageFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					houseManageFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await houseManageFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true; //加载
						await testAsync(); //异步函数
						button.btn.loading = false; //不加载
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
