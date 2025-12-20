<script lang="ts" setup>
definePage({
	meta: {
		title: "停车场管理",
		icon: "mdi:parking",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.parkingManage.parkingLot"),
	},
});

import { ref, computed, h } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { transformI18n } from "@/plugins/i18n";
import { useParkingLotListQuery } from "@/api/property-manage/parking-manage/parking-lot";
import { useMode, type Mode } from "@/composables/use-mode";
import type { ParkingLotListItem, ParkingLotQueryParams, ParkingLotFormVO } from "@01s-11comm/type";

import { type ParkingLotFormProps, defaultForm } from "./components/form";
import ParkingLotForm from "./components/form.vue";
const ParkingLotFormInstance = ref<InstanceType<typeof ParkingLotForm> | null>(null);

// 1. 表格搜索栏配置
/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ParkingLotQueryParams> = {
	parkingLotNumber: "",
	parkingLotType: "地下停车场",
	parkingSpaceType: "标准车位",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 停车场编号
	{
		label: "停车场编号",
		prop: "parkingLotNumber",
		valueType: "input",
	},

	// 停车场类型
	{
		label: "停车场类型",
		prop: "parkingLotType",
		valueType: "select",
		options: [
			{ label: "地面停车场", value: "地面停车场" },
			{ label: "地下停车场", value: "地下停车场" },
			{ label: "立体停车场", value: "立体停车场" },
			{ label: "路边停车位", value: "路边停车位" },
		],
	},

	// 车位类型
	{
		label: "车位类型",
		prop: "parkingSpaceType",
		valueType: "select",
		options: [
			{ label: "标准车位", value: "标准车位" },
			{ label: "大型车位", value: "大型车位" },
			{ label: "无障碍车位", value: "无障碍车位" },
			{ label: "充电桩车位", value: "充电桩车位" },
			{ label: "访客车位", value: "访客车位" },
		],
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

// 2. 使用 TanStack Query hooks
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
} = useParkingLotListQuery(plusSearchDefaultValues);

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

// 4. 表格列配置
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "停车场编号",
		prop: "parkingLotNumber",
		width: 120,
	},
	{
		label: "停车场类型",
		prop: "parkingLotType",
		width: 120,
	},
	{
		label: "车位类型",
		prop: "parkingSpaceType",
		width: 120,
	},
	{
		label: "外部编码",
		prop: "externalCode",
		width: 120,
	},
	{
		label: "备注",
		prop: "remark",
		width: 150,
	},
	{
		label: "创建时间",
		prop: "createTime",
		width: 160,
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
	title: "停车场管理",
	columns: columns.value,
});

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
function openDialog({ mode, row }: { mode: Mode; row?: ParkingLotListItem }) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}停车场管理`;

	/** 业务对象 */
	const parkingLotFormVO: ParkingLotFormVO = isAdd.value
		? structuredClone(defaultForm)
		: structuredClone({
				...defaultForm,
				...row,
				parkingLotType: row?.parkingLotType || defaultForm.parkingLotType,
				parkingSpaceType: row?.parkingSpaceType || defaultForm.parkingSpaceType,
			});

	/** 表单组件需要的props */
	const props: ParkingLotFormProps = {
		form: parkingLotFormVO,
		defaultValues: parkingLotFormVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,

		contentRenderer: () =>
			h(ParkingLotForm, {
				ref: ParkingLotFormInstance,
				...props,
				mode,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = ParkingLotFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = ParkingLotFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					ParkingLotFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await ParkingLotFormInstance.value?.plusFormInstance?.handleSubmit();
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
