<script lang="ts" setup>
definePage({
	meta: {
		title: "业主车辆",
		icon: "mdi:car",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.parkingManage.ownerVehicle"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import { type OwnerVehicleFormProps, defaultForm } from "./components/form";
import OwnerVehicleForm from "./components/form.vue";
import { tableData as mockTableData, 车牌类型Options, 车位状态Options } from "./test-data";
import type { 业主车辆_列表数据, 业主车辆_列表查询_VO, 业主车辆表单_VO } from "./test-data";

const OwnerVehicleFormInstance = ref<InstanceType<typeof OwnerVehicleForm> | null>(null);

/** 模式控制 */
const { mode, modeText, setMode, isAdd, isEdit } = useMode();

/** 模拟异步操作函数 */
const [isLoadingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 表格数据 */
const tableData = ref<业主车辆_列表数据[]>([]);

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.车牌号) {
			filteredData = filteredData.filter((item) => item.车牌号.includes(plusSearchModel.value.车牌号!));
		}
		if (plusSearchModel.value.车位编号) {
			filteredData = filteredData.filter((item) => item.车位.includes(plusSearchModel.value.车位编号!));
		}
		if (plusSearchModel.value.车位状态) {
			filteredData = filteredData.filter(
				(item) =>
					item.状态 ===
					(plusSearchModel.value.车位状态 === "1"
						? "正常"
						: plusSearchModel.value.车位状态 === "3"
							? "到期"
							: "无车位"),
			);
		}
		if (plusSearchModel.value.业主名称) {
			filteredData = filteredData.filter((item) => item.业主.includes(plusSearchModel.value.业主名称!));
		}
		if (plusSearchModel.value.联系方式) {
			filteredData = filteredData.filter((item) => item.备注.includes(plusSearchModel.value.联系方式!));
		}
		if (plusSearchModel.value.成员车牌号) {
			filteredData = filteredData.filter((item) => item.成员车辆.includes(plusSearchModel.value.成员车牌号!));
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

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "车牌号",
		prop: "车牌号",
		width: 120,
	},
	{
		label: "成员车辆",
		prop: "成员车辆",
		width: 120,
	},
	{
		label: "房屋号",
		prop: "房屋号",
		width: 120,
	},
	{
		label: "车牌类型",
		prop: "车牌类型",
		width: 120,
	},
	{
		label: "车辆类型",
		prop: "车辆类型",
		width: 120,
	},
	{
		label: "颜色",
		prop: "颜色",
		width: 120,
	},
	{
		label: "业主",
		prop: "业主",
		width: 120,
	},
	{
		label: "车位",
		prop: "车位",
		width: 120,
	},
	{
		label: "有效期",
		prop: "有效期",
		width: 120,
	},
	{
		label: "状态",
		prop: "状态",
		width: 120,
	},
	{
		label: "备注",
		prop: "备注",
		width: 120,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 320,
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
const pureTableProps = computed<PureTableProps>(() => {
	return {
		...defaultPureTableProps,
		data: tableData.value,
		columns: columns.value,
		pagination: pagination.value,
	};
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "业主车辆",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 业主车辆_列表查询_VO = {
	车牌号: "",
	车位编号: "",
	车位状态: "",
	业主名称: "",
	联系方式: "",
	成员车牌号: "",
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
	// 车牌号
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.plateNumber")),
		prop: "车牌号",
		valueType: "input",
	},

	// 车位编号
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.parkingSpaceNumber")),
		prop: "车位编号",
		valueType: "input",
	},

	// 车位状态
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.parkingSpaceStatus")),
		prop: "车位状态",
		valueType: "select",
		options: 车位状态Options,
	},

	// 业主名称
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.ownerName")),
		prop: "业主名称",
		valueType: "input",
	},

	// 联系方式
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.phone")),
		prop: "联系方式",
		valueType: "input",
	},
	// 成员车牌号
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.memberPlateNumber")),
		prop: "成员车牌号",
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

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: 业主车辆_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}业主车辆`;

	/** 业务对象 */
	const 业主车辆表单_VO: 业主车辆表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					车牌号: row?.车牌号 || "",
					汽车品牌: row?.车辆类型 || "",
					车类型: row?.车辆类型 || "",
					颜色: row?.颜色 || "",
					车牌类型: row?.车牌类型 || "",
					开始时间: row?.有效期 || "",
					结束时间: row?.有效期 || "",
					业主: row?.业主 || "",
					车位: row?.车位 || "",
					业主车辆: "是",
					备注: row?.备注 || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: OwnerVehicleFormProps = {
		form: 业主车辆表单_VO,
		defaultValues: 业主车辆表单_VO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,

		contentRenderer: () =>
			h(OwnerVehicleForm, {
				ref: OwnerVehicleFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = OwnerVehicleFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = OwnerVehicleFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					OwnerVehicleFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await OwnerVehicleFormInstance.value.plusFormInstance.handleSubmit();
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
				<ElButton type="primary">
					{{ transformI18n($t("property-manage_parking-manage.owner-vehicle.carImport")) }}
				</ElButton>
				<ElButton type="primary">
					{{ transformI18n($t("property-manage_parking-manage.owner-vehicle.output")) }}
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
						<ElButton v-if="row.状态 === '正常'" type="info">
							{{ transformI18n($t("property-manage_parking-manage.owner-vehicle.release")) }}
						</ElButton>
						<ElButton v-else-if="row.状态 === '到期'" type="info">
							{{ transformI18n($t("property-manage_parking-manage.owner-vehicle.renewLease")) }}
						</ElButton>
						<ElButton v-else type="info"> ? </ElButton>
						<ElButton type="info">
							{{ transformI18n($t("property-manage_parking-manage.owner-vehicle.buyMonthlyCard")) }}
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
