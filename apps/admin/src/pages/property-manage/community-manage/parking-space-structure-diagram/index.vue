<script lang="ts" setup>
definePage({
	meta: {
		title: "车位结构图",
		icon: "mdi:garage",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.communityManage.parkingSpaceStructureDiagram"),
	},
});

import { ref, computed, onMounted } from "vue";
import { h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import { type ParkingSpaceStructureDiagramFormProps, defaultForm, type 车位结构图表单_VO } from "./components/form";
import ParkingSpaceStructureDiagramForm from "./components/form.vue";
import { useParkingSpaceStructureDiagramListQuery } from "@/api/property-manage/community-manage/parking-space-structure-diagram";
import {
	type ParkingSpaceStructureDiagramListItem,
	type ParkingSpaceStructureDiagramQueryParams,
	parkingSpaceTypeOptions,
	parkingSpaceStatusOptions,
	floorAreaOptions,
	isChargingPileOptions,
} from "@01s-11comm/type";

/** 表单组件实例 */
const parkingSpaceStructureDiagramFormInstance = ref<InstanceType<typeof ParkingSpaceStructureDiagramForm> | null>(null);

/** 使用 TanStack Query 获取数据 */
	useParkingSpaceStructureDiagramListQuery();

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "车位编号",
		prop: "parkingSpaceNumber",
		width: 120,
	},
	{
		label: "车位类型",
		prop: "parkingSpaceType",
		width: 100,
	},
	{
		label: "车位位置",
		prop: "parkingSpaceLocation",
		width: 150,
	},
	{
		label: "车位面积",
		prop: "parkingSpaceArea",
		width: 100,
	},
	{
		label: "车位状态",
		prop: "parkingSpaceStatus",
		width: 100,
	},
	{
		label: "业主姓名",
		prop: "ownerName",
		width: 100,
	},
	{
		label: "联系电话",
		prop: "contactPhone",
		width: 120,
	},
	{
		label: "车牌号码",
		prop: "licensePlateNumber",
		width: 120,
	},
	{
		label: "车辆品牌",
		prop: "vehicleBrand",
		width: 120,
	},
	{
		label: "购买时间",
		prop: "purchaseTime",
		width: 120,
	},
	{
		label: "到期时间",
		prop: "expiryTime",
		width: 120,
	},
	{
		label: "月租金",
		prop: "monthlyRent",
		width: 100,
	},
	{
		label: "管理费",
		prop: "managementFee",
		width: 100,
	},
	{
		label: "车位朝向",
		prop: "parkingSpaceOrientation",
		width: 100,
	},
	{
		label: "楼层区域",
		prop: "floorArea",
		width: 100,
	},
	{
		label: "是否充电桩",
		prop: "hasEvChargingPile",
		width: 120,
		formatter: ({ hasEvChargingPile }) => (hasEvChargingPile ? "是" : "否"),
	},
	{
		label: "充电桩功率",
		prop: "chargingPilePower",
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

/** 分页配置 */
const pagination = computed<PaginationProps>(() => ({
	...defaultPagination,
	pageSize: pageSize.value,
	currentPage: pageIndex.value,
	total: total.value,
}));

/** 处理页数变化 */
function handlePageSizeChange(newPageSize: number) {
	pageSize.value = newPageSize;
}

/** 处理页码变化 即后端的 pageIndex */
function handleCurrentPageChange(currentPage: number) {
	pageIndex.value = currentPage;
}

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
	loading: isFetching.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "车位结构图",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ParkingSpaceStructureDiagramQueryParams> = {
	name: "",
	status: "",
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
	/** 车位编号 */
	{
		label: "车位编号",
		prop: "name",
		valueType: "input",
	},

	/** 车位状态 */
	{
		label: "车位状态",
		prop: "status",
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

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	} as Partial<ParkingSpaceStructureDiagramQueryParams>);
}

const { gotoDetailPage } = useGotoDetailsPage();

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: ParkingSpaceStructureDiagramListItem;
}

const { modeText, setMode, isAdd, isEdit } = useMode();

/** 测试异步函数 */
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
	const title = `${modeText.value}车位结构图`;

	/** 业务对象 */
	const formData: 车位结构图表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? {
					...defaultForm,
					parkingSpaceNumber: row?.parkingSpaceNumber || "",
					parkingSpaceType: row?.parkingSpaceType || "",
					parkingSpaceLocation: row?.parkingSpaceLocation || "",
					parkingSpaceArea: row?.parkingSpaceArea || "",
					parkingSpaceStatus: row?.parkingSpaceStatus || "",
					ownerName: row?.ownerName || "",
					contactPhone: row?.contactPhone || "",
					licensePlateNumber: row?.licensePlateNumber || "",
					vehicleBrand: row?.vehicleBrand || "",
					purchaseTime: row?.purchaseTime || "",
					expiryTime: row?.expiryTime || "",
					monthlyRent: row?.monthlyRent || 0,
					managementFee: row?.managementFee || 0,
					parkingSpaceOrientation: row?.parkingSpaceOrientation || "",
					floorArea: row?.floorArea || "",
					hasEvChargingPile: row?.hasEvChargingPile ? "是" : "否",
					chargingPilePower: row?.chargingPilePower || "",
					remark: row?.remark || "",
				}
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const props: ParkingSpaceStructureDiagramFormProps = {
		form: formData,
		defaultValues: formData,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,

		contentRenderer: () =>
			h(ParkingSpaceStructureDiagramForm, {
				ref: parkingSpaceStructureDiagramFormInstance,
				...props,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = parkingSpaceStructureDiagramFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = parkingSpaceStructureDiagramFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options: _options, index: _index } }) => {
					parkingSpaceStructureDiagramFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await parkingSpaceStructureDiagramFormInstance.value?.plusFormInstance?.handleSubmit();
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

/** 跳转到 车位详情页面 */
function gotoParkingSpaceDetailPage(row: ParkingSpaceStructureDiagramListItem) {
	console.log("row", row);
	gotoDetailPage({
		name: "property-manage-community-manage--detail-page",
		params: {
			id: row.id,
		},
	});
}

/** 导出车位结构图 */
function exportParkingSpaceStructure() {
	console.log("导出车位结构图");
	/** TODO: 实现导出功能 */
}

/** 刷新车位状态 */
function refreshParkingSpaceStatus() {
	console.log("刷新车位状态");
	/** TODO: 实现刷新功能 */
}

onMounted(async () => {
	// TanStack Query will auto-fetch on mount
});
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

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("common.buttons.add")) }}
				</ElButton>
				<ElButton type="info" @click="refreshParkingSpaceStatus">
					刷新状态
				</ElButton>
				<ElButton type="warning" @click="exportParkingSpaceStructure">
					导出结构图
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="info" @click="gotoParkingSpaceDetailPage(row)">
							查看详情
						</ElButton>
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
					</template>
				</PureTable>
			</template>
		</PureTableBar>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
	padding: 0;
}
</style>