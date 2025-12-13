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

/** 表单组件实例 */
const parkingSpaceStructureDiagramFormInstance = ref<InstanceType<typeof ParkingSpaceStructureDiagramForm> | null>(null);

/** 表格数据 */
const tableData = ref<车位结构图_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "车位编号",
		prop: "车位编号",
		width: 120,
	},
	{
		label: "车位类型",
		prop: "车位类型",
		width: 100,
	},
	{
		label: "车位位置",
		prop: "车位位置",
		width: 150,
	},
	{
		label: "车位面积",
		prop: "车位面积",
		width: 100,
	},
	{
		label: "车位状态",
		prop: "车位状态",
		width: 100,
	},
	{
		label: "业主姓名",
		prop: "业主姓名",
		width: 100,
	},
	{
		label: "联系电话",
		prop: "联系电话",
		width: 120,
	},
	{
		label: "车牌号码",
		prop: "车牌号码",
		width: 120,
	},
	{
		label: "车辆品牌",
		prop: "车辆品牌",
		width: 120,
	},
	{
		label: "购买时间",
		prop: "购买时间",
		width: 120,
	},
	{
		label: "到期时间",
		prop: "到期时间",
		width: 120,
	},
	{
		label: "月租金",
		prop: "月租金",
		width: 100,
	},
	{
		label: "管理费",
		prop: "管理费",
		width: 100,
	},
	{
		label: "车位朝向",
		prop: "车位朝向",
		width: 100,
	},
	{
		label: "楼层区域",
		prop: "楼层区域",
		width: 100,
	},
	{
		label: "是否充电桩",
		prop: "是否充电桩",
		width: 120,
	},
	{
		label: "充电桩功率",
		prop: "充电桩功率",
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
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: 0,
});

/** 处理页数变化 */
async function handlePageSizeChange(pageSize: number) {
	pagination.value.pageSize = pageSize;
	await loadTableData();
}
/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
	await loadTableData();
}

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "车位结构图",
	columns: columns.value,
});

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.车位编号) {
			filteredData = filteredData.filter((item) => item.车位编号.includes(plusSearchModel.value.车位编号!));
		}
		if (plusSearchModel.value.车位类型) {
			filteredData = filteredData.filter((item) => item.车位类型 === plusSearchModel.value.车位类型);
		}
		if (plusSearchModel.value.车位位置) {
			filteredData = filteredData.filter((item) => item.车位位置.includes(plusSearchModel.value.车位位置!));
		}
		if (plusSearchModel.value.车位状态) {
			filteredData = filteredData.filter((item) => item.车位状态 === plusSearchModel.value.车位状态);
		}
		if (plusSearchModel.value.业主姓名) {
			filteredData = filteredData.filter((item) => item.业主姓名.includes(plusSearchModel.value.业主姓名!));
		}
		if (plusSearchModel.value.车牌号码) {
			filteredData = filteredData.filter((item) => item.车牌号码.includes(plusSearchModel.value.车牌号码!));
		}
		if (plusSearchModel.value.楼层区域) {
			filteredData = filteredData.filter((item) => item.楼层区域 === plusSearchModel.value.楼层区域);
		}
		if (plusSearchModel.value.是否充电桩) {
			filteredData = filteredData.filter((item) => item.是否充电桩 === plusSearchModel.value.是否充电桩);
		}
		if (plusSearchModel.value.购买开始时间 && plusSearchModel.value.购买结束时间) {
			filteredData = filteredData.filter((item) => {
				const buyTime = new Date(item.购买时间).getTime();
				const startTime = new Date(plusSearchModel.value.购买开始时间!).getTime();
				const endTime = new Date(plusSearchModel.value.购买结束时间!).getTime();
				return buyTime >= startTime && buyTime <= endTime;
			});
		}

		/** 更新总数 */
		pagination.value.total = filteredData.length;

		/** 分页处理 */
		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;
		tableData.value = filteredData.slice(startIndex, endIndex);

		/** 更新表格配置 */
		pureTableProps.value.data = tableData.value;
	} catch (error) {
		console.error("加载数据失败:", error);
		/** TODO: 显示错误提示 */
	}
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 车位结构图_列表查询_VO = {
	车位编号: "",
	车位类型: "",
	车位位置: "",
	车位状态: "",
	业主姓名: "",
	车牌号码: "",
	楼层区域: "",
	是否充电桩: "",
	购买开始时间: "",
	购买结束时间: "",
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
		prop: "车位编号",
		valueType: "input",
	},

	/** 车位类型 */
	{
		label: "车位类型",
		prop: "车位类型",
		valueType: "select",
		options: 车位类型选项,
	},

	/** 车位位置 */
	{
		label: "车位位置",
		prop: "车位位置",
		valueType: "input",
	},

	/** 车位状态 */
	{
		label: "车位状态",
		prop: "车位状态",
		valueType: "select",
		options: 车位状态选项,
	},

	/** 业主姓名 */
	{
		label: "业主姓名",
		prop: "业主姓名",
		valueType: "input",
	},

	/** 车牌号码 */
	{
		label: "车牌号码",
		prop: "车牌号码",
		valueType: "input",
	},

	/** 楼层区域 */
	{
		label: "楼层区域",
		prop: "楼层区域",
		valueType: "select",
		options: 楼层区域选项,
	},

	/** 是否充电桩 */
	{
		label: "是否充电桩",
		prop: "是否充电桩",
		valueType: "select",
		options: 是否充电桩选项,
	},

	/** 购买时间范围 */
	{
		label: "购买时间范围",
		prop: "购买开始时间",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
			onChange(value: string[] | null) {
				plusSearchModel.value.购买开始时间 = value?.[0] ?? "";
				plusSearchModel.value.购买结束时间 = value?.[1] ?? "";
			},
			onClear() {
				plusSearchModel.value.购买开始时间 = "";
				plusSearchModel.value.购买结束时间 = "";
			},
		},
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
async function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 执行搜索 */
async function handleSearch() {
	pagination.value.currentPage = 1;
	await loadTableData();
}

const { gotoDetailPage } = useGotoDetailsPage();

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 车位结构图_列表数据;
}

const { modeText, setMode, isAdd, isEdit } = useMode();

/** 测试异步函数 */
const [isLoadingT, setIsLoadingT] = useToggle(false);

/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}车位结构图`;

	/** 业务对象 */
	const 车位结构图表单_VO: 车位结构图表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? {
					...defaultForm,
					车位编号: row?.车位编号 || "",
					车位类型: row?.车位类型 || "",
					车位位置: row?.车位位置 || "",
					车位面积: row?.车位面积 || "",
					车位状态: row?.车位状态 || "",
					业主姓名: row?.业主姓名 || "",
					联系电话: row?.联系电话 || "",
					车牌号码: row?.车牌号码 || "",
					车辆品牌: row?.车辆品牌 || "",
					购买时间: row?.购买时间 || "",
					到期时间: row?.到期时间 || "",
					月租金: row?.月租金 || "",
					管理费: row?.管理费 || "",
					车位朝向: row?.车位朝向 || "",
					楼层区域: row?.楼层区域 || "",
					是否充电桩: row?.是否充电桩 || "",
					充电桩功率: row?.充电桩功率 || "",
					备注信息: row?.备注信息 || "",
				}
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const props: ParkingSpaceStructureDiagramFormProps = {
		form: 车位结构图表单_VO,
		defaultValues: 车位结构图表单_VO,
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
					}
				},
			},
		],
	});
}

/** 跳转到 车位详情页面 */
function gotoParkingSpaceDetailPage(row: 车位结构图_列表数据) {
	console.log("row", row);
	gotoDetailPage({
		name: "property-manage-community-manage--detail-page",
		params: {
			id: row.车位编号,
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
	await loadTableData();
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