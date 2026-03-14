<script lang="ts" setup>
definePage({
	meta: {
		// 场地预约
		title: "property-manage_house-property-manage.reserve-venue.pageTitle",
		icon: "mdi:calendar-check",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.reserveVenue"),
	},
});

import { h, ref } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { venueTypeOptions } from "@01s-11comm/type";
import { reserveVenueStatusOptions } from "@01s-11comm/type";
import type { ReserveVenueListItem, ReserveVenueQueryParams, ReserveVenueFormVO } from "@01s-11comm/type";
import { type ReserveVenueFormProps } from "./components/form";
import { defaultForm } from "./components/form";
import ReserveVenueForm from "./components/form.vue";
import { useReserveVenueListQuery } from "@/api/property-manage/house-property-manage/reserve-venue";

const { locale, withLocale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const reserveVenueFormInstance = ref<InstanceType<typeof ReserveVenueForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ReserveVenueQueryParams> = {
	reserver: "",
	venueType: "",
	reservationStatus: "",
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
} = useReserveVenueListQuery(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue.fields.reserver")),
		prop: "reserver",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue.fields.venueType")),
		prop: "venueType",
		valueType: "select",
		options: venueTypeOptions,
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue.fields.reservationStatus")),
		prop: "reservationStatus",
		valueType: "select",
		options: reserveVenueStatusOptions,
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 表格列配置 */
const columns = withLocale<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.reserve-venue.fields.reserver")),
		),
		prop: "reserver",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.reserve-venue.fields.contactPhone")),
		),
		prop: "contactPhone",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.reserve-venue.fields.reservationTime")),
		),
		prop: "reservationTime",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.reserve-venue.fields.usageTime")),
		),
		prop: "startTime",
		width: 200,
		formatter: (row: ReserveVenueListItem) => `${row.startTime} - ${row.endTime}`,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.reserve-venue.fields.venueType")),
		),
		prop: "venueType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.reserve-venue.fields.reservationStatus")),
		),
		prop: "reservationStatus",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.reserve-venue.fields.numberOfUsers")),
		),
		prop: "numberOfUsers",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.reserve-venue.fields.remark")),
		),
		prop: "remark",
		width: 200,
		showOverflowTooltip: true,
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
	title: transformI18n($t("property-manage_house-property-manage.reserve-venue.tableTitle")),
	columns: columns.value,
}));

const { mode, modeText, setMode, isAdd } = useMode();

const [isFetchingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: ReserveVenueListItem;
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 业务对象 */
	const formData: ReserveVenueFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				reserver: row?.reserver || "",
				contactPhone: row?.contactPhone || "",
				reservationTime: row?.reservationTime || "",
				startTime: row?.startTime || "",
				endTime: row?.endTime || "",
				venueType: row?.venueType || "篮球馆",
				reservationStatus: row?.reservationStatus || "待审核",
				numberOfUsers: row?.numberOfUsers || 1,
				remark: row?.remark || "",
			});

	/** 表单组件需要的props */
	const props: ReserveVenueFormProps = {
		form: formData,
		defaultValues: formData,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_house-property-manage.reserve-venue.dialogs.addTitle"))
				: transformI18n($t("property-manage_house-property-manage.reserve-venue.dialogs.editTitle")),
		props,
		contentRenderer: () =>
			h(ReserveVenueForm, {
				ref: reserveVenueFormInstance,
				...props,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = reserveVenueFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// console.log(options, index, button);
					const formComputed = reserveVenueFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					reserveVenueFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await reserveVenueFormInstance.value?.plusFormInstance?.handleSubmit();
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
