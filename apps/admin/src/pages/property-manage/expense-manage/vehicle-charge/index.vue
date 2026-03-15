<script lang="ts" setup>
definePage({
	meta: {
		// 车辆收费
		title: "property-manage_expense-manage.vehicle-charge.pageTitle",
		icon: "mdi:car-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.vehicleCharge"),
	},
});

import { ref, onMounted, h } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { cloneDeep } from "@pureadmin/utils";
import { useMode, type Mode } from "@/composables/use-mode";
import { type VehicleChargeFormProps, defaultForm } from "./components/form";
import VehicleChargeForm from "./components/form.vue";
import { useVehicleChargeListQuery } from "@/api/property-manage/expense-manage/vehicle-charge";
import type { VehicleChargeListItem, VehicleChargeQueryParams, VehicleChargeFormVO } from "@01s-11comm/type";
import { parkingSpaceStatusOptions } from "@01s-11comm/type";
import { useToggle } from "@vueuse/core";
import { consola } from "consola";
import { defaultAddDialogParams } from "@/config/constant";
import { addDialog, closeDialog } from "@/components/ReDialog";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<VehicleChargeQueryParams> = {
	parkingLotSpace: "",
	licensePlateNumber: "",
	ownerName: "",
	parkingSpaceStatus: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_expense-manage.vehicle-charge.search.parkingLotSpace")),
		prop: "parkingLotSpace",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.vehicle-charge.search.licensePlateNumber")),
		prop: "licensePlateNumber",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.vehicle-charge.search.ownerName")),
		prop: "ownerName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.vehicle-charge.search.parkingSpaceStatus")),
		prop: "parkingSpaceStatus",
		valueType: "select",
		options: parkingSpaceStatusOptions,
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = searchProps(plusSearchDefaultValues);

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
} = useVehicleChargeListQuery(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
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
			transformI18n($t("property-manage_expense-manage.vehicle-charge.fields.name")),
		),
		prop: "name",
		width: 200,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.vehicle-charge.fields.status")),
		),
		prop: "status",
		width: 200,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.vehicle-charge.fields.createTime")),
		),
		prop: "createTime",
		width: 200,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_expense-manage.vehicle-charge.tableTitle")),
	columns: columns.value,
}));

/** 弹框相关功能 */
const VehicleChargeFormInstance = ref<InstanceType<typeof VehicleChargeForm> | null>(null);
/** 模式控制 */
const { mode, setMode, isAdd, isEdit } = useMode();

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
function openDialog(params: { mode: Mode; row?: VehicleChargeListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const vehicleChargeFormVO: VehicleChargeFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					licensePlateNumber: row?.name || "",
					ownerName: "",
					parkingSpaceStatus: "已出售",
					chargeAmount: "",
					chargeTime: "2025-01-01",
					chargeMethod: "",
					remark: "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: VehicleChargeFormProps = {
		form: vehicleChargeFormVO,
		defaultValues: vehicleChargeFormVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () => {
			if (isAdd.value) {
				return transformI18n($t("property-manage_expense-manage.vehicle-charge.dialogs.addTitle"));
			}
			return transformI18n($t("property-manage_expense-manage.vehicle-charge.dialogs.editTitle"));
		},
		props: formProps,
		contentRenderer: () =>
			h(VehicleChargeForm, {
				ref: VehicleChargeFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = VehicleChargeFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = VehicleChargeFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					VehicleChargeFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await VehicleChargeFormInstance.value?.plusFormInstance?.handleSubmit();
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

onMounted(async () => {
	// TanStack Query will auto-fetch on mount
});
</script>

<template>
	<section :key="locale" class="index-root">
		<!-- 表格搜索栏组件 -->
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
							{{ transformI18n($t("property-manage_expense-manage.vehicle-charge.viewFee")) }}
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
}
</style>
