<script lang="ts" setup>
definePage({
	meta: {
		title: "车位申请",
		icon: "mdi:clipboard-text-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.parkingManage.carportApply"),
	},
});

import { ref, computed, h } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { useMode, type Mode } from "@/composables/use-mode";
import { transformI18n } from "@/plugins/i18n";
import { useCarportApplyListQuery } from "@/api/property-manage/parking-manage/carport-apply";
import { type CarportApplyFormProps, defaultForm } from "./components/form";
import CarportApplyForm from "./components/form.vue";
import type { CarportApplyListItem, CarportApplyQueryParams } from "@01s-11comm/type";
import { carBrandOptions, parkingSpaceStatusOptions } from "@01s-11comm/type";

/** 表单组件实例 */
const carportApplyFormInstance = ref<InstanceType<typeof CarportApplyForm> | null>(null);

// 1. 表格搜索栏配置
/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<CarportApplyQueryParams> = {
	licensePlate: "",
	carBrand: "",
	phoneNumber: "",
	reviewResult: "",
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
} = useCarportApplyListQuery(plusSearchDefaultValues);

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
	// 车牌号
	{
		label: "车牌号",
		prop: "licensePlate",
		valueType: "input",
	},

	// 汽车品牌
	{
		label: "汽车品牌",
		prop: "carBrand",
		valueType: "select",
		options: carBrandOptions,
	},

	// 手机号
	{
		label: "手机号",
		prop: "phoneNumber",
		valueType: "input",
	},

	// 审核结果
	{
		label: "审核结果",
		prop: "reviewResult",
		valueType: "select",
		options: parkingSpaceStatusOptions,
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
		label: "申请ID",
		prop: "applicationId",
		width: 120,
	},
	{
		label: "车牌号",
		prop: "licensePlate",
		width: 120,
	},
	{
		label: "停车位",
		prop: "parkingSpace",
		width: 120,
	},
	{
		label: "汽车品牌",
		prop: "carBrand",
		width: 120,
	},
	{
		label: "车辆类型",
		prop: "vehicleType",
		width: 120,
	},
	{
		label: "颜色",
		prop: "color",
		width: 120,
	},
	{
		label: "起租时间",
		prop: "startLeaseTime",
		width: 120,
	},
	{
		label: "结租时间",
		prop: "endLeaseTime",
		width: 120,
	},
	{
		label: "申请人",
		prop: "applicant",
		width: 120,
	},
	{
		label: "手机号",
		prop: "phoneNumber",
		width: 120,
	},
	{
		label: "审核结果",
		prop: "reviewResult",
		width: 120,
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
	title: "车位申请",
	columns: columns.value,
});

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: CarportApplyListItem;
}

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

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}车位申请`;

	/** 业务对象 */
	const carportApplyFormVO = isAdd.value
		? structuredClone(defaultForm)
		: structuredClone({
				...defaultForm,
				...row,
			});

	/** 表单组件需要的props */
	const formProps: CarportApplyFormProps = {
		form: carportApplyFormVO,
		defaultValues: carportApplyFormVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
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
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = carportApplyFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					carportApplyFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
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
