<script lang="ts" setup>
definePage({
	meta: {
		title: "车位信息",
		icon: "mdi:garage",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.parkingManage.carportInfo"),
	},
});

import { ref, computed, h } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { transformI18n } from "@/plugins/i18n";
import { useCarportInfoListQuery } from "@/api/property-manage/parking-manage/carport-info";
import { type CarportInfoFormProps, defaultForm } from "./components/form";
import CarportInfoForm from "./components/form.vue";
import { useMode, type Mode } from "@/composables/use-mode";
import { parkingSpaceStatusOptions, parkingSpaceTypeOptions, parkingLotOptions } from "@01s-11comm/type";
import type { CarportInfoListItem, CarportInfoQueryParams } from "@01s-11comm/type";

/** 车位信息表单组件实例 */
const carportInfoFormInstance = ref<InstanceType<typeof CarportInfoForm> | null>(null);

// 1. 表格搜索栏配置
/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<CarportInfoQueryParams> = {
	parkingLot: "",
	parkingSpace: "",
	parkingSpaceStatus: "",
	parkingSpaceType: "",
	ownerName: "",
	contactPhone: "",
	vehicleNumber: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

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
} = useCarportInfoListQuery(plusSearchDefaultValues);

// 3. 搜索函数(固定写法)
/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
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
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "停车场",
		prop: "parkingLot",
		valueType: "select",
		options: parkingLotOptions,
	},
	{
		label: "车位编号",
		prop: "parkingSpace",
		valueType: "input",
	},
	{
		label: "车位状态",
		prop: "parkingSpaceStatus",
		valueType: "select",
		options: parkingSpaceStatusOptions,
	},
	{
		label: "车位类型",
		prop: "parkingSpaceType",
		valueType: "select",
		options: parkingSpaceTypeOptions,
	},
	{
		label: "业主姓名",
		prop: "ownerName",
		valueType: "input",
	},
	{
		label: "联系电话",
		prop: "contactPhone",
		valueType: "input",
	},
	{
		label: "车辆号码",
		prop: "vehicleNumber",
		valueType: "input",
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

// 4. 表格列配置
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "停车场",
		prop: "parkingLot",
		width: 120,
	},
	{
		label: "车位",
		prop: "parkingSpace",
		width: 120,
	},
	{
		label: "车位状态",
		prop: "parkingSpaceStatus",
		width: 120,
	},
	{
		label: "车位类型",
		prop: "parkingSpaceType",
		width: 120,
	},
	{
		label: "面积",
		prop: "area",
		width: 120,
	},
	{
		label: "业主姓名",
		prop: "ownerName",
		width: 120,
	},
	{
		label: "联系电话",
		prop: "contactPhone",
		width: 120,
	},
	{
		label: "车辆号码",
		prop: "vehicleNumber",
		width: 120,
	},
	{
		label: "购买日期",
		prop: "purchaseDate",
		width: 120,
	},
	{
		label: "到期日期",
		prop: "expiryDate",
		width: 120,
	},
	{
		label: "月租费用",
		prop: "monthlyRent",
		width: 120,
	},
	{
		label: "备注",
		prop: "remark",
		minWidth: 150,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "车位信息",
	columns: columns.value,
});

/** 模式控制 */
const { mode, modeText, setMode, isAdd } = useMode();

/** 模拟异步操作函数 */
const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 */
function openDialog({ mode, row }: { mode: Mode; row?: CarportInfoListItem }) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}车位信息`;

	/** 业务对象 */
	const carportInfoFormVO = isAdd.value
		? structuredClone(defaultForm)
		: structuredClone({
				...defaultForm,
				...row,
			});

	/** 表单组件需要的props */
	const formProps: CarportInfoFormProps = {
		form: carportInfoFormVO,
		defaultValues: carportInfoFormVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
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
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = carportInfoFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					carportInfoFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
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
	<section class="index-root">
		<PlusSearch
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
